# Review: Use real store app icons for portfolio projects
**Verdict:** APPROVED

Reviewed by: reviewer, 2026-11-18. There is no git repository, so I found the changed files by modification time. Every changed file is under `portfolio/`, `tests/portfolio/check-content.js` or `docs/project-store-icons/`. I read `01-requirements.md` (including the approved scope change), `02-plan.md`, the three step docs, `dead-links.json`, both earlier tasks' `01-requirements.md`, and `docs/portfolio-real-content/04-review.md`. In the code, I read the `shared.projects` block, the header comment, the `imageAlt` values and the Projects intro in `portfolio/content.js`; the `.project-image` rules in `portfolio/styles.css`; `renderProjects` in `portfolio/script.js`; the asset tree, the image and store-link rules and the "Check your edits" section in `portfolio/README.md`; and checks 13–15 plus C1b, C3, C4 and C4b in `tests/portfolio/check-content.js`.

## What I ran myself (from `d:\try_agent_workflow`, Node v22.21.0)
- `node tests/portfolio/check-content.js`: **34 passed, 0 failed, exit 0**.
- `node tests/portfolio/check-content.js --cv`: **45 passed, 0 failed, exit 0**. The output shows 13 dead-links entries, 13 store links null as recorded dead, and C4b passing.
- **Default mode reads nothing in `docs/`.** I wrote my own preload hook (`scratchpad/rev-icons/hook.js`). It exits with code 3 when `readFileSync`, `existsSync`, `statSync`, `readdirSync`, `openSync`, `accessSync`, `lstatSync`, `readFile`, `open` or `stat` touches a path containing `/docs/`. Under the hook, default mode exits 0. `--cv` exits 3 on `cv-data.en.json`, which shows the hook works.
- **`cv-data.en.json` is unchanged.** Its mtime is 2026-11-18 14:40:51, which is before this task's first asset (15:39) and before the earlier task's review. It still holds all 23 CV store URLs, including the 13 that are now `null` on the site. Every `hiddenStores` is `[]` except doctorcrypto's `["appStore"]`, as before. No dead-link data was written into it.
- **Icon files.** I checked the magic bytes and read the PNG IHDR / JPEG SOF myself:

  | File | Format | Size (px) | Bytes |
  |------|--------|-----------|-------|
  | `project-alriyadh-app-icon.png` | PNG (RGBA) | 512×512 | 65942 |
  | `project-waste-transportation-request-icon.png` | PNG (RGBA) | 512×512 | 53243 |
  | `project-home-experience-icon.png` | PNG | 512×512 | 33609 |
  | `project-alwsata-employees-icon.png` | PNG | 384×384 | 64354 |
  | `project-alwsata-real-estate-icon.jpg` | JPEG | 512×512 | 59283 |
  | `project-bedayat-icon.jpg` | JPEG | 512×512 | 53534 |

  Every extension matches the file's magic bytes. All six are square, between 384 and 512px, and at most 66 KB. The 6 letter SVGs are 397 B each.
- **Is each icon plausibly the right app?** I opened each one:
  - Alriyadh shows the Riyadh municipality emblem ("الرياض").
  - Waste Transportation Request shows a green garbage truck with a recycling mark.
  - Alwsata Employees and Alwsata Real Estate show the same Alwsata flower logo, white on blue for Employees and blue on white for Real Estate. This fits two apps from one company.
  - Bedayat shows the "بدايات Bedayaat" wordmark.
  - Home Experience shows an Arabic calligraphic mark. It comes from the "Furniture Experience" listing that the CV's own App Store link opens (`t.ly/BkTG9` → id6469695066, which I re-ran). The user approved this listing in the scope change.

  All six are consistent with the Step 1 table.
- **Visible store links.** I re-ran all 10 visible store links with curl and a browser user agent. Each one redirects to the listing recorded in Step 1 / Step 2:
  - shorturl.at: `wDSsL`, `xli1x`, `9RvLv` and `S4dpi` go to their Play / App Store ids through `www.shorturl.at`.
  - `t.ly/BkTG9` goes to id6469695066.
  - tinyurl.com: `bdd9vks7`, `5n9a232e`, `atn6h2er` and `5efpshce` go through viglink `u=` to the expected Play / App Store ids.
  - `rb.gy/aj2cfi` goes to id6451140940.

  I did not re-check the dead links. The tester spot-checked 3 of them, and each one has evidence in `dead-links.json`.
- **Screenshots.** I looked at the tester's `ar-dark-1280-grid.png` and `en-light-360-grid.png`:
  - The raster icons sit on white rounded tiles with a thin border, and the SVGs fill their own coloured tile.
  - In AR, the icon is on the right and the store buttons are mirrored.
  - The no-link cards end after "More details" / "مزيد من التفاصيل".
  - The cards have no overflow.

I did not repeat the CDP browser runs. For console, network and keyboard I relied on Step 3's harness (94/94 and 25/25), after reading the code paths it exercises.

## Definition of done
| Item | Result | Evidence |
|------|--------|----------|
| 1. Every project with a reachable listing shows its real icon from a local file | PASS | 6 projects have a reachable listing (alriyadh, waste, home-experience through the App Store, alwsata-employees, alwsata-real-estate, bedayat). All 6 `image` values are `assets/project-<id>-icon.*`, and the files exist (check 8). Step 3 confirmed `currentSrc` is `file:///…/assets/…` in 8 configurations, and 4 sources were re-downloaded byte-identical. |
| 2. Projects without a reachable listing keep their letter SVG, and the reasons are listed | PASS | taher, fix-infinity, al7feaz, doctorcrypto, chkchk and messayel keep `project-<id>.svg`. The reasons are in Step 1 rows 3, 5 and 8–11, and in `dead-links.json`. |
| 3. Per-project table with the resolved store URL and the icon source | PASS | The Step 1 table has 12 rows with the short URL, resolved URL, HTTP result, name and developer, icon URL, file, size and bytes. Step 2 records the home-experience copy and its source. |
| 4. Square, about 256–512px, about 100 KB or less, and right in light/dark, 360/1280 and EN/AR | PASS | My table above. Check 14 guards the size. The CSS uses `aspect-ratio: 1`, `object-fit: cover`, and a white tile and border for raster icons only. `--border` is defined for both themes (lines 23, 50 and 68). Screenshots reviewed. |
| 5. No image is loaded from a remote host at runtime | PASS | Check 13 passes: `content.js` image paths are under `assets/`, `index.html` has no remote `src`, `srcset` or icon, and `styles.css` has no remote `url()`. Step 3 recorded 0 remote requests out of 165. |
| 6. Both check modes pass, earlier DoD items hold, and the console is clean | PASS | 34/0 and 45/0 (I ran them). `script.js` and `index.html` were not changed (mtime 14:46). Step 3 re-checked the earlier DoD tables and saw 0 console events. |
| 7. Unused SVGs removed, and the README asset list matches | PASS | `assets/` holds exactly 14 files, and check 15 passes. The README tree (lines 11–21) lists exactly the 6 `-icon` files and the 6 SVGs. |
| 8. (scope change) Every visible store button goes to a live listing, and each dead link has evidence | PASS | 10 visible links, all re-run by me (see above). There are 13 `null` links, each with an entry in `dead-links.json` that has evidence and `checkedAt`. |
| 9. (scope change) `cv-data.en.json` unchanged; dead links recorded separately; `--cv` allows `null` only for a recorded dead link; default allows no-link projects | PASS | The mtime and content are as described above. In C3 and C4, `isRecordedDead(projectId, store, cvUrl)` matches all three fields. C4b rejects stale and duplicate entries. A missing or broken file fails C1b and excuses nothing. Default check 7 accepts both store URLs `null` but still needs both keys. Step 3 mutation-tested all of this (32 cases). |

### Earlier Definitions of Done
- **`portfolio-real-content`:** PASS. It holds as amended by the approved scope change: item 3, "exact store URLs", now means the CV URL or a recorded-dead `null`. `--cv` still enforces the counts, the EN text, the other 24 URLs and the PDF SHA-256. The B1 design from that task's review is preserved: default mode stays generic and reads no docs, and all snapshot data stays in `docs/`.
- **`personal-portfolio`:** PASS. RTL, theming, the toggles and keyboard access do not depend on the changed code, apart from `.project-image`, which only uses `inline-size`, `block-size` and other direction-neutral properties. Step 3's regression run passed 25/25.

## Blocking issues
| # | Issue | File | Fix by agent |
|---|-------|------|--------------|
| — | None | — | — |

## Non-blocking suggestions
- **N1: the Projects intro promises store links on every card (the follow-up the tester raised). Non-blocking, but I recommend fixing it before closing the task. Fix by: developer.**
  - **Why it is not blocking:** no DoD item covers this sentence, no check reads `projects.intro` in either mode, and no functionality is broken.
  - **Why it should still be fixed:** this task's scope change introduced the inaccuracy. Visitors now see a sentence that is wrong for 6 of the 12 cards. The fix is a one-line change in each language with no risk to the checks: C6 compares only the hero, about and item text with the CV, not `projects.intro`.
  - **Exact change** in `portfolio/content.js`:
    - `en.projects.intro` (line 183): `"Twelve Flutter apps I have worked on, newest first, with store links where the app is still listed."`
    - `ar.projects.intro` (line 500): `"اثنا عشر تطبيقًا عملت عليها باستخدام Flutter، مرتبة من الأحدث إلى الأقدم، مع روابط المتاجر للتطبيقات التي لا تزال متاحة."`
  - The requirements list "changing project text" as out of scope, and the earlier task made the Arabic copy a user decision. So the orchestrator should get the user's OK on the wording first. Then the developer applies it and re-runs both check modes. The tester does not need to re-run the browser checks, because the change is text only and the i18n check covers it.
- **N2: icon alt text repeats the card title.** Each icon's alt ("Alriyadh App icon" / "أيقونة Alriyadh App") is read right before the `<h3>` with the same name, so screen readers announce the name twice. This existed before this task, the README's alt-text rule asks for it, and check 12 / the earlier DoD require alt on every image. The alt texts are accurate for the new icons, including Home Experience. No change is needed now. If the owner wants less noise later, `alt=""` on the project icons together with a README rule change would be the option, and that needs a user decision.
- **N3: the README gives two image-size limits.** Line 107 says "a few hundred KB at most", but line 104 and check 14 say project icons must be 100 KB or less. Change line 107 to say the 100 KB limit applies to project icons and the general limit to other images. Fix by: developer (docs only).
- **N4: Step 1's home-experience row still reads "SVG fallback (pending user decision)".** That was correct when it was written, and Step 2 records the later copy. To help a later reader, add a one-line note under the Step 1 table that points to the scope change and Step 2. Fix by: developer or orchestrator (docs only).
- **N5 (FYI, out of scope):** 4 of the CV's tinyurl links redirect through `redirect.viglink.com` with an affiliate key. These are the CV's own links, unchanged by this task. The owner may want direct store URLs in a future CV update. The 13 dead links in the CV PDF are also outside this task, as Step 2 and Step 3 already note.

## Checklist summary
- **Scope:** OK. The task added the 6 icons, deleted 6 SVGs and changed the `image` paths, the 13 `null` store URLs, the header comment in `content.js`, two CSS rules, the README and the check script. `script.js`, `index.html` and `cv-data.en.json` are untouched. Project text is unchanged, which is why the intro (N1) is still out of date.
- **Correctness:**
  - `renderProjects` already omits `.project-links` when `links` is empty.
  - The raster selector `:not([src$=".svg"])` is correct for these paths.
  - In `--cv` mode, a `null` store URL is excused only when an entry matches all three of `projectId`, `store` and `cvUrl`.
  - C4b catches stale and duplicate entries.
  - A missing or broken dead-links file fails the run.
- **Tests:** they exist and pass (I ran both modes), and Step 3 mutation-tested them with 32 cases. My hook confirms that default mode does not read `docs/`.
- **Consistency:** the new CSS uses logical sizing and the existing `--border` token. The check script keeps the default/`--cv` split from the earlier review's B1 fix.
- **Security:** no secrets, and no remote images. The site uses `textContent` only, through `el()`. Store links keep `rel="noopener noreferrer"` and `target=_blank`.
- **RTL / dark theme / a11y:** the new CSS is direction-neutral. The white tile and `--border` work on both theme surfaces (screenshots). Alt text is present in EN and AR (N2 is a note only). Step 3 confirmed the focus stops and the 44px targets.
- **Docs:** every step has a doc, and all plan statuses are done. The `-icon` file-name deviation from the plan is recorded in Step 1's decisions and in the plan's "User decisions" section. N3 and N4 are minor documentation fixes.
