import type { NetworkId, WalletState } from '../lib/types';
import { shorten } from '../lib/format';
import { Card } from './Card';

type Props = {
  wallet: WalletState;
  onConnect: (networkId?: NetworkId) => void;
  onDisconnect: () => void;
  onRefreshDetection: () => void;
};

const networks: NetworkId[] = ['preprod', 'preview', 'undeployed', 'mainnet'];

export function WalletPanel({ wallet, onConnect, onDisconnect, onRefreshDetection }: Props) {
  return (
    <Card eyebrow="Wallet" title="Midnight wallet connection" className="wallet-card">
      <div className="wallet-topline">
        <div className="status-row">
          <span className={`status-dot ${wallet.connected ? 'connected' : wallet.detected ? 'detected' : ''}`} />
          <span>{wallet.status}</span>
        </div>
        <button className="ghost-button compact" onClick={onRefreshDetection}>Recheck wallet</button>
      </div>

      <div className="meta-pills">
        <span className="meta-pill">Provider: {wallet.providerName}</span>
        <span className={`meta-pill ${wallet.detected ? 'ok' : 'warn'}`}>
          {wallet.detected ? 'Detected in browser' : 'Not detected'}
        </span>
      </div>

      {wallet.error && <div className="alert error">{wallet.error}</div>}

      <div className="network-grid">
        {networks.map((network) => (
          <button
            key={network}
            className={`network-pill ${wallet.networkId === network ? 'active' : ''}`}
            onClick={() => onConnect(network)}
            disabled={wallet.isConnecting}
          >
            {network}
          </button>
        ))}
      </div>

      <div className="address-box">
        <span>Shielded address</span>
        <strong>{wallet.connected && wallet.address ? shorten(wallet.address, 16, 12) : 'Connect wallet to display address'}</strong>
      </div>

      {wallet.connected ? (
        <button className="danger-button" onClick={onDisconnect}>Disconnect</button>
      ) : (
        <button className="connect-button" onClick={() => onConnect(wallet.networkId ?? 'preprod')} disabled={wallet.isConnecting}>
          {wallet.isConnecting ? 'Connecting…' : 'Connect Lace'}
        </button>
      )}

      <p className="footnote">
        Uses the documented <code>window.midnight.mnLace</code> path first, then falls back to any injected Midnight provider key.
      </p>
    </Card>
  );
}
