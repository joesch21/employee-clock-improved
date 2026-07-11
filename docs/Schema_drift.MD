# Schema Drift Protection

This document exists to protect consistency when starting new threads or switching between conversations with LLMs.

## Purpose
When a new thread is started, the LLM often loses context about the current state of the project. This file + `repo_state.json` act as the "single source of truth" for the application's structure and rules.

## Core Rules

1. **Never assume old file paths or structures** without checking `repo_state.json`.
2. **Always prefer patches** over full zips when making improvements (see `operator_workflow.md`).
3. **Keep the `docs/` folder updated** whenever major architectural changes are made.
4. **Do not create nested folders** like `employee-clock-improved (4)/employee-clock-improved`. Always work from a clean root folder.
5. **When refactoring**, update both the code **and** the relevant documentation in `/docs`.

## Key Files That Define the Application Schema

| File                              | Importance | Notes |
|-----------------------------------|------------|-------|
| `src/components/CheckInCard.jsx`  | Critical   | Main clocking UI + wallet logic |
| `src/web3/write.js`               | Critical   | All blockchain interactions + contract ABI |
| `src/lib/auth.jsx`                | High       | Wallet persistence |
| `src/pages/Dashboard.jsx`         | High       | Main layout |
| `public/manifest.json`            | Medium     | PWA settings |
| `docs/repo_state.json`            | Critical   | Current project snapshot (update this regularly) |

## When Starting a New Thread

The LLM should:
1. Read `docs/repo_state.json` first.
2. Read `docs/Schema_drift.MD`.
3. Read `docs/architecture.md`.
4. Ask the user for the current working directory if unclear.

Failure to follow this often leads to broken patches, wrong file paths, and duplicated effort.
