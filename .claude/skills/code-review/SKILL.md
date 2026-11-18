---
name: code-review
description: Checklist and output format for reviewing a task's work against its requirements. Use whenever reviewing code, checking a step's output, or deciding if a task is done.
---
# Code review

## Checklist
1. **Definition of done** — check every item in `01-requirements.md`: pass / fail + evidence.
2. **Scope** — nothing out of scope was changed.
3. **Correctness** — logic, edge cases, error handling.
4. **Tests** — exist for the main path and edge cases, and pass (run them).
5. **Consistency** — follows existing patterns and style of the repo.
6. **Security** — no secrets in code, inputs validated, no obvious injection.
7. **Docs** — every step has its doc, and the docs match what the code actually does.

## Output format (`04-review.md`)
```
# Review: <task title>
**Verdict:** APPROVED | CHANGES NEEDED

## Definition of done
| Item | Result | Evidence |

## Blocking issues
| # | Issue | File | Fix by agent |

## Non-blocking suggestions
```
