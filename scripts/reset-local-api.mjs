import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('.cache/local-token-state.json');
if (fs.existsSync(file)) {
  fs.rmSync(file, { force: true });
  console.log('Local API state reset.');
} else {
  console.log('Local API state already clean.');
}
