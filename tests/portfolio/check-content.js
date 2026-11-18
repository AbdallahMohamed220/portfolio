#!/usr/bin/env node
/*
 * Static checks for the portfolio site (no dependencies, Node >= 14).
 *
 * Usage (run from the repo root):
 *   node tests/portfolio/check-content.js [portfolioDir]
 *   node tests/portfolio/check-content.js [portfolioDir] --cv [cvDataJson]
 *   node tests/portfolio/check-content.js [portfolioDir] --cv=<cvDataJson>
 *   node tests/portfolio/check-content.js [portfolioDir] --cv [cvDataJson] --dead-links <deadLinksJson>
 *   node tests/portfolio/check-content.js --help
 *
 * portfolioDir defaults to <repo>/portfolio. It must come before --cv,
 * because the argument right after --cv (if it does not start with "--") is
 * taken as the CV data path.
 * Exit code 0 = all checks pass, 1 = at least one check failed,
 * 2 = bad command line.
 *
 * DEFAULT MODE (no flag) reads nothing under docs/. It checks rules that hold
 * for any content the owner writes, so editing text, adding or removing
 * projects/jobs/certificates, replacing assets/cv.pdf or changing the avatar
 * keeps it green as long as the content stays well-formed:
 *   1. content.js loads as a plain script and defines window.PORTFOLIO_CONTENT
 *      with `shared`, `en` and `ar`.
 *   2. `en` and `ar` have exactly the same structure (same object keys, same
 *      array lengths, same value types, all string leaves non-empty); meta
 *      lang/dir; defaultLang is "en".
 *   3. Item ids in en/ar match `shared.projects`, `shared.experience` and
 *      `shared.certificates`, in the same order; shared ids are unique.
 *   4. At least 1 project, job, skill, certificate and language; a complete
 *      education block; every skill has name + description; every
 *      certificate has a title.
 *   5. Project fields: title, period, role, tech, description, imageAlt;
 *      `contributions` is an array of non-empty strings (may be empty);
 *      `challenge` is non-empty and in both languages or in neither; both
 *      store URL keys exist (string or null). Both may be null: the card then
 *      has no store row (a project whose listings are gone).
 *   6. Every non-null external URL (store, company, certificate, GitHub,
 *      LinkedIn, Stack Overflow) is a valid http(s) URL.
 *   7. Contact: email is a plain address (no mailto:), phone is +<digits>
 *      (E.164, the tel: form), phoneDisplay has the same digits in en and ar,
 *      script.js builds "mailto:" and "tel:" hrefs.
 *   8. Every asset path (content.js and local src/href in index.html) exists;
 *      every project has its own image.
 *   9. The CV file (links.cv, default assets/cv.pdf) passes a PDF sanity
 *      check: %PDF-x.y header, %%EOF in the last 1024 bytes, size >= 10 KB.
 *  10. No placeholder text (example.com, your-username, lorem ipsum,
 *      "placeholder", old placeholder asset names, ...) in content.js data
 *      or index.html, in either language.
 *  11. Every data-i18n / data-i18n-aria-label path in index.html, and every
 *      literal text(t, "...") path in script.js, resolves to a string in
 *      every language.
 *  12. index.html has no hard-coded visible text (only <title>Portfolio</title>
 *      is allowed) and every <img> gets its alt from script.js.
 *  13. Images are local files only: every image path in content.js is a
 *      relative path under assets/, index.html loads no image or icon from
 *      an absolute URL, and styles.css has no remote url(...).
 *  14. Every project image is 100 KB (102400 bytes) or less.
 *  15. Every file under assets/ is used (by content.js or index.html).
 *
 * CV MODE (--cv [path], default path
 * <repo>/docs/portfolio-real-content/cv-data.en.json) runs everything above
 * plus fidelity checks against that CV extract, a snapshot taken by task
 * `portfolio-real-content`. It is expected to FAIL once the owner edits the
 * content on purpose. All snapshot data (counts, URLs, EN text, PDF hash)
 * comes from the JSON; nothing is hard-coded here.
 *  C1. The CV data file loads.
 *  C2. Exact counts equal the CV (projects, jobs, skills, certificates,
 *      languages).
 * CV mode also loads the dead-links record (default
 * <repo>/docs/project-store-icons/dead-links.json, override with
 * --dead-links <path> or --dead-links=<path>; only valid together with --cv).
 * It lists the CV store links that are dead and were set to null on the site.
 * A missing or malformed file is a FAIL, and then no null is excused.
 *  C1b. The dead-links file loads: an array of
 *      { projectId, store: "googlePlay"|"appStore", cvUrl, evidence }.
 *  C3. contributions lengths, null store URLs and challenges appear only
 *      where the CV has them. A null store URL where the CV has a link is
 *      allowed only if a dead-links entry matches its projectId, store and
 *      the CV's URL (cvUrl).
 *  C4. Every store, company, certificate and profile URL equals the CV, with
 *      the same dead-links exception for null store URLs.
 *  C4b. Every dead-links entry names a real CV store link (projectId, store,
 *      cvUrl) that the site shows as null, with no duplicates.
 *  C5. email equals contact.email, phone equals contact.phoneInternational.
 *  C6. The EN text equals the CV (name, role, location contains the CV
 *      location, profile paragraph, projects, jobs, skills, education,
 *      certificate titles, languages).
 *  C7. The avatar is a .jpg.
 *  C8. The CV PDF's SHA-256 equals _meta.sourceSha256.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const REPO = path.join(__dirname, "..", "..");
const DEFAULT_CV_DATA = path.join(REPO, "docs", "portfolio-real-content", "cv-data.en.json");
const DEFAULT_DEAD_LINKS = path.join(REPO, "docs", "project-store-icons", "dead-links.json");
const LANGS = ["en", "ar"];
const MIN_CV_BYTES = 10 * 1024;
const MAX_PROJECT_IMAGE_BYTES = 100 * 1024;
const STORE_KEYS = { googlePlayUrl: "googlePlay", appStoreUrl: "appStore" };

const USAGE =
  "Usage: node tests/portfolio/check-content.js [portfolioDir] [--cv [cvDataJson]] [--dead-links <deadLinksJson>]\n" +
  "  default mode: generic checks only (reads nothing under docs/)\n" +
  "  --cv        : also compare with the CV extract (default " + path.relative(process.cwd(), DEFAULT_CV_DATA) + ")\n" +
  "  --dead-links: with --cv, the record of dead CV store links that may be null on the site\n" +
  "                (default " + path.relative(process.cwd(), DEFAULT_DEAD_LINKS) + ")";

/* ---------- command line ---------- */

function parseArgs(argv) {
  const out = { dir: null, cv: null, deadLinks: null, help: false, error: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--dead-links") {
      if (out.deadLinks) return Object.assign(out, { error: "--dead-links given twice" });
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) return Object.assign(out, { error: "--dead-links needs a path" });
      out.deadLinks = next;
      i++;
    } else if (a.startsWith("--dead-links=")) {
      if (out.deadLinks) return Object.assign(out, { error: "--dead-links given twice" });
      out.deadLinks = a.slice("--dead-links=".length);
      if (!out.deadLinks) return Object.assign(out, { error: "--dead-links= needs a path" });
    }
    else if (a === "--cv") {
      if (out.cv) return Object.assign(out, { error: "--cv given twice" });
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out.cv = next;
        i++;
      } else out.cv = DEFAULT_CV_DATA;
    } else if (a.startsWith("--cv=")) {
      if (out.cv) return Object.assign(out, { error: "--cv given twice" });
      out.cv = a.slice(5);
      if (!out.cv) return Object.assign(out, { error: "--cv= needs a path" });
    } else if (a.startsWith("-")) return Object.assign(out, { error: "unknown option " + a });
    else if (out.dir === null) out.dir = a;
    else return Object.assign(out, { error: "unexpected argument " + a + " (put portfolioDir before --cv)" });
  }
  if (!out.error && out.deadLinks && !out.cv) out.error = "--dead-links only works together with --cv";
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(USAGE);
  process.exit(0);
}
if (args.error) {
  console.error("Error: " + args.error + "\n" + USAGE);
  process.exit(2);
}

const DIR = path.resolve(args.dir || path.join(REPO, "portfolio"));
const CV_MODE = args.cv !== null;
const CV_DATA = CV_MODE ? path.resolve(args.cv) : null;
const DEAD_LINKS = CV_MODE ? path.resolve(args.deadLinks || DEFAULT_DEAD_LINKS) : null;

let passed = 0;
let failed = 0;

function check(cond, name, details) {
  cond = !!cond;
  if (cond) {
    passed++;
    console.log("PASS  " + name);
  } else {
    failed++;
    console.log("FAIL  " + name);
    (Array.isArray(details) ? details : details ? [details] : []).forEach((d) => console.log("        - " + d));
  }
  return cond;
}

function readText(rel) {
  return fs.readFileSync(path.join(DIR, rel), "utf8");
}

function pick(obj, dotPath) {
  return dotPath.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim() !== "";
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function j(v) {
  return JSON.stringify(v);
}

console.log("Mode:          " + (CV_MODE ? "default + CV fidelity (--cv)" : "default (generic checks only)"));
console.log("Portfolio dir: " + DIR);
if (CV_MODE) console.log("CV data:       " + CV_DATA);
if (CV_MODE) console.log("Dead links:    " + DEAD_LINKS);
console.log("");

/* ---------- 1. load content.js ---------- */

let content = null;
try {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readText("content.js"), sandbox, { filename: "content.js" });
  content = sandbox.window.PORTFOLIO_CONTENT;
  check(
    content && typeof content === "object" && content.shared && LANGS.every((l) => content[l]),
    "content.js defines window.PORTFOLIO_CONTENT with shared, en, ar"
  );
} catch (e) {
  check(false, "content.js loads as a plain script", String(e && e.message));
}

if (!content || !content.shared || !LANGS.every((l) => content[l])) {
  console.log("\nCannot continue without content. " + passed + " passed, " + (failed || 1) + " failed.");
  process.exit(1);
}

const sh = content.shared;
const links = sh.links || {};

/* ---------- 2. en / ar structure ---------- */

function compareShape(a, b, where, out) {
  const ta = a === null ? "null" : Array.isArray(a) ? "array" : typeof a;
  const tb = b === null ? "null" : Array.isArray(b) ? "array" : typeof b;
  if (ta !== tb) {
    out.push(where + ": type " + ta + " (en) vs " + tb + " (ar)");
    return;
  }
  if (ta === "array") {
    if (a.length !== b.length) out.push(where + ": length " + a.length + " (en) vs " + b.length + " (ar)");
    for (let i = 0; i < Math.min(a.length, b.length); i++) compareShape(a[i], b[i], where + "[" + i + "]", out);
  } else if (ta === "object") {
    const ka = Object.keys(a), kb = Object.keys(b);
    ka.filter((k) => !(k in b)).forEach((k) => out.push(where + "." + k + ": missing in ar"));
    kb.filter((k) => !(k in a)).forEach((k) => out.push(where + "." + k + ": missing in en"));
    ka.filter((k) => k in b).forEach((k) => compareShape(a[k], b[k], where + "." + k, out));
  } else if (ta === "string") {
    if (!a.trim()) out.push(where + ": empty string in en");
    if (!b.trim()) out.push(where + ": empty string in ar");
  } else {
    out.push(where + ": unexpected " + ta + " value (only strings, arrays and objects allowed)");
  }
}

const shapeDiffs = [];
compareShape(content.en, content.ar, "", shapeDiffs);
check(shapeDiffs.length === 0, "en and ar have the same keys, array lengths and non-empty strings", shapeDiffs);

LANGS.forEach((l) => {
  const m = content[l].meta || {};
  check(m.lang === l && (m.dir === "ltr" || m.dir === "rtl"), l + ".meta has lang=\"" + l + "\" and a valid dir", j({ lang: m.lang, dir: m.dir }));
});
check(content.ar.meta && content.en.meta && content.ar.meta.dir === "rtl" && content.en.meta.dir === "ltr", "en is ltr, ar is rtl");
check(sh.defaultLang === "en", "shared.defaultLang is \"en\"", String(sh.defaultLang));

/* ---------- 3. ids match shared ---------- */

[
  ["projects", "shared.projects"],
  ["experience", "shared.experience"],
  ["certificates", "shared.certificates"]
].forEach(([key, label]) => {
  const sharedIds = arr(sh[key]).map((p) => p && p.id);
  const dupes = sharedIds.filter((id, i) => sharedIds.indexOf(id) !== i);
  check(sharedIds.length > 0 && sharedIds.every(isNonEmptyString) && dupes.length === 0, label + " ids are non-empty and unique", j(sharedIds));
  LANGS.forEach((l) => {
    const ids = arr(content[l][key] && content[l][key].items).map((p) => p && p.id);
    check(j(ids) === j(sharedIds), l + "." + key + ".items ids match " + label, "shared=" + j(sharedIds) + " " + l + "=" + j(ids));
  });
});

/* ---------- 4. lists are non-empty, education complete ---------- */

const countIssues = [];
function expectSome(where, list) {
  if (!Array.isArray(list)) countIssues.push(where + " is not an array");
  else if (list.length < 1) countIssues.push(where + " is empty (at least 1 expected)");
}
expectSome("shared.projects", sh.projects);
expectSome("shared.experience", sh.experience);
expectSome("shared.certificates", sh.certificates);
LANGS.forEach((l) => {
  const t = content[l];
  expectSome(l + ".projects.items", t.projects && t.projects.items);
  expectSome(l + ".experience.items", t.experience && t.experience.items);
  expectSome(l + ".skills.items", t.skills && t.skills.items);
  expectSome(l + ".certificates.items", t.certificates && t.certificates.items);
  expectSome(l + ".languages.items", t.languages && t.languages.items);
  const ed = t.education || {};
  ["title", "degree", "institution", "period"].forEach((k) => {
    if (!isNonEmptyString(ed[k])) countIssues.push(l + ".education." + k + " is missing or empty");
  });
  arr(t.skills && t.skills.items).forEach((s, i) => {
    if (!s || !isNonEmptyString(s.name) || !isNonEmptyString(s.description)) countIssues.push(l + ".skills.items[" + i + "] needs name and description");
  });
  arr(t.certificates && t.certificates.items).forEach((c, i) => {
    if (!c || !isNonEmptyString(c.title)) countIssues.push(l + ".certificates.items[" + i + "].title is missing or empty");
  });
});
check(
  countIssues.length === 0,
  "at least 1 project, job, skill, certificate and language; education, skills and certificate titles complete",
  countIssues
);

/* ---------- 5. project fields ---------- */

const projIssues = [];
const storeIssues = [];
arr(sh.projects).forEach((sp, i) => {
  const id = sp && sp.id;
  // Both URLs may be null (no live listing): the card then has no store row.
  Object.keys(STORE_KEYS).forEach((k) => {
    if (!sp || !(k in sp)) {
      storeIssues.push("shared.projects[" + i + "] (" + id + ") has no " + k + " key");
      return;
    }
    const v = sp[k];
    if (v === null) return;
    if (!isNonEmptyString(v)) storeIssues.push(id + "." + k + " must be a URL string or null, got " + j(v));
  });
});
LANGS.forEach((l) => {
  arr(content[l].projects && content[l].projects.items).forEach((p, i) => {
    const where = l + ".projects.items[" + i + "] (" + (p && p.id) + ")";
    if (!p) return projIssues.push(where + " is missing");
    ["title", "period", "role", "tech", "description", "imageAlt"].forEach((k) => {
      if (!isNonEmptyString(p[k])) projIssues.push(where + "." + k + " is missing or empty");
    });
    if (!Array.isArray(p.contributions)) projIssues.push(where + ".contributions is not an array");
    else if (p.contributions.some((c) => !isNonEmptyString(c))) projIssues.push(where + ".contributions has an empty entry");
    if ("challenge" in p && !isNonEmptyString(p.challenge)) projIssues.push(where + ".challenge is present but empty");
  });
});
check(projIssues.length === 0, "every project has title, period, role, tech, description, imageAlt and a contributions array", projIssues);
check(storeIssues.length === 0, "every project has both store URL keys (URL or null; both null = no store row)", storeIssues);

const challengeIssues = [];
arr(sh.projects).forEach((sp, i) => {
  const has = LANGS.map((l) => {
    const p = arr(content[l].projects && content[l].projects.items)[i];
    return !!p && "challenge" in p;
  });
  if (has[0] !== has[1]) challengeIssues.push((sp && sp.id) + ": challenge in en=" + has[0] + ", ar=" + has[1]);
});
check(challengeIssues.length === 0, "challenge is in both languages or in neither", challengeIssues);

/* ---------- 6. external URLs are http(s) ---------- */

const externalUrls = [];
arr(sh.projects).forEach((p) => ["googlePlayUrl", "appStoreUrl"].forEach((k) => p && p[k] !== null && p[k] !== undefined && externalUrls.push([p.id + "." + k, p[k]])));
arr(sh.experience).forEach((e) => externalUrls.push([(e && e.id) + ".companyUrl", e && e.companyUrl]));
arr(sh.certificates).forEach((c) => externalUrls.push([(c && c.id) + ".url", c && c.url]));
["github", "linkedin", "stackoverflow"].forEach((k) => externalUrls.push(["links." + k, links[k]]));
const badScheme = externalUrls.filter(([, u]) => {
  if (typeof u !== "string" || !/^https?:\/\//.test(u)) return true;
  try {
    const parsed = new URL(u);
    return !parsed.hostname || /\s/.test(u);
  } catch (e) {
    return true;
  }
});
check(badScheme.length === 0, "all " + externalUrls.length + " external links are valid http(s) URLs (http allowed)", badScheme.map(([w, u]) => w + " -> " + j(u)));

/* ---------- 7. contact values ---------- */

check(/^[^\s@:]+@[^\s@]+\.[^\s@]+$/.test(links.email || ""), "shared.links.email is a plain address (no mailto:)", String(links.email));
check(/^\+[1-9]\d{7,14}$/.test(links.phone || ""), "shared.links.phone is an international number for a tel: link (+<digits>, no spaces)", String(links.phone));
const phoneDigits = String(links.phone || "").replace(/\D/g, "");
const displayIssues = LANGS.filter((l) => {
  const d = content[l].contact && content[l].contact.phoneDisplay;
  return !isNonEmptyString(d) || d.replace(/\D/g, "") !== phoneDigits;
}).map((l) => l + ".contact.phoneDisplay = " + j(content[l].contact && content[l].contact.phoneDisplay));
check(displayIssues.length === 0, "contact.phoneDisplay has the same digits as shared.links.phone in en and ar", displayIssues);
const scriptSrc = readText("script.js");
check(/"tel:"\s*\+\s*links\.phone/.test(scriptSrc) && /"mailto:"\s*\+\s*links\.email/.test(scriptSrc),
  "script.js builds the contact hrefs as \"tel:\" + phone and \"mailto:\" + email");

/* ---------- 8. asset paths ---------- */

const assetRefs = [];
Object.keys(sh.images || {}).forEach((k) => assetRefs.push(["shared.images." + k, sh.images[k]]));
arr(sh.projects).forEach((p, i) => assetRefs.push(["shared.projects[" + i + "].image", p && p.image]));
if (links.cv) assetRefs.push(["shared.links.cv", links.cv]);

const html = readText("index.html");
const attrRe = /\s(?:src|href)\s*=\s*"([^"]*)"/g;
let m;
while ((m = attrRe.exec(html))) {
  const v = m[1];
  if (!v || v.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(v)) continue; // anchors and absolute URLs
  assetRefs.push(["index.html " + m[0].trim().split("=")[0], v]);
}

const missing = assetRefs.filter(([, p]) => typeof p !== "string" || !fs.existsSync(path.join(DIR, p)) || !fs.statSync(path.join(DIR, p)).isFile());
check(assetRefs.length > 0 && missing.length === 0, "all " + assetRefs.length + " asset paths exist", missing.map(([w, p]) => w + " -> " + p));
const projectImages = arr(sh.projects).map((p) => p && p.image);
check(projectImages.every((p, i) => projectImages.indexOf(p) === i), "every project has its own image", j(projectImages));

/* ---------- 9. CV PDF sanity ---------- */

const cvPath = links.cv || "assets/cv.pdf";
let cvBuf = null;
try {
  cvBuf = fs.readFileSync(path.join(DIR, cvPath));
} catch (e) {
  cvBuf = null;
}
const pdfProblems = [];
if (!cvBuf) pdfProblems.push("cannot read " + cvPath);
else {
  if (!/^%PDF-\d\.\d/.test(cvBuf.slice(0, 16).toString("latin1"))) pdfProblems.push("missing %PDF-x.y header");
  if (cvBuf.slice(-1024).toString("latin1").indexOf("%%EOF") === -1) pdfProblems.push("no %%EOF in the last 1024 bytes");
  if (cvBuf.length < MIN_CV_BYTES) pdfProblems.push("only " + cvBuf.length + " bytes (expected >= " + MIN_CV_BYTES + ")");
}
check(pdfProblems.length === 0, cvPath + " looks like a real PDF (header, %%EOF, size)", pdfProblems);

/* ---------- 10. no placeholder text ---------- */

const PLACEHOLDER_PATTERNS = [
  /example\.(com|org|net)/i,
  /your[-_.\s]?(username|name|email|handle)/i,
  /\bplaceholder\b/i,
  /lorem|ipsum/i,
  /\b(john|jane) doe\b/i,
  /\b(todo|tbd|fixme)\b/i,
  /\bproject-\d+\.svg\b/i,
  /\bavatar\.svg\b/i,
  /\bProject (One|Two|Three)\b/i,
  /نص تجريبي|اسمك|عنصر نائب/
];
const placeholderHits = [];
function scanStrings(v, where) {
  if (typeof v === "string") {
    PLACEHOLDER_PATTERNS.forEach((re) => {
      if (re.test(v)) placeholderHits.push(where + ": " + j(v.slice(0, 80)) + " matches " + re);
    });
  } else if (Array.isArray(v)) v.forEach((x, i) => scanStrings(x, where + "[" + i + "]"));
  else if (v && typeof v === "object") Object.keys(v).forEach((k) => scanStrings(v[k], where + "." + k));
}
scanStrings(sh, "shared");
LANGS.forEach((l) => scanStrings(content[l], l));
const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, " ");
PLACEHOLDER_PATTERNS.forEach((re) => {
  // `placeholder` as an HTML attribute name is not placeholder text.
  const src = re.source === "\\bplaceholder\\b" ? htmlNoComments.replace(/\splaceholder\s*=/gi, " ") : htmlNoComments;
  const hit = re.exec(src);
  if (hit) placeholderHits.push("index.html: " + j(src.slice(Math.max(0, hit.index - 30), hit.index + 40)) + " matches " + re);
});
check(placeholderHits.length === 0, "no placeholder text in content.js (shared, en, ar) or index.html", placeholderHits);

/* ---------- 11. i18n paths resolve ---------- */

const i18nPaths = [];
const i18nRe = /\sdata-i18n(-aria-label)?\s*=\s*"([^"]*)"/g;
while ((m = i18nRe.exec(html))) i18nPaths.push(["index.html data-i18n" + (m[1] || ""), m[2]]);
const textRe = /\btext\(\s*t\s*,\s*"([^"]+)"\s*\)/g;
while ((m = textRe.exec(scriptSrc))) i18nPaths.push(["script.js text()", m[1]]);
const ternRe = /\btext\(\s*t\s*,[^)]*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\)/g;
while ((m = ternRe.exec(scriptSrc))) {
  i18nPaths.push(["script.js text()", m[1]]);
  i18nPaths.push(["script.js text()", m[2]]);
}
const unresolved = [];
i18nPaths.forEach(([where, p]) => {
  LANGS.forEach((l) => {
    const v = pick(content[l], p);
    if (typeof v !== "string" || !v.trim()) unresolved.push(where + " \"" + p + "\" in " + l + " -> " + j(v));
  });
});
check(i18nPaths.length > 0 && unresolved.length === 0, "all " + i18nPaths.length + " i18n paths resolve to non-empty strings in en and ar", unresolved);

/* ---------- 12. no hard-coded visible text in index.html ---------- */

function hardCodedText(src) {
  const issues = [];
  let s = src.replace(/<!--[\s\S]*?-->/g, " ");
  s = s.replace(/<!DOCTYPE[^>]*>/i, " ");
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "<script></script>");
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style></style>");

  const titles = s.match(/<title\b[^>]*>[\s\S]*?<\/title>/gi) || [];
  titles.forEach((t) => {
    if (t !== "<title>Portfolio</title>") issues.push("title is not the allowed fallback: " + t);
  });
  s = s.replace(/<title>Portfolio<\/title>/, "<title></title>");

  // Text nodes between tags.
  s.replace(/>([^<]*)</g, (all, txt) => {
    if (txt.trim()) issues.push("text node: " + j(txt.trim().slice(0, 60)));
    return all;
  });
  // Text after the last tag.
  const tail = s.slice(s.lastIndexOf(">") + 1);
  if (tail.trim()) issues.push("trailing text: " + j(tail.trim().slice(0, 60)));

  // Visible / announced attributes with literal text.
  const tagRe = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
  let tm;
  while ((tm = tagRe.exec(s))) {
    const tag = tm[1].toLowerCase(), attrs = tm[2];
    const aRe = /([\w:-]+)\s*=\s*"([^"]*)"/g;
    let am;
    const map = {};
    while ((am = aRe.exec(attrs))) map[am[1].toLowerCase()] = am[2];
    ["alt", "title", "aria-label", "placeholder", "aria-description", "aria-roledescription"].forEach((a) => {
      if (map[a] && map[a].trim()) issues.push("<" + tag + "> " + a + "=" + j(map[a]));
    });
    if (tag === "input" && map.value && map.value.trim()) issues.push("<input> value=" + j(map.value));
    if (tag === "meta" && /^(description|og:|twitter:)/.test(map.name || map.property || "") && (map.content || "").trim()) {
      issues.push("<meta " + (map.name || map.property) + "> content=" + j(map.content));
    }
  }
  return issues;
}

const htmlIssues = hardCodedText(html);
check(htmlIssues.length === 0, "index.html has no hard-coded visible text (only <title>Portfolio</title> allowed)", htmlIssues);

// Every <img> in index.html must be filled by script.js (alt from content) -> has an id script.js uses.
const imgIds = [];
const imgRe = /<img\b[^>]*>/g;
while ((m = imgRe.exec(html))) {
  const idm = /\sid="([^"]+)"/.exec(m[0]);
  imgIds.push(idm ? idm[1] : null);
}
const unfilled = imgIds.filter((id) => !id || scriptSrc.indexOf('"' + id + '"') === -1);
check(unfilled.length === 0, "every <img> in index.html gets its alt from script.js", unfilled.map(String));

/* ---------- 13. images are local files only ---------- */

const ABSOLUTE_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|\\)/i; // scheme:, //host, /root, \path
const imageRefs = [];
Object.keys(sh.images || {}).forEach((k) => imageRefs.push(["shared.images." + k, sh.images[k]]));
arr(sh.projects).forEach((p, i) => imageRefs.push(["shared.projects[" + i + "].image (" + (p && p.id) + ")", p && p.image]));
const nonLocal = imageRefs.filter(([, p]) =>
  typeof p !== "string" || ABSOLUTE_RE.test(p.trim()) || !/^(\.\/)?assets\//.test(p) || p.split(/[/\\]/).indexOf("..") !== -1
).map(([w, p]) => w + " -> " + j(p) + " (must be a relative path under assets/)");
const remoteHtml = [];
const htmlTagRe = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
while ((m = htmlTagRe.exec(htmlNoComments))) {
  const tag = m[1].toLowerCase(), attrs = m[2];
  const attrMap = {};
  const aRe = /([\w:-]+)\s*=\s*"([^"]*)"/g;
  let am;
  while ((am = aRe.exec(attrs))) attrMap[am[1].toLowerCase()] = am[2];
  const vals = [];
  if (attrMap.src !== undefined) vals.push(["src", attrMap.src]);
  if (attrMap.srcset !== undefined) attrMap.srcset.split(",").forEach((part) => vals.push(["srcset", part.trim().split(/\s+/)[0]]));
  if (tag === "link" && /icon/i.test(attrMap.rel || "") && attrMap.href !== undefined) vals.push(["href", attrMap.href]);
  vals.forEach(([a, v]) => {
    if (/^(?:https?:)?\/\//i.test(v.trim())) remoteHtml.push("index.html <" + tag + "> " + a + "=" + j(v));
  });
}
let cssSrc = "";
try {
  cssSrc = readText("styles.css");
} catch (e) {
  cssSrc = "";
}
const remoteCss = [];
const cssUrlRe = /url\(\s*(['"]?)([^'")]*)\1\s*\)/gi;
while ((m = cssUrlRe.exec(cssSrc.replace(/\/\*[\s\S]*?\*\//g, " ")))) {
  if (/^(?:https?:)?\/\//i.test(m[2].trim())) remoteCss.push("styles.css url(" + m[2] + ")");
}
check(
  nonLocal.length === 0 && remoteHtml.length === 0 && remoteCss.length === 0,
  "all images are local files (content.js paths under assets/, no remote src/srcset/icon in index.html, no remote url() in styles.css)",
  nonLocal.concat(remoteHtml, remoteCss)
);

/* ---------- 14. project images are small ---------- */

const bigImages = [];
arr(sh.projects).forEach((p) => {
  const rel = p && p.image;
  if (typeof rel !== "string") return; // reported by 8 / 13
  let size = null;
  try {
    size = fs.statSync(path.join(DIR, rel)).size;
  } catch (e) {
    return; // reported by 8
  }
  if (size > MAX_PROJECT_IMAGE_BYTES) bigImages.push((p && p.id) + ": " + rel + " is " + size + " bytes (max " + MAX_PROJECT_IMAGE_BYTES + ")");
});
check(bigImages.length === 0, "every project image is " + MAX_PROJECT_IMAGE_BYTES / 1024 + " KB or less", bigImages);

/* ---------- 15. no unused files in assets/ ---------- */

function normRel(p) {
  return path.posix.normalize(String(p).replace(/\\/g, "/")).replace(/^\.\//, "");
}
function listFiles(absDir, relDir, out) {
  let entries = [];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  entries.forEach((d) => {
    const rel = relDir + "/" + d.name;
    if (d.isDirectory()) listFiles(path.join(absDir, d.name), rel, out);
    else out.push(rel);
  });
  return out;
}
const usedAssets = new Set(assetRefs.filter(([, p]) => typeof p === "string").map(([, p]) => normRel(p)));
const assetFiles = listFiles(path.join(DIR, "assets"), "assets", []);
const unused = assetFiles.filter((f) => !usedAssets.has(f));
check(assetFiles.length > 0 && unused.length === 0, "all " + assetFiles.length + " files in assets/ are used by content.js or index.html", unused.map((f) => f + " is not referenced"));

/* ================= CV MODE (--cv): fidelity to the CV extract ================= */

if (CV_MODE) {
  console.log("\n--- CV fidelity checks (--cv) ---");
  let cv = null;
  let cvErr = "";
  try {
    cv = JSON.parse(fs.readFileSync(CV_DATA, "utf8"));
  } catch (e) {
    cvErr = "cannot read or parse " + CV_DATA + ": " + (e && e.message);
  }
  const cvOk = check(
    cv && Array.isArray(cv.projects) && cv.contact && cv.profile && cv._meta && /^[0-9a-f]{64}$/.test(cv._meta.sourceSha256 || ""),
    "CV data loads (projects, contact, profile, _meta.sourceSha256)",
    cvErr || "missing projects, contact, profile or a 64-hex _meta.sourceSha256"
  );

  /* C1b. dead-links record */
  let deadList = [];
  const deadIssues = [];
  let deadRaw = null;
  try {
    deadRaw = JSON.parse(fs.readFileSync(DEAD_LINKS, "utf8"));
  } catch (e) {
    deadIssues.push("cannot read or parse " + DEAD_LINKS + ": " + (e && e.message));
  }
  if (deadRaw !== null && !deadIssues.length) {
    if (!Array.isArray(deadRaw)) deadIssues.push(DEAD_LINKS + " is not a JSON array");
    else {
      const storeNames = Object.keys(STORE_KEYS).map((k) => STORE_KEYS[k]);
      deadRaw.forEach((e, i) => {
        const where = "dead-links[" + i + "]";
        if (!e || typeof e !== "object") return deadIssues.push(where + " is not an object");
        if (!isNonEmptyString(e.projectId)) deadIssues.push(where + ".projectId is missing or empty");
        if (storeNames.indexOf(e.store) === -1) deadIssues.push(where + ".store must be one of " + j(storeNames) + ", got " + j(e.store));
        if (!isNonEmptyString(e.cvUrl)) deadIssues.push(where + ".cvUrl is missing or empty");
        if (!isNonEmptyString(e.evidence)) deadIssues.push(where + ".evidence is missing or empty");
      });
    }
  }
  const deadOk = check(
    deadIssues.length === 0,
    "dead-links record loads (array of { projectId, store, cvUrl, evidence }): " + (deadIssues.length ? DEAD_LINKS : arr(deadRaw).length + " entries"),
    deadIssues.concat(deadIssues.length ? ["no null store URL can be excused without it"] : [])
  );
  if (deadOk) deadList = deadRaw;
  function isRecordedDead(projectId, key, cvUrl) {
    return typeof cvUrl === "string" && deadList.some((e) => e.projectId === projectId && e.store === STORE_KEYS[key] && e.cvUrl === cvUrl);
  }

  if (cvOk) {
    const cvProjects = arr(cv.projects);

    /* C2. exact counts */
    const cvCounts = {
      projects: cvProjects.length,
      experience: arr(cv.experience).length,
      skills: arr(cv.skills).length,
      certificates: arr(cv.certificates).length,
      languages: arr(cv.languages).length
    };
    const exactIssues = [];
    const expectN = (where, list, n) => {
      const len = Array.isArray(list) ? list.length : "not an array";
      if (len !== n) exactIssues.push(where + " has " + len + ", the CV has " + n);
    };
    expectN("shared.projects", sh.projects, cvCounts.projects);
    expectN("shared.experience", sh.experience, cvCounts.experience);
    expectN("shared.certificates", sh.certificates, cvCounts.certificates);
    LANGS.forEach((l) => {
      const t = content[l];
      expectN(l + ".projects.items", t.projects && t.projects.items, cvCounts.projects);
      expectN(l + ".experience.items", t.experience && t.experience.items, cvCounts.experience);
      expectN(l + ".skills.items", t.skills && t.skills.items, cvCounts.skills);
      expectN(l + ".certificates.items", t.certificates && t.certificates.items, cvCounts.certificates);
      expectN(l + ".languages.items", t.languages && t.languages.items, cvCounts.languages);
    });
    check(exactIssues.length === 0, "counts equal the CV " + j(cvCounts), exactIssues);

    /* C3. contributions / null stores / challenge only where the CV has them */
    const whereIssues = [];
    LANGS.forEach((l) => {
      arr(content[l].projects && content[l].projects.items).forEach((p, i) => {
        const cp = cvProjects[i];
        if (!p || !cp) return;
        if (Array.isArray(p.contributions) && p.contributions.length !== arr(cp.contributions).length) {
          whereIssues.push(l + ".projects[" + i + "] (" + p.id + ").contributions has " + p.contributions.length + " entries, the CV has " + arr(cp.contributions).length);
        }
        if (("challenge" in p) !== ("challenge" in cp)) {
          whereIssues.push(l + ".projects[" + i + "] (" + p.id + "): challenge in site=" + ("challenge" in p) + ", in CV=" + ("challenge" in cp));
        }
      });
    });
    arr(sh.projects).forEach((sp, i) => {
      const cp = cvProjects[i] || {};
      Object.keys(STORE_KEYS).forEach((k) => {
        if (sp && sp[k] === null && cp[k] !== null && !isRecordedDead(sp.id, k, cp[k])) {
          whereIssues.push(sp.id + "." + k + " is null, but the CV has " + j(cp[k]) + " and no dead-links entry matches { projectId: " + j(sp.id) + ", store: " + j(STORE_KEYS[k]) + ", cvUrl: " + j(cp[k]) + " }");
        }
      });
    });
    check(whereIssues.length === 0, "empty contributions, null store URLs and challenges appear only where the CV has them (or the link is recorded as dead)", whereIssues);

    /* C4. URL equality (a null store URL is equal to a CV link recorded as dead) */
    const urlPairs = [];
    let excused = 0;
    arr(sh.projects).forEach((sp, i) => {
      const cp = cvProjects[i] || {};
      Object.keys(STORE_KEYS).forEach((k) => {
        const dead = !!sp && sp[k] === null && isRecordedDead(sp.id, k, cp[k]);
        if (dead) excused++;
        urlPairs.push(["shared.projects[" + i + "]." + k + " (" + (sp && sp.id) + ")", sp && sp[k], cp[k], dead]);
      });
    });
    arr(sh.experience).forEach((se, i) => {
      urlPairs.push(["shared.experience[" + i + "].companyUrl (" + (se && se.id) + ")", se && se.companyUrl, (arr(cv.experience)[i] || {}).companyUrl]);
    });
    arr(sh.certificates).forEach((sc, i) => {
      urlPairs.push(["shared.certificates[" + i + "].url (" + (sc && sc.id) + ")", sc && sc.url, (arr(cv.certificates)[i] || {}).url]);
    });
    ["github", "linkedin", "stackoverflow"].forEach((k) => urlPairs.push(["shared.links." + k, links[k], cv.contact[k]]));
    const urlMismatch = urlPairs.filter(([, a, e, dead]) => !dead && (a !== e || e === undefined)).map(([w, a, e]) => w + ": " + j(a) + " != CV " + j(e));
    check(urlMismatch.length === 0, "all " + urlPairs.length + " store, company, certificate and profile URLs equal the CV (" + excused + " store links null as recorded dead)", urlMismatch);

    /* C4b. every dead-links entry is a real CV store link that the site hides */
    const staleDead = [];
    const seenDead = {};
    deadList.forEach((e, n) => {
      const where = "dead-links[" + n + "] " + j({ projectId: e.projectId, store: e.store, cvUrl: e.cvUrl });
      const key = e.projectId + "|" + e.store;
      if (seenDead[key]) staleDead.push(where + " duplicates dead-links[" + seenDead[key] + "]");
      else seenDead[key] = String(n);
      const i = arr(sh.projects).findIndex((sp) => sp && sp.id === e.projectId);
      if (i === -1) return staleDead.push(where + ": no project with this id in shared.projects");
      const k = Object.keys(STORE_KEYS).find((x) => STORE_KEYS[x] === e.store);
      const cvVal = (cvProjects[i] || {})[k];
      if (cvVal !== e.cvUrl) staleDead.push(where + ": the CV link for this slot is " + j(cvVal));
      if (sh.projects[i][k] !== null) staleDead.push(where + ": the site still shows " + j(sh.projects[i][k]) + " (set it to null or remove the entry)");
    });
    check(staleDead.length === 0, "every dead-links entry matches a CV store link (projectId, store, cvUrl) that the site sets to null", staleDead);

    /* C5. contact values */
    check(links.email === cv.contact.email, "shared.links.email equals the CV", j(links.email) + " != CV " + j(cv.contact.email));
    check(links.phone === cv.contact.phoneInternational, "shared.links.phone equals the CV phoneInternational", j(links.phone) + " != CV " + j(cv.contact.phoneInternational));

    /* C6. EN text */
    const en = content.en;
    const textIssues = [];
    const eq = (where, a, e) => {
      if (j(a) !== j(e)) textIssues.push(where + ": " + j(a) + " != CV " + j(e));
    };
    eq("en.hero.name", en.hero && en.hero.name, cv.profile.name);
    eq("en.hero.role", en.hero && en.hero.role, cv.profile.role);
    if (!(en.hero && typeof en.hero.location === "string" && en.hero.location.indexOf(cv.profile.location) !== -1)) {
      textIssues.push("en.hero.location " + j(en.hero && en.hero.location) + " does not contain CV location " + j(cv.profile.location));
    }
    eq("en.about.paragraphs", en.about && en.about.paragraphs, [cv.profile.summary]);
    arr(en.projects && en.projects.items).forEach((p, i) => {
      const cp = cvProjects[i] || {};
      eq("en.projects[" + i + "].title", p && p.title, cp.name);
      ["period", "role", "tech", "description", "contributions", "challenge"].forEach((k) => eq("en.projects[" + i + "]." + k, p && p[k], cp[k]));
    });
    arr(en.experience && en.experience.items).forEach((x, i) => {
      const cx = arr(cv.experience)[i] || {};
      ["company", "role", "period", "location", "apps"].forEach((k) => eq("en.experience[" + i + "]." + k, x && x[k], cx[k]));
    });
    arr(en.skills && en.skills.items).forEach((s, i) => eq("en.skills[" + i + "]", s, arr(cv.skills)[i]));
    ["degree", "institution", "period"].forEach((k) => eq("en.education." + k, en.education && en.education[k], (cv.education || {})[k]));
    arr(en.certificates && en.certificates.items).forEach((c, i) => eq("en.certificates[" + i + "].title", c && c.title, (arr(cv.certificates)[i] || {}).title));
    eq("en.languages.items", en.languages && en.languages.items, cv.languages);
    check(textIssues.length === 0, "en text (profile, projects, jobs, skills, education, certificates, languages) equals the CV", textIssues);

    /* C7. avatar */
    const avatar = sh.images && sh.images.avatar;
    check(typeof avatar === "string" && /\.jpe?g$/i.test(avatar), "shared.images.avatar is a .jpg (the CV photo)", String(avatar));

    /* C8. PDF hash */
    const expectedSha = cv._meta.sourceSha256;
    const cvSha = cvBuf ? crypto.createHash("sha256").update(cvBuf).digest("hex") : null;
    check(cvSha === expectedSha, cvPath + " is byte-identical to the CV source (SHA-256 = _meta.sourceSha256)", "got " + cvSha + ", expected " + expectedSha);
  }
}

console.log("\n" + passed + " passed, " + failed + " failed" + (CV_MODE ? " (default + --cv)." : " (default mode; add --cv for CV fidelity)."));
process.exit(failed ? 1 : 0);
