export function createBrowserPlan(config) {
  return {
    adapter: 'dry-run-browser-adapter',
    mode: config.dryRun ? 'dry-run' : 'planned-runtime',
    screenshotPolicy: config.artifacts.captureScreenshots ? 'planned' : 'disabled',
    note: 'This starter generates execution plans and artifacts. Live browser execution is intentionally left for project-specific implementation.'
  };
}
