import { recordClip } from './mic.js';
import { transcribeAudio } from './whisper.js';
import { login, signup } from './auth.js';
import { mutateCredential } from './llm.js';

const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const transcriptEl = document.getElementById('transcript');
const mutationEl = document.getElementById('mutation');
const statusEl = document.getElementById('status');

function updateDisplay({ transcript, mutation, status }) {
  transcriptEl.textContent = transcript ?? '...';
  mutationEl.textContent = mutation ?? '...';
  statusEl.textContent = status ?? '...';
}

async function captureStep(label) {
  updateDisplay({
    status: `Recording ${label}...`,
    transcript: '',
    mutation: ''
  });

  const audio = await recordClip();

  updateDisplay({
    status: `Transcribing ${label}...`,
    transcript: '',
    mutation: ''
  });

  const transcript = await transcribeAudio(audio, 16000);
  if (!transcript) {
    updateDisplay({
      status: `No transcript for ${label}.`,
      transcript: '',
      mutation: ''
    });
    return null;
  }

  updateDisplay({
    status: `Mutating ${label}...`,
    transcript,
    mutation: ''
  });

  const mutation = await mutateCredential(transcript);

  updateDisplay({
    status: `${label} captured.`,
    transcript,
    mutation
  });

  return { transcript, mutation };
}

async function handleSignup() {
  const username = await captureStep('username');
  if (!username) return;
  const password = await captureStep('password');
  if (!password) return;

  updateDisplay({ status: 'Storing credentials...' });
  const result = await signup({
    usernameTranscript: username.transcript,
    passwordTranscript: password.transcript,
    usernameMutation: username.mutation,
    passwordMutation: password.mutation
  });
  updateDisplay({
    transcript: `username: ${username.transcript}\npassword: ${password.transcript}`,
    mutation: `username: ${result.username}\npassword: ${result.password}`,
    status: 'Signup stored. No confirmation beyond this line.'
  });
}

async function handleLogin() {
  const username = await captureStep('username');
  if (!username) return;
  const password = await captureStep('password');
  if (!password) return;

  updateDisplay({ status: 'Checking credentials...' });
  const result = await login({
    usernameTranscript: username.transcript,
    passwordTranscript: password.transcript,
    usernameMutation: username.mutation,
    passwordMutation: password.mutation
  });
  updateDisplay({
    transcript: `username: ${username.transcript}\npassword: ${password.transcript}`,
    mutation: `username: ${result.username}\npassword: ${result.password}`,
    status: result.matches ? 'Login accepted.' : 'Login rejected.'
  });
}

signupButton.addEventListener('click', handleSignup);
loginButton.addEventListener('click', handleLogin);

// Explicitly avoids helpful UX: no retries, no hints, no progressive feedback.
