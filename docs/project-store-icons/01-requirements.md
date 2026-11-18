# Requirements: Use real store app icons for portfolio projects

**Task id:** project-store-icons  
**Status:** approved

## Goal
Replace the generated letter icons on the 12 project cards in `portfolio/` with each app's real icon from Google Play or the App Store, so the projects look authentic to visitors.

## In scope
- For each of the 12 projects, resolve its store URL (`shared.projects[].googlePlayUrl` / `appStoreUrl` in `portfolio/content.js`) and find the app's icon image.
- Download each icon into `portfolio/assets/` as a local file, for example `project-<id>.png` or `.webp`, at a reasonable size (about 256–512px square).
- Point `shared.projects[].image` at the downloaded file for every project that got an icon.
- **Source order:** try Google Play first, and fall back to the App Store.
- **Fallback:** if neither store gives an icon, the project keeps its current `project-<id>.svg`.
- Delete only the SVGs that are no longer referenced.
- Make sure the check script and the README still match the new assets.

## Out of scope
- Changing project text, store links or layout, beyond any CSS needed so raster icons look right (for example rounded corners and `object-fit`).
- Hotlinking images from store CDNs.
- Fetching screenshots or other store media.

## Constraints
- The site must keep working over `file://`, with no runtime network dependency.
- Every Definition of Done item from `docs/personal-portfolio/` and `docs/portfolio-real-content/` must still pass. That includes:
  - `node tests/portfolio/check-content.js` in default mode;
  - `--cv` mode, which may only change where the CV snapshot itself is unaffected; images are not part of the CV.
- Network access is limited:
  - `tinyurl.com` links resolve;
  - `shorturl.at` and `t.ly` return 403 to automated requests, so other methods are needed, such as a browser-like user agent, headless Chrome, or the URL forms of the redirect services;
  - some apps may have been removed from the stores.

  Don't guess an app: an icon is only used if it clearly comes from that project's own store listing.
- Image files must be reasonably small: each about 100 KB or less.

## Inputs / outputs
- **Input:** the store URLs in `portfolio/content.js` / `docs/portfolio-real-content/cv-data.en.json`.
- **Output:**
  - `portfolio/assets/project-<id>.<png|webp|jpg>`;
  - updated `portfolio/content.js` (image paths);
  - possibly `portfolio/styles.css` (icon styling);
  - `portfolio/README.md` and `tests/portfolio/check-content.js` if needed;
  - a step doc with a per-project table: the resolved store URL, the icon source URL, the result, or the reason for falling back.

## Assumptions
- Using the app icons in the owner's portfolio is acceptable, because the owner built these apps. This is common practice for developer portfolios.
- An app removed from both stores keeps its letter SVG. This isn't treated as a failure.

## Definition of done
- [ ] Every project whose store listing is reachable shows its real app icon, loaded from a local file in `portfolio/assets/`.
- [ ] Every project without a reachable listing still shows its letter SVG, and the step doc lists those projects with the reason.
- [ ] The per-project table records the resolved store URL and the source of each icon, so a reviewer can verify it.
- [ ] Icon files are square, about 256–512px, about 100 KB or less each, and look right in light and dark themes and at 360px and 1280px, in English and Arabic.
- [ ] No image is loaded from a remote host at runtime.
- [ ] `node tests/portfolio/check-content.js` and `--cv` both pass, and every earlier Definition of Done item still holds, with no console errors.
- [ ] Unused SVGs are removed, and the README's asset list matches.

## Q&A log
| Question | Answer |
|----------|--------|
| Download the icons into the project, or link to the store's images? | Download them into `assets/` |
| What if an icon can't be fetched? | Keep the current SVG |
| Which store comes first? | Google Play, then the App Store |

## Scope change (approved by user 2026-11-18, after Step 1)
- **Home Experience:** use the App Store icon from the "Furniture Experience" listing (bundle `com.homeexperience.homeExperience`). The user confirmed it is the same app.
- **Dead store buttons are hidden.** Every store URL is checked. A link that is dead is set to `null` in `content.js`, so its button disappears. A link counts as dead when it is a broken short link, a Play listing that returns 404, or an App Store id that is not found. This includes the App Store links not checked in Step 1. A card with no live store link shows no store buttons.
- Extra Definition of Done items:
  - [ ] Every visible store button goes to a live listing. Each dead link is recorded with evidence (the HTTP status or the lookup result).
  - [ ] `cv-data.en.json` stays an unchanged snapshot of the CV. The dead links are recorded separately, and `--cv` still passes, because it allows a `null` only for a link recorded as dead. The default-mode check allows a project with no store links.
