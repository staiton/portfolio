(function () {
  "use strict";

  var root = document.documentElement;
  var SITE = window.SITE, CONTENT = window.CONTENT;
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
  var markup = function (s) { return esc(s).replace(/\[(.+?)\]/g, "<mark>$1</mark>"); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, T); };
  var ARROW = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  /* ---------- Visuais dos projetos ---------- */
  function homelabSVG() {
    var nodes = [["pfSense", 70, 44], ["Pi-hole", 190, 26], ["Jellyfin", 310, 44], ["Nextcloud", 70, 176], ["GLPI", 190, 194], ["Zabbix", 310, 176]];
    var links = nodes.map(function (n) { return '<path class="flow-dash" d="M190 110L' + n[1] + " " + n[2] + '" stroke="#22e08a" stroke-opacity=".55" stroke-width="1.5" stroke-dasharray="4 4"/>'; }).join("");
    var boxes = nodes.map(function (n) {
      var w = n[0].length * 7.6 + 26;
      return '<g><rect x="' + (n[1] - w / 2) + '" y="' + (n[2] - 13) + '" width="' + w + '" height="26" rx="7" fill="#101a16" stroke="#2c4038"/><circle cx="' + (n[1] - w / 2 + 11) + '" cy="' + n[2] + '" r="3" fill="#22e08a"/><text x="' + (n[1] + 6) + '" y="' + (n[2] + 4) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#d7e8de">' + n[0] + "</text></g>";
    }).join("");
    return '<svg viewBox="0 0 380 220" role="img" aria-label="Diagrama: Proxmox VE conectado a pfSense, Pi-hole, Jellyfin, Nextcloud, GLPI e Zabbix">' + links +
      '<rect class="hub-pulse" x="128" y="88" width="124" height="44" rx="11" fill="none" stroke="#22e08a"/>' +
      '<rect x="128" y="88" width="124" height="44" rx="11" fill="#22e08a"/><text x="190" y="107" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#03140b">Proxmox VE</text><text x="190" y="122" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#03140b">hypervisor</text>' + boxes + "</svg>";
  }
  function enumSVG() {
    var lines = [
      ["$ python3 enum-sub.py -d example.com -t 20", "#e4eee8"],
      ["[*] wordlist: 5000 entradas", "#8fa198"],
      ["[+] www.example.com     203.0.113.10", "#22e08a"],
      ["[+] mail.example.com    203.0.113.25", "#22e08a"],
      ["[+] vpn.example.com     203.0.113.40", "#22e08a"],
      ["[!] dev.example.com     timeout", "#f5b13d"],
      ["[*] concluído em 4.2s", "#8fa198"],
    ];
    if (lang === "en") { lines[1][0] = "[*] wordlist: 5000 entries"; lines[6][0] = "[*] done in 4.2s"; }
    var t = lines.map(function (l, i) {
      return '<text class="term-line" style="animation-delay:' + (i * 0.45) + 's" x="16" y="' + (30 + i * 24) + '" font-family="JetBrains Mono, monospace" font-size="11.5" fill="' + l[1] + '">' + esc(l[0]) + "</text>";
    }).join("");
    return '<svg viewBox="0 0 380 200" role="img" aria-label="Terminal executando enum-sub e listando subdomínios">' + t + '<rect class="cursor-rect" x="16" y="186" width="8" height="12" fill="#22e08a"/></svg>';
  }

  /* ---------- Renderização ---------- */
  function renderHeroStats() {
    $("#hero-stats").innerHTML = T.hero.stats.map(function (s) { return "<div><dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd></div>"; }).join("");
  }

  var termToken = 0;
  function runTerminal() {
    var body = $("#console-body"), lines = T.hero.terminal, token = ++termToken;
    var ps = '<span class="ps">gabriel@natal:~$ </span>';
    if (!motionOn()) {
      body.innerHTML = lines.map(function (l) { return '<div class="ln cmd">' + ps + esc(l[0]) + '</div><div class="ln out">' + esc(l[1]) + "</div>"; }).join("") + '<div class="ln cmd">' + ps + '<span class="cursor"></span></div>';
      return;
    }
    body.innerHTML = "";
    var i = 0;
    (function nextLine() {
      if (token !== termToken) return;
      if (i >= lines.length) { body.insertAdjacentHTML("beforeend", '<div class="ln cmd">' + ps + '<span class="cursor"></span></div>'); return; }
      var cmd = document.createElement("div"); cmd.className = "ln cmd"; cmd.innerHTML = ps + '<span class="typed"></span><span class="cursor"></span>';
      body.appendChild(cmd);
      var typed = $(".typed", cmd), text = lines[i][0], c = 0;
      (function type() {
        if (token !== termToken) return;
        typed.textContent = text.slice(0, ++c);
        if (c < text.length) setTimeout(type, 45 + Math.random() * 45);
        else setTimeout(function () {
          if (token !== termToken) return;
          $(".cursor", cmd).remove();
          var out = document.createElement("div"); out.className = "ln out"; out.textContent = lines[i][1];
          body.appendChild(out); i++; setTimeout(nextLine, 380);
        }, 260);
      })();
    })();
  }

  function renderTimeline() {
    var e = T.exp;
    $("#timeline").innerHTML = e.items.map(function (it, i) {
      return '<li class="tl-item reveal' + (i === 0 ? " is-current" : "") + '"><p class="tl-date">' + esc(it.date) + '</p><span class="tl-node" aria-hidden="true"></span>' +
        '<div class="tl-card"><h3>' + esc(it.company) + (i === 0 ? '<span class="tl-tag">' + esc(e.current) + "</span>" : "") + '</h3><p class="tl-role">' + esc(it.role) + '</p><p class="tl-summary">' + esc(it.summary) + "</p>" +
        '<button type="button" class="tl-toggle" aria-expanded="false" aria-controls="tl-d' + i + '">' + esc(e.more) + "</button>" +
        '<div class="tl-details" id="tl-d' + i + '"><div><ul class="points">' + it.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul><ul class="chips">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div></div></li>";
    }).join("");
  }

  function renderProjects() {
    var p = T.projects;
    $("#projects").innerHTML = p.items.map(function (it, i) {
      return '<article class="project reveal"><div class="project-visual">' + (it.key === "homelab" ? homelabSVG() : enumSVG()) + "</div>" +
        '<div class="project-info"><div class="project-top"><span class="project-kind">' + esc(it.kind) + '</span><span class="project-status"><span class="led"></span>' + esc(it.status) + "</span></div>" +
        "<h3>" + esc(it.name) + '</h3><p class="project-text">' + esc(it.text) + '</p><div class="project-more" id="pm' + i + '"><p>' + esc(it.detail) + "</p></div>" +
        '<ul class="chips">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<div class="project-links"><button type="button" class="text-btn" aria-expanded="false" aria-controls="pm' + i + '">' + esc(p.more) + "</button>" +
        (it.repo ? '<a class="repo-link" href="' + it.repo + '" target="_blank" rel="noopener">' + esc(p.repo) + ARROW + "</a>" : "") + "</div></div></article>";
    }).join("");
  }

  var layerIndex = 0;
  function renderLayers() {
    var L = T.skills.layers;
    $("#layers").innerHTML = L.slice().reverse().map(function (l) {
      var i = L.indexOf(l);
      return '<button type="button" class="layer" role="tab" id="layer-' + i + '" data-layer="' + i + '" aria-controls="layer-panel"><span class="layer-code">' + l.code + '</span><span class="layer-name">' + esc(l.title) + '</span><span class="layer-count">' + l.tags.length + "</span></button>";
    }).join("");
    showLayer(layerIndex, false);
  }
  function showLayer(i, focus) {
    layerIndex = i;
    var l = T.skills.layers[i];
    $$(".layer").forEach(function (b) {
      var on = +b.dataset.layer === i;
      b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    var panel = $("#layer-panel");
    panel.dataset.code = l.code;
    panel.setAttribute("aria-labelledby", "layer-" + i);
    panel.innerHTML = "<h3>" + esc(l.title) + "</h3><p>" + esc(l.text) + '</p><ul class="chips">' + l.tags.map(function (t, k) { return '<li style="animation-delay:' + k * 0.03 + 's">' + esc(t) + "</li>"; }).join("") + "</ul>";
  }

  function renderFlow() {
    $("#flow-steps").innerHTML = T.skills.flow.map(function (s) { return '<li class="flow-step"><h4>' + esc(s.name) + "</h4><p>" + esc(s.text) + '</p><span class="bar" aria-hidden="true"></span></li>'; }).join("");
  }

  function renderAbout() {
    var a = T.about;
    $("#degrees").innerHTML = a.degrees.map(function (d) { return "<li><strong>" + esc(d.title) + "</strong><span>" + esc(d.org) + "</span><small>" + esc(d.detail) + "</small></li>"; }).join("");
    $("#langs").innerHTML = a.langs.map(function (l) { return "<li><b>" + l[0] + "</b>" + esc(l[1]) + "</li>"; }).join("");
    $("#cert-grid").innerHTML = a.certList.map(function (c) { return "<li><strong>" + esc(c[0]) + "</strong><span>" + esc(c[1]) + "</span><em>" + c[2] + "</em></li>"; }).join("");
    $("#cert-count").textContent = "(" + a.certList.length + ")";
  }

  function renderBarcode() {
    var x = 0, bars = "", seed = 5592;
    while (x < 120) { seed = (seed * 9301 + 49297) % 233280; var w = 1 + Math.floor((seed / 233280) * 3); bars += '<rect x="' + x + '" y="0" width="' + w + '" height="22"/>'; x += w + 1 + (seed % 2); }
    $("#barcode").innerHTML = bars;
  }

  function applyText() {
    $$("[data-i18n]").forEach(function (el) { var v = get(el.dataset.i18n); if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-mark]").forEach(function (el) { var v = get(el.dataset.i18nMark); if (typeof v === "string") el.innerHTML = markup(v); });
    $$("[data-i18n-aria]").forEach(function (el) { var v = get(el.dataset.i18nAria); if (v) el.setAttribute("aria-label", v); });
    document.title = T.meta.title;
    var md = $('meta[name="description"]'); if (md) md.content = T.meta.description;
    root.lang = lang === "en" ? "en" : "pt-BR";
    $("#copy-label").textContent = T.contact.copy;
    var href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(T.contact.mailSubject);
    $$("a.mailto").forEach(function (a) { a.href = href; });
  }

  function renderAll() {
    renderHeroStats(); renderTimeline(); renderProjects(); renderLayers(); renderFlow(); renderAbout();
    applyText(); updateBadgeUI(); if (booting) { termToken++; $("#console-body").innerHTML = ""; } else runTerminal(); observeReveals();
  }

  /* ---------- Reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }) : null;
  function observeReveals() { $$(".reveal:not(.is-in)").forEach(function (el) { if (io) io.observe(el); else el.classList.add("is-in"); }); }

  /* ---------- Boot ---------- */
  var booting = false;
  function boot() {
    var el = $(".boot");
    if (!motionOn()) return;
    el.hidden = false;
    var list = $("#boot-lines"), lines = T.boot, i = 0, done = false;
    var finish = function () { if (done) return; done = true; el.classList.add("is-done"); setTimeout(function () { el.hidden = true; booting = false; runTerminal(); }, 450); };
    el.addEventListener("click", finish);
    (function next() {
      if (done) return;
      if (i >= lines.length) { setTimeout(finish, 700); return; }
      var li = document.createElement("li");
      li.innerHTML = esc(lines[i]).replace("[ OK ]", "[ <b>OK</b> ]");
      list.appendChild(li); i++;
      setTimeout(next, 450);
    })();
  }

  /* ---------- Ferramentas da barra ---------- */
  $("#theme-toggle").addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    store.set("gf-theme", root.dataset.theme);
  });
  var motionBtn = $("#motion-toggle");
  function syncMotion() { motionBtn.setAttribute("aria-pressed", String(!motionOn())); }
  motionBtn.addEventListener("click", function () {
    root.dataset.motion = motionOn() ? "paused" : "on";
    store.set("gf-motion", root.dataset.motion);
    syncMotion(); runTerminal(); restartFlow();
  });
  $(".lang-toggle").addEventListener("click", function () {
    lang = lang === "pt" ? "en" : "pt"; T = CONTENT[lang];
    store.set("gf-lang", lang);
    renderAll();
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  });
  var menuBtn = $(".menu-toggle"), nav = $("#nav");
  function setMenu(open) { nav.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open)); }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", function (e) { if (nav.classList.contains("is-open") && !e.target.closest(".topbar")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Rolagem: progresso + link ativo ---------- */
  var bar = $(".scroll-progress span"), sections = $$("main section[id]");
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty("--p", max > 0 ? scrollY / max : 0);
    var y = scrollY + innerHeight * 0.35, current = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    $$(".nav a").forEach(function (a) { if (current && a.dataset.section === current.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Interações ---------- */
  document.addEventListener("click", function (e) {
    var tl = e.target.closest(".tl-toggle");
    if (tl) {
      var item = tl.closest(".tl-item"), open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open); tl.setAttribute("aria-expanded", String(open)); tl.textContent = open ? T.exp.less : T.exp.more;
      return;
    }
    var pm = e.target.closest(".project .text-btn");
    if (pm) {
      var proj = pm.closest(".project"), o = !proj.classList.contains("is-open");
      proj.classList.toggle("is-open", o); pm.setAttribute("aria-expanded", String(o)); pm.textContent = o ? T.projects.less : T.projects.more;
      return;
    }
    var layer = e.target.closest(".layer");
    if (layer) showLayer(+layer.dataset.layer, false);
  });
  $("#layers").addEventListener("keydown", function (e) {
    var order = $$(".layer").map(function (b) { return +b.dataset.layer; }), pos = order.indexOf(layerIndex);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showLayer(order[(pos + 1) % order.length], true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showLayer(order[(pos - 1 + order.length) % order.length], true); }
  });

  /* Fluxo: destaca uma etapa por vez enquanto está visível */
  var flowTimer = null, flowIdx = 0, flowVisible = false;
  function tickFlow() {
    var steps = $$(".flow-step");
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === flowIdx); });
    flowIdx = (flowIdx + 1) % steps.length;
  }
  function restartFlow() {
    clearInterval(flowTimer); flowTimer = null;
    $$(".flow-step").forEach(function (s) { s.classList.remove("is-active"); });
    if (!motionOn() || !flowVisible) return;
    flowIdx = 0; tickFlow(); flowTimer = setInterval(tickFlow, 2400);
  }
  if (io) new IntersectionObserver(function (en) { flowVisible = en[0].isIntersecting; restartFlow(); }, { threshold: 0.3 }).observe($(".flow"));

  /* ---------- Crachá: foto → pixel art com varredura ---------- */
  var canvas = $("#badge-canvas"), ctx = canvas.getContext("2d"), CW = canvas.width, CH = canvas.height;
  var badge = $("#badge"), scanBtn = $("#scan-btn");
  var mode = 0, animating = false, frames = [null, null];
  function makeLayer(img) {
    var c = document.createElement("canvas"); c.width = CW; c.height = CH;
    var x = c.getContext("2d"), r = Math.max(CW / img.width, CH / img.height), w = img.width * r, h = img.height * r;
    x.drawImage(img, (CW - w) / 2, (CH - h) * 0.25, w, h);
    return c;
  }
  function pixelated(src, block) {
    var c = document.createElement("canvas"); c.width = CW; c.height = CH;
    var t = document.createElement("canvas"); t.width = Math.ceil(CW / block); t.height = Math.ceil(CH / block);
    t.getContext("2d").drawImage(src, 0, 0, t.width, t.height);
    var x = c.getContext("2d"); x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, t.width * block, t.height * block);
    return c;
  }
  function updateBadgeUI() {
    var b = T.about.badge;
    $("#scan-label").textContent = mode ? b.unscan : b.scan;
    $("#badge-mode").textContent = b.modes[mode];
    canvas.setAttribute("aria-label", b.photo + " · " + b.modes[mode]);
  }
  function drawBadge() { if (frames[mode]) { ctx.drawImage(frames[mode], 0, 0); } updateBadgeUI(); }
  function scanTo(target) {
    if (animating || !frames[0] || !frames[1]) return;
    var from = frames[mode], to = frames[target];
    mode = target;
    if (!motionOn()) { drawBadge(); return; }
    animating = true; badge.classList.add("is-scanning"); scanBtn.disabled = true;
    var glitch = pixelated(to, 14), dur = 1400, t0 = performance.now();
    $("#badge-mode").textContent = "scan...";
    (function frame(now) {
      var p = Math.min(1, (now - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, y = Math.round(e * CH);
      ctx.drawImage(from, 0, 0);
      if (y > 0) ctx.drawImage(to, 0, 0, CW, y, 0, 0, CW, y);
      var band = 46, top = Math.max(0, y - band);
      if (y > 0 && p < 1) {
        for (var k = 0; k < 4; k++) {
          var sy = top + Math.random() * (y - top), sh = 4 + Math.random() * 10, off = (Math.random() - .5) * 18;
          ctx.drawImage(glitch, 0, sy, CW, sh, off, sy, CW, sh);
        }
        var g = ctx.createLinearGradient(0, y - 30, 0, y);
        g.addColorStop(0, "rgba(34,224,138,0)"); g.addColorStop(1, "rgba(34,224,138,.35)");
        ctx.fillStyle = g; ctx.fillRect(0, y - 30, CW, 30);
        ctx.fillStyle = "#22e08a"; ctx.shadowColor = "#22e08a"; ctx.shadowBlur = 16; ctx.fillRect(0, y - 2, CW, 3); ctx.shadowBlur = 0;
      }
      if (p < 1) requestAnimationFrame(frame);
      else { animating = false; badge.classList.remove("is-scanning"); scanBtn.disabled = false; drawBadge(); }
    })(t0);
  }
  scanBtn.addEventListener("click", function () { scanTo(mode ? 0 : 1); });
  function loadImg(src) {
    return new Promise(function (res) { if (!src) return res(null); var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; });
  }
  Promise.all([loadImg(SITE.photo), loadImg(SITE.photoPixel)]).then(function (imgs) {
    if (!imgs[0]) return;
    frames[0] = makeLayer(imgs[0]);
    frames[1] = imgs[1] ? makeLayer(imgs[1]) : pixelated(frames[0], 12);
    drawBadge();
  });

  /* ---------- Contato ---------- */
  var copyBtn = $("#copy-btn"), copyTimer = null;
  copyBtn.addEventListener("click", function () {
    var done = function () {
      clearTimeout(copyTimer); copyBtn.classList.add("is-copied"); $("#copy-label").textContent = T.contact.copied;
      copyTimer = setTimeout(function () { copyBtn.classList.remove("is-copied"); $("#copy-label").textContent = T.contact.copy; }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(SITE.email).then(done, function () {});
    else { var t = document.createElement("textarea"); t.value = SITE.email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (er) {} t.remove(); }
  });

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Início ---------- */
  booting = motionOn();
  renderBarcode();
  renderAll();
  syncMotion();
  onScroll();
  boot();
})();
