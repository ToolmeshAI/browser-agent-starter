export function buildDocsAuditPlan(config) {
  const urls = config.target.urls.length > 0 ? config.target.urls : [config.target.entryUrl];
  const claims = config.scenario.claims ?? [];

  return {
    kind: 'audit-plan',
    steps: [
      {
        title: 'Open the primary documentation entry point',
        detail: `Start from ${config.target.entryUrl}`
      },
      {
        title: 'Map key claims to visible product surfaces',
        detail: claims.length > 0 ? claims.join('; ') : 'Collect the top claims worth validating.'
      },
      {
        title: 'Capture evidence gaps and mismatches',
        detail: 'Record any claim that is stale, missing, or contradicted by the product.'
      }
    ],
    coverage: urls,
    outputs: ['run.json', 'plan.json'],
    evidenceMode: config.artifacts.captureScreenshots ? 'screenshots-and-notes' : 'notes-only'
  };
}
