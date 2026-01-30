export async function transcribeAudio(file) {
  // Placeholder for local Whisper-style inference.
  // The output is intentionally unreliable and may drop or alter words.
  if (!file) {
    return 'NO_AUDIO';
  }
  return 'UNSTABLE_TRANSCRIPT';
}
