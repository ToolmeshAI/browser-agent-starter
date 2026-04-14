# Browser Agent Starter Implementation Plan

## Task 1: Write failing tests and fixtures

- Add fixture configs for `docs-audit`, `signup-smoke-test`, and `pricing-watch`.
- Add `node:test` coverage for config loading, workflow execution, artifact writing, and CLI output.
- Run `node --test` and confirm failure before implementation.

## Task 2: Implement minimal shared runtime

- Add config validation with a shared top-level schema.
- Add workflow registry and dry-run planners for the three workflows.
- Add artifact writing for `run.json` and `plan.json`.

## Task 3: Implement CLI and output formatting

- Add manual argument parsing for `run <workflow>`.
- Support `--config`, `--dry-run`, `--output`, and `--format text|json`.
- Return nonzero exit codes for invalid usage or workflow failures.

## Task 4: Add project metadata and docs

- Add `package.json`, `README.md`, `README.zh-CN.md`, and `LICENSE`.
- Add `bin` entry and example config files.

## Task 5: Verify

- Run the full test suite.
- Run at least one dry-run CLI example.
- Record exact commands and outcomes.
