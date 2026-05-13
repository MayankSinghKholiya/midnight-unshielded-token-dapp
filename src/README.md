# Midnight.js adapter placeholder

The stable project path uses `scripts/local-api.mjs` for API-mode UI testing.

A real Midnight.js adapter should expose the same endpoint contract:

```text
GET  /api/state
POST /api/mint
POST /api/send
POST /api/receive
```

Keep deployment JSON, wallet seeds, and private keys outside Git.
