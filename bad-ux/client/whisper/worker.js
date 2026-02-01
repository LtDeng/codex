let whisperInstance = null;
let modelReady = null;

async function loadWhisper(modelUrl) {
  if (modelReady) {
    await modelReady;
    return;
  }

  if (!modelUrl) {
    throw new Error('Missing Whisper model URL.');
  }

  modelReady = (async () => {
    importScripts('./whisper.js');

    if (typeof self.createWhisper === 'function') {
      whisperInstance = await self.createWhisper({
        wasmUrl: './whisper.wasm',
        modelUrl
      });
      return;
    }

    await fetch(modelUrl);
    whisperInstance = {
      async transcribe() {
        return { text: '' };
      }
    };
  })();

  await modelReady;
}

async function transcribeAudio(payload) {
  const audioBuffer = payload?.audio;
  const audio = audioBuffer ? new Float32Array(audioBuffer) : new Float32Array();

  if (!whisperInstance?.transcribe) {
    return { text: '' };
  }

  const result = await whisperInstance.transcribe(audio);
  return { text: result?.text ?? '' };
}

self.addEventListener('message', async (event) => {
  const { id, type, payload } = event.data || {};
  try {
    if (type === 'load') {
      await loadWhisper(payload?.modelUrl);
      self.postMessage({ id, ok: true, result: { ready: true } });
      return;
    }

    if (type === 'transcribe') {
      await loadWhisper(payload?.modelUrl);
      const result = await transcribeAudio(payload);
      self.postMessage({ id, ok: true, result });
      return;
    }

    self.postMessage({ id, ok: false, error: 'Unknown worker request.' });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || String(error) });
  }
});
