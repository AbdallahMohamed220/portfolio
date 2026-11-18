# Step 2: Wire the icons into the site, CSS and README

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- **Home Experience icon:** copied `scratchpad/icons-raw/home-experience-appstore-512.bin` to `portfolio/assets/project-home-experience-icon.png`. It is a valid PNG: 512x512, 33609 B.
- **Images:** set `shared.projects[].image` to the `-icon` file for 6 projects: alriyadh-app, waste-transportation-request, home-experience, alwsata-employees, alwsata-real-estate and bedayat. Deleted their 6 SVGs, which nothing referenced any more. The other 6 projects keep their letter SVGs: taher, fix-infinity, al7feaz, doctorcrypto, chkchk and messayel.
- **CSS:** `.project-image` is now a 3.5rem rounded square (`inline-size`/`block-size`, `aspect-ratio: 1`, `object-fit: cover`). Raster icons (`:not([src$=".svg"])`) also get a white tile and a 1px `var(--border)` border.
- **Store links:** re-checked all 24 store slots (23 URLs, and one is `null` in the CV). Set 13 dead URLs to `null` in `content.js`, and recorded each with its evidence in `docs/project-store-icons/dead-links.json`. `script.js` needed no change: it already leaves out `.project-links` when both URLs are `null` (`links.length ? … : null`), and `el()` skips null children.
- **README:** updated the asset tree, the `projects[]` row, the add-a-project rule, the store-links rule (`null` = no CV link or dead listing) and the project-images notes.
- Also updated the rule comment at the top of `content.js` to explain why a store URL can be `null`.

### Store links per project (checked 2026-11-18T13:50:04Z)
| id | Google Play | App Store | Store row shown |
|----|-------------|-----------|-----------------|
| alriyadh-app | live (200) | live (lookup: sa=1, "Evision-Alriyadh") | both |
| waste-transportation-request | live (200) | live (lookup: sa=1) | both |
| taher | dead (shorturl.at 404 page) | dead (shorturl.at 404 page) | none |
| home-experience | dead (Play 404) | live (lookup: us=1, "Furniture Experience") | App Store |
| fix-infinity | dead (Play 404) | dead (shorturl.at 404 page) | none |
| alwsata-employees | live (200) | dead (shorturl.at 404 page) | Google Play |
| alwsata-real-estate | live (200) | live (lookup: us=1) | both |
| al7feaz | dead (Play 404) | dead (lookup 0 in 10 countries) | none |
| doctorcrypto | dead (Play 404) | null in CV | none |
| chkchk | dead (Play 404) | dead (lookup 0 in 10 countries) | none |
| messayel | dead (Play 404) | dead (lookup 0 in 10 countries) | none |
| bedayat | live (200) | live (lookup: us=1, "Bedayat") | both |

Totals: 10 live, 13 dead, 1 null in the CV.

**Methods.** Short links were resolved with curl and a Chrome user agent, without following redirects; for viglink, the `u=` parameter was decoded. A short link counts as dead when shorturl.at returns HTTP 200 with its "404 Page Not Found" page; the control code `wDSsL` with the same headers returns a 302 to Play. Play listings were fetched with curl, plain and with `&hl=en&gl=US`, `&gl=SA`, `&hl=ar&gl=SA` and `&gl=KW`; a listing counts as dead when all 5 return 404. App Store ids were checked with the iTunes lookup in us, sa, kw, ae, eg, qa, bh, om, jo and gb, using Node `fetch` because curl segfaults on `*.apple.com` here (exit 139, the same as in Step 1); an id counts as dead when all 10 regions return 0 results.

## Files touched
- `portfolio/assets/project-home-experience-icon.png`: new, App Store icon, 512x512 PNG, 33609 B.
- `portfolio/assets/project-{alriyadh-app,waste-transportation-request,home-experience,alwsata-employees,alwsata-real-estate,bedayat}.svg`: deleted. Copies are in `scratchpad/icons-step2/deleted-svgs/`.
- `portfolio/content.js`: 6 `image` paths changed, 13 store URLs set to `null`, and the header rule comment extended.
- `portfolio/styles.css`: `.project-image` changed, and a new `.project-image:not([src$=".svg"])` rule added.
- `portfolio/README.md`: asset tree, `projects[]` row, project and store-link rules, and the project-images notes.
- `docs/project-store-icons/dead-links.json`: new, 13 entries `{ projectId, store, cvUrl, resolvedUrl, evidence, checkedAt }`. `store` is `"googlePlay"` or `"appStore"`, the same names as `hiddenStores` in the CV data. `resolvedUrl` is `null` for a short link that does not resolve.
- Not changed: `portfolio/script.js`, `tests/portfolio/check-content.js` and `docs/portfolio-real-content/cv-data.en.json`.

## Decisions
| Decision | Reason |
|----------|--------|
| White tile and 1px border on raster icons only (`:not([src$=".svg"])`) | 4 icons have white or transparent backgrounds (alriyadh, waste, home-experience, bedayat). On the dark surface they would otherwise look like loose shapes, and the alriyadh PNG has alpha. The white tile makes them look like real app icons, and the border gives them an edge on the light surface (#f4f5fb). The SVGs fill their own coloured square, so they don't need it. |
| Logical sizing (`inline-size`/`block-size`) in the changed rule | The brief asked for logical properties only. Other rules in the file were left as they are. |
| A dead link needs agreement across all regions (5 Play URL variants, 10 iTunes regions) | So that a region-only listing is not marked dead. For example, alriyadh's App Store id exists only in `sa`, and it is marked live. |
| Removed listings were not cross-checked through the other store | That would mean finding a different URL than the CV gives, which is guessing. Only the CV's own links were checked. |
| `script.js` was not changed | It already omits the store row when there are no links. In the browser, every card with no links has no `.project-links` element. |
| At 1280px, cards with no links can have empty space at the bottom | This comes from the existing equal-height grid rows (the neighbouring card is taller), not from a reserved store row. At 360px, every card ends 21px (padding + border) below its last element, with or without links. |
| The README's "Default mode" check description was not changed | The check script is not changed in this step. Step 3 owns that, and should update the description with it. |

## Verification
- `node scratchpad/icons/imginfo.mjs portfolio/assets/project-*-icon.*`: all 6 files are valid. 5 are 512x512 and alwsata-employees is 384x384; all are square and between 33609 and 65942 B.
- Assets: all 14 references in `content.js` exist, there are no unreferenced files in `assets/`, and every concrete file name in the README exists. A grep for `http(s)://…\.(png|jpg|jpeg|webp|svg|gif)` in `content.js`, `index.html` and `styles.css` finds nothing.
- Headless Chrome over `file://` with `scratchpad/icons-step2/verify-step2.js`, for EN/AR, light/dark and 360/1280 (8 configurations): **56/56 PASS**. Checked in each configuration:
  - the language and theme are applied;
  - no horizontal scroll (`scrollWidth - clientWidth = 0`);
  - all 12 icons have `naturalWidth > 0`, a `file:///` `currentSrc`, and render at 56x56;
  - the 6 raster icons have `object-fit: cover`, a 14px radius, a white background and a 1px border;
  - 0 remote requests (11–18 requests, all `file:`);
  - 0 console errors;
  - the 6 cards with no links have no store row.

  Output is in `scratchpad/icons-step2/verify-out.txt`. The first run failed only because lazy images had not loaded yet on the cold first configuration. That was a harness timing issue: the second run scrolls each icon into view first and passes. The two "load event timeout" warnings come from the CDP harness after `Page.reload`; the checks on that configuration still ran and passed.
- Screenshots in `scratchpad/icons-step2/shots/` (8 files), checked by eye:
  - The icons read as rounded app icons in both themes.
  - In the dark theme, the white tiles look like normal app icons with a subtle border.
  - In AR the icons sit on the right, and the store buttons are mirrored.
  - Cards with no links end after "More details".
- `node tests/portfolio/check-content.js` exits 1 (30 passed, 1 failed), and `--cv` exits 1 (37 passed, 3 failed). Both are expected and are listed below. Every asset check passes.

## Open questions / follow-ups
- **Expected check-script failures for Step 3 (tester) to resolve:**
  1. Default and `--cv`: "every project has both store URL keys (URL or null) and at least one store link". 6 projects have no store link: taher, fix-infinity, al7feaz, doctorcrypto, chkchk and messayel. Per the scope change, default mode must allow this.
  2. `--cv` only: "empty contributions, null store URLs and challenges appear only where the CV has them". This lists the 13 nulled URLs. It should accept a `null` that matches an entry in `dead-links.json` (same `projectId`, `store` and `cvUrl`).
  3. `--cv` only: "all 37 store, company, certificate and profile URLs equal the CV". It reports the same 13 URLs as `null != CV`, and needs the same exception.
- The README's "Default mode" bullets (Links/Structure) should be updated by Step 3, together with the check-script change.
- The owner may want to fix the dead links in the CV PDF itself. That is outside this task.
