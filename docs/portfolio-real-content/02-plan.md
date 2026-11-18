# Plan: Fill the portfolio with real CV content and photo

**Requirements:** ./01-requirements.md

Context: this task changes the existing static site in `portfolio/`. How that site works is described in `docs/personal-portfolio/`: the content schema in `03-step-1-content-assets.md`, the markup contract in `03-step-2-html-css.md`, and the check and browser verification in `03-step-5-verify.md`. Nothing about the codebase is unknown. The only real unknown is the PDF's link mapping, which Step 1 handles. The orchestrator runs the final review separately, so it is not a step here.

Execution order: Step 1, then Step 2, then Steps 3 and 4 in parallel, then Step 5.

## Steps

### Step 1 — Extract the CV into a structured EN source, with the link mapping
- **Agent:** developer. The researcher fits the description ("findings"), but it has no Bash. This step needs `grep -a` and Node to read the PDF's `/URI` and `/Rect` annotations. The developer changes no site files in this step.
- **Skills:** step-docs
- **Depends on:** none
- **Parallel:** no (Step 2 consumes its output)
- **Output:**
  - `docs/portfolio-real-content/cv-data.en.json`: every CV fact in English, with spelling fixed and meaning unchanged:
    - profile: name, role, location and profile paragraph;
    - 12 projects, newest first: name, period, role, technology, description, contributions[], challenge (only where the CV has one), googlePlayUrl and appStoreUrl;
    - 4 jobs: company, companyUrl, period, location and apps[];
    - 12 skills, each with a name and description;
    - education;
    - 6 certificates, each with a title and Udemy URL;
    - languages;
    - contact: email, phone, GitHub, LinkedIn and Stack Overflow.
  - `docs/portfolio-real-content/03-step-1-extract-cv.md`: the step doc. It records:
    - how each URL was matched to its item: page plus `/Rect` position, or order in the file;
    - a confidence level for each match;
    - every spelling fix, as original → fixed.
  - Read the source PDF in place and do not change it. Put any helper scripts in the scratchpad.
- **Done when:**
  - The JSON parses, and it has exactly 12 projects, 4 jobs, 12 skills, 6 certificates and 2 languages.
  - Every store URL, company URL, certificate URL and contact URL comes from the PDF's `/URI` list, and the Requirements' link table matches.
  - Every `/URI` in the PDF is accounted for: either it is used, or it is marked "not shown" (for example, the old getportify link).
  - Any match the developer is not sure of is listed as an open question and left out, never guessed.
- **Status:** done

### Step 2 — Schema, markup, styles, script, EN/AR content and assets
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 1
- **Parallel:** no
- **Output:**
  - **`portfolio/content.js`:** the schema is extended, and real EN content plus a full AR translation replace the placeholders. App, company and technology names stay in Latin script. The extension covers at least these fields:
    - `shared.links`: `phone` (the `tel:` value, `+201147234230`) and `stackoverflow`;
    - `shared.projects[]`: `googlePlayUrl` and `appStoreUrl`, replacing `demoUrl` and `sourceUrl`;
    - `shared` company URLs for the jobs;
    - `shared` certificate URLs;
    - `hero.location`;
    - project items: `period`, `role`, `tech`, `contributions[]` and an optional `challenge`. If `challenge` is present, it must be present in both EN and AR;
    - experience items: `location` and `apps[]`;
    - skills: 12 entries, each with a name and description;
    - `education`, `certificates` and `languages` blocks;
    - new `ui` and `contact` labels: Key contributions, Key challenge, Google Play, App Store, Phone, Stack Overflow, and a phone display string (`+20 114 723 4230`).
  - **Assets:**
    - Copy the photo to `portfolio/assets/avatar.jpg`, with real alt text in EN and AR.
    - Copy the real resume over `portfolio/assets/cv.pdf`. It must stay byte-identical to the source.
    - Remove `avatar.svg` if nothing uses it any more.
    - Project images: generic SVGs with no text. Reusing the existing 3 SVGs, or adding simple app-icon-style ones, are both acceptable.
  - **`index.html`, `styles.css` and `script.js`:** change them only where the new fields need it. This covers the following:
    - Projects: a compact card grid for 12 projects that stays readable at 360px. Collapsing the contributions and challenge into a native `<details>` element is allowed.
    - Experience: the company is a link, and the location and apps list are shown.
    - Skills: name plus description.
    - Education, Certificates and Languages sub-sections inside `#skills`, each with a linked certificate.
    - Contact: phone and Stack Overflow links.
    - Text keeps using `textContent` only and logical CSS properties only, and the site keeps working over `file://`.
  - **Step doc:** `03-step-2-site-update.md`. It records the updated schema and markup contract, which Steps 3–5 rely on.
- **Done when:**
  - In headless Chrome over `file://`, EN and AR both render every DoD item: 12 cards, 4 jobs, 12 skills, education, 6 certificates, languages and 5 contact links.
  - The page shows no placeholder text in either language, and the console has 0 errors.
  - There is no horizontal scroll at 360, 768 or 1280px in EN or AR.
  - `en` and `ar` have identical shapes.
  - `cv.pdf` hashes to the same value as the source.
  - `node tests/portfolio/check-content.js` may still fail on checks that Step 4 owns. The step doc must name each such failure.
- **Status:** done

### Step 3 — Update the README
- **Agent:** developer
- **Skills:** step-docs
- **Depends on:** step 2
- **Parallel:** yes, with Step 4
- **Output:**
  - `portfolio/README.md` documents the new `content.js` structure: the new `shared` links and URLs, the project, experience and skill fields, education, certificates and languages, and the optional `challenge` rule.
  - The README's image instructions use `avatar.jpg`, and its CV instructions describe the real PDF.
  - The step doc is `03-step-3-readme.md`.
- **Done when:** every key and file name in the README exists in `content.js` or `assets/`, and every top-level schema key in `content.js` is documented.
- **Status:** done

### Step 4 — Update the check script for the new structure
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** step 2
- **Parallel:** yes, with Step 3
- **Output:** an updated `tests/portfolio/check-content.js`. It covers:
  - counts: 12 projects, 4 jobs, 12 skills, 6 certificates and 2 languages;
  - for each project: `period`, `contributions` and both store URLs are present;
  - `challenge` is present in both languages or in neither;
  - the expected contact, company and certificate URLs, and `tel:` and `mailto:` values in the right form;
  - external links use `http(s)`, so E.VISION's `http://` URL from the PDF is allowed;
  - the avatar is a `.jpg`;
  - no placeholder strings are left (for example `example.com`, `your-username` and "placeholder");
  - the PDF check works on the real resume. The current hand-written xref check may not fit a real PDF, which can use xref streams or incremental updates. It is relaxed to a header, `%%EOF` and size check, plus a SHA-256 of the approved file.

  A mutation test shows the new checks fail on broken copies. The step doc is `03-step-4-check-script.md`.
- **Done when:** `node tests/portfolio/check-content.js` exits with 0 on the site. Every new check has been seen to fail at least once on a mutated scratch copy. Any failure caused by production code is reported to the orchestrator, and the tester does not fix it.
- **Status:** done

### Step 5 — Verify against the definition of done
- **Agent:** tester
- **Skills:** step-docs
- **Depends on:** steps 2, 3, 4
- **Parallel:** no
- **Output:** `03-step-5-verify.md`. It has a pass/fail table with evidence for each of the 10 DoD items in `01-requirements.md`, and for the original portfolio's DoD items in both languages. The checks reuse the CDP approach from `docs/personal-portfolio/03-step-5-verify.md` (headless Chrome, `file://`, plus a local `http://` server for the CV download), and the scripts live in the scratchpad. They cover:
  - every store, company, certificate and contact `href` compared with the URLs in Step 1's JSON;
  - the downloaded CV is byte-identical to the source;
  - keyboard access through the larger number of links and any `<details>` elements;
  - reduced motion;
  - toggles that persist after a reload;
  - no horizontal scroll at 360, 768 and 1280px;
  - a clean console.
- **Done when:** every DoD item has a result with evidence, and the check script's output is captured. Failures come with steps to reproduce, and production code is not changed.
- **Status:** done

## Risks / open questions
- **Link mapping (main risk):** the PDF probably has around 24 store links, mostly short `shorturl.at` URLs, plus 6 certificate URLs. All of them must be tied to the right project or certificate by `/Rect` position or file order. If a project lacks a Google Play or App Store link in the CV, or a match is uncertain, Step 1 reports it and does not guess. The user then decides: hide that button, or supply the URL.
- **`http://` company link:** E.VISION's URL in the PDF is `http://www.evision-corp.com/`. The plan keeps it exactly as given and relaxes the https-only check. The alternative is to upgrade it to `https://`, but that is not from the PDF. This is the user's call if they care.
- **Real PDF vs. the structural check:** the old check was written for a hand-made PDF. Step 4 relaxes it so that the real resume is not rejected because of how it is built internally.
- **12 projects on mobile:** contributions make the cards long. Step 2 may collapse them with `<details>`. This is still within "markup needed for new fields", not a redesign.
- **Arabic copy:** agents write it, and per the requirements the user reviews it. Proper names stay in Latin script.
- **Step 2 size:** it bundles schema, rendering and content on purpose, because they are tightly coupled. Splitting them would mean a second contract hand-off with a risk of drift. If it turns out too big, the orchestrator can split the AR translation into a follow-up developer step after EN is in place.

## User decisions (2026-11-18, plan approved)
- **Missing store link:** hide that store's button. Don't ask the user for the URL.
- **Project images:** 12 distinct app-icon-style SVGs, one per project, each with the project's initial on a different colour.
- **E.VISION link:** keep `http://www.evision-corp.com/` exactly as it appears in the CV. The check script must accept http.
- **Bedayat:** the CV has no contributions, so the list stays empty and the card hides the contributions block. Step 4's checks must allow this.
- **Alriyadh App:** role = "Mobile Developer".
- **E.VISION:** its apps are Alriyadh App, Waste Transportation Request and Taher.
- **Arabic copy (after Step 2):** keep "عبدالله محمد" and "مطوّر تطبيقات الجوال". Certificate titles stay in English. The location is shown as "Cairo, Egypt" / "القاهرة، مصر". No changes needed.
