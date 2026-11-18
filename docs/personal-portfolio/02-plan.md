# Plan: Personal portfolio website

**Requirements:** ./01-requirements.md

Context: the repo has no app code yet (only workflow files). Everything is created new under `portfolio/` at the repo root. There are no unknowns that need a research step. The final review is run separately by the orchestrator and is not a step here.

Execution order: Step 1, then Steps 2 and 4 in parallel, then Step 3, then Step 5.

## Steps

### Step 1 — Content file and placeholder assets
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** no (Steps 2–4 build on its data shape)
- **Output:** `portfolio/content.js`, which defines one global object (e.g. `window.PORTFOLIO_CONTENT`) with `en` and `ar` blocks. The blocks hold UI labels (nav, buttons, section titles, toggle labels, meta title/description), hero/about text, projects (title, description, image path, alt text, links), skills, experience and contact links (email, GitHub, LinkedIn). Shared values such as URLs and image paths live once, outside the language blocks. Also `portfolio/assets/` with local placeholder SVGs (avatar plus one per project) and a minimal valid placeholder `cv.pdf`. The step doc records the schema so the later steps can rely on it.
- **Done when:** `content.js` loads without errors over `file://` (plain script, no `fetch`/modules). The `en` and `ar` blocks have the same keys. Every image path in the content exists in `assets/`. `cv.pdf` opens in a browser PDF viewer.
- **Status:** done

### Step 2 — Page structure and styles (`index.html`, `styles.css`)
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 1
- **Parallel:** yes, with Step 4
- **Output:** `portfolio/index.html` with semantic landmarks (header/nav, main, 4 `section`s with ids: about, projects, skills/experience, contact; footer), empty containers or hooks for the content, a theme toggle and a language toggle as real `<button>`s, a "Download CV" link (`assets/cv.pdf` with the `download` attribute), a mobile nav toggle, and basic meta tags. It loads `content.js` before `script.js`. Also `portfolio/styles.css` with light and dark themes through CSS variables (chosen by a `data-theme` attribute on `<html>`), RTL support through logical properties and `[dir="rtl"]`, a responsive layout (mobile-first, breakpoints around 768px and 1280px), visible `:focus-visible` styles, fade-in classes, `scroll-behavior: smooth`, and a `prefers-reduced-motion` block that turns off animations and smooth scrolling. Any Google Font is optional and has a system-font fallback.
- **Done when:** the page opens over `file://` with no console errors. There is no horizontal scroll at 360, 768 and 1280px in both LTR and RTL. Both themes have sufficient contrast (WCAG AA for body text). The step doc lists the element ids and class names that `script.js` must use.
- **Status:** done

### Step 3 — Behaviour and rendering (`script.js`)
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** steps 1, 2
- **Parallel:** no
- **Output:** `portfolio/script.js` that renders all visible text, projects, skills, experience and contact links from `content.js`, so no text is hard-coded in the HTML. The language toggle sets `lang` and `dir` on `<html>`, re-renders the page, and saves the choice to `localStorage` (English by default). The theme toggle saves to `localStorage`; on the first visit it follows `prefers-color-scheme`, and the theme is applied early to avoid a flash of the wrong theme. The mobile nav opens and closes with the keyboard, using `aria-expanded`. An `IntersectionObserver` adds the fade-in effect, and is skipped when reduced motion is set. All images get alt text from the content.
- **Done when:** all Definition of Done items in `01-requirements.md` that relate to behaviour work manually over `file://`: language and direction switching with persistence, theme switching with persistence and the system default, fade-in, reduced motion, keyboard use, and editing a value in `content.js` changes the page. There are no console errors.
- **Status:** done

### Step 4 — README
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 1
- **Parallel:** yes, with Step 2 (and Step 3)
- **Output:** `portfolio/README.md`, which explains: how to open the site locally; the `content.js` structure and how to edit EN and AR text; how to replace `assets/cv.pdf` and the images (including alt text); how to deploy to GitHub Pages and to Netlify (drag-and-drop or connected repo, no build command).
- **Done when:** every topic in the last Definition of Done item is covered, and the file names and keys in the README match Step 1's schema.
- **Status:** done

### Step 5 — Verify against the definition of done
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** steps 1–4
- **Parallel:** no
- **Output:** a dependency-free check script outside the site folder (proposed: `tests/portfolio/check-content.js`, run with `node` if it is available). It checks that the `en` and `ar` keys match, that all asset paths exist, and that `index.html` has no hard-coded visible text. The step doc has a pass/fail table for each Definition of Done item, with how each was verified: manual browser checks at 360, 768 and 1280px; toggles plus reload; reduced motion through DevTools emulation; a keyboard-only pass; and the console checked for errors.
- **Done when:** the script runs and its output is captured in the step doc. Every DoD item has a pass/fail result with evidence. Failures are reported with steps to reproduce, and production code is not fixed by the tester.
- **Status:** done

## Risks / open questions
- **Test tooling:** no test runner exists and the requirements forbid an npm build. The plan assumes Node.js is available only to run a small check script, and that the script lives in `tests/portfolio/` so it does not ship with the site. If Node is not available, Step 5 falls back to a fully manual checklist.
- **Browser checks:** none of the agents has a real browser. Visual and interaction checks (responsive widths, contrast, fade-in, keyboard) are documented as manual checks, or are done by the user if the tester cannot run them.
- **Placeholder `cv.pdf`:** it has to be written by hand as a minimal valid PDF, because there are no PDF tools. This is low risk, but the developer must confirm that the file opens.
- **Arabic placeholder text:** the developer writes it. A native speaker should check it before real use.
