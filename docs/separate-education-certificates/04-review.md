# Review: Give Education and Certificates their own sections
**Verdict:** APPROVED

Reviewed: commit `d31d87e` (`git show d31d87e`, code files `portfolio/index.html`, `content.js`, `styles.css`, `README.md`), the docs 01, 02, 03-step-1, 03-step-2 and 03-step-3, plus the working tree (`02-plan.md` modified, `03-step-3-publish.md` untracked). I ran the check script in both modes, compared the live files with the commit, and checked the Pages run read-only with `gh`. I did not change, commit or push anything except this doc.

## Definition of done
| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Six sections in order; Education and Certificates are top-level with their own `h2`, not inside Skills & Experience | PASS | Diff: `.credentials` and both `credential-block` divs are removed from `#skills`. Two new `<section class="section reveal">` elements (`#education`, `#certificates`) sit between `#skills` and `#contact`. Each has `aria-labelledby` pointing at its own `h2.section-title` (`#education-title`, `#certificates-title`). Live `index.html` section ids in order: about, projects, skills, education, certificates, contact. Step 2 checked this in the DOM in EN and AR. |
| 2 | Skills & Experience still shows Skills, Experience and Languages | PASS | `#languages` is now `div.languages-block`, a direct grid item of `.skills-layout`, with its `h3` and `#languages-list`. `script.js` fills it by id, so no JS change was needed. Step 2: 12 skills, 13 experience items and 2 languages in EN and AR. |
| 3 | 6 nav links in page order in EN and AR; Education and Certificates scroll to their sections; headings not under the sticky header | PASS | Diff adds `#education`/`#certificates` links between `#skills` and `#contact`. `nav.education`/`nav.certificates` were added in `en` ("Education"/"Certificates") and `ar` ("التعليم"/"الشهادات"). `.section` already has `scroll-margin-block-start: var(--header-h)`. Step 2 used real clicks at 360 and 1280 in EN and AR (24/24), and Step 1 also tested 768. |
| 4 | Header one row (64–65px) at 320–1280 in EN and AR with no h-scroll; mobile menu shows 6 links and works with the keyboard | PASS | The inline-nav rules moved unchanged from `@media (min-width: 768px)` to a new `@media (min-width: 1024px)` block. It comes after the 768 block and before the 1280 block, so the cascade order is correct. Step 1 recorded the measurements behind the choice (AR overflowed by 6px at 768). Step 1 and Step 2 measured 65px at 320/360/375/768/1023/1024/1280 in EN and AR, with Enter, Tab and Escape tested at 320/360/768/1023. |
| 5 | Education details and all 6 certificate links render as before in both languages | PASS | The content markup is unchanged (`education-degree/-institution/-period`, `#certificates-list`), and no content keys changed. Step 2 compared EN with `cv-data.en.json` and AR with `content.ar`. The only visual change is that the `h3` subsection title became an `h2` section title, which the requirements ask for. |
| 6 | Both check modes pass; earlier DoD items still hold; no console errors | PASS | I ran them: `node tests/portfolio/check-content.js` gave 34 passed, 0 failed, exit 0. `--cv` gave 45 passed, 0 failed, exit 0. Step 2's regression table covers RTL, theme, keyboard and Escape, reduced motion (including the fade-in of the new sections), `textContent` only, logical CSS, and 0 console errors or warnings. My grep found no physical `left`/`right` properties in `styles.css`. |
| 7 | README sections list matches the new structure | PASS | `portfolio/README.md`: the `nav` key row lists `education` and `certificates`. The new numbered list gives the 6 sections in page order, with Languages under Skills & Experience, and notes the 1024px menu breakpoint. No stale "inside the Skills & Experience section" text or `768` nav reference is left. |
| 8 | Commit pushed, Pages run succeeds, live site shows the new sections and nav links | PASS | `origin/main` = `d31d87ec…`. The author is the repo-local noreply address, and the commit has the required `Co-Authored-By` trailer. `gh run view 44511048125`: `completed`/`success`, `event=push`, `headSha=d31d87e…`. Live: `/`, `index.html`, `content.js`, `styles.css` and `script.js` all return 200. All four served files are byte-identical (`cmp`) to `git show d31d87e:portfolio/…`, and so is `/`. The live HTML has the 6 section ids and the 6 nav `href`s in order. |

### On DoD 8: is a byte comparison enough instead of a live headless run?
Yes, for this change. The rendered page depends only on the served `index.html`, `content.js`, `styles.css` and `script.js`, plus assets this task did not touch. If those files are byte-identical to the ones Step 2 tested, the DOM, layout and behaviour are the same. The DoD item asks that the live site "shows the new sections and nav links". The served HTML and `content.js` show both, and the Pages run succeeded.

Two caveats, both non-blocking:
- Step 3 compared only `index.html` and `content.js`. I closed that gap by also comparing `styles.css`, `script.js` and `/`, which are identical.
- Some differences between `file://` and `https://`, such as asset 404s, `localStorage` or the console on the real origin, are not covered by Step 2. They are not affected by this diff, and the previous deploy task checked the live origin.

The plan asked for a live headless check, and Step 3 recorded the deviation and its reason openly, which is acceptable.

## Blocking issues
| # | Issue | File | Fix by agent |
|---|-------|------|--------------|
| — | None | — | — |

## Non-blocking suggestions
1. **Docs not yet committed** (process). `02-plan.md` was committed with Step 3 still marked `in-progress`, and the fix to `done` is uncommitted. `03-step-3-publish.md` and this `04-review.md` are untracked.
   - **Fix by:** developer, or the orchestrator's final docs step.
   - **Change:** commit `02-plan.md`, `03-step-3-publish.md`, `04-review.md` and the summary in one follow-up docs commit on `main`, using the repo-local identity and the trailer, with a plain push.
2. **Pre-existing bidi bug, out of scope: date ranges reversed in Arabic.** In AR, the education period "09/2014 – 09/2018" renders as "09/2018 – 09/2014". Inside an RTL paragraph, the European-number runs around the neutral dash are reordered right to left. The same markup exists at `ed8ff85`, so this task did not cause it. The `timeline-period` and `project-period` spans that `script.js` builds have the same bidi exposure. I have not checked them visually.
   - **Classification:** non-blocking for this task. It should be a separate small task.
   - **Fix by:** developer.
   - **Change:** isolate each range as LTR without changing the block's start alignment:
     - in `index.html`, use `<p class="education-period"><span dir="ltr" data-i18n="education.period"></span></p>`;
     - in `script.js`, add `dir: "ltr"` to the `el("span", { "class": "timeline-period" … })` and `project-period` calls (lines 227 and 263), or use CSS `.timeline-period, .project-period { direction: ltr; unicode-bidi: isolate; }`.
   - **Verification by:** tester, with an AR screenshot of Education, Experience and Projects.
   - Avoid `dir="ltr"` on the `<p>` itself, because that would also make the line align left in RTL.
3. **No-JS fallback at 768–1023px (unverified, minor).**
   - **What changed:** without JS, the 6 links now use the base mobile rules from 768px to 1023px: `.nav-menu` is `flex-wrap: wrap`, and `.site-nav` is `flex-shrink: 0` inside a `nowrap` header. Before, 768px+ got the inline nowrap row.
   - **Likely effect:** going by Step 1's measurements (about 598px of links, 122px of actions, 689px content box), the header may overflow sideways or crowd the brand at 768px with JS off. This is the same no-JS behaviour that already applies below 768px, and the DoD only covers the JS path.
   - **Fix by:** tester, for an optional check with JS disabled at 768 and 1023. Then developer, only if it overflows. For example, add `.site-nav { flex-shrink: 1; min-width: 0; }` for `html:not(.js)`, or keep the no-JS inline row from 768px.
4. **Optional structure guard in CI.** Step 2 chose not to add a check that the nav `href`s match the `main > section` ids in order. Adding one to `tests/portfolio/check-content.js` would let the Pages build catch a future nav or section mismatch. **Fix by:** tester (test file only; show that it fails on a mutated copy).
5. **Minor doc inaccuracy.** The plan's Step 3 says the commit goes "in `d:\try_agent_workflow\portfolio`", but the repo root is `d:\try_agent_workflow`. **Fix by:** planner, optional and cosmetic.
6. **Behaviour change to note in the summary.** Tablets in portrait (768–1023px) now get the hamburger menu, and the brand shows the full name there. The user accepted this, and Step 1 recorded it. The final summary should mention it.

### Other checks
- **Scope:** only the 4 `portfolio/` files and the task docs changed. There were no content edits, Languages did not move, and there was no redesign. `script.js` and `check-content.js` are unchanged, as the plan expected.
- **Semantics and accessibility:**
  - Each new landmark section is named by its `h2`, and the ids are unique (`education`, `certificates`, `languages`, `*-title`).
  - The heading levels are sound: `h1` in the hero, `h2` per section, and `h3` only for the sub-blocks inside Skills.
  - The nav order matches the DOM order.
- **Dead CSS:** all `.credentials` rules and the `#certificates { grid-column }` rule are gone. Grep finds no `credential` left in `styles.css`, `index.html` or `script.js`. The comments are updated, including the header comment and the 1280 `.skills-layout` comment.
- **Logical properties:** the moved block and the remaining rules use only `inset-*`, `padding-block`, `margin-inline-end` and similar logical properties.
- **Security:** there are no secrets in the diff. Step 3 ran a staged-diff scan, and I used `gh` read-only and did not print the token.
