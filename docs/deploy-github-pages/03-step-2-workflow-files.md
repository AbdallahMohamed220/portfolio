# Step 2: Add `.gitignore`, the Pages workflow and the live link

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Created `.gitignore` at the repo root. It excludes only OS/editor junk and `node_modules/`. Nothing in the project is excluded.
- Created `.github/workflows/pages.yml`:
  - Triggers: `push` to `main`, and `workflow_dispatch`.
  - `permissions`: `contents: read`, `pages: write`, `id-token: write`.
  - `concurrency`: `group: pages`, `cancel-in-progress: false`.
  - Job `build` (`ubuntu-latest`) runs these steps in order:
    1. `actions/checkout@v4`
    2. `actions/setup-node@v4` with Node 22
    3. `node tests/portfolio/check-content.js` (default mode, no flags)
    4. `actions/configure-pages@v5`
    5. `actions/upload-pages-artifact@v3` with `path: portfolio`
  - Job `deploy` (`needs: build`, environment `github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`) runs `actions/deploy-pages@v4` with `id: deployment`.
- Added one line under the title of the root `README.md`: `**Live site:** https://abdallahmohamed220.github.io/portfolio/`. Nothing else in the README changed.

## Files touched
- `.gitignore` — new
- `.github/workflows/pages.yml` — new
- `README.md` — added the "Live site" line (line 3)

## Decisions
| Decision | Reason |
|----------|--------|
| Node 22 in `setup-node` | The orchestrator asked for Node 22. The plan allows Node 20 LTS or newer, and Node 22 is also the local version (v22.21.0). |
| Actions: checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3, deploy-pages@v4 | These are the current official major versions I know, and the orchestrator listed them. If GitHub flags any of them as deprecated, Step 5 can bump the version in `pages.yml`. |
| `desktop.ini` added to `.gitignore` | The plan lists it (Windows junk), together with the requirements' `Thumbs.db`, `.DS_Store`, `.vscode/` and `node_modules/`. |
| No `cache:` option on `setup-node` | The project has no `package.json` or lockfile, so caching would fail. The script uses only built-in modules. |
| Step doc named `03-step-2-workflow-files.md` | The orchestrator's prompt gives this name. The plan says `03-step-2-repo-files.md`. |
| README line in English, under the title | It is one short line, and the URL is the same in any language. The Arabic body of the README is unchanged. |

## Verification
- `node tests/portfolio/check-content.js` from `d:\try_agent_workflow` printed `34 passed, 0 failed (default mode; add --cv for CV fidelity).` and exited 0.
- YAML check: no YAML library is installed (Python has no `yaml` module, and nothing was installed). I parsed `pages.yml` with a small Node block-YAML parser in the scratchpad (`yamlcheck.js`). The file has no tabs, no CR characters, consistent indentation and no duplicate keys, and it parses into the expected structure. These checks passed:
  - `push` trigger on `main`
  - `workflow_dispatch` trigger
  - the three permissions
  - concurrency `pages` / `false`
  - build step order checkout → setup-node → check → configure-pages → upload (indexes `[0,1,2,3,4]`)
  - `node-version` 22
  - the check is in default mode (no flags)
  - upload `path: portfolio`
  - deploy `needs: build` with the `github-pages` environment and the URL
  - `deploy-pages@v4` with `id: deployment`
- `find portfolio tests -newer docs/deploy-github-pages/02-plan.md -type f` printed nothing, so no file under `portfolio/` or `tests/` changed.
- New files are UTF-8 with LF line endings. The README keeps LF and has no BOM.

## Open questions / follow-ups
- None that block. Note for Step 3: `.github/` is a new top-level folder and must appear in `git ls-files`.
