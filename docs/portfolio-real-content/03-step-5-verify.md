# Step 5: Verify against the definition of done

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Ran `node tests/portfolio/check-content.js` from the repo root: **37 passed, 0 failed, exit 0**.
- Wrote and ran my own CDP harness, `verify.js`, against `file:///D:/try_agent_workflow/portfolio/index.html` in headless Chrome 157 (Node v22.21.0). The CV download also ran over a local `http://` server. No earlier agent's script was reused. Result: **90 passed, 0 failed**.
- Ran follow-up probes for the sticky header (`header.js` and `hdr2.js`) and took screenshots (`clips.js`). Looked at the EN 360, AR 1280 dark and EN 768 screenshots by eye.
- Compared the hashes of `cv.pdf` and `avatar.jpg` with their source files.

## Files touched
- `docs/portfolio-real-content/03-step-5-verify.md`: this doc.
- No production code and no plan statuses were changed.
- Scratch files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\step5-rc\`:
  - `verify.js`: the DoD run;
  - `out.txt`: its full log;
  - `results.json`;
  - `header.js` and `hdr2.js`: the header probes;
  - `clips.js` and `clip768.js`: the screenshot scripts;
  - `shots\*.png`;
  - `downloads\`: the CV saved over http.

## Decisions
| Decision | Reason |
|----------|--------|
| Every expected value is read from `cv-data.en.json` at run time, not copied into the harness | That JSON is the agreed source of truth. A hand-copied list could hide drift. |
| EN text is compared exactly with the CV. AR is compared with `content.ar` for shape and values, and checked for Arabic script | There is no AR source of truth. The user reviews the Arabic copy. |
| The overflow test covers EN/AR × light/dark × 360/768/1280 × details closed/open (24 combinations) | Theme and open `<details>` change heights and line wrapping, and the plan names the details blocks explicitly. |
| After each Tab, the harness waits for `scrollY` to settle before it measures focus | The site uses `scroll-behavior: smooth`. The first run measured mid-scroll and reported false "off screen" stops. |
| The skip-link test starts from a fresh navigation | After `blur()`, Chrome keeps its sequential-focus starting point. The first run's Tab therefore landed on a project link, which is a harness artifact. |
| CV download: `http://` decides the result; `file://` only checks that the link resolves | Chrome ignores `download` on `file:` URLs. This was already documented in `docs/personal-portfolio/03-step-5-verify.md`. |

## Verification

### 1. `node tests/portfolio/check-content.js`
```
37 passed, 0 failed.
exit=0
```
All 37 lines are PASS, including these: the counts (12/4/12/6/2), the store-key and null rules, challenge only where the CV has one, all 37 URLs equal to `cv-data.en.json`, `http(s)` only, the `tel:`/`mailto:` forms, EN text equal to the CV, 20 asset paths, the avatar is a `.jpg`, the PDF SHA-256, no placeholders, 51 i18n paths, and no hard-coded HTML text.

### 2. Hashes
- `assets/cv.pdf` and `C:\Users\Evision\Downloads\Abdallah_Mohamed_Resume.pdf` both hash to `6f6609a598cb3990c90919fb99c92579b645a9416a683d1938d01867753be147` (175,811 B).
- `assets/avatar.jpg` and the source photo both hash to `71119f98…eac3531`.

### 3. Browser run: `verify.js`, 90/90 PASS
On its first run the harness reported 4 failures. All 4 were harness bugs, fixed as described in Decisions. The AR About regex also missed "السنوات الخمس" ("five years"), which is correct text. A clean re-run gave `90 passed, 0 failed. ALL PASS`.

### Definition of Done (this task): pass/fail
| # | DoD item | Result | Evidence (EN and AR unless stated) |
|---|----------|--------|------------------------------------|
| 1 | Real photo with EN/AR alt, name, role; no placeholder text | **PASS** | `img#hero-avatar` src is `assets/avatar.jpg`, loaded, naturalWidth 400. Alt in EN: "Abdallah Mohamed smiling, wearing glasses and a navy striped sweater". In AR: "عبدالله محمد مبتسمًا، يرتدي نظارة…". The h1 and role read "Abdallah Mohamed" / "Mobile Developer", and in AR "عبدالله محمد" / "مطوّر تطبيقات الجوال" (user decision). Location: "Cairo, Egypt" / "القاهرة، مصر". A placeholder regex (`example.com`, `your-username`, placeholder, lorem, John Doe, TODO, `avatar.svg`, `project-N.svg`, Project One, Arabic dummy phrases…) finds no match in the visible text or in the alt/title/aria-label/src/href/meta attributes. No `data-i18n` element is empty. |
| 2 | About = CV profile paragraph in EN and AR | **PASS** | EN is exactly equal to `cv.profile.summary`. AR is one paragraph, equal to `content.ar`, in Arabic script, and keeps the "5 years" fact ("السنوات الخمس"). |
| 3 | 12 projects, newest first, with period, description, contributions, challenge where the CV has one, and exact store URLs | **PASS** | There are 12 `li.project-card`, in exactly the CV order (Alriyadh App … Bedayat). There are 23 store links, each with the exact CV `href`, the label from `ui`, `target=_blank`, `rel=noopener noreferrer` and `aria-describedby=<id>-title`. **DoctorCrypto** shows only Google Play (`https://tinyurl.com/fbpfh6u7`); its App Store button is hidden. Period, role, tech (Flutter), description and contributions equal the CV in EN and the content in AR. A **challenge** appears only on Fix Infinity, ChkChk and Messayel, each with a "Key challenge" heading. **Bedayat** has no `<details>`, and the other 11 cards have one. There are 12 distinct icons, all loaded and all with alt. In AR, the app names stay in Latin script. |
| 4 | 4 jobs with dates, locations and company links | **PASS** | E.VISION 12/2023 – present, Cairo → `http://www.evision-corp.com/`. Alwsata 08/2022 – present, Saudi Arabia → `https://alwsata.com.sa/`. Csskw 01/2022 – 07/2022, Kuwait → `https://csskw.net/`. Rizme 05/2021 – 12/2021, Egypt → `https://www.linkedin.com/company/rizme/`. The apps lists equal the CV. AR shows the same `href`s, with translated "present" and locations. |
| 5 | 12 skills; education, 6 certificates with Udemy links, and languages | **PASS** | There are 12 skills with name and description, equal to the CV in EN. Education: Computer Science, Faculty of Computers and Information, 09/2014 – 09/2018 (AR: علوم الحاسب, كلية الحاسبات والمعلومات). The 6 certificate links have the exact Udemy URLs in the CV order and English titles (user decision). Languages: Arabic and English / العربية and الإنجليزية. |
| 6 | Contact: mailto, tel, GitHub, LinkedIn, Stack Overflow | **PASS** | The hrefs are `mailto:Dev.Fluttery@gmail.com`, `tel:+201147234230`, `https://github.com/AbdallahMohamed220`, the LinkedIn URL with `%F0%9F%87%B5%F0%9F%87%B8`, and `https://shorturl.at/QYQxr`. The phone is shown as "+20 114 723 4230". The 3 profile links open in a new tab with `noopener`. Real mouse clicks on GitHub, LinkedIn, Stack Overflow, a company link, a certificate and a store link each opened a new tab, and the original tab stayed on the page. **All `href`s:** both languages have 38 external `href`s, and every one is in `cv-data.en.json`. Every URL in `cv-data.en.json` appears on the page, and nothing else does except `#…` anchors and `assets/cv.pdf`. |
| 7 | "Download CV" serves the real resume, byte-identical | **PASS** | Over `http://127.0.0.1:8791`, a real click fired `downloadWillBegin`, suggested the name `cv.pdf`, and completed with 175,811 B. `Buffer.compare` against the source PDF returns 0, and the page stays on `index.html`. Over `file://`, the link resolves to `…/portfolio/assets/cv.pdf`, which is identical to the source; Chrome opens it rather than saving it (a known browser rule). |
| 8 | Original DoD still holds in both languages | **PASS** | See the next table. |
| 9 | `check-content.js` passes and covers the new fields | **PASS** | 37/37, exit 0 (section 1). The new fields are covered: counts, store URLs and nulls, challenge, contributions, company and certificate URLs, the `tel:` form, education, languages and the PDF SHA. Step 4 mutation-tested these checks; I did not repeat that. |
| 10 | README matches the new `content.js` structure | **PASS (cross-checked, not re-derived)** | The check script passed on the same tree. Step 3's doc reports that every README key exists. A `grep` of `portfolio/README.md` finds `avatar.jpg`, `googlePlayUrl`, `appStoreUrl`, `companyUrl`, `certificates`, `challenge`, `stackoverflow` and `phoneDisplay`, and no stale `avatar.svg`, `project-1`, `demoUrl` or `sourceUrl`. A full key-by-key audit was out of scope for a browser run. |

### Original portfolio DoD (`docs/personal-portfolio/01-requirements.md`), re-checked in EN and AR
| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Opens from `file://` with all 4 sections; clean console | **PASS** | All sections render. All 13 images load (after scrolling, because the images are lazy). The run logged **0** console errors, warnings, exceptions and `Log` entries over its 90 checks. |
| 2 | All visible text comes from `content.js` | **PASS** | A tree walk of every DOM text node, in EN and in AR, found 0 strings that are not in `PORTFOLIO_CONTENT`. `document.title` comes from `meta.title`. |
| 3 | Language toggle EN↔AR, LTR↔RTL, persists | **PASS** | A real click switches to `ar`/`rtl` with computed `direction: rtl`, saves `portfolio-lang=ar`, and renders 12 cards with no duplicates. AR persists after a reload. At 1280px the layout is mirrored: the avatar is left of the text and the brand is on the right. Switching back to `en`/`ltr` also persists. An open `<details>` stays open across a language switch. |
| 4 | Theme toggle; persists; first visit follows the system | **PASS** | On a first visit, an emulated dark system gives `dark` and a light system gives `light`. A click to dark saves the choice, and the background becomes `rgb(15,17,23)`. Dark plus AR persists after a reload with a light system. Switching back to light also persists. |
| 5 | No horizontal scroll at 360/768/1280; nav usable on mobile | **PASS** | All 24 combinations passed: `scrollWidth <= clientWidth` on `html` and `body`, `scrollTo(500)` leaves `scrollX = 0`, and no visible element is outside the viewport. At 360px in EN and AR: the toggle is 44×44 and starts closed. A tap opens the menu, all links are on screen, and tapping Contact goes to `#contact` and closes the menu. See also observation O1. |
| 6 | Fade-in; off with reduced motion | **PASS** | With `no-preference`, About is visible and Contact starts at opacity 0 until it is scrolled into view, then reaches opacity 1. Smooth scroll is on. With `reduce`, all 4 sections show opacity 1 and `transform: none`, the transition is 1e-05s, and `scroll-behavior` is `auto`. Turning `reduce` on while the page is open reveals every section. |
| 7 | Download CV | **PASS** | See DoD 7 above. |
| 8 | Contact links | **PASS** | See DoD 6 above. |
| 9 | Keyboard access and alt text | **PASS** | **Tab order at 1280px, EN and AR:** 60 stops each. They include the skip link, the language, theme and CV controls, 11 summaries, 23 store links, 4 company links, 6 certificate links and 5 contact links. Every stop matches `:focus-visible` with a `solid 3px` outline, ends up on screen, and is not under the sticky header. At 360px, none of the 57 stops is under the header.<br>**Skip link and toggles:** the first Tab shows the skip link, and Enter moves focus to `<main>`. Enter or Space on the language button switches language and keeps focus there. Enter or Space on the theme button toggles the theme.<br>**`<details>` and menu:** Enter opens a project `<details>` and Space closes it. At 360px, Enter opens the menu, Tab goes into it, and Escape closes it and returns focus to the toggle.<br>**Names and alt:** every link, button and summary has an accessible name, and all images have non-empty alt text. |
| 10 | README covers editing, CV/images and deploy | **PASS** | See DoD 10 above. |

**Overall: 10/10 DoD items of this task and 10/10 of the original task pass. No production bugs were found.**

### Visual sanity (screenshots in `scratchpad\step5-rc\shots\`)
- `ar-1280-dark.png`: the RTL mirror is correct and the cards are in 3 columns. The Experience timeline and the Credentials blocks sit side by side, and the contact grid has 3 columns. The theme is dark and nothing overlaps.
- `en-360-hero.png`, `en-360-cards.png`, `en-360-skills.png` and `en-360-contact.png`: the photo, name, role and location are right. The Fix Infinity card is shown open with Key contributions and Key challenge. The store buttons, timeline tags and contact cards (with the phone shown as +20 114 723 4230) are all readable. The sticky header that appears in the middle of a clip is an artifact of `captureBeyondViewport`.
- `en-360.png` and `ar-360-open.png` are full-page shots. They are too tall to judge by eye; the viewport-sized clips above replace them.

### Observation O1 (cosmetic, does not fail the DoD): the EN header wraps onto two rows
- **What:** the designed header height is `--header-h: 4rem` (64px). In **EN** the header is 84–99px tall at 320, 360 and 375px. It is also 95px tall at a 768px *desktop* window, where a 15px scrollbar leaves a content width of 753px. In **AR** it is 65px at every width. The cause is probably the longer brand text "Abdallah Mohamed" (167px wide). At ≤375px the hamburger wraps to a second row. At 768px with a scrollbar the language and theme buttons wrap.
- **Impact:** low. There is no horizontal scroll, anchor targets land below the header (section titles at 129–145px), and no focused element is hidden. The cost is about 35px of extra sticky header on small phones in EN.
- **Repro:** run `node C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\step5-rc\hdr2.js`. Or, in Chrome DevTools, set the viewport to 360×740 with EN selected, and see that `#site-header` is 99px tall and `#nav-toggle` sits below the brand.

### Manual checklist (could not be automated)
- [ ] **Short store URLs** (`shorturl.at`, `tinyurl`, `t.ly`, `rb.gy`) and the Stack Overflow short link: open each one and confirm it lands on the right store or profile page. The run had no network, and resolving them is out of scope.
- [ ] **Udemy certificate and company links:** open them and confirm each certificate title matches its page.
- [ ] **Arabic copy review by the user**, especially the About text, project descriptions, skill descriptions and the "present" wording.
- [ ] **Screen reader** (NVDA or VoiceOver) in EN and AR: the 11 "More details" summaries are told apart by their card title (`aria-describedby`); the phone number is read correctly in AR.
- [ ] **Other browsers** (Firefox, Safari and iOS Safari) and a **real phone** at 360px: test the toggles with a reload, the menu, `<details>`, and check for sideways scroll.
- [ ] **`mailto:` and `tel:`:** confirm they open the mail app and the dialer on a phone.
- [ ] **Downloaded PDF:** opens in a PDF viewer and shows the 3-page resume.
- [ ] **Contrast** of the project icon colours and the theme colours with a contrast tool. Step 2 computed the icons at 4.99–7.31; I did not re-measure them.
- [ ] **Real OS settings** for reduced motion and dark mode (not emulated), on a first visit with storage cleared.

## Open questions / follow-ups
- **O1 (the EN header wraps):** a cosmetic decision for the user or orchestrator. Options are to accept it, use a shorter brand at narrow widths, or let the brand truncate. No DoD item fails because of it.
- **CV over `file://`:** this is the same Chrome limitation as in the original task. It is not a defect.
- The new-tab click test confirmed that tabs open, but the CDP `targetCreated` URL was still empty when it fired. The exact URLs are proven by the `href` checks instead.
