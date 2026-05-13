import type { ActivityItem, TokenState } from './types';

const STATE_KEY = 'midnight-unshielded-token-state-v1';

const defaultState: TokenState = {
  totalSupply: 0n,
  contractBalance: 0n,
  tokenColor: '0x756e736869656c6465642d7475746f7269616c2d746f6b656e00000000',
  mode: 'local-demo',
};

type PersistedState = Omit<TokenState, 'totalSupply' | 'contractBalance'> & {
  totalSupply: string;
  contractBalance: string;
};

function toPersisted(state: TokenState): PersistedState {
  return {
    ...state,
    totalSupply: state.totalSupply.toString(),
    contractBalance: state.contractBalance.toString(),
  };
}

function fromPersisted(state: PersistedState): TokenState {
  return {
    ...state,
    totalSupply: BigInt(state.totalSupply),
    contractBalance: BigInt(state.contractBalance),
  };
}

export function loadLocalState(): TokenState {
  const raw = window.localStorage.getItem(STATE_KEY);
  if (!raw) return defaultState;

  try {
    return fromPersisted(JSON.parse(raw) as PersistedState);
  } catch {
    return defaultState;
  }
}

export function saveLocalState(state: TokenState): void {
  window.localStorage.setItem(STATE_KEY, JSON.stringify(toPersisted(state)));
}

export function pushActivity(items: ActivityItem[], item: Omit<ActivityItem, 'id' | 'time'>): ActivityItem[] {
  return [
    {
      ...item,
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
    },
    ...items,
  ].slice(0, 8);
}
