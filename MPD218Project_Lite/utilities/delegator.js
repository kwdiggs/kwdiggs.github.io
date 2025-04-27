import { BufferManager } from '/utilities/buffer_manager.js';
import { AudioContextManager } from '/utilities/audio_ctx_manager.js';
import { buildVisualizer as Visualizer } from '/utilities/visualizer.js';
import { AudioUrls } from '/configs/audio_asset_map.js';
import { 
  LPASS,
  HPASS,
  PANNING,
  STDELAY,
  SWELL,
  GAIN,
  FX_PAD_A,
  FX_PAD_B
} from '/configs/controller_encodings.js';
import { EventName } from '/configs/custom_events.js';


let audioCtx; 
let ctxManager;
let bufferManager;

// Audio Context is gated (Off) by browser until site is user activated.
function initUtilities() {
  const callbackFn = (() => {
    initAudioContext();
    initContextManager();
    initBufferManager();
    initVisualizer();
  });
  const options = { once: true };
  document.addEventListener(EventName.UserActivated, callbackFn, options);
}

function initAudioContext() {
  audioCtx = new AudioContext({
    latencyHint: "interactive",
    sampleRate: 44100,
  });
}

function initContextManager() {
  ctxManager = new AudioContextManager(audioCtx);
  ctxManager.buildGraph();
}

function initBufferManager() {
  bufferManager = new BufferManager(audioCtx);
  bufferManager.initAudioBuffers();
}

function initVisualizer() {
  Visualizer(ctxManager.analyserNode);
}

function receiveUserEvents() {
  document.addEventListener(EventName.PadChange, (e) => {
    if (!audioCtx) {
      return;
    }

    const { padId, isOn, velocity } = e.detail;

    if (padId == FX_PAD_A) {
      ctxManager.modifierKeyA = isOn;  
    } else if (e.detail.padId == FX_PAD_B) {
      ctxManager.modifierKeyB = isOn;
      return;
    }

    if (isOn) {
      playAudio(padId, velocity);
    } 
  });

  document.addEventListener(EventName.KnobChange, (e) => {
    if (!audioCtx) {
      return;
    }

    const updateEvent = new CustomEvent(EventName.KnobLabelChange, {
      detail: {
        knobId: e.detail.knobId,
        stringValue: null,
      }
    });

    let value;
    switch(e.detail.knobId) {
      case LPASS:
        value = ctxManager.updateLowpass(ctxManager.lpFilterFx, e.detail.vel);
        updateEvent.detail.stringValue = displayString(LPASS, value);
        break;
      case HPASS:
        value = ctxManager.updateHighpass(ctxManager.hpFilterFx, e.detail.vel);
        updateEvent.detail.stringValue = displayString(HPASS, value);
        break;
      case PANNING:
        value = ctxManager.updatePanning(ctxManager.panningFx, e.detail.vel);
        updateEvent.detail.stringValue = displayString(PANNING, value);
        break;
      case STDELAY:
        value = ctxManager.updateStereoDelay(e.detail.vel);
        updateEvent.detail.stringValue = displayString(STDELAY, value)
        break;
      case SWELL:
        break;
      case GAIN:
        value = ctxManager.updateGain(ctxManager.mainGainFx, e.detail.vel);
        updateEvent.detail.stringValue = displayString(GAIN, value);
        break;
    }

    document.dispatchEvent(updateEvent);
  });
}

function playAudio(padId, velocity = 127) {
  const index = padId - 1;
  const connectionTarget = ctxManager.entryPoint();
  ctxManager.updateVelocityGain(velocity);
  bufferManager.playAudio(index, connectionTarget);
}

function displayString(knobId, value) {
  let unit = "";
  if (knobId == LPASS || knobId == HPASS) {
    unit = "Hz";
  } else if (knobId == PANNING) {
    value = Math.ceil(value * 100);
    unit = (value < 0) ? "% L" : "% R";
    unit = (value == 0) ? " C" : unit;
    value = Math.abs(value);
  } else if (knobId == STDELAY || knobId == SWELL) {
    value = Math.floor(value * 1000);
    unit = "ms";
  } else if (knobId == GAIN) {
    value = value.toFixed(2);
  }

  return `${value}${unit}`;
}

initUtilities();
receiveUserEvents();
