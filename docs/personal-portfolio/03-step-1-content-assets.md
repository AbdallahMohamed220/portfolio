# Step 1: Content file and placeholder assets

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Created `portfolio/content.js`, a plain script that sets `window.PORTFOLIO_CONTENT` with three blocks: `shared`, `en` and `ar`. There are no modules and no fetch.
- `en` and `ar` have the same keys, array lengths and value types (93 leaf values each). The Arabic copy is Modern Standard Arabic placeholder text.
- Created local placeholder SVGs: an avatar and one image per project. The SVGs contain no text, so every visible string comes from `content.js`.
- Wrote a minimal one-page PDF 1.4 (`cv.pdf`) by hand. It shows "Curriculum Vitae" and a note to replace the file. All xref offsets, `startxref` and the stream `/Length` were checked with Node.

## Files touched
- `portfolio/content.js` — new. Holds all content (schema below).
- `portfolio/assets/avatar.svg` — new. 320×320 placeholder portrait.
- `portfolio/assets/project-1.svg`, `project-2.svg`, `project-3.svg` — new. 640×400 placeholder screenshots in blue, green and amber.
- `portfolio/assets/cv.pdf` — new. 670-byte placeholder PDF with LF line endings.

## Schema (contract for Steps 2–4)
```
window.PORTFOLIO_CONTENT = {
  shared: {
    defaultLang: "en",
    links:  { email, github, linkedin, cv },   // email is a plain address; prefix "mailto:" in script.js
                                                // cv = "assets/cv.pdf"
    images: { avatar },                         // "assets/avatar.svg"
    projects: [ { id, image, demoUrl, sourceUrl } ]   // ids: project-1..3
  },
  en | ar: {
    meta:  { lang, dir, title, description },   // lang "en"/"ar", dir "ltr"/"rtl"; title -> <title>, description -> meta description
    nav:   { label, about, projects, skills, contact },   // label = aria-label for <nav>; skills = "Skills & Experience"
    ui:    { skipLink, menuOpen, menuClose, themeToDark, themeToLight,
             langToggle, langToggleLabel, downloadCv },
             // langToggle = visible text naming the OTHER language ("العربية" in en, "English" in ar)
             // langToggleLabel = its aria-label; themeToDark/themeToLight = theme button label for the action it performs
    hero:  { greeting, name, role, tagline, avatarAlt, ctaProjects, ctaContact },
    about: { title, paragraphs: [string] },
    projects: { title, intro, demoLabel, sourceLabel,
                items: [ { id, title, description, imageAlt, tags: [string] } ] },  // joined to shared.projects by id
    skills: { title, skillsTitle, groups: [ { name, items: [string] } ] },  // title = combined section heading
    experience: { title, items: [ { role, company, period, description } ] },
    contact: { title, intro, emailLabel, githubLabel, linkedinLabel },
    footer: { text }
  }
}
```
- Image paths are relative to `index.html`.
- Suggested section ids for Step 2: `about`, `projects`, `skills`, `contact`. These match the `nav` keys. The Skills & Experience section uses `skills.title` as its heading, with `skills.skillsTitle` and `experience.title` as sub-headings.

## Decisions
| Decision | Reason |
|----------|--------|
| Put URLs, image paths and the CV path once in `shared`, and match projects by `id` | Following the plan, URLs and paths are not duplicated. An `id` join is more robust than matching by array index when someone edits the content. |
| Store `email` without `mailto:` | It is easier for the owner to edit. `script.js` adds the prefix. |
| Keep the person's name in each language block, not in `shared` | The Arabic version needs its own script and spelling of the name. |
| Put `lang` and `dir` in `meta` | `script.js` can set `<html lang dir>` straight from the active block. |
| Make `langToggle` show the other language in its own script | This is the usual pattern. Users can always find their language. |
| Use separate `themeToDark` and `themeToLight` labels | The button label describes the action it performs, which works better for accessibility than a single generic label. |
| Keep tech names (HTML, Git, Figma…) in Latin script in `ar` | These are proper names that Arabic-speaking developers normally write in Latin script. |
| Use Western digits in `ar` periods (e.g. "2022 – حتى الآن") | They are common on Arabic tech sites and render reliably in RTL. Change them to Arabic-Indic digits if preferred. |
| Put no text inside the SVGs | All visible text has to come from `content.js` (DoD). Alt text lives in the content. |
| Use LF only in the PDF and the standard Type1 font Helvetica | Byte offsets stay predictable, and no font needs to be embedded. |

## Verification
I ran a check script with Node v22.21.0. It lives in the scratchpad, not in the repo. The script:
- loads `content.js` through `vm` with only a `window` object, the way a plain browser script runs;
- deep-compares the `en` and `ar` shapes;
- checks project ids, asset existence and the PDF structure.

The run returned `ALL PASS`. In detail:
- No `import`, `export`, `fetch` or `require` calls. `window.PORTFOLIO_CONTENT` has `shared`, `en` and `ar`.
- `en` and `ar` have identical keys, array lengths and types (93 leaves). There are no empty strings.
- The project ids in `en`, `ar` and `shared.projects` match.
- All of these files exist: `assets/cv.pdf`, `assets/avatar.svg`, `assets/project-1.svg`, `assets/project-2.svg` and `assets/project-3.svg`.
- PDF: LF only, `%PDF-1.4` header and `%%EOF` present. `startxref 487` matches the real xref position. The offsets of objects 1–5 (9, 58, 115, 241, 311) match. Each xref entry is exactly 20 bytes. The stream `/Length 125` matches.

The first run failed on the xref entry length. The file-write tool had stripped the required trailing space from each xref entry. I added the spaces back with `sed`, which does not change any object offsets, and re-ran the script. Every check passed.

Not verified: opening `cv.pdf` in a real browser PDF viewer and loading `content.js` in a real browser. No agent has a browser. The file is structurally valid, so it should open, but the user or Step 5 should confirm it manually.

## Open questions / follow-ups
- A native speaker should review the Arabic placeholder copy before real use (this is already listed as a plan risk).
- Step 5 can reuse the logic of the check script in `tests/portfolio/check-content.js`.
