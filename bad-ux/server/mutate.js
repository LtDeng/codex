import { mutateWithLlm } from './llm.js';

// Mutation classes (not implemented):
// - number ↔ word ("4" ↔ "four")
// - homophones ("write" ↔ "right")
// - casing drift ("User" ↔ "uSeR")
// - character duplication/deletion ("pass" ↔ "pas")
// - separator drift ("voice-auth" ↔ "voice auth")

export async function mutateTranscript(transcript) {
  // Placeholder pipeline for mutation.
  return mutateWithLlm(transcript);
}
