import { useCallback, useMemo, useState } from 'react';
import { isLikelyMidnightAddress, parsePositiveInteger } from '../lib/format';
import { loadLocalState, pushActivity, saveLocalState } from '../lib/localTokenStore';
import type { ActivityItem, ToastItem, TokenState } from '../lib/types';

const apiBaseUrl = import.meta.env.VITE_CONTRACT_API_URL as string | undefined;

async function callApi<T>(path: string, body?: unknown): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('No VITE_CONTRACT_API_URL configured. Using local demo mode instead.');
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function makeToast(item: Omit<ToastItem, 'id'>): ToastItem {
  return { ...item, id: crypto.randomUUID() };
}

export function useTokenDapp() {
  const [tokenState, setTokenState] = useState<TokenState>(() => {
    const local = loadLocalState();
    return { ...local, mode: apiBaseUrl ? 'api' : 'local-demo' };
  });
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: 'boot',
      time: new Date().toLocaleTimeString(),
      label: apiBaseUrl ? 'API mode ready' : 'Local demo mode ready',
      description: apiBaseUrl
        ? 'The UI will call the configured Midnight contract API adapter.'
        : 'The UI is running without a backend. Use this to review UX before wiring live calls.',
      status: 'info',
    },
  ]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [busy, setBusy] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const toast = makeToast(item);
    setToasts((current) => [toast, ...current].slice(0, 4));
    window.setTimeout(() => dismissToast(toast.id), 5000);
  }, [dismissToast]);

  const addActivity = useCallback((item: Omit<ActivityItem, 'id' | 'time'>) => {
    setActivity((current) => pushActivity(current, item));
  }, []);

  const refresh = useCallback(async () => {
    if (!apiBaseUrl) {
      const state = loadLocalState();
      setTokenState({ ...state, mode: 'local-demo' });
      addActivity({ label: 'Balance refreshed', description: 'Loaded token state from local demo storage.', status: 'success' });
      showToast({ title: 'State refreshed', message: 'Local token state has been refreshed.', status: 'info' });
      return;
    }

    setBusy(true);
    try {
      const state = await callApi<{ totalSupply: string; contractBalance: string; tokenColor: string }>('/state');
      setTokenState({
        totalSupply: BigInt(state.totalSupply),
        contractBalance: BigInt(state.contractBalance),
        tokenColor: state.tokenColor,
        mode: 'api',
      });
      addActivity({ label: 'Network state refreshed', description: 'Fetched total supply, contract balance, and token color.', status: 'success' });
      showToast({ title: 'State refreshed', message: 'Latest token state loaded from the API adapter.', status: 'info' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addActivity({ label: 'Refresh failed', description: message, status: 'error' });
      showToast({ title: 'Refresh failed', message, status: 'error' });
    } finally {
      setBusy(false);
    }
  }, [addActivity, showToast]);

  const mint = useCallback(async (amountInput: string) => {
    setBusy(true);
    try {
      const amount = parsePositiveInteger(amountInput);
      addActivity({ label: 'Mint started', description: `Requesting ${amount.toString()} UNT through mint(amount).`, status: 'pending' });
      if (apiBaseUrl) {
        await callApi('/mint', { amount: amount.toString() });
        await refresh();
      } else {
        const next = { ...tokenState, totalSupply: tokenState.totalSupply + amount, contractBalance: tokenState.contractBalance + amount, mode: 'local-demo' as const };
        saveLocalState(next);
        setTokenState(next);
      }
      addActivity({ label: 'Mint confirmed', description: `${amount.toString()} UNT minted to the contract balance.`, status: 'success' });
      showToast({ title: 'Mint successful', message: `${amount.toString()} UNT minted to the contract.`, status: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addActivity({ label: 'Mint failed', description: message, status: 'error' });
      showToast({ title: 'Mint failed', message, status: 'error' });
    } finally {
      setBusy(false);
    }
  }, [addActivity, refresh, showToast, tokenState]);

  const send = useCallback(async (recipient: string, amountInput: string) => {
    setBusy(true);
    try {
      const amount = parsePositiveInteger(amountInput);
      if (!isLikelyMidnightAddress(recipient)) {
        throw new Error('Recipient does not look like a Midnight user address.');
      }
      addActivity({ label: 'Transfer started', description: `Sending ${amount.toString()} UNT to ${recipient.slice(0, 18)}…`, status: 'pending' });
      if (tokenState.contractBalance < amount && !apiBaseUrl) {
        throw new Error('Contract balance is lower than the requested amount. Mint or receive first.');
      }
      if (apiBaseUrl) {
        await callApi('/send', { recipient, amount: amount.toString() });
        await refresh();
      } else {
        const next = { ...tokenState, contractBalance: tokenState.contractBalance - amount, mode: 'local-demo' as const };
        saveLocalState(next);
        setTokenState(next);
      }
      addActivity({ label: 'Transfer confirmed', description: `sendTokens(recipient, ${amount.toString()}) completed.`, status: 'success' });
      showToast({ title: 'Transfer successful', message: `${amount.toString()} UNT sent to ${recipient.slice(0, 16)}…`, status: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addActivity({ label: 'Transfer failed', description: message, status: 'error' });
      showToast({ title: 'Transfer failed', message, status: 'error' });
    } finally {
      setBusy(false);
    }
  }, [addActivity, refresh, showToast, tokenState]);

  const receive = useCallback(async (amountInput: string) => {
    setBusy(true);
    try {
      const amount = parsePositiveInteger(amountInput);
      addActivity({ label: 'Receive started', description: `Calling receiveTokens(${amount.toString()}).`, status: 'pending' });
      if (apiBaseUrl) {
        await callApi('/receive', { amount: amount.toString() });
        await refresh();
      } else {
        const next = { ...tokenState, contractBalance: tokenState.contractBalance + amount, mode: 'local-demo' as const };
        saveLocalState(next);
        setTokenState(next);
      }
      addActivity({ label: 'Receive confirmed', description: `${amount.toString()} UNT added to the contract-side balance.`, status: 'success' });
      showToast({ title: 'Receive successful', message: `${amount.toString()} UNT received into the contract.`, status: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addActivity({ label: 'Receive failed', description: message, status: 'error' });
      showToast({ title: 'Receive failed', message, status: 'error' });
    } finally {
      setBusy(false);
    }
  }, [addActivity, refresh, showToast, tokenState]);

  return useMemo(
    () => ({ tokenState, activity, toasts, busy, mint, send, receive, refresh, dismissToast }),
    [activity, busy, dismissToast, mint, receive, refresh, send, toasts, tokenState],
  );
}
