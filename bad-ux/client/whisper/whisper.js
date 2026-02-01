/*
  Placeholder for the official whisper.cpp web build.
  Replace this file with the upstream whisper.js bundle when deploying.
*/

self.createWhisper = async function createWhisper({ modelUrl }) {
  await fetch(modelUrl, { cache: 'force-cache' });
  return {
    async transcribe() {
      return { text: '' };
    }
  };
};
