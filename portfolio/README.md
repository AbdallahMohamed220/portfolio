# Personal portfolio

A single-page static portfolio site in English and Arabic. It is plain HTML, CSS and JavaScript, with no framework, no npm and no build step.

```
portfolio/
├── index.html      page structure
├── styles.css      themes, layout, RTL, animations
├── script.js       renders the content, toggles, animations
├── content.js      ALL text, links and image paths (edit this file)
└── assets/
    ├── avatar.jpg                   hero photo (also the favicon)
    ├── cv.pdf                       the resume served by "Download CV"
    ├── project-<id>-icon.<png|jpg>  real store app icons (6 files):
    │   project-alriyadh-app-icon.png,
    │   project-waste-transportation-request-icon.png,
    │   project-home-experience-icon.png, project-alwsata-employees-icon.png,
    │   project-alwsata-real-estate-icon.jpg, project-bedayat-icon.jpg
    └── project-<id>.svg             letter icons for apps with no store icon (6 files):
        project-taher.svg, project-fix-infinity.svg, project-al7feaz.svg,
        project-doctorcrypto.svg, project-chkchk.svg, project-messayel.svg
```

## Open the site locally

Double-click `index.html`, or open it from your browser with *File → Open*. No server is needed, because `content.js` is a plain script and the site does not use `fetch`.

If you prefer a local server, any static server works, for example `python -m http.server` run inside `portfolio/`, and then open <http://localhost:8000>.

The theme (dark/light) and language (EN/AR) choices are saved in the browser's `localStorage`, so they persist after a reload. On the first visit, the theme follows the system setting and the language is `shared.defaultLang` (English). To reset, clear the site data in your browser (DevTools → Application → Local Storage).

**"Download CV" over `file://`:** when you open the page straight from disk, Chrome ignores the link's `download` attribute and opens `cv.pdf` in the tab instead. This is expected. On a local server or a static host (GitHub Pages, Netlify) the same link downloads the file.

## Edit the content (`content.js`)

You only need to edit `content.js` to change the text, links and images. Don't edit `index.html` for content.

The file sets one object, `window.PORTFOLIO_CONTENT`, with three blocks:

```js
window.PORTFOLIO_CONTENT = {
  shared: { ... },  // the same in every language: links, image paths, URLs
  en:     { ... },  // English text
  ar:     { ... }   // Arabic text (same keys as en)
};
```

### `shared`

| Key | What it is |
|-----|------------|
| `defaultLang` | Language on the first visit (`"en"`). |
| `links.email` | Plain address, without `mailto:` (the page adds it). |
| `links.phone` | International number with no spaces, for example `"+201147234230"`, without `tel:` (the page adds it). The visible text is `contact.phoneDisplay`. |
| `links.github`, `links.linkedin`, `links.stackoverflow` | Full profile URLs. |
| `links.cv` | Path of the CV file, `"assets/cv.pdf"`. |
| `images.avatar` | Path of the hero photo, `"assets/avatar.jpg"`. It is also used as the favicon in `index.html`. |
| `projects[]` | `{ id, image, googlePlayUrl, appStoreUrl }` for each project. `image` is the project icon: `"assets/project-<id>-icon.png"` (or `.jpg`) for a real store icon, or `"assets/project-<id>.svg"` for a letter icon. A store URL can be `null`: the page then hides that store's button, and a card with both URLs `null` has no store row. Keep the key even when it is `null`. |
| `experience[]` | `{ id, companyUrl }` for each job. The company name on the page links to `companyUrl`. |
| `certificates[]` | `{ id, url }` for each certificate. The certificate title on the page links to `url`. |

### `en` and `ar`

Both blocks have exactly the same keys. Change only the text values.

| Key | Contents |
|-----|----------|
| `meta` | `lang`, `dir` (`"ltr"` / `"rtl"`, leave these as they are), `title` (browser tab), `description` (meta description). |
| `nav` | `label` (screen-reader name of the menu), `about`, `projects`, `skills`, `education`, `certificates`, `contact` (one link per section, in page order). |
| `ui` | `skipLink`, `menuOpen`, `menuClose`, `themeToDark`, `themeToLight`, `langToggle` (name of the *other* language, written in that language), `langToggleLabel` (screen-reader name of the language button, in that same other language; it must contain the `langToggle` text), `downloadCv`, `projectDetails` (summary text of the collapsible block on each project card), `keyContributions`, `keyChallenge` (headings inside that block), `googlePlay`, `appStore` (store button labels). |
| `hero` | `greeting`, `name`, `role`, `location`, `tagline`, `avatarAlt`, `ctaProjects`, `ctaContact`. |
| `about` | `title`, `paragraphs` (a list of strings, one per paragraph). |
| `projects` | `title`, `intro`, `items[]` with `{ id, title, period, role, tech, description, contributions[], challenge, imageAlt }`. `challenge` is optional (see the rules below). |
| `skills` | `title` (section heading), `skillsTitle`, `items[]` with `{ name, description }`. |
| `experience` | `title`, `appsLabel` (heading of the apps list), `items[]` with `{ id, company, role, period, location, apps[] }`. |
| `education` | `title`, `degree`, `institution`, `period`. |
| `certificates` | `title`, `items[]` with `{ id, title }`. |
| `languages` | `title`, `items[]` (a list of strings, one per language). |
| `contact` | `title`, `intro`, `emailLabel`, `phoneLabel`, `phoneDisplay` (the number as visitors see it, for example `"+20 114 723 4230"`), `githubLabel`, `linkedinLabel`, `stackoverflowLabel`. |
| `footer` | `text`. |

The page has six sections, each with a nav link, in this order:

1. **About** (hero and `about`)
2. **Projects** (`projects`)
3. **Skills & Experience** (`skills`, `experience` and `languages`)
4. **Education** (`education`)
5. **Certificates** (`certificates`)
6. **Contact** (`contact`)

Below 1024px wide, the nav links are in the menu button (hamburger).

### Rules

- When you change text in `en`, make the same change in `ar`, and the other way round. Keep the keys and the list lengths the same in both.
- Projects, jobs and certificates are matched by `id`. The URLs live once in `shared`, and the text lives in `en` and `ar`:
  - To **add a project**, add `{ id, image, googlePlayUrl, appStoreUrl }` to `shared.projects` and an icon in `assets/` (see *Project images* below), then add an item with the same `id` to both `en.projects.items` and `ar.projects.items`. To remove one, delete it from all three places (and delete its icon).
  - To **add a job**, add `{ id, companyUrl }` to `shared.experience` and an item with the same `id` to both `en.experience.items` and `ar.experience.items`.
  - To **add a certificate**, add `{ id, url }` to `shared.certificates` and `{ id, title }` with the same `id` to both `en.certificates.items` and `ar.certificates.items`.
- Projects are shown in the order of `shared.projects` (newest first). Keep the `en` and `ar` items in the same order.
- **Store links:** set a store URL to `null` when the CV has no link for that store, or when the listing is dead (a short link that no longer resolves, a Google Play listing that returns 404, or an App Store id that the iTunes lookup no longer finds). The dead links and their evidence are recorded in `docs/project-store-icons/dead-links.json`. Don't delete the key and don't use an empty placeholder URL. If an app comes back, put its URL back.
- **Contributions:** `contributions` is a list of strings. An empty list (`[]`) is allowed; the card then hides the contributions block.
- **Challenge:** `challenge` is optional. Add it only to projects that have one, and add it in **both** `en` and `ar`, or in neither. If a project has no contributions and no challenge, the card shows no "details" block at all.
- Lists such as `about.paragraphs`, `contributions`, `skills.items`, `experience.items`, `apps`, `certificates.items` and `languages.items` can be any length, as long as `en` and `ar` match.
- Keep app, company and technology names in Latin script in `ar` too.
- Keep the file valid JavaScript: put strings in quotes, put commas between items, and escape a double quote inside a string as `\"`.
- After you save, reload the page. If the page is blank or a section is empty, open the browser console (F12) to find the syntax error.

## Replace the CV and images

- **CV:** `assets/cv.pdf` is the real resume PDF, served as it is. To update it, replace the file with the new PDF and keep the same name. If you use another name, update `shared.links.cv`. Over `file://` Chrome opens it in the tab; on a static host it downloads (see *Open the site locally*).
- **Avatar:** the hero photo is `assets/avatar.jpg` (400×400). To change it, replace that file, or put a new file in `assets/` and set `shared.images.avatar` to its path (the favicon in `index.html` also points to `assets/avatar.jpg`). Update `hero.avatarAlt` in **both** `en` and `ar`.
- **Project images:** a project with a store listing uses its real app icon, downloaded from Google Play or the App Store and saved as `assets/project-<id>-icon.png` or `.jpg` (square, 384–512px, 100 KB or less). Projects with no store icon use a letter SVG, `assets/project-<id>.svg` (128×128, the project's initial on its own colour). Images are always local files; never link to an image on a store's server. To change one, replace the file with a square image, or put a new image in `assets/` and set `image` on the matching entry in `shared.projects`; then delete the old file if nothing uses it. Update `imageAlt` on the matching item in **both** `en.projects.items` and `ar.projects.items`.
- **Alt text** should describe what the image shows (for example "Alriyadh App icon"), not just repeat the file name. Every image needs it in both languages.
- Paths are relative to `index.html`. File names are case-sensitive on GitHub Pages and Netlify, so `Avatar.JPG` is not the same as `avatar.jpg`.
- Keep images reasonably small (a few hundred KB at most). Project icons are shown at 56px as a rounded square, so use a square image; raster icons get a white tile and a thin border so white or transparent backgrounds also look right in the dark theme.

## Check your edits

After you edit `content.js` or replace a file in `assets/`, run the check script from the repository root (it needs only Node, no npm packages):

```
node tests/portfolio/check-content.js                      # default mode
node tests/portfolio/check-content.js --cv                 # default + CV snapshot
node tests/portfolio/check-content.js --cv path/to/cv.json # CV mode with another snapshot file
node tests/portfolio/check-content.js --cv=path/to/cv.json # the same, in one argument
node tests/portfolio/check-content.js --cv --dead-links path/to/dead-links.json  # CV mode with another dead-links record
node tests/portfolio/check-content.js --help               # print usage
```

You can pass another site folder as an optional first argument (`portfolioDir`, default `portfolio`). It must come **before** `--cv`, because the argument right after `--cv` is read as the snapshot path.

It prints one line per check. Exit codes: `0` means every check passed, `1` means at least one check failed, and `2` means the command line was wrong.

### Default mode

The default mode reads nothing under `docs/`, and it only checks rules that hold for any content you write:

- **Structure:** `content.js` loads and has `shared`, `en` and `ar`; projects, jobs, skills, certificates and languages each have at least one item; education is complete; each project has its required fields, and `challenge` is in both languages or in neither.
- **EN/AR parity:** `en` and `ar` have the same keys and list lengths, and their item `id`s match `shared` in the same order.
- **Store links:** every project has both keys, `googlePlayUrl` and `appStoreUrl`. Each one is a URL or `null`. Both may be `null`; that project's card then has no store buttons.
- **Links:** every store, company, certificate and profile URL that is not `null` is a valid `http(s)` URL; the email has no `mailto:`; the phone is `+` and digits, and `phoneDisplay` has the same digits.
- **Assets:** every path in `content.js` and `index.html` exists, each project has its own image, and the CV file looks like a valid PDF.
- **Images:** every image is a local file. Image paths in `content.js` are relative paths under `assets/`, and neither `index.html` nor `styles.css` loads an image from another site. Each project image is 100 KB or less.
- **No unused files:** every file in `assets/` is used by `content.js` or `index.html`. When you replace an icon, delete the old file.
- **Placeholders:** no leftover placeholder text such as `example.com` or "lorem ipsum", in either language.
- **No hard-coded text:** every `data-i18n` key in `index.html` exists in both languages, and `index.html` has no visible text of its own.

So editing text, adding or removing projects, jobs or certificates, replacing `assets/cv.pdf` and changing the avatar all keep the check green, as long as the content stays well-formed.

### CV mode (`--cv`)

`--cv` runs everything above and also compares the site with the original CV snapshot taken when this content was first filled in, `docs/portfolio-real-content/cv-data.en.json` (or the file you pass after `--cv`). It checks the exact counts, the URLs, the English text, the `.jpg` avatar and the hash of `assets/cv.pdf` against that snapshot. It is a record of that task, not a rule for the live site.

The CV's dead store links are recorded in `docs/project-store-icons/dead-links.json` (or the file you pass with `--dead-links`). A store URL that is `null` on the site but present in the CV passes only if that file has an entry with the same `projectId`, `store` and `cvUrl`. Every entry must also match a CV link that the site sets to `null`. If the file is missing or broken, `--cv` fails.

**`--cv` is expected to fail after you edit the content on purpose**, for example when you change text, add or remove a project, replace `cv.pdf` with a new PDF, or switch to an avatar that is not a `.jpg`. Default mode should still pass after those edits, so use default mode to check your own changes.

## Deploy

There is no build step. Upload the contents of `portfolio/` as they are.

### GitHub Pages

GitHub Pages has two publishing sources. Pick one under *Settings → Pages → Build and deployment → Source*.

**Option A: Deploy from a branch.** A branch deploy can only serve the repository root (`/`) or `/docs`, not `portfolio/`.

1. Put the contents of `portfolio/` (not the folder itself) in the root of a repository or branch, or in its `/docs` folder.
2. Push it to GitHub.
3. In *Source*, choose *Deploy from a branch*, then pick the branch and the folder (`/ (root)` or `/docs`). Save.

**Option B: GitHub Actions.** This serves `portfolio/` straight from this repository.

1. Push the repository to GitHub.
2. In *Source*, choose *GitHub Actions*, then pick the *Static HTML* workflow and commit it.
3. In the workflow file, set the `path` of the `actions/upload-pages-artifact` step to `portfolio`, and commit. Each push to the default branch then redeploys the site.

With either option, the site is live after a minute or two at `https://<user>.github.io/<repo>/` (or `https://<user>.github.io/` for a repository named `<user>.github.io`). The *Actions* tab shows each deploy.

### Netlify

- **Drag and drop:** log in to Netlify, open *Sites*, and drop the `portfolio/` folder onto the deploy area.
- **Connected repository:** choose *Add new site → Import an existing project*, pick the repository, and set:
  - **Base directory:** `portfolio`
  - **Build command:** leave empty
  - **Publish directory:** `portfolio` (or `.` if Netlify shows it relative to the base directory)

Each push to the connected branch redeploys the site.
