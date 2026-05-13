import { useCallback, useMemo, useState } from 'react';
import '@midnight-ntwrk/dapp-connector-api';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { NetworkId, WalletState } from '../lib/types';

type AddressCandidate =
  | string
  | string[]
  | { shieldedAddress?: string; address?: string; addresses?: string[] }
  | null
  | undefined;

type MidnightWindow = Record<string, unknown> & {
  mnLace?: InitialAPI;
};

function hasConnect(value: unknown): value is InitialAPI {
  return Boolean(value) && typeof value === 'object' && typeof (value as { connect?: unknown }).connect === 'function';
}

function findWalletProvider(): { provider: InitialAPI | null; providerName: string } {
  const midnight = window.midnight as MidnightWindow | undefined;

  if (!midnight) {
    return { provider: null, providerName: 'Midnight Lace' };
  }

  if (hasConnect(midnight.mnLace)) {
    return { provider: midnight.mnLace, providerName: 'Midnight Lace' };
  }

  for (const [key, value] of Object.entries(midnight)) {
    if (hasConnect(value)) {
      const providerName = key === 'mnLace' ? 'Midnight Lace' : `lace (${key.slice(0, 8)}…)`;
      return { provider: value, providerName };
    }
  }

  return { provider: null, providerName: 'Midnight Lace' };
}

function extractAddress(candidate: AddressCandidate): string | null {
  if (!candidate) return null;
  if (typeof candidate === 'string') return candidate;
  if (Array.isArray(candidate)) return candidate.find((item) => typeof item === 'string') ?? null;

  if (typeof candidate.shieldedAddress === 'string') return candidate.shieldedAddress;
  if (typeof candidate.address === 'string') return candidate.address;
  if (Array.isArray(candidate.addresses)) return candidate.addresses.find((item) => typeof item === 'string') ?? null;

  const firstString = Object.values(candidate).find((item) => typeof item === 'string');
  return typeof firstString === 'string' ? firstString : null;
}

const initialProvider = findWalletProvider();

const initialState: WalletState = {
  connected: false,
  detected: Boolean(initialProvider.provider),
  isConnecting: false,
  providerName: initialProvider.providerName,
  networkId: 'preprod',
  address: null,
  status: initialProvider.provider ? 'Wallet detected' : 'Disconnected',
  error: null,
};

export function useMidnightWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState);
  const [api, setApi] = useState<ConnectedAPI | null>(null);

  const refreshDetection = useCallback(() => {
    const { provider, providerName } = findWalletProvider();

    setWalletState((current) => ({
      ...current,
      detected: Boolean(provider),
      providerName,
      status: current.connected ? current.status : provider ? 'Wallet detected' : 'Disconnected',
      error: provider ? null : current.error,
    }));
  }, []);

  const connect = useCallback(async (networkId?: NetworkId) => {
    const safeNetworkId = networkId ?? walletState.networkId ?? 'preprod';
    const { provider, providerName } = findWalletProvider();

    setWalletState((current) => ({
      ...current,
      networkId: safeNetworkId,
      providerName,
      detected: Boolean(provider),
      isConnecting: true,
      status: 'Connecting…',
      error: null,
    }));

    if (!provider) {
      setApi(null);
      setWalletState((current) => ({
        ...current,
        connected: false,
        detected: false,
        isConnecting: false,
        address: null,
        status: 'Disconnected',
        error: 'No Midnight wallet provider was detected. Enable Lace, then refresh the page.',
      }));
      return;
    }

    try {
      const connectedApi = await provider.connect(safeNetworkId);
      const connectionStatus = await connectedApi.getConnectionStatus();
      const addresses = (await connectedApi.getShieldedAddresses()) as AddressCandidate;
      const address = extractAddress(addresses) ?? 'Connected address unavailable';
      const runtimeNetwork =
        typeof connectionStatus === 'object' && connectionStatus && 'networkId' in connectionStatus
          ? String((connectionStatus as { networkId?: unknown }).networkId ?? safeNetworkId)
          : safeNetworkId;

      setApi(connectedApi);
      setWalletState({
        connected: true,
        detected: true,
        isConnecting: false,
        providerName,
        networkId: safeNetworkId,
        address,
        status: `Connected to ${runtimeNetwork}`,
        error: null,
      });
    } catch (error) {
      setApi(null);
      setWalletState((current) => ({
        ...current,
        connected: false,
        isConnecting: false,
        address: null,
        status: 'Disconnected',
        error: error instanceof Error ? error.message : 'Wallet connection failed.',
      }));
    }
  }, [walletState.networkId]);

  const disconnect = useCallback(() => {
    const { provider, providerName } = findWalletProvider();
    setApi(null);
    setWalletState({
      connected: false,
      detected: Boolean(provider),
      isConnecting: false,
      providerName,
      networkId: 'preprod',
      address: null,
      status: provider ? 'Wallet detected' : 'Disconnected',
      error: null,
    });
  }, []);

  return useMemo(
    () => ({ walletState, api, connect, disconnect, refreshDetection }),
    [walletState, api, connect, disconnect, refreshDetection],
  );
}
