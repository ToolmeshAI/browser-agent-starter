import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from '../src/config.js';
import { runWorkflow } from '../src/run.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures', 'configs');

async function createTempOutputDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('docs-audit dry-run writes plan and run artifacts', async () => {
  const outputDir = await createTempOutputDir('browser-agent-starter-docs-');
  const config = await loadConfig(path.join(fixturesDir, 'docs-audit.json'), {
    outputDir,
    dryRun: true
  });

  const result = await runWorkflow(config);

  assert.equal(result.workflow, 'docs-audit');
  assert.equal(result.status, 'planned');
  assert.match(result.summary, /docs audit/i);

  const runArtifact = JSON.parse(
    await fs.readFile(path.join(outputDir, 'run.json'), 'utf8')
  );
  const planArtifact = JSON.parse(
    await fs.readFile(path.join(outputDir, 'plan.json'), 'utf8')
  );

  assert.equal(runArtifact.workflow, 'docs-audit');
  assert.equal(runArtifact.dryRun, true);
  assert.equal(Array.isArray(planArtifact.steps), true);
  assert.ok(planArtifact.steps.length >= 3);
});

test('signup-smoke-test dry-run produces checkpoint-oriented plan', async () => {
  const outputDir = await createTempOutputDir('browser-agent-starter-signup-');
  const config = await loadConfig(path.join(fixturesDir, 'signup-smoke-test.json'), {
    outputDir,
    dryRun: true
  });

  const result = await runWorkflow(config);

  assert.equal(result.workflow, 'signup-smoke-test');
  assert.equal(result.status, 'planned');
  assert.equal(result.plan.kind, 'checkpoint-plan');
  assert.ok(result.plan.steps.some((step) => /checkpoint/i.test(step.title)));
});

test('pricing-watch dry-run produces watch rules and coverage list', async () => {
  const outputDir = await createTempOutputDir('browser-agent-starter-pricing-');
  const config = await loadConfig(path.join(fixturesDir, 'pricing-watch.json'), {
    outputDir,
    dryRun: true
  });

  const result = await runWorkflow(config);

  assert.equal(result.workflow, 'pricing-watch');
  assert.equal(result.status, 'planned');
  assert.equal(result.plan.kind, 'watch-plan');
  assert.ok(result.plan.watchRules.length >= 2);
  assert.ok(result.plan.coverage.some((item) => /pricing/i.test(item)));
});
