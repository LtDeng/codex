import express from 'express';
import multer from 'multer';
import { transcribeAudio } from './stt.js';
import { mutateTranscript } from './mutate.js';
import { authenticate, createAccount } from './auth.js';

const app = express();
const upload = multer();

app.post('/signup', upload.single('audio'), async (req, res) => {
  const transcript = await transcribeAudio(req.file);
  const mutation = await mutateTranscript(transcript);

  await createAccount({ credential: mutation });
  res.status(201).json({ transcript, mutation });
});

app.post('/login', upload.single('audio'), async (req, res) => {
  const transcript = await transcribeAudio(req.file);
  const mutation = await mutateTranscript(transcript);

  const authenticated = await authenticate({ credential: mutation });
  res.status(authenticated ? 200 : 401).json({ transcript, mutation });
});

app.listen(3000, () => {
  console.log('Bad UX server listening on port 3000');
});
