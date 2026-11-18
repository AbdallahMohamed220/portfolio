# Requirements: Publish the project on GitHub and serve the portfolio on GitHub Pages

**Task id:** deploy-github-pages  
**Status:** approved

## Goal
Put the whole project on GitHub and publish the portfolio site on GitHub Pages, so the owner has a direct public link to share: **https://abdallahmohamed220.github.io/portfolio/**

## In scope
- Install the GitHub CLI (`gh`) on this machine with `winget`. The user runs `gh auth login` once, interactively; agents never handle credentials.
- Initialise a git repo at `d:\try_agent_workflow`, with one initial commit of the whole project:
  - `portfolio/`
  - `tests/`
  - `docs/`
  - `.claude/`
  - `CLAUDE.md`
  - `README.md`
  - a `.gitignore`
- Create a **public** repo `AbdallahMohamed220/portfolio` and push the `main` branch to it.
- Publish the site with GitHub Pages using **GitHub Actions**, because the site lives in `portfolio/` and not at the repo root. The workflow file is `.github/workflows/pages.yml`. It runs:
  1. `node tests/portfolio/check-content.js` (default mode), which must pass;
  2. an upload of `portfolio/` as the Pages artifact;
  3. the deploy.
- Enable Pages with Source = GitHub Actions, through `gh api` or the repo settings.
- Check the live site and give the user the direct link.

## Out of scope
- A custom domain.
- Changes to the site's content or design.
- Branch protection, releases or extra CI jobs, beyond the check that runs before deploy.
- Fixing the dead links in the CV PDF.

## Constraints
- No credentials or tokens are ever written to files, logs or docs.
- The repo must be public, because GitHub Pages on a free account needs that.
- Before anything is pushed, scan the files for secrets or tokens. The owner's email and phone are already shown publicly on the site.
- Asset paths must keep working under the `/portfolio/` sub-path. The site already uses relative paths, but this must be verified on the live URL.
- The commit author is the user's existing git identity. The commit message ends with the required Co-Authored-By line.

## Inputs / outputs
- **Input:** the current project folder, and the user's GitHub account `AbdallahMohamed220` (from the CV; confirmed during `gh auth login`).
- **Outputs:**
  - `.gitignore`
  - `.github/workflows/pages.yml`
  - the GitHub repo
  - a live Pages site
  - this task's docs

## Assumptions
- **GitHub account:** `AbdallahMohamed220` is the user's account. If `gh auth status` shows a different login, stop and ask.
- **Existing repo:** no repo named `portfolio` exists yet on that account. If one does, stop and ask; never overwrite it.
- **`.gitignore`:** it excludes OS and editor junk (`Thumbs.db`, `.DS_Store`, `.vscode/`) and `node_modules/`. Nothing in the project itself is excluded.
- **Local paths in `docs/`:** some step docs mention local scratchpad paths, such as `C:\Users\Evision\...`. They are harmless and stay as they are.
- **Root `README.md`:** it stays as is (it describes the agent workflow). Adding the live link to it is a small, acceptable change.

## Definition of done
- [ ] `gh auth status` shows the user logged in. No token appears in any file in the repo or in any doc.
- [ ] The public repo `https://github.com/AbdallahMohamed220/portfolio` exists, and its `main` branch has the whole project.
- [ ] A secret scan of the files committed before the push finds nothing.
- [ ] The Pages workflow ran successfully on GitHub, including the check-script step.
- [ ] `https://abdallahmohamed220.github.io/portfolio/` returns HTTP 200 and serves the portfolio.
- [ ] On the live URL, `content.js`, `script.js`, `styles.css`, `assets/avatar.jpg`, the project icons and `assets/cv.pdf` all return 200.
- [ ] A headless Chrome load of the live URL shows the real content with no console errors, and the EN/AR and theme toggles work.
- [ ] Download CV on the live site downloads the PDF, byte-identical to `portfolio/assets/cv.pdf`.
- [ ] The direct link is given to the user and recorded in `05-summary.md`.

## Q&A log
| Question | Answer |
|----------|--------|
| What should the link look like? | First `Abdallah-Mohamed`; changed to `portfolio` → https://abdallahmohamed220.github.io/portfolio/ |
| What gets uploaded? | The whole project (a public repo) |
| How do we log in to GitHub? | Install GitHub CLI; the user runs `gh auth login` |
| Should the repo be private? | The user first asked for a private repo named `portfolio`. They were told that Pages on a private repo needs GitHub Pro, and chose a **public** repo named `portfolio` instead. |
