export function formatText(result) {
  const lines = [
    `${result.dryRun ? 'Dry run complete' : 'Run complete'} for ${result.workflow}`,
    `Status: ${result.status}`,
    `Output: ${result.outputDir}`,
    `Browser adapter: ${result.browser.adapter}`,
    `Goal: ${result.goal}`
  ];

  if (result.plan?.steps?.length) {
    lines.push('Steps:');
    for (const step of result.plan.steps) {
      lines.push(`- ${step.title}`);
    }
  }

  return lines.join('\n');
}

export function formatJson(result) {
  return JSON.stringify(result, null, 2);
}
