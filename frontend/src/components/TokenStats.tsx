import type { TokenState } from '../lib/types';
import { formatTokenAmount, shorten } from '../lib/format';
import { Card } from './Card';

type Props = {
  state: TokenState;
  busy: boolean;
  onRefresh: () => void;
};

export function TokenStats({ state, busy, onRefresh }: Props) {
  return (
    <Card eyebrow="Token state" title="Unshielded UNT overview" className="stats-card">
      <div className="stats-grid">
        <div>
          <span>Total supply</span>
          <strong>{formatTokenAmount(state.totalSupply)} UNT</strong>
        </div>
        <div>
          <span>Contract balance</span>
          <strong>{formatTokenAmount(state.contractBalance)} UNT</strong>
        </div>
        <div className="span-2">
          <span>Token color</span>
          <strong>{shorten(state.tokenColor, 18, 14)}</strong>
        </div>
      </div>
      <div className="mode-strip">
        <span>Mode: {state.mode === 'api' ? 'Midnight API adapter' : 'local UI demo'}</span>
        <button className="ghost-button" onClick={onRefresh} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh'}</button>
      </div>
    </Card>
  );
}
