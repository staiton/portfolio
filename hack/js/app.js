(function () {
  "use strict";

  var root = document.documentElement;
  var SITE = window.SITE;
  var CONTENT = window.CONTENT;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  var lang = store.get("gf-lang") === "en" ? "en" : "pt";
  var T = CONTENT[lang];
  var motionOn = function () { return root.dataset.motion !== "paused"; };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, T); };

  /* ---------- Ícones ---------- */
  var ICON = {
    plus: "",
    ext: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
    folder: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h7l2 2h9v12H3z"/></svg>',
    net: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><path d="M12 8v4M5 16v-4h14v4"/></svg>',
    sec: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    infra: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="7"/><rect x="3" y="14" width="18" height="7"/><path d="M7 6.5h1M7 17.5h1M12 6.5h5M12 17.5h5"/></svg>',
    ops: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16"/><path d="M6 10l3 3-3 3M12 16h6"/></svg>',
    detect: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg>',
    diagnose: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h4l3-7 4 14 3-7h6"/></svg>',
    resolve: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0 5 5L12 18l-3 3-6-6 3-3 7.5-7.5a4 4 0 0 0 1 1z"/></svg>',
    document: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2h10l4 4v16H5z"/><path d="M15 2v4h4M8 11h8M8 15h8M8 19h5"/></svg>',
  };
  var SKILL_COLORS = ["var(--yellow)", "var(--orange)", "var(--lilac)", "var(--green)"];
  var METHOD_ICONS = ["detect", "diagnose", "resolve", "document"];
  var EXP_COLORS = ["c-orange", "c-yellow", "c-green", "c-lilac", "c-blue"];

  /* ---------- Visuais dos projetos ---------- */
  function homelabSVG() {
    var nodes = [["pfSense", 60, 40], ["Pi-hole", 180, 26], ["Jellyfin", 300, 40], ["Nextcloud", 60, 160], ["GLPI", 180, 176], ["Zabbix", 300, 160]];
    var lines = nodes.map(function (n) { return '<path class="hl-pulse" d="M180 100L' + n[1] + " " + n[2] + '" stroke="#b4c3ff" stroke-width="2.5" stroke-dasharray="6 5"/>'; }).join("");
    var boxes = nodes.map(function (n) {
      var w = n[0].length * 7.4 + 18;
      return '<g class="hl-node"><rect x="' + (n[1] - w / 2 + 3) + '" y="' + (n[2] - 13 + 3) + '" width="' + w + '" height="26" fill="#202019"/><rect x="' + (n[1] - w / 2) + '" y="' + (n[2] - 13) + '" width="' + w + '" height="26" fill="#fffaf0" stroke="#202019" stroke-width="2.5"/><text x="' + n[1] + '" y="' + (n[2] + 4.5) + '" text-anchor="middle" font-family="Geist Mono, monospace" font-size="12" font-weight="600" fill="#202019">' + n[0] + "</text></g>";
    }).join("");
    return '<svg viewBox="0 0 360 210" role="img" aria-label="Diagrama do homelab: Proxmox VE no centro conectado a pfSense, Pi-hole, Jellyfin, Nextcloud, GLPI e Zabbix">' + lines +
      '<g class="hl-hub"><rect x="130" y="80" width="106" height="46" fill="#202019"/><rect x="126" y="76" width="106" height="46" fill="var(--yellow)" stroke="#202019" stroke-width="3"/><text x="179" y="97" text-anchor="middle" font-family="Geist Mono, monospace" font-size="12" font-weight="700" fill="#202019">Proxmox VE</text><text x="179" y="112" text-anchor="middle" font-family="Geist Mono, monospace" font-size="9" fill="#202019">hypervisor</text></g>' + boxes + "</svg>";
  }
  function enumSVG() {
    var lines = [
      ["$ python enum-sub.py -d exemplo.com", "#f4f0e7"],
      ["[*] carregando wordlist...", "#b4c3ff"],
      ["[+] www.exemplo.com   203.0.113.10", "#9be38f"],
      ["[+] mail.exemplo.com  203.0.113.25", "#9be38f"],
      ["[+] vpn.exemplo.com   203.0.113.40", "#9be38f"],
      ["[*] 3 subdomínios encontrados", "#f3cf60"],
    ];
    var t = lines.map(function (l, i) {
      return '<text class="term-line" style="animation-delay:' + (i * 0.5) + 's" x="18" y="' + (52 + i * 22) + '" font-family="Geist Mono, monospace" font-size="12" fill="' + l[1] + '">' + esc(l[0]) + "</text>";
    }).join("");
    return '<svg viewBox="0 0 360 210" role="img" aria-label="Terminal executando enum-sub e listando subdomínios encontrados"><rect x="10" y="8" width="344" height="198" fill="#202019"/><rect x="4" y="2" width="344" height="198" fill="#1b1d2b" stroke="#202019" stroke-width="3"/><rect x="4" y="2" width="344" height="24" fill="var(--orange)" stroke="#202019" stroke-width="3"/><path d="M16 14h6M26 14h6M36 14h6" stroke="#202019" stroke-width="3"/><text x="320" y="18" text-anchor="end" font-family="Geist Mono, monospace" font-size="10" font-weight="600" fill="#202019">enum-sub</text>' + t + '<rect class="art-caret" x="18" y="178" width="9" height="3" fill="#f4f0e7"/></svg>';
  }

  /* ---------- Renderização ---------- */
  function renderExperience() {
    var items = T.exp.items, n = items.length;
    $("#experience-list").innerHTML = items.map(function (e, i) {
      var num = String(n - i).padStart(2, "0");
      return '<li class="experience-entry will-reveal">' +
        '<div class="experience-meta"><span class="experience-index ' + EXP_COLORS[i % EXP_COLORS.length] + '">' + num + "</span>" +
        '<p class="date-label">' + esc(e.date) + "</p><h3>" + esc(e.company) + '</h3><p class="role-label">' + esc(e.role) + "</p>" +
        (i === 0 ? '<span class="recent-label">' + esc(T.exp.recent) + "</span>" : "") + "</div>" +
        '<div class="experience-body"><h4>' + esc(e.headline) + "</h4><p>" + esc(e.summary) + "</p>" +
        '<details class="contributions"><summary>' + esc(T.exp.toggle) + '<span class="plus" aria-hidden="true">+</span></summary><div class="contributions-body"><ul class="bullets">' +
        e.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul><ul class="tags">' +
        e.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></details></div></li>";
    }).join("");
  }

  function renderProjects() {
    var p = T.projects;
    $("#projects-list").innerHTML = p.items.map(function (it, i) {
      var visual = it.key === "homelab" ? homelabSVG() : enumSVG();
      return '<article class="project will-reveal">' +
        '<div class="project-placeholder ' + (i === 0 ? "p-blue" : "p-yellow") + '"><div class="placeholder-top">' + ICON.folder + '<span class="project-stamp">' + esc(it.status) + "</span></div>" +
        '<div class="project-visual">' + visual + '</div><p class="placeholder-caption">' + esc(it.letter) + "_ · " + esc(it.kind) + "</p></div>" +
        '<div class="project-info"><p class="project-role">' + esc(it.kind) + '</p><h3 class="project-identity">' + esc(it.name) + '<span class="dot">.</span></h3>' +
        '<ul class="tags">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<p class="project-description">' + esc(it.text) + "</p>" +
        '<details class="project-more"><summary>' + esc(p.more) + '<span class="pm" aria-hidden="true">+</span></summary><p>' + esc(it.detail) + "</p></details>" +
        (it.repo ? '<a class="text-link" href="' + it.repo + '" target="_blank" rel="noopener">' + esc(p.repo) + ICON.ext + "</a>" : "") +
        "</div></article>";
    }).join("");
  }

  var selectedSkill = 0;
  function renderSkills() {
    var s = T.skills;
    $("#skills-grid").innerHTML = s.items.map(function (it, i) {
      return '<article class="skill-card will-reveal" data-skill="' + i + '" tabindex="0">' +
        '<div class="skill-card-heading"><span class="skill-icon" style="background:' + SKILL_COLORS[i] + '">' + ICON[it.key] + "</span><h3>" + esc(it.title) + '</h3><span class="skill-number">0' + (i + 1) + "</span></div>" +
        "<p>" + esc(it.text) + '</p><ul class="tags">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></article>";
    }).join("");
    var map = $("#machine-map");
    $$(".machine-node", map).forEach(function (n) { n.remove(); });
    s.items.forEach(function (it, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "machine-node";
      b.dataset.skill = i;
      b.innerHTML = ICON[it.key] + "<span>" + esc(it.short) + "</span>";
      map.insertBefore(b, $(".machine-hub", map));
    });
    selectSkill(selectedSkill, false);
  }
  var WIRES = ["M200 110H110V60", "M200 110h90V60", "M200 110H110v50", "M200 110h90v50"];
  function selectSkill(i, scroll) {
    selectedSkill = i;
    $$(".machine-node").forEach(function (n) { n.setAttribute("aria-pressed", String(+n.dataset.skill === i)); });
    $$(".skill-card").forEach(function (c) { c.classList.toggle("is-selected", +c.dataset.skill === i); });
    $(".wire-signal").setAttribute("d", WIRES[i]);
    $("#machine-readout").textContent = T.skills.items[i].title;
    if (scroll) {
      var card = $('.skill-card[data-skill="' + i + '"]');
      var r = card.getBoundingClientRect();
      if (r.top < 90 || r.bottom > innerHeight) card.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "center" });
    }
  }

  var methodIndex = 0;
  function renderMethod() {
    var m = T.skills.method;
    $(".method-tabs").setAttribute("aria-label", m.title);
    $(".method-tabs").innerHTML = m.steps.map(function (st, i) {
      return '<button type="button" role="tab" id="mtab-' + i + '" aria-controls="method-panel" aria-selected="' + (i === methodIndex) + '" tabindex="' + (i === methodIndex ? 0 : -1) + '" data-step="' + i + '"><span><span class="step-number">0' + (i + 1) + "</span>" + esc(st.name) + '</span><span aria-hidden="true">→</span></button>';
    }).join("");
    $(".method-sequence").innerHTML = m.steps.map(function (_, i) { return "<span" + (i === methodIndex ? ' class="on"' : "") + ">0" + (i + 1) + "</span>"; }).join("");
    showMethod(methodIndex, false);
  }
  function showMethod(i, focus) {
    methodIndex = i;
    var st = T.skills.method.steps[i];
    $$(".method-tabs button").forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      if (k === i && focus) b.focus();
    });
    $$(".method-sequence span").forEach(function (s, k) { s.classList.toggle("on", k === i); });
    var panel = $("#method-panel");
    panel.setAttribute("aria-labelledby", "mtab-" + i);
    panel.innerHTML = '<div class="method-illustration">' + ICON[METHOD_ICONS[i]] + '</div><div class="method-detail"><h4>' + esc(st.title) + "</h4><p>" + esc(st.text) + '</p><p class="method-tagline">' + esc(st.note) + "</p></div>";
  }

  var certsOpen = false;
  function renderAbout() {
    var a = T.about;
    $("#about-stats").innerHTML = a.stats.map(function (s) { return "<div><dt>" + esc(s.value) + "</dt><dd>" + esc(s.label) + "</dd></div>"; }).join("");
    renderCerts();
    $("#language-list").innerHTML = a.langs.items.map(function (l) { return '<li><span class="language-code">' + l[0] + "</span>" + esc(l[1]) + "</li>"; }).join("");
  }
  function renderCerts() {
    var a = T.about, list = certsOpen ? a.certList : a.certList.slice(0, 5);
    $("#cert-list").innerHTML = list.map(function (c, i) {
      return "<li" + (i >= 5 ? ' class="extra" style="animation-delay:' + (i - 5) * 0.04 + 's"' : "") + "><span>" + esc(c[0]) + "<small>" + esc(c[1]) + '</small></span><span class="yr">' + c[2] + "</span></li>";
    }).join("");
    var btn = $("#cert-toggle");
    btn.textContent = certsOpen ? a.certs.showLess : a.certs.showAll + " (" + a.certList.length + ")";
    btn.setAttribute("aria-expanded", String(certsOpen));
  }

  function applyText() {
    $$("[data-i18n]").forEach(function (el) { var v = get(el.dataset.i18n); if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-ph]").forEach(function (el) { var v = get(el.dataset.i18nPh); if (v) el.placeholder = v; });
    $$("[data-i18n-aria]").forEach(function (el) { var v = get(el.dataset.i18nAria); if (v) el.setAttribute("aria-label", v); });
    document.title = T.meta.title;
    var md = $('meta[name="description"]'); if (md) md.content = T.meta.description;
    root.lang = lang === "en" ? "en" : "pt-BR";
    $$(".language-options button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    if (!animating) drawDevice();
  }

  function renderAll() {
    renderExperience();
    renderProjects();
    renderSkills();
    renderMethod();
    renderAbout();
    applyText();
    observeReveals();
  }

  /* ---------- Revelar ao rolar ---------- */
  var revealIO = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-revealed"); revealIO.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;
  function observeReveals() {
    $$(".will-reveal:not(.is-revealed)").forEach(function (el) { if (revealIO) revealIO.observe(el); else el.classList.add("is-revealed"); });
  }

  /* ---------- Ajustes ---------- */
  var trigger = $(".settings-trigger"), panel = $("#settings-panel");
  function setPanel(open) {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    $(".settings-indicator").textContent = open ? "–" : "+";
    if (open) $(".settings-close").focus();
  }
  trigger.addEventListener("click", function () { setPanel(panel.hidden); });
  $(".settings-close").addEventListener("click", function () { setPanel(false); trigger.focus(); });
  document.addEventListener("click", function (e) { if (!panel.hidden && !e.target.closest(".settings")) setPanel(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!panel.hidden) { setPanel(false); trigger.focus(); }
    if (navLinks.classList.contains("is-open")) setMenu(false);
  });

  function syncSwitches() {
    $$(".switch").forEach(function (sw) {
      var on = sw.dataset.setting === "theme" ? root.dataset.theme === "dark" : motionOn();
      sw.setAttribute("aria-checked", String(on));
      $(".switch-label", sw).textContent = on ? T.ui.on : T.ui.off;
    });
  }
  $$(".switch").forEach(function (sw) {
    sw.addEventListener("click", function () {
      if (sw.dataset.setting === "theme") {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        store.set("gf-theme", root.dataset.theme);
      } else {
        root.dataset.motion = motionOn() ? "paused" : "on";
        store.set("gf-motion", root.dataset.motion);
        drawDevice();
      }
      syncSwitches();
    });
  });
  $$(".language-options button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang; T = CONTENT[lang];
      store.set("gf-lang", lang);
      renderAll();
      $$(".will-reveal").forEach(function (el) { el.classList.add("is-revealed"); });
      syncSwitches();
    });
  });
  $('[data-action="replay"]').addEventListener("click", function () { setPanel(false); playIntro(true); });

  /* ---------- Abertura ---------- */
  var intro = $(".page-intro");
  function playIntro(force) {
    if (!motionOn() && !force) return;
    intro.hidden = false;
    var clone = intro.cloneNode(true);
    intro.replaceWith(clone);
    intro = clone;
    if (!motionOn()) { setTimeout(function () { intro.hidden = true; }, 900); return; }
    setTimeout(function () { intro.hidden = true; }, 1700);
  }
  try {
    if (!sessionStorage.getItem("gf-intro")) { sessionStorage.setItem("gf-intro", "1"); playIntro(false); }
  } catch (e) { playIntro(false); }

  /* ---------- Menu mobile ---------- */
  var menuBtn = $(".menu-button"), navLinks = $("#nav-links");
  function setMenu(open) { navLinks.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open)); }
  menuBtn.addEventListener("click", function () { setMenu(!navLinks.classList.contains("is-open")); });

  /* ---------- Navegação com trilha ---------- */
  var travel = $(".section-travel span");
  var headerH = function () { return $(".site-header").offsetHeight; };
  var navAnim = null;
  function goTo(hash) {
    var target = hash === "#topo" ? document.body : $(hash);
    if (!target) return;
    var dest = hash === "#topo" ? 0 : Math.max(0, target.getBoundingClientRect().top + scrollY - headerH() + 3);
    dest = Math.min(dest, document.documentElement.scrollHeight - innerHeight);
    var start = scrollY, dist = dest - start;
    history.replaceState(null, "", hash === "#topo" ? location.pathname : hash);
    var section = hash === "#topo" ? $("#topo") : target;
    if (!motionOn() || Math.abs(dist) < 4) { scrollTo(0, dest); arrive(section); return; }
    cancelAnimationFrame(navAnim);
    var dur = Math.min(1300, Math.max(550, Math.abs(dist) * 0.32)), t0 = performance.now();
    root.dataset.navigating = dist > 0 ? "down" : "up";
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = ease(p);
      scrollTo(0, start + dist * e);
      travel.style.setProperty("--travel-progress", e);
      if (p < 1) navAnim = requestAnimationFrame(step);
      else { setTimeout(function () { delete root.dataset.navigating; travel.style.setProperty("--travel-progress", 0); }, 250); arrive(section); }
    })(t0);
  }
  function arrive(section) {
    if (!section) return;
    section.classList.remove("section-arrived");
    void section.offsetWidth;
    section.classList.add("section-arrived");
    $$(".will-reveal", section).forEach(function (el) { el.classList.add("is-revealed"); });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    var hash = a.getAttribute("href");
    if (hash.length < 2) return;
    e.preventDefault();
    setMenu(false);
    goTo(hash);
  });
  ["wheel", "touchstart", "keydown"].forEach(function (ev) {
    addEventListener(ev, function () { if (root.dataset.navigating) { cancelAnimationFrame(navAnim); delete root.dataset.navigating; } }, { passive: true });
  });

  /* Link ativo + cor da marca */
  var sections = $$("main section[id], .site-footer");
  function onScroll() {
    var y = scrollY + headerH() + innerHeight * 0.3, current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    document.body.dataset.mark = current.dataset.mark || "yellow";
    var id = current.id;
    $$(".nav-links a[data-section]").forEach(function (a) {
      if (a.dataset.section === id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Competências ---------- */
  document.addEventListener("click", function (e) {
    var node = e.target.closest(".machine-node");
    if (node) { selectSkill(+node.dataset.skill, true); return; }
    var card = e.target.closest(".skill-card");
    if (card) selectSkill(+card.dataset.skill, false);
    var tab = e.target.closest(".method-tabs button");
    if (tab) showMethod(+tab.dataset.step, false);
  });
  document.addEventListener("keydown", function (e) {
    var card = e.target.closest && e.target.closest(".skill-card");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); selectSkill(+card.dataset.skill, false); }
    var tab = e.target.closest && e.target.closest(".method-tabs button");
    if (tab) {
      var n = T.skills.method.steps.length, i = +tab.dataset.step;
      if (e.key === "ArrowRight") { e.preventDefault(); showMethod((i + 1) % n, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); showMethod((i - 1 + n) % n, true); }
      if (e.key === "Home") { e.preventDefault(); showMethod(0, true); }
      if (e.key === "End") { e.preventDefault(); showMethod(n - 1, true); }
    }
  });

  $("#cert-toggle").addEventListener("click", function () { certsOpen = !certsOpen; renderCerts(); });

  /* ---------- gf. COLOR (Game Boy): foto → pixel art ---------- */
  var canvas = $("#portrait-canvas"), ctx = canvas.getContext("2d");
  var device = $(".portrait-device"), screen = $(".portrait-screen");
  var CW = canvas.width, CH = canvas.height;
  var deviceMode = 0, powered = true, animating = false;
  var frames = [null, null]; // [foto, pixel art] já recortados no tamanho da tela

  function makeLayer(img) {
    var c = document.createElement("canvas"); c.width = CW; c.height = CH;
    var x = c.getContext("2d");
    var r = Math.max(CW / img.width, CH / img.height), w = img.width * r, h = img.height * r;
    x.drawImage(img, (CW - w) / 2, (CH - h) * 0.3, w, h);
    return c;
  }
  function fallbackLayer() {
    var c = document.createElement("canvas"); c.width = CW; c.height = CH;
    var x = c.getContext("2d");
    x.fillStyle = "#233fe1"; x.fillRect(0, 0, CW, CH);
    x.fillStyle = "#f3cf60"; x.font = "500 120px 'Geist Pixel Square', monospace"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("gf.", CW / 2, CH / 2);
    return c;
  }
  var tiny = document.createElement("canvas"), tctx = tiny.getContext("2d");
  function drawPixelated(src, block) {
    if (block <= 1) { ctx.imageSmoothingEnabled = true; ctx.drawImage(src, 0, 0); return; }
    tiny.width = Math.ceil(CW / block); tiny.height = Math.ceil(CH / block);
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(src, 0, 0, tiny.width, tiny.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tiny, 0, 0, tiny.width, tiny.height, 0, 0, tiny.width * block, tiny.height * block);
  }
  function drawDevice() {
    var src = frames[deviceMode] || frames[0];
    if (!src) return;
    ctx.clearRect(0, 0, CW, CH);
    drawPixelated(src, 1);
    var label = T.about.device.modes[deviceMode];
    $("#portrait-mode").textContent = label;
    canvas.setAttribute("aria-label", T.about.device.screen + " · " + label);
  }

  /* Animação: pixeliza a imagem atual, monta a nova bloco a bloco e depois a "foca". */
  function transformTo(target) {
    if (!powered || animating || !frames[0] || !frames[1]) return;
    if (target === deviceMode) { screen.classList.remove("is-bump"); void screen.offsetWidth; screen.classList.add("is-bump"); return; }
    var from = frames[deviceMode], to = frames[target];
    deviceMode = target;
    if (!motionOn()) { drawDevice(); return; }
    animating = true;
    device.classList.add("is-transforming");
    var B = 30, cols = Math.ceil(CW / B), rows = Math.ceil(CH / B), cells = [];
    for (var cy = 0; cy < rows; cy++) for (var cx = 0; cx < cols; cx++) cells.push([cx, cy]);
    for (var k = cells.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), tmp = cells[k]; cells[k] = cells[j]; cells[j] = tmp; }
    // pré-renderiza as versões pixeladas em B
    var bigFrom = document.createElement("canvas"), bigTo = document.createElement("canvas");
    [bigFrom, bigTo].forEach(function (c, i) {
      c.width = CW; c.height = CH;
      var keep = ctx; ctx = c.getContext("2d"); drawPixelated(i ? to : from, B); ctx = keep;
    });
    var steps = [];
    [2, 4, 8, 14, 20, 30].forEach(function (b) { steps.push({ src: from, block: b }); });
    var batches = 8;
    for (var s = 1; s <= batches; s++) steps.push({ reveal: Math.round(cells.length * s / batches) });
    [20, 14, 8, 4, 2, 1].forEach(function (b) { steps.push({ src: to, block: b }); });
    var i = 0;
    (function tick() {
      var st = steps[i];
      ctx.clearRect(0, 0, CW, CH);
      if (st.reveal != null) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bigFrom, 0, 0);
        for (var n = 0; n < st.reveal; n++) { var c = cells[n]; ctx.drawImage(bigTo, c[0] * B, c[1] * B, B, B, c[0] * B, c[1] * B, B, B); }
      } else drawPixelated(st.src, st.block);
      i++;
      if (i < steps.length) setTimeout(tick, st.reveal != null ? 55 : 70);
      else {
        animating = false;
        device.classList.remove("is-transforming");
        screen.classList.remove("is-flash"); void screen.offsetWidth; screen.classList.add("is-flash");
        drawDevice();
      }
    })();
    $("#portrait-mode").textContent = "...";
  }

  device.addEventListener("click", function (e) {
    var b = e.target.closest("[data-device],[data-dpad]");
    if (!b) return;
    var act = b.dataset.device || b.dataset.dpad;
    if (act === "power") {
      if (animating) return;
      powered = !powered;
      b.setAttribute("aria-pressed", String(powered));
      device.classList.toggle("is-off", !powered);
      screen.dataset.power = powered ? "on" : "off";
      if (powered) drawDevice();
      return;
    }
    device.classList.add("was-used");
    if (act === "a") transformTo(1);
    else if (act === "b") transformTo(0);
    else transformTo(deviceMode ? 0 : 1);
  });

  function loadImg(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.src = src;
    });
  }
  Promise.all([loadImg(SITE.photo), loadImg(SITE.photoPixel)]).then(function (imgs) {
    frames[0] = imgs[0] ? makeLayer(imgs[0]) : fallbackLayer();
    frames[1] = imgs[1] ? makeLayer(imgs[1]) : frames[0];
    drawDevice();
  });

  /* ---------- Contato ---------- */
  var form = $("#contact-form");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(name, msg) {
    var field = form.elements[name].closest(".form-field");
    if (msg) field.setAttribute("data-invalid", ""); else field.removeAttribute("data-invalid");
    form.elements[name].setAttribute("aria-invalid", String(!!msg));
    form.elements[name].setAttribute("aria-describedby", "e-" + name);
    $("#e-" + name).textContent = msg || "";
  }
  function validate() {
    var f = form.elements, err = T.contact.errors, ok = true, first = null;
    var checks = {
      name: f.name.value.trim().length >= 2 ? "" : err.name,
      email: emailRe.test(f.email.value.trim()) ? "" : err.email,
      subject: f.subject.value.trim().length >= 2 ? "" : err.subject,
      message: f.message.value.trim().length >= 10 ? "" : err.message,
    };
    Object.keys(checks).forEach(function (k) { setError(k, checks[k]); if (checks[k]) { ok = false; first = first || f[k]; } });
    if (first) first.focus();
    return ok;
  }
  ["name", "email", "subject", "message"].forEach(function (k) {
    form.elements[k].addEventListener("input", function () { if (form.elements[k].closest("[data-invalid]")) setError(k, ""); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements.company.value) return; // honeypot
    if (!validate()) return;
    var f = form.elements;
    var body = f.message.value.trim() + "\n\n— " + f.name.value.trim() + " <" + f.email.value.trim() + ">";
    location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(f.subject.value.trim()) + "&body=" + encodeURIComponent(body);
    $(".form-body", form).hidden = true;
    $(".form-success", form).hidden = false;
    form.reset();
  });
  $(".form-again").addEventListener("click", function () {
    $(".form-body", form).hidden = false;
    $(".form-success", form).hidden = true;
    form.elements.name.focus();
  });

  var copyBtn = $(".copy-button"), copyFb = $(".copy-feedback");
  copyBtn.addEventListener("click", function () {
    var done = function () {
      copyBtn.classList.add("is-copied"); copyFb.textContent = T.contact.copied; copyFb.classList.add("show");
      setTimeout(function () { copyBtn.classList.remove("is-copied"); copyFb.classList.remove("show"); }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(SITE.email).then(done, function () {});
    else { var t = document.createElement("textarea"); t.value = SITE.email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (er) {} t.remove(); }
  });

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Início ---------- */
  renderAll();
  syncSwitches();
  onScroll();
})();
