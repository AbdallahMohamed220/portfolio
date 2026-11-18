# Step 1: Extract the CV into a structured EN source, with the link mapping

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Read the source PDF in place (SHA-256 `6f6609a5…be147`, 175 811 bytes, 3 pages, 612×792 pt; hash unchanged afterwards). It is a FlowCV/Skia PDF with one ExifTool incremental update, which redefines only objects 1 (Info) and 806 (Catalog).
- Wrote read-only helper scripts in the scratchpad (`…/scratchpad/scripts/`):
  - `annots.js` lists every link annotation with its page, `/Rect` and `/URI`.
  - `text.js` decodes each page's content stream (`cm`/`Tm`/`Td`/`Tj` plus the fonts' ToUnicode CMaps) into glyph positions, then reads the text under each `/Rect` and the label on the same baseline.
  - `verify.js` checks the JSON against the PDF.
- Found 103 link annotations and 39 unique URIs. Each store or company URI has 3 to 10 annotations: the text run, a trailing space and the link-icon glyph. All of them sit on the same baseline.
- Wrote `cv-data.en.json` with the profile, contact, 12 projects (newest first, in the order given in the requirements), 4 jobs, 12 skills, education, 6 certificates and 2 languages. It also has `notShownUris`.

### Link mapping (each store link's widest annotation)
Method: the text under the `/Rect` is the URL itself, and it is identical to the `/URI`. The label on the same baseline (Google/Play Store or Apple/App Store) gives the store. The nearest project heading above the link, in reading order, gives the project. **Every mapping below has high confidence:** the URL, the label and the heading all agree.

| Project | Page | Google Play `/Rect` → URI | App Store `/Rect` → URI |
|---|---|---|---|
| Alriyadh App | 1 | [339 454.5 453 465.8] `shorturl.at/wDSsL` | [333.8 442.5 435.8 453.8] `shorturl.at/xli1x` |
| Waste Transportation Request | 1 | [339 312 449.3 323.3] `shorturl.at/9RvLv` | [333.8 300 442.5 311.3] `shorturl.at/S4dpi` |
| Taher | 1 | [339 133.5 449.3 144.8] `shorturl.at/eDUZI` | [333.8 121.5 446.3 132.8] `shorturl.at/5G3Ke` |
| Alwsata Real Estate Employees | 2 | [339 727.5 468.8 738.8] `tinyurl.com/bdd9vks7` | [333.8 715.5 447 726.8] `shorturl.at/5vwVn` |
| Home Experience | 2 | [339 609 468.8 620.3] `tinyurl.com/bf4kc33p` | [333.8 597 413.3 608.3] `t.ly/BkTG9` |
| Fix Infinity | 2 | [339 478.5 471.8 489.8] `tinyurl.com/26vka4wa` | [333.8 466.5 443.3 477.8] `shorturl.at/iosGU` |
| Alwsata Real Estate Co | 2 | [339 336 471 347.3] `tinyurl.com/5n9a232e` | [331.5 324 461.3 335.3] `tinyurl.com/atn6h2er` |
| Al7feaz | 2 | [339 193.5 416.3 204.8] `t.ly/hjnCd` | [333.8 181.5 411 192.8] `t.ly/3_iqZ` |
| DoctorCrypto | 2 | [339 15.8 467.3 27] `tinyurl.com/fbpfh6u7` | **none in the CV**: `null`, hidden |
| ChkChk | 3 | [339 577.5 414 588.8] `t.ly/rzozJ` | [333.8 565.5 414 576.8] `t.ly/qQ4pP` |
| Messayel | 3 | [327 375 413.3 386.3] `rb.gy/l3ge9i` ("Play Store") | [326.3 363 414 374.3] `rb.gy/b3lk1u` ("App Store") |
| Bedayat | 3 | [339 148.5 468 159.8] `tinyurl.com/5efpshce` | [333.8 136.5 417 147.8] `rb.gy/aj2cfi` |

All store URLs above use `https://`.

**Certificates.** All are on page 1, in the left column. The text under each `/Rect` is the certificate title. Confidence is high for all 6.

| Certificate | `/Rect` | URI |
|---|---|---|
| Clean Code | [36.8 230.3 99 242.3] | `UC-b12d90ac-…5d` |
| Clean Architecture in Flutter 3 (Arabic) | [36.8 209.3 219 221.3] | `UC-106fade0-…1d` |
| Flutter BLoC - From Zero to Hero Complete Course | [36.8 177 222 201] (2 lines) | `UC-290a6f9b-…01` |
| The Complete 2022 Flutter & Dart Development Course [Arabic] | [36.8 144.8 222 168.8] (2 lines) | `UC-d36684a5-…8e` |
| Dart - from Novice to Expert Complete Course | [36.8 111.8 222 135.8] (2 lines) | `UC-67e2f920-…ed` |
| Flutter & Dart - The Complete Guide [2023 Edition] | [36.8 79.5 222 103.5] (2 lines) | `UC-e8b27876-…83` |

**Contact and companies.** All are on page 1. Confidence is high for all of them, because the text under each rect names the link.
- Contact: "Dev.Fluttery@gmail.com" [63.8 653.3 186.8 673.5] → `mailto:`; "01147234230" [30 633 104.3 653.3] → `tel:01147234230`; "Github" [114 633 158.3 653.3]; "LinkedIn" [168 633 220.5 653.3]; "Stack Overflow" [108 612 189.8 633] → `shorturl.at/QYQxr`.
- Companies: "E.VISION for information Technology" [352.5 721.5 522.8 732.8] → `http://www.evision-corp.com/`; "Alwsata" [352.5 681 399 692.3]; "Csskw" [352.5 627.8 391.5 639]; "Rizme" [352.5 575.3 390 586.5]. All of them match the requirements' link table.
- Not shown: "Portfolio" [99 591.8 151.5 612] → `https://dev-fluttery.getportify.com/`. It is listed in `notShownUris`.

### Spelling and wording fixes (original → fixed)
- Freamwork → Framework (`tech` is stored as "Flutter")
- Employes / EMPLOYES → Employees
- Fix infinty → Fix Infinity
- ALWSATA REAL ESTATE CO → Alwsata Real Estate Co; AlWasta Real Estate (job line) → Alwsata Real Estate Co / Employees
- E.VISION for information Technology → E.VISION for Information Technology
- Faculty Of Computer And Information → Faculty of Computers and Information (the requirements' wording)
- recevice → receives; runnig → running; than can view → then views
- killer mode → terminated (killed) state; "two user one admin and advisor" → "two user types: an admin/advisor … and a driver"
- Handel Notifications → Handled notifications; Handel Scaning QRCode → Handled QR code scanning; Handel Free and Premium Accounts → Handled free and premium accounts
- Deployment the app → Deployed the app; Building UI → Built the UI; Building Some UI → Built part of the UI; Restful → RESTful
- DeepLink Feature using GoRouter → Deep linking with GoRouter; draw polyline → polyline drawing; play back → playback
- Taher: "I build it with E.vision, Taher build for manage complains for waste in sauid arabia as administator can login add add complain" → "built with E.VISION, manages waste complaints in Saudi Arabia: an administrator can log in, add a complaint…"; adminstator → administrator
- Gitx → GetX; Bloc → BLoC; Skillful → Skilled; utilizing → using
- "As an app focused on…" → "An app focused on…"; "And deal with your own advisor" → "and deal with their own advisor"
- Bedayat: "daily activities like meals and activities" → "daily activities like meals" (the repeated word is dropped)
- Challenges: "Dealing with Pusher…" → "Using Pusher to handle real-time chat"; "Dealing with Google Map and handle Real Time Location" → "Working with Google Maps and handling real-time location"; "Dealing with Payment Gateway (Tap) to handle pay ." → "Integrating the Tap payment gateway to handle payments"
- Certificate title "Clean Architecture In Flutter 3" → "in", and "THE COMPLETE 2022 FLUTTER & DART DEVELOPMENT COURSE [ARABIC]" → title case. Only the case changes.

## Files touched
- `docs/portfolio-real-content/cv-data.en.json`: new. This is the structured EN source for Step 2.
- `docs/portfolio-real-content/03-step-1-extract-cv.md`: new. This step doc.
- The scripts in the scratchpad are not project files. The source PDF was not modified, and no site files were changed.

## Decisions
| Decision | Reason |
|----------|--------|
| A missing store link is stored as `null`, and that store is listed in `hiddenStores` (DoctorCrypto: `["appStore"]`). Every project has a `hiddenStores` array. | User decision: hide the button and don't guess. The CV has 12 Google/Play labels and only 11 Apple/App labels. Keeping one shape for every project makes Step 2 simpler. |
| Projects are in the order of the requirements list, not the order in the CV. | The requirements say "newest first" and give that order, which is by start date. The CV lists Alwsata Employees (05/2022) before Home Experience (06/2023). The two Alwsata apps both start in 05/2022; Employees comes first, as in the requirements. |
| Skill names use the short names from the requirements, for example "Flutter" rather than "Flutter Framework" and "CI/CD" rather than the full CI/CD name. | The approved requirements list those names. The descriptions are the CV text with spelling fixed. |
| Contact keeps the PDF's `tel:01147234230` (`phoneUriInPdf`) and also stores `phoneInternational` `+201147234230` and `phoneDisplay` `+20 114 723 4230`. | The requirements and plan ask for the international form. It is derived from the PDF number with the +20 country code, which is what the requirements specify. |
| `challenge` is only present for Fix Infinity, ChkChk and Messayel. | These are the only projects with "Key Challenge" in the CV. |
| Apart from the E.VISION user decision below, `experience[].apps` contains only what the CV states. Csskw keeps Messayel and ChkChk, even though their dates (10–12/2021) are before the Csskw start date (01/2022). Home Experience, Fix Infinity and DoctorCrypto stay unattributed. | I don't guess attribution. The CV says "Build With IT: Al7feaz, Messayel, ChkChk". |
| **User decision (2026-11-18):** E.VISION `apps` is `["Alriyadh App", "Waste Transportation Request", "Taher"]`. | The CV names only Taher, in Taher's description. The user confirmed that the two 2025 projects were also built at E.VISION. |
| **User decision (2026-11-18):** Alriyadh App `role` is "Mobile Developer". | The CV heading has no role. The user chose to show the same role as the other projects. |
| **User decision (2026-11-18):** Bedayat keeps `contributions: []`, with a `contributionsNote` explaining that the list is empty on purpose. The card hides the contributions block when the list is empty. | The CV has no "Key Contributions" line for Bedayat; its text ends after the description, on page 3 at y≈26. The user chose not to add any. |
| Certificate titles are normalised to title case. The URLs are verbatim. | They are display strings. Title case gives them a consistent look, and the meaning is unchanged. |

## Verification
- `node annots.js <pdf>`: 3 pages with 52, 33 and 18 annotations, so 103 in total. They contain 39 unique URIs. The 206 hits from `grep -a -c /URI` are 103 × 2 (`/S /URI` plus `/URI (…)`).
- `node text.js <pdf> annots.json`: for every annotation, the text under the `/Rect` equals its URI or link label.
- `node verify.js cv-data.en.json mapped.json lines.txt`: **ALL PASS**, with exit code 0. It checked:
  - counts: 12 projects, 4 jobs, 12 skills, 6 certificates and 2 languages;
  - every URL in the JSON is a PDF `/URI`;
  - every PDF `/URI` is either used or listed in `notShownUris`;
  - the requirements' link table matches, for 3 contact links and 4 companies;
  - each of the 23 store URLs sits under the right project heading with the right store label;
  - the text under each certificate URI matches its title.
- The JSON parses (`JSON.parse` in `verify.js`).
- After applying the user decisions, `verify.js` was run again: 120 checks, **ALL PASS**.
- The source PDF's SHA-256 is unchanged after the step (`6f6609a598cb3990c90919fb99c92579b645a9416a683d1938d01867753be147`).
- Only objects 1 and 806 are defined twice in the file. No annotation object is overridden by the incremental update.

## Open questions / follow-ups
1. **Resolved (user, 2026-11-18):** Bedayat keeps `contributions: []`, and the card hides the block. Steps 2 and 4 must allow an empty `contributions` list. Plan Step 4's per-project check needs to accept `[]` for Bedayat.
2. **Resolved (user, 2026-11-18):** Alriyadh App's role is "Mobile Developer".
3. **Resolved (user, 2026-11-18):** E.VISION's apps are Alriyadh App, Waste Transportation Request and Taher. Everything else stays as the CV has it.
4. DoctorCrypto has no App Store link in the CV, so that button is hidden, as the user decided. This is reported for information only.
5. The plan names this doc `03-step-1-cv-data.md`. The orchestrator asked for `03-step-1-extract-cv.md`, so that name was used. Step 2's references should point to this file.
