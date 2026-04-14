import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures', 'configs');

function runCli(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['bin/browser-agent-starter.js', ...args], {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

test('CLI emits JSON output for pricing-watch dry-run', async () => {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'browser-agent-cli-'));

  const result = await runCli([
    'run',
    'pricing-watch',
    '--config',
    path.join(fixturesDir, 'pricing-watch.json'),
    '--dry-run',
    '--output',
    outputDir,
    '--format',
    'json'
  ]);

  assert.equal(result.code, 0);

  const payload = JSON.parse(result.stdout);

  assert.equal(payload.workflow, 'pricing-watch');
  assert.equal(payload.status, 'planned');
  assert.equal(payload.outputDir, outputDir);
});

test('CLI exits nonzero for unknown workflow', async () => {
  const result = await runCli([
    'run',
    'unknown-workflow',
    '--config',
    path.join(fixturesDir, 'pricing-watch.json')
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unknown workflow/);
});
