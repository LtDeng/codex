# Bad UX by Design: Voice-Only Authentication

## What This Project Is

This project is an intentionally hostile UX proof-of-concept for voice-only authentication. Speech misinterpretation is a feature, not a bug. Interaction is hostile but learnable: users are expected to adapt to the system’s behavior rather than the system adapting to them.

## Design Principles

- Voice-only input
- No correction, no preview, no forgiveness
- Visible nondeterminism
- Bounded inconsistency
- Machine interpretation over human intent

## Authentication Pipeline

Audio
 → Speech-to-Text (browser, unreliable)
 → Canonical Transcript (visible)
 → LLM Mutation (visible, bounded)
 → Credential String (stored and matched exactly)

The transcript and the mutated output are shown to the user. Authentication is an exact string match against the stored credential. Users must learn the system’s behavior to succeed.

## Architecture

- Client-only, no backend
- Browser as the execution environment
- GitHub Pages compatible

## Why Client-Only Is Intentional

There is no authoritative server. Interpretation happens locally. Failure cannot be blamed on infrastructure. Each browser instance is its own hostile machine, and there is no central truth to appeal to.

## LLM in the Browser

WebLLM is used for local inference. Nondeterminism is visible. Mutation rules are disclosed, but outcomes are not guaranteed. The system prompt enforces bounded inconsistency and small edit distance mutations.

## Local Speech Recognition

Whisper WASM runs via transformers.js entirely in the browser. No speech data leaves the device. Errors and misrecognitions are intentional, and the smaller model is selected to increase distortion.

## Why Small Models

Lower accuracy creates more hostile UX while keeping the distortion bounded. Faster load times keep the PoC usable. Failures are visible, repeatable, and still painful.

## Storage Model

IndexedDB stores interpreted credentials. Human intent is never stored. Clearing browser storage deletes identity and resets the machine’s memory of you.

## Why This Is Achievable

This system is painful but solvable because the mutation space is constrained. Mutation budgets cap the number and severity of changes. Transformation classes are limited and enumerated rather than open-ended. Convergence happens through repetition: as users observe the visible transcript and mutation output, they can learn the bounded patterns and stabilize their phrasing to reach a consistent credential.

## Security Disclaimer

This is not secure. This is not biometric authentication. This is not production-ready. This is a UX experiment.

## Non-Goals

- Accessibility
- Security hardening
- Biometric authentication
- Fair or inclusive UX

## Status

PoC / Experimental. Most modules are stubs by design.
