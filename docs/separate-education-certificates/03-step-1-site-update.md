# Step 1: Restructure markup, nav keys, CSS and README

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- **Markup:** Education and Certificates are now top-level sections between Skills & Experience and Contact.
  - Each is a `<section class="section reveal">` (`#education`, `#certificates`) with `aria-labelledby` pointing at a new `h2.section-title` (`#education-title` / `#certificates-title`, `data-i18n` `education.title` / `certificates.title`). They use the existing `.container` layout.
  - The content markup is unchanged: `p.education-degree`, `p.education-institution`, `p.education-period` and `ul.certificate-list#certificates-list`. The old `h3` subsection titles are replaced by the `h2`s.
  - Skills & Experience keeps Skills, Experience and Languages. The `.credentials` wrapper and the two `credential-block` divs are gone. Languages is now `div.languages-block#languages`, a direct grid item of `.skills-layout`.
  - The nav has 6 links in page order: About, Projects, Skills & Experience, Education, Certificates, Contact.
- **Content:** added `nav.education` / `nav.certificates`: "Education" / "Certificates" in `en`, and "التعليم" / "الشهادات" in `ar`. The AR labels match the existing AR section titles.
- **CSS:**
  - Removed the stale `.credentials` rules (base, 768px and 1280px) and the `#certificates { grid-column: 1 / -1 }` rule, which would otherwise have targeted the new section.
  - Moved the inline-nav rules (`.site-nav`/`.header-actions` order, hiding `.nav-toggle`, the row layout of `.nav-menu`) from `@media (min-width: 768px)` to a new `@media (min-width: 1024px)` block. All other tablet layout (grids, hero, gutter) stays at 768px.
  - Updated the related comments. Link spacing is unchanged.
- **README:** the `nav` key row lists the 2 new keys. The line "Education, certificates and languages are shown inside the Skills & Experience section" became a numbered list of the 6 sections and their content keys, plus a note that the nav uses the menu button below 1024px.
- `script.js` and `check-content.js` did not need changes. `script.js` fills `#certificates-list`/`#languages-list` by id, and `.reveal` is generic. The check script's i18n-path check passes now that the `nav.*` keys exist.

## Files touched
- `portfolio/index.html`: 2 nav links, the new Education and Certificates sections, and Languages without the `.credentials` wrapper.
- `portfolio/content.js`: `nav.education` and `nav.certificates` in `en` and `ar`.
- `portfolio/styles.css`: removed the `.credentials`/`#certificates` rules, moved the inline nav to 1024px, and updated comments.
- `portfolio/README.md`: the `nav` keys row and the sections list.

## Decisions
| Decision | Reason |
|----------|--------|
| **Nav fit:** raise the inline-nav breakpoint to 1024px and keep the link spacing as it is | Measured at 768px (753px with scrollbar, 689px content box): 6 links are 598px (EN) / 583px (AR), and the header actions are 122 / 128px. At that width the brand got 0px and AR overflowed by 6px. Tightening was not enough. Cutting the link padding from 0.75rem to 0.375rem still leaves EN at about 665px for nav, actions and gaps, so the brand gets about 24px. Even at 900px, the brand would still be truncated after tightening. At 1024px (945px content with scrollbar), the existing spacing leaves 209px (EN) / 218px (AR) for the brand, so the full name shows with no truncation. The user had already accepted this fallback. |
| Only the header/nav rules move to 1024px. The other tablet rules stay at 768px | This is the smallest change that fixes the nav. The grids and hero layout at 768px were not affected. |
| Kept the link padding unchanged | Tightening could not make 768px work, so it would only shrink the click targets at 1024px+ for no gain. |
| Removed the `.credentials` wrapper and kept Languages as `.languages-block` | A grid wrapper around one block is noise. At 1280px Languages takes the second column next to Experience, as Credentials did before (screenshot `page-en-1280.png`). There is no visual redesign. |
| The education section's `h2` replaces the old `h3`, with the `p` elements directly under it | This avoids a duplicate heading with the same text, and keeps the `education-*` hooks from the markup contract. |
| Side effect: at 768–1023px the brand now shows the full name ("Abdallah Mohamed"), where it used to be truncated to "Abdallah Moha…" | With the links in the menu, the brand has the space. This is noted as a behaviour change for tablets in portrait. |

## Verification
- `node tests/portfolio/check-content.js` gives **34 passed, 0 failed, exit 0**. `node tests/portfolio/check-content.js --cv` gives **45 passed, 0 failed, exit 0**.
- `node --check` passes on `content.js` and `script.js`. `grep` finds no physical left/right properties in `styles.css` and no `innerHTML` and similar calls in `script.js`.
- `grep -c 'id="<x>"' index.html` returns 1 each for `education`, `certificates` and `languages`.
- Headless Chrome over `file:///D:/try_agent_workflow/portfolio/index.html`, scripts in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\sections\` (`cdp.js`, `measure.js`, `verify-step1.js`; output in `out.txt`). **75 passed, 0 failed.** Widths below 768 use mobile emulation, and 768+ use desktop emulation with a 15px scrollbar. The checks:
  - **Header:** 65px and one row (the brand, actions and toggle or links share a vertical centre). There is no horizontal scroll (`scrollWidth` and the bounding box of every element). This holds at 320, 360, 375, 768, 1023, 1024 and 1280 in EN and AR. The hamburger shows below 1024 and the 6 inline links show at 1024+. The brand is truncated only in EN at 320/360/375, as before.
  - **Structure (EN, AR):**
    - the section order is about, projects, skills, education, certificates, contact;
    - every section has `.section.reveal` and an `h2` linked by `aria-labelledby`;
    - the Education/Certificates `h2` equals `education.title`/`certificates.title`;
    - the nav `href`s are in page order, and the nav text includes the new labels;
    - the education text equals `education.*`, and 6 certificate links render in `#certificates`;
    - `#skills` holds skills, experience and 2 languages and no education or certificates, and no `data-i18n` is empty.
  - **Nav landing:** at 360 (through the menu), 768 (through the menu) and 1280 (inline) in EN and AR, each of the 6 links sets the hash and puts its heading (the `h1` for About) below the header bottom, in view and topmost at its point. The menu closes after the click.
  - **Mobile menu:** at 320, 768 and 1023 in EN and AR, Enter on the toggle opens it with 6 links in view, right under the header and with no horizontal scroll. Tab visits the 6 links in order. Escape closes it and returns focus to the toggle.
  - **Console:** 0 errors and 0 warnings over the whole run.
- I checked these screenshots by eye (in the `shots\` folder there): `hdr-en-1024.png`, `hdr-ar-1024.png` (6 links on one row with the full name), `hdr-en-768.png` (hamburger and full name), `menu-ar-320.png` (RTL menu with 6 links) and `page-en-1280.png` (Languages next to Experience, then the Education and Certificates sections).
- Not checked here (Step 2 covers them): theme toggle, reduced motion and the full earlier DoD regression.

## Open questions / follow-ups
- Tablets in portrait (768–1023px) now use the hamburger menu, as the user accepted. Step 2 should treat 1023 as the last hamburger width and 1024 as the first inline width.
