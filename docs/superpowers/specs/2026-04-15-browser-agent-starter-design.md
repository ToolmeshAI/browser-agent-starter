# Browser Agent Starter Design

## Goal

Create a lightweight, production-minded starter that turns three browser-agent recipe themes into runnable code scaffolding:

- `docs-audit`
- `signup-smoke-test`
- `pricing-watch`

The MVP must be honest about scope. It will support dry-run planning and structured artifact generation rather than full browser automation.

## Chosen Approach

Use a small Node 20 ESM CLI with a shared JSON config shape, a workflow registry, and per-workflow planners that emit:

- a normalized run artifact
- a workflow plan artifact
- structured stdout in `text` or `json`

The starter will expose a browser-ready seam in code and config, but dry-run remains the implemented path.

## Alternatives Considered

### 1. Pure template generator

Pros:

- smallest implementation
- no runtime behavior to maintain

Cons:

- less useful as a runnable starter
- does not prove artifact flow or CLI shape

### 2. Minimal browser-ready dry-run scaffold

Pros:

- runnable immediately
- honest about current behavior
- provides a real starting point for later browser execution

Cons:

- slightly more code than a template-only repo

### 3. Full automation MVP

Pros:

- closer to end-state browser agent behavior

Cons:

- too much runtime complexity for this MVP
- would push the project into brittle setup and dependency choices

## File Design

- `src/cli.js`: argument parsing and command execution
- `src/index.js`: public programmatic entrypoint
- `src/config.js`: shared config loading and validation
- `src/run.js`: run orchestration and artifact writing
- `src/format.js`: text and json output shaping
- `src/workflows/*.js`: workflow planners
- `bin/browser-agent-starter.js`: executable wrapper
- `examples/*.json`: sample configs
- `test/*.test.mjs`: `node:test` coverage

## Shared Config Shape

All workflows use the same top-level shape:

```json
{
  "workflow": "docs-audit",
  "name": "Acme docs audit",
  "dryRun": true,
  "target": {
    "baseUrl": "https://app.example.com",
    "entryUrl": "https://docs.example.com/getting-started",
    "urls": []
  },
  "environment": {
    "name": "production",
    "locale": "en-US"
  },
  "artifacts": {
    "outputDir": "./runs/docs-audit",
    "captureScreenshots": false
  },
  "scenario": {}
}
```

Workflow-specific data lives in `scenario`.

## MVP Output

Each run writes JSON artifacts into the chosen output directory:

- `run.json`
- `plan.json`

Screenshot capture is documented as future work and represented as planned actions in dry-run output.
