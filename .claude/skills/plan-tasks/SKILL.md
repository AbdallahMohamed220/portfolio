---
name: plan-tasks
description: How to break approved requirements into small, ordered, assignable steps. Use whenever writing or updating a plan for a task, or splitting work between agents.
---
# Plan tasks

## A good step
- Has ONE clear output (a file changed, a finding, a passing test suite).
- Can be done by ONE agent in one go.
- Is small: if its description needs "and" twice, split it.
- Has a verifiable "done when".

## Order
1. Research steps first (only if something is unknown).
2. Then implementation, smallest-risk first.
3. Tests right after the step they cover, or in parallel if independent.
4. Review is always last — the orchestrator runs it, don't add it as a step.

## Assigning
- Match the step's output to an agent's `description`:
  findings → researcher, source code → developer, tests → tester.
- Add skills the agent should load, by name from `.claude/skills/`.
- Mark steps that don't depend on each other with `parallel: yes`.
