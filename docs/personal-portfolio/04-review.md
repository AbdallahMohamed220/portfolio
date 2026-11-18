# Review: Personal portfolio website
**Verdict:** APPROVED

Reviewer: reviewer agent. Skills used: code-review.
Scope of review: `01-requirements.md`, `02-plan.md`, all five step docs, `portfolio/*` (index.html, styles.css, script.js, content.js, README.md, assets/), and `tests/portfolio/check-content.js`.

Re-run by the reviewer (from `d:\try_agent_workflow`):
```
node tests/portfolio/check-content.js
...
15 passed, 0 failed.
exit=0
```
The browser checks (headless Chrome, `verify5.js`, 85/85) were not re-run by the reviewer. The results below combine my static reading of the code with the tester's browser evidence, and I say where each one comes from.

## Definition of done
| Item | Result | Evidence |
|------|--------|----------|
| 1. Opening `index.html` directly shows all 4 sections, no console errors | PASS | `index.html` has `section#about`, `#projects`, `#skills` and `#contact` inside `main`, and the content loads as a plain `<script>` (no fetch or modules), so `file://` works. `script.js` logs nothing on the normal path: it only warns when a text path is missing, and the check script shows all 35 paths resolve. Step 5 recorded 0 errors and 0 warnings on `file://`. |
| 2. All visible text comes from the content file, and editing it changes the page | PASS | `check-content.js` reports "no hard-coded visible text". The only exception is the agreed `<title>Portfolio</title>`, which `script.js` overwrites with `meta.title`. The SVGs contain no text. In Step 5, an edited copy of `content.js` showed 6 of 6 edits on the page. |
| 3. Language toggle EN/AR, LTR/RTL, persists | PASS | `render()` sets `<html lang dir>` from `meta`. `setLanguage()` saves `portfolio-lang`. The inline bootstrap reads the same key before first paint. The CSS uses only logical properties (`margin-inline`, `inset-inline-start`, `border-inline-start`, `text-align: start`), and the email has `dir="ltr"`. Step 5 confirmed this and the reload persistence. |
| 4. Theme toggle dark/light, persists, first visit follows the system | PASS | The bootstrap uses the stored `portfolio-theme` or else `prefers-color-scheme`. The toggle saves the choice. Live system changes are followed only while nothing is saved. `:root:not([data-theme])` covers the no-JS case. Confirmed in Step 5. |
| 5. No horizontal scroll at 360, 768 and 1280px, and the nav is usable on mobile | PASS | `minmax(0,1fr)` tracks and `overflow-wrap: anywhere` on the email. The hamburger is 44x44 below 768px and uses `aria-expanded`. Step 5 tested 12 width/language/theme combinations plus 20 mobile-nav checks, all passing. |
| 6. Fade-in on scroll, and none with reduced motion | PASS | `IntersectionObserver` adds `.is-visible`. With reduced motion, or no IntersectionObserver, `revealAll()` runs, and the CSS `reduce` block forces `opacity:1` and `scroll-behavior:auto`. The hidden state applies only under `html.js`, so nothing stays invisible without JS. Confirmed in Step 5. |
| 7. "Download CV" downloads `assets/cv.pdf` | PASS (with a `file://` caveat) | The link is `href="assets/cv.pdf" download`. Over `http://`, the download completes and the saved file is byte-identical. Over `file://`, Chrome ignores `download` and opens the PDF in the tab. See the ruling below. |
| 8. Contact links (mailto, GitHub, LinkedIn) present and open correctly | PASS | Email gets `"mailto:" + shared.links.email`. GitHub and LinkedIn use https URLs with `target="_blank" rel="noopener noreferrer"`. Step 5 recorded the `Page.windowOpen` events. Opening a real mail client is still a manual check. |
| 9. Keyboard use and alt text | PASS | All toggles are real `<button type="button">`, and there are a skip link, `:focus-visible` outlines and Escape to close the menu (focus returns to the button). The theme, menu and language buttons get their `aria-label`s from content. All 4 `<img>`s get `alt` from content, and decorative SVGs are `aria-hidden`. Step 5 recorded 23 of 23 checks passing. |
| 10. README covers editing content, replacing the CV and images, and deploying to GitHub Pages and Netlify | PASS | `portfolio/README.md` has the sections "Edit the content", "Replace the CV and images" and "Deploy" (GitHub Pages and Netlify). All key names match `content.js`. |

### Ruling on the `file://` CV download (tester's question)
- **This does not block the work.** It is Chromium's rule for `download` on `file:` URLs, and no change to the page can fix it. The link is not broken: the user still gets the PDF, only in the tab instead of as a saved file. The site's real target is a static host (GitHub Pages or Netlify), and there it downloads correctly (byte-identical file). DoD 7 is met in the deployed setting.
- **The README should mention it.** The README tells users to "Double-click `index.html`" and says no server is needed. A user who tests that way will think the button is broken. Adding one sentence is cheap and prevents a false bug report. I list it as a non-blocking suggestion (S1) because no DoD item requires it, but I recommend doing it before handover.

## Scope
- New files are only under `portfolio/` and `tests/portfolio/`, as the plan says. The root `README.md` and `CLAUDE.md` were not changed (their timestamps are older than the task's files).
- There is no backend, form, CMS, analytics, build step or external runtime dependency (system fonts only, local SVGs). There are no extra features beyond the requirements.

## Correctness, security and accessibility notes
- **Security:** there is no `innerHTML`, `insertAdjacentHTML`, `document.write`, `eval` or `new Function` anywhere in `portfolio/` or `tests/`. All content strings go through `textContent` or `setAttribute` (the `el()` helper), and lists are cleared with `textContent = ""`. External links use `rel="noopener noreferrer"`. There are no secrets in the code. `localStorage` reads are checked against allowed values (theme `light|dark`, language must be a real block, `shared` is excluded) and wrapped in try/catch.
- **Robustness:** if `content.js` is missing or has a syntax error, the page reveals all sections and logs one clear `console.error`. If a project is missing its `shared` entry, the card is simply left smaller.
- **RTL:** there are no physical left/right properties. The timeline dot uses `inset-inline-start`, `:lang(ar)` sets the Arabic font stack, and the language button carries the `lang` of the target language.
- **Tests:** `check-content.js` covers the main path and edge cases (key parity, assets, PDF structure, i18n paths, hard-coded text, alt). The Step 5 mutation run shows it fails on 9 kinds of real breakage. It passes when I run it.
- **Docs:** every plan step has its doc, and what the docs say matches the code: the localStorage keys, the hooks, the fallback title and the `langToggleLabel` change.

## Blocking issues
| # | Issue | File | Fix by agent |
|---|-------|------|--------------|
| — | None | — | — |

## Non-blocking suggestions
1. **S1 (recommended), developer, `portfolio/README.md`:** under "Open the site locally", add one sentence like this: "When the page is opened directly from disk (`file://`), some browsers (e.g. Chrome) open `cv.pdf` in the tab instead of downloading it. On GitHub Pages, Netlify or a local server (`python -m http.server`) the Download CV button downloads the file."
2. **S2, developer, `portfolio/README.md` (GitHub Pages step 2/3):** step 2 says to choose *Deploy from a branch*, but the second option in step 3 (a GitHub Actions "Static HTML" workflow) needs *Source: GitHub Actions* instead. Reword step 2 so it matches both options.
3. **S3, developer, `portfolio/index.html` / `styles.css` (edge case):** the bootstrap adds `html.js` before `script.js` loads. If `script.js` itself fails to load (for example a typo in the file name after an edit), the `.reveal` sections stay at `opacity:0`, and on mobile the menu is hidden with a dead toggle. One way to fix this: let `script.js` add the `js` class itself, but then the early theme application in the bootstrap has to stay separate. This is low priority, because without `script.js` the text slots are empty anyway.
4. **S4, user/orchestrator:** the open manual checks in Step 5 still apply: a screen reader, Firefox and Safari, a real phone, the PDF in external viewers, and a native-speaker review of the Arabic copy, including the new `langToggleLabel`.
5. **S5, developer (optional):** the `href` values from `content.js` are set without a scheme check, so a `javascript:` URL typed into the content would run. The content is written by the owner, so this is not a real attack surface. If you want to harden it, allow only `https:`, `mailto:` and relative paths in `setLink`/`el`.
