export type NetworkId = 'mainnet' | 'testnet' | 'devnet' | 'qanet' | 'undeployed' | 'preview' | 'preprod';

export type WalletState = {
  connected: boolean;
  detected: boolean;
  isConnecting: boolean;
  providerName: string;
  networkId: NetworkId;
  address: string | null;
  status: string;
  error: string | null;
};

export type TokenState = {
  totalSupply: bigint;
  contractBalance: bigint;
  tokenColor: string;
  mode: 'local-demo' | 'api';
};

export type ActivityItem = {
  id: string;
  time: string;
  label: string;
  description: string;
  status: 'success' | 'pending' | 'error' | 'info';
};

export type ToastItem = {
  id: string;
  title: string;
  message: string;
  status: 'success' | 'error' | 'info';
};
