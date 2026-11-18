# Step 3: Update the README

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
Rewrote the out-of-date parts of `portfolio/README.md` to match the `content.js` schema and assets from Step 2 (`03-step-2-site-update.md`). I also applied review notes S1 and S2.

- **File tree:** lists `avatar.jpg` (also the favicon), `cv.pdf` and all 12 `project-<id>.svg` icons by name. The deleted `avatar.svg` and `project-1/2/3.svg` are no longer mentioned.
- **`shared` table:**
  - New rows: `links.phone` (no `tel:`, with `contact.phoneDisplay` as the visible text), `links.stackoverflow`, `experience[]` `{ id, companyUrl }` and `certificates[]` `{ id, url }`.
  - `projects[]` is now `{ id, image, googlePlayUrl, appStoreUrl }`. A store URL may be `null`, which hides that button, and the key stays.
  - `images.avatar` is `"assets/avatar.jpg"`.
- **`en`/`ar` table:**
  - New `ui` labels: `projectDetails`, `keyContributions`, `keyChallenge`, `googlePlay` and `appStore`.
  - New `hero.location`.
  - The project item fields are now `period`, `role`, `tech`, `contributions[]` and the optional `challenge`. `tags`, `demoLabel` and `sourceLabel` are gone.
  - `skills.items[]` is `{ name, description }`.
  - `experience` has `appsLabel` and items `{ id, company, role, period, location, apps[] }`.
  - New rows for `education`, `certificates` and `languages`.
  - `contact` has `phoneLabel`, `phoneDisplay` and `stackoverflowLabel`.
- **Rules:**
  - Projects, jobs and certificates are joined by `id`. There are add/remove steps for each.
  - Order is the order of `shared.projects`, newest first.
  - Store links: use `null`, never a placeholder.
  - An empty `contributions` list is allowed and hides the block.
  - `challenge` is optional and must be in both `en` and `ar`, or in neither. With no contributions and no challenge, no details block is shown.
  - Names stay in Latin script in `ar`.
- **Replace the CV and images:**
  - The CV is the real resume.
  - The avatar is `avatar.jpg` at 400×400, and the favicon points at it too.
  - The project icons are 128×128 SVGs shown at 56px.
  - The alt text example is now the real `"Alriyadh App icon"`.
  - The placeholder size note was removed.
- **S1:** a note under *Open the site locally* (and a pointer to it from the CV bullet). Over `file://`, Chrome ignores `download` and opens `cv.pdf` in the tab. On a local server or static host, it downloads.
- **S2:** the GitHub Pages section now has two options:
  - **A, Deploy from a branch:** only `/` or `/docs` is served, so the contents of `portfolio/` go there.
  - **B, GitHub Actions:** use the *Static HTML* workflow with the `upload-pages-artifact` `path` set to `portfolio`.
  - A shared "live at" line covers both options. The `your-username` placeholder became `<user>`.

## Files touched
- `portfolio/README.md`: updated as described above. No other project file was edited. `tests/portfolio/check-content.js` was left to Step 4.

## Decisions
| Decision | Reason |
|----------|--------|
| List all 12 icon file names in the tree, not just a pattern | The Done-when check needs every file name in the README to exist. Listing them all also makes the assets easy to audit. |
| Document `challenge` inside the `projects` row and add a rule for it | The row lists every field, and the both-or-neither rule needs a full sentence. |
| Put the S1 note in *Open the site locally*, with a short pointer from the CV bullet | The behaviour depends on how the page is opened, so it belongs with the instructions for opening it. |
| Replace `your-username` with `<user>` | It is clearly a template, and it does not look like a leftover placeholder string, which the Step 4 checks look for in content. |
| Keep the Netlify section unchanged | It was still correct, and the step's scope is the schema, assets, S1 and S2. |

## Verification
- Ran `node …\scratchpad\step3\verify-readme.js D:/try_agent_workflow/portfolio` (Node v22.21.0). Result: **213 passed, 0 failed**. It checks:
  - every file name in the README (`*.svg/jpg/pdf/html/css/js`) exists in `portfolio/` or `portfolio/assets/`. The only exceptions are the `Avatar.JPG` case-sensitivity example and the `project-<id>.svg` template;
  - every file in `assets/` is named in the README;
  - none of these removed names appear: `avatar.svg`, `project-1/2/3.svg`, `demoUrl`, `sourceUrl`, `demoLabel`, `sourceLabel`, `groups`, `tags[]`;
  - every `shared.`/`en.`/`ar.` key path in backticks resolves in `content.js`;
  - every `shared` key, every `shared.links.*` key and every field of `shared.projects/experience/certificates[]` is documented;
  - every top-level `en`/`ar` key has a table row, and every sub-key and item key (including the optional `challenge`) is named in that row;
  - the values quoted in the README match `content.js`: phone `"+201147234230"`, `"+20 114 723 4230"`, `"assets/avatar.jpg"`, `"assets/cv.pdf"`, `"Alriyadh App icon"` and `"en"`;
  - the rules for `null` store URLs, empty `contributions` and optional `challenge` are present, and the content really has those cases (DoctorCrypto, Bedayat, and 3 of 12 projects with a challenge);
  - the S1 note and both S2 options are present.
- **Mutation check:** I ran the same script on a scratch copy with these changes: `avatar.svg` added, `phoneLabel` removed and `links.stackOverflow` misspelled. It reported 4 failures and exit code 1, so the checks do catch drift. I deleted the copy afterwards.
- Not verified: the GitHub Pages UI labels against a live GitHub account. The wording follows GitHub's current *Source: Deploy from a branch / GitHub Actions* options.

## Open questions / follow-ups
- None.

## Review fix 1 (B1: document the check script)

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

### What was done
Added a "Check your edits" section to `portfolio/README.md`, between "Replace the CV and images" and "Deploy". Before this, the README never mentioned the check script, so the owner's first edit would hit failures with no explanation (`04-review.md` B1).

### Files touched
- `portfolio/README.md`: new "Check your edits" section, with "Default mode" and "CV mode (`--cv`)" subsections. It covers:
  - the tester's final CLI, run from the repo root: default mode, `--cv`, `--cv <path>`, `--cv=<path>` and `--help`;
  - the optional `portfolioDir` argument, which must come before `--cv`;
  - exit codes 0 (pass), 1 (a check failed) and 2 (bad command line);
  - what default mode checks: structure, EN/AR parity, links, assets, placeholders and no hard-coded text. It reads nothing under `docs/` and stays green after deliberate edits;
  - what `--cv` adds: the counts, URLs, EN text, `.jpg` avatar and CV hash are compared against `docs/portfolio-real-content/cv-data.en.json`. It is expected to fail after deliberate edits (different text, a different number of projects, a new `cv.pdf`, a non-`.jpg` avatar), while default mode still passes.

### Decisions
| Decision | Reason |
|----------|--------|
| Wrote the CLI exactly as the coordinator relayed it from the tester's finished `--cv` flag, and checked it against the script's `--help` output and header comment | The README has to match the real default/CV split. |
| Placed the section after the editing and replacing sections | The owner runs it after they edit or replace files. |
| Wrote "it needs only Node" instead of "Node.js" | The Step 3 audit script treats `*.js` words as file names. |

### Verification
- Ran each documented form from `d:	ry_agent_workflow` against the tester's finished script:

  | Command | Result |
  |---------|--------|
  | default mode | exit 0, 31 passed |
  | `--cv` | exit 0, 40 passed |
  | `--cv docs/portfolio-real-content/cv-data.en.json` | 40 passed, exit 0 |
  | `--cv=docs/portfolio-real-content/cv-data.en.json` | 40 passed |
  | `portfolio --cv` | 40 passed |
  | `--help` | prints usage, exit 0 |
  | `--bogus` | exit 2 |

- Re-ran Step 3's `verify-readme.js`: 213 passed, 1 failed. The failure is "file named in README does not exist: check-content.js". It is a false positive, because the audit only looks in `portfolio/`, and the file exists at `tests/portfolio/check-content.js`. `docs/portfolio-real-content/cv-data.en.json` also exists.

### Open questions / follow-ups
- None.
