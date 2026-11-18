# Summary: Use real store app icons for portfolio projects

## Result
- **Icons:** 6 of the 12 project cards now show the app's real store icon, stored as a local file in `portfolio/assets/`:
  - Alriyadh App
  - Waste Transportation Request
  - Home Experience
  - Alwsata Employees
  - Alwsata Real Estate
  - Bedayat
- **Letter icons kept:** the other 6 keep their letter SVG, because their apps are no longer listed or their short links are dead: Taher, Fix Infinity, Al7feaz, DoctorCrypto, ChkChk and Messayel.
- **Dead store links:** this was a scope change the user approved. 13 dead store links are now `null`, so their buttons are hidden, and the evidence for each is in `dead-links.json`. 10 live store buttons remain, and 6 cards have no store buttons.
- **Done list:** all 9 Definition of Done items pass, and both earlier tasks still pass 10/10.
- **Checks:**
  - the check script passes in default mode (34/34) and in `--cv` mode (45/45);
  - the headless Chrome checks pass 94/94, plus 25/25 regression checks, with no remote requests.

## Files changed
- `portfolio/assets/`:
  - added: `project-{alriyadh-app,waste-transportation-request,home-experience,alwsata-employees}-icon.png` and `project-{alwsata-real-estate,bedayat}-icon.jpg`;
  - deleted: the 6 matching letter SVGs.
- `portfolio/content.js`: image paths, and 13 dead store URLs set to `null`.
- `portfolio/styles.css`: raster icons get a square app-icon look, a white tile and a border, so they read correctly in dark theme.
- `portfolio/README.md`: the asset list, what a `null` store URL means, and the check-script usage.
- `tests/portfolio/check-content.js`:
  - default mode allows a project with no store links and adds local-image, ≤100 KB and no-unused-asset checks;
  - `--cv` excuses a `null` only when it matches a `dead-links.json` entry (with an optional `--dead-links <path>` override).
- `docs/project-store-icons/`: `dead-links.json` and the `01`–`05` docs.

## Key decisions
| Decision | Reason |
|---|---|
| Icons are downloaded locally, not hotlinked | User decision; the site keeps working offline over `file://` |
| Google Play is tried first, then the App Store | User decision |
| A project with no fetchable icon keeps its letter SVG | User decision |
| The Home Experience icon comes from the App Store "Furniture Experience" listing | The user confirmed it is the same app; the CV's own link opens that listing |
| Dead store buttons are hidden | User decision (scope change after Step 1) |
| `cv-data.en.json` stays untouched; dead links are recorded separately | It keeps the CV snapshot honest, and `--cv` still detects unrecorded changes |
| A link counts as dead only on strong evidence | Play: all 5 URL variants 404. App Store: lookup finds nothing in 10 regions. Short links: they don't resolve |
| The Projects intro text is unchanged | User decision |

## Review verdict
APPROVED with no blocking issues. See `04-review.md`.

## Follow-ups
- **Owner:** fix or remove the 13 dead links in the CV PDF itself. If an app comes back to its store, update both its URL in `content.js` and its entry in `dead-links.json`.
- **N2 (optional):** icon alt text repeats the card title for screen readers. Changing it to `alt=""` needs a user decision.
- **N3 (developer):** README line 107 says "a few hundred KB", but project icons are limited to 100 KB or less.
- **N4 (docs):** the Step 1 table still shows Home Experience as pending. It was resolved in the scope change and Step 2.
- **N5 (information):** 4 of the CV's tinyurl links go through a viglink affiliate redirect.
