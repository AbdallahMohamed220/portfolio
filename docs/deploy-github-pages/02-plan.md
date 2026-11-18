# Plan: Publish the project on GitHub and serve the portfolio on GitHub Pages

**Requirements:** ./01-requirements.md

Context: nothing in the codebase is unknown, so this plan has no research step. The site is static and lives in `portfolio/` (no build step; `portfolio/README.md` lines 154–170 already describe "Option B: GitHub Actions" with upload `path: portfolio`). The pre-deploy check is `tests/portfolio/check-content.js`. Its default mode (lines 18 and 108) reads only `portfolio/` and nothing under `docs/`, so it runs in CI without the task data files. The workspace is not a git repo yet. Git 2.45 and the user's git identity are set. `gh` is not installed; `winget` is.

Two things cannot be agent work, because subagents cannot talk to the user and must never touch credentials: `gh auth login` (the user runs it) and confirming the login is `AbdallahMohamed220`. Step 4 is therefore a USER/orchestrator gate, not a delegated step. Everything outward-facing (repo creation, push, Pages enable) happens only in Step 5, after the Step 3 secret scan has passed and the Step 4 gate has cleared.

Execution order:
- Steps 1 and 2 run in parallel.
- Step 3 starts after Step 2. Step 4 (gate) starts after Step 1. Steps 3 and 4 can run in parallel.
- Step 5 starts only after both Step 3 and Step 4 are done.
- Step 6 starts after Step 5.
- The orchestrator runs the final review separately, so it is not a step here.

## Steps

### Step 1 — Install the GitHub CLI
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** yes (with Step 2)
- **Output:**
  - `gh` installed with `winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements`.
  - The current shell may not see the new PATH. Record the absolute path of `gh.exe` (usually `C:\Program Files\GitHub CLI\gh.exe`) in the step doc so later steps and the gate can call it directly.
  - No login, no `gh auth` commands of any kind.
  - Step doc `03-step-1-install-gh.md`.
- **Done when:** `gh --version` (by absolute path if needed) prints a version, and the step doc records the path and version.
- **Status:** done

### Step 2 — Add `.gitignore`, the Pages workflow and the live link
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** yes (with Step 1)
- **Output:**
  - **`.gitignore`** at the repo root: `Thumbs.db`, `.DS_Store`, `desktop.ini`, `.vscode/`, `node_modules/`. Nothing in the project is excluded.
  - **`.github/workflows/pages.yml`:**
    - Triggers: `push` to `main`, plus `workflow_dispatch` (so the run can be re-started without a new commit).
    - `permissions: contents: read, pages: write, id-token: write`; `concurrency: group: pages, cancel-in-progress: false`.
    - Job `build` on `ubuntu-latest`: `actions/checkout`, `actions/setup-node` (Node 20 LTS or newer; the script uses only built-in modules), `node tests/portfolio/check-content.js` (default mode, no flags), `actions/configure-pages`, `actions/upload-pages-artifact` with `path: portfolio`.
    - Job `deploy` (`needs: build`, `environment: github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`): `actions/deploy-pages` with `id: deployment`.
    - Use the current major versions of the official actions.
  - **Root `README.md`:** one short "Live site" line with `https://abdallahmohamed220.github.io/portfolio/`. Nothing else in it changes.
  - Step doc `03-step-2-workflow-files.md`.
- **Done when:**
  - `node tests/portfolio/check-content.js` exits 0 locally (the same command CI runs).
  - `pages.yml` is valid YAML (parse it with Node or another available parser) and contains the check step before the upload step, and the upload `path` is `portfolio`.
  - No file under `portfolio/` or `tests/` is changed.
- **Status:** done

### Step 3 — `git init`, secret scan, first commit (no push)
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 2
- **Parallel:** yes (with Step 4)
- **Output:**
  - `git init -b main` at `d:\try_agent_workflow`, then `git add -A`. Do not change the user's git identity or global config.
  - **Secret scan of the staged files, before committing** (`git ls-files --cached` is the file list). At minimum, grep for: `ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`, `github_pat_`, `AKIA`, `-----BEGIN` (private keys), `xox[abp]-`, `sk-`, `AIza`, `password\s*[:=]`, `secret\s*[:=]`, `token\s*[:=]`, `api[_-]?key`, and files named `.env*`, `*.pem`, `*.key`, `id_rsa*`, `.npmrc`, `.git-credentials`. Every hit is listed in the step doc with its file and a verdict (false positive with reason, or real). The owner's email and phone on the site, and local scratchpad paths in `docs/`, are expected and not findings.
  - If anything real is found: stop, do not commit, and return it as an open question.
  - Check that binaries were staged unchanged: the staged blob hash of `portfolio/assets/cv.pdf` and `avatar.jpg` equals `git hash-object` of the working file (guards against line-ending conversion).
  - One commit of the whole project. The commit message ends with the required Co-Authored-By line, which the orchestrator passes in the step prompt.
  - No remote is added and nothing is pushed.
  - Step doc `03-step-3-init-commit.md` (scan commands, hit list with verdicts, commit hash, file count).
- **Done when:**
  - `git status` is clean, `git log` shows exactly one commit on `main` by the user's identity with the Co-Authored-By trailer.
  - `git ls-files` includes `portfolio/`, `tests/`, `docs/`, `.claude/`, `CLAUDE.md`, `README.md`, `.gitignore`, `.github/workflows/pages.yml`.
  - The scan has zero real findings. `git remote -v` is empty.
- **Status:** done

### Step 4 — USER/orchestrator gate: GitHub login and repo check
- **Agent:** none — USER/orchestrator gate, not delegated. No subagent can do this: it needs the user's interactive login, and only the orchestrator talks to the user.
- **Skills:** none
- **Depends on:** step 1
- **Parallel:** yes (with Step 3)
- **Output:**
  - The orchestrator asks the user to run `gh auth login` themselves (GitHub.com, HTTPS, answer **yes** to "Authenticate Git with your GitHub credentials", browser login). The user may need a new terminal, or the absolute path from Step 1.
  - The orchestrator then runs `gh auth status` (never with `--show-token`) and confirms the logged-in account is exactly `AbdallahMohamed220`. If it is different: stop and ask the user.
  - The orchestrator runs `gh repo view AbdallahMohamed220/portfolio` and confirms it fails with "not found". If the repo exists: stop and ask the user; never overwrite it.
  - The orchestrator records the result (account name, repo-absent check) in `02-plan.md` under this step. No token text is copied anywhere.
- **Done when:** the login is `AbdallahMohamed220`, the `portfolio` repo does not exist, and the user has said so or the command output shows it.
- **Status:** done

### Step 5 — Create the public repo, enable Pages, push, and confirm the deploy
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** steps 3, 4 (do not start unless the Step 3 scan passed and the Step 4 gate cleared)
- **Parallel:** no
- **Output:**
  - Re-check right before acting: `gh auth status` shows `AbdallahMohamed220`, and `gh repo view AbdallahMohamed220/portfolio` still fails. If either is off, stop and return the question.
  - `gh repo create AbdallahMohamed220/portfolio --public --source d:\try_agent_workflow --remote origin` (no `--push` yet).
  - Enable Pages with Source = GitHub Actions: `gh api -X POST repos/AbdallahMohamed220/portfolio/pages -f build_type=workflow`. If GitHub rejects this on an empty repo, push first, then enable Pages, then start the run with `gh workflow run pages.yml`.
  - `git push -u origin main`.
  - Watch the run with `gh run watch` / `gh run view`. If it fails, read the log, fix only `pages.yml` with a new commit (same Co-Authored-By rule), and push again. Any other kind of failure goes back as an open question.
  - Nothing that could contain a token is written to the step doc (no `gh auth status --show-token`, no remote URLs with credentials).
  - Step doc `03-step-5-publish.md` (repo URL, Pages API response summary, run id and URL, per-step result including the check step).
- **Done when:**
  - `https://github.com/AbdallahMohamed220/portfolio` exists, is public, and `main` matches the local `main` commit.
  - `gh api repos/AbdallahMohamed220/portfolio/pages` shows `build_type: workflow`.
  - The latest Pages workflow run is `success`, and its log shows the `check-content.js` step passed.
- **Status:** done

### Step 6 — Verify the live site
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** step 5
- **Parallel:** no
- **Output:**
  - `03-step-6-verify-live.md` with a pass/fail table and evidence for every DoD item in `01-requirements.md`.
  - Checks:
    - `https://abdallahmohamed220.github.io/portfolio/` returns 200 and serves the portfolio (allow a few minutes of CDN delay; retry, don't fail on the first 404).
    - `content.js`, `script.js`, `styles.css`, `assets/avatar.jpg`, every project icon referenced in `content.js`, and `assets/cv.pdf` all return 200 under `/portfolio/`.
    - Headless Chrome over CDP (approach from `docs/portfolio-real-content/03-step-5-verify.md`): real content rendered, no console errors, no failed network requests, the EN/AR toggle and the theme toggle work.
    - Download CV on the live site: the downloaded file's SHA-256 equals that of `portfolio/assets/cv.pdf`.
    - Repo side: the repo is public, `main` has the whole project, and a grep of the cloned or fetched tree finds no token patterns (the Step 3 list).
  - Test scripts and downloads stay in the scratchpad. Nothing is added to the repo, because it is already pushed.
- **Done when:** every DoD item has a result with evidence; failures are reported with reproduction steps, and no production file is changed.
- **Status:** done

## Risks / open questions
- **Pages enable on an empty repo:** the Pages API may refuse `build_type=workflow` before the first push. Step 5 has a fallback order (push, enable, `gh workflow run`), which is why `pages.yml` includes `workflow_dispatch`.
- **First-run timing:** the first deploy can fail if Pages was enabled seconds before the run started, or the site can 404 for a few minutes after a green run. Step 5 re-runs once; Step 6 retries before reporting a failure.
- **PATH after winget:** a shell opened before the install will not find `gh`. Step 1 records the absolute path; the user may need a new terminal for `gh auth login`.
- **Line endings on Windows:** `core.autocrlf` could rewrite text files; binaries are checked in Step 3. CRLF in JS/CSS does not affect the site or the Linux check run.
- **Open question for the user:** the step docs written after the commit (`03-step-*.md`, `04-review.md`, `05-summary.md`, plan status updates) will not be on GitHub unless pushed. Should the orchestrator make one more commit and push of `docs/deploy-github-pages/` after the review (this re-runs the deploy, which is harmless)? The plan does not include it until the user says yes.
- **Open question for the user:** the exact Co-Authored-By line for the commit. The orchestrator should confirm it and pass it to Steps 3 and 5.

## User decisions (plan approved 2026-11-18)
- After the review, make one final commit and push of this task's docs (step reports, review, summary and plan statuses).
- Every commit message ends with this trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- **Commit email (decided after Step 3):** use the GitHub noreply address `<id>+AbdallahMohamed220@users.noreply.github.com`, set as a repo-local `user.email` only. Re-author commit c8c209d with `git commit --amend --reset-author --no-edit` before the push. Remove the work email from `03-step-3-init-commit.md` before the final docs push.
- **Step 4 gate passed (orchestrator):** `gh auth status` shows the login `AbdallahMohamed220` (id 52679338), with the scopes repo, workflow, read:org and gist. `AbdallahMohamed220/portfolio` does not exist yet. The noreply email is `52679338+AbdallahMohamed220@users.noreply.github.com`.
