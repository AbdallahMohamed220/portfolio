# Summary: Fill the portfolio with real CV content and photo

## Result
The site in `portfolio/` now shows Abdallah Mohamed's real CV content in English and in a full Arabic translation:
- the real photo, with the real resume as the download;
- 12 projects with store links and their own app-icon SVGs;
- 4 jobs, 12 skills, education, 6 certificates and 2 languages;
- contact by email, phone, GitHub, LinkedIn and Stack Overflow.

Every URL comes from the PDF's link annotations and matches it exactly.

All Definition of Done items pass for this task (10/10). The original portfolio's Definition of Done also still holds (10/10):
- the check script passes in default mode (31/31) and in `--cv` mode (40/40);
- the headless Chrome checks pass 90/90, plus 14/14 header cases after the fix.

## Files changed
- `portfolio/content.js`: new schema, real English content and the Arabic translation.
- `portfolio/index.html`, `portfolio/script.js`, `portfolio/styles.css`: new fields and sub-sections; header fix.
- `portfolio/assets/`:
  - `avatar.jpg` (new)
  - `cv.pdf` (replaced with the real resume, byte-identical)
  - `project-<id>.svg` ×12 (new)
  - `avatar.svg` and `project-1..3.svg` (deleted)
- `portfolio/README.md`: new schema, check-script usage, the `file://` CV note and the GitHub Pages options.
- `tests/portfolio/check-content.js`: generic default mode plus an opt-in `--cv` mode that checks the content against the CV snapshot.
- `docs/portfolio-real-content/`:
  - `cv-data.en.json`, the CV snapshot that `--cv` reads
  - `01`–`05` docs

## Key decisions
| Decision | Reason / source |
|---|---|
| All 12 projects shown, newest first | User decision |
| Education, Certificates and Languages added inside `#skills` | User decision |
| Full Arabic translation; app, company and certificate names stay in Latin script | User decision |
| The phone is shown as +20 114 723 4230 | User decision |
| A store button is hidden when the CV has no link for it (DoctorCrypto has no App Store link) | User decision |
| Each project gets its own icon SVG; there are no screenshots | User decision |
| Bedayat has no contributions block | User decision; the CV has none |
| Alriyadh App's role is "Mobile Developer" | User decision |
| E.VISION's apps: Alriyadh, Waste Transportation, Taher | User decision |
| Arabic name "عبدالله محمد", role "مطوّر تطبيقات الجوال"; location "Cairo, Egypt" | User decision |
| E.VISION's link stays `http://` | As in the CV; it's unknown whether https works |
| Stack Overflow uses `shorturl.at/QYQxr` | It's the only short link in the PDF that isn't tied to a project |
| The old getportify portfolio link is not shown | This site replaces it |
| The check script's CV-fidelity checks are opt-in (`--cv`) | Review B1: the owner's own edits must not break the default check |
| Header brand: `nowrap` with an ellipsis | Review N1: the English header had wrapped to two rows on narrow screens |
| Original task's DoD item 1 says "placeholder content" | That content is now real on purpose (review N4) |

## Review verdict
APPROVED after one fix loop: blocking issue B1 and N1 were fixed and confirmed in loop 2. See `04-review.md`.

## Follow-ups
- **User (manual checks):**
  - open the short store links and the Udemy links to confirm they resolve;
  - review the Arabic text;
  - test with a screen reader;
  - try other browsers and a real phone, including `tel:` and `mailto:`.
- **Optional:** show the full name at tablet width by setting `.nav-link { padding-inline: 0.5rem }` for 768–1023px.
- **Optional (N6):** reject an argument starting with `-` right after `--cv` in the check script.
- **Deploy:** follow `portfolio/README.md`, using GitHub Pages or Netlify.
