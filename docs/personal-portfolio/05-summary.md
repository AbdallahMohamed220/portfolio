# Summary: Personal portfolio website

## Result
A single-page static portfolio site in `portfolio/` built with plain HTML, CSS and JS, with no build step. It has these sections:
- About
- Projects
- Skills & Experience
- Contact (links only)

It also has an EN/AR language toggle that switches the page to RTL, a dark/light theme toggle, a responsive layout, a fade-in on scroll that respects reduced motion, and a Download CV button.

All text is placeholder content in `portfolio/content.js`. All 10 Definition of Done items pass:
- the check script passed 15 of 15 checks;
- the headless Chrome checks passed 85 of 85, with no console errors.

## Files changed
- `portfolio/index.html`, `portfolio/styles.css`, `portfolio/script.js`, `portfolio/content.js`
- `portfolio/assets/avatar.svg`, `project-1.svg`, `project-2.svg`, `project-3.svg`, `cv.pdf`
- `portfolio/README.md`
- `tests/portfolio/check-content.js`
- `docs/personal-portfolio/01`–`05` docs

## Key decisions
| Decision | Reason |
|---|---|
| The content lives in `content.js` as a global object, not in JSON | The site works over `file://` without fetch/CORS. |
| Shared values are kept in `shared`; `en` and `ar` have identical keys | URLs and images are defined once, and the check script catches any language mismatch. |
| An inline script in `<head>` sets the theme, `lang` and `dir` before the page is drawn | Avoids a flash of the wrong theme or direction. |
| localStorage keys are `portfolio-theme` and `portfolio-lang`; the first visit follows the system theme and `shared.defaultLang` | Matches the approved requirements. |
| The CSS uses only logical properties | RTL works without separate styles. |
| All text is inserted with `textContent` and never with `innerHTML` | Prevents injection from the content. |
| `<title>Portfolio</title>` is a hard-coded fallback | An empty title is invalid HTML. It is the only allowed exception, and the script overwrites it. |
| The language button's accessible name starts with its visible text, written in the language it switches to | Meets WCAG 2.5.3, and screen readers pronounce it correctly. |
| The check script lives in `tests/portfolio/`, outside the site | It doesn't ship with the site. |

## Review verdict
APPROVED with no blocking issues. See `04-review.md`.

## Follow-ups
- **S1 (developer):** add a note to the README that over `file://`, Chrome opens `cv.pdf` in the tab instead of downloading it. On a static host it downloads.
- **S2 (developer):** reword the GitHub Pages steps in the README so they fit both the branch option and the GitHub Actions option.
- **S3 (developer, low priority):** if `script.js` fails to load, the sections stay hidden.
- **S5 (developer, optional):** restrict the URL schemes allowed for links in `content.js`.
- **User (manual checks):**
  - a real screen reader;
  - Firefox, Safari and Edge;
  - a real phone;
  - the PDF in other viewers;
  - a native-speaker review of the Arabic text.
- **User (content):** replace the placeholder content, images and CV with real ones, then deploy.
