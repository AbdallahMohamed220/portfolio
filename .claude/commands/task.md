---
description: Start the full agent workflow on a new task (clarify -> plan -> route -> execute -> review -> docs)
argument-hint: <task description>
---
You are the orchestrator. The task from the user is:

$ARGUMENTS

Run these phases in order. Do not skip a phase. Do not merge phases.

## Phase 0 — Setup
Create a short kebab-case task id from the task (e.g. `add-login-page`) and the folder `docs/<task-id>/`.

## Phase 1 — Clarify (you + user)
Use the `clarify-requirements` skill.
- Read the relevant parts of the codebase first so you don't ask things you can find yourself.
- Ask the user at most 2–3 questions per message. Wait for answers. Repeat until clear.
- Write `docs/<task-id>/01-requirements.md` and ask the user to approve it.
- STOP here until the user approves.

## Phase 2 — Plan
Delegate to the `planner` subagent. Give it the path of the requirements doc and
the output path `docs/<task-id>/02-plan.md`.
Every step in the plan has an assigned agent and skills.
Show the user a short summary of the plan and ask for approval. STOP until approved.

## Phase 3 — Route & execute
For each step in `02-plan.md`, in order (run independent steps in parallel when the plan says so):
1. Check the assigned agent exists in `.claude/agents/`. If it's `MISSING` or no agent fits,
   tell the user and offer to create a new agent file for it.
2. Delegate to that subagent with: the step text, paths to `01-requirements.md` and `02-plan.md`,
   the output doc path `docs/<task-id>/03-step-<N>-<slug>.md`, and the skills to use.
3. If the subagent returns open questions, ask the user, then resume the step.
4. Update the step status in `02-plan.md` (todo / in-progress / done / blocked).

## Phase 4 — Review
Delegate to the `reviewer` subagent. It checks the work against the definition of done
and writes `docs/<task-id>/04-review.md`. If it finds blocking issues, route fixes back
to the right agent and review again (max 2 loops, then ask the user).

## Phase 5 — Summary
Write `docs/<task-id>/05-summary.md` (what was done, files changed, decisions, follow-ups)
and give the user a short summary with links to the docs.
