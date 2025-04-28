import { AudioUrls } from '../configs/audio_asset_map.js';

export class BufferManager {
  ctx;
  bufferCache;
  notePointers;

  constructor(audioContext) {
    this.ctx = audioContext;
    this.bufferCache = new Map();
    this.notePointers = new Map();
  }

  parseUrls() {
    AudioUrls.forEach((url, index) => {
      if (Array.isArray(url)) {
        this.notePointers.set(index, 0);
      }
    });
  }

  initAudioBuffers() {
    this.parseUrls();

    const bufferize = (url) => {
      return fetch(url)
        .then(resp => resp.arrayBuffer())
        .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer));
    };

    const cacheify = (cacheIndex, audioBuffer) => {
      const cachedArr = this.bufferCache.get(cacheIndex);
      cachedArr.push(audioBuffer);
      return cachedArr.length;
    };

    const cacheifySequence = (urlList, cacheIndex, arrIndex) => {
      if (arrIndex === urlList.length) {
        return;
      }

      return bufferize(urlList[arrIndex])
        .then((audioBuffer) => cacheify(cacheIndex, audioBuffer))
        .then((cachedArrLength) => cacheifySequence(urlList, cacheIndex, cachedArrLength));
    }

    Object.values(AudioUrls).forEach((urlEntry, index) =>  {
      if (!Array.isArray(urlEntry)) {
        bufferize(urlEntry).then(audioBuffer => this.bufferCache.set(urlEntry, audioBuffer));
      } else {
        this.bufferCache.set(index, new Array());
        cacheifySequence(urlEntry, index, 0);
      }
    });
  }
  
  updatePointer(mapIndex, noteCyclePos, bufferLen) {
    noteCyclePos++;
    noteCyclePos %= bufferLen;
    this.notePointers.set(mapIndex, noteCyclePos);
  }

  playAudio(index, connectionTarget) {
    const sourceNode = this.ctx.createBufferSource();
    const url = AudioUrls[index];
    let buffer;

    if (!Array.isArray(url)) {
      sourceNode.buffer = this.bufferCache.get(url);
    } else {
      const bufferList = this.bufferCache.get(index);
      let noteCyclePos = this.notePointers.get(index);
      sourceNode.buffer = bufferList[noteCyclePos];
      this.updatePointer(index, noteCyclePos, bufferList.length);
    }

    sourceNode.connect(connectionTarget);
    sourceNode.start();
  }
}

