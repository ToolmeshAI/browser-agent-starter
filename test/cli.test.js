import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(import.meta.dirname, '..');
const cliPath = join(projectRoot, 'src', 'cli.js');

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: projectRoot,
    encoding: 'utf8'
  });
}

test('dry-run docs-audit writes structured artifacts', () => {
  const outputDir = mkdtempSync(join(tmpdir(), 'browser-agent-starter-'));
  const configPath = join(projectRoot, 'examples', 'docs-audit.json');
  const result = runCli([
    'run',
    'docs-audit',
    '--config',
    configPath,
    '--output',
    outputDir,
    '--dry-run'
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry run complete/);
  assert.equal(existsSync(join(outputDir, 'run.json')), true);
  assert.equal(existsSync(join(outputDir, 'plan.json')), true);

  const run = JSON.parse(readFileSync(join(outputDir, 'run.json'), 'utf8'));
  assert.equal(run.workflow, 'docs-audit');
  assert.equal(run.mode, 'dry-run');
  assert.equal(run.browser.ready, true);
});

test('pricing-watch dry run preserves shared config fields in the run artifact', () => {
  const outputDir = mkdtempSync(join(tmpdir(), 'browser-agent-pricing-'));
  const configPath = join(projectRoot, 'examples', 'pricing-watch.json');
  const result = runCli([
    'run',
    'pricing-watch',
    '--config',
    configPath,
    '--output',
    outputDir,
    '--dry-run'
  ]);

  assert.equal(result.status, 0, result.stderr);

  const run = JSON.parse(readFileSync(join(outputDir, 'run.json'), 'utf8'));
  assert.equal(run.goal, 'Track pricing page changes for a competitor');
  assert.equal(run.config.targetUrl, 'https://example.com/pricing');
  assert.equal(run.config.constraints[0], 'Do not submit forms');
});

test('unknown workflows fail fast with a non-zero exit code', () => {
  const result = runCli(['run', 'unknown-workflow', '--dry-run']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown workflow/);
});
