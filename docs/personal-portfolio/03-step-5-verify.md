# Step 5: Verify against the definition of done

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Wrote `tests/portfolio/check-content.js`. It is a dependency-free static check that runs with `node tests/portfolio/check-content.js [portfolioDir]`. It exits with 0 when every check passes and 1 when any fails. It checks:
  - `content.js` loads as a plain script.
  - `en` and `ar` have the same structure: the same object keys, array lengths and value types, with no empty strings.
  - `meta.lang` and `meta.dir` are correct, and `defaultLang` is `en`.
  - The project ids match `shared.projects`.
  - Every asset path exists, both in `content.js` and in the local `src`/`href` values of `index.html`.
  - External links are `https`, and the email is a plain address.
  - `cv.pdf` is structurally valid:
    - it has a header and `%%EOF`;
    - `startxref` points to the `xref` table;
    - every xref offset points to the right `N 0 obj`;
    - `/Size` matches, `/Root` is a `/Catalog`, and there is a `/Page`;
    - each stream `/Length` lands on `endstream`.
  - Every i18n path resolves in both languages. This covers every `data-i18n` and `data-i18n-aria-label` path, and every literal `text(t, "…")` path in `script.js`.
  - `index.html` has no hard-coded visible text. The check looks at text nodes and at the `alt`, `title`, `aria-label`, `placeholder` and input `value` attributes and the meta description. The only allowed exception is `<title>Portfolio</title>`.
  - Every `<img>` gets its `alt` from `script.js`.
- Ran a mutation test to show that the script catches real breakage. It made 9 broken copies of the site in the scratchpad, and the script exited with 1 on each.
- Ran a full browser check of the DoD in headless Chrome 157 over CDP (`verify5.js`, in the scratchpad), mostly on `file://`. Only the CV download was also run over a local `http://` server. Result: **85/85 PASS**, with 0 console errors and 0 warnings over the whole run.
- Checked the README against the schema and the DoD topics.

## Files touched
- `tests/portfolio/check-content.js` — new. This is the static content and HTML check.
- `docs/personal-portfolio/03-step-5-verify.md` — new (this doc).
- Production code under `portfolio/` was not changed.
- Throwaway files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\step5\`:
  - `verify5.js` — the browser DoD run;
  - `probe-cv.js` — the `file://` vs `http://` download probe;
  - `mutate.sh` — the mutation test;
  - `out.txt` — the full run log;
  - `shots\*.png` — screenshots.

## Decisions
| Decision | Reason |
|----------|--------|
| `en`/`ar` comparison is strict: array lengths must match too, including tag lists | The README rule says to keep keys and list lengths identical. This also catches a project, skill or job added in one language only. |
| The hard-coded text check also covers the `alt`, `title`, `aria-label`, `placeholder` and `value` attributes and the meta description | Screen readers announce these, or users see them. Text nodes alone would miss a hard-coded `alt`. |
| The i18n check also parses `text(t, "…")` calls in `script.js` | Labels set from JS (menu, theme and language button labels) are also "visible text from content". A typo there would only show up as a runtime warning. |
| The CV download was tested over `file://` and also over a local `http://` server | Chrome ignores the `download` attribute for `file:` URLs and opens the PDF instead (see DoD 7). A static host is how the site is deployed, so `http://` is the deciding check. `file://` is still checked to confirm the link is not broken. |
| Clicks are real CDP mouse events after an instant `scrollIntoView`, and keys are real `Input.dispatchKeyEvent`s | The page uses `scroll-behavior: smooth`, so a smooth scroll left stale click coordinates in my first run. Real input events test what a user actually does. |

## Verification

### 1. `node tests/portfolio/check-content.js` (run from the repo root)
```
Portfolio dir: D:\try_agent_workflow\portfolio

PASS  content.js defines window.PORTFOLIO_CONTENT with shared, en, ar
PASS  en and ar have the same keys, array lengths and non-empty strings
PASS  en.meta has lang="en" and a valid dir
PASS  ar.meta has lang="ar" and a valid dir
PASS  en is ltr, ar is rtl
PASS  shared.defaultLang is "en"
PASS  en.projects.items ids match shared.projects
PASS  ar.projects.items ids match shared.projects
PASS  all 11 asset paths exist
PASS  external links (GitHub, LinkedIn, project URLs) are https URLs
PASS  shared.links.email is a plain address (no mailto: prefix)
PASS  assets/cv.pdf is a structurally valid PDF
PASS  all 35 i18n paths resolve to non-empty strings in en and ar
PASS  index.html has no hard-coded visible text (only <title>Portfolio</title> allowed)
PASS  every <img> in index.html gets its alt from script.js

15 passed, 0 failed.
exit=0
```

### 2. Mutation test (does the script catch breakage?)
Each case edits a scratch copy of `portfolio/`, then runs the script on it. The script exited with 1 in every case and named the cause:

| Mutation | Reported failure |
|----------|------------------|
| Remove `ar.ui.skipLink` | `.ui.skipLink: missing in ar` (plus the i18n path fails) |
| Delete `assets/project-2.svg` | `shared.projects[1].image -> assets/project-2.svg` |
| Change the `startxref` value in `cv.pdf` | `startxref 480 does not point at 'xref'` |
| Change the stream `/Length` in `cv.pdf` | PDF invalid. The offsets shift too, so the xref check fires first. |
| `data-i18n="hero.rolez"` | `"hero.rolez" in en -> undefined` (and in ar) |
| `<p class="footer-text">Hello</p>` | `text node: "Hello"` |
| `alt="Me"` on the avatar | `<img> alt="Me"` |
| `<title>My Site</title>` | `title is not the allowed fallback` |
| Remove a comma in `content.js` (syntax error) | `content.js loads as a plain script — Unexpected identifier 'links'` |

### 3. Browser run (`verify5.js`): headless Chrome 157, CDP, `file:///D:/try_agent_workflow/portfolio/index.html`
Result line: `85 passed, 0 failed. ALL PASS`. The console had 0 errors and 0 warnings over the whole run. The run used `Runtime.exceptionThrown`, `console.error`/`console.warn` and `Log.entryAdded`, so resource load errors are covered too.

### Definition of Done: pass/fail

| # | DoD item | Result | Evidence |
|---|----------|--------|----------|
| 1 | Opening `index.html` directly shows all 4 sections with placeholder content, and the console has no errors | **PASS** | Over `file:`, `#about`, `#projects`, `#skills` and `#contact` are `<section>`s with 455, 490, 426 and 144 characters of text. There are 3 project cards, 3 skill groups, 2 jobs and 3 contact links, plus the header, nav, main and footer landmarks. No `data-i18n` element is empty. All images load (`naturalWidth > 0`, after scrolling for lazy images). The first load has 0 errors and 0 warnings, and so does the whole run (7/7). |
| 2 | All visible text comes from the content file, and editing a value changes the page | **PASS** | Static check: there is no hard-coded text in `index.html` apart from the allowed `<title>Portfolio</title>`, and all 35 i18n paths resolve. In the browser, a tree walk of **every** DOM text node in both EN and AR found 0 strings that are not in `content.js`. In an edited copy of `content.js`, the edited `hero.name`, `about.title`, experience role, `ui.downloadCv`, `shared.links.email` (both the `href` and the text) and `ar.meta.title` all showed on the page (6/6). |
| 3 | The language toggle switches EN ↔ AR and LTR ↔ RTL, and the choice persists after reload | **PASS** | The first visit is `en`/`ltr`. A click switches to `ar`/`rtl`: the h1, nav, avatar alt, `document.title` and computed `direction: rtl` all change, and `portfolio-lang=ar` is saved. AR is still active after a reload. A second click goes back to `en`/`ltr`, and that also persists after a reload. No console errors (7/7). |
| 4 | The theme toggle switches dark ↔ light, the choice persists after reload, and the first visit follows the system | **PASS** | The first visit follows the system: emulated light gives `light`, and emulated dark gives `dark` (background `rgb(15,17,23)`). A click switches to `light` and saves it: the background becomes `rgb(255,255,255)` and the label becomes "Switch to dark theme". After a reload the saved light theme wins over a dark system setting, and saved dark wins over a light system setting (6/6). |
| 5 | No horizontal scroll at 360, 768 and 1280px, and the nav is usable on mobile | **PASS** | I tried 12 combinations: EN and AR × light and dark × 360, 768 and 1280px. In every one, `scrollWidth == clientWidth` for both `html` and `body`, `scrollTo(500, y)` leaves `scrollX = 0`, and no visible element sits outside the viewport. At 360px, in both EN and AR: the menu button is 44×44 and the menu starts closed. A tap opens the menu, all 4 links are on screen, and there is no overflow. Tapping "Contact" goes to `#contact` and closes the menu (20/20). Screenshots are in `scratchpad\step5\shots\`. |
| 6 | Sections fade in on scroll, and animations are off with `prefers-reduced-motion` | **PASS** | With `no-preference`, there are 4 `.reveal` sections. Contact starts at opacity 0 and only gets `is-visible`, reaching opacity 1, after it is scrolled into view. The transition is 0.6s, and `scroll-behavior` is `smooth`. With `reduce` emulated, all 4 sections are visible at once with opacity 1 and `transform: none`, without scrolling. The transition is `1e-05s`, and `scroll-behavior` is `auto`. Turning `reduce` on while the page is open reveals every section (6/6). |
| 7 | "Download CV" downloads `assets/cv.pdf` | **PASS (with a `file://` caveat)** | The link has `href="assets/cv.pdf"` plus `download` and the label "Download CV". **Static host (`http://`):** a click fires `Browser.downloadWillBegin cv.pdf` and then `completed`. The saved `cv.pdf` is **byte-identical** to `assets/cv.pdf`, and the page stays on `index.html`. **`file://`:** Chrome ignores `download` for `file:` URLs, so the same click opens `file:///…/assets/cv.pdf` in the tab instead of saving it. This is a browser limitation, not a bug in the site. The structure check in `check-content.js` passes. See the follow-ups. |
| 8 | The contact links (mailto, GitHub, LinkedIn) are present and open correctly | **PASS** | Email is `mailto:your.name@example.com` (same tab) and shows the address. GitHub is `https://github.com/your-username`, and LinkedIn is `https://www.linkedin.com/in/your-username`. Both have `target="_blank"` and `rel="noopener noreferrer"`. Real clicks fired `Page.windowOpen` for exactly those two URLs, and the original tab stayed on the portfolio. The mail client opening for `mailto:` is a manual check (6/6). |
| 9 | Toggles and links can be reached and used with the keyboard, and images have alt text | **PASS** | **Tab order at 1280px, the same in EN and AR:** skip link, brand, 4 nav links, language button, theme button, 2 CTAs, CV link, 6 project links, email, GitHub and LinkedIn. Every focused element matches `:focus-visible` with a `solid 3px` outline and is on screen.<br>**Toggles and skip link:** the skip link shows on the first Tab, and Enter on it moves focus to `<main>`. Enter or Space on the language button switches EN/AR and keeps focus. Enter or Space on the theme button toggles the theme.<br>**Mobile menu at 360px:** Tab skips the hidden menu links. Enter opens the menu, and the label becomes "Close menu". The next Tab goes into the menu. Escape closes it and returns focus to the button. Opening with Space, then Tab, Tab and Enter, goes to `#projects` and closes the menu.<br>**Alt text and names:** all 4 images have `alt` from `content.js` in both EN and AR. The inline SVG icons are `aria-hidden`. Every link and button has an accessible name (23/23). |
| 10 | `portfolio/README.md` explains how to edit the content, replace the CV and images, and deploy to GitHub Pages/Netlify | **PASS** | The README has these sections: "Open the site locally", "Edit the content (`content.js`)" (with `shared`, `en`/`ar` and Rules), "Replace the CV and images" (`shared.links.cv`, `shared.images.avatar`, `shared.projects[].image`, `hero.avatarAlt`, `imageAlt` in both languages), and "Deploy" (GitHub Pages: Settings → Pages, a branch deploy with a separate root or an Actions upload path; Netlify: drag-and-drop, or a connected repo with base `portfolio` and the build command left empty). All 58 identifiers in its key tables exist in `content.js`. |

**Overall: 10/10 DoD items pass.** No production bugs were found.

### Harness issues found and fixed during the run (these are not site bugs)
- In the first run, 4 checks failed. I traced each one to the harness:
  - the click coordinates were taken during a smooth scroll, which hit the GitHub and CV clicks;
  - the keyboard test reloaded a URL that still had `#contact`, so Chrome correctly started sequential focus at the fragment;
  - download events were not delivered because `Browser.setDownloadBehavior` was sent on the page session instead of the browser session.
- After I fixed the harness, all checks passed. `probe-cv.js` then confirmed the `file://` vs `http://` download behaviour on its own:
  ```
  file:// -> locationAfterClick file:///D:/try_agent_workflow/portfolio/assets/cv.pdf, files: []
  http:// -> locationAfterClick http://127.0.0.1:8765/index.html, files: ["cv.pdf"], identical: true
  ```

### Manual checklist (could not be automated)
- [ ] **Screen reader:** use NVDA or JAWS on Windows, or VoiceOver on macOS/iOS, in EN and AR. Check:
  - landmarks and headings are announced, and the skip link works;
  - the language button is announced in the target language;
  - the theme button and menu button labels and their expanded state are announced;
  - Arabic is read with an Arabic voice.
- [ ] **Other browsers:** Firefox, Safari (macOS and iOS) and Edge, over `file://` and from a static host. Repeat the language/theme toggles with a reload, the mobile menu, and the fade-in.
- [ ] **Real phone:** on a 360px-class device, check the touch menu and that there is no sideways scroll in EN or AR.
- [ ] **PDF viewer:** open the downloaded `cv.pdf` in Acrobat, Edge or a browser viewer, and on a phone. It should show "Curriculum Vitae" and the placeholder line.
- [ ] **CV download over `file://` in Firefox and Safari:** note whether it saves the file or opens it. Either way is acceptable.
- [ ] **`mailto:`:** with a mail client configured, clicking Email opens a new message to the address.
- [ ] **OS settings:** turn on "reduce motion" and the dark/light setting in the real OS, not through emulation, and do a first visit with storage cleared.
- [ ] **Contrast:** spot-check both themes with a contrast tool. Step 2 computed WCAG AA. It was not repeated here.

## Open questions / follow-ups
- **CV over `file://` (for the orchestrator or user):** when the page is opened directly from disk in Chrome, "Download CV" opens the PDF instead of saving it. This is Chromium's rule for `download` on `file:` URLs. On GitHub Pages or Netlify it downloads correctly. I suggest either accepting this as is, or adding one line to `portfolio/README.md` that says so. No code fix makes `download` work on `file://` in Chrome.
- The real-content follow-ups from the earlier steps still apply: a native speaker should check the Arabic, and the placeholder links, CV and images need to be replaced.
- Re-run the checks after any content edit with `node tests/portfolio/check-content.js`.
