# Summary: Give Education and Certificates their own sections

## Result
Education and Certificates are now top-level sections on the live site, https://abdallahmohamed220.github.io/portfolio/. The page order is About → Projects → Skills & Experience → Education → Certificates → Contact. Skills & Experience keeps Skills, Experience and Languages.

The nav has 6 links in page order in EN and AR. To keep the header to a single row, the hamburger menu now shows below **1024px** (before, it was below 768px). The 6 links appear inline from 1024px.

**Side effect:** on tablets at 768–1023px, the full name now shows in the header, where it used to be cut off.

**Verification:**
- locally: 73 of 73 headless Chrome checks pass in EN and AR;
- both check-script modes pass (34 and 45 checks);
- the Pages run 44511048125 succeeded;
- the live files are byte-identical to commit `d31d87e`.

## Files changed
- `portfolio/index.html`: two new `<section>`s, `#education` and `#certificates`, each with its own h2 and `aria-labelledby`; Skills & Experience no longer contains them; the nav has 6 links.
- `portfolio/content.js`: `nav.education` and `nav.certificates` added in EN ("Education", "Certificates") and AR ("التعليم", "الشهادات").
- `portfolio/styles.css`: the old credentials grid rules are removed; the inline-nav rules moved to `@media (min-width: 1024px)`.
- `portfolio/README.md`: the sections list and the nav keys.
- `docs/separate-education-certificates/01`–`05`.
- Commits:
  - `d31d87e` (site plus the first docs);
  - a follow-up docs commit.

## Key decisions
| Decision | Reason |
|---|---|
| The new sections go after Skills & Experience | User decision |
| Languages stays in Skills & Experience | User decision |
| Two nav links are added, and the change is pushed to the live site | User decision |
| The hamburger breakpoint moves from 768px to 1024px, for the header only | 6 links didn't fit at 768px (the name got 0px, and Arabic overflowed by 6px), and tightening the spacing wasn't enough. The user accepted this fallback in the requirements. |
| The section headings reuse `education.title` and `certificates.title` | No content changed |
| The live site was checked by comparing its files byte for byte with the commit | The served files are the same files Step 2 tested in a browser; the reviewer accepted this |

## Review verdict
APPROVED with no blocking issues. See `04-review.md`.

## Follow-ups
- **Recommended (separate small task):**
  - **Problem:** in Arabic, date ranges show reversed ("09/2018 – 09/2014"). This was already the case before this task, and the experience and project periods can be affected the same way.
  - **Fix:** wrap each period in a `<span dir="ltr">`. Put it on the span, not the `<p>`, so the line stays right-aligned in Arabic.
- **Optional:**
  - check that the header doesn't overflow at 768–1023px with JavaScript off;
  - add a check-script test that the nav links match the section ids in order;
  - update the workflow actions away from Node 20.
