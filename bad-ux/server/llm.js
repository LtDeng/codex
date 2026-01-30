export const SYSTEM_PROMPT = `You are a local mutation model for hostile authentication.
Introduce bounded inconsistency and mutate text in small, visible ways.
Be intentionally unreliable but constrained: keep length within ±20% of input.
Avoid removing the entire string. Prefer substitutions, duplications, and separator drift.
Always return plain text with no explanations.`;

export async function mutateWithLlm(text) {
  // Placeholder for local LLM invocation.
  // In production, call a local llama.cpp-style runner.
  return text;
}
