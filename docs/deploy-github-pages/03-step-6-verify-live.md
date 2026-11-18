# Step 6: Verify the live site

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Ran read-only repo checks with `gh` (`gh auth status`, `gh api`, `gh run view`). The token was never printed.
- Downloaded the pushed `main` tarball through `gh api .../tarball/main` and compared it with the local commit `1973c08`. Then scanned it for token patterns and for the work email domain.
- Ran `curl` on the live URL and on every asset, and compared the bytes of all 18 served files with the pushed files.
- Wrote and ran a CDP harness, `verify-live.js`, against `https://abdallahmohamed220.github.io/portfolio/` in headless Chrome 157 (Node v22.21.0). Result: **25 passed, 0 failed**.

## Files touched
- `docs/deploy-github-pages/03-step-6-verify-live.md`: this doc. It is not committed.
- Nothing in the repo was changed, committed or pushed. HEAD is still `1973c08`, and `git status` is the same as before the step.
- Scratch files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\live\`:
  - `verify-live.js`: the harness;
  - `out.txt`: its log;
  - `results.json`;
  - `run-log.txt`: the Actions log;
  - `remote.txt`, `local-commit.txt` and `local-lsfiles.txt`: the tree lists;
  - `dl-tar\`: the pushed tarball;
  - `local-export\`;
  - `downloads\`: the CV downloaded from the live site.

## Decisions
| Decision | Reason |
|----------|--------|
| Compared the trees by path and blob SHA (`git/trees?recursive=1` against `git ls-tree -r 1973c08`), and also diffed the downloaded tarball | Matching blob SHAs prove the content is byte-identical, which a path list alone does not. The tarball diff is an independent check that does not use the local `.git`. |
| Diffed the tarball with `--strip-trailing-cr` | The local `core.autocrlf=true` makes `git archive` write CRLF, while GitHub serves LF. The blob SHAs already prove the content is identical. |
| Also ran a token-shape regex (a prefix followed by 30 or more characters) | The plain prefix grep hits the plan's own list of scan patterns. The shape regex tells a real token apart from that list. |
| Wrote the work-email domain as `evision-corp[.]org` and left the token prefixes out of this doc | This doc goes in the final docs push. Writing the literal strings would create new hits for the same greps. |
| Checked the project-title order against the run's list, not a value from `content.js` | In `content.js`, the titles are under `en.projects` in a shape the harness did not parse. It fell back to "12 distinct non-empty titles". The rendered order (Alriyadh App … Bedayat) is the CV order recorded in `docs/portfolio-real-content/03-step-5-verify.md`. |
| Ran the theme test with the system set to light | A saved "dark" choice that survives a reload is then clearly persistence, not the system default. |

## Verification

### Definition of done: pass/fail
| # | DoD item | Result | Evidence |
|---|----------|--------|----------|
| 1 | `gh auth status` shows the login; no token in any file | **PASS** | "Logged in to github.com account AbdallahMohamed220 (keyring)", active account, protocol https. The token-prefix grep (gho, ghp, ghu, ghs, ghr and github_pat, each followed by `_`) found only `docs/deploy-github-pages/02-plan.md:59`, in three places: the pushed tarball, `git grep 1973c08`, and the working tree. That line is the plan's own list of scan patterns. The working tree also matches the Step 3 doc's table, which lists those patterns. A token-shape regex (one of those prefixes followed by 20 to 30 or more token characters) found **0** hits in the pushed tree, and also 0 in the Actions log. |
| 2 | Public repo exists; `main` has the whole project | **PASS** | `gh api repos/AbdallahMohamed220/portfolio` shows `visibility: public`, `private: false` and `default_branch: main`. There is 1 commit on `main`, `1973c0816308…`. The remote tree has 69 blobs (not truncated). Its paths and blob SHAs are **identical** to `git ls-tree -r 1973c08`, and its path list equals the local `git ls-files`. Files per area: `portfolio/` 19, `tests/` 1, `docs/` 31, `.claude/` 14, plus `CLAUDE.md`, `README.md`, `.gitignore` and `.github/workflows/pages.yml`. The tarball matches `git archive 1973c08` apart from CRLF. |
| 3 | Pre-push secret scan finds nothing | **PASS (re-checked after the push)** | Step 3 did the scan. I re-ran the token greps on the pushed tree: no real findings (see item 1). |
| 4 | Pages workflow succeeded, including the check step | **PASS** | Only one run exists: `44329080970`, event `push`, head `1973c08`, `conclusion: success`. In the build job, steps 1–6 succeeded: Checkout, Set up Node, **Check portfolio content**, Configure Pages and Upload Pages artifact. In the deploy job, Deploy to GitHub Pages succeeded. Log line: `34 passed, 0 failed (default mode; add --cv for CV fidelity).` `gh api .../pages` shows `build_type: workflow`, `https_enforced: true` and `public: true`. |
| 5 | Live URL returns 200 and serves the portfolio | **PASS** | `/portfolio/` and `/portfolio/index.html` return 200 `text/html` with `<title>Portfolio</title>`. `/portfolio` without the slash returns 301 to `/portfolio/`. In Chrome, the document response is 200 and the final URL is `https://abdallahmohamed220.github.io/portfolio/`. |
| 6 | `content.js`, `script.js`, `styles.css`, the avatar, the project icons and `cv.pdf` return 200 | **PASS** | All 19 URLs returned 200 with the right MIME type: `content.js`, `script.js`, `styles.css`, `assets/avatar.jpg`, `assets/cv.pdf` (175,811 B) and all **12** project images from `content.js`. All 18 served files (`index.html`, the 3 code files and the 14 assets) are byte-identical (SHA-256) to the pushed files. **Sub-path:** every page reference is relative (`styles.css`, `content.js`, `script.js`, `assets/…`). In Chrome, all 18 same-origin requests were 200 under `/portfolio/`, and the 13 images loaded from `/portfolio/assets/`. The site root `/` returns 404 (no user site), as expected, and no request went there. |
| 7 | Headless Chrome: real content, no console errors, EN/AR and theme toggles work | **PASS** | **EN:** the h1 is "Abdallah Mohamed". There are 12 project cards (Alriyadh App … Bedayat), all 13 images are loaded, and no `data-i18n` element is empty. The 5 contact `href`s equal `content.js`: `mailto:Dev.Fluttery@gmail.com`, `tel:+201147234230`, the GitHub, LinkedIn and `shorturl.at/QYQxr` links.<br>**AR:** a real click gives `lang=ar` and `dir=rtl`, and the computed direction is `rtl`. The h1 is "عبدالله محمد", there are 12 cards, `portfolio-lang=ar` is saved, and AR persists after a reload. Switching back gives `en`/`ltr`.<br>**Theme:** with the system set to light, a click changes light to dark, saves `portfolio-theme=dark`, and changes the background from `rgb(255,255,255)` to `rgb(15,17,23)`. Dark persists after a reload, and switching back to light also persists.<br>**360px:** EN and AR both have `scrollWidth == clientWidth == 360` on `html` and `body`, and `scrollTo(500)` leaves `scrollX = 0`.<br>**Clean run:** across the whole run (68 requests, all to `abdallahmohamed220.github.io`) there were **0** console errors or warnings, exceptions, `Log` errors, failed loads or ≥400 responses. |
| 8 | Download CV on the live site is byte-identical | **PASS** | A real click on `#cv-link` started a download from `https://abdallahmohamed220.github.io/portfolio/assets/cv.pdf` with the suggested name `cv.pdf`. It completed at 175,811 B, and the page stayed on `/portfolio/`. SHA-256 for both the download and the local `portfolio/assets/cv.pdf`: `6f6609a598cb3990c90919fb99c92579b645a9416a683d1938d01867753be147`. |
| 9 | Direct link given to the user and recorded in `05-summary.md` | **N/A for this step** | The orchestrator does this. The verified link is https://abdallahmohamed220.github.io/portfolio/ |
| extra | Commit author is the noreply address; no work email in the pushed history or files | **PASS** | GitHub's API for `main` shows the author and committer as `Abdallah Mohamed <52679338+AbdallahMohamed220@users.noreply.github.com>`, and the message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. `git log --all` shows only the noreply email, and no commit message mentions evision. A case-insensitive grep for `evision-corp[.]org` and for `@evision` gives **0** hits in the pushed tarball and in `git grep 1973c08`. Other "evision" hits in the pushed files are expected: the public company site `evision-corp.com`, app ids and store slugs, and local `C:\Users\Evision\…` paths in docs (accepted in the requirements). |

### Harness output (`out.txt`, end)
```
PASS  Download CV: SHA-256 equals local portfolio/assets/cv.pdf
PASS  Page stayed on index after CV click
PASS  No console errors/warnings, exceptions, failed or >=400 requests over the whole run  -- []
Requests seen: 68 (abdallahmohamed220.github.io)

25 passed, 0 failed.
```

To reproduce, run `node C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\live\verify-live.js`.

## Open questions / follow-ups
- **Before the final docs push:** _(Resolved by the orchestrator: the domain is now written as `evision-corp[.]org` in the Step 5 doc.)_ `03-step-5-publish.md` (not committed yet) contains the literal work-email domain twice. It appears in its Decisions row and in a Verification bullet, both as the grep pattern, not as an address. Once that doc is pushed, the exact domain grep would get 2 hits in the repo. Recommendation: write it as `evision-corp[.]org` in that doc before the push. The Step 3 doc and the plan are clean for this string.
- After the final docs push, the deploy runs again. A quick `curl` of `/portfolio/` and `gh run list` can confirm it, and this step's checks do not need to be repeated.
- These checks were not done here: real phones and other browsers; resolving the short store and Stack Overflow URLs. They are the same items as the manual checklist in `docs/portfolio-real-content/03-step-5-verify.md`.
