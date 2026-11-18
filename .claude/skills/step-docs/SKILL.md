---
name: step-docs
description: Templates and rules for the docs every phase must write in docs/<task-id>/ (requirements, plan, step reports, summary). Use whenever creating or updating any workflow doc, after any phase or step finishes.
---
# Step docs

Every phase and step writes a markdown doc in `docs/<task-id>/` before handing off.

| Doc | Written by | Template |
|-----|-----------|----------|
| `01-requirements.md` | orchestrator | `templates/requirements.md` |
| `02-plan.md` | planner | `templates/plan.md` |
| `03-step-<N>-<slug>.md` | the step's agent | `templates/step.md` |
| `04-review.md` | reviewer | see `code-review` skill |
| `05-summary.md` | orchestrator | `templates/summary.md` |

## Rules
- Read the template file and follow its headings exactly.
- Write facts, not intentions: what was done, not what will be done.
- Always list file paths you touched.
- Record every decision with its reason — this is the most valuable part later.
- Keep each doc short enough to read in 2 minutes.
