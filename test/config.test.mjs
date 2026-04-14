import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures', 'configs');

test('loadConfig returns normalized shared config for docs-audit', async () => {
  const configPath = path.join(fixturesDir, 'docs-audit.json');

  const config = await loadConfig(configPath, {
    dryRun: true,
    outputDir: 'tmp/override-output'
  });

  assert.equal(config.workflow, 'docs-audit');
  assert.equal(config.dryRun, true);
  assert.equal(config.artifacts.outputDir, 'tmp/override-output');
  assert.equal(config.environment.locale, 'en-US');
  assert.equal(Array.isArray(config.target.urls), true);
});

test('loadConfig rejects unsupported workflow ids', async () => {
  const badPath = path.join(fixturesDir, 'unsupported.json');

  await assert.rejects(
    () => loadConfig(badPath),
    /Unsupported workflow/
  );
});
