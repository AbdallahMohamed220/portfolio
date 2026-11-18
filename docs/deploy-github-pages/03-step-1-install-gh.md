# Step 1: Install the GitHub CLI

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Checked first: `gh` was not on PATH and `C:\Program Files\GitHub CLI\` did not exist. winget is v1.29.380.
- Installed the GitHub CLI with the approved command:
  `winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements`
  Result: `Found GitHub CLI [GitHub.cli] Version 2.105.0` → installer hash verified → `Successfully installed` (MSI `gh_2.105.0_windows_amd64.msi`).
- **gh.exe path:** `C:\Program Files\GitHub CLI\gh.exe`
- **Version:** `gh version 2.105.0 (2026-11-17)`
- The installer added `C:\Program Files\GitHub CLI\` to the machine PATH. Shells that were opened before the install do not see it, so later steps should call gh by its absolute path, or the user should open a new terminal.
- No `gh auth` command of any kind was run. No login, no token.

## Files touched
- `docs/deploy-github-pages/03-step-1-install-gh.md` — this step doc (new).
- No repo files changed. The only system change is the GitHub CLI install under `C:\Program Files\GitHub CLI\`.

## Decisions
| Decision | Reason |
|----------|--------|
| Call gh by its absolute path for verification | The current shell's PATH was loaded before the install, so a bare `gh` call would fail. |
| Did not run `gh auth login` / `gh auth status` | Login is the user's job in the Step 4 gate; agents never handle credentials. |
| Did not edit `02-plan.md` statuses | The orchestrator owns plan statuses. |

## Verification
- Bash: `"/c/Program Files/GitHub CLI/gh.exe" --version` → `gh version 2.105.0 (2026-11-17)`, exit 0.
- PowerShell: `& 'C:\Program Files\GitHub CLI\gh.exe' --version` → same output.
- `[Environment]::GetEnvironmentVariable('Path','Machine')` contains `C:\Program Files\GitHub CLI\`.

## Open questions / follow-ups
- For Step 4: the user should run `gh auth login` in a **new** terminal (so PATH includes gh), or use `& 'C:\Program Files\GitHub CLI\gh.exe' auth login` in an existing PowerShell window.
