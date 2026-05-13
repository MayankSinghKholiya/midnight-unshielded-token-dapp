import { useState } from 'react';
import { Card } from './Card';

type Props = {
  busy: boolean;
  onMint: (amount: string) => Promise<void>;
  onSend: (recipient: string, amount: string) => Promise<void>;
  onReceive: (amount: string) => Promise<void>;
};

export function ActionPanels({ busy, onMint, onSend, onReceive }: Props) {
  const [mintAmount, setMintAmount] = useState('1000');
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('100');
  const [recipient, setRecipient] = useState('mn_addr_preprod1exampleuseraddressreplacewithrealaddress');

  return (
    <div className="action-grid">
      <Card eyebrow="Circuit 01" title="Mint unshielded tokens">
        <p className="muted">Calls <code>mint(amount)</code>, which uses <code>mintUnshieldedToken</code> to mint tokens to the contract.</p>
        <label>Amount</label>
        <input value={mintAmount} onChange={(event) => setMintAmount(event.target.value)} inputMode="numeric" />
        <button className="primary-button" disabled={busy} onClick={() => onMint(mintAmount)}>{busy ? 'Working…' : 'Mint UNT'}</button>
      </Card>

      <Card eyebrow="Circuit 02" title="Transfer to user">
        <p className="muted">Calls <code>sendTokens(recipient, amount)</code>, which routes value with <code>sendUnshielded</code>.</p>
        <label>Recipient</label>
        <input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
        <label>Amount</label>
        <input value={sendAmount} onChange={(event) => setSendAmount(event.target.value)} inputMode="numeric" />
        <button className="primary-button amber" disabled={busy} onClick={() => onSend(recipient, sendAmount)}>{busy ? 'Working…' : 'Send UNT'}</button>
      </Card>

      <Card eyebrow="Circuit 03" title="Receive into contract">
        <p className="muted">Calls <code>receiveTokens(amount)</code>, which accepts the token color through <code>receiveUnshielded</code>.</p>
        <label>Amount</label>
        <input value={receiveAmount} onChange={(event) => setReceiveAmount(event.target.value)} inputMode="numeric" />
        <button className="primary-button cyan" disabled={busy} onClick={() => onReceive(receiveAmount)}>{busy ? 'Working…' : 'Receive UNT'}</button>
      </Card>
    </div>
  );
}
