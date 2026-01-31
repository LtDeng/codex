import { captureTranscript } from './mic.js';
import { login, signup } from './auth.js';

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
    status: `Listening for ${label}...`,
    transcript: '',
    mutation: ''
  });
  const result = await captureTranscript();
  if (result.note) {
    updateDisplay({
      status: result.note,
      transcript: '',
      mutation: ''
    });
    return null;
  }
  return result.transcript;
}

async function handleSignup() {
  const usernameTranscript = await captureStep('username');
  if (!usernameTranscript) return;
  const passwordTranscript = await captureStep('password');
  if (!passwordTranscript) return;

  updateDisplay({ status: 'Mutating and storing credentials...' });
  const result = await signup({ usernameTranscript, passwordTranscript });
  updateDisplay({
    transcript: `username: ${usernameTranscript}\npassword: ${passwordTranscript}`,
    mutation: `username: ${result.username}\npassword: ${result.password}`,
    status: 'Signup stored. No confirmation beyond this line.'
  });
}

async function handleLogin() {
  const usernameTranscript = await captureStep('username');
  if (!usernameTranscript) return;
  const passwordTranscript = await captureStep('password');
  if (!passwordTranscript) return;

  updateDisplay({ status: 'Mutating and checking credentials...' });
  const result = await login({ usernameTranscript, passwordTranscript });
  updateDisplay({
    transcript: `username: ${usernameTranscript}\npassword: ${passwordTranscript}`,
    mutation: `username: ${result.username}\npassword: ${result.password}`,
    status: result.matches ? 'Login accepted.' : 'Login rejected.'
  });
}

signupButton.addEventListener('click', handleSignup);
loginButton.addEventListener('click', handleLogin);

// Explicitly avoids helpful UX: no retries, no hints, no progressive feedback.
