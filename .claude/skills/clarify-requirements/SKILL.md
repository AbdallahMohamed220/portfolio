---
name: clarify-requirements
description: How to turn a vague task into clear, approved requirements by asking the user good questions. Use this at the start of EVERY new task, feature request, bug report or change request — even if the task looks clear — before any planning or coding.
---
# Clarify requirements

## Before asking anything
Look in the codebase and existing docs first. Never ask the user something you can find yourself.

## What you must know before you stop asking
1. **Goal** — what problem does this solve, for whom?
2. **Scope** — what's in, and explicitly what's out.
3. **Constraints** — tech stack, deadlines, things that must not change, performance/security needs.
4. **Inputs/outputs** — data, APIs, UI, files involved.
5. **Definition of done** — a checklist that a reviewer can verify as pass/fail.

## How to ask
- Max 2–3 questions per message, most important first.
- Prefer concrete options: "Should login use email+password, or Google only, or both?"
  rather than "How should login work?"
- If the user says "you decide", decide, and write the assumption down.

## Output
Write `01-requirements.md` with the requirements template from the `step-docs` skill,
then show the definition of done to the user and ask: "Approve, or change something?"
