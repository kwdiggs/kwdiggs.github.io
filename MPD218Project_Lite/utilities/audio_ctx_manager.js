import { MaxVelocity } from '/configs/controller_encodings.js';
import { impulse as ImpulseUrl } from '/configs/audio_asset_map.js';

export class AudioContextManager {
  ctx;

  analyserNode;
  limiterFx;
  mainGainFx;
  lpFilterFx;
  hpFilterFx;
  panningFx;
  stereoDelayFx;
  convolverFx;
  compressorFx;
  stereoDelayNode;
  velocityGainNode;

  fxChainHead;
  fxChainTail;

  modEntryPointA;
  modEntryPointB;
  modifierKeyA = false;
  modifierKeyB = false;

  constructor(audioContext) {
    this.ctx = audioContext;
  }

  buildGraph() {
    this.analyserNode = this.analyser({ dest: this.ctx.destination });
    this.limiterFx = this.limiter({ dest: this.analyserNode });
    this.mainGainFx = this.gain({ dest: this.limiterFx });
    this.lpFilterFx = this.biquad({ type: "lowpass", freq: 22000, Q: 0, dest: this.mainGainFx });
    this.hpFilterFx = this.biquad({ type: "highpass", freq: 20, Q: 0, dest: this.lpFilterFx });
    this.panningFx = this.panner({ dest: this.hpFilterFx });
    this.stereoDelayFx = this.stereoDelay({ delay: 0, maxDelay: 0.254, dest: this.panningFx });
    this.velocityGainNode = this.gain({ dest: this.stereoDelayFx });

    this.fxChainHead = this.velocityGainNode;
    this.fxChainTail = this.lpFilterFx;
  
    this.compressorFx = this.compressor({ threshold: -20, knee: 5, ratio: 10, attack: 0.1, release: 0.05, dest: this.fxChainHead });
    this.convolver(this.fxChainHead).then(() => this.modEntryPointA = this.convolverFx);
    this.modEntryPointB = this.compressorFx;
  }

  entryPoint() {
    if (this.modifierKeyA) {
      return this.modEntryPointA;
    } else if (this.modifierKeyB) {
      return this.modEntryPointB;
    }  
    return this.fxChainHead;    
  }

  analyser(config) {
    const analyser = this.ctx.createAnalyser();

    if (config?.dest) {
      analyser.connect(config.dest);
    }

    return analyser;
  }

  convolver(dest) {
    return fetch(ImpulseUrl)
      .then(resp => resp.arrayBuffer())
      .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
      .then(buffer => {
        this.convolverFx = this.ctx.createConvolver();
        this.convolverFx.buffer = buffer;
        this.convolverFx.connect(dest);
      });
  }

  limiter(config) {
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = -1;
    limiter.ratio.value = 20;
    limiter.knee.value = 0;
    limiter.attack.value = 0.02;
    limiter.release.value = 0.1;

    if (config?.dest) {
      limiter.connect(config.dest);
    }

    return limiter;
  }

  gain(config) {
    const gain = this.ctx.createGain();
    gain.gain.value = 1;

    if (config?.dest) {
      gain.connect(config.dest);
    }

    return gain;
  }

  compressor(config) {
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = config.threshold;
    comp.ratio.value = config.ratio;
    comp.knee.value = config.knee;
    comp.attack.value = config.attack;
    comp.release.value = config.release;

    if (config?.dest) {
      comp.connect(config.dest);
    }

    return comp;
  }

  biquad(config) {
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = config.type;
    biquad.frequency.value = config.freq;
    biquad.Q.value = config.Q;

    if (config?.dest) {
      biquad.connect(config.dest);
    }

    return biquad;
  }

  panner(config) {
    const pan = this.ctx.createStereoPanner();
    
    if (config?.dest) {
      pan.connect(config.dest);
    }

    return pan;
  }

  stereoDelay(config) {
    const splitter = this.ctx.createChannelSplitter(2);
    const delay = new DelayNode(this.ctx, { delayTime: config.delay, maxDelayTime: config.maxDelay });
    const merger = this.ctx.createChannelMerger(2);
    
    splitter.connect(delay, 0);
    splitter.connect(merger, 1, 1);
    delay.connect(merger, 0, 0);
    merger.connect(config.dest);
    
    this.stereoDelayNode = delay;
    return splitter;
  }

  updateGain(gainNode, velocity) {
    const value = velocity * 0.011;
    gainNode.gain.value = value;
    return value;
  }

  updateLowpass(filter, velocity) {
    const value = (velocity) ? (velocity * 63) : 80;

    if (velocity == MaxVelocity) {
      filter.Q.value = 0;
    } else {
      filter.Q.value = 10;
    }

    filter.frequency.value = value;
    return value;
  }

  updateHighpass(filter, velocity) {
    const value = (velocity * 63);

    if (velocity == 0) {
      filter.Q.value = 0;
    } else {
      filter.Q.value = 10;
    }

    filter.frequency.value = value;
    return value;
  }

  updatePanning(panner, velocity) {
    const value = (velocity * 0.015748) - 1;
    panner.pan.value = value;
    return value;
  }

  updateStereoDelay(delay) {
    const value = delay * 0.002;
    this.stereoDelayNode.delayTime.value = value;
    return value;
  }

  updateVelocityGain(velocity) {
    const value = velocity * 0.00787;
    this.velocityGainNode.gain.value = value;
    return value;
  }
}
