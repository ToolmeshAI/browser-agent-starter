import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createBrowserPlan } from './browser.js';
import { workflowBuilders } from './workflows/index.js';

export async function runWorkflow(config) {
  const builder = workflowBuilders[config.workflow];

  if (!builder) {
    throw new Error(`Unknown workflow: ${config.workflow}`);
  }

  const outputDir = resolve(config.artifacts.outputDir);
  await mkdir(outputDir, { recursive: true });

  const plan = builder(config);
  const summaryMap = {
    'docs-audit': 'Dry-run docs audit plan ready for operator review.',
    'signup-smoke-test': 'Dry-run signup smoke test plan ready for checkpoint review.',
    'pricing-watch': 'Dry-run pricing watch plan ready for baseline comparison.'
  };
  const browserPlan = createBrowserPlan(config);

  const result = {
    workflow: config.workflow,
    name: config.name,
    status: 'planned',
    summary: summaryMap[config.workflow],
    dryRun: config.dryRun,
    mode: config.dryRun ? 'dry-run' : 'live',
    goal: config.goal,
    outputDir,
    browser: {
      ready: true,
      adapter: config.browser.adapter,
      executableConfigured: Boolean(config.browser.executablePath),
      note: browserPlan.note
    },
    config: {
      targetUrl: config.config.targetUrl,
      constraints: config.constraints,
      outputDir
    },
    plan
  };

  const runArtifact = {
    workflow: result.workflow,
    name: result.name,
    status: result.status,
    dryRun: result.dryRun,
    mode: result.mode,
    goal: result.goal,
    outputDir,
    browser: result.browser,
    config: result.config
  };

  await writeFile(`${outputDir}/run.json`, JSON.stringify(runArtifact, null, 2));
  await writeFile(`${outputDir}/plan.json`, JSON.stringify(plan, null, 2));

  return result;
}
