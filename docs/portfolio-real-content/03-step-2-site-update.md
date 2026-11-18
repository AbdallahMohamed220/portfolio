# Step 2: Schema, markup, styles, script, EN/AR content and assets

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- **`content.js`:** extended the schema (full listing below) and replaced every placeholder:
  - The EN text is copied from `cv-data.en.json`. Every URL is copied verbatim from that file.
  - The AR text is a full Modern Standard Arabic translation. App, company and technology names and the certificate titles stay in Latin script.
  - `en` and `ar` have identical shapes.
- **Assets:**
  - `avatar.jpg` is copied from the photo.
  - `cv.pdf` is copied over the old one and is byte-identical to the source.
  - Added 12 app-icon SVGs, one per project. Each is 128×128 with rounded corners, the project's initial in white, and its own colour. White on each colour has a contrast ratio of 4.99–7.31.
  - Deleted `avatar.svg` and `project-1/2/3.svg`, which nothing referenced any more.
- **`index.html`:**
  - The favicon is now `avatar.jpg`.
  - Added a hero location line (pin icon plus `hero.location`). The avatar is now `avatar.jpg`, 400×400.
  - `#skills-list` is now a `<ul>`.
  - Added a `.credentials` block inside `#skills` with Education (static `data-i18n`), `#certificates-list` and `#languages-list`.
  - Added contact links `#contact-phone`, whose number is shown through `data-i18n="contact.phoneDisplay"` inside `dir="ltr"`, and `#contact-stackoverflow`.
  - No hard-coded text was added.
- **`script.js`:**
  - `renderProjects` builds compact cards and joins them to `shared.projects` by `id`. A store button is rendered only when its URL is truthy. The contributions and challenge go in a native `<details>`, which is left out entirely when both are empty (Bedayat). Open `<details>` stay open across a language switch.
  - `renderSkills` renders name plus description.
  - `renderExperience` renders the company as a link (`shared.experience` by `id`), the role, period and location, and the apps as tags.
  - The new `renderCredentials` renders the certificates (`shared.certificates` by `id`, `dir="auto"`) and the languages.
  - `renderContact` adds `tel:` and Stack Overflow.
  - Text still goes only through `textContent`, via `el()`.
- **`styles.css`:**
  - Compact project cards: icon and title row, a meta line, a `<details>` block, and 44px store buttons.
  - Skill cards in 1, 2 or 3 columns. At 1280px the skills span the full width, and Experience and Credentials share the row below.
  - The contact grid is 1, 2 or 3 columns.
  - Only logical properties are used, and the old `.skill-group*` rules are removed.

### Final `content.js` schema (Steps 3–5 depend on this)
```
window.PORTFOLIO_CONTENT = {
  shared: {
    defaultLang: "en",
    links: { email, phone, github, linkedin, stackoverflow, cv },
      // email: plain address (page adds "mailto:"); phone: "+201147234230" (page adds "tel:")
      // stackoverflow: "https://shorturl.at/QYQxr"; cv: "assets/cv.pdf"
    images: { avatar: "assets/avatar.jpg" },
    projects: [ { id, image, googlePlayUrl, appStoreUrl } ×12 ],
      // image: "assets/project-<id>.svg"; a store URL may be null -> button hidden
      // (only doctorcrypto.appStoreUrl is null)
    experience: [ { id, companyUrl } ×4 ],     // ids: evision, alwsata, csskw, rizme
    certificates: [ { id, url } ×6 ]           // ids: clean-code, clean-architecture-flutter,
                                               // flutter-bloc, flutter-dart-2022,
                                               // dart-novice-expert, flutter-dart-guide-2023
  },
  en | ar: {                                   // identical shape
    meta: { lang, dir, title, description },
    nav: { label, about, projects, skills, contact },
    ui: { skipLink, menuOpen, menuClose, themeToDark, themeToLight, langToggle,
          langToggleLabel, downloadCv,
          projectDetails, keyContributions, keyChallenge, googlePlay, appStore },   // last 5 new
    hero: { greeting, name, role, location, tagline, avatarAlt, ctaProjects, ctaContact },
    about: { title, paragraphs: [string ×1] },
    projects: { title, intro,
      items: [ { id, title, period, role, tech, description,
                 contributions: [string],      // may be [] (bedayat) -> block hidden
                 challenge?,                   // only fix-infinity, chkchk, messayel; same in both langs
                 imageAlt } ×12 ] },           // order = shared.projects order, newest first
    skills: { title, skillsTitle, items: [ { name, description } ×12 ] },
    experience: { title, appsLabel,
      items: [ { id, company, role, period, location, apps: [string] } ×4 ] },
    education: { title, degree, institution, period },
    certificates: { title, items: [ { id, title } ×6 ] },
    languages: { title, items: [string ×2] },
    contact: { title, intro, emailLabel, phoneLabel, phoneDisplay,   // phoneDisplay "+20 114 723 4230"
               githubLabel, linkedinLabel, stackoverflowLabel },
    footer: { text }
  }
}
```
Removed keys: `shared.projects[].demoUrl/sourceUrl`, `projects.demoLabel/sourceLabel`, `projects.items[].tags` (replaced by `tech`), `skills.groups` (replaced by `skills.items`) and `experience.items[].description`.

### Markup contract (new or changed hooks)
- `#projects-list > li.project-card`, containing:
  - `.project-header`: `img.project-image`, `h3.project-title#<id>-title` and `.project-meta`, which holds `.project-period` and `.project-role`;
  - `.project-body`: `.tag-list` (tech), `.project-description`, then `details.project-details[data-project=<id>]`. Inside it are `summary.project-details-summary[aria-describedby=<id>-title]` and `.project-details-body`, which holds `h4.project-subtitle`, `ul.project-contributions` and `p.project-challenge`;
  - `.project-links`, holding `a.project-link[target=_blank][rel="noopener noreferrer"][aria-describedby=<id>-title]`.
- `#skills-list > li.skill-item`, holding `h4.skill-name` and `p.skill-description`.
- `#experience-list > li.timeline-item`, holding:
  - `h4.timeline-company > a.timeline-company-link`;
  - `.timeline-meta`, with `.timeline-role`, `.timeline-period` and `.timeline-location`;
  - `.timeline-apps-label` and a `.tag-list`.
- `#education` (`data-i18n` `education.*`); `#certificates-list > li.certificate-item > a.certificate-link[dir=auto]`; `#languages-list > li.tag`.
- Contact: `#contact-email`, `#contact-phone`, `#contact-github`, `#contact-linkedin` and `#contact-stackoverflow`. The email value (`#contact-email-value`) and the phone value both have `dir="ltr"`.

## Files touched
- `portfolio/content.js`: new schema and real EN/AR content.
- `portfolio/index.html`: favicon, hero location, avatar, the skills/credentials markup and two contact links.
- `portfolio/script.js`: the project, skill and experience renderers, the new `renderCredentials`, and the contact links.
- `portfolio/styles.css`: hero location, compact project cards, skill cards, credentials and grid columns.
- `portfolio/assets/avatar.jpg`: new (SHA-256 `71119f98…3531`, identical to the source photo).
- `portfolio/assets/cv.pdf`: replaced with the real resume (SHA-256 `6f6609a5…be147`, identical to the source).
- `portfolio/assets/project-{alriyadh-app,waste-transportation-request,taher,home-experience,fix-infinity,alwsata-employees,alwsata-real-estate,al7feaz,doctorcrypto,chkchk,messayel,bedayat}.svg`: new.
- `portfolio/assets/avatar.svg` and `project-1.svg`, `project-2.svg`, `project-3.svg`: deleted.
- `portfolio/README.md` and `tests/portfolio/check-content.js` were not edited (Steps 3 and 4).

## Decisions
| Decision | Reason |
|----------|--------|
| URLs for jobs and certificates live in `shared.experience` and `shared.certificates`, joined to the language items by `id` | This follows the existing `shared.projects` pattern, so URLs are written once and are not duplicated per language. |
| A null store URL hides the button: `appStoreUrl: null` for DoctorCrypto | User decision. The key stays, so every project has the same shape. |
| Contributions and challenge go in a native `<details>` (summary "More details"), and the description stays visible | This keeps 12 cards short at 360px with no JS. The summary has `aria-describedby` set to the card title, so the 11 identical summaries can be told apart. |
| No `<details>` for Bedayat | It has no contributions and no challenge, so the block would be empty. |
| Small 56px app icons next to the title, instead of the old 16:10 banner | The images are compact cards, and a banner of a single letter wastes space on mobile. |
| Icons use one letter, as the user decided. Four projects share the letter "A" and are told apart by colour | User decision. |
| Moved the store labels and the "Key contributions" and "Key challenge" labels to `ui` | The plan says so. The old `projects.demoLabel/sourceLabel` were removed. |
| `hero.location` is "Cairo, Egypt" / "القاهرة، مصر" | The CV says Cairo. The country helps international readers, and the phone number (+20) and job data already say Egypt. Job locations keep the CV values. |
| The AR name is "عبدالله محمد" | A person's name is not an app, company or technology name, so it is written in Arabic script on the Arabic page. |
| Certificate titles stay in English in `ar`, and the links have `dir="auto"` | They are official Udemy course titles, and the linked certificates are in English. `dir="auto"` keeps the trailing brackets of "[Arabic]" and "[2023 Edition]" correct in RTL. |
| The tagline, project intro and contact intro are newly written. Every CV fact comes from the JSON | The placeholder copy needed replacing, and none of the new text adds facts beyond the CV. |
| The project intro says "worked on", not "built" | For two Alwsata apps he built only part of the UI. |
| Western digits are used for dates and the phone number in AR | They match the CV and the store and Udemy pages, and they keep the `tel:` number and the visible number the same. |
| Open `<details>` stay open across a language switch | Re-rendering would otherwise silently collapse what the visitor opened. |

## Verification
- `node --check` passes on `script.js` and `content.js`.
- `grep` finds no `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write`, and no physical `left`/`right` margin, padding, border, float or text-align in `styles.css`.
- `sha256sum`: `assets/cv.pdf` = the source = `6f6609a598cb3990c90919fb99c92579b645a9416a683d1938d01867753be147`. `avatar.jpg` equals the source photo.
- `node tests/portfolio/check-content.js`: **14 passed, 1 failed**. Passing checks include the `en`/`ar` shape match, project ids, all 20 asset paths, the 51 i18n paths and no hard-coded HTML text. The one failure is owned by Step 4:
  - `FAIL assets/cv.pdf is a structurally valid PDF — trailer /Size does not match xref count 2`. The real resume has an incremental update (a 2-entry xref section), which the hand-written xref check does not handle. The file itself is byte-identical to the source.
  - The old script also checks the email and https for GitHub/LinkedIn and passes trivially on the removed `demoUrl/sourceUrl`. Step 4 replaces these checks.
- Browser check: `…\scratchpad\step2-rc\verify-step2.js` (Node v22.21.0, headless Chrome 157 over CDP, `file://`) gives **238 passed, 0 failed, ALL PASS**. The output is in `…\scratchpad\step2-rc\out.txt`. It checks the following.
  - **EN and AR each:**
    - lang/dir, title, no empty `data-i18n`, and the hero name/role/location ("Abdallah Mohamed" / "Mobile Developer" in EN);
    - `avatar.jpg` loaded at 400px with alt, and the About text equals the CV profile;
    - 12 cards in the CV order. For each card: the store `href`s equal `cv-data.en.json` (23 links, and DoctorCrypto has Google Play only), `target`, `rel` and `aria-describedby`, the period/role/tech/description, the contributions, the challenge only on the 3 projects, `<details>` absent only for Bedayat, and a distinct icon loaded with alt;
    - 12 skills; 4 jobs with company `href`, period, location and apps; education; 6 certificates with the exact Udemy URLs; 2 languages;
    - 5 contact links with exact `href`s (`mailto:Dev.Fluttery@gmail.com`, `tel:+201147234230`, GitHub, LinkedIn, Stack Overflow), with the email and phone value in `dir="ltr"`;
    - the CV link has `download`, and no placeholder strings appear in the text or the `href`s;
    - in AR, the app and company names stay Latin.
  - **Layout:** no horizontal scroll at 360, 768 and 1280px in EN and AR, with every `<details>` closed and with every one open. This checks both `scrollWidth` and the bounding box of every element.
  - **Toggles:** theme and language persist after a reload. A language switch re-renders 12 cards with no duplicates, and an open `<details>` stays open.
  - **Keyboard (1280px):** Tab reaches the language, theme and CV controls, 11 summaries, 23 store links, 4 company links, 6 certificate links and 5 contact links. Every stop shows a focus outline. Enter opens a summary and Space closes it. At 360px, Enter opens the menu, and Escape closes it and returns focus to the toggle.
  - **Motion:** fade-in shows only the first section until you scroll. Reduced motion shows every section at once and turns off smooth scroll.
  - **Console:** 0 errors and 0 warnings over the whole run.
- I checked these screenshots by eye; all are in the scratchpad `step2-rc` folder:
  - `v-ar-1280-dark.png`: the RTL mirror and the 3-column cards are correct.
  - `v-en-360.png` and `v-ar-360-open.png`: the cards, the open details and the bidi of mixed Latin/Arabic text are correct.
  - `v-en-768.png`.
- Not verified: a real screen reader, browsers other than Chrome, and whether the short store URLs resolve. Resolving them is out of scope.

## Open questions / follow-ups
1. **Arabic copy review (user):** all of the AR text was written by the agent. In particular:
   - the name spelling "عبدالله محمد" (versus "عبد الله");
   - "مطوّر تطبيقات الجوال" for "Mobile Developer";
   - the degree "علوم الحاسب" and "كلية الحاسبات والمعلومات".
2. **Certificate titles in AR** are kept in English, as proper course names. If the user wants them translated, only `ar.certificates.items[].title` changes.
3. **Hero location** "Cairo, Egypt" adds the country to the CV's "Cairo". Revert it to "Cairo" if the user wants the exact CV text.
4. **For Step 4:** these checks need to change:
   - the PDF check (it fails today, as described above);
   - the external-link check, which must now cover `shared.projects[].googlePlayUrl/appStoreUrl` (allowing null), `shared.experience[].companyUrl` (allowing `http://` for E.VISION), `shared.certificates[].url` and `links.stackoverflow`;
   - a new check that `links.phone` matches `^\+\d+$`.
5. **For Step 3:** `portfolio/README.md` still describes the old schema, `avatar.svg` and `project-1..3.svg`.
6. This doc is named `03-step-2-site-update.md`, as the orchestrator asked. The plan's name was `03-step-2-content-markup.md`.

## Review fix 1 (N1: the English header wraps)

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

### What was done
Applied the CSS change from `04-review.md` N1 so the header stays on one row. The real name "Abdallah Mohamed" is longer than the old placeholder, and it made the EN header wrap to 84–99px at 320–375px and at 753px. The markup did not change.

### Files touched
- `portfolio/styles.css`:
  - `.header-inner`: `flex-wrap: wrap` became `nowrap`.
  - `.brand`: added `flex: 1 1 auto; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;` plus a short comment. `margin-inline-end: auto` is kept.
  - `.site-nav` and `.header-actions`: `flex-shrink: 0`.
  - `@media (min-width: 768px)` `.nav-menu, .js .nav-menu`: `flex-wrap: nowrap`.

### Decisions
| Decision | Reason |
|----------|--------|
| Did not apply the optional fallbacks (`.nav-link { padding-inline: 0.5rem }` at 768–800px, or `font-size: 1rem` below 400px) | The review makes them conditional on the brand showing fewer than about 6 characters. The fewest shown is 10 characters ("Abdallah M…" at EN 320). At 768px with a scrollbar (753px content), 15 of 16 characters show ("Abdallah Moha…" in the screenshot), so the space really does run out there. |
| Ellipsis instead of a smaller or second-line name | The review's choice. The full name stays in the DOM, so the link's accessible name is unchanged. |

### Verification
All paths below are in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\fix1-dev\`.
- Script `hdr-fix1.js` (headless Chrome over `file:///D:/try_agent_workflow/portfolio/index.html`; the language is set through `localStorage` and the page is reloaded). Widths below 768 use mobile emulation. 768, 1024 and 1280 use desktop emulation, which has a 15px scrollbar, so "768" is the 753px-with-scrollbar case at the 768px breakpoint. Result: **14/14 PASS** (EN and AR × 320, 360, 375, 753, 768, 1024, 1280). Raw data is in `results.json`.
  - `#site-header` is **65px** (64px plus the 1px border) at every width in both languages. Before this fix it was 84–99px in EN at 320–375 and 753.
  - There is no horizontal scroll (`scrollWidth <= clientWidth`), with the menu closed or open.
  - Below 768px, the hamburger is visible, on the same row as the brand, and inside the viewport. The open menu sits right under the header, and Escape closes it and returns focus to the toggle. At 768px and up, the hamburger is hidden and the 4 nav links sit on one row.
  - The brand is truncated with an ellipsis only in EN at 320 (10 of 16 characters show), 360 (13), 375 (15) and 768 with a scrollbar (15). It is never truncated in AR or at 753, 1024 or 1280. `textContent` is always the full name.
  - **Keyboard:** Tab from the top goes skip link → brand → (menu toggle or the 4 nav links) → language → theme. Every header stop is in view, is the top element at its centre, and has a `solid 3px` outline. The brand shows `:focus-visible` at 360 and 768.
- I checked these screenshots by eye (in `shots\`):
  - `en-360.png`: one row with "Abdallah Moha…", العربية, theme and hamburger.
  - `en-768.png`: one row with "Abdallah Moha…", About, Projects, Skills & Experience, Contact, العربية and theme.
  - `en-360-brand-focus.png`: the focus ring around the truncated brand is drawn in full. `overflow: hidden` does not clip the element's own outline.
  - `ar-360.png`: the RTL header is on one row.
- `node tests/portfolio/check-content.js` still passes in default mode and with `--cv`.

### Open questions / follow-ups
- Optional, if the user wants the full name at tablet width: add `.nav-link { padding-inline: 0.5rem; }` inside a 768–1023px range. It frees about 32px, and the brand needs about 10px more. I did not apply it because the review's condition was not met.
- The tester re-checks this with Step 5's header probe, as the review asks.
