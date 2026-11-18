# Step 2: Page structure and styles (`index.html`, `styles.css`)

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Created `portfolio/index.html`. It has semantic landmarks (skip link, `header` + `nav`, `main` with 4 `section`s `#about`, `#projects`, `#skills`, `#contact`, and a `footer`), real `<button>`s for the theme, language and mobile menu, a "Download CV" link (`assets/cv.pdf` with `download`), and basic meta tags. **There is no visible text in the file.** Every text slot is an empty element with a `data-i18n` hook. Lists are empty containers that `script.js` fills.
- Load order: `content.js` loads in `<head>`, then a small inline bootstrap script runs, and `script.js` loads at the end of `<body>`. `script.js` does not exist yet (Step 3 writes it).
- The inline bootstrap runs before first paint. It adds class `js` to `<html>`, sets `data-theme` (from the stored choice, or from `prefers-color-scheme` on the first visit), and sets `lang`/`dir` on `<html>` (from the stored language, or `shared.defaultLang`). This stops a flash of the wrong theme or direction.
- Created `portfolio/styles.css`. It is mobile-first (breakpoints at 768px and 1280px) and has light/dark tokens set by `:root[data-theme]`, with a `prefers-color-scheme` fallback when no `data-theme` is set. It uses logical properties only (no physical left/right), an Arabic font stack through `:lang(ar)`, `:focus-visible` outlines, `.reveal`/`.is-visible` fade-in, smooth scrolling only under `prefers-reduced-motion: no-preference`, and a `reduce` block that turns off transitions, animations and the fade-in. System fonts only, with no Google Font.

## Files touched
- `portfolio/index.html` — new.
- `portfolio/styles.css` — new.
- `portfolio/README.md` was not touched (the parallel Step 4 owns it).

## Contract for `script.js` (Step 3)

### Things on `<html>`
| Hook | Who sets it | Values / meaning |
|------|-------------|------------------|
| `data-theme` | bootstrap at load, then `script.js` on toggle | `"light"` or `"dark"`. CSS reads only this. |
| `lang`, `dir` | bootstrap at load, then `script.js` on language change | from `content[lang].meta.lang` / `.meta.dir` |
| class `js` | bootstrap | Turns on the JS-only CSS (hidden mobile menu, hidden `.reveal` until `.is-visible`). |
| localStorage `portfolio-theme` | `script.js` on toggle | `"light"` or `"dark"`. **The key must match the bootstrap.** |
| localStorage `portfolio-lang` | `script.js` on toggle | `"en"` or `"ar"`. **The key must match the bootstrap.** |

The bootstrap does not save anything. `script.js` should read the current `data-theme` and `lang` from `<html>` as the start state, and wrap `localStorage` calls in try/catch.

### Generic text hooks
- `data-i18n="<dot.path>"` — set `textContent` to `content[lang]` at that path (e.g. `hero.name`). Used paths: `ui.skipLink`, `hero.name` (×2: brand + h1), `nav.about|projects|skills|contact`, `hero.greeting|role|tagline|ctaProjects|ctaContact`, `ui.downloadCv`, `about.title`, `projects.title|intro`, `skills.title|skillsTitle`, `experience.title`, `contact.title|intro|emailLabel|githubLabel|linkedinLabel`, `footer.text`. All of them exist in both `en` and `ar`.
- `data-i18n-aria-label="<dot.path>"` — set the `aria-label` attribute. Used once: `#site-nav` → `nav.label`.
- `document.title` ← `meta.title`. `<meta name="description">` `content` ← `meta.description`. Both are empty in the HTML.

### Elements by id
| id | Element | What `script.js` does |
|----|---------|----------------------|
| `site-header` | `header` | none needed |
| `site-nav` | `nav` | aria-label through `data-i18n-aria-label` |
| `nav-toggle` | `button`, `aria-controls="nav-menu"`, `aria-expanded="false"` | Toggles `aria-expanded` `"true"`/`"false"`. Sets `aria-label` to `ui.menuOpen` / `ui.menuClose`. Has no visible text (icon only). Close it on Escape and when a nav link is clicked (CSS shows the menu only when `aria-expanded="true"`, below 768px). |
| `nav-menu` | `ul` | Contains `a.nav-link` with `href="#about|#projects|#skills|#contact"` |
| `lang-toggle` | `button` (empty) | `textContent` ← `ui.langToggle`, `aria-label` ← `ui.langToggleLabel`, **`lang` attribute ← the other language** (`"ar"` while on `en`) so it gets the right font and pronunciation |
| `theme-toggle` | `button` with two `aria-hidden` SVGs | `aria-label` ← `ui.themeToDark` when the theme is light, `ui.themeToLight` when it is dark. CSS swaps the moon/sun icon from `data-theme`, so there is no JS icon work. |
| `main` | `main`, `tabindex="-1"` | Skip-link target; none needed |
| `about`, `projects`, `skills`, `contact` | `section.section.reveal` | Add `is-visible` when the section scrolls into view. With reduced motion, or no `IntersectionObserver`, add it to all of them right away. |
| `hero-avatar` | `img` (`src="assets/avatar.svg"`, `alt=""`) | `src` ← `shared.images.avatar`, `alt` ← `hero.avatarAlt` |
| `cv-link` | `a.btn` with `download`, `href="assets/cv.pdf"` | `href` ← `shared.links.cv` (text through `data-i18n`) |
| `about-paragraphs` | `div.about-text` | One `<p>` per `about.paragraphs[]` |
| `projects-list` | `ul.project-grid[role=list]` | Project cards (markup below) |
| `skills-list` | `div.skill-groups` | Skill groups (markup below) |
| `experience-list` | `ol.timeline[role=list]` | Experience items (markup below) |
| `contact-email` | `a.contact-link` (**no `href` in the HTML**) | `href` ← `"mailto:" + shared.links.email` |
| `contact-email-value` | `span.contact-value`, `dir="ltr"` | `textContent` ← `shared.links.email` (hidden while empty) |
| `contact-github` | `a.contact-link`, `target="_blank" rel="noopener noreferrer"`, no `href` | `href` ← `shared.links.github` |
| `contact-linkedin` | same as above | `href` ← `shared.links.linkedin` |
| `about-title`, `projects-title`, `skills-title`, `contact-title` | section `h2`s | none (they are `aria-labelledby` targets) |

The contact links have no `href` until `script.js` sets it, so they cannot be focused before then.

### Markup for rendered items
Use `textContent` (or escape the values) for content strings. Don't inject raw HTML from content.

Project card (one `li` per `projects.items[]`, joined to `shared.projects` by `id`; `h3` because the section heading is `h2`):
```html
<li class="project-card">
  <img class="project-image" src="{shared.image}" alt="{imageAlt}" width="640" height="400" loading="lazy">
  <div class="project-body">
    <h3 class="project-title" id="{id}-title">{title}</h3>
    <p class="project-description">{description}</p>
    <ul class="tag-list" role="list">
      <li class="tag">{tag}</li>
    </ul>
    <p class="project-links">
      <a class="project-link" href="{demoUrl}" target="_blank" rel="noopener noreferrer" aria-describedby="{id}-title">{projects.demoLabel}</a>
      <a class="project-link" href="{sourceUrl}" target="_blank" rel="noopener noreferrer" aria-describedby="{id}-title">{projects.sourceLabel}</a>
    </p>
  </div>
</li>
```
Skill group (one per `skills.groups[]`, inside `#skills-list`; `h4` because the sub-heading is `h3`):
```html
<div class="skill-group">
  <h4 class="skill-group-title">{name}</h4>
  <ul class="tag-list" role="list">
    <li class="tag">{item}</li>
  </ul>
</div>
```
Experience item (one per `experience.items[]`, inside `#experience-list`):
```html
<li class="timeline-item">
  <h4 class="timeline-role">{role}</h4>
  <p class="timeline-meta">
    <span class="timeline-company">{company}</span>
    <span class="timeline-period">{period}</span>
  </p>
  <p class="timeline-description">{description}</p>
</li>
```
About paragraph: `<p>{paragraph}</p>` inside `#about-paragraphs`.

### CSS classes `script.js` toggles
`is-visible` on `.reveal`. Everything else is driven by attributes (`data-theme`, `dir`, `lang`, `aria-expanded`). There is also a `.visually-hidden` utility if Step 3 needs one.

## Decisions
| Decision | Reason |
|----------|--------|
| Use a generic `data-i18n` / `data-i18n-aria-label` dot-path hook instead of one id per string | `script.js` stays a short loop. Adding a text slot means adding only an attribute. Step 5 can check that every path exists. |
| Load `content.js` in `<head>`, plus an inline bootstrap for theme/lang/dir | The plan asks for the theme to be applied early. Only a head script can run before first paint. Reading `content.js` lets it use `meta.dir` and `defaultLang` instead of duplicating them. `script.js` still loads after `content.js`. |
| Leave `<title>` and the meta description empty in the HTML | DoD: all visible text comes from `content.js`. Cost: an empty `<title>` is an HTML validation error, and the tab shows the file name until `script.js` runs (see open questions). |
| Show the icon of the action (moon in light, sun in dark) through CSS only | It matches `themeToDark`/`themeToLight` "action" labels. No JS icon logic. |
| Hide the mobile menu and the `.reveal` sections only under `html.js` | Without JS the nav stays usable, and content is never stuck invisible. |
| Put the CV button in the hero (as `.btn-secondary`) | It is the most visible place for recruiters. The plan does not set a location. |
| Show the email address under the "Email" label (`#contact-email-value`, `dir="ltr"`) | Recruiters often copy the address. `dir="ltr"` keeps it readable in RTL. |
| Indigo accent (`#4338ca` light / `#a5b4fc` dark) | Matches the Step 1 avatar SVG palette. All pairs pass AA (see Verification). |
| System fonts only. Separate Arabic stack (`Segoe UI`, `Tahoma`, `Noto Sans Arabic`, `Geeza Pro`) | No external dependency. The Google Font was optional. |
| `minmax(0, 1fr)` grid tracks and `overflow-wrap: anywhere` on the email | Prevents horizontal scroll from long words or URLs at 360px. |

## Verification
All checks ran with Node v22.21.0 and headless Chrome. The scripts live in the scratchpad, not in the repo.
- **Structural check** (`check-step2.js`): ALL PASS.
  - Every `data-i18n*` path resolves to a string in both `en` and `ar`. The 25 ids are unique. Every `href="#…"`, `aria-controls` and `aria-labelledby` target exists, and all 4 section ids are present.
  - Every local `src`/`href` file exists (except `script.js`, which belongs to Step 3). `content.js` comes before `script.js`. The CV link has `download`, and the 3 toggles are `type="button"`.
  - The body has **no visible text** once comments, scripts and SVGs are removed.
  - CSS: braces are balanced, there are no physical `left`/`right` properties, and all required features are present.
  - The bootstrap runs in `vm` with mocks: first visit with system dark gives `dark/en/ltr`, system light gives `light`, stored `light`+`ar` gives `light/ar/rtl`, and invalid stored values fall back to the defaults.
- **Contrast (WCAG)**, computed:
  - Light: text/bg 17.5, muted/surface 7.31, accent links 7.26+, button text 7.90, tags 9.27.
  - Dark: text/bg 15.7, muted/surface 7.87, accent 8.62+, button text 9.19, tags 9.30.
  - Every pair is ≥ 7:1 (AA needs 4.5). Focus outlines are ≥ 7:1 (non-text contrast needs 3).
- **No horizontal scroll** (headless Chrome, page in iframes of exact width, rendered by a test-only `script.js` in a scratch copy that follows the markup above): `scrollWidth === clientWidth`, and no element sits outside the viewport. This held for **360, 768 and 1280px × EN/AR × menu closed/open** (12/12 pass).
- **Screenshots** were checked by eye: 360px EN dark with the menu open, 360px AR dark, 768px AR light, and 1280px EN dark. The RTL mirroring (header, hero grid, timeline line), icon swap, cards and contact grid all look correct.
- Not verified: the real `script.js` behaviour (Step 3). Over `file://`, the page currently logs one "file not found" error for `script.js` until Step 3 adds it. Without it, the text slots are empty and the `.reveal` sections stay hidden.

## Open questions / follow-ups
- **Empty `<title>`:** this is strict about the "all text from `content.js`" rule, but it is invalid HTML. The alternative is a short neutral fallback such as `<title>Portfolio</title>`, which `script.js` overwrites. That would be a deliberate exception for the Step 5 "no hard-coded text" check. This is the orchestrator's or user's call.
- Step 3 must use the localStorage keys `portfolio-theme` and `portfolio-lang`. If it uses different keys, it must also edit the inline bootstrap in `index.html`.
- The language button's visible text ("العربية") differs from its `aria-label` ("Switch the site language to Arabic"). Strictly, WCAG 2.5.3 (label in name) prefers the aria-label to contain the visible text. This could be fixed later in `content.js` by putting the visible word inside the label.
