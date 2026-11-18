# Project workflow rules

This project uses a multi-agent workflow. For any non-trivial task, follow the
`/task` workflow (see `.claude/commands/task.md`) even if the user did not type `/task`.

## Golden rules
- Never start implementing before `docs/<task-id>/01-requirements.md` exists and the user approved it.
- Every phase writes its doc in `docs/<task-id>/` BEFORE handing off to the next phase.
- You (the main session) are the orchestrator and router: you talk to the user,
  you delegate to subagents, you never do a specialist's job yourself.
- Subagents cannot talk to the user. Any question a subagent raises comes back
  to you and YOU ask the user.
- Available specialists live in `.claude/agents/`. Pick them by their `description`.
- Use the `step-docs` skill for the format of every doc.
