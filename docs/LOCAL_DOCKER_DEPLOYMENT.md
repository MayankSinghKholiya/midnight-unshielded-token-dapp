# Local Docker deployment notes

This repository is ready for the stable frontend/API demonstration flow. For a live Midnight local-chain deployment, use the official Midnight local development stack on your machine and wire a server-side Midnight.js adapter to the React UI endpoints.

## What is already included

- Compact contract: `contracts/unshielded-token.compact`
- Generated contract artifacts: `contracts/managed/unshielded-token/`
- React frontend: `frontend/`
- Local API adapter: `scripts/local-api.mjs`
- Frontend API contract:

```text
GET  /api/state
POST /api/mint
POST /api/send
POST /api/receive
```

## Local stack ports used during testing

When the Midnight local stack is running, you should normally see services similar to:

```text
midnight-indexer       127.0.0.1:8088
midnight-node          127.0.0.1:9944
midnight-proof-server  127.0.0.1:6300
```

Check with:

```bash
docker ps
```

## Recommended local deployment workflow

1. Start the local Midnight Docker stack in a separate folder using the official local-dev tool.
2. Wait until the local-dev wallet is synced and the menu is available.
3. Compile this project’s Compact contract:

```bash
npm run compile:contract
```

4. Use the generated artifacts under:

```text
contracts/managed/unshielded-token/
```

5. Deploy using a Midnight.js adapter compatible with the SDK versions installed on your machine.
6. Save deployment output outside Git, for example:

```text
deployment/local.json
```

7. Expose an adapter API matching:

```text
GET  /api/state
POST /api/mint
POST /api/send
POST /api/receive
```

8. Run the frontend in API mode:

```bash
cd frontend
cp .env.example .env
npm run dev
```

## Why the stable zip uses a local API adapter

Midnight wallet SDK and local-dev versions can change quickly. A deploy script that works for one exact SDK/runtime combination can fail on another with wallet sync or DUST registration errors. This repository keeps the stable review path clean and separates the live deployment adapter from the UI and contract tutorial.

For bounty submission, replace `scripts/local-api.mjs` with your verified Midnight.js-backed adapter, or run it behind the same endpoint paths after you deploy locally or on Preprod.

## Troubleshooting

If Docker services do not start:

```bash
docker ps
docker compose ps
docker compose logs --tail=120
```

If the frontend does not switch to API mode:

1. Confirm `frontend/.env` exists.
2. Confirm it contains:

```text
VITE_CONTRACT_API_URL=http://localhost:4000/api
```

3. Stop Vite with `Ctrl+C` and run `npm run dev` again.

If `compact` is not found:

- Install the Compact compiler.
- Restart your terminal.
- Run `compact --version` or `compact version`.
- Re-run `npm run compile:contract`.
