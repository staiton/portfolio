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
  var accent = function () { return getComputedStyle(root).getPropertyValue("--accent").trim() || "#00ff66"; };
  var GLYPHS = "01アイウエオカキクケコサシスセソ#$%&*+<>/\\=ABCDEF";
  var rnd = function (s) { return s[Math.floor(Math.random() * s.length)]; };

  /* ---------- Chuva Matrix ---------- */
  var mtx = $("#matrix"), mctx = mtx.getContext("2d"), drops = [], mFont = 16, mLast = 0;
  function sizeMatrix() {
    mtx.width = innerWidth; mtx.height = innerHeight;
    var cols = Math.ceil(innerWidth / mFont);
    while (drops.length < cols) drops.push(Math.random() * -60);
    drops.length = cols;
  }
  function matrixFrame(now) {
    requestAnimationFrame(matrixFrame);
    if (!motionOn() || document.hidden || now - mLast < 55) return;
    mLast = now;
    mctx.fillStyle = "rgba(0,0,0,0.12)";
    mctx.fillRect(0, 0, mtx.width, mtx.height);
    mctx.fillStyle = accent();
    mctx.font = mFont + "px JetBrains Mono, monospace";
    for (var i = 0; i < drops.length; i++) {
      var y = drops[i] * mFont;
      if (y > 0) mctx.fillText(rnd(GLYPHS), i * mFont, y);
      if (y > mtx.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  }
  sizeMatrix();
  addEventListener("resize", sizeMatrix);
  requestAnimationFrame(matrixFrame);

  /* ---------- Efeito scramble ---------- */
  function scramble(el, text, dur) {
    if (!motionOn()) { el.textContent = text; return; }
    var t0 = performance.now();
    (function f(now) {
      var p = Math.min(1, (now - t0) / dur), n = Math.floor(p * text.length), out = text.slice(0, n);
      for (var i = n; i < text.length; i++) out += text[i] === " " ? " " : rnd("!<>-_\\/[]{}=+*^?#01");
      el.textContent = out;
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- Visuais dos projetos ---------- */
  var A = "style=\"fill:var(--accent)\"", AS = "style=\"stroke:var(--accent)\"";
  function homelabSVG() {
    var nodes = [["pfSense", 70, 44], ["Pi-hole", 190, 24], ["Jellyfin", 310, 44], ["Nextcloud", 70, 176], ["GLPI", 190, 196], ["Zabbix", 310, 176]];
    var links = nodes.map(function (n) { return '<path class="flow-dash" d="M190 110L' + n[1] + " " + n[2] + '" ' + AS + ' stroke-opacity=".6" stroke-width="1.2" stroke-dasharray="3 5"/>'; }).join("");
    var boxes = nodes.map(function (n) {
      var w = n[0].length * 7.6 + 22;
      return '<g><rect x="' + (n[1] - w / 2) + '" y="' + (n[2] - 12) + '" width="' + w + '" height="24" fill="#000" ' + AS + '/><text x="' + n[1] + '" y="' + (n[2] + 4) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" ' + A + ">" + n[0] + "</text></g>";
    }).join("");
    return '<svg viewBox="0 0 380 220" role="img" aria-label="Diagrama: Proxmox VE conectado a pfSense, Pi-hole, Jellyfin, Nextcloud, GLPI e Zabbix">' + links +
      '<rect class="hub-pulse" x="130" y="90" width="120" height="40" fill="none" ' + AS + '/><rect x="130" y="90" width="120" height="40" ' + A + '/><text x="190" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="800" fill="#000">PROXMOX VE</text><text x="190" y="122" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#000">hypervisor</text>' + boxes + "</svg>";
  }
  function enumSVG() {
    var lines = ["$ python3 enum-sub.py -d example.com -t 20", lang === "en" ? "[*] wordlist: 5000 entries" : "[*] wordlist: 5000 entradas", "[+] www.example.com     203.0.113.10", "[+] mail.example.com    203.0.113.25", "[+] vpn.example.com     203.0.113.40", "[!] dev.example.com     timeout", lang === "en" ? "[*] done in 4.2s" : "[*] concluído em 4.2s"];
    var t = lines.map(function (l, i) {
      var st = i === 5 ? 'fill="#ff3b5c"' : (i === 0 || i === 1 || i === 6 ? 'style="fill:var(--ink)"' : A);
      return '<text class="term-line" style="animation-delay:' + i * 0.45 + 's" x="10" y="' + (24 + i * 24) + '" font-family="JetBrains Mono, monospace" font-size="11.5" ' + st + ">" + esc(l) + "</text>";
    }).join("");
    return '<svg viewBox="0 0 380 200" role="img" aria-label="Terminal executando enum-sub">' + t + '<rect x="10" y="184" width="8" height="12" ' + A + "/></svg>";
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
        if (c < text.length) setTimeout(type, 40 + Math.random() * 40);
        else setTimeout(function () {
          if (token !== termToken) return;
          $(".cursor", cmd).remove();
          var out = document.createElement("div"); out.className = "ln out"; out.textContent = lines[i][1];
          body.appendChild(out); i++; setTimeout(nextLine, 320);
        }, 220);
      })();
    })();
  }

  function renderTimeline() {
    var e = T.exp;
    $("#timeline").innerHTML = e.items.map(function (it, i) {
      return '<li class="tl-item reveal' + (i === 0 ? " is-current" : "") + '"><p class="tl-date">' + esc(it.date) + "</p>" +
        '<div class="tl-card"><h3>' + esc(it.company) + (i === 0 ? '<span class="tl-tag">' + esc(e.current) + "</span>" : "") + '</h3><p class="tl-role">' + esc(it.role) + '</p><p class="tl-summary">' + esc(it.summary) + "</p>" +
        '<button type="button" class="tl-toggle" aria-expanded="false" aria-controls="tl-d' + i + '">' + esc(e.more) + "</button>" +
        '<div class="tl-details" id="tl-d' + i + '"><div><ul class="points">' + it.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul><ul class="chips">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div></div></li>";
    }).join("");
  }

  function renderProjects() {
    var p = T.projects;
    $("#projects").innerHTML = p.items.map(function (it, i) {
      return '<article class="win project reveal"><div class="win-bar"><span class="win-title">' + esc(it.key === "homelab" ? "~/homelab/proxmox" : "~/tools/enum-sub") + '</span><span class="win-meta"><span class="led"></span>' + esc(it.status) + "</span></div>" +
        '<div class="project-visual">' + (it.key === "homelab" ? homelabSVG() : enumSVG()) + "</div>" +
        '<div class="project-info"><span class="project-kind">// ' + esc(it.kind) + "</span><h3>" + esc(it.name) + '</h3><p class="project-text">' + esc(it.text) + '</p><div class="project-more" id="pm' + i + '"><p>' + esc(it.detail) + "</p></div>" +
        '<ul class="chips">' + it.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<div class="project-links"><button type="button" class="text-btn" aria-expanded="false" aria-controls="pm' + i + '">' + esc(p.more) + "</button>" +
        (it.repo ? '<a class="repo-link" href="' + it.repo + '" target="_blank" rel="noopener">[ ' + esc(p.repo) + " ]</a>" : "") + "</div></div></article>";
    }).join("");
  }

  var layerIndex = 0;
  function renderLayers() {
    var s = T.skills;
    $("#scan-head").innerHTML = s.scanHead.map(function (h) { return "<span>" + esc(h) + "</span>"; }).join("");
    $("#layers").innerHTML = s.layers.map(function (l, i) {
      return '<button type="button" class="scan-row" role="tab" id="layer-' + i + '" data-layer="' + i + '" aria-controls="layer-panel"><span>' + l.port + '</span><span class="open">' + esc(s.open) + "</span><span>" + l.service + '</span><span class="ly">' + esc(l.title) + "</span></button>";
    }).join("");
    showLayer(layerIndex, false);
  }
  function showLayer(i, focus) {
    layerIndex = i;
    var l = T.skills.layers[i];
    $$(".scan-row").forEach(function (b) {
      var on = +b.dataset.layer === i;
      b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    var panel = $("#layer-panel");
    panel.dataset.code = l.code;
    panel.setAttribute("aria-labelledby", "layer-" + i);
    panel.innerHTML = "<h3>" + esc(l.title) + "</h3><p>" + esc(l.text) + '</p><ul class="chips">' + l.tags.map(function (t, k) { return '<li style="animation-delay:' + k * 0.04 + 's">' + esc(t) + "</li>"; }).join("") + "</ul>";
  }

  function renderFlow() {
    $("#flow-steps").innerHTML = T.skills.flow.map(function (s) { return '<li class="flow-step"><h4>' + esc(s.name) + "</h4><p>" + esc(s.text) + '</p><span class="bar" aria-hidden="true"></span></li>'; }).join("");
  }

  function renderAbout() {
    var a = T.about;
    $("#dossier-fields").innerHTML = a.dossier.fields.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("");
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
    applyText(); renderModeTabs(); setStatus(portraitMode === 0 && asciiReady ? T.hero.decrypted : null);
    if (booting) { termToken++; $("#console-body").innerHTML = ""; } else runTerminal();
    observeReveals();
  }

  /* ---------- Reveal + scramble ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in"); io.unobserve(e.target);
      $$(".scramble", e.target).forEach(function (s) { scramble(s, s.textContent, 700); });
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }) : null;
  function observeReveals() { $$(".reveal:not(.is-in)").forEach(function (el) { if (io) io.observe(el); else el.classList.add("is-in"); }); }

  /* ---------- Retrato: ASCII / pixel / foto ---------- */
  var portrait = $("#portrait"), pre = $("#ascii"), pcv = $("#portrait-canvas"), pctx = pcv.getContext("2d");
  var PW = pcv.width, PH = pcv.height, COLS = 92, ROWS = Math.round(COLS * (PH / PW) * 0.6);
  var frames = [null, null], asciiTarget = null, asciiReady = false, portraitMode = 0, pAnim = 0;
  var RAMP = " .'`:,-~=+*x#%@";

  function cover(img, w, h, bias) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d"), r = Math.max(w / img.width, h / img.height), iw = img.width * r, ih = img.height * r;
    x.drawImage(img, (w - iw) / 2, (h - ih) * bias, iw, ih);
    return c;
  }
  function buildAscii(img) {
    var c = cover(img, COLS, ROWS, 0.25), d = c.getContext("2d").getImageData(0, 0, COLS, ROWS).data, lum = [], lo = 255, hi = 0;
    for (var i = 0; i < d.length; i += 4) { var l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; lum.push(l); }
    var sorted = lum.slice().sort(function (a, b) { return a - b; });
    lo = sorted[Math.floor(sorted.length * 0.05)]; hi = sorted[Math.floor(sorted.length * 0.97)];
    var rows = [];
    for (var y = 0; y < ROWS; y++) {
      var row = "";
      for (var x = 0; x < COLS; x++) {
        var v = Math.min(1, Math.max(0, (lum[y * COLS + x] - lo) / (hi - lo || 1)));
        // máscara oval: realça o rosto e apaga o fundo nas bordas
        var dx = (x / COLS - 0.5) / 0.46, dy = (y / ROWS - 0.44) / 0.62, dist = Math.sqrt(dx * dx + dy * dy);
        v *= Math.max(0, Math.min(1, (1.08 - dist) / 0.28));
        row += RAMP[Math.round(Math.pow(v, 1.15) * (RAMP.length - 1))];
      }
      rows.push(row);
    }
    return rows;
  }
  function fitAscii() {
    var w = portrait.clientWidth;
    if (!w) return;
    pre.style.fontSize = (w / (COLS * 0.6)).toFixed(2) + "px";
    pre.style.lineHeight = ((portrait.clientHeight / ROWS)).toFixed(2) + "px";
  }
  addEventListener("resize", fitAscii);

  function setStatus(text, pct) {
    if (text != null) $("#portrait-status").textContent = text;
    if (pct != null) $("#portrait-meter").style.width = Math.round(pct * 100) + "%";
  }
  function renderModeTabs() {
    $("#mode-tabs").innerHTML = T.hero.modes.map(function (m, i) { return '<button type="button" role="tab" data-mode="' + i + '" aria-selected="' + (i === portraitMode) + '">' + esc(m) + "</button>"; }).join("");
  }
  function decryptAscii(dur) {
    var id = ++pAnim;
    portrait.classList.remove("show-canvas");
    if (!asciiTarget) return;
    var cells = ROWS * COLS, order = new Float32Array(cells);
    for (var k = 0; k < cells; k++) order[k] = Math.random();
    if (!motionOn()) { pre.textContent = asciiTarget.join("\n"); asciiReady = true; setStatus(T.hero.decrypted, 1); return; }
    var t0 = performance.now(), last = 0;
    (function f(now) {
      if (id !== pAnim) return;
      var p = Math.min(1, (now - t0) / dur);
      if (now - last > 40 || p === 1) {
        last = now;
        var out = [];
        for (var y = 0; y < ROWS; y++) {
          var row = "", line = asciiTarget[y];
          for (var x = 0; x < COLS; x++) { var ch = line[x]; row += order[y * COLS + x] < p ? ch : (ch === " " && Math.random() > 0.15 ? " " : rnd(GLYPHS)); }
          out.push(row);
        }
        pre.textContent = out.join("\n");
        setStatus(T.hero.decrypting + "... " + Math.round(p * 100) + "%", p);
      }
      if (p < 1) requestAnimationFrame(f);
      else { asciiReady = true; setStatus(T.hero.decrypted, 1); }
    })(t0);
  }
  function showFrame(i) {
    var id = ++pAnim, target = frames[i - 1];
    if (!target) return;
    portrait.classList.add("show-canvas");
    if (!motionOn()) { pctx.drawImage(target, 0, 0); setStatus(T.hero.decrypted, 1); return; }
    var t0 = performance.now(), dur = 650;
    (function f(now) {
      if (id !== pAnim) return;
      var p = Math.min(1, (now - t0) / dur);
      pctx.fillStyle = "#000"; pctx.fillRect(0, 0, PW, PH);
      pctx.globalAlpha = Math.min(1, p * 1.6); pctx.drawImage(target, 0, 0); pctx.globalAlpha = 1;
      var n = Math.round((1 - p) * 14);
      for (var k = 0; k < n; k++) {
        var sy = Math.random() * PH, sh = 3 + Math.random() * 18, off = (Math.random() - 0.5) * 40;
        pctx.drawImage(target, 0, sy, PW, sh, off, sy, PW, sh);
        pctx.fillStyle = "rgba(" + getComputedStyle(root).getPropertyValue("--accent-rgb") + ",0.25)"; pctx.fillRect(0, sy, PW, 2);
      }
      setStatus(T.hero.decrypting + "... " + Math.round(p * 100) + "%", p);
      if (p < 1) requestAnimationFrame(f); else setStatus(T.hero.decrypted, 1);
    })(t0);
  }
  function setMode(i) {
    portraitMode = i;
    $$("#mode-tabs button").forEach(function (b) { b.setAttribute("aria-selected", String(+b.dataset.mode === i)); });
    if (i === 0) decryptAscii(900); else showFrame(i);
  }
  $("#mode-tabs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) setMode(+b.dataset.mode); });

  function loadImg(src) { return new Promise(function (res) { if (!src) return res(null); var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); }
  var portraitLoaded = Promise.all([loadImg(SITE.photo), loadImg(SITE.photoPixel)]).then(function (imgs) {
    if (imgs[0]) { asciiTarget = buildAscii(imgs[0]); frames[1] = cover(imgs[0], PW, PH, 0.25); }
    if (imgs[1]) frames[0] = cover(imgs[1], PW, PH, 0.25);
    fitAscii();
    pre.textContent = asciiTarget ? asciiTarget.map(function (r) { return r.replace(/[^ ]/g, function () { return rnd(GLYPHS); }); }).join("\n") : "";
    setStatus(T.hero.decrypting + "... 0%", 0);
  });
  function startPortrait() { portraitLoaded.then(function () { if (portraitMode === 0) decryptAscii(2200); }); }

  /* ---------- Boot ---------- */
  var booting = false;
  function boot(after) {
    var el = $(".boot");
    if (!motionOn()) { after(); return; }
    el.hidden = false;
    var list = $("#boot-lines"), lines = T.boot, i = 0, done = false;
    var finish = function () { if (done) return; done = true; el.classList.add("is-done"); setTimeout(function () { el.hidden = true; booting = false; after(); }, 450); };
    el.addEventListener("click", finish);
    (function next() {
      if (done) return;
      if (i >= lines.length) { setTimeout(finish, 700); return; }
      var li = document.createElement("li");
      li.innerHTML = esc(lines[i]).replace("[ OK ]", "[ <b>OK</b> ]");
      list.appendChild(li); i++;
      setTimeout(next, 340);
    })();
  }

  /* ---------- Barra superior ---------- */
  $("#phosphor-toggle").addEventListener("click", function () {
    root.dataset.phosphor = root.dataset.phosphor === "amber" ? "green" : "amber";
    store.set("gf-phosphor", root.dataset.phosphor);
    mctx.fillStyle = "#000"; mctx.fillRect(0, 0, mtx.width, mtx.height);
  });
  var motionBtn = $("#motion-toggle");
  function syncMotion() { motionBtn.setAttribute("aria-pressed", String(!motionOn())); }
  motionBtn.addEventListener("click", function () {
    root.dataset.motion = motionOn() ? "paused" : "on";
    store.set("gf-motion", root.dataset.motion);
    if (!motionOn()) mctx.clearRect(0, 0, mtx.width, mtx.height);
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
    var row = e.target.closest(".scan-row");
    if (row) showLayer(+row.dataset.layer, false);
  });
  $("#layers").addEventListener("keydown", function (e) {
    var n = T.skills.layers.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showLayer((layerIndex + 1) % n, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showLayer((layerIndex - 1 + n) % n, true); }
  });

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
  boot(function () {
    runTerminal();
    startPortrait();
    scramble($("#hero-name"), "Gabriel França", 900);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAscii);
})();
