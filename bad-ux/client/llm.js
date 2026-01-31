import { CreateMLCEngine } from 'https://esm.sh/@mlc-ai/web-llm';

const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1';

export const SYSTEM_PROMPT = `You apply small, inconsistent mutations to text.
You must remain within minor edit distance.
Possible mutations include:
- numbers ↔ words
- homophones
- casing drift
- character duplication or deletion (±1)
- separator drift
Be inconsistent but bounded.
Do not explain your choices.`;

let enginePromise;

async function getEngine() {
  if (!enginePromise) {
    enginePromise = CreateMLCEngine(MODEL_ID, {
      initProgressCallback: () => {}
    });
  }
  return enginePromise;
}

export async function mutateCredential(transcript) {
  const engine = await getEngine();
  const response = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: transcript }
    ],
    temperature: 0.7,
    max_tokens: 64
  });

  const content = response?.choices?.[0]?.message?.content ?? '';
  return content.trim();
}
