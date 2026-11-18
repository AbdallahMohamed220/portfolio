# Step 4: Update the check script for the new structure

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Rewrote `tests/portfolio/check-content.js` for the Step 2 schema. It is still dependency-free and runs with `node tests/portfolio/check-content.js [portfolioDir] [cvDataJson]`. It now has 37 checks, up from 15. The new or changed checks are:
  - **en/ar shape:** as before, and a `null` or other non-string leaf in `en`/`ar` is now reported.
  - **ids:** `projects`, `experience` and `certificates` items in both languages match `shared.*` by id and order. The shared ids are unique.
  - **counts:** 12 projects, 4 jobs, 12 skills, 6 certificates and 2 languages, in `shared` and in both languages. Education has a non-empty title, degree, institution and period. Every skill has a name and a description. A second check confirms that these counts agree with `cv-data.en.json`.
  - **project fields:**
    - title, period, role, tech, description and imageAlt are present.
    - `contributions` is an array whose length equals the CV's, so only Bedayat may be empty.
    - Both store URL keys are present, and `null` is accepted only where the CV has `null` (DoctorCrypto's App Store).
    - `challenge` is in both languages or neither, and only where the CV has one.
  - **URLs:** all 37 store, company, certificate, GitHub, LinkedIn and Stack Overflow URLs are exactly equal to `cv-data.en.json`. All 36 non-null external URLs are valid `http(s)` URLs, so E.VISION's `http://` URL is accepted.
  - **contact:**
    - the email is a plain address equal to the CV;
    - the phone is `+<digits>` (E.164, the `tel:` form) and equals `phoneInternational`;
    - `phoneDisplay` has the same digits in en and ar;
    - `script.js` builds `"tel:" + links.phone` and `"mailto:" + links.email`.
  - **EN text = CV:** the hero name and role, the hero location (must contain "Cairo"), the About paragraph, and every project's title, period, role, tech, description, contributions and challenge. Also each job's company, role, period, location and apps, plus the skills, education, certificate titles and languages.
  - **assets:**
    - every path in `content.js` and every local `src`/`href` in `index.html` is an existing file;
    - the avatar is a `.jpg`;
    - every project has its own image.
  - **PDF:** the xref parser is replaced by a sanity check: a `%PDF-x.y` header, `%%EOF` in the last 1024 bytes, and at least 10 KB. A separate check confirms that the SHA-256 equals `6f6609a5…be147`.
  - **placeholders:** every string in `shared`, `en` and `ar`, and `index.html` (without comments), is scanned. The patterns are `example.com/org/net`, `your-username`/`your.name`/…, `placeholder`, lorem/ipsum, John/Jane Doe, TODO/TBD/FIXME, `project-N.svg`, `avatar.svg`, "Project One/Two/Three", and the Arabic dummy phrases نص تجريبي, اسمك and عنصر نائب.
  - **unchanged:** i18n paths, hard-coded HTML text, and `<img>` alt from `script.js`.
- Ran a mutation test on 53 throwaway copies of the site in the scratchpad.

## Files touched
- `tests/portfolio/check-content.js`: rewritten as described above.
- `docs/portfolio-real-content/03-step-4-check-script.md`: this doc.
- Nothing under `portfolio/` was changed, and neither was the plan.
- Throwaway files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\step4-rc\`:
  - `mutate.js`: the mutation harness;
  - `out.txt`: its full output;
  - `results.json`;
  - `work\m00…m52`: the mutated copies.

## Decisions
| Decision | Reason |
|----------|--------|
| The script reads `docs/portfolio-real-content/cv-data.en.json` (the default path; it can be overridden with a 2nd argument) instead of a copy of the URLs | The JSON is the agreed source of truth. A second hard-coded copy could drift. If the JSON is missing, the script fails loudly instead of skipping checks. |
| The SHA-256 is hard-coded in the script | The task gave it explicitly, and it equals `_meta.sourceSha256`. Then the PDF check doesn't depend on the docs folder. |
| `%%EOF` is looked for in the last 1024 bytes, not only at the very end | The PDF spec lets readers search the tail. Incremental updates and trailing newlines are normal. |
| Exceptions are allowed only where the CV itself says so. Null store URLs and empty contributions are compared to the CV, not allow-listed by id | DoctorCrypto's null and Bedayat's `[]` pass, but a null or empty list on any other project fails. |
| `http://` is accepted for every external URL, with no per-URL allow-list | The exact-match check against the CV already pins E.VISION to `http://` and every other URL to `https://`. A separate allow-list would be redundant. |
| Projects are matched to the CV by position, and the EN title must equal the CV name | This catches reordering (newest first) as well as wrong data. |
| `hero.location` must only *contain* the CV location | Step 2 deliberately shows "Cairo, Egypt" (its open question 3). An exact match would fail on an editorial choice that the user may still change. |
| Only EN text is compared with the CV. AR is checked for shape, non-empty strings, matching digits and placeholders | No AR source of truth exists. The user reviews the Arabic copy. |

## Verification
- `node tests/portfolio/check-content.js` on the real site (Node v22.21.0): **37 passed, 0 failed, exit 0**. Lines for the new checks:
  ```
  PASS  counts: 12 projects, 4 jobs, 12 skills, 6 certificates, 2 languages, education present
  PASS  every project has both store URL keys (null only where the CV has no link)
  PASS  challenge is in both languages or neither, and only where the CV has one
  PASS  all 37 store, company, certificate and profile URLs equal cv-data.en.json
  PASS  all 36 external links are valid http(s) URLs (http allowed, e.g. E.VISION)
  PASS  shared.links.phone is the international number for a tel: link (+<digits>, equal to the CV)
  PASS  en text (profile, projects, jobs, skills, education, certificates, languages) equals cv-data.en.json
  PASS  assets/cv.pdf looks like a real PDF (header, %%EOF, size)
  PASS  assets/cv.pdf is byte-identical to the approved resume (SHA-256)
  PASS  no placeholder text in content.js (shared, en, ar) or index.html
  ```
  This passing run is also the positive case: DoctorCrypto's null App Store URL, Bedayat's empty contributions and E.VISION's `http://` URL are all accepted.
- Mutation test (`node mutate.js`): **53/53 cases behaved as expected**. The control case is an unchanged re-serialized copy, and it exits 0. Each of the other 52 exits 1 and names the cause. A selection:

| Mutation | Reported failure |
|----------|------------------|
| `ar.ui.appStore` removed / `ar.hero.location` = null | shape: `missing in ar` / `type string (en) vs null (ar)` |
| ar job id `rizmee`; duplicate certificate id | ids match / ids unique |
| skill, language, job, certificate or project removed | counts: `has 11, expected 12` etc. |
| education or `education.institution` removed | counts: `education.institution is missing or empty` |
| Taher contributions `[]` | `contributions has 0 entries, the CV has 4` |
| Taher period removed | `period is missing or empty` |
| Taher `appStoreUrl` = null | `null, but the CV has "https://shorturl.at/5G3Ke"` |
| DoctorCrypto `appStoreUrl` key deleted | `has no appStoreUrl key` |
| fix-infinity challenge removed in ar only | `challenge in en=true, ar=false` |
| challenge added to Taher | `challenge in site=true, in CV=false` |
| two Google Play URLs swapped; certificate URL with 1 character changed; LinkedIn or Stack Overflow changed | URL mismatch with the CV value |
| E.VISION "upgraded" to https | `"https://www.evision-corp.com/" != CV "http://www.evision-corp.com/"` |
| `ftp://` in both the site and a cv-data copy | the scheme check alone: `csskw.companyUrl -> "ftp://csskw.net/"` |
| cv-data.en.json missing | `cv-data.en.json loads` fails |
| phone `01147234230` / `tel:+20…`; ar phoneDisplay with a wrong digit | phone format / phoneDisplay digits |
| email `mailto:…` or a different address | email check |
| `script.js` uses `"callto:"` | the `"tel:" + phone` check |
| en period, job location, skill description, hero name or certificate title changed; projects reordered | EN text = CV mismatch |
| project SVG or avatar.jpg deleted; stylesheet href broken | asset paths |
| avatar switched to `.png`; two projects share one image | avatar `.jpg` / own image |
| PDF header cut; PDF truncated; 45-byte "PDF"; 1 byte flipped | sanity check (header / `%%EOF` / size) plus SHA-256; for the byte flip, only the SHA-256 fails |
| "Lorem ipsum"; Arabic "نص تجريبي"; "placeholder"; `your-username`; `example.com` link in HTML; `project-1.svg` | placeholder scan |

## Open questions / follow-ups
- No production-code failures were found.
- ~~The script now depends on `docs/portfolio-real-content/cv-data.en.json`.~~ Superseded by Review fix 1: only `--cv` reads it.
- If the user reverts `hero.location` to "Cairo" (Step 2 open question 3), the script still passes (in both modes).

---

# Review fix 1: split the check script into default mode and `--cv` (blocking issue B1)

**Agent:** tester  
**Skills used:** step-docs  
**Status:** done

## What was done
- Split `tests/portfolio/check-content.js` into two modes, as `04-review.md` B1 asked. The header comment now documents both modes.
- **CLI:**
  ```
  node tests/portfolio/check-content.js [portfolioDir]                    # default mode
  node tests/portfolio/check-content.js [portfolioDir] --cv [cvDataJson]  # default + CV fidelity
  node tests/portfolio/check-content.js [portfolioDir] --cv=<cvDataJson>
  node tests/portfolio/check-content.js --help
  ```
  `portfolioDir` defaults to `<repo>/portfolio`. `cvDataJson` defaults to `<repo>/docs/portfolio-real-content/cv-data.en.json`. Exit codes: 0 = pass, 1 = a check failed, 2 = bad command line (unknown option, `--cv` given twice, extra positional argument).
- **Default mode (31 checks) reads nothing under `docs/`.** It checks: content.js loads; en/ar shape; meta lang/dir; `defaultLang` is "en"; ids match and are unique; at least 1 project, job, skill, certificate and language; a complete education block; skill name/description; certificate titles; required project fields; `contributions` is an array of non-empty strings; `challenge` is non-empty and in both languages or neither; both store keys are present (URL or `null`) and at least one is non-null; every non-null external URL is valid `http(s)`; the email is plain; the phone is `+<digits>`; `phoneDisplay` has the same digits; script.js builds `tel:`/`mailto:`; the asset paths exist; each project has its own image; the PDF sanity check; placeholders; i18n paths; no hard-coded HTML text; and the img alt.
- **`--cv` adds 9 checks (40 in total):** the CV JSON loads and has a 64-hex `_meta.sourceSha256`; counts equal the CV (derived from the JSON, no longer hard-coded); empty contributions, null store URLs and challenges appear only where the CV has them; all 37 URLs equal the CV; the email and phone equal the CV; the EN text equals the CV; the avatar is `.jpg`; and the PDF SHA-256 equals `_meta.sourceSha256`.
- `_meta.sourceSha256` was already present in `cv-data.en.json` with the expected value `6f6609a5…be147`, so the JSON was not edited. The hash no longer appears in the script.

## Files touched
- `tests/portfolio/check-content.js`: split into the two modes, with argument parsing and an updated header comment.
- `docs/portfolio-real-content/03-step-4-check-script.md`: this section.
- Nothing under `portfolio/` was touched; the developer is editing `README.md` and `styles.css` there. `cv-data.en.json` was not changed either.
- Throwaway files in `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\fix1\`:
  - `mutate.js`: the harness;
  - `no-docs-hook.js`: a `-r` preload that exits 3 on any fs access under `docs/`;
  - `out.txt` and `results.json`: the results;
  - `work\m00…m23`: the mutated copies;
  - `cv-no-sha.json` and `cv-bad-sha.json`: broken CV JSON copies.
- The pre-fix script is backed up at `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\scratchpad\check-content.before-fix1.js`.

## Decisions
| Decision | Reason |
|----------|--------|
| `--cv` takes an optional path. The next argument is used as the path unless it starts with `--`, and `portfolioDir` must come before `--cv`. `--cv=<path>` is also accepted | This matches the requested `--cv [path]` form without making it ambiguous. A misplaced positional argument gives exit 2 with the usage text, so it never silently switches modes. |
| `--cv` runs the default checks too | Fidelity on top of a malformed site is meaningless, and a single command gives the task's sign-off result. |
| CV counts are derived from the JSON instead of a hard-coded `EXPECTED_COUNTS` | The reviewer wanted all snapshot data in one place. Before this fix the script had a hard-coded count and a hash; now it has neither. |
| The phone keeps the stricter E.164 regex `^\+[1-9]\d{7,14}$` instead of the review's `^\+\d+$` | Every real phone in `+<digits>` form passes both regexes. The stricter one also catches `+0…` and numbers that are too short or too long. It has no tie to the CV. |
| A missing CV JSON, or a JSON without a valid `_meta.sourceSha256`, makes `--cv` fail loudly (1 failed check), and the remaining fidelity checks are skipped | With no source of truth, it should not report partial passes. The reason is printed. |
| The avatar `.jpg` check moved to `--cv` only | The README allows any image. `.jpg` is a property of the CV photo, not a generic rule. |
| A project with both store URLs `null` fails in default mode | The review lists "at least one is non-null" as a generic rule. |

## Verification
- Real site, run from `d:\try_agent_workflow` with Node v22.21.0:
  - `node tests/portfolio/check-content.js`: **31 passed, 0 failed, exit 0**.
  - `node tests/portfolio/check-content.js --cv`: **40 passed, 0 failed, exit 0**.
  - Default mode under `node -r no-docs-hook.js`: exit 0, so it touched nothing under `docs/`. With the same hook, `--cv` exits 3, which shows that the hook does catch docs reads.
- `node mutate.js` (output in `out.txt`): **37/37 cases behaved as expected**. Each mutation ran in both modes on its own scratch copy:

| Mutation | default | `--cv` | Reported failure |
|----------|---------|--------|------------------|
| control (re-serialized, unchanged) | 0 | 0 | none |
| one EN description edited | **0** | **1** | `en.projects[0].description … != CV …` |
| 13th project added (shared + en + ar, own SVG) | **0** | **1** | `shared.projects has 13, the CV has 12` |
| both of the above | **0** | **1** | counts + text |
| a certificate removed | **0** | **1** | `shared.certificates has 5, the CV has 6` |
| cv.pdf replaced (still a valid PDF) | **0** | **1** | SHA-256 `got a659bc9b…, expected 6f6609a5…` |
| avatar switched to `.png` | **0** | **1** | avatar is a .jpg |
| `ftp://` company URL | **1** | 1 | `alwsata.companyUrl -> "ftp://csskw.net/"` |
| project SVG deleted / cv.pdf deleted | **1** | 1 | `asset paths exist` |
| "Lorem ipsum" in en / "نص تجريبي" in ar | **1** | 1 | placeholder scan |
| `ar.ui.appStore` removed / an extra en-only contribution | **1** | 1 | `missing in ar` / `length 3 (en) vs 2 (ar)` |
| challenge removed in ar only | **1** | 1 | shape + challenge both-or-neither |
| both store URLs null / `appStoreUrl` key deleted | **1** | 1 | `has no store link at all` / `has no appStoreUrl key` |
| duplicate project id; empty skills list | **1** | 1 | ids unique / `skills.items is empty` |
| `mailto:` email; phone with spaces | **1** | 1 | email / phone format |
| two projects share one image; truncated PDF; hard-coded `<p>Hello</p>` | **1** | 1 | own image / `no %%EOF` / `text node: "Hello"` |

- CLI cases (all as expected):
  - `--cv`, `--cv <path>`, `--cv=<path>` and `<dir> --cv` each give 0.
  - `--cv <missing file>`, and a JSON without `sourceSha256`, each give 1 with "CV data loads" failed.
  - A JSON with a wrong `sourceSha256` gives 1 with only the SHA check failed, which shows the hash comes from the JSON.
  - `--foo` and `--cv --cv` give 2.
  - `--help` gives 0.

## Open questions / follow-ups
- No production-code failures were found.
- The developer's README part of B1 ("Check your edits" section) should give the commands above. It should say that default mode is the one to run after editing, and that `--cv` is expected to fail once the content is edited on purpose.
