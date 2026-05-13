# Build an Unshielded Token DApp on Midnight with Compact, TypeScript, and React

Midnight is usually discussed through the lens of privacy, zero-knowledge proofs, and shielded state. That is the part that makes the network interesting, but it is not always the easiest place for a new contributor to start. Before a developer handles private witnesses, shielded coin information, ciphertexts, or selective disclosure flows, it helps to build a small transparent token application first.

This tutorial builds that simpler entry point: an unshielded token dApp with a Compact contract, TypeScript integration boundaries, and a React frontend. The dApp lets a user connect a Midnight Lace wallet, view token state, mint tokens to the contract, send tokens to a recipient, receive tokens back into the contract, and understand what is public in this design.

The goal is not to create a production token standard. The goal is to make the movement of unshielded tokens understandable end to end. Once that flow is clear, shielded tokens become much easier to reason about because the developer already understands token color, contract-held balances, circuit calls, and transaction state.

## What we are building

The project has three parts.

First, there is a Compact contract in `contracts/unshielded-token.compact`. It exposes circuits for initialization, minting, sending, receiving, and reading public tutorial counters. The important circuits are `mint`, `sendTokens`, and `receiveTokens`, because they wrap Midnight’s unshielded token primitives.

Second, there is a TypeScript/React frontend in `frontend/`. It has a wallet connection card, token state card, operation cards, and an activity log. The UI deliberately avoids Ethereum-specific assumptions such as `0x` addresses, gas wording, or ERC-20 style allowance language.

Third, the repository includes a clean submission structure: README, checklist, UI notes, generated Compact artifacts, and this tutorial draft. Before publishing, replace any placeholder screenshots with your own local/testnet screenshots and add a short note about the real errors you fixed during your run.

## The Compact contract

The contract starts with the Compact standard library:

```compact
pragma language_version >= 0.22;

import CompactStandardLibrary;
```

The tutorial contract tracks three public pieces of state:

```compact
export ledger totalSupply: Uint<128>;
export ledger contractBalance: Uint<128>;
export ledger tokenColor: Bytes<32>;
```

`totalSupply` is a tutorial-level counter for minted supply. `contractBalance` is also a tutorial-level counter for the balance this UI is showing. The actual unshielded token operation is handled by the Midnight token primitives; the counters are kept so beginners can see state updates in a familiar way.

The `initialize` circuit calculates a token color:

```compact
export circuit initialize(): [] {
    tokenColor = tokenType(
        disclose(pad(32, "unshielded-tutorial-token")),
        disclose(kernel.self())
    );
    totalSupply = 0;
    contractBalance = 0;
}
```

A token color identifies the token type. The domain separator plus contract identity gives this tutorial token a stable identity for the contract.

The mint circuit is the first important operation:

```compact
export circuit mint(amount: Uint<64>): [] {
    const disclosedAmount = disclose(amount);
    mintUnshieldedToken(
        disclose(pad(32, "unshielded-tutorial-token")),
        disclosedAmount,
        left<ContractAddress, UserAddress>(kernel.self())
    );

    const newTotalSupply = disclose(totalSupply) + (disclosedAmount as Uint<128>);
    const newContractBalance = disclose(contractBalance) + (disclosedAmount as Uint<128>);
    totalSupply = (newTotalSupply as Uint<128>);
    contractBalance = (newContractBalance as Uint<128>);
}
```

The key part is `mintUnshieldedToken`. It creates a new unshielded coin for this token and sends it to the recipient. In this case, the recipient is `left<ContractAddress, UserAddress>(kernel.self())`, meaning the token is minted to the current contract.

Sending works in the other direction. The contract sends part of its unshielded balance to a user:

```compact
export circuit sendTokens(recipient: UserAddress, amount: Uint<64>): [] {
    const disclosedAmount = disclose(amount);

    assert(contractBalance >= (disclosedAmount as Uint<128>), "Insufficient contract balance");

    sendUnshielded(
        disclose(tokenColor),
        disclosedAmount as Uint<128>,
        right<ContractAddress, UserAddress>(disclose(recipient))
    );

    const newBalance = disclose(contractBalance) - (disclosedAmount as Uint<128>);
    contractBalance = (newBalance as Uint<128>);
}
```

Here the recipient is a `UserAddress`, so the contract uses `right<ContractAddress, UserAddress>(...)`. That distinction is one of the first things new Midnight developers should pay attention to. A token can move to a contract or to a user, and the recipient type makes that explicit.

Receiving is the matching operation:

```compact
export circuit receiveTokens(amount: Uint<128>): [] {
    const disclosedAmount = disclose(amount);

    receiveUnshielded(disclose(tokenColor), disclosedAmount);

    const newBalance = disclose(contractBalance) + disclosedAmount;
    contractBalance = (newBalance as Uint<128>);
}
```

`receiveUnshielded` tells the transaction context that this contract is receiving a specific amount of the unshielded token identified by `tokenColor`.

## TypeScript integration boundary

A real Midnight dApp normally needs a transaction-construction layer. The compiled Compact artifact gives you contract types and executable circuit definitions. Midnight.js providers handle the network connection, proof generation, public data queries, and transaction submission.

The repository keeps the frontend clean by using an adapter boundary. The React UI calls four endpoints when `VITE_CONTRACT_API_URL` is set:

```text
GET  /api/state
POST /api/mint
POST /api/send
POST /api/receive
```

That boundary is intentional. It lets the frontend remain focused on wallet state, validation, loading states, and user feedback, while the Midnight integration code can live in a small server-side adapter or local development script. If no API URL is configured, the UI runs in local demo mode using `localStorage`. That mode is not a blockchain substitute; it only helps review the interface quickly before connecting it to a local stack or Preprod deployment.

For a bounty submission, the final step is to connect the adapter to the deployed contract. The adapter should load `deployment.json`, connect providers, find the deployed contract, and call the generated circuits. The same pattern is used by Midnight contract interaction guides: load the deployment, set up providers, connect to the compiled contract, call `contract.callTx.<circuitName>()`, and query public state from the public data provider.

## React frontend walkthrough

The UI is built with React and Vite. It has five main components.

`WalletPanel` connects to Midnight Lace through `window.midnight.mnLace`. The user can select `undeployed`, `preview`, or `preprod`. On connection, the app requests wallet authorization and displays the returned wallet address.

`TokenStats` displays total supply, contract balance, token color, and current mode. The mode is useful because reviewers can immediately see whether the UI is using local demo state or a live API adapter.

`ActionPanels` contains the three main operations. The mint card calls `mint(amount)`. The transfer card calls `sendTokens(recipient, amount)`. The receive card calls `receiveTokens(amount)`. Each card has its own explanation so the UI teaches while it works.

`ActivityLog` records every action: pending, success, failure, and informational events. This makes screenshots more useful because reviewers can see what operation was just attempted.

`PrivacyTradeoff` explains when unshielded tokens are appropriate and when shielded tokens are the better choice.

The visual design uses a dark Midnight-style theme with aurora gradients, glass panels, clear hierarchy, and action-specific colors. It is not a copy of any competitor dApp. It uses common dApp UX patterns: wallet first, state before action, one operation per card, strong disabled states, and immediate transaction feedback.

## Running the project

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Compile the contract from the repository root:

```bash
npm run compile:contract
```

Then deploy to your chosen local stack or Preprod setup. Once deployed, expose the adapter endpoints and set:

```bash
VITE_CONTRACT_API_URL=http://localhost:4000/api
```

Then restart the frontend. The UI will switch from local demo mode to API mode.

## Unshielded vs shielded tokens

Unshielded tokens are transparent. That means the relevant token movement is easier to inspect and reason about, but it also means the privacy story is different. Use unshielded tokens when public visibility is acceptable or desired: public treasuries, test tokens, tutorial flows, points systems, audit-friendly operations, or early onboarding experiences.

Shielded tokens are the right direction when privacy matters. If balances, counterparties, transaction amounts, or user-specific business logic should not be public, the dApp should move toward shielded token operations and private state patterns.

The tradeoff is not “one is good and the other is bad.” It is about matching the token design to the product requirement. This tutorial starts with unshielded tokens because it lowers the learning curve. A developer can see token color, circuit calls, public counters, wallet connection, and UI state clearly before taking on shielded flows.

## Debugging notes to add before publishing

Before publishing this tutorial, add your own short debugging section. For example:

- Which Compact compiler version you used.
- Whether the contract compiled on the first run.
- Any type conversions you had to fix, especially `Uint<64>` to `Uint<128>`.
- Whether Lace detected the correct network.
- A screenshot of mint, send, receive, and the final balance.

This matters because a bounty reviewer wants to see that the repository was actually run, not just described. Real screenshots and small debugging notes make the tutorial much more credible.

## Final thoughts

This unshielded token dApp is a practical stepping stone for Midnight newcomers. It does not try to hide every detail behind a framework. It shows the important pieces directly: the Compact contract, the token circuits, the wallet connection, the frontend state, and the privacy tradeoff.

Once this is working locally or on Preprod, the natural next step is to build the same experience with shielded tokens. At that point, the developer already understands the public version of the flow, so the private version becomes a meaningful upgrade rather than a confusing first step.
