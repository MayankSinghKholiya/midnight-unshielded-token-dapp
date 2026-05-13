import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 4000);
const DATA_DIR = path.resolve('.cache');
const DATA_FILE = path.join(DATA_DIR, 'local-token-state.json');
const DEFAULT_STATE = {
  totalSupply: '0',
  contractBalance: '0',
  tokenColor: '0x756e736869656c6465642d7475746f7269616c2d746f6b656e00000000',
};

function readState() {
  if (!fs.existsSync(DATA_FILE)) return { ...DEFAULT_STATE };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeState(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function parseAmount(value) {
  if (!/^\d+$/.test(String(value ?? ''))) throw new Error('amount must be a whole number string');
  const amount = BigInt(value);
  if (amount <= 0n) throw new Error('amount must be greater than zero');
  return amount;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, {});

  try {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
    let state = readState();

    if (req.method === 'GET' && url.pathname === '/api/state') {
      return json(res, 200, state);
    }

    if (req.method === 'POST' && url.pathname === '/api/mint') {
      const { amount } = await readBody(req);
      const value = parseAmount(amount);
      state.totalSupply = (BigInt(state.totalSupply) + value).toString();
      state.contractBalance = (BigInt(state.contractBalance) + value).toString();
      writeState(state);
      return json(res, 200, { ok: true, state });
    }

    if (req.method === 'POST' && url.pathname === '/api/send') {
      const { recipient, amount } = await readBody(req);
      if (!recipient || String(recipient).length < 16) throw new Error('recipient is required');
      const value = parseAmount(amount);
      const balance = BigInt(state.contractBalance);
      if (balance < value) throw new Error('insufficient contract balance');
      state.contractBalance = (balance - value).toString();
      writeState(state);
      return json(res, 200, { ok: true, state });
    }

    if (req.method === 'POST' && url.pathname === '/api/receive') {
      const { amount } = await readBody(req);
      const value = parseAmount(amount);
      state.contractBalance = (BigInt(state.contractBalance) + value).toString();
      writeState(state);
      return json(res, 200, { ok: true, state });
    }

    return json(res, 404, { error: 'not found' });
  } catch (error) {
    return json(res, 400, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, () => {
  console.log(`Local token API adapter running at http://localhost:${PORT}/api`);
  console.log('API mode is ready. Open the frontend after copying frontend/.env.example to frontend/.env.');
});
