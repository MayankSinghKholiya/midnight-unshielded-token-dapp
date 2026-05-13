import { Card } from './Card';

export function PrivacyTradeoff() {
  return (
    <Card eyebrow="Design decision" title="Unshielded vs shielded">
      <div className="tradeoff-grid">
        <div>
          <h3>Use unshielded when</h3>
          <ul>
            <li>Balances and movement can be transparent.</li>
            <li>The dApp is a tutorial, game, faucet, public treasury, or audit-friendly flow.</li>
            <li>You want a simpler entry point before adding private state or shielded coins.</li>
          </ul>
        </div>
        <div>
          <h3>Use shielded when</h3>
          <ul>
            <li>User balances, counterparties, or amounts are sensitive.</li>
            <li>The product needs privacy-preserving financial or identity workflows.</li>
            <li>You need selective disclosure instead of public-by-default state.</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
