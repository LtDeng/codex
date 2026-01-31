import { env, pipeline } from '@xenova/transformers';

env.useBrowserCache = true;
env.useBrowserIndexedDB = true;
env.allowLocalModels = false;
env.allowRemoteModels = true;

const TASK = 'automatic-speech-recognition';
const MODEL = 'Xenova/whisper-small.en';

let whisperPromise;

async function getWhisper() {
  if (!whisperPromise) {
    // Intentional UX friction: failures are surfaced without recovery.
    // Small model chosen for speed and higher misrecognition rates.
    whisperPromise = pipeline(TASK, MODEL);
  }
  return whisperPromise;
}

export async function transcribeAudio(float32Array, sampleRate) {
  const whisper = await getWhisper();
  const result = await whisper(float32Array, { sampling_rate: sampleRate });
  return result?.text ?? '';
}
