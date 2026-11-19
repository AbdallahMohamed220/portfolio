# Requirements: Give Education and Certificates their own sections

**Task id:** separate-education-certificates  
**Status:** approved

## Goal
Make Education and Certificates easier to find on the portfolio. Today they are sub-blocks inside "Skills & Experience". Each one becomes its own top-level section with a nav link, and the change is published to the live site.

## In scope
- **Page order:** About → Projects → Skills & Experience → **Education** → **Certificates** → Contact.
- **Two new `<section>` elements** in `portfolio/index.html`, using the ids `#education` and `#certificates`. These ids are currently on the sub-block `div`s, so they move to the new sections. Each section:
  - has its own `<h2 class="section-title">` with `aria-labelledby`;
  - uses the `section reveal` classes, so the fade-in works;
  - follows the existing section layout.
- **Skills & Experience** keeps Skills, Experience and **Languages**. The Education and Certificates blocks are removed from it.
- **Nav:** two new links, Education and Certificates, in both languages, so the nav has 6 links in page order.
- **Content keys:** add `nav.education` and `nav.certificates` in `en` and `ar`. Reuse the existing `education.*` and `certificates.*` keys for the section headings and content. The `en` and `ar` keys stay identical.
- **Styling:** adjust the CSS only as far as needed for the new sections and the 6-link nav. The header must stay a single row at 64–65px. If 6 links don't fit at tablet width, raise the breakpoint where the nav switches to the hamburger menu, or tighten the link spacing.
- **Updates:** update `portfolio/README.md` (the sections list) and `tests/portfolio/check-content.js` if any of its checks depend on the old structure.
- **Publish:** commit and push to `main`, which redeploys https://abdallahmohamed220.github.io/portfolio/. Confirm the run succeeds and the live site shows the new sections.

## Out of scope
- Changing the education or certificate content itself (text, links, the order of certificates).
- Moving Languages.
- Any other redesign.

## Constraints
- Every earlier Definition of Done item must still hold:
  - EN/AR with RTL;
  - theme toggle;
  - no horizontal scroll at 360, 768 and 1280px;
  - keyboard access, with the mobile menu closing on Escape;
  - reduced motion;
  - no hard-coded text, `textContent` only;
  - no console errors;
  - both check-script modes pass.
- Use logical CSS properties only.
- Commits use the repo-local noreply identity and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Don't force-push.

## Inputs / outputs
- **Inputs:** the existing `portfolio/` site.
- **Outputs:**
  - updated `portfolio/index.html`, `content.js`, `styles.css` (and `script.js` only if needed) and `README.md`;
  - `tests/portfolio/check-content.js` if needed;
  - one commit pushed to `main`;
  - this task's docs.

## Assumptions
- **Nav labels:**
  - EN: "Education" and "Certificates";
  - AR: "التعليم" and "الشهادات", matching the existing section titles if they already use those words.
- **Section headings:** reuse `education.title` and `certificates.title`.
- **Docs:** this task's docs go in the same final commit as the code, or a follow-up docs commit, as in the previous task.

## Definition of done
- [ ] The page shows six sections in this order: About, Projects, Skills & Experience, Education, Certificates, Contact. Education and Certificates are top-level sections with their own `h2`, and they are no longer inside Skills & Experience.
- [ ] Skills & Experience still shows Skills, Experience and Languages.
- [ ] The nav has 6 links in page order in EN and AR, and the Education and Certificates links scroll to their sections. Section headings aren't hidden under the sticky header.
- [ ] The header stays one row (64–65px) at 320, 360, 375, 768, 1024 and 1280px in EN and AR, with no horizontal scroll. The mobile menu shows all 6 links and works with the keyboard.
- [ ] The education details and all 6 certificate links render exactly as before, in both languages.
- [ ] Both `node tests/portfolio/check-content.js` and `--cv` pass, and every earlier Definition of Done item still holds, with no console errors.
- [ ] The README's sections list matches the new structure.
- [ ] The commit is pushed, the Pages run succeeds, and the live site shows the new sections and nav links.

## Q&A log
| Question | Answer |
|----------|--------|
| Where do the new sections go in the page order? | After Skills & Experience |
| Where do Languages go? | They stay in Skills & Experience |
| Nav links and publishing? | Add 2 nav links, then commit and push to the live site |
