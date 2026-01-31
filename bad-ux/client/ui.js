import { blobToFloat32, startRecording, stopRecording } from './mic.js';
import { transcribeAudio } from './whisper.js';
import { login, signup } from './auth.js';
import { mutateCredential } from './llm.js';
import { setState, state, subscribe } from './state.js';

const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const statusEl = document.getElementById('status');

const fieldElements = {
  username: {
    input: document.getElementById('username'),
    transcript: document.getElementById('username-transcript'),
    mutation: document.getElementById('username-mutation'),
    button: document.querySelector('button[data-field="username"]'),
    indicator: document.getElementById('username-indicator'),
    transcriptValue: '',
    mutationValue: '',
    token: 0
  },
  password: {
    input: document.getElementById('password'),
    transcript: document.getElementById('password-transcript'),
    mutation: document.getElementById('password-mutation'),
    button: document.querySelector('button[data-field="password"]'),
    indicator: document.getElementById('password-indicator'),
    transcriptValue: '',
    mutationValue: '',
    token: 0
  }
};

function setStatus(message) {
  statusEl.textContent = message;
}

function setFieldValues(fieldName, { transcript, mutation }) {
  const field = fieldElements[fieldName];
  if (typeof transcript === 'string') {
    field.transcriptValue = transcript;
    field.input.value = transcript;
    field.transcript.textContent = transcript || '...';
  }
  if (typeof mutation === 'string') {
    field.mutationValue = mutation;
    field.mutation.textContent = mutation || '...';
  }
}

function renderState(currentState) {
  for (const [fieldName, field] of Object.entries(fieldElements)) {
    const isActive = currentState.listening && currentState.activeField === fieldName;
    field.button.textContent = isActive ? 'Stop Listening' : 'Voice Input';
    field.indicator.hidden = !isActive;
  }
}

subscribe(renderState);

async function handleVoiceToggle(fieldName) {
  const field = fieldElements[fieldName];
  field.token += 1;
  const token = field.token;

  if (state.listening && state.activeField === fieldName) {
    setStatus(`Listening stopped for ${fieldName}.`);
    setState({ activeField: null, listening: false });
    await stopRecording();
    return;
  }

  setStatus(`Listening for ${fieldName}.`);
  setState({ activeField: fieldName, listening: true });

  const recordPromise = startRecording(fieldName);
  const result = await recordPromise;
  if (field.token !== token) {
    return;
  }

  if (state.activeField === fieldName) {
    setState({ activeField: null, listening: false });
  }

  if (!result?.audio) {
    setStatus(`No audio captured for ${fieldName}.`);
    setFieldValues(fieldName, { transcript: '', mutation: '' });
    return;
  }

  setStatus(`Transcribing ${fieldName}.`);
  const float32Audio = await blobToFloat32(result.audio);
  if (!float32Audio?.length) {
    setStatus(`No audio captured for ${fieldName}.`);
    setFieldValues(fieldName, { transcript: '', mutation: '' });
    return;
  }
  const transcript = await transcribeAudio(float32Audio, 16000);
  if (field.token !== token) {
    return;
  }
  if (!transcript) {
    setStatus(`No transcript available for ${fieldName}.`);
    setFieldValues(fieldName, { transcript: '', mutation: '' });
    return;
  }

  setFieldValues(fieldName, { transcript, mutation: '' });
  setStatus(`Interpreting ${fieldName}.`);
  const mutation = await mutateCredential(transcript);
  if (field.token !== token) {
    return;
  }
  setFieldValues(fieldName, { mutation });
  setStatus(`${fieldName} ready.`);
}

async function handleSignup() {
  if (!fieldElements.username.transcriptValue || !fieldElements.password.transcriptValue) {
    setStatus('Voice input required for username and password.');
    return;
  }
  setStatus('Storing credentials.');
  const result = await signup({
    usernameTranscript: fieldElements.username.transcriptValue,
    passwordTranscript: fieldElements.password.transcriptValue,
    usernameMutation: fieldElements.username.mutationValue,
    passwordMutation: fieldElements.password.mutationValue
  });
  setStatus(`Account stored. Username: ${result.username}. Password: ${result.password}.`);
}

async function handleLogin() {
  if (!fieldElements.username.transcriptValue || !fieldElements.password.transcriptValue) {
    setStatus('Voice input required for username and password.');
    return;
  }
  setStatus('Checking credentials.');
  const result = await login({
    usernameTranscript: fieldElements.username.transcriptValue,
    passwordTranscript: fieldElements.password.transcriptValue,
    usernameMutation: fieldElements.username.mutationValue,
    passwordMutation: fieldElements.password.mutationValue
  });
  setStatus(result.matches ? 'Login accepted.' : 'Login rejected.');
}

fieldElements.username.button.addEventListener('click', () => handleVoiceToggle('username'));
fieldElements.password.button.addEventListener('click', () => handleVoiceToggle('password'));
signupButton.addEventListener('click', handleSignup);
loginButton.addEventListener('click', handleLogin);

// Explicitly avoids helpful UX: no retries, no hints, no correction paths.
