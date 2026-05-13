export function shorten(value: string | null | undefined, left = 10, right = 8): string {
  if (!value) return 'Not available';
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}…${value.slice(-right)}`;
}

export function formatTokenAmount(value: bigint | number | string): string {
  const normalized = typeof value === 'bigint' ? value.toString() : String(value || '0');
  return new Intl.NumberFormat('en-US').format(Number(normalized));
}

export function parsePositiveInteger(input: string): bigint {
  if (!/^\d+$/.test(input.trim())) {
    throw new Error('Enter a whole-number amount.');
  }

  const parsed = BigInt(input);
  if (parsed <= 0n) {
    throw new Error('Amount must be greater than zero.');
  }
  return parsed;
}

export function isLikelyMidnightAddress(input: string): boolean {
  const value = input.trim();
  return value.startsWith('mn_') || value.length >= 32;
}
