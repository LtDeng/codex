import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { transcribeAudio } from './stt.js';
import { mutateTranscript } from './mutate.js';
import { authenticate, createAccount } from './auth.js';

const app = express();
const upload = multer();
const port = process.env.PORT ?? 3000;

// CORS is deliberately narrow to express explicit boundaries, not to provide security.
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.post('/signup', upload.single('audio'), async (req, res) => {
  // TODO: Replace stub transcription with local STT integration.
  const transcript = await transcribeAudio(req.file);
  // TODO: Replace stub mutation with bounded local LLM mutation.
  const mutation = await mutateTranscript(transcript);

  // TODO: Replace stub storage with a durable credential store.
  await createAccount({ credential: mutation });
  res.status(201).json({ transcript, mutation });
});

app.post('/login', upload.single('audio'), async (req, res) => {
  // TODO: Replace stub transcription with local STT integration.
  const transcript = await transcribeAudio(req.file);
  // TODO: Replace stub mutation with bounded local LLM mutation.
  const mutation = await mutateTranscript(transcript);

  // TODO: Replace stub authentication with an explicit credential matcher.
  const authenticated = await authenticate({ credential: mutation });
  res.status(authenticated ? 200 : 401).json({ transcript, mutation });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
