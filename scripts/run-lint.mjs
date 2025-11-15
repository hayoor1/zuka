#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

function run(commandArgs) {
  const result = spawnSync('pnpm', commandArgs, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });
  process.exit(result.status ?? 0);
}

if (args.length === 0) {
  run(['-r', 'lint']);
} else {
  const [target] = args;
  if (['apps/web', '@zuka/web', 'web'].includes(target)) {
    run(['--filter', '@zuka/web', 'run', 'lint']);
  } else {
    run(['-r', 'lint']);
  }
}

