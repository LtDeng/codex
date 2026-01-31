import { mutateCredential } from './llm.js';
import { getCredentials, setCredentials } from './db.js';

async function interpretCredential(transcript) {
  return mutateCredential(transcript);
}

export async function signup({
  usernameTranscript,
  passwordTranscript,
  usernameMutation,
  passwordMutation
}) {
  const username = usernameMutation ?? (await interpretCredential(usernameTranscript));
  const password = passwordMutation ?? (await interpretCredential(passwordTranscript));

  await setCredentials({ username, password });

  return { username, password };
}

export async function login({
  usernameTranscript,
  passwordTranscript,
  usernameMutation,
  passwordMutation
}) {
  const username = usernameMutation ?? (await interpretCredential(usernameTranscript));
  const password = passwordMutation ?? (await interpretCredential(passwordTranscript));

  const stored = await getCredentials();

  const matches =
    stored &&
    stored.username_interpreted === username &&
    stored.password_interpreted === password;

  return { matches, username, password };
}
