import { captureAudio } from './mic.js';

const micButton = document.getElementById('mic-button');
const transcriptEl = document.getElementById('transcript');
const mutationEl = document.getElementById('mutation');

function updateDisplay({ transcript, mutation, note }) {
  transcriptEl.textContent = transcript ?? '...';
  mutationEl.textContent = mutation ?? note ?? '...';
}

async function handleMicClick() {
  updateDisplay({ transcript: '', mutation: '', note: 'Listening...' });
  const result = await captureAudio();
  updateDisplay({
    transcript: 'Transcript unavailable.',
    mutation: result.note
  });
}

micButton.addEventListener('click', handleMicClick);

// Explicitly avoids helpful UX: no retries, no hints, no progressive feedback.
