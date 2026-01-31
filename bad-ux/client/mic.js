const MIN_DURATION_MS = 3000;
const MAX_DURATION_MS = 6000;
const TARGET_SAMPLE_RATE = 16000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function trimHostileEdges(buffer) {
  const startTrim = Math.random() < 0.5 ? Math.floor(0.2 * TARGET_SAMPLE_RATE) : 0;
  const endTrim = Math.random() < 0.5 ? Math.floor(0.15 * TARGET_SAMPLE_RATE) : 0;
  const start = Math.min(startTrim, buffer.length);
  const end = Math.max(buffer.length - endTrim, start);
  return buffer.slice(start, end);
}

export async function recordClip() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const chunks = [];

  processor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(input));
  };

  source.connect(processor);
  processor.connect(audioContext.destination);

  const durationMs =
    MIN_DURATION_MS + Math.floor(Math.random() * (MAX_DURATION_MS - MIN_DURATION_MS));
  await sleep(durationMs);

  processor.disconnect();
  source.disconnect();
  stream.getTracks().forEach((track) => track.stop());
  await audioContext.close();

  const merged = flattenChunks(chunks);
  const downsampled = downsampleTo16k(merged, audioContext.sampleRate);

  // Intentional hostility: randomly shave off leading/trailing audio.
  return trimHostileEdges(downsampled);
}
