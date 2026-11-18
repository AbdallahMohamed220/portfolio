# Step 1: Resolve the store URLs and download the icons

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Resolved all 23 short links in `shared.projects[]` (`portfolio/content.js`). Doctorcrypto has no App Store URL. Used curl with a Chrome user agent and an `Accept-Language` header, without following redirects, and read the `Location` header. For `redirect.viglink.com`, read the decoded `u` parameter.
- Fetched each resolved Google Play listing with `&hl=en&gl=US` and read `og:title`, `og:image` and the developer link. Every Play listing that returned 404 was retried with no params and with `gl=SA`, `gl=KW` and `hl=ar&gl=SA`. All four retries also returned 404.
- For App Store, used `https://itunes.apple.com/lookup?id=<id>` (fields `trackName`, `sellerName`, `bundleId`, `artworkUrl512`). The default store was tried first, then `country=sa`/`kw`. For the three apps with no result, 10 countries were tried (us, sa, kw, ae, eg, qa, bh, om, jo, gb). The listing pages were also checked with Node `fetch`. curl segfaults on `*.apple.com`/`mzstatic.com` in this environment.
- Saved raw downloads in a new empty folder, `scratchpad/icons-raw/`. Checked the magic bytes and dimensions with `scratchpad/icons/imginfo.mjs`, which reads the PNG IHDR / JPEG SOF. Looked at each icon visually, then copied the accepted files into `portfolio/assets/`.
- Result: **5 icons** downloaded, all from Google Play. **7 projects** keep their SVG. One of them, home-experience, has a usable App Store icon that waits on a user decision (see Open questions).

### Per-project table

| # | id | Short URL used | Resolved store URL | HTTP result | App name / developer seen | Icon source URL | Local file | Dimensions | Bytes | Result |
|---|----|----------------|--------------------|-------------|---------------------------|-----------------|------------|-----------|-------|--------|
| 1 | alriyadh-app | https://shorturl.at/wDSsL (Play) | https://play.google.com/store/apps/details?id=com.alriyadh.alriyadh_web_view | 200 | "Alriyadh" / E-vision | https://play-lh.googleusercontent.com/Dm1heTWn0hznhop37S7nfdQh9_4_MgoHSKdwMRczPM5Vo6MHG2Ce1b9W_2ksIK4RDWoBkd9tyk0ceZgKRvp7-QE=s512 | `assets/project-alriyadh-app-icon.png` | 512x512 PNG | 65942 | **icon (Play)**. App Store (xli1x, then apps.apple.com/sa/app/evision-alriyadh/id6746263220, "Evision-Alriyadh") was not needed. |
| 2 | waste-transportation-request | https://shorturl.at/9RvLv (Play) | https://play.google.com/store/apps/details?id=com.evisionCrop.makkahloadingwasteapp | 200 | "طلب نقل النفايات" (= Waste Transportation Request) / E-vision | https://play-lh.googleusercontent.com/Fk4q4wLZhm4dBh9PMy7_uGDXlThnqwB5Z3c48k-M0RQLwJi6Q-ZTchwAUmDbvzvRYmIN5YTvIuZkXX7U0-bmLg=s512 | `assets/project-waste-transportation-request-icon.png` | 512x512 PNG | 53243 | **icon (Play)**. App Store (S4dpi, then id6744645212, same Arabic name, E VISION) was not needed. |
| 3 | taher | https://shorturl.at/eDUZI (Play), https://shorturl.at/5G3Ke (App Store) | — (both unresolvable) | 200, but the body is the shorturl.at "404 Page Not Found" page, for both | — | — | — | — | — | **SVG fallback**: both short links are dead on shorturl.at, so no store URL is known. |
| 4 | home-experience | https://tinyurl.com/bf4kc33p (Play), https://t.ly/BkTG9 (App Store) | Play: https://play.google.com/store/apps/details?id=com.home_experience.home_experience. App Store: https://apps.apple.com/us/app/furniture-experience/id6469695066 | Play 404 (all regions). App Store 200 | App Store: "Furniture Experience" / Mahmoud Nabil, bundle `com.homeexperience.homeExperience` | candidate: https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/33/28/05/332805a6-9fb4-2ef3-a501-6857766ace4c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.png (lookup `artworkUrl512` with the `.png` form) | not copied. Staged at `scratchpad/icons-raw/home-experience-appstore-512.bin` | 512x512 PNG | 33609 | **SVG fallback (pending user decision)**: Play was removed. The App Store listing name "Furniture Experience" does not match "Home Experience", even though the CV link points to it and the bundle id and furniture topic match. |
| 5 | fix-infinity | https://tinyurl.com/26vka4wa (Play), https://shorturl.at/iosGU (App Store) | Play: https://play.google.com/store/apps/details?id=com.fix_infinity.fix_infinity. App Store: unresolvable | Play 404 (all regions). App Store short link: shorturl.at 404 page | — | — | — | — | — | **SVG fallback**: Play listing removed, and the App Store short link is dead. |
| 6 | alwsata-employees | https://tinyurl.com/bdd9vks7 (Play, via viglink `u=`) | https://play.google.com/store/apps/details?id=com.wasata_employee.wasata_employee | 200 | "موظفو الوساطة العقارية" (= Alwsata Real Estate Employees) / Naif Almutari | https://play-lh.googleusercontent.com/ayRMXJFg972xOulyDfuouK7SUk4ID8NEF6Wtzr6-H62TqAZb1Mb3KE1-9hAibKLgYy_vMfvLwWJjZTmInmMv_A=s384 | `assets/project-alwsata-employees-icon.png` | 384x384 PNG | 64354 | **icon (Play)**. `=s512` was 118175 B, which is over 100 KB, so `=s384` was used. The App Store short link (5vwVn) is dead, but it was not needed. |
| 7 | alwsata-real-estate | https://tinyurl.com/5n9a232e (Play, via viglink `u=`) | https://play.google.com/store/apps/details?id=com.wasata.wasata_user | 200 | "الوساطة العقارية" (= Alwsata Real Estate) / Naif Almutari | https://play-lh.googleusercontent.com/zu4lVQVKojjmzTZ31arBScR0oENp4KW_i9pdv7C3_QoPRroMLoauO-5Pv4uF9iTp3GRsMl9aIOqlMQORMcy-=s512 | `assets/project-alwsata-real-estate-icon.jpg` | 512x512 JPEG | 59283 | **icon (Play)**. The App Store (atn6h2er, then id1588240476, "الوساطة العقارية" / ALWSATA REAL ESTATE CO) shows the same app but was not needed. |
| 8 | al7feaz | https://t.ly/hjnCd (Play), https://t.ly/3_iqZ (App Store) | Play: https://play.google.com/store/apps/details?id=com.alhafeaz.alhafeaz. App Store: https://apps.apple.com/us/app/al7feaz/id1632115419 | Play 404 (all regions). App Store: lookup `resultCount:0` in 10 countries. The page returned 429 on 4 tries | — | — | — | — | — | **SVG fallback**: removed from Play, and not in the App Store catalog (lookup empty everywhere). |
| 9 | doctorcrypto | https://tinyurl.com/fbpfh6u7 (Play, via viglink `u=`) | https://play.google.com/store/apps/details?id=com.DoctorCrypto.doctor_crypto | 404 (all regions) | — | — | — | — | — | **SVG fallback**: Play listing removed. There is no App Store URL. |
| 10 | chkchk | https://t.ly/rzozJ (Play), https://t.ly/qQ4pP (App Store) | Play: https://play.google.com/store/apps/details?id=com.chkchk.chkchk. App Store: https://apps.apple.com/us/app/chkchk-app/id1602066977 | Play 404. App Store page 404 (us, kw), and lookup gave 0 results in 10 countries | — | — | — | — | — | **SVG fallback**: removed from both stores. |
| 11 | messayel | https://rb.gy/l3ge9i (Play), https://rb.gy/b3lk1u (App Store) | Play: https://play.google.com/store/apps/details?id=com.AZ.messayel. App Store: https://apps.apple.com/us/app/messayel/id1602085490 | Play 404. App Store page 404 (us, sa), and lookup gave 0 results in 10 countries | — | — | — | — | — | **SVG fallback**: removed from both stores. |
| 12 | bedayat | https://tinyurl.com/5efpshce (Play, via viglink `u=`) | https://play.google.com/store/apps/details?id=com.bedayat.app&hl=en&gl=US | 200 | "Bedayaat" / Bedayaat. The icon shows "بدايات Bedayaat" | https://play-lh.googleusercontent.com/xleIyGezz1MERJUyd4aFCxMVBv5wusanIYtavLaQfYW6mOTHb0o3vRb85ZRrcVbOdzunhLlfVnWDob9vvzx5Ug=s512 | `assets/project-bedayat-icon.jpg` | 512x512 JPEG | 53534 | **icon (Play)**. The App Store (rb.gy/aj2cfi, then id6451140940, "Bedayat" / Learning Beginnings Co., artist Bedayaat) shows the same app but was not needed. |

### Method per short-link host
| Host | Method | Outcome |
|------|--------|---------|
| `tinyurl.com` | curl with a browser UA. You get 301 straight to the store, or 302 to `redirect.viglink.com/?u=…`, where the `u` parameter is URL-decoded | All resolved |
| `shorturl.at` | curl with a browser UA and `Accept`/`Accept-Language`, no 403. `shorturl.at/<c>` returns 301 to `www.shorturl.at/<c>`, then 302 to the store. Dead codes return HTTP 200 with the service's "404 Page Not Found" page | 4 resolved (wDSsL, xli1x, 9RvLv, S4dpi). 4 dead (eDUZI, 5G3Ke, iosGU, 5vwVn) |
| `t.ly` | curl with a browser UA, no 403. It returns 301 straight to the store | All 5 resolved |
| `rb.gy` | curl with a browser UA. It returns 301 straight to the store | All 3 resolved |
| Headless Chrome | Tried `--headless=new --dump-dom` on shorturl.at as a cross-check. Every URL, including the working control `wDSsL`, got the Cloudflare "Just a moment..." page, so this method gives no signal | Not used for any result |

## Files touched
- `portfolio/assets/project-alriyadh-app-icon.png`: new, Play icon, 512x512, 65942 B
- `portfolio/assets/project-waste-transportation-request-icon.png`: new, Play icon, 512x512, 53243 B
- `portfolio/assets/project-alwsata-employees-icon.png`: new, Play icon, 384x384, 64354 B
- `portfolio/assets/project-alwsata-real-estate-icon.jpg`: new, Play icon, 512x512, 59283 B
- `portfolio/assets/project-bedayat-icon.jpg`: new, Play icon, 512x512, 53534 B
- No other site files changed. `content.js`, CSS, README, tests and SVGs are untouched.

## Decisions
| Decision | Reason |
|----------|--------|
| File names are `project-<id>-icon.<ext>`, not the plan's `project-<id>.<ext>` | The orchestrator's Step 1 brief asked for this name explicitly. The check script does not care about the extension or the name pattern. Step 2 must use these names. |
| Kept the format Play serves: PNG for 3 icons, JPEG for 2. No re-encoding | All five are under 100 KB at their chosen size, so no conversion was needed. |
| alwsata-employees uses `=s384` | `=s512` was 118 KB. `=s384` is 64 KB and stays in the 256–512 px range. |
| Arabic listing names count as a name match (#2, #6, #7) | They translate exactly to the CV project names. Each listing is the CV's own Play link, and the developers (E-vision, Naif Almutari) fit the CV employers (Evision, Alwsata). |
| "Bedayaat" counts as a match for "Bedayat" | It is a transliteration variant, and the icon itself shows "بدايات Bedayaat". The App Store listing for the same app is called "Bedayat". |
| home-experience was **not** given the App Store icon | The listing name is "Furniture Experience", which does not match "Home Experience". The user rule says the app name must match, so the case goes back as an open question and the SVG stays for now. |
| Dead shorturl.at codes were treated as unresolvable. No other URL was guessed | The user rule is never to guess. A working control code with the same headers redirected, so the 404 pages are real. |
| al7feaz App Store was treated as unavailable despite the 429 on the page | The iTunes lookup returned 0 results in 10 countries, the same pattern as chkchk and messayel, whose pages return 404. |

## Verification
- Header check of every short link with `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"`. The output is summarized in the tables above.
- `node scratchpad/icons/imginfo.mjs portfolio/assets/project-*-icon.*` checks the magic bytes and dimensions:
  ```
  project-alriyadh-app-icon.png png 512x512 65942
  project-alwsata-employees-icon.png png 384x384 64354
  project-alwsata-real-estate-icon.jpg jpeg 512x512 59283
  project-bedayat-icon.jpg jpeg 512x512 53534
  project-waste-transportation-request-icon.png png 512x512 53243
  ```
  All are valid images, square, 256–512 px and 100 KB or less.
- Visual check: opened each file. They show the Riyadh municipality emblem, a green waste truck, the Alwsata logo (white on blue for Employees, blue on white for Real Estate) and the Bedayaat wordmark. Each one fits its listing.
- Each icon URL is the `og:image` base of the listing in the same row, with only the `=sNNN` suffix changed.
- No site files were edited. Only the 5 new files above were added to `portfolio/assets/`.
- Scratch files: scripts are in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\icons\`, raw downloads are in `...\scratchpad\icons-raw\`, and listing HTML/JSON is in `...\scratchpad\icons-pages\`.

## Open questions / follow-ups
- **home-experience (user decision):** the CV's own App Store link (t.ly/BkTG9) resolves to "Furniture Experience" (id6469695066, seller Mahmoud Nabil, bundle `com.homeexperience.homeExperience`). The CV says the project is "an app for furniture sales". The Play listing is removed. Should this App Store icon be used even though the listing name differs? If yes, copy `scratchpad/icons-raw/home-experience-appstore-512.bin` (512x512 PNG, 33609 B) to `portfolio/assets/project-home-experience-icon.png`. If no, the project keeps its SVG.
- **For Step 2:** 5 projects get icons (alriyadh-app, waste-transportation-request, alwsata-employees, alwsata-real-estate, bedayat). Their 5 SVGs become unreferenced. The other 7 SVGs stay.
- Mixed formats: there are 3 PNGs, 2 of them with transparent or white backgrounds (alriyadh, waste truck), and 2 JPEGs with white backgrounds. Step 2 should check that the white-background icons look right in dark theme.
- Four CV short links (taher ×2, fix-infinity App Store, alwsata-employees App Store) are dead on shorturl.at. This is outside the scope of this task, but the owner may want to fix those links in the CV.
