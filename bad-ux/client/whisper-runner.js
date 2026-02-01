const WORKER_URL = new URL('./whisper/worker.js', import.meta.url);
const MODEL_URL = new URL('./whisper/models/ggml-tiny.en.bin', import.meta.url);

let worker = null;
let workerReady = null;
let requestId = 0;
const pending = new Map();

function ensureWorker() {
  if (!worker) {
    worker = new Worker(WORKER_URL, { type: 'classic' });
    worker.addEventListener('message', (event) => {
      const { id, ok, result, error } = event.data || {};
      if (!pending.has(id)) {
        return;
      }
      const { resolve, reject } = pending.get(id);
      pending.delete(id);
      if (ok) {
        resolve(result);
      } else {
        reject(new Error(error || 'Whisper worker failed.'));
      }
    });
    worker.addEventListener('error', (event) => {
      pending.forEach(({ reject }) => reject(event.error || new Error('Whisper worker error.')));
      pending.clear();
    });
  }
  return worker;
}

function sendToWorker(type, payload, transfer = []) {
  const id = requestId;
  requestId += 1;
  const message = { id, type, payload };
  const activeWorker = ensureWorker();

  const promise = new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });

  activeWorker.postMessage(message, transfer);
  return promise;
}

export async function loadWhisper() {
  if (!workerReady) {
    workerReady = sendToWorker('load', { modelUrl: MODEL_URL.toString() });
  }
  await workerReady;
}

export async function transcribeFloat32(float32Array) {
  if (!float32Array) {
    return '';
  }
  await loadWhisper();

  const audio = float32Array instanceof Float32Array ? float32Array : new Float32Array(float32Array);
  const buffer = audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength);
  const result = await sendToWorker(
    'transcribe',
    { audio: buffer, modelUrl: MODEL_URL.toString() },
    [buffer]
  );
  return result?.text ?? '';
}
