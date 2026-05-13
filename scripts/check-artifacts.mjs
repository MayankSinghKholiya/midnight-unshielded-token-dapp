import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'contracts/unshielded-token.compact',
  'contracts/managed/unshielded-token/contract/index.js',
  'contracts/managed/unshielded-token/contract/index.d.ts',
  'contracts/managed/unshielded-token/keys/mint.prover',
  'contracts/managed/unshielded-token/keys/sendTokens.prover',
  'contracts/managed/unshielded-token/keys/receiveTokens.prover',
  'contracts/managed/unshielded-token/zkir/mint.zkir',
  'contracts/managed/unshielded-token/zkir/sendTokens.zkir',
  'contracts/managed/unshielded-token/zkir/receiveTokens.zkir',
];

const missing = required.filter((item) => !fs.existsSync(path.join(root, item)));

if (missing.length > 0) {
  console.error('Missing generated contract artifacts:');
  for (const item of missing) console.error(`- ${item}`);
  console.error('\nRun npm run compile:contract after installing the Compact compiler.');
  process.exit(1);
}

console.log('Contract source and generated artifacts are present.');
