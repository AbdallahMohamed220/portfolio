# Step 3: Behaviour and rendering (`script.js`)

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Created `portfolio/script.js`, a plain IIFE script with no modules and no dependencies. It follows the Step 2 contract:
  - **Rendering:** everything comes from `window.PORTFOLIO_CONTENT`. That covers `<html lang dir>`, `document.title`, the meta description, every `data-i18n` / `data-i18n-aria-label` hook, the avatar `src`/`alt`, the CV `href`, the about paragraphs, the project cards (joined to `shared.projects` by `id`), the skill groups, the experience timeline and the contact links (`"mailto:" + shared.links.email`). The markup matches Step 2 exactly, and all strings go through `textContent`, so no raw HTML is injected.
  - **Language:** the start language is the saved `portfolio-lang` if it is a valid language key, otherwise `shared.defaultLang`. This is the same rule the bootstrap uses. The toggle moves to the next language block, saves it, and re-renders the whole page (lists are cleared first). The button gets `lang` set to the target language.
  - **Theme:** the start state is read from `data-theme`, which the bootstrap sets. The toggle flips it, saves `portfolio-theme` and updates the button's `aria-label` (`themeToDark`/`themeToLight`). With no saved choice, the page also follows live `prefers-color-scheme` changes.
  - **Mobile nav:** the toggle flips `aria-expanded` and swaps its `aria-label` (`menuOpen`/`menuClose`). Escape closes the menu and returns focus to the toggle, and clicking (or pressing Enter on) a menu link closes it.
  - **Fade-in:** an `IntersectionObserver` adds `.is-visible` once and then stops watching that section. With `prefers-reduced-motion: reduce`, or when `IntersectionObserver` is not available, every section is shown at once. If reduced motion is switched on later, everything is shown.
  - **Robustness:** `localStorage` calls are wrapped in try/catch. If `PORTFOLIO_CONTENT` is missing (for example after a syntax error in `content.js`), all sections are shown and one clear `console.error` is logged. A missing text path logs a `console.warn` and renders an empty string.
- `index.html`: added the fallback `<title>Portfolio</title>` with a comment saying it is the one allowed hard-coded text and that `script.js` replaces it.
- `content.js`: changed `ui.langToggleLabel` in both languages so that it starts with the visible button text (WCAG 2.5.3). `en`: `"العربية – عرض الموقع باللغة العربية"`. `ar`: `"English – View the site in English"`. The keys are unchanged.
- `README.md`: the first-visit language now says `shared.defaultLang` (English), and the `ui` row explains what `langToggleLabel` must contain.

## Files touched
- `portfolio/script.js` — new.
- `portfolio/index.html` — `<title></title>` becomes `<title>Portfolio</title>`, with a comment.
- `portfolio/content.js` — `en.ui.langToggleLabel` and `ar.ui.langToggleLabel` values.
- `portfolio/README.md` — the first-visit language sentence and the `ui` key description.

## Decisions
| Decision | Reason |
|----------|--------|
| Write `langToggleLabel` in the target language (Arabic label on the `en` page, English label on the `ar` page) | The button has `lang` set to the target language (Step 2 contract), so screen readers read its name with that language's voice. An English sentence inside a `lang="ar"` button would be mispronounced. Starting the label with the visible word meets WCAG 2.5.3. |
| The fallback `<title>Portfolio</title>` is the only hard-coded text | It makes the HTML valid, and the tab is never blank before the script runs. `script.js` overwrites it straight away. |
| Re-read the stored language and apply the bootstrap's rule, instead of parsing `<html lang>` | This gives the same result as the bootstrap (the `meta.lang` values equal the block keys), and `script.js` stays correct even if someone renames a `meta.lang`. |
| Pick the language by cycling through the blocks other than `shared` | It works for `en`/`ar` today and does not break if a third block is added later. |
| Follow live system theme changes only while nothing is saved | This matches "first visit follows the system", and an explicit choice always wins. |
| Use IntersectionObserver `threshold: 0` with `rootMargin: 0 0 -10% 0` | Tall sections on mobile (projects) never reach a ratio threshold. A margin gives a small delay without that risk. |
| Escape returns focus to the menu button; a link click does not | After Escape, focus would otherwise sit on a hidden link. After a link click, the browser moves to the target section, which is the expected behaviour. |
| Leave out a project image or link when its `shared` value is missing | A half-edited `content.js` then gives a smaller card, not a broken image or an empty link. |

## Verification
All scripts are in the scratchpad (`...\scratchpad\step3\verify3.js`), not in the repo. Node v22.21.0, headless Chrome 157, over CDP, on `file://`.
- `node --check portfolio/script.js`: OK.
- `verify3.js` against `D:/try_agent_workflow/portfolio`: **62/62 PASS, `ALL PASS`**, with 0 console errors or exceptions and 0 warnings over the whole run. It checks:
  - **Render:** title and meta description, no empty `data-i18n`, nav `aria-label`, 3 cards with 9 tags and image `src`/`alt`, links (`href`, label, `aria-describedby`), 3 skill groups, 2 timeline items, 2 paragraphs, `mailto:` email plus the visible address, GitHub/LinkedIn/CV `href`s plus `download`, avatar `src`/`alt`, and every `img` has an alt.
  - **Theme:** a first visit with system light gives light, and system dark gives dark. With no saved choice, a live system change is followed. The toggle saves `dark`, the saved value beats the system setting after a reload, and a saved choice ignores live system changes. Invalid saved values fall back to the defaults.
  - **Language:** the toggle gives `ar`/`rtl`, the Arabic title, description and h1, and the button reads "English" with `lang="en"`. Lists are re-rendered without duplicates, focus stays on the button, and the choice is saved and persists after a reload (together with the theme). Toggling back gives `en`/`ltr`.
  - **WCAG 2.5.3:** in both languages the `aria-label` contains the visible text.
  - **Mobile nav at 360px, with real key events:** Enter opens the menu (`aria-expanded="true"`, the menu is visible, the label is `menuClose`). Tab moves into the links. Escape closes the menu and focuses the toggle. Space opens it. Enter on a link navigates to `#projects` and closes the menu.
  - **Keyboard at 1280px:** Tab reaches the language button, the theme button, the CV link, the 3 contact links and the nav links, and Enter toggles the theme.
  - **Fade-in:** on load only `#about` is visible. After scrolling to the bottom, all 4 sections are visible at opacity 1. With reduced motion emulated, all sections are visible at once and `scroll-behavior` is `auto`. With `IntersectionObserver` deleted, all sections are visible.
  - **Editing content (scratch copy of `portfolio/`):** with `defaultLang: "ar"` and nothing saved, the page opens in `ar`/`rtl`. An edited `hero.name`, an edited email and a 4th skill group added in the content all show on the page.
- I checked the screenshots by eye: `en-360-menu-open.png` (the menu is open and the toggle shows ×) and `ar-1280-dark.png` (RTL mirrored, sun icon, "English" button). Both look correct.
- The Step 1 check (`verify.js`) still returns `ALL PASS` on the edited `content.js`.
- The Step 2 check (`check-step2.js`) now fails one item, `title empty`. This is expected, because of the agreed fallback title. All its other checks pass.
- Not verified: a real screen reader, and real (not headless) browsers other than Chrome.

## Open questions / follow-ups
- Step 5's "no hard-coded text" check must allow `<title>Portfolio</title>` as the one exception. The old Step 2 check that the title is empty no longer applies.
- The Arabic wording of the new `en.ui.langToggleLabel` ("العربية – عرض الموقع باللغة العربية") should get the same native-speaker review as the rest of the Arabic copy.
