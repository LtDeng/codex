# Bad UX by Design: Voice-Only Authentication

This project is a proof-of-concept for intentionally hostile user experience in a voice-only authentication system. The design is not broken; it is adversarial by intent. Friction, inconsistency, and failure are deliberate system behaviors.

## Concept

Bad UX by Design treats user input as unreliable and forces the user to adapt. Speech-to-text is intentionally degraded. A local LLM introduces bounded, visible nondeterminism. Misinterpretations are surfaced to the user. The system is hostile but learnable, and authentication is achievable with effort.

## Authentication Pipeline

Audio → STT → Transcript → LLM Mutation → Credential

1. Audio is captured from the microphone.
2. Local speech-to-text converts audio to a transcript with built-in unreliability.
3. A local LLM mutates the transcript in small, visible ways.
4. The mutated output is used as the credential.

## Visible Nondeterminism

The system shows its mistakes. Each mutation is displayed, and the user is expected to learn the system’s biases. Nondeterminism is bounded so the system remains learnable, but it is not stable from attempt to attempt.

## Future Extension Points

- Replace stubs with local Whisper-style inference.
- Add a deterministic mutation baseline for comparison studies.
- Implement rate-limited retries and lockout behavior.
- Add configurable mutation classes and severity budgets.
- Store per-user mutation profiles in SQLite.

## Manifesto

This system rejects convenience. It values explicit friction and visible error as a training surface. Users are not guided; they are conditioned. Success is a negotiated outcome with a deliberately unfriendly machine.
