# Step 4: README

**Agent:** developer  
**Skills used:** step-docs  
**Status:** done

## What was done
- Wrote `portfolio/README.md`. It has these sections:
  - **Folder layout:** the site files and `assets/`.
  - **Open locally:** double-click `index.html` (no server needed), or use an optional `python -m http.server`. It says that the theme and language are saved in `localStorage`, describes the first-visit defaults (system theme, English) and explains how to reset them.
  - **Edit the content:** the `shared` / `en` / `ar` structure. There are key tables for `shared` and for each language block. Every key comes from Step 1's schema and from `content.js`.
  - **Rules for editing:** keep the `en` and `ar` keys and list lengths the same; add or remove a project in three places, matched by `id`; keep the file valid JS; use the console when the page breaks.
  - **Replace the CV and images:** `shared.links.cv`, `shared.images.avatar`, `shared.projects[].image`, plus `hero.avatarAlt` and `projects.items[].imageAlt` in both languages. Also guidance on alt text, file names being case-sensitive on hosts, and image sizes.
  - **Deploy:** GitHub Pages (branch deploy only serves `/` or `/docs`, so use a separate repo root or an Actions upload path of `portfolio`), and Netlify (drag-and-drop, or a connected repo with base `portfolio`, an empty build command and the publish directory).

## Files touched
- `portfolio/README.md` — new.

## Decisions
| Decision | Reason |
|----------|--------|
| The README does not name the `localStorage` key names | Step 3 (`script.js`) chooses them and has not run yet. Telling users to clear the site data stays correct whatever the key names are. |
| Do not describe element ids or classes from `index.html` / `styles.css` | Step 2 is running in parallel, and users should not edit those files to change content. |
| Mention the GitHub Pages limit of `/` or `/docs` and give two options | The site lives in `portfolio/`, which branch deploy cannot serve directly. The repo's `docs/` folder holds workflow docs, so `/docs` is not an option. |
| Give the Netlify publish directory as `portfolio` or `.` | The Netlify UI shows it either relative to the repo or relative to the base directory, depending on the version. |
| Add an optional local server command | It is not needed (`file://` works), but it helps if a browser restricts `localStorage` on `file://`. |

## Verification
- With Node, I loaded `content.js` through `vm` and collected every key in the object. Then I pulled every identifier out of the README's inline code spans, leaving out fenced blocks and file paths, and compared the two lists. Of the 61 identifiers, 56 are real keys. The other 5 (`fetch`, `localStorage`, `window`, `io` from `github.io`, and the folder name `portfolio`) aren't content keys, and they're meant to be there. No key named in the README is missing from `content.js`.
- I confirmed that the asset paths named in the README exist: `assets/cv.pdf`, `assets/avatar.svg` and `assets/project-1.svg` through `assets/project-3.svg`.
- I checked the coverage against the last DoD item. The README covers editing content, replacing the CV and images, and deploying to GitHub Pages and Netlify.
- Not verified: I did not run the deploy steps on real GitHub Pages or Netlify accounts. Deployment is out of scope.

## Open questions / follow-ups
- After Step 3, check that `script.js` really falls back to the system theme and to `shared.defaultLang` as the README says. If `script.js` ignores `defaultLang`, fix the README's `shared` table.
- The folder tree describes `index.html`, `styles.css` and `script.js` in one line each. Step 2 or Step 3 may want to adjust those descriptions.
