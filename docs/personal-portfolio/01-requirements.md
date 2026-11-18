# Requirements: Personal portfolio website

**Task id:** personal-portfolio  
**Status:** approved

## Goal
Build a personal portfolio website that presents the owner (about, projects, skills/experience, contact) to recruiters and clients. It must be easy to edit and deploy as a static site.

## In scope
- A single-page static site built with plain HTML, CSS and JavaScript (no framework, no build step).
- Sections: Hero/About, Projects, Skills & Experience, Contact.
- English and Arabic with a language toggle. Arabic switches the layout to RTL (`dir="rtl"`).
- Dark/light theme toggle.
- Responsive layout for mobile, tablet and desktop.
- Light animations: fade-in when sections scroll into view, and smooth scrolling.
- "Download CV" button that links to a placeholder PDF.
- Contact section with links only: email (`mailto:`), GitHub, LinkedIn.
- All content is placeholder data kept in one editable file, so real data can be added later without touching the layout code.

## Out of scope
- Backend, database, or a working contact form.
- CMS or admin panel.
- Deployment and domain setup (the README only documents how to deploy).
- Blog, analytics, SEO beyond basic meta tags.
- Real personal content: placeholders only.

## Constraints
- No frameworks and no npm build. It must work by opening `index.html` directly, or from any static host (GitHub Pages or Netlify).
- No external runtime dependencies are required. A Google Font is optional, with a system-font fallback.
- Accessible basics: semantic HTML, alt text, keyboard-focusable controls, sufficient contrast in both themes.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## Inputs / outputs
- **Input:** a content file, `content.js` or JSON, holding EN and AR text, projects, skills, experience and links.
- **Output files:** live in a project folder (`portfolio/`) and include `index.html`, `styles.css`, `script.js`, the content file, `assets/` (placeholder images and `cv.pdf`), and a `README.md` that explains how to edit the content and deploy.

## Assumptions
- The site lives in `portfolio/` at the repo root, because the repo has no existing app.
- Content is stored as a JS object (`content.js`) rather than JSON, so the site works over `file://` without fetch/CORS issues.
- The theme and language choices are remembered in `localStorage`. On the first visit, the theme follows the system setting and the language defaults to English.
- Placeholder images are simple local SVGs, so the site does not depend on external image hosts.

## Definition of done
- [ ] Opening `portfolio/index.html` directly in a browser shows all 4 sections with placeholder content, and the console shows no errors.
- [ ] All visible text comes from the content file. Editing a value there changes the page.
- [ ] The language toggle switches EN ↔ AR, the page direction switches LTR ↔ RTL, and the choice persists after reload.
- [ ] The theme toggle switches dark ↔ light, the choice persists after reload, and the first visit follows the system preference.
- [ ] The layout works without horizontal scroll at 360px, 768px and 1280px widths, and the nav is usable on mobile.
- [ ] Sections fade in on scroll. Animations are disabled when `prefers-reduced-motion` is set.
- [ ] The "Download CV" button downloads `assets/cv.pdf`.
- [ ] The contact links (mailto, GitHub, LinkedIn) are present and open correctly.
- [ ] Toggles and links can be reached and used with the keyboard, and images have alt text.
- [ ] `portfolio/README.md` explains how to edit the content, replace the CV and images, and deploy to GitHub Pages/Netlify.

## Q&A log
| Question | Answer |
|----------|--------|
| Tech stack? | Plain HTML/CSS/JS |
| Sections? | About, Projects, Skills/Experience, Contact (all) |
| Content? | Placeholders for now |
| Language? | Both EN + AR with toggle |
| Contact? | Links only (no form) |
| Extras? | Dark/light toggle, responsive, light animations, downloadable CV |
