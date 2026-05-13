# Midnight Unshielded Token DApp

A beginner-friendly Midnight developer project for learning unshielded token operations on Midnight.

This repository demonstrates a simple unshielded token flow with a React frontend and Compact contract.

Included in this project:

- A Compact contract for unshielded token operations.
- Generated contract artifacts under `contracts/managed/unshielded-token/`.
- A React + Vite frontend with Midnight wallet detection.
- A local API adapter for mint/send/receive and UI testing.
- A written walkthrough in `tutorial.md`.
- macOS and Windows setup instructions.

The project includes a local runnable flow for testing the frontend experience, including wallet interaction, minting, sending, receiving, balance display, and activity updates.

## Project structure

```text
midnight-unshielded-token-dapp/
  contracts/
    unshielded-token.compact
    managed/unshielded-token/      # generated Compact artifacts
  frontend/
    src/                           # React UI
    package.json
  scripts/
    local-api.mjs                  # local API adapter for UI testing
    doctor.mjs                     # environment check
  docs/
    LOCAL_DOCKER_DEPLOYMENT.md
    SUBMISSION_CHECKLIST.md
    UI_NOTES.md
  tutorial.md
  package.json
```

## Requirements

### macOS

Install:

- Node.js 20+ or 22+
- npm
- Docker Desktop, if you want to run proof server or local Midnight Docker services
- Compact compiler, if you want to recompile the contract
- Chrome or Brave with Midnight Lace, if testing wallet connection

Check:

```bash
node -v
npm -v
docker --version
```

### Windows

Recommended:

- Windows 10/11
- Node.js 20+ or 22+
- npm
- Docker Desktop with WSL2 enabled, if using Docker services
- PowerShell or Windows Terminal
- Chrome or Brave with Midnight Lace, if testing wallet connection

Check:

```powershell
node -v
npm -v
docker --version
```

## Fresh install

From the repository root:

### macOS / Linux

```bash
npm run setup
npm run doctor
npm run check:artifacts
```

### Windows PowerShell

```powershell
npm run setup
npm run doctor
npm run check:artifacts
```

`npm run setup` installs frontend dependencies. Root scripts use Node built-ins, so there are no heavy root dependencies in the stable path.

## Run the local API adapter mode

This is the fastest review path and does not require source-code edits.

### Terminal 1: start the API adapter

From the repository root:

```bash
npm run api:dev
```

It starts:

```text
http://localhost:4000/api
```

Available endpoints:

```text
GET  /api/state
POST /api/mint       { "amount": "1000" }
POST /api/send       { "recipient": "mn_addr...", "amount": "100" }
POST /api/receive    { "amount": "100" }
```

### Terminal 2: start the frontend

macOS / Linux:

```bash
cd frontend
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

The token state card should show:

```text
Mode: Midnight API adapter
```

If it shows `local UI demo`, restart the Vite dev server after copying `.env`.

## Test the API without the browser

Terminal 1:

```bash
npm run api:dev
```

Terminal 2:

```bash
npm run api:smoke
```

Reset local API state:

```bash
npm run api:reset
```

## Build the frontend

```bash
npm run frontend:build
```

Or directly:

```bash
cd frontend
npm run build
```

Expected output includes:

```text
✓ built in ...
dist/index.html
dist/assets/...
```

## Compile the Compact contract

Generated artifacts are already included. To recompile with your local Compact compiler:

```bash
npm run compile:contract
```

Direct command:

```bash
compact compile contracts/unshielded-token.compact contracts/managed/unshielded-token
```

If `compact: command not found` appears, install/configure the Compact compiler from the Midnight docs, then rerun.

## Proof server helper

If Docker Desktop is running:

```bash
npm run start-proof-server
```

This starts:

```text
midnightntwrk/proof-server:8.0.3
http://localhost:6300
```

## Local Docker / live deployment notes

For a true on-chain local deployment, use Midnight local Docker services and wire a real Midnight.js adapter. Start here:

```bash
npm run deploy:local
```

That command prints the local deployment notes and exits successfully. The detailed checklist is in:

```text
docs/LOCAL_DOCKER_DEPLOYMENT.md
```

The stable UI/API mode in this zip is ready to run. The real on-chain adapter should be finalized against the exact Midnight SDK and local-dev versions installed on your machine.

## Security notes

Never commit:

- `.env`
- `frontend/.env`
- `deployment/*.json`
- wallet seeds
- recovery phrases
- private keys
- `.cache/`

These are already covered by `.gitignore`.

`tutorial.md` is included as supporting documentation for the implementation and walkthrough.

## Unshielded vs Shielded Tokens

### Unshielded Tokens
- Easier to test and integrate
- Transaction activity is visible
- Good starting point for learning Midnight token flows

### Shielded Tokens
- Better privacy guarantees
- Hidden balances and transfers
- More suitable for privacy-sensitive applications

This project focuses on unshielded tokens to keep the implementation simpler and easier for new contributors to understand.

## Suggested Screenshots

Recommended screenshots for reviewers:

- Wallet connected
  <img width="507" height="424" alt="Screenshot 2026-05-14 at 12 23 27 AM" src="https://github.com/user-attachments/assets/235e363b-a2ab-4f3e-9909-be4d0f9688df" />

- Mint flow
- <img width="856" height="520" alt="Screenshot 2026-05-14 at 12 24 23 AM" src="https://github.com/user-attachments/assets/88a5ecbe-5e57-4d24-8723-bad0b3410ff0" />

-Operation Log
<img width="1440" height="880" alt="Screenshot 2026-05-14 at 12 25 42 AM" src="https://github.com/user-attachments/assets/97d405e5-42f1-45b7-bbf7-98a4d64e28e1" />

- Token balance display
- <img width="1440" height="880" alt="Screenshot 2026-05-14 at 12 25 13 AM" src="https://github.com/user-attachments/assets/e399047d-bbef-4b45-a13f-e35e8cead68a" />
