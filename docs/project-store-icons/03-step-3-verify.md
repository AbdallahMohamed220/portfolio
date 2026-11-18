# Step 3: Verify against the definition of done

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- **Check script.** Updated `tests/portfolio/check-content.js`, which fixes the 3 failures Step 2 expected:
  - **Default mode:** a project may have both store URLs `null`, as long as both keys exist. It still reads nothing under `docs/`.
  - **`--cv` mode:** it also loads `docs/project-store-icons/dead-links.json`. A `--dead-links <path>` or `--dead-links=<path>` override is available, and it is only valid together with `--cv`.
    - A `null` store URL where the CV has a link passes only when a dead-links entry matches its `projectId`, `store` and `cvUrl`.
    - A new check (C4b) fails on stale, mismatched or duplicate entries.
    - If the file is missing or malformed, the run FAILs and no `null` is excused.
  - **3 new default-mode checks:**
    - 13: images are local paths under `assets/`, with no remote `src`, `srcset` or icon in `index.html` and no remote `url()` in `styles.css`;
    - 14: each project image is ≤ 100 KB (102400 B);
    - 15: no unused file in `assets/`.
- **Mutation tests.** Ran 32 cases against scratch copies of `portfolio/` and `dead-links.json`. All of them behaved as expected.
- **README.** Updated the "Check your edits" section of `portfolio/README.md`: the Default mode bullets, the usage line for `--dead-links`, and one paragraph under CV mode.
- **Browser checks.** Wrote my own headless Chrome 157 CDP harnesses (none of the developer's scripts were reused):
  - `browser-verify.js` covers EN/AR × light/dark × 360/1280 over `file://`: **94/94 PASS**.
  - `regress-earlier.js` re-checks the earlier DoD behaviours: **25/25 PASS**.
- **File and network checks.** Ran an independent file check of every project image (my own PNG/JPEG/SVG parser). Spot-checked 3 dead links and 2 live links on the network, and 4 icon sources byte-for-byte.

## Files touched
- `tests/portfolio/check-content.js`: as described above. The header comment and `--help` text are updated to match.
- `portfolio/README.md`: the "Check your edits" section only, covering the usage block, the Default mode bullets (new **Store links**, **Images** and **No unused files** bullets) and a dead-links paragraph under CV mode.
- `docs/project-store-icons/03-step-3-verify.md`: this doc.
- No other production file was changed, and no plan statuses were edited.
- Scratch files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\icons-step3\`:
  - `mutate.js` + `mutate-out.txt` + `trace-fs.js`;
  - `browser-verify.js` + `browser-out.txt` + `browser-results.json` + `shots\` (16 PNGs);
  - `regress-earlier.js` + `regress-out.txt`;
  - `icon-files.js` + `icon-files-out.txt`;
  - `net-spot.mjs` + `net-spot-out.txt`;
  - `probe-lazy.js`;
  - `before-*.txt` / `final-*.txt` (check-script output);
  - `check-content.before.js` and `README.before.md` (backups).

## Decisions
| Decision | Reason |
|----------|--------|
| Default mode allows both URLs `null`, but a missing key or an empty string still fails | That is the scope change. The key rule keeps the schema explicit, as the README asks. |
| `--dead-links` without `--cv` is a command-line error (exit 2) | The record only means something next to the CV snapshot. Accepting it silently would suggest it changed default mode. |
| An unreadable dead-links file is a FAIL line, and the run continues with an empty list | "Fail loudly": the reason (ENOENT or a parse error) is printed, and every `null` is then listed as a mismatch, so the cause is clear. |
| Added C4b: every entry must match a CV link that the site shows as `null`, with no duplicates | Without it, a wrong-`cvUrl` entry would fail only through the null check. A stale entry for a link that came back would pass silently. |
| Size limit is 102400 B (100 KiB), and it applies to project images only | The requirements say "about 100 KB" for the icons. The avatar and the CV are not icons. The largest icon is 65942 B. |
| The unused-files check counts `index.html` and `content.js` references, including subfolders of `assets/` | `avatar.jpg` is used by `index.html` (favicon and `<img>`). Subfolders could otherwise hide leftovers. |
| Also updated the README's usage line and CV-mode text, not only the Default-mode bullets | They are in the same "Check your edits" section. Without them, the new `--dead-links` option and the dead-links rule would be undocumented. |
| Expected live links come from the CV minus `dead-links.json`, not from `content.js` | This is an independent oracle. It also proves that `content.js` nulls exactly the recorded links. |
| The browser run sets the stored theme opposite to the emulated system theme | It proves that the stored choice is applied, not just the system default. |

## Verification

### Check script
- **Before** (Step 2 state): default exited 1 and `--cv` exited 1, with exactly the 3 failures listed in `03-step-2-wire-icons.md`.
- **After:**
  ```
  node tests/portfolio/check-content.js       -> 34 passed, 0 failed  exit 0
  node tests/portfolio/check-content.js --cv  -> 45 passed, 0 failed  exit 0
    PASS  dead-links record loads (...): 13 entries
    PASS  all 37 store, company, certificate and profile URLs equal the CV (13 store links null as recorded dead)
    PASS  every dead-links entry matches a CV store link (projectId, store, cvUrl) that the site sets to null
  ```
- **Mutation tests** (`mutate.js`): **32/32 as expected.** Each case below fails with the named check; the baseline copies pass.

  | Mutation | Result |
  |----------|--------|
  | M1a: a dead-links entry is removed while the site keeps the `null` | `--cv` exit 1 (C3, C4). Default mode is still 0. |
  | M1b: a live link (alriyadh Play) is set to `null` and has no entry | `--cv` exit 1 (C3, C4) |
  | M2a: an entry has the wrong `cvUrl` | `--cv` exit 1 (C3, C4, C4b) |
  | M2b / M2c: an entry has the wrong `projectId`, or its store is swapped | exit 1 (C3, C4, C4b) |
  | M2d: `store: "playStore"` | exit 1 (C1b rejects the record, then C3, C4) |
  | M2e / M2f: a stale entry for a link still shown, or a duplicate entry | exit 1 (C4b) |
  | M2g: a non-null URL that differs from the CV | exit 1 (C4) |
  | M4a–c: the dead-links file is missing, is invalid JSON, or is not an array | exit 1 (C1b, C3, C4), with the ENOENT or parse message printed |
  | M4d / M4e: `--dead-links` without `--cv`, or with no path | exit 2 |
  | M3a: a project image is an `https://play-lh…` URL | exit 1 (13; also 8 and 15) |
  | M3b–f: a `//host` avatar, an image outside `assets/`, a remote `<img src>` or `<link rel=icon>`, or a remote CSS `url()` | exit 1 (13) |
  | M5: an icon of 113534 B | exit 1 (14). M5b: exactly 102400 B passes (boundary). |
  | M6a / M6b: an unused file in `assets/` or in a subfolder | exit 1 (15) |
  | M7a / M7b: a missing `appStoreUrl` key, or `""` | exit 1. M7c: all 24 URLs `null` passes default mode. |
  | fs trace (`-r trace-fs.js`) | Default mode opens 0 files under `docs/`. `--cv` opens only `cv-data.en.json` and `dead-links.json`. |

### Icon files (`icon-files.js`, my own parser)
- **Raster icons:** 6 files (4 PNG, 2 JPEG). Each has valid magic bytes, a matching extension and a square shape. 5 are 512×512 and alwsata-employees is 384×384. They range from 33609 to 65942 B.
- **Letter SVGs:** 6 files, each 128×128 and 397 B, with no remote references.

### Browser (`browser-verify.js`), 94/94 PASS
In each of the 8 configurations (en/ar × light/dark × 360/1280), the harness checked the following:
- Language, `dir` and theme are applied.
- There are 12 cards. 6 real icons and 6 SVGs render, each with `currentSrc` = `file:///D:/try_agent_workflow/portfolio/assets/<file from the Step 1 table>`. Each is decoded (`naturalWidth` 512/384/128), shown at 56×56 with `object-fit: cover`, and has alt text.
- 10 store buttons are visible, and each `href` equals the expected live link for its card, in Play-then-App-Store order. None is a recorded dead URL, and all have `target=_blank` and `rel=noopener`.
- The 6 no-link cards (taher, fix-infinity, al7feaz, doctorcrypto, chkchk, messayel) have no `.project-links` element.
- There is no horizontal scroll, with details closed or all open.
- **Keyboard:**
  - Tab reaches all 10 store buttons once, in card order.
  - The no-link cards add no store stops.
  - All stops show `:focus-visible` with a 3px solid outline, on screen and not under the sticky header: 47 stops at 1280px and 44 at 360px (the 60 stops of the earlier task minus the 13 hidden buttons).
  - Enter opens the details on a no-link card.

Across all runs:
- **Requests:** 165 in total, all `file:`, and **0 remote**. The 124 image requests are all under `portfolio/assets/`, with no failed loads.
- **Console:** **0** console messages, exceptions or log entries.
- **Motion:** with `no-preference`, Contact fades in (opacity 0 → 1). With `reduce`, all sections show `1/none`.

**Harness issues fixed before the clean run.** The first run had 9 false failures:
- "under header" counted the header's own controls;
- the cold first configuration read a lazy image before it started, so it showed `complete` = true with `naturalWidth` 0.

`probe-lazy.js` showed the same icon loading at 512px on a cold profile. The harness now polls until `naturalWidth > 0`, and that took 0 ms extra in every configuration.

**Screenshots** in `shots\`: I looked at `en-light-1280-grid`, `ar-dark-1280-grid`, `en-light-360` and `ar-dark-360`.
- The real icons sit on rounded white tiles with a thin border, which reads well on both theme surfaces. The SVGs fill their own coloured tile.
- In AR, the icons are on the right and the store buttons are mirrored.
- The no-link cards end after "More details" / "مزيد من التفاصيل".

### Network spot-check (2026-11-18T14:21Z)
| Link | Kind | Re-run result | Matches `dead-links.json` / Step 2 |
|------|------|---------------|-------------------------------------|
| taher Play `shorturl.at/eDUZI` | dead | curl: 301 → `www.shorturl.at/eDUZI`, then HTTP 200 with `<title>404 Page Not Found</title>`. The control `wDSsL` gives 302 → Play | yes |
| home-experience Play `tinyurl.com/bf4kc33p` | dead | curl: 302 → viglink `u=…id=com.home_experience.home_experience`. Play returns 404 plain, with `hl=en&gl=US` and with `gl=SA` | yes |
| chkchk App Store `t.ly/qQ4pP` | dead | curl: 301 → `apps.apple.com/us/app/chkchk-app/id1602066977`. The iTunes lookup gives `resultCount` 0 in all 10 countries | yes |
| alriyadh Play `shorturl.at/wDSsL` | live | curl: 302 → `com.alriyadh.alriyadh_web_view`. Play returns 200, "Alriyadh - Apps on Google Play" | yes |
| bedayat App Store `rb.gy/aj2cfi` | live | curl: 301 → `id6451140940`. The lookup gives 1 result: "Bedayat" / Learning Beginnings Co., bundle `app.bedayat` | yes |

**Icon source spot-check (Step 1 table rows 1, 4, 6, 12).** The listing's current `og:image` (or the lookup's `artworkUrl512`) equals the Step 1 source URL. Downloading it again at the same size gives a file whose SHA-256 is identical to the local file:
- alriyadh: 65942 B;
- home-experience ("Furniture Experience", `com.homeexperience.homeExperience`): 33609 B;
- alwsata-employees (`=s384`): 64354 B;
- bedayat: 53534 B.

Node `fetch` gets 403 from `t.ly` and `rb.gy`; curl with a browser user agent gets through.

### Definition of Done: this task (`project-store-icons`)
| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Projects with a reachable listing show their real icon from a local file | **PASS** | 6 icons (alriyadh, waste, home-experience, alwsata-employees, alwsata-real-estate, bedayat). `currentSrc` is under `file:///…/portfolio/assets/` and decoded, in all 8 configurations. 4 sources were re-verified byte-identical. |
| 2 | Projects with no reachable listing keep their letter SVG, and the step doc lists the reasons | **PASS** | 6 SVGs render. The reasons are in Step 1 rows 3, 5, 8–11 and in `dead-links.json`. |
| 3 | The per-project table records the resolved store URL and the icon source | **PASS** | Step 1 table, 12 rows. 4 rows were re-checked against the live listings (see above). |
| 4 | Icons are square, 256–512px, ≤ ~100 KB, and look right in light/dark, 360/1280, EN/AR | **PASS** | `icon-files.js`: square, 384–512px, 33.6–65.9 KB. 8 configurations rendered at 56×56, and screenshots were reviewed. Check 14 guards the size. |
| 5 | No image is loaded from a remote host at runtime | **PASS** | 0 remote requests out of 165, and all 124 image requests are local. Check 13 guards this, and was mutation-tested. |
| 6 | Both check modes pass, earlier DoD items hold, and the console is clean | **PASS** | 34/34 and 45/45, both exit 0. The earlier DoD tables are below. 0 console events. |
| 7 | Unused SVGs are removed and the README asset list matches | **PASS** | Check 15: all 14 files in `assets/` are used. Every file name in the README equals the `assets/` listing, with nothing missing on either side. |
| 8 | (scope change) Every visible store button goes to a live listing, and each dead link has evidence | **PASS** | 10 buttons, each equal to CV minus dead-links, in all 8 configurations. 13 entries with evidence. 5 links were re-run on the network, and all agree. |
| 9 | (scope change) `cv-data.en.json` is unchanged, the dead links are recorded separately, `--cv` passes, and default allows no-link projects | **PASS** | `cv-data.en.json` was last modified at 14:40, before this task started (first asset 15:39), and still holds all 23 CV store URLs. `--cv` passes using `dead-links.json` (C3, C4, C4b). M7c: default mode passes with every URL `null`. |

### Definition of Done: `portfolio-real-content` (re-checked)
| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Real photo, alt, name, role; no placeholders | **PASS** | Check-script placeholder scan and C6. All images have alt text in EN and AR. |
| 2 | About = CV profile in EN/AR | **PASS** | C6 (EN text equals the CV). The text tree walk is clean. |
| 3 | 12 projects with fields and exact store URLs | **PASS, as amended by the scope change** | 12 cards in CV order (C2, C6). The 10 shown store URLs equal the CV exactly. The 13 dead ones are hidden on purpose and recorded. |
| 4 | 4 jobs with company links | **PASS** | C4 (company URLs), C6. Every external `href` is from the CV. |
| 5 | Skills, education, certificates, languages | **PASS** | C2 counts 12/4/12/6/2, and C6. |
| 6 | Contact links | **PASS** | `mailto:Dev.Fluttery@gmail.com` and `tel:+201147234230` are present; GitHub, LinkedIn and Stack Overflow are equal to the CV. |
| 7 | CV PDF is byte-identical | **PASS** | SHA-256 is `6f6609a5…be147` (C8 and the regression run). The `download` attribute is present. |
| 8 | Original DoD holds in both languages | **PASS** | See the next table. |
| 9 | Check script passes and covers the fields | **PASS** | 45/45, plus the new checks 13–15, C1b and C4b. |
| 10 | README matches the `content.js` structure | **PASS** | The Step 2 README rows were cross-checked. The check section was updated here. |

### Definition of Done: `personal-portfolio` (re-checked in EN and AR)
| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Opens from `file://` with 4 sections and a clean console | **PASS** | 0 console events in both harnesses. |
| 2 | All visible text comes from `content.js` | **PASS** | 237 text nodes per language, all found in `content.<lang>` or `shared`. |
| 3 | Language toggle, RTL, persists | **PASS** | A click gives ar/rtl with 12 cards, and it persists after reload. Switching back persists too. |
| 4 | Theme toggle persists; first visit follows the system | **PASS** | A system dark or light setting gives the same theme on first visit. The click choice persists against the opposite system theme. |
| 5 | No horizontal scroll at 360/768/1280; mobile nav works | **PASS** | 360 and 1280 in 8 configurations, and 768 in 4, with details open. The 360 menu opens with 4 links, and Contact closes it. |
| 6 | Fade-in; off with reduced motion | **PASS** | Opacity goes 0 → 1 on scroll. With `reduce`, every section shows `1/none`. |
| 7 | Download CV | **PASS (static)** | The `href` is `assets/cv.pdf` with `download`, and the hash matches. The http download was not re-run: `index.html`, `script.js` and `cv.pdf` have not changed since the earlier verification. |
| 8 | Contact links | **PASS** | See row 6 above. |
| 9 | Keyboard access and alt text | **PASS** | The skip link and Enter move focus to `<main>`. Space toggles the theme. 47 or 44 focus-visible stops. All images have alt text. |
| 10 | README covers editing, CV, images and deploy | **PASS** | The sections are unchanged apart from Step 2 and this step's updates. |

**Overall: 9/9 items for this task, 10/10 for `portfolio-real-content` and 10/10 for `personal-portfolio` pass. No production bugs were found.**

## Open questions / follow-ups
- **Copy (not a DoD item):** the Projects intro still reads "Twelve Flutter apps I have worked on, newest first, with links to their store pages", but 6 cards now have no store links. The owner may want to reword it in `en` and `ar`, for example "…with store links where the app is still listed".
- The owner may want to fix the 13 dead links in the CV PDF itself; this is outside the task. If an app comes back, both the `content.js` URL and its dead-links entry must change. C4b fails if only one of them is changed.
- **Not automated:** a real screen reader, other browsers, and a real phone, the same as the earlier manual checklist.
