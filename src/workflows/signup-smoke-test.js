export function buildSignupSmokeTestPlan(config) {
  const checkpoints = config.scenario.checkpoints ?? [];
  const forbiddenStates = config.scenario.forbiddenStates ?? [];

  return {
    kind: 'checkpoint-plan',
    steps: checkpoints.map((checkpoint, index) => ({
      title: `Checkpoint ${index + 1}: ${checkpoint}`,
      detail: 'Pause and record the visible state before moving to the next checkpoint.'
    })),
    forbiddenStates,
    outputs: ['run.json', 'plan.json'],
    handoff: 'Review the recorded checkpoints before enabling live execution.'
  };
}
