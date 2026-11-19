# Plan: Give Education and Certificates their own sections

**Requirements:** ./01-requirements.md

Context: the markup contract is in `docs/portfolio-real-content/03-step-2-site-update.md`. The CDP verification approach (headless Chrome, `file://`, scripts in the scratchpad) is in `docs/portfolio-real-content/03-step-5-verify.md`. The publish flow and repo identity are in `docs/deploy-github-pages/05-summary.md`. Nothing about the codebase is unknown, so there is no research step. The orchestrator runs the final review separately.

Where the changes go:
- `portfolio/index.html`:
  - nav lines 66–71 have 4 links;
  - Skills & Experience is lines 133–163;
  - `.credentials` (lines 145–160) holds `#education`, `#certificates` and `#languages`;
  - Contact starts at line 166.
- `portfolio/content.js`: `en.nav` (lines 143–149) and `ar.nav` (lines 460–466). `education.title` and `certificates.title` already exist in both languages (AR: "التعليم" and "الشهادات").
- `portfolio/styles.css`:
  - `.nav-menu` / `.nav-link` are at lines 339–380, and the nav switches from hamburger to inline at `@media (min-width: 768px)` (line 848);
  - `.credentials` is at line 749, and appears again at lines 909–915 (including a `#certificates { grid-column: 1 / -1 }` rule that will now target the section) and line 946;
  - `section` has `scroll-margin-block-start: var(--header-h)` at line 421, so new sections get the offset for free.
- `portfolio/script.js` fills `#certificates-list` and `#languages-list` by id (lines 273–283) and handles `.reveal` generically. No change is expected.
- `portfolio/README.md` line 82 says "Education, certificates and languages are shown inside the Skills & Experience section."
- `tests/portfolio/check-content.js` checks content data and `data-i18n` paths (section 11, line 467), not section structure. It should pass once the `nav.*` keys exist in both languages. No change is expected.

Execution order: Step 1, then Step 2, then Step 3. Nothing runs in parallel.

## Steps

### Step 1 — Restructure markup, nav keys, CSS and README
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** no
- **Output:**
  - **`index.html`:**
    - Two new `<section class="section reveal">` elements with `id="education"` and `id="certificates"` and `aria-labelledby` pointing at a new `h2.section-title` (`data-i18n="education.title"` / `certificates.title`). They go between Skills & Experience and Contact, use the existing `.container` layout, and keep the existing content markup (`education-*` paragraphs, `#certificates-list`).
    - Skills & Experience keeps Skills, Experience and the Languages block only. The old `div` ids move, so the ids are not duplicated.
    - 6 nav links in page order.
  - **`content.js`:** `nav.education` and `nav.certificates` added in `en` ("Education", "Certificates") and `ar` ("التعليم", "الشهادات").
  - **`styles.css`:**
    - Remove or retarget the stale `.credentials` / `#certificates` grid rules.
    - Make the 6-link nav fit in one header row (64–65px) in EN and AR. Either tighten the link spacing, or raise the inline-nav breakpoint (for example to 1024px) so tablets use the hamburger.
    - Use logical properties only.
  - **`script.js`:** change only if needed.
  - **`README.md`:** update the sections list and line 82.
  - **`check-content.js`:** change only if a check fails because of the old structure.
  - Step doc `03-step-1-site-update.md`, which records the nav-fit decision and the reason for it.
- **Done when:**
  - Both `node tests/portfolio/check-content.js` and `--cv` exit with 0.
  - Each of `education`, `certificates` and `languages` appears exactly once as an `id` in `index.html`.
  - A quick headless check at 768px and 1024px in EN and AR shows a single-row header and no horizontal scroll.
- **Status:** done

### Step 2 — Verify locally against the definition of done
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** step 1
- **Parallel:** no
- **Output:**
  - `03-step-2-verify.md`, with a pass/fail table and evidence for DoD items 1–7 in `01-requirements.md`, plus the earlier DoD items listed under Constraints.
  - The checks use CDP on `file://`, with scripts kept in the scratchpad:
    - section order and `h2`s;
    - the nav has 6 links in EN and AR, and clicking each one lands its heading below the sticky header;
    - header height and single row at 320, 360, 375, 768, 1024 and 1280px in EN and AR, with no horizontal scroll;
    - the mobile menu shows 6 links, can be used with the keyboard, and closes on Escape;
    - education text and all 6 certificate links are unchanged;
    - theme toggle, RTL, reduced motion and a clean console;
    - both modes of the check script.
  - The tester may add a structure check to `tests/portfolio/check-content.js` (test file only), for example: the nav `href`s match the section ids in order. Any new check must be seen to fail on a mutated scratch copy.
- **Done when:**
  - Every DoD item except the publish item has a result with evidence.
  - Check script output for both modes is captured, and both exit with 0.
  - Failures are reported with steps to reproduce, and production code is not changed.
- **Status:** done

### Step 3 — Commit, push, and confirm the live site
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 2 (all checks pass)
- **Parallel:** no
- **Output:**
  - One commit on `main` in `d:\try_agent_workflow\portfolio`. It contains the changed site files and this task's docs, if they are in the repo, as in the previous task. It uses the repo-local noreply identity and ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  - Run a secret and diff sanity scan before pushing. Use a plain `git push`, never a force-push.
  - Watch the Pages run with `"/c/Program Files/GitHub CLI/gh.exe" run watch`.
  - Run a headless check of https://abdallahmohamed220.github.io/portfolio/: 6 sections in order, 6 nav links in EN and AR, no console errors.
  - Step doc `03-step-3-publish.md`, with the commit SHA, run id and result, and the live-check evidence.
- **Done when:**
  - The push succeeds without force.
  - The Pages run concludes `success`.
  - The live page shows the Education and Certificates sections and nav links.
- **Status:** done

## Risks / open questions
- **Nav fit (main risk):** at 768px, the logo, 6 links (longer in AR) and the language and theme buttons may not fit in one row. Tightening the spacing may not be enough, and the fallback is raising the breakpoint to about 1024px. This is allowed by the requirements, but it means tablets in portrait get the hamburger menu.
- **Stale CSS:** the `#certificates { grid-column: 1 / -1 }` rule at 768px+ would now apply to the section element. Step 1 must remove or rescope it.
- **Languages block layout:** once Education and Certificates are gone, Languages is alone in `.credentials`. At 1280px it sits next to Experience, so the layout should still look balanced. The developer simplifies the wrapper only if needed, without redesigning.
- **Docs in the commit:** the requirements allow the docs in the same commit or in a follow-up. Step 3 includes them in the same commit if `docs/` is tracked by the repo. Otherwise it follows what the previous task did.
