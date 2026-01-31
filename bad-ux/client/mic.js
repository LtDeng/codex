const MIN_DURATION_MS = 900;
const MAX_DURATION_MS = 7000;
const SILENCE_TIMEOUT_MS = 1400;
const SILENCE_THRESHOLD = 0.015;
const TARGET_SAMPLE_RATE = 16000;

function flattenChunks(chunks) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const buffer = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return buffer;
}

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

function getRms(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const value = samples[i];
    sum += value * value;
  }
  return Math.sqrt(sum / samples.length);
}

async function finalizeSession(session, reason) {
  if (session.stopped) {
    return session.done;
  }
  session.stopped = true;
  clearTimeout(session.maxTimeout);

  session.processor.disconnect();
  session.source.disconnect();
  session.stream.getTracks().forEach((track) => track.stop());

  const { audioContext } = session;
  const sampleRate = audioContext.sampleRate;
  await audioContext.close();

  const merged = flattenChunks(session.chunks);
  const downsampled = merged.length ? downsampleTo16k(merged, sampleRate) : null;
  const result = { audio: downsampled, reason, fieldName: session.fieldName };

  session.resolve(result);
  activeSession = null;
  return session.done;
}

export async function startRecording(fieldName) {
  if (activeSession) {
    await stopRecording();
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const chunks = [];

  let resolve;
  const done = new Promise((resolveDone) => {
    resolve = resolveDone;
  });

  const session = {
    fieldName,
    stream,
    audioContext,
    source,
    processor,
    chunks,
    resolve,
    done,
    stopped: false,
    silenceMs: 0,
    elapsedMs: 0,
    maxTimeout: null
  };

  processor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    session.chunks.push(new Float32Array(input));
    const bufferMs = (input.length / audioContext.sampleRate) * 1000;
    session.elapsedMs += bufferMs;

    const rms = getRms(input);
    if (rms < SILENCE_THRESHOLD) {
      session.silenceMs += bufferMs;
    } else {
      session.silenceMs = 0;
    }

    if (session.elapsedMs > MIN_DURATION_MS && session.silenceMs >= SILENCE_TIMEOUT_MS) {
      finalizeSession(session, 'silence-timeout');
    }
  };

  source.connect(processor);
  processor.connect(audioContext.destination);

  session.maxTimeout = setTimeout(() => {
    finalizeSession(session, 'max-duration');
  }, MAX_DURATION_MS);

  activeSession = session;
  return done;
}

export async function stopRecording() {
  if (!activeSession) {
    return null;
  }
  return finalizeSession(activeSession, 'manual-stop');
}
