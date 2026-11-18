# Review: Fill the portfolio with real CV content and photo
**Verdict:** APPROVED (after re-review loop 2; the loop 1 verdict was CHANGES NEEDED, see below)

Reviewed by: reviewer, 2026-11-18. There is no git repository, so the changed files were found by modification time. Every changed file is under `portfolio/`, `tests/portfolio/` or `docs/portfolio-real-content/`. I read all the docs in this folder, `docs/personal-portfolio/01-requirements.md`, `portfolio/{index.html,script.js,styles.css,content.js,README.md}` and `tests/portfolio/check-content.js`.

What I ran myself:
- `node tests/portfolio/check-content.js` from `d:\try_agent_workflow`: **37 passed, 0 failed, exit 0**.
- `sha256sum`: `assets/cv.pdf` and the source resume are both `6f6609a5…be147`. `assets/avatar.jpg` and the source photo are both `71119f98…eac3531`.
- An independent script (`scratchpad/rev-urls.js`) took the 39 unique `/URI` values from the PDF with `grep -a`. Every URL in `content.js` (23 store, 4 company, 6 certificate, GitHub, LinkedIn, Stack Overflow) is one of the PDF's URIs. DoctorCrypto's App Store is `null`. The only PDF URIs not used directly are the getportify link (excluded on purpose), plus the `mailto:` and `tel:` URIs, which the site builds from `links.email` and `links.phone`.
- `grep` found no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` or `eval`, and no physical `left`/`right` margin, padding, border, float or text-align in the CSS.

I did not repeat the browser checks. For DoD items that need a browser, I relied on Step 5's CDP evidence after reading the code paths it exercises.

## Definition of done
| Item | Result | Evidence |
|------|--------|----------|
| 1. Real photo with EN/AR alt, name "Abdallah Mohamed", role "Mobile Developer"; no placeholders | PASS | `shared.images.avatar` = `assets/avatar.jpg`, hash-identical to the source. `hero.avatarAlt` is real in both languages. The name and role are correct, and the AR wording is a user decision. The placeholder scan in the check script passes, and Step 5 also scanned the DOM and attributes. |
| 2. About = CV profile paragraph, EN and AR | PASS | `en.about.paragraphs[0]` equals `cv-data.en.json` (check script). The AR text is a faithful translation and keeps "السنوات الخمس". |
| 3. 12 projects, newest first, with period, description, contributions, challenge where present, and exact store URLs | PASS | The `shared.projects` order matches the requirements list, and the periods run in descending order. The store URLs are in the PDF `/URI` set (my script). `renderProjects` hides null store buttons and leaves out `<details>` when both contributions and challenge are empty (Bedayat). These follow the user decisions. |
| 4. 4 jobs with dates, locations, company links | PASS | E.VISION 12/2023 – present, Cairo, `http://www.evision-corp.com/` (kept as http by user decision). Alwsata, Csskw and Rizme match the requirements table. `renderExperience` renders the company through `externalLink`. |
| 5. 12 skills; education; 6 certificates with Udemy links; languages | PASS | Counts are 12/1/6/2. Certificate URLs come from the PDF and are joined by id through `shared.certificates`. Titles stay in English in AR, which is a user decision. |
| 6. Contact: mailto, tel, GitHub, LinkedIn, Stack Overflow | PASS | `renderContact` builds `mailto:` + email and `tel:+201147234230`. The display text is `+20 114 723 4230` in `dir="ltr"`. The profile URLs match the requirements table. |
| 7. Download CV is byte-identical | PASS | SHA-256 matches (I ran it). Step 5 downloaded over http and `Buffer.compare` returned 0. |
| 8. Original DoD still holds in both languages | PASS (with note) | Step 5's table covers all 10 original items in EN and AR. The code still uses `textContent` only, logical properties, the reduced-motion paths and the Escape/focus-return for the menu. Note: the original item 1 says "with placeholder content", which is now intentionally real content. Also see non-blocking item N1 (the EN header wraps). |
| 9. `check-content.js` passes and covers the new fields | PASS | 37/37 and exit 0 when I ran it. Step 4 mutation-tested it with 53 cases. See blocking issue B1 for a design problem. B1 does not mean the check fails today. |
| 10. README matches the new `content.js` structure | PASS for the schema; FAIL for the overall README contract (see B1) | Every key and asset in the README exists (Step 3's 213-check audit, and I spot-checked it). But the README's editing and replacement instructions now contradict the repo's check script, which the README never mentions. |

## Blocking issues
| # | Issue | File | Fix by agent |
|---|-------|------|--------------|
| B1 | **The check script is a snapshot of the CV, and it contradicts the README.** By default, `check-content.js` reads `docs/portfolio-real-content/cv-data.en.json`, a task-history doc, and requires these to match it: exact counts (12/4/12/6/2), every URL, all EN text, null/empty only where the CV has them, and challenge only where the CV has one. It also hard-codes the resume SHA-256 and requires the avatar to be `.jpg`. The README tells the owner to do things that each make the check fail: edit any text in `content.js`, add or remove projects, jobs or certificates ("lists … can be any length"), replace `assets/cv.pdf` with a new PDF, and point `images.avatar` at any new image. The README never mentions the check script, so the owner gets failures with no explanation. The only way to make it pass again would be to edit a file under `docs/`, which is the wrong place for live content. This breaks checklist item 7 (docs match code), and it turns the project's only automated check into a trap after the first edit. | `tests/portfolio/check-content.js`, `portfolio/README.md` | tester (script), then developer (README) |
| | **Fix for the script (tester):** split the checks into two modes. **Default mode** (no flag) does not read anything under `docs/`, and it keeps the generic rules: en/ar shape; ids match and are unique; at least 1 project, job, skill, certificate and language, plus a complete education block; required project fields; `contributions` is an array; `challenge` is in both languages or neither; both store keys are present (string or `null`) and at least one is non-null; every non-null external URL is valid `http(s)`; the email is a plain address; `links.phone` matches `^\+\d+$`; `phoneDisplay` has the same digits; script.js builds `tel:`/`mailto:`; asset paths exist; each project has its own image; the PDF sanity check (header, `%%EOF`, size); placeholders; i18n paths; no hard-coded HTML text; img alt. **CV mode** (`--cv [path]`, where the path defaults to the current docs JSON) also runs the current fidelity checks: exact counts, URL equality, EN text equality, null/empty/challenge only where the CV has them, the avatar is `.jpg`, and the SHA-256. Read the SHA from `cv-data.en.json` `_meta.sourceSha256` instead of hard-coding it, so that all the snapshot data lives in one place. Update the header comment. Then run: (a) default mode exits 0; (b) `--cv` exits 0; (c) on a scratch copy, editing one EN description and adding a 13th project passes default mode and fails `--cv`; (d) a few of Step 4's generic mutations still fail in default mode (a broken shape, `ftp://`, a missing asset, a placeholder). Update `03-step-4-check-script.md`. | | |
| | **Fix for the README (developer):** add a short "Check your edits" section. It should give the command `node tests/portfolio/check-content.js` (run from the repo root), say what default mode checks, and explain that `--cv` compares the site with the original CV extract from this task. Say that `--cv` is expected to fail once the content is edited on purpose. Update `03-step-3-readme.md`. | | |

## Decisions on the two questions raised

**1. The header wraps in English (≤375px and about 753px wide): NON-BLOCKING (N1). It should be fixed, and the developer is the agent to fix it.**
- **Why it is not blocking:** no DoD item fails. There is no horizontal scroll, the nav is usable, no focus is hidden, and anchors land below the header because the sections have padding. It is a visual regression that the longer real name introduced. A sticky header that is 84–99px tall instead of 64px costs about 35px of viewport on small phones, and the header is now taller than `--header-h`, which is used for `scroll-margin-block-start`.
- **Exact change** (in `portfolio/styles.css`; the markup stays the same):
  - `.header-inner`: `flex-wrap: nowrap;`
  - `.brand`: `flex: 1 1 auto; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;`. Keep the existing `margin-inline-end: auto`. The full name stays in the DOM, so the accessible name doesn't change.
  - `.site-nav`, `.header-actions`: `flex-shrink: 0;`
  - Inside `@media (min-width: 768px)`: `.nav-menu, .js .nav-menu { flex-wrap: nowrap; }`. If the brand would then shrink to less than about 6 characters at 753–800px, also reduce the padding to `.nav-link { padding-inline: 0.5rem; }` in that range, or reduce the brand to `font-size: 1rem` below 400px.
- **Verify:** EN and AR at 320, 360, 375, 753 (768 with a scrollbar), 768, 1024 and 1280px. The header must be 64–65px tall at every width, there must be no horizontal scroll, the hamburger must stay on the first row below 768px, and the brand ellipsis may appear only where the space really runs out. The tester re-runs Step 5's header probe (`hdr2.js`) and the overflow and keyboard checks.

**2. The check script is too tied to the CV: BLOCKING (B1 above).**
- **Not acceptable as it stands.** The approved plan did ask for the counts and the expected URLs, and it is right to keep CV fidelity checkable for this task's sign-off. But making it the default behaviour has three problems: the check reads a `docs/` file, it hard-codes the PDF hash, and the README is silent about all of it. Together, these mean the README's own instructions break the check.
- **The fix:** make the fidelity checks opt-in (`--cv`), keep the generic checks as the default, and document both modes in the README. The CV data stays in `docs/` as the task record. Live content stays only in `content.js`.

## Non-blocking suggestions
- **N1:** the EN header wraps. See the decision above. Fix by: developer, then a tester re-check.
- **N2:** the plan names the step docs `03-step-1-cv-data.md` and `03-step-2-content-markup.md`, but the files are `03-step-1-extract-cv.md` and `03-step-2-site-update.md`. Both step docs record this. Update the names in `02-plan.md` so the links resolve. Fix by: orchestrator or planner (docs only).
- **N3:** `script.js` sets `href` from `content.js` without checking the scheme at runtime. That is acceptable, because the content is authored by the owner and the check script enforces `http(s)` (and must keep doing so in default mode after B1). This is not a defect, and no change is required.
- **N4:** the original task's DoD item 1 still says "with placeholder content". Content is now real by design. Note this in `05-summary.md` so that a later reader doesn't treat it as a regression. Fix by: orchestrator.
- **N5:** the manual checklist in Step 5 is still open: resolve the short store links, review the Arabic copy, test with a screen reader, and test on a real phone. These are for the user and are outside the automated scope.

## Checklist summary
- **Scope:** OK. Only `portfolio/`, `tests/portfolio/check-content.js` and this task's docs changed. No redesign was made beyond the card, credentials and contact markup that the plan allowed.
- **Correctness:** OK. Null store URLs, an empty contributions list, a challenge in both languages or neither, open `<details>` kept across a language switch, and id joins with fallbacks are all handled.
- **Security:** OK. `textContent` only, through `el()`. External links use `rel="noopener noreferrer"`. There are no secrets. The phone and email are intentionally public.
- **RTL:** OK. Only logical properties are used. Latin titles use `dir="auto"`, and the phone and email values use `dir="ltr"`.
- **Accessibility:** OK. The heading order is h1 > h2 > h3 > h4. The summaries have `aria-describedby` set to the card title. Alt text is set in both languages. The 44px targets and the focus outlines remain.
- **Content fidelity:** OK. URLs match the PDF, the order is newest first, the user decisions are applied, and the spelling fixes keep the meaning.
- **Tests:** they exist and pass, and they were mutation-tested. Their design is the subject of B1.
- **Docs:** every step has a doc, and the plan's statuses are done. There is a README/check mismatch (B1) and a doc-name mismatch (N2).

---

# Re-review (loop 2)
**Verdict:** APPROVED

Reviewed by: reviewer, 2026-11-18. I read the "Review fix 1" sections in `03-step-2-site-update.md`, `03-step-3-readme.md` and `03-step-4-check-script.md`, the whole CLI and mode logic of `tests/portfolio/check-content.js`, the "Check your edits" section of `portfolio/README.md` (I read it after the developer's final CLI follow-up), the header and nav rules in `portfolio/styles.css`, and `02-plan.md`.

## What I ran myself (from `d:\try_agent_workflow`, Node v22.21.0)
- `node tests/portfolio/check-content.js`: **31 passed, 0 failed, exit 0**.
- `node tests/portfolio/check-content.js --cv`: **40 passed, 0 failed, exit 0**.
- `--cv=docs/portfolio-real-content/cv-data.en.json` gives exit 0. `--help` prints the usage and gives exit 0. `--foo` gives exit 2.
- **No docs reads in default mode:** I wrote my own preload hook (`scratchpad/rr2/hook.js`) that exits with code 3 when `readFileSync`, `existsSync`, `statSync`, `readdirSync`, `openSync` or `accessSync` touches a path containing `/docs/`. Default mode under the hook exits 0. `--cv` under the hook exits 3, which shows the hook works.
- **The B1 scenario, on my own scratch copy** (`scratchpad/rr2/p`): I edited the first EN project description and added a 13th project (shared + en + ar, with its own SVG). Default mode, under the docs hook: **31/0, exit 0**. `--cv`: **37/3, exit 1**, with clear messages (`shared.projects has 13, the CV has 12`, the URL diff and the EN text diff).
- **A generic rule still bites in default mode:** on the same copy, an `ftp://` store URL gives exit 1 (`valid http(s) URLs` FAIL).
- `grep 6f6609` in the script finds 0 matches. The PDF hash now comes only from `_meta.sourceSha256`, and the counts come from the JSON.
- I re-ran the developer's header probe `scratchpad/fix1-dev/hdr-fix1.js` (headless Chrome): **14/14 PASS**, ALL PASS. The header is 65px in EN and AR at 320, 360, 375, 753, 768, 1024 and 1280. There is no horizontal scroll. The mobile menu opens below the header, has no horizontal scroll and closes with Escape. 4 keyboard stops are visible on mobile and 7 on desktop. The ellipsis shows only in EN at 320, 360, 375 and 768 with a scrollbar.

## Previous findings
| # | Status | Evidence |
|---|--------|----------|
| B1 (script) | **RESOLVED** | Default mode reads nothing under `docs/` (hook evidence above), keeps every generic rule the review listed, and stays green after deliberate edits. `--cv [path]`, `--cv=<path>` add the 9 fidelity checks, and the snapshot data lives only in the JSON. The header comment documents both modes and exit codes 0/1/2. |
| B1 (README) | **RESOLVED** | "Check your edits" gives the exact command forms the script accepts: no flag, `--cv`, `--cv <path>`, `--cv=<path>` and `--help`. It also covers the optional `portfolioDir` before `--cv` (matching the parser, which takes the argument after `--cv` as the path), exit codes 0/1/2 (matching `process.exit` in the script), what default mode checks (matching the header comment items 1–12), and that `--cv` is expected to fail after deliberate edits. Nothing in the README contradicts the script's behaviour any more. |
| N1 | **RESOLVED** | `.header-inner` is `nowrap`. `.brand` has `flex: 1 1 auto; min-width: 0` and the ellipsis. `.site-nav` and `.header-actions` have `flex-shrink: 0`. The desktop `.nav-menu` is `nowrap`. Verified at 65px above. |
| N2 | **RESOLVED** | `02-plan.md` now names `03-step-1-extract-cv.md` and `03-step-2-site-update.md`. |
| N3 | No change needed | Default mode still enforces `http(s)` for every non-null URL (my ftp mutation). |
| N4, N5 | Still open, for the orchestrator and the user | N4 goes into `05-summary.md`. N5 is the manual checklist. |

## Can the CSS change break RTL or the mobile menu?
- **RTL:** no. All the new properties are direction-neutral (`flex`, `min-width`, `overflow`, `white-space`, `text-overflow`, `flex-shrink`, `flex-wrap`). The existing `margin-inline-end: auto` is logical, and a grep finds no physical `left`/`right` margin, padding, border, float or text-align. In RTL the ellipsis would appear at the inline end. The AR name is short, so it never truncates (probe: `ellipsis=false` for every AR width).
- **Mobile menu:** no. `.js .nav-menu` is `position: absolute; inset-block-start: 100%; inset-inline: 0`, and its containing block is the sticky `.site-header`, not `.site-nav`. So `flex-shrink: 0` on `.site-nav` and `nowrap` on `.header-inner` do not change its width or position. The `order` swap at 768px is unchanged. The probe confirms the menu sits below the header, has no horizontal scroll and closes with Escape at every mobile width in both languages.
- **Focus:** `overflow: hidden` on `.brand` clips its descendants, not its own outline. The developer's screenshot `en-360-brand-focus.png` and the probe (`focus=…:true`) confirm the outline is visible.

## Blocking issues
| # | Issue | File | Fix by agent |
|---|-------|------|--------------|
| — | None | — | — |

## Non-blocking suggestions (new, optional)
- **N6:** `parseArgs` treats the argument after `--cv` as a path unless it starts with `--`, so `--cv -h` would read `-h` as the CV path, and then `--cv` fails loudly on a missing file. That is harmless, because it is a loud failure and not a silent pass. Optional fix by tester: reject a next argument that starts with `-`.
- **N7:** with JS disabled, `nowrap` plus `.site-nav { flex-shrink: 0 }` keeps the in-flow nav on the header row. This has no visible effect today, because all nav text comes from `script.js` (no-JS shows empty links). If hard-coded fallback link text is ever added, re-check the header at 320px. No action now.
- **N8:** `--header-h` is 64px, but the header renders at 65px (it has a 1px border), so `scroll-margin-block-start` is 1px short. This existed before this task and is invisible because of the section padding. No action needed.

## Final verdict
**APPROVED.** B1 is resolved in both the script and the README, N1 and N2 are resolved, and both check modes pass when I run them. N4 (a note in `05-summary.md`) and N5 (the manual checks) remain for the orchestrator and the user.
