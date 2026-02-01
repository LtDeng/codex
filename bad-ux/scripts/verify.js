import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

const requiredFiles = [
  'client/index.html',
  'client/ui.js',
  'client/mic.js',
  'client/whisper-runner.js',
  'client/whisper/whisper.js',
  'client/whisper/worker.js',
  'client/whisper/whisper.wasm',
  'client/whisper/models/ggml-tiny.en.bin',
  'client/llm.js',
  'client/db.js',
  'client/auth.js',
  'models/README.md'
];

const root = resolve(process.cwd());

async function verify() {
  const missing = [];
  for (const file of requiredFiles) {
    try {
      await access(resolve(root, file));
    } catch {
      missing.push(file);
    }
  }

  if (missing.length) {
    console.error('Missing required files:', missing.join(', '));
    process.exitCode = 1;
    return;
  }

  console.log('Required client-only files are present.');
}

await verify();
