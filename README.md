[English](./README.md) | [中文](./README.zh-CN.md)

# browser-agent-starter

![browser-agent-starter social preview](./docs/assets/social-preview.png)

A minimal browser-ready starter for practical browser-agent workflows with dry-run planning, shared config, and structured artifacts.

This repository turns three high-signal browser-agent use cases into runnable scaffolding:

- `docs-audit`
- `signup-smoke-test`
- `pricing-watch`

The MVP is intentionally honest. It fully supports dry-run planning and artifact generation today, while leaving a clear seam for live browser execution with `playwright-core`.

## Quick Proof

- Starter workflows for `docs-audit`, `signup-smoke-test`, and `pricing-watch`
- Shared config schema across all workflows
- Structured `run.json` and `plan.json` artifacts
- Browser-ready seam without pretending the MVP is already full automation

## Why this exists

- Many browser-agent demos look flashy but skip operator handoff and evidence.
- Teams need a starter they can run, inspect, and adapt before wiring real browser automation.
- Dry-run output is a better first step than a brittle fake live agent.

## What you get

- shared JSON config shape across all workflows
- dry-run artifact generation into a local output directory
- `run.json` and `plan.json` for every run
- workflow planners for docs audits, signup smoke tests, and pricing watch
- a browser-ready seam built around `playwright-core`

## Demo

- Social preview: [docs/assets/social-preview.png](./docs/assets/social-preview.png)
- Terminal demo: [docs/assets/demo-terminal.png](./docs/assets/demo-terminal.png)
- Animated demo: [docs/assets/demo.gif](./docs/assets/demo.gif)

## Quick start

```bash
npm install
node src/cli.js run docs-audit --config examples/docs-audit.json --output ./tmp/docs-audit --dry-run
```

JSON output:

```bash
node src/cli.js run pricing-watch --config examples/pricing-watch.json --output ./tmp/pricing-watch --dry-run --format json
```

## Workflow map

| Workflow | Best for | Main output |
| --- | --- | --- |
| `docs-audit` | checking public docs against product reality | audit plan + run artifact |
| `signup-smoke-test` | validating a signup journey before enabling live automation | checkpoint plan + run artifact |
| `pricing-watch` | tracking public pricing changes | watch plan + run artifact |

## Project status

- Dry-run planning: implemented
- Artifact generation: implemented
- Live browser execution: scaffold seam only, not the focus of this MVP

## What this is not

- not a full browser-agent runtime
- not a hosted orchestration layer
- not a promise that every workflow should be automated end to end

## Repository docs

- [Design](./docs/superpowers/specs/2026-04-15-browser-agent-starter-design.md)
- [Implementation plan](./docs/superpowers/plans/2026-04-15-browser-agent-starter.md)
- [Release notes: v0.1.0](./docs/releases/v0.1.0.md)
- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Support](./SUPPORT.md)
- [Code of conduct](./CODE_OF_CONDUCT.md)

## Related repos

- [`browser-agent-recipes`](https://github.com/ToolmeshAI/browser-agent-recipes)
  for content-first workflow ideas and operator patterns
- [`ToolmeshAI`](https://github.com/ToolmeshAI)
  for the broader MCP and agent tooling portfolio

## License

MIT
