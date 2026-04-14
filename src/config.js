import { readFile } from 'node:fs/promises';

export const SUPPORTED_WORKFLOWS = new Set([
  'docs-audit',
  'signup-smoke-test',
  'pricing-watch'
]);

function inferBaseUrl(targetUrl) {
  try {
    return new URL(targetUrl).origin;
  } catch {
    return targetUrl;
  }
}

function deriveScenario(workflow, raw) {
  if (raw.scenario) {
    return raw.scenario;
  }

  if (workflow === 'docs-audit') {
    return {
      journey: raw.goal ?? 'Audit public documentation',
      claims: raw.constraints ?? []
    };
  }

  if (workflow === 'signup-smoke-test') {
    return {
      checkpoints: raw.constraints ?? ['Validate signup path'],
      forbiddenStates: [],
      testAccountStrategy: 'Use a safe disposable account'
    };
  }

  return {
    watchRules: raw.constraints ?? ['Track visible pricing changes'],
    baselineNote: raw.goal ?? 'Compare against the latest known baseline',
    segments: ['default']
  };
}

function deriveGoal(workflow, raw, scenario) {
  if (raw.goal) {
    return raw.goal;
  }

  if (workflow === 'docs-audit') {
    return scenario.journey ?? 'Audit documentation against the live product';
  }

  if (workflow === 'signup-smoke-test') {
    return 'Check the signup flow for obvious regressions';
  }

  return 'Track pricing page changes for a competitor';
}

function deriveConstraints(raw, scenario) {
  if (Array.isArray(raw.constraints) && raw.constraints.length > 0) {
    return raw.constraints;
  }

  if (Array.isArray(scenario.checkpoints) && scenario.checkpoints.length > 0) {
    return scenario.checkpoints;
  }

  if (Array.isArray(scenario.watchRules) && scenario.watchRules.length > 0) {
    return scenario.watchRules;
  }

  if (Array.isArray(scenario.claims) && scenario.claims.length > 0) {
    return scenario.claims;
  }

  return [];
}

export async function loadConfig(configPath, overrides = {}) {
  const rawText = await readFile(configPath, 'utf8');
  const raw = JSON.parse(rawText);
  const workflow = overrides.workflow ?? raw.workflow;

  if (!SUPPORTED_WORKFLOWS.has(workflow)) {
    const label = overrides.workflow ? 'Unknown workflow' : 'Unsupported workflow';
    throw new Error(`${label}: ${workflow ?? 'unknown'}`);
  }

  const targetUrl = raw.targetUrl ?? raw.target?.entryUrl;
  const targetUrls = raw.target?.urls ?? (targetUrl ? [targetUrl] : []);
  const scenario = deriveScenario(workflow, raw);
  const goal = deriveGoal(workflow, raw, scenario);
  const constraints = deriveConstraints(raw, scenario);

  return {
    workflow,
    name: raw.name ?? `${workflow} run`,
    dryRun: overrides.dryRun ?? raw.dryRun ?? false,
    goal,
    constraints,
    target: {
      baseUrl: raw.target?.baseUrl ?? inferBaseUrl(targetUrl),
      entryUrl: targetUrl,
      urls: targetUrls
    },
    environment: {
      name: raw.environment?.name ?? 'production',
      locale: raw.environment?.locale ?? 'en-US'
    },
    artifacts: {
      outputDir: overrides.outputDir ?? raw.artifacts?.outputDir ?? `./runs/${workflow}`,
      captureScreenshots: raw.artifacts?.captureScreenshots ?? false,
      notes: raw.artifacts?.notes,
      evidence: raw.artifacts?.evidence
    },
    scenario,
    config: {
      targetUrl,
      constraints,
      outputDir: overrides.outputDir ?? raw.artifacts?.outputDir ?? `./runs/${workflow}`
    },
    browser: {
      adapter: 'playwright-ready-stub',
      executablePath:
        overrides.browserExecutable ??
        process.env.BROWSER_AGENT_STARTER_EXECUTABLE_PATH ??
        process.env.PLAYWRIGHT_EXECUTABLE_PATH ??
        null
    },
    input: raw
  };
}
