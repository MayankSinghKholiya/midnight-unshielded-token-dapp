import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

function run(command, args = []) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

function status(label, ok, detail = '') {
  console.log(`${ok ? '✅' : '⚠️ '} ${label}${detail ? ` — ${detail}` : ''}`);
}

const nodeVersion = run('node', ['-v']);
status('Node.js', Boolean(nodeVersion), nodeVersion ?? 'not found');

const npmVersion = run('npm', ['-v']);
status('npm', Boolean(npmVersion), npmVersion ?? 'not found');

const dockerVersion = run('docker', ['--version']);
status('Docker', Boolean(dockerVersion), dockerVersion ?? 'not found or not running');

const compactVersion = run('compact', ['--version']) ?? run('compact', ['version']);
status('Compact compiler', Boolean(compactVersion), compactVersion ?? 'not found in PATH');

status('Contract source', fs.existsSync('contracts/unshielded-token.compact'));
status('Generated contract JS', fs.existsSync('contracts/managed/unshielded-token/contract/index.js'));
status('Frontend package', fs.existsSync('frontend/package.json'));

console.log('\nNext commands:');
console.log('1) npm run setup');
console.log('2) npm run check:artifacts');
console.log('3) npm run frontend:build');
console.log('4) npm run api:dev   # terminal 1');
console.log('5) cd frontend && cp .env.example .env && npm run dev   # terminal 2');
