import midnightWordmark from './assets/midnight-wordmark-white.png';
import { ActionPanels } from './components/ActionPanels';
import { ActivityLog } from './components/ActivityLog';
import { PrivacyTradeoff } from './components/PrivacyTradeoff';
import { ToastStack } from './components/ToastStack';
import { TokenStats } from './components/TokenStats';
import { WalletPanel } from './components/WalletPanel';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useTokenDapp } from './hooks/useTokenDapp';

function App() {
  const { walletState, connect, disconnect, refreshDetection } = useMidnightWallet();
  const { tokenState, activity, toasts, busy, mint, send, receive, refresh, dismissToast } = useTokenDapp();

  return (
    <main className="shell">
      <div className="grid-glow" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <header className="hero-panel">
        <div className="hero-copy">
          <div className="brand-row">
            <img src={midnightWordmark} alt="Midnight" className="brand-logo" />
            <span className="tag">Midnight developer tutorial</span>
          </div>
          <h1>Unshielded Token DApp</h1>
          <p>
            A clean Compact + TypeScript + React starter for minting, transferring,
            receiving, and displaying transparent token state on Midnight.
          </p>
          <div className="hero-badges">
            <span>Compact contract</span>
            <span>Wallet-first UX</span>
            <span>mint · send · receive</span>
          </div>
        </div>
        <div className="hero-card">
          <span>Contract circuits</span>
          <strong>mint · send · receive</strong>
          <small>Built around unshielded token operations.</small>
        </div>
        <img src={midnightWordmark} alt="Midnight watermark" className="hero-watermark" aria-hidden="true" />
      </header>

      <section className="dashboard-grid">
        <div className="main-column">
          <TokenStats state={tokenState} busy={busy} onRefresh={refresh} />
          <ActionPanels busy={busy} onMint={mint} onSend={send} onReceive={receive} />
          <ActivityLog items={activity} />
        </div>
        <aside className="side-column">
          <WalletPanel wallet={walletState} onConnect={connect} onDisconnect={disconnect} onRefreshDetection={refreshDetection} />
          <PrivacyTradeoff />
        </aside>
      </section>

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </main>
  );
}

export default App;
