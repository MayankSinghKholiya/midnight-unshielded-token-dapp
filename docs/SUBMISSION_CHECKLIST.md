# Submission checklist

Use this before publishing the Dev.to article and GitHub link.

## Contract

- [ ] `contracts/unshielded-token.compact` is present.
- [ ] `npm run check:artifacts` passes.
- [ ] `npm run compile:contract` succeeds on your machine after Compact is installed.
- [ ] Generated files exist under `contracts/managed/unshielded-token/contract`.
- [ ] The contract uses `mintUnshieldedToken`, `sendUnshielded`, and `receiveUnshielded`.
- [ ] No local wallet seed or deployment secret is committed.

## Frontend

- [ ] `npm run setup` succeeds.
- [ ] `npm run frontend:build` succeeds.
- [ ] `npm run api:dev` starts the local adapter.
- [ ] `npm run api:smoke` passes while the adapter is running.
- [ ] `frontend/.env` is created from `frontend/.env.example` for API mode.
- [ ] Lace wallet detection works in Chrome/Brave.
- [ ] Mint, transfer, receive, refresh states have screenshots.

## Live deployment

- [ ] Local Docker stack or Preprod is running.
- [ ] Proof server is running.
- [ ] Deployment output is saved outside Git.
- [ ] Adapter endpoints are backed by real Midnight.js calls before final bounty submission.
- [ ] Screenshots show real deployed/local stack context if submitting the live version.

## Article

- [ ] 1,500-2,500 words.
- [ ] Includes real screenshots.
- [ ] Includes a short debugging note from your own run.
- [ ] Explains unshielded vs shielded tokens without overstating privacy.
- [ ] Published link is shared in the bounty issue.
- [ ] Comment `Ready for review` explicitly.
