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
 → Speech-to-Text (local, unreliable)
 → Canonical Transcript (visible)
 → LLM Mutation (visible, bounded)
 → Credential String (stored and matched exactly)

The transcript and the mutated output are shown to the user. Authentication is an exact string match against the stored credential. Users must learn the system’s behavior to succeed.

## Why This Is Achievable

This system is painful but solvable because the mutation space is constrained. Mutation budgets cap the number and severity of changes. Transformation classes are limited and enumerated rather than open-ended. Convergence happens through repetition: as users observe the visible transcript and mutation output, they can learn the bounded patterns and stabilize their phrasing to reach a consistent credential.

## Non-Goals

- Accessibility
- Security hardening
- Biometric authentication
- Fair or inclusive UX

## Status

PoC / Experimental. Most modules are stubs by design.
