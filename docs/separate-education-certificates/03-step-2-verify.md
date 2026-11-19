# Step 2: Verify locally against the definition of done

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Wrote one headless Chrome (CDP) script that drives `file:///D:/try_agent_workflow/portfolio/index.html` in EN and AR. It checks structure, nav landing, the header at 7 widths, the mobile menu by keyboard, education and certificate content, and the regressions (theme, language/RTL, reduced motion, skip link, console). It also takes 2 screenshots.
- Ran both check-script modes, and checked the README sections list, logical CSS, no `innerHTML` and unique ids.
- **Final clean run: 73 passed, 0 failed, exit 0.** Both check modes exit with 0. No production code was changed.

Scripts and evidence are in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\sections-verify\`:
- `verify.js` (the script) and `cdp.js` (a CDP helper copied from Step 1);
- `run.log` / `out.txt` (the final run);
- `check.txt` / `check-cv.txt`;
- `shots\sections-en-light-1280.png` and `shots\sections-ar-dark-360.png`.

### Results against the Definition of Done
| # | DoD item | Result | Evidence |
|---|----------|--------|----------|
| 1 | 6 sections in order, with Education and Certificates top-level with their own `h2` | PASS | In EN and AR, the `main > section` ids are `about, projects, skills, education, certificates, contact`. Every section has `.section.reveal` and an `aria-labelledby` pointing at an `h2` inside it. The Education/Certificates `h2` equals `education.title`/`certificates.title` ("Education"/"Certificates", "التعليم"/"الشهادات"). |
| 2 | Skills & Experience keeps Skills, Experience and Languages | PASS | `#skills` contains 12 skills, 13 experience items and `#languages` with 2 items, and 0 education or certificate elements (EN and AR). |
| 3 | 6 nav links in page order (EN and AR). Links scroll to their sections, with headings not under the header | PASS | The `href`s are in page order and the labels equal the `nav.*` keys. At 1280 (inline) and 360 (through the menu), in EN and AR, each of the 6 links is clicked with a real mouse event. Each click sets the hash and puts the heading below the header bottom (65px), inside the viewport and topmost at its point (`elementFromPoint`). The menu is closed after the click. About uses its `h1`, which is at the top of that section. 24/24 pass. |
| 4 | Header one row, 64–65px, at 320/360/375/768/1023/1024/1280 in EN and AR, no h-scroll. The mobile menu shows 6 links and works by keyboard | PASS | The height is 65 at every width. The vertical centres of the brand, toggle/menu and actions are within 1.5px. Everything is inside the viewport and `scrollWidth == clientWidth`. The hamburger shows at 1023 and below, and 6 inline links on one row show at 1024+. At 360 (EN and AR): Enter on the toggle opens the menu (`aria-expanded=true`), 6 links are visible and there is no h-scroll. Tab visits the 6 links in order. Escape closes the menu and returns focus to `#nav-toggle`. |
| 5 | Education and all 6 certificate links render as before, in both languages | PASS | EN: the education text and the 6 certificate titles and `href`s equal `docs/portfolio-real-content/cv-data.en.json` exactly and in order. AR: the education text equals `content.ar.education`, the 6 titles equal `content.ar.certificates.items`, and the `href`s equal the CV URLs. |
| 6 | Both check modes pass, earlier DoD items still hold, no console errors | PASS | `check-content.js`: 34 passed, 0 failed, exit 0. `--cv`: 45 passed, 0 failed, exit 0. Regression results are in the next table. 0 console errors, warnings or exceptions over the whole run. |
| 7 | README sections list matches | PASS | `portfolio/README.md` lines 82–91 list the 6 sections in page order with their keys (Languages under Skills & Experience) and the note about the menu below 1024px. |
| 8 | Push / Pages / live | Not in this step | Step 3. |

### Earlier DoD items (Constraints)
| Item | Result | Evidence |
|------|--------|----------|
| EN/AR with RTL | PASS | The language toggle switches to `lang=ar dir=rtl` and stores `portfolio-lang=ar`. The new nav link and `h2`s are translated, with no h-scroll. This persists after a reload, and switching back to EN also persists. |
| Theme toggle | PASS | Light to dark sets `data-theme=dark` and `portfolio-theme=dark`, the body background becomes `rgb(15, 17, 23)`, and this persists after a reload. Switching back to light also persists. |
| No horizontal scroll at 360/768/1280 | PASS | Covered by row 4 (and 320/375/1023/1024). |
| Keyboard access, menu closes on Escape | PASS | Row 4. Skip link: the first Tab focuses `.skip-link`, which is visible, and Enter moves focus to `#main`. |
| Reduced motion | PASS | Control (no emulation): `#education`/`#certificates` start with `opacity 0` and no `is-visible`, and fade in when scrolled to. With emulated `prefers-reduced-motion: reduce`, both have `is-visible`, `opacity 1` and `transform none` at load, without scrolling. |
| No hard-coded text, `textContent` only | PASS | No `data-i18n` element is empty in EN or AR. `grep` finds no `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write` in `script.js`. |
| Logical CSS properties only | PASS | `grep` finds no `margin/padding/border-left/right`, `left:`/`right:`, or `text-align`/`float` left/right in `styles.css`. |
| Unique ids | PASS | `id="education"`, `id="certificates"` and `id="languages"` each appear once in `index.html`. |

### Screenshots (checked by eye)
- `sections-en-light-1280.png`: Education (degree in bold, institution, period), a divider, then Certificates with 6 underlined links. The layout is the same as the other sections, in the light theme.
- `sections-ar-dark-360.png`: the RTL headings "التعليم" and "الشهادات" are aligned to the start (right), with the Arabic degree and institution, in the dark theme. The certificate titles are Latin links with `dir="auto"`, so the longer ones align left and wrap.

## Files touched
- `docs/separate-education-certificates/03-step-2-verify.md`: this doc.
- Scratch only (not in the repo): `verify.js`, `cdp.js`, logs and shots in the scratchpad folder above.
- No production or test files were changed.

## Decisions
| Decision | Reason |
|----------|--------|
| Did not add a structure check to `tests/portfolio/check-content.js` | It is optional in the plan, and the brief asked for efficiency. The browser script covers the nav `href` / section-id order in both languages. It can be added later if the structure should be guarded in CI. |
| Nav landing uses real CDP mouse clicks and waits for the smooth scroll to settle (300ms minimum, then `scrollY` unchanged for 3 samples) | My first settle helper stopped when 2 samples matched, which can happen before the smooth scroll starts. One run had 5 AR landing "failures" with the heading still at its unscrolled position (for example `top: 2184`). With the stricter wait, 3 consecutive full runs passed 73/73. This was a test-timing issue, not a site bug. |
| The fade-in control uses an instant scroll and a 1.5s wait | A 900ms wait after a smooth scroll measured mid-transition. With the stricter wait the check passed, so the fade-in itself works. |
| Screenshots are taken under emulated reduced motion with an instant scroll | Without it, the first capture caught Certificates half-faded and the AR 360 shot was blank, because the sections were not revealed yet. Reduced motion is a supported mode, so the captures show the real final state. |
| Mobile emulation below 768px, desktop with a 15px scrollbar from 768px | This matches Step 1, so the numbers are comparable (for example, 768 gives a 753px client width). |

## Verification
- `node verify.js` (final clean run) gives **73 passed, 0 failed, exit 0**. Two earlier identical runs with the final settle logic also gave 73/73.
- `node tests/portfolio/check-content.js` gives `34 passed, 0 failed (default mode ...)`, exit 0.
- `node tests/portfolio/check-content.js --cv` gives `45 passed, 0 failed (default + --cv)`, exit 0.
- `grep` checks for logical properties, no `innerHTML` and unique ids are clean (see the table above).

## Open questions / follow-ups
- **Existing issue, not a regression:** in AR, the education period "09/2014 – 09/2018" shows as "09/2018 – 09/2014". The LTR date range is reordered by bidi inside the RTL `p.education-period`, which has no `dir="ltr"` or `<bdi>`. The same markup is at `HEAD`, before this task, so it is out of scope here. To reproduce, set AR, scroll to Education and look at the period line (see `sections-ar-dark-360.png`). Fixing it would need `dir="ltr"` on that element or a bidi isolate, which is a production change for a separate task. The experience periods may show the same thing.
- Step 3 can go ahead: every local DoD item passes.
