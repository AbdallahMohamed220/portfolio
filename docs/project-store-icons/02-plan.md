# Plan: Use real store app icons for portfolio projects

**Requirements:** ./01-requirements.md

Context: the site and its verification are described in `docs/personal-portfolio/` and `docs/portfolio-real-content/`. See `05-summary.md` there, the schema in `03-step-2-site-update.md`, the check script in `03-step-4-check-script.md`, and the CDP browser checks in `03-step-5-verify.md`. Nothing about the codebase is unknown, so this plan has no research step. The only unknowns are on the network: where each short link goes and whether the listing still exists. That work needs Bash and headless Chrome. The researcher has no Bash, so Step 1 goes to the developer.

Where the changes go:
- `portfolio/content.js` lines 44–115: `shared.projects[].image`, now `assets/project-<id>.svg`.
- `portfolio/styles.css` `.project-image` (about line 543): 3.5rem square with `border-radius`. It has no `object-fit` yet.
- `portfolio/script.js` lines 216–222: renders `<img width="128" height="128" loading="lazy">`. No change is expected.
- `portfolio/README.md` lines 11–19 (asset tree), 56, 86 and 102 all say the icons are `project-<id>.svg`.
- `tests/portfolio/check-content.js` section 8 (lines 355–374) checks that the files exist and that each project has its own image. It does not care about the extension, so it should pass with no change. The `/project-\d+\.svg/` placeholder pattern does not match the new names. `--cv` only checks the avatar, so image changes should not affect it.

Short-link hosts in `content.js`: `tinyurl.com`, `shorturl.at`, `t.ly` and `rb.gy` (used by messayel and bedayat; the network probe did not test `rb.gy`). Doctorcrypto has no App Store URL.

Execution order: Step 1, then Step 2, then Step 3. Each step uses the output of the one before, so none of them run in parallel. The orchestrator runs the final review separately, so it is not a step here.

## Steps

### Step 1 — Resolve the store URLs and download the icons
- **Agent:** developer. This step produces findings, which normally means the researcher. But it needs Bash (curl) and headless Chrome, and the researcher has neither. The developer changes no site files except new files in `portfolio/assets/`.
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** no (Step 2 uses its output)
- **Output:**
  - For each of the 12 projects:
    - Resolve `googlePlayUrl` first, then `appStoreUrl`, to the final store URL. Use curl with a browser user agent. If that gets a 403 (`shorturl.at`, `t.ly`, maybe `rb.gy`), load the link in headless Chrome over CDP and read the final URL. The redirect service's own preview or info pages are also allowed.
    - Then fetch the listing:
      - Google Play: the icon is the `og:image` or `play-lh.googleusercontent.com` URL. Add a size suffix such as `=s256` or `=s512`.
      - App Store: use the `og:image` or the iTunes lookup API `artworkUrl512`.
  - Download each icon to `portfolio/assets/project-<id>.<png|webp|jpg>`. The file must be square, about 256–512px and about 100 KB or less. Pick the size or format that keeps it under the limit.
  - Save raw downloads first in a new, empty scratchpad folder. Check the magic bytes and dimensions before copying a file into `assets/`. Keep helper scripts in a separate scratchpad folder.
  - Only use an icon if the listing clearly belongs to that project: its app name and developer match the project. Never guess. If both stores fail (404, removed, unresolvable or ambiguous), the project keeps its SVG.
  - Step doc `03-step-1-resolve-icons.md`. It has a per-project table with these columns: id, short URL used, resolved store URL, HTTP result, icon source URL, local file, dimensions, bytes, and result (icon or SVG fallback, with the reason). It also records the method used for each blocked host.
- **Done when:**
  - The table has 12 rows, and each row has either a local raster file or a fallback reason.
  - Every downloaded file is a valid image, square, 256–512px and about 100 KB or less. Its source URL is on the listing named in the same row.
  - No site files are edited.
- **Status:** done

### Step 2 — Wire the icons into the site, CSS and README
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 1
- **Parallel:** no
- **Output:**
  - **`portfolio/content.js`:** `image` points to the new file for every project that got an icon in Step 1. Fallback projects keep `project-<id>.svg`.
  - **`portfolio/styles.css`:** `.project-image` gets `object-fit: cover` and keeps the rounded corners. Add a subtle background or border only if light icons disappear in light theme or dark icons in dark theme. Use logical properties only.
  - Delete only the SVGs that nothing references any more.
  - **`portfolio/README.md`:** update the asset tree (lines 11–19) and the image notes (lines 56, 86, 102) to match what is now in `assets/`. This covers real store icons (PNG/WebP/JPG) and any SVG fallbacks, plus how to replace an icon.
  - **`tests/portfolio/check-content.js`:** change it only if a check now fails because of the new file types. None is expected. New checks belong to Step 3.
  - Step doc `03-step-2-wire-icons.md`.
- **Done when:**
  - `node tests/portfolio/check-content.js` and `node tests/portfolio/check-content.js --cv` both exit with 0.
  - Every file under `portfolio/assets/` is referenced, and every reference exists.
  - No `http(s)` image URL appears in `content.js`, `index.html` or `styles.css`.
  - Every file name in the README exists in `assets/`.
- **Status:** done

### Step 3 — Verify against the definition of done
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** steps 1, 2
- **Parallel:** no
- **Output:**
  - `03-step-3-verify.md`, with a pass/fail table and evidence for each of the 7 DoD items in `01-requirements.md`. It also re-runs the earlier tasks' DoD items with the CDP approach from `docs/portfolio-real-content/03-step-5-verify.md`: headless Chrome, `file://`, and scripts kept in the scratchpad.
  - The checks cover the following:
    - Each card's rendered `img.currentSrc` is a local `file://` path, and it matches the Step 1 table.
    - No network request goes to a remote host (Network domain).
    - `naturalWidth` is greater than 0 for every icon.
    - Screenshots in light and dark theme, at 360px and 1280px, in EN and AR.
    - No horizontal scroll and a clean console.
    - The size, dimensions and squareness of every file.
    - A spot check of at least 3 table rows: open the resolved store URL again and confirm the icon source.
  - The tester may add checks to `tests/portfolio/check-content.js` (test file only):
    - every project image is a local path under `assets/`;
    - raster icons are about 100 KB or less;
    - no file in `assets/` is unreferenced.
  - Each new check must be seen to fail on a mutated scratch copy.
- **Done when:**
  - Every DoD item has a result with evidence.
  - The check script output for default mode and `--cv` is captured, and both exit with 0.
  - Failures are reported with steps to reproduce, and production code is not changed.
- **Status:** done

## Risks / open questions
- **Blocked short links (main risk):** `shorturl.at` and `t.ly` return 403 to curl, and `rb.gy` has not been tested. Headless Chrome will probably get through. If one still cannot be resolved, that store is treated as unavailable for that project, and the other store or the SVG is used. The URL is never guessed from the app name.
- **Removed listings:** at least one Play listing returns 404. The App Store fallback may cover it. If not, the project keeps its SVG, which the requirements accept.
- **Mixed icon sources:** some cards may show Play icons, some App Store icons (often with square corners and no transparency) and some SVGs. The rounded CSS mask hides most of the difference. This is accepted unless the user wants one consistent source.
- **File size:** a 512px PNG can be over 100 KB. Step 1 falls back to 256px or WebP.
- **Ambiguous identity:** if a listing's developer is a client company and not the owner, the app name and the CV project must still match. The developer's name alone is not enough to reject it. Anything uncertain is listed as an open question, and the SVG stays until the user decides.
- **Open question for the user:** if the 12 icons end up mixed between Play and App Store, is that fine, or should one store be preferred for consistency even when Play has the icon? The plan follows the requirements: Play first.

## User decisions after Step 1
- Use the Home Experience App Store icon (staged in the scratchpad, `icons-raw/home-experience-appstore-512.bin`).
- Hide dead store buttons. This is added to Step 2 (developer: verify all links, set dead ones to `null`, record the evidence) and to Step 3 (tester: the `--cv` and default checks accept the recorded dead links).
- The icon files are named `project-<id>-icon.<ext>`.
