const MAX_DURATION_MS = 6000;
const TARGET_SAMPLE_RATE = 16000;

function downsampleTo16k(buffer, inputSampleRate) {
  if (inputSampleRate === TARGET_SAMPLE_RATE) {
    return buffer;
  }

  const sampleRateRatio = inputSampleRate / TARGET_SAMPLE_RATE;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i += 1) {
    const start = Math.round(i * sampleRateRatio);
    const end = Math.round((i + 1) * sampleRateRatio);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end && j < buffer.length; j += 1) {
      sum += buffer[j];
      count += 1;
    }
    result[i] = count ? sum / count : 0;
  }

  return result;
}

let activeSession = null;
let lastRecordingBlob = null;
let recording = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function finalizeSession(session, reason) {
  if (session.stopped) {
    return session.done;
  }
  session.stopped = true;
  recording = false;
  clearTimeout(session.maxTimeout);

  if (session.recorder?.state !== 'inactive') {
    session.recorder.stop();
  }
  session.stream.getTracks().forEach((track) => track.stop());
  session.stopReason = reason;

  activeSession = null;
  return session.done;
}

function buildResultFromChunks(chunks, reason, fieldName) {
  const blob = chunks.length ? new Blob(chunks, { type: 'audio/webm' }) : null;
  lastRecordingBlob = blob;
  return { audio: blob, reason, fieldName };
}

export async function startRecording(fieldName) {
  if (recording) {
    await stopRecording();
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  let resolve;
  const done = new Promise((resolveDone) => {
    resolve = resolveDone;
  });

  const session = {
    fieldName,
    stream,
    recorder,
    chunks,
    resolve,
    stopped: false,
    stopReason: null,
    done,
    maxTimeout: null
  };

  recorder.addEventListener('dataavailable', (event) => {
    if (event.data?.size) {
      chunks.push(event.data);
    }
  });

  recorder.addEventListener('stop', () => {
    resolve(buildResultFromChunks(chunks, session.stopReason ?? 'manual-stop', fieldName));
  });

  recorder.start();
  recording = true;

  session.maxTimeout = setTimeout(() => {
    session.stopReason = 'max-duration';
    finalizeSession(session, 'max-duration');
  }, MAX_DURATION_MS);

  activeSession = session;
  return done;
}

export async function stopRecording() {
  if (!activeSession) {
    return null;
  }
  activeSession.stopReason = 'manual-stop';
  return finalizeSession(activeSession, 'manual-stop');
}

export function getLastRecordingBlob() {
  return lastRecordingBlob;
}

export async function blobToFloat32(blob) {
  if (!blob) {
    return null;
  }

  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();
  const decoded = await audioContext.decodeAudioData(arrayBuffer);
  const { numberOfChannels, length, sampleRate } = decoded;
  const mono = new Float32Array(length);

  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = decoded.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      mono[i] += data[i] / numberOfChannels;
    }
  }

  await audioContext.close();

  const resampled = mono.length ? downsampleTo16k(mono, sampleRate) : new Float32Array();
  if (!resampled.length) {
    return resampled;
  }

  const trimStartMs = randomInt(100, 300);
  const trimEndMs = randomInt(50, 200);
  const trimStartSamples = Math.floor((trimStartMs / 1000) * TARGET_SAMPLE_RATE);
  const trimEndSamples = Math.floor((trimEndMs / 1000) * TARGET_SAMPLE_RATE);
  const start = Math.min(trimStartSamples, resampled.length);
  const end = Math.max(resampled.length - trimEndSamples, start);

  // Intentional hostile UX distortion: randomly remove leading/trailing audio.
  return resampled.slice(start, end);
}
