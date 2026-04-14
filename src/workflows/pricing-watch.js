export function buildPricingWatchPlan(config) {
  const watchRules = config.scenario.watchRules ?? [];
  const coverage = [
    'pricing page copy',
    'pricing tier names',
    'pricing comparison table',
    ...((config.scenario.segments ?? []).map((segment) => `${segment} pricing segment`))
  ];

  return {
    kind: 'watch-plan',
    steps: [
      {
        title: 'Open the main pricing surface',
        detail: `Start from ${config.target.entryUrl}`
      },
      {
        title: 'Compare visible offers against the baseline note',
        detail: config.scenario.baselineNote ?? 'Compare against the latest saved baseline.'
      },
      {
        title: 'Record changes in plans, discounts, and feature gates',
        detail: 'Capture only publicly visible pricing evidence.'
      }
    ],
    watchRules,
    coverage,
    outputs: ['run.json', 'plan.json']
  };
}
