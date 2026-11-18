/*
 * Behaviour and rendering. Fills the page from window.PORTFOLIO_CONTENT
 * (content.js) and wires up the language, theme and mobile-menu toggles and
 * the scroll fade-in. Do not put text here — edit content.js instead.
 *
 * Hooks used in index.html:
 *   data-i18n="a.b"            -> textContent from the active language block
 *   data-i18n-aria-label="a.b" -> aria-label from the active language block
 *   ids such as #projects-list -> lists rendered below (projects, skills,
 *                                 experience, certificates, languages)
 *   #contact-email, #contact-phone, #contact-github, #contact-linkedin,
 *   #contact-stackoverflow       -> hrefs from shared.links
 *
 * The localStorage keys must match the early bootstrap in index.html.
 */
(function () {
  "use strict";

  var STORAGE_THEME = "portfolio-theme";
  var STORAGE_LANG = "portfolio-lang";

  var root = document.documentElement;
  var content = window.PORTFOLIO_CONTENT;

  function $(id) {
    return document.getElementById(id);
  }

  function revealAll() {
    var sections = document.querySelectorAll(".reveal");
    for (var i = 0; i < sections.length; i++) sections[i].classList.add("is-visible");
  }

  if (!content || !content.shared) {
    // Never leave the sections hidden; point the editor at the real problem.
    revealAll();
    console.error("Portfolio: window.PORTFOLIO_CONTENT is missing. Check content.js for a syntax error.");
    return;
  }

  /* ---------- storage (may be blocked, e.g. some file:// or private modes) ---------- */

  function load(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function save(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) { /* not saved; the choice still applies to this page view */ }
  }

  function media(query) {
    return window.matchMedia ? window.matchMedia(query) : null;
  }

  function onMediaChange(mql, handler) {
    if (!mql) return;
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else if (mql.addListener) mql.addListener(handler);
  }

  /* ---------- content helpers ---------- */

  // Language keys are every top-level block except "shared" (e.g. ["en", "ar"]).
  var languages = Object.keys(content).filter(function (key) {
    return key !== "shared" && content[key] && content[key].meta;
  });

  function isLanguage(key) {
    return languages.indexOf(key) !== -1;
  }

  // Same rule as the bootstrap: stored choice, else shared.defaultLang.
  function initialLanguage() {
    var stored = load(STORAGE_LANG);
    if (isLanguage(stored)) return stored;
    if (isLanguage(content.shared.defaultLang)) return content.shared.defaultLang;
    return languages[0];
  }

  function nextLanguage(lang) {
    return languages[(languages.indexOf(lang) + 1) % languages.length];
  }

  // Resolve a dot path such as "hero.name" inside an object.
  function pick(obj, path) {
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function text(t, path) {
    var value = pick(t, path);
    if (typeof value !== "string") {
      console.warn("Portfolio: missing text for \"" + path + "\" in content.js");
      return "";
    }
    return value;
  }

  // Small element builder. Text always goes through textContent (no raw HTML).
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (name) {
        var value = attrs[name];
        if (value == null || value === false) return;
        if (name === "text") node.textContent = value;
        else node.setAttribute(name, value === true ? "" : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function setLink(node, href) {
    if (!node) return;
    if (href) node.setAttribute("href", href);
    else node.removeAttribute("href");
  }

  function fill(container, nodes) {
    if (!container) return;
    container.textContent = "";
    nodes.forEach(function (node) {
      container.appendChild(node);
    });
  }

  function tagList(items) {
    return el("ul", { "class": "tag-list", role: "list" }, (items || []).map(function (item) {
      return el("li", { "class": "tag", text: item });
    }));
  }

  /* ---------- rendering ---------- */

  var state = {
    lang: initialLanguage(),
    theme: root.getAttribute("data-theme") === "dark" ? "dark" : "light",
    menuOpen: false
  };

  // Join a language block's items to their shared entries (URLs, images) by id.
  function sharedById(list) {
    var map = {};
    (list || []).forEach(function (entry) {
      map[entry.id] = entry;
    });
    return map;
  }

  function externalLink(href, className, label, describedBy) {
    return el("a", {
      "class": className,
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-describedby": describedBy || null,
      text: label
    });
  }

  function renderProjects(t) {
    var shared = sharedById(content.shared.projects);
    var list = $("projects-list");

    // Keep the cards whose details the visitor opened, across language switches.
    var open = {};
    if (list) {
      var openDetails = list.querySelectorAll("details[open][data-project]");
      for (var i = 0; i < openDetails.length; i++) open[openDetails[i].getAttribute("data-project")] = true;
    }

    fill(list, ((t.projects && t.projects.items) || []).map(function (item) {
      var s = shared[item.id] || {};
      var titleId = item.id + "-title";
      var contributions = item.contributions || [];

      // A store button is shown only when its URL is set (null hides it).
      var links = [
        s.googlePlayUrl ? [s.googlePlayUrl, text(t, "ui.googlePlay")] : null,
        s.appStoreUrl ? [s.appStoreUrl, text(t, "ui.appStore")] : null
      ].filter(Boolean).map(function (link) {
        return externalLink(link[0], "project-link", link[1], titleId);
      });

      // Contributions and challenge are collapsed; the block is left out when both are empty.
      var details = null;
      if (contributions.length || item.challenge) {
        details = el("details", { "class": "project-details", "data-project": item.id, open: !!open[item.id] }, [
          el("summary", { "class": "project-details-summary", "aria-describedby": titleId, text: text(t, "ui.projectDetails") }),
          el("div", { "class": "project-details-body" }, [
            contributions.length ? el("h4", { "class": "project-subtitle", text: text(t, "ui.keyContributions") }) : null,
            contributions.length ? el("ul", { "class": "project-contributions" }, contributions.map(function (entry) {
              return el("li", { text: entry });
            })) : null,
            item.challenge ? el("h4", { "class": "project-subtitle", text: text(t, "ui.keyChallenge") }) : null,
            item.challenge ? el("p", { "class": "project-challenge", text: item.challenge }) : null
          ])
        ]);
      }

      return el("li", { "class": "project-card" }, [
        el("div", { "class": "project-header" }, [
          s.image ? el("img", {
            "class": "project-image",
            src: s.image,
            alt: item.imageAlt || "",
            width: "128",
            height: "128",
            loading: "lazy"
          }) : null,
          el("div", { "class": "project-heading" }, [
            el("h3", { "class": "project-title", id: titleId, text: item.title }),
            el("p", { "class": "project-meta" }, [
              el("span", { "class": "project-period", text: item.period }),
              el("span", { "class": "project-role", text: item.role })
            ])
          ])
        ]),
        el("div", { "class": "project-body" }, [
          item.tech ? tagList([item.tech]) : null,
          el("p", { "class": "project-description", text: item.description }),
          details,
          links.length ? el("p", { "class": "project-links" }, links) : null
        ])
      ]);
    }));
  }

  function renderSkills(t) {
    fill($("skills-list"), ((t.skills && t.skills.items) || []).map(function (skill) {
      return el("li", { "class": "skill-item" }, [
        el("h4", { "class": "skill-name", text: skill.name }),
        el("p", { "class": "skill-description", text: skill.description })
      ]);
    }));
  }

  function renderExperience(t) {
    var shared = sharedById(content.shared.experience);
    var appsLabel = text(t, "experience.appsLabel");
    fill($("experience-list"), ((t.experience && t.experience.items) || []).map(function (item) {
      var url = (shared[item.id] || {}).companyUrl;
      var apps = item.apps || [];
      return el("li", { "class": "timeline-item" }, [
        el("h4", { "class": "timeline-company" }, [
          url ? externalLink(url, "timeline-company-link", item.company) : el("span", { text: item.company })
        ]),
        el("p", { "class": "timeline-meta" }, [
          el("span", { "class": "timeline-role", text: item.role }),
          el("span", { "class": "timeline-period", text: item.period }),
          el("span", { "class": "timeline-location", text: item.location })
        ]),
        apps.length ? el("p", { "class": "timeline-apps-label", text: appsLabel }) : null,
        apps.length ? tagList(apps) : null
      ]);
    }));
  }

  function renderCredentials(t) {
    var shared = sharedById(content.shared.certificates);
    fill($("certificates-list"), ((t.certificates && t.certificates.items) || []).map(function (item) {
      var url = (shared[item.id] || {}).url;
      // dir="auto": Latin course titles keep their own direction inside the Arabic page.
      return el("li", { "class": "certificate-item" }, [
        url
          ? el("a", { "class": "certificate-link", href: url, target: "_blank", rel: "noopener noreferrer", dir: "auto", text: item.title })
          : el("span", { dir: "auto", text: item.title })
      ]);
    }));
    fill($("languages-list"), ((t.languages && t.languages.items) || []).map(function (name) {
      return el("li", { "class": "tag", text: name });
    }));
  }

  function renderContact() {
    var links = content.shared.links || {};
    setLink($("contact-email"), links.email ? "mailto:" + links.email : null);
    var emailValue = $("contact-email-value");
    if (emailValue) emailValue.textContent = links.email || "";
    setLink($("contact-phone"), links.phone ? "tel:" + links.phone : null);
    setLink($("contact-github"), links.github);
    setLink($("contact-linkedin"), links.linkedin);
    setLink($("contact-stackoverflow"), links.stackoverflow);
  }

  function renderThemeLabel() {
    var t = content[state.lang];
    var button = $("theme-toggle");
    if (button) {
      button.setAttribute("aria-label", text(t, state.theme === "dark" ? "ui.themeToLight" : "ui.themeToDark"));
    }
  }

  function renderMenuState() {
    var t = content[state.lang];
    var button = $("nav-toggle");
    if (button) {
      button.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
      button.setAttribute("aria-label", text(t, state.menuOpen ? "ui.menuClose" : "ui.menuOpen"));
    }
  }

  function render() {
    var t = content[state.lang];
    var i;

    root.setAttribute("lang", t.meta.lang);
    root.setAttribute("dir", t.meta.dir);
    document.title = text(t, "meta.title");
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", text(t, "meta.description"));

    var textNodes = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < textNodes.length; i++) {
      textNodes[i].textContent = text(t, textNodes[i].getAttribute("data-i18n"));
    }
    var labelNodes = document.querySelectorAll("[data-i18n-aria-label]");
    for (i = 0; i < labelNodes.length; i++) {
      labelNodes[i].setAttribute("aria-label", text(t, labelNodes[i].getAttribute("data-i18n-aria-label")));
    }

    // The language button names the language it switches TO, in that language.
    var langButton = $("lang-toggle");
    if (langButton) {
      langButton.textContent = text(t, "ui.langToggle");
      langButton.setAttribute("aria-label", text(t, "ui.langToggleLabel"));
      langButton.setAttribute("lang", content[nextLanguage(state.lang)].meta.lang);
    }

    var avatar = $("hero-avatar");
    if (avatar) {
      if (content.shared.images && content.shared.images.avatar) {
        avatar.setAttribute("src", content.shared.images.avatar);
      }
      avatar.setAttribute("alt", text(t, "hero.avatarAlt"));
    }
    setLink($("cv-link"), content.shared.links && content.shared.links.cv);

    fill($("about-paragraphs"), ((t.about && t.about.paragraphs) || []).map(function (paragraph) {
      return el("p", { text: paragraph });
    }));
    renderProjects(t);
    renderSkills(t);
    renderExperience(t);
    renderCredentials(t);
    renderContact();
    renderThemeLabel();
    renderMenuState();
  }

  /* ---------- language toggle ---------- */

  function setLanguage(lang) {
    state.lang = lang;
    save(STORAGE_LANG, lang);
    render();
  }

  /* ---------- theme toggle ---------- */

  function applyTheme(theme) {
    state.theme = theme;
    root.setAttribute("data-theme", theme);
    renderThemeLabel();
  }

  // Until the visitor picks a theme, keep following the system setting.
  var systemDark = media("(prefers-color-scheme: dark)");
  onMediaChange(systemDark, function (event) {
    var stored = load(STORAGE_THEME);
    if (stored !== "light" && stored !== "dark") applyTheme(event.matches ? "dark" : "light");
  });

  /* ---------- mobile navigation ---------- */

  function setMenu(open, returnFocus) {
    state.menuOpen = open;
    renderMenuState();
    if (!open && returnFocus) {
      var button = $("nav-toggle");
      if (button) button.focus();
    }
  }

  /* ---------- fade-in on scroll ---------- */

  function setUpReveal() {
    var reduced = media("(prefers-reduced-motion: reduce)");
    if ((reduced && reduced.matches) || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    var sections = document.querySelectorAll(".reveal");
    for (var i = 0; i < sections.length; i++) observer.observe(sections[i]);
    // If the visitor turns on reduced motion later, show everything at once.
    onMediaChange(reduced, function (event) {
      if (event.matches) {
        observer.disconnect();
        revealAll();
      }
    });
  }

  /* ---------- start ---------- */

  render();
  setUpReveal();

  var langToggle = $("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      setLanguage(nextLanguage(state.lang));
    });
  }

  var themeToggle = $("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var theme = state.theme === "dark" ? "light" : "dark";
      save(STORAGE_THEME, theme);
      applyTheme(theme);
    });
  }

  var navToggle = $("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!state.menuOpen, false);
    });
  }

  var navMenu = $("nav-menu");
  if (navMenu) {
    navMenu.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest("a")) setMenu(false, false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (state.menuOpen && (event.key === "Escape" || event.key === "Esc")) {
      setMenu(false, true);
    }
  });
})();
