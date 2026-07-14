/* =============================================================================
   ASSET PORTAL — APP LOGIC
   Reads from window.PORTAL_* (see assets/data/assets.js). No build step.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.PORTAL_CONFIG;
  var BRANDS = window.PORTAL_BRANDS;
  var PRODUCTS = window.PORTAL_PRODUCTS;

  // ---- tiny helpers --------------------------------------------------------
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var today = new Date();
  function daysSince(iso) { return Math.floor((today - new Date(iso)) / 86400000); }
  // "New" badges are now fully manual — set `newBadge: true` (or a colour) on any
  // product in assets.js. (No longer auto-shown by upload date.)
  function fmtDate(iso) {
    // Parse as local midnight so an ISO date doesn't shift a day in US timezones.
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function icon(name) {
    var paths = {
      search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
      download: '<path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/>',
      eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
      youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
      share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
      arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
      arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
      arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      file: '<path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>',
      photo: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
      video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4Z"/>',
      vector: '<path d="M3 5h4v4H3zM17 15h4v4h-4zM5 9v6M19 9V5h-4M7 17h6"/>',
      stack: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
      link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
      tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7" cy="7" r="1.4"/>',
      copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
      play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.4 7 22l5-3 5 3-1.2-8.6"/>',
      refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
      graduation: '<path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
      printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || "") + "</svg>";
  }
  var typeIcon = { image: "photo", video: "video", vector: "vector", pdf: "file" };
  // Official Stündenglass brandmark, preloaded so the certificate-download canvas can draw it synchronously.
  var CERT_LOGO = new Image(); CERT_LOGO.src = "assets/img/stundenglass-wordmark-black.png";

  // Category icon for a folder tab, chosen from the folder name (handles canonical
  // names and colorway/type names like "Black / Renders").
  function folderIcon(f) {
    var s = String(f).toLowerCase();
    if (/video|reel|tv screen/.test(s)) return "video";
    if (/logo|brand/.test(s)) return "vector";
    if (/packag|carton|box/.test(s)) return "stack";
    if (/banner/.test(s)) return "photo";
    if (/lifestyle/.test(s)) return "eye";
    if (/marketing|in.?store|point of sale|\bpos\b|\bpop\b|display|retail/.test(s)) return "tag";
    if (/doc|sheet|spec|manual|misc|catalog|guide/.test(s)) return "file";
    return "photo";   // product photos / renders / e-comm / default
  }

  // Simplified brand glyphs for the social hub (filled marks).
  function socialIcon(net) {
    var paths = {
      instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/>',
      x: '<path d="M17.5 3h3l-6.6 7.6L21.8 21h-5.9l-4.1-5.4L6.9 21H3.9l7.1-8.1L2.6 3h6.1l3.6 4.9L17.5 3Zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5Z" fill="currentColor"/>',
      facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" fill="currentColor"/>',
      youtube: '<path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor"/>',
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[net.toLowerCase()] || "") + "</svg>";
  }
  function hexToRgb(hex) {
    var m = hex.replace("#", "");
    if (m.length === 3) m = m.replace(/(.)/g, "$1$1");
    var n = parseInt(m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // ---- derived per-product stats -------------------------------------------
  PRODUCTS.forEach(function (p) {
    var total = 0, fmts = {};
    Object.keys(p.folders).forEach(function (f) {
      p.folders[f].forEach(function (file) { total++; if (file.format) fmts[file.format] = 1; });
    });
    p.total = total;
    p.formats = Object.keys(fmts);
    p.days = daysSince(p.added);
  });

  // ---- state ---------------------------------------------------------------
  var state = {
    view: "stundenglass",      // single-brand portal (Stündenglass)
    type: "all",       // all | E-Comm Render Photos | Lifestyle Photos | Logos | Video | Misc
    query: "",
    fileFacet: "",     // transient: active file-results facet (Photos, Videos, …)
    sort: "featured",  // featured (curated order) | az
    layout: "grid",    // grid | list (applies to the All-products grid)
  };

  function pid(p) { return p.brand + "::" + p.name; }
  function fileKey(folder, file) { return folder + "::" + file.name + "." + (file.format || ""); }

  // ---- recently viewed (local to the browser) ------------------------------
  function loadRecent() {
    try { return JSON.parse(localStorage.getItem("portal_recent") || "[]"); } catch (e) { return []; }
  }
  function recordRecent(p) {
    try {
      var id = pid(p);
      var arr = loadRecent().filter(function (x) { return x !== id; });
      arr.unshift(id);
      localStorage.setItem("portal_recent", JSON.stringify(arr.slice(0, 8)));
    } catch (e) {}
  }
  // Curated display names + print dimensions for in-store marketing materials,
  // keyed by synced filename. Overrides the raw filename wherever the piece shows.
  var INSTORE_LABELS = {
    // Curated display names + print dimensions for Stündenglass in-store pieces,
    // keyed by synced Dropbox filename. Add entries as the real in-store marketing
    // files land in Dropbox (e.g. "Gravity-Infuser-Table-Tent": { name, dim }).
  };
  function instoreLabel(file) { return INSTORE_LABELS[file && file.name] || null; }
  function fileLabel(file) {
    var lbl = INSTORE_LABELS[file.name];
    if (lbl) return lbl.name;   // curated in-store material name (no extension)
    var f = file.format || "";
    if (!f || f === "YouTube" || f === "Link") return file.name;  // links keep their title, no fake extension
    return file.name + "." + f.toLowerCase();
  }
  function isExtVideo(file) { return file.type === "video" && /youtube\.com|youtu\.be|vimeo\.com/.test(file.url || ""); }
  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---- shareable deep links ------------------------------------------------
  function slugify(s) {
    return String(s).toLowerCase().replace(/ü/g, "u").replace(/\+/g, " plus ")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  // A product link, optionally deep into one of its folders:
  //   #stundenglass/gravity-infusers?f=Black%20%2F%20Product%20Photos
  // The folder rides in a ?f= suffix rather than more path segments, because both
  // product slugs and folder paths contain "/" and would otherwise be ambiguous.
  function productHash(p, folder) {
    return "#" + p.brand + "/" + slugify(p.name) + (folder ? "?f=" + encodeURIComponent(folder) : "");
  }
  function hashFolder() {
    var m = location.hash.match(/[?&]f=([^&]*)/);
    try { return m ? decodeURIComponent(m[1]) : ""; } catch (e) { return ""; }
  }
  function productFromHash() {
    var h = location.hash.replace(/^#/, "").split("?")[0];
    if (!h) return null;
    var parts = h.split("/"), brand = parts[0], slug = parts.slice(1).join("/");
    return PRODUCTS.filter(function (p) { return p.brand === brand && slugify(p.name) === slug; })[0] || null;
  }
  // When we change the hash ourselves we set this so the hashchange handler
  // (which exists for browser back/forward + external deep links) skips a
  // redundant re-render.
  var ignoreHash = false;
  function navTo(p) {
    openDetail(p);
    var h = productHash(p);
    if (location.hash !== h) { ignoreHash = true; location.hash = h; }
  }
  function navHome() {
    renderHome();
    if (location.hash) { ignoreHash = true; location.hash = ""; }
  }
  function route() {
    var parts = location.hash.replace(/^#/, "").split("/");
    var mp = $("#materials-page"); if (mp && parts[0] !== "materials") mp.style.display = "none";
    var lp = $("#locator-page"); if (lp && parts[0] !== "locator") lp.style.display = "none";
    var trp = $("#training-page"); if (trp && parts[0] !== "train") trp.style.display = "none";
    if (parts[0] === "style" && BRANDS[parts[1]]) { openStyleGuide(parts[1]); return; }
    if (parts[0] === "additional" && BRANDS[parts[1]]) { openAdditional(parts[1]); return; }
    if (parts[0] === "materials") { openMaterials(); return; }
    // Shareable deep link straight into a catalog: #catalog/<slug>
    if (parts[0] === "catalog" && parts[1]) { renderHome(); openCatalog(parts.slice(1).join("/")); return; }
    if (parts[0] === "locator") { openLocator(); return; }
    if (parts[0] === "train") {
      var tp = PRODUCTS.filter(function (x) { return x.brand === parts[1] && slugify(x.name) === parts.slice(2).join("/"); })[0];
      if (tp && window.PORTAL_TRAINING && window.PORTAL_TRAINING[tp.name]) { openTraining(tp); return; }
      renderHome(); return;
    }
    var p = productFromHash();
    if (p) openDetail(p, hashFolder()); else renderHome();
  }

  // ---- clipboard -----------------------------------------------------------
  function copyText(text, okMsg) {
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy");
        document.body.removeChild(ta); toast(okMsg);
      } catch (e) { toast("Copy failed"); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    } else { fallback(); }
  }

  // ---- shareable filtered views + active filters ---------------------------
  var TYPE_LABELS = {
    "E-Comm Render Photos": "Product photos", "Lifestyle Photos": "Lifestyle Photos",
    "Logos": "Logos", "Social Videos": "Social Videos", "TV Screen Videos": "TV Screen Videos",
    "Misc": "Documents",
  };
  function typeLabel(t) { return TYPE_LABELS[t] || t; }
  // Canonical Digital Assets tab order (matches the Dropbox-sync FOLDER_ORDER).
  var FOLDER_TAB_ORDER = ["Product Photos", "E-Comm Render Photos", "Lifestyle Photos", "Web Banners", "Logos", "Social Videos", "TV Screen Videos", "Packaging", "Documents", "Misc"];
  function folderRank(f) { var i = FOLDER_TAB_ORDER.indexOf(f); return i < 0 ? 99 : i; }

  function buildQuery() {
    var parts = [];
    if (state.view !== "stundenglass") parts.push("b=" + state.view);   // stundenglass is the default → keep its URL clean
    if (state.type !== "all") parts.push("t=" + encodeURIComponent(state.type));
    if (state.query) parts.push("q=" + encodeURIComponent(state.query));
    if (state.sort !== "featured") parts.push("s=" + state.sort);
    if (state.layout !== "grid") parts.push("l=" + state.layout);
    return parts.join("&");
  }
  // Keep the address bar in sync with the current filters (home view only, so
  // a refresh or a copied URL reproduces the view). replaceState avoids extra
  // history entries and never fires hashchange.
  function syncURL() {
    var qs = buildQuery();
    try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "")); } catch (e) {}
  }
  function parseURL() {
    var q = location.search.replace(/^\?/, "");
    if (!q) return;
    var params = {};
    q.split("&").forEach(function (kv) { var p = kv.split("="); params[p[0]] = decodeURIComponent(p[1] || ""); });
    if (params.b && BRANDS[params.b]) state.view = params.b;
    if (params.t) state.type = params.t;
    if (params.q) state.query = params.q;
    if (params.s === "az" || params.s === "featured") state.sort = params.s;
    if (params.l === "list" || params.l === "grid") state.layout = params.l;
    syncControls();
  }
  // Reflect state into the toggle / chips / sort / view / search controls.
  function syncControls() {
    $$("#view-toggle button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-view") === state.view); });
    $$("#type-filters .chip").forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-type") === state.type); });
    $$("#sort-toggle button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-sort") === state.sort); });
    $$("#view-mode button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-layout") === state.layout); });
    var s = $("#search"); if (s && s.value !== state.query) s.value = state.query;
  }
  function shareView() {
    var qs = buildQuery();
    copyText(location.origin + location.pathname + (qs ? "?" + qs : ""), "View link copied");
  }
  function clearFilter(k) {
    // Brand is fixed to Stündenglass for this portal, never a clearable
    // filter — so only type/query are reset here.
    if (k === "all") { state.type = "all"; state.query = ""; }
    else if (k === "type") state.type = "all";
    else if (k === "query") state.query = "";
    syncControls();
    navHome();
  }
  function renderActiveFilters() {
    var box = $("#active-filters"); if (!box) return;
    var chips = [];
    if (state.type !== "all") chips.push({ k: "type", label: typeLabel(state.type) });
    if (state.query) chips.push({ k: "query", label: "“" + state.query + "”" });
    // Nothing filtered → keep the top clean (the bar hides itself when empty).
    if (!chips.length) { box.innerHTML = ""; return; }
    var left = chips.map(function (c) {
      return '<button class="fchip" data-clear="' + c.k + '">' + c.label + ' <span class="x">' + icon("x") + "</span></button>";
    }).join("") + '<button class="fclear" data-clear="all">Clear all</button>';
    box.innerHTML =
      '<div class="fb-left">' + left + "</div>" +
      '<div class="fb-right"><button class="btn ghost sm" id="share-view">' + icon("link") + " Share view</button></div>";
    $$("[data-clear]", box).forEach(function (b) {
      b.addEventListener("click", function () { clearFilter(b.getAttribute("data-clear")); });
    });
    $("#share-view").addEventListener("click", shareView);
  }

  // ---- filtering -----------------------------------------------------------
  function visibleProducts() {
    return PRODUCTS.filter(function (p) {
      if (state.view !== "both" && p.brand !== state.view) return false;
      if (state.type !== "all" && !p.folders[state.type]) return false;
      if (state.query) {
        var q = state.query.toLowerCase();
        var hay = (p.name + " " + p.category + " " + BRANDS[p.brand].name + " " + p.formats.join(" ")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  // ---- search: every product AND every individual file in the portal --------
  // Everyday words people actually type, mapped onto what the assets are called.
  var SEARCH_SYNONYMS = {
    pic: ["photo", "png", "jpg"], pics: ["photo", "png", "jpg"], picture: ["photo"],
    photos: ["photo"], image: ["photo", "png", "jpg"], images: ["photo"],
    vid: ["video", "mp4"], vids: ["video", "mp4"], videos: ["video"], movie: ["video", "mp4"],
    vector: ["svg", "ai", "eps"], vectors: ["svg", "ai", "eps"], logos: ["logo"],
    doc: ["document", "pdf"], docs: ["document", "pdf"],
    catalogue: ["catalog"], catalogs: ["catalog"], catalogues: ["catalog"],
    lookbook: ["catalog"], brochure: ["catalog"],
    packshot: ["packaging"], pack: ["packaging"], lifestyle: ["lifestyle", "hero"],
    jpeg: ["jpg"], transparent: ["png", "transparent"],
    // Stündenglass vocabulary
    stundenglass: ["stündenglass"], sg: ["stündenglass"],
    infuser: ["infuser", "gravity"], hookah: ["gravity", "infuser"],
    modul: ["modül"], kompact: ["kompact", "compact"], compact: ["kompact"],
    tv: ["tv screen"], instore: ["in store", "in-store"], "in-store": ["in store"],
  };
  function termAliases(t) {
    var syn = SEARCH_SYNONYMS[t];
    if (!syn) return [t];
    var out = [t]; syn.forEach(function (s) { if (out.indexOf(s) === -1) out.push(s); });
    return out;
  }
  // A haystack matches when EVERY term (or one of its aliases) is present.
  function matchTerms(hay, aliasGroups) {
    for (var i = 0; i < aliasGroups.length; i++) {
      var g = aliasGroups[i], hit = false;
      for (var j = 0; j < g.length; j++) { if (hay.indexOf(g[j]) !== -1) { hit = true; break; } }
      if (!hit) return false;
    }
    return true;
  }
  function queryTerms(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }
  // Pre-expand a query into alias groups once, for reuse across every candidate.
  function queryAliasGroups(q) { return queryTerms(q).map(termAliases); }
  // Relevance: exact/prefix name matches beat body-text matches.
  function relScore(label, hay, groups, rawQ) {
    var name = (label || "").toLowerCase(), score = 0;
    if (rawQ && name === rawQ) score += 100;           // exact name
    if (rawQ && name.indexOf(rawQ) === 0) score += 40; // name starts with query
    if (rawQ && name.indexOf(rawQ) !== -1) score += 20; // full phrase in name
    groups.forEach(function (g) {
      var inName = false, inHay = false;
      for (var j = 0; j < g.length; j++) {
        if (!inName && name.indexOf(g[j]) !== -1) inName = true;
        if (!inHay && hay.indexOf(g[j]) !== -1) inHay = true;
      }
      if (inName) score += 12; else if (inHay) score += 3;
    });
    return score;
  }
  // Coarse "kind" buckets for the results facet bar, from the file's folder/type.
  function facetOf(folder, file) {
    if (file && (file.type === "video" || /video/i.test(file.format || ""))) return "Videos";
    var f = folder || "";
    if (/logo/i.test(f)) return "Logos";
    if (/lifestyle/i.test(f)) return "Lifestyle";
    if (/pack/i.test(f)) return "Packaging";
    if (/in.?store|marketing/i.test(f)) return "In-store";
    if (/photo|render|e-?comm|banner/i.test(f)) return "Photos";
    if (/video/i.test(f)) return "Videos";
    if (/doc|misc|manual|sheet/i.test(f)) return "Documents";
    return "Assets";
  }
  var FACET_ORDER = ["Photos", "Lifestyle", "Logos", "Packaging", "Videos", "Catalogs", "In-store", "Documents", "Assets"];

  // Flat, cached index of every downloadable thing: product files + how-to videos.
  var _fileIndex = null;
  function fileIndex() {
    if (_fileIndex) return _fileIndex;
    var out = [];
    PRODUCTS.forEach(function (p) {
      if (p.folders) Object.keys(p.folders).forEach(function (folder) {
        (p.folders[folder] || []).forEach(function (file) {
          out.push({
            product: p, brand: p.brand, folder: folder, file: file,
            label: fileLabel(file), kind: facetOf(folder, file),
            // Nested folders read as "Product · Black / Product Photos"
            sub: p.name + " · " + folder,
            hay: (fileLabel(file) + " " + folder + " " + (file.format || "") + " " + p.name + " " + (p.category || "") + " " + BRANDS[p.brand].name).toLowerCase()
          });
        });
      });
      (p.videos || []).forEach(function (v) {
        out.push({
          product: p, brand: p.brand, folder: "How-to Videos", video: v,
          file: { name: v.title, format: "Video", thumb: v.thumb, url: v.url, type: "video" },
          label: v.title, kind: "Videos", sub: p.name + " · How-to Videos",
          hay: (v.title + " video how to " + p.name + " " + BRANDS[p.brand].name).toLowerCase()
        });
      });
    });
    // Catalogs & brand documents. These belong to no product, so they carry an
    // `openHash` instead — clicking one opens the in-site PDF viewer.
    (window.PORTAL_CATALOGS || []).forEach(function (c) {
      var nm = c.title + (c.region ? " (" + c.region + ")" : "");
      out.push({
        brand: "stundenglass", folder: c.group || "Catalogs", kind: "Catalogs",
        label: nm, sub: (c.group || "Catalog") + (c.region ? " · " + c.region : ""),
        openHash: "catalog/" + c.slug,
        file: { name: nm, format: "PDF", thumb: c.thumb, url: c.file || c.url, file: c.file || null, type: "pdf" },
        hay: (c.title + " " + (c.region || "") + " " + (c.group || "") + " catalog document pdf stundenglass").toLowerCase()
      });
    });
    _fileIndex = out;
    return out;
  }
  // Products matching the query, ranked by relevance. Format tokens are excluded
  // on purpose — "png" is a file concept and shouldn't pull in every product.
  function searchProducts(q) {
    var groups = queryAliasGroups(q), bk = state.view, rawQ = q.toLowerCase().trim();
    return PRODUCTS.map(function (p) {
      if (p.brand !== bk) return null;
      var info = p.info || {};
      var hay = (p.name + " " + (p.category || "") + " " + (p.type || "") + " " + (p.label || "") +
        " " + BRANDS[p.brand].name + " " + (info.description || "") +
        " " + (info.fullName || "") + " " + ((info.highlights || []).join(" "))).toLowerCase();
      if (!matchTerms(hay, groups)) return null;
      return { p: p, score: relScore(p.name, hay, groups, rawQ) };
    }).filter(Boolean).sort(function (a, b) {
      return b.score - a.score || a.p.name.localeCompare(b.p.name);
    }).map(function (x) { return x.p; });
  }
  // Individual files matching the query, ranked and grouped for the facet bar.
  // Sorted BEFORE slicing, so the cap keeps the *best* matches.
  var SEARCH_FILE_CAP = 60;
  function searchFiles(q) {
    var groups = queryAliasGroups(q), bk = state.view, rawQ = q.toLowerCase().trim();
    var hits = [];
    fileIndex().forEach(function (r) {
      if (r.brand !== bk) return;
      if (!matchTerms(r.hay, groups)) return;
      r._score = relScore(r.label, r.hay, groups, rawQ);
      hits.push(r);
    });
    hits.sort(function (a, b) { return b._score - a._score || a.label.localeCompare(b.label); });
    var counts = {};
    hits.forEach(function (r) { counts[r.kind] = (counts[r.kind] || 0) + 1; });
    var facets = FACET_ORDER.filter(function (k) { return counts[k]; })
      .map(function (k) { return { kind: k, n: counts[k] }; });
    var facet = state.fileFacet && counts[state.fileFacet] ? state.fileFacet : "";
    var shown = facet ? hits.filter(function (r) { return r.kind === facet; }) : hits;
    return { total: hits.length, all: hits, items: shown.slice(0, SEARCH_FILE_CAP), shownTotal: shown.length, facets: facets, facet: facet };
  }
  // Escape a query for use inside a RegExp (highlighting).
  function reEscape(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  // Wrap query matches in <mark> so hits are obvious in the results.
  function highlight(text, q) {
    var t = escapeHTML(String(text == null ? "" : text));
    var terms = queryTerms(q).filter(function (x) { return x.length > 1; });
    if (!terms.length) return t;
    try {
      return t.replace(new RegExp("(" + terms.map(reEscape).join("|") + ")", "ig"), "<mark>$1</mark>");
    } catch (e) { return t; }
  }

  // ---- rendering: cover ----------------------------------------------------
  function coverHTML(p) {
    if (p.cover) {
      var safe = p.name.replace(/"/g, "");
      return '<img src="' + p.cover + '" alt="' + safe + '" loading="lazy" onerror="window.__fallback(this,\'' + safe + '\')"/>';
    }
    if (p.isLogo) return '<div class="logo-tile"><span>' + BRANDS[p.brand].wordmark + "</span></div>";
    return fallbackHTML(p.name);
  }
  function fallbackHTML(name) {
    return '<div class="fallback">' + icon("photo") + "<span>" + name + "</span></div>";
  }
  window.__fallback = function (img, name) { img.parentNode.innerHTML = fallbackHTML(name); };

  // ---- shared wiring helpers (swatches / style links / socials / logos) ----
  function wireSwatches(ctx) {
    $$("[data-hex]", ctx).forEach(function (s) {
      s.addEventListener("click", function () { var h = s.getAttribute("data-hex"); copyText(h, "Copied " + h); });
    });
  }
  function wireStyleLinks(ctx) {
    $$("[data-style]", ctx).forEach(function (b) {
      b.addEventListener("click", function () { navToStyle(b.getAttribute("data-style")); });
    });
  }
  function wireLogoLinks(ctx) {
    $$("[data-logo]", ctx).forEach(function (b) {
      b.addEventListener("click", function () {
        var p = PRODUCTS.filter(function (x) { return x.name === b.getAttribute("data-logo"); })[0];
        if (p) navTo(p);
      });
    });
  }
  function wireSocial(ctx) {
    $$("[data-copylink]", ctx).forEach(function (b) {
      b.addEventListener("click", function () { copyText(b.getAttribute("data-copylink"), "Link copied"); });
    });
  }

  // ---- social hub ----------------------------------------------------------
  function socialListHTML(bk) {
    var items = BRANDS[bk].social || [];
    if (!items.length) return '<p class="fnone">Social links coming soon.</p>';
    return '<div class="socials">' + items.map(function (s) {
      return '<div class="social-card">' +
        '<a class="social-main" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="social-ic">' + socialIcon(s.network) + "</span>" +
          '<span class="social-meta"><span class="social-net">' + s.network + '</span><span class="social-handle">' + s.handle + "</span></span>" +
        "</a>" +
        '<button class="social-copy" data-copylink="' + s.url + '" title="Copy link" aria-label="Copy ' + s.network + ' link">' + icon("link") + "</button>" +
      "</div>";
    }).join("") + "</div>";
  }
  function renderSocialHub() {
    var box = $("#social-hub"); if (!box) return;
    var bk = state.view;
    box.innerHTML =
      '<div class="section-head"><h2>Follow ' + BRANDS[bk].name + " On Socials</h2><span class=\"badge\">Official accounts</span></div>" +
      '<div class="hub-wrap"><div class="hub-brand">' + socialListHTML(bk) + "</div></div>";
    wireSocial(box);
  }

  // ---- logos & brand assets ------------------------------------------------
  // Current brand's logo files (in various formats). The full brand/style guide
  // is hidden for now — a designer-made guide will replace this later.
  function renderLogoAssets() {
    var box = $("#logo-assets"); if (!box) return;
    var bk = state.view, b = BRANDS[bk];
    var logoP = PRODUCTS.filter(function (p) { return p.isLogo && p.brand === bk; })[0];
    if (!logoP) { box.innerHTML = ""; return; }

    var logos = [];
    Object.keys(logoP.folders || {}).forEach(function (f) { (logoP.folders[f] || []).forEach(function (x) { logos.push(x); }); });
    var fmts = (logoP.formats || []).map(function (f) { return '<span class="fmt">' + f + "</span>"; }).join("");

    // Preview just the two primary marks — the primary black mark and the black
    // wordmark (preferring SVG). "Browse all" shows every file/format. Regexes are
    // permissive so they match whatever the Stündenglass logo files are named.
    function rankFmt(f) { return f === "SVG" ? 3 : f === "PNG" ? 2 : 1; }
    function pickLogo(re) {
      return logos.filter(function (x) { return re.test(x.name) && x.thumb; })
        .sort(function (a, b) { return rankFmt(b.format) - rankFmt(a.format); })[0];
    }
    var preview = [pickLogo(/(mark|icon|monogram|primary).*black|black.*(mark|icon|monogram|primary)/i), pickLogo(/wordmark|logotype|logo/i)].filter(Boolean);
    if (!preview.length) preview = logos.filter(function (x) { return x.thumb; }).slice(0, 2);
    var tiles = preview.map(function (x) {
      var dark = /white|reverse/i.test(x.name);
      var media = x.thumb ? '<img src="' + x.thumb + '" alt="' + x.name.replace(/"/g, "") + '" loading="lazy"/>' : window.__icon("photo");
      return '<button class="logo-tile' + (dark ? " dark" : "") + '" data-logodl="' + (x.url || "#") + '" data-logoname="' + fileLabel(x) + '" title="Download ' + fileLabel(x) + '">' +
        media + "</button>";
    }).join("");

    box.innerHTML =
      '<div class="logo-card">' +
        '<div class="logo-card-info">' +
          '<div class="logo-card-name">' + b.name + " Logos</div>" +
          '<p class="logo-card-note">Official ' + b.name + " logos — black, white &amp; various versions. For approved partner, press &amp; retail use; please don’t alter, recolor, or distort the marks.</p>" +
          (fmts ? '<div class="logo-card-fmts"><span class="logo-card-fmts-l">Formats</span>' + fmts + "</div>" : "") +
          '<div class="logo-card-actions">' +
            '<button class="btn" id="logo-dl">' + icon("download") + " Download all logos</button>" +
            '<button class="logo-browse-link" id="logo-browse">' + icon("eye") + " Browse all " + logoP.total + " logo files →</button>" +
          "</div>" +
        "</div>" +
        (tiles ? '<div class="logo-preview">' + tiles + "</div>" : "") +
      "</div>";

    $("#logo-dl").addEventListener("click", function () { downloadAll(logoP); });
    $("#logo-browse").addEventListener("click", function () { navTo(logoP); });
    $$("[data-logodl]", box).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-logodl");
        if (!f || f === "#") { navTo(logoP); return; }
        // Everything lives on Dropbox — cross-origin, so a same-origin <a download>
        // won't work; open the Dropbox direct-download URL instead.
        if (/dropbox\.com/.test(f)) downloadOne(f);
        else directDownload(f, btn.getAttribute("data-logoname"));
      });
    });
  }

  // ---- brand style guide page ----------------------------------------------
  function swatchBigHTML(c) {
    var rgb = hexToRgb(c.hex).join(", ");
    return '<button class="sw-big" data-hex="' + c.hex + '" title="Copy ' + c.hex + '">' +
      '<span class="sw-big-chip" style="background:' + c.hex + '"></span>' +
      '<span class="sw-big-meta">' +
        '<span class="sw-big-name">' + c.name + "</span>" +
        '<span class="sw-big-hex">' + c.hex.toUpperCase() + "</span>" +
        '<span class="sw-big-rgb">rgb(' + rgb + ")</span>" +
      "</span></button>";
  }
  function fontSpecimenHTML(f) {
    return '<div class="fontspec">' +
      '<div class="fontspec-aa" style="font-family:' + f.stack + '">Aa</div>' +
      '<div class="fontspec-body">' +
        '<div class="fontspec-head"><span class="fontspec-name">' + f.name + '</span><span class="fontspec-role">' + f.role + "</span></div>" +
        '<div class="fontspec-line big" style="font-family:' + f.stack + '">The quick brown fox jumps over the lazy dog</div>' +
        '<div class="fontspec-line" style="font-family:' + f.stack + '">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</div>' +
      "</div></div>";
  }
  function openStyleGuide(bk) {
    var b = BRANDS[bk];
    if (!b) { renderHome(); return; }
    $("#home").style.display = "none";
    $("#detail").style.display = "none";
    var sgBrowse = $("#browse"); if (sgBrowse) sgBrowse.style.display = "none";
    var sgHero = $("#hero"); if (sgHero) sgHero.style.display = "none";
    $("#additional").style.display = "none";
    var sg = $("#styleguide");
    sg.style.display = "block";
    animateIn(sg);
    window.scrollTo(0, 0);

    sg.innerHTML =
      '<button class="back" id="sg-back">' + icon("arrowLeft") + " Back to library</button>" +
      '<div class="sg-hero">' +
        '<div class="sg-word">' + b.wordmark + "</div>" +
        "<h2>Brand &amp; Style Guide</h2>" +
        '<p class="sg-note">' + icon("info") + "<span>Placeholder guide — the official " + b.name + " brand guide will replace this. Colors, type, and logos below reflect current brand usage.</span></p>" +
        '<div class="sg-actions">' +
          '<button class="btn" data-view-brand="' + bk + '">' + icon("stack") + " View " + b.name + " assets</button>" +
          (b.logoProduct ? '<button class="btn ghost" data-logo="' + b.logoProduct + '">' + icon("download") + " Download logos</button>" : "") +
        "</div>" +
      "</div>" +
      '<div class="section-head"><h2>Colors</h2><span class="badge">tap to copy</span></div>' +
      '<div class="sg-colors">' + (b.colors || []).map(swatchBigHTML).join("") + "</div>" +
      '<div class="section-head"><h2>Typography</h2></div>' +
      '<div class="sg-fonts">' + (b.fonts || []).map(fontSpecimenHTML).join("") + "</div>" +
      '<div class="section-head"><h2>Logos</h2></div>' +
      '<div class="sg-logos">' +
        '<div class="sg-logo-tile"><span>' + b.wordmark + "</span></div>" +
        (b.logoProduct ? '<button class="btn ghost" data-logo="' + b.logoProduct + '">' + icon("download") + " Download logo files</button>" : "") +
      "</div>" +
      '<div class="section-head"><h2>Follow ' + b.name + "</h2></div>" +
      socialListHTML(bk);

    $("#sg-back").addEventListener("click", navHome);
    $$("[data-view-brand]", sg).forEach(function (x) {
      x.addEventListener("click", function () { state.view = x.getAttribute("data-view-brand"); syncControls(); navHome(); });
    });
    wireSwatches(sg);
    wireLogoLinks(sg);
    wireSocial(sg);
  }
  function navToStyle(bk) {
    openStyleGuide(bk);
    var h = "#style/" + bk;
    if (location.hash !== h) { ignoreHash = true; location.hash = h; }
  }

  // ---- rendering: card -----------------------------------------------------
  function cardHTML(p, layout) {
    return (layout || state.layout) === "list" ? rowHTML(p) : gridCardHTML(p);
  }
  function gridCardHTML(p) {
    var showBrand = state.view === "both";
    return (
      '<article class="card" data-id="' + pid(p) + '" tabindex="0" role="button" aria-label="Open ' + p.name + '">' +
        '<div class="card-frame">' +
          (p.newBadge && !p.isLogo ? '<span class="tag-new' + (p.newBadge ? " tag-new-" + p.newBadge : "") + '">New</span>' : "") +
          (showBrand ? '<span class="tag-brand">' + BRANDS[p.brand].name + "</span>" : "") +
          coverHTML(p) +
          '<div class="quick">' +
            '<button class="qbtn" data-act="download" title="Download all">' + icon("download") + "</button>" +
          "</div>" +
        "</div>" +
        '<div class="card-name">' + p.name + "</div>" +
        (p.label ? '<div class="card-label">' + p.label + "</div>" : "") +
        '<div class="card-sub">' + (p.isLogo ? p.total + " logo files" : p.total + " assets" + (p.label ? "" : " · " + p.category)) + "</div>" +
      "</article>"
    );
  }
  function rowHTML(p) {
    var showBrand = state.view === "both";
    return (
      '<article class="card row" data-id="' + pid(p) + '" tabindex="0" role="button" aria-label="Open ' + p.name + '">' +
        '<div class="row-thumb">' + coverHTML(p) + "</div>" +
        '<div class="row-main">' +
          '<div class="row-name">' + p.name + (p.newBadge && !p.isLogo ? ' <span class="row-new' + (p.newBadge ? " row-new-" + p.newBadge : "") + '">New</span>' : "") + (p.label ? ' <span class="row-label">' + p.label + "</span>" : "") + "</div>" +
          '<div class="row-sub">' + (p.isLogo ? p.total + " logo files" : p.total + " assets" + (p.label ? "" : " · " + p.category)) + "</div>" +
        "</div>" +
        (showBrand ? '<span class="row-brand">' + BRANDS[p.brand].name + "</span>" : "") +
        '<button class="row-dl" data-act="download" title="Download all">' + icon("download") + "</button>" +
      "</article>"
    );
  }

  // ---- current / legacy split ----------------------------------------------
  function currentList(bk) { return (window.PORTAL_CURRENT && window.PORTAL_CURRENT[bk]) || []; }
  function isCurrentName(bk, name) { return currentList(bk).indexOf(name) !== -1; }
  // All legacy (non-current, non-logo) products for a brand — unfiltered.
  function legacyProducts(bk) {
    return PRODUCTS.filter(function (p) { return p.brand === bk && !p.isLogo && !isCurrentName(bk, p.name); });
  }

  // ---- rendering: home -----------------------------------------------------
  // Last computed search results, so Enter can jump straight to the best match.
  var _lastSearch = null;
  function openTopResult() {
    if (!_lastSearch) return;
    if (_lastSearch.prods && _lastSearch.prods.length) { navTo(_lastSearch.prods[0]); return; }
    var items = _lastSearch.fileRes && _lastSearch.fileRes.items;
    if (!items || !items.length) return;
    var top = items[0];
    if (top.openHash) { location.hash = top.openHash; return; }
    navToFile(pid(top.product), top.folder);
  }

  function renderHome(noAnim) {
    $("#detail").style.display = "none";
    $("#styleguide").style.display = "none";
    $("#additional").style.display = "none";
    $("#materials-page").style.display = "none";
    $("#locator-page").style.display = "none";
    var trHome = $("#training-page"); if (trHome) trHome.style.display = "none";
    $("#home").style.display = "block";
    if (!noAnim) animateIn($("#home"));
    setTitle("");
    var browse = $("#browse"); if (browse) browse.style.display = "";
    var hero = $("#hero"); if (hero) hero.style.display = "";
    document.body.classList.remove("has-selection");

    // While searching, the browsing sections give way to a results view.
    var searching = !!state.query;
    ["resources", "instore-section", "store-locator", "social-hub", "additional-entry"].forEach(function (id) {
      var el = $(id.charAt(0) === "#" ? id : "#" + id); if (el) el.style.display = searching ? "none" : "";
    });
    if (searching) { renderSearch(); syncURL(); return; }

    $("#search-files").innerHTML = "";
    $("#search-files").style.display = "none";

    // Featured products in scope (brand), logos excluded.
    var vis = visibleProducts().filter(function (p) { return !p.isLogo; });
    $("#all-title").textContent = "Featured " + BRANDS[state.view].name + " products";

    var curList = currentList(state.view);
    var byName = function (a, b) { return a.name.localeCompare(b.name); };
    // current keeps the curated order by default; A–Z when the sort toggle asks.
    var current = curList
      .map(function (n) { return vis.filter(function (p) { return p.name === n; })[0]; })
      .filter(Boolean);
    if (state.sort === "az") current = current.slice().sort(byName);

    var browseCount = $("#browse-count");
    if (browseCount) browseCount.textContent = current.length + (current.length === 1 ? " product" : " products");
    $("#count-badge").textContent = current.length + (current.length === 1 ? " product" : " products");

    renderActiveFilters();

    var layoutClass = state.layout === "list" ? "grid list" : "grid";
    var allGrid = $("#all-grid");
    allGrid.className = layoutClass;
    allGrid.innerHTML = current.map(function (p) { return cardHTML(p, state.layout); }).join("") || emptyState();

    renderLogoAssets();
    renderCatalogs();
    renderSocialHub();
    renderInStore();
    renderStoreLocator();
    renderAdditionalEntry();
    bindCards($("#home"));
    syncURL();
  }

  // Friendly folder label for search result captions.
  function folderLabel(f) { return (typeof typeLabel === "function" ? typeLabel(f) : f); }

  // Search results view: matching products (cards) + matching individual files.
  function renderSearch() {
    var q = state.query;
    var byName = function (a, b) { return a.name.localeCompare(b.name); };
    var prods = searchProducts(q);
    if (state.sort === "az") prods = prods.slice().sort(byName);
    var fileRes = searchFiles(q);
    var total = prods.length + fileRes.total;
    _lastSearch = { prods: prods, fileRes: fileRes };   // Enter → open the top hit

    $("#all-title").textContent = "Search results";
    var label = total + (total === 1 ? " result" : " results");
    var bc = $("#browse-count"); if (bc) bc.textContent = label;
    $("#count-badge").textContent = label;
    renderActiveFilters();

    var allGrid = $("#all-grid");
    allGrid.className = state.layout === "list" ? "grid list" : "grid";
    allGrid.innerHTML = prods.length ? prods.map(function (p) { return cardHTML(p, state.layout); }).join("") : "";
    bindCards($("#home"));

    var sf = $("#search-files");
    sf.style.display = "";
    if (!total) {
      allGrid.innerHTML = "";
      sf.innerHTML =
        '<div class="search-empty">' + icon("search") +
          "<div><strong>No matches for “" + escapeHTML(q) + "”.</strong>" +
          "<span>Try a product name (Dash), a file type (PNG, MP4), or a category (lifestyle, packaging).</span></div>" +
          '<a class="btn ghost sm" href="mailto:' + CFG.requestEmail + "?subject=" +
            encodeURIComponent("Asset request — " + q) + '">' + icon("mail") + " Request this asset</a>" +
        "</div>";
      return;
    }

    if (!fileRes.total) { sf.innerHTML = ""; return; }
    renderFileResults(sf, fileRes, q);
  }

  // File results: a facet bar (Photos / Videos / Logos …) over relevance-ranked
  // tiles, with query matches highlighted.
  function renderFileResults(sf, fileRes, q) {
    var facetChips = "";
    if (fileRes.facets.length > 1) {
      facetChips = '<div class="sf-facets" role="tablist" aria-label="Filter results by type">' +
        '<button class="sf-facet' + (fileRes.facet ? "" : " on") + '" data-facet="">All <span>' + fileRes.total + "</span></button>" +
        fileRes.facets.map(function (fc) {
          return '<button class="sf-facet' + (fileRes.facet === fc.kind ? " on" : "") + '" data-facet="' + fc.kind + '">' +
            escapeHTML(fc.kind) + " <span>" + fc.n + "</span></button>";
        }).join("") + "</div>";
    }
    var tiles = fileRes.items.map(function (r) { return searchFileTile(r, q); }).join("");
    var more = fileRes.shownTotal > fileRes.items.length
      ? '<p class="sf-more">Showing the top ' + fileRes.items.length + " of " + fileRes.shownTotal +
        (fileRes.facet ? " " + fileRes.facet.toLowerCase() : " matching") + " files — add a word to narrow it down.</p>"
      : "";
    sf.innerHTML =
      '<div class="section-head"><h2>Matching files &amp; assets</h2><span class="badge">' + fileRes.total + "</span></div>" +
      facetChips +
      '<div class="sf-grid">' + tiles + "</div>" + more;
    bindSearchFiles(sf);
    $$(".sf-facet", sf).forEach(function (b) {
      b.addEventListener("click", function () {
        state.fileFacet = b.getAttribute("data-facet") || "";
        renderHome(true);
      });
    });
  }

  function searchFileTile(r, q) {
    var f = r.file, isVid = f.type === "video";
    var safe = r.label.replace(/"/g, "");
    var media = f.thumb
      ? '<img src="' + f.thumb + '" alt="' + safe + '" loading="lazy"/>'
      : icon(typeIcon[f.type] || "photo");
    // Everything downloads from Dropbox (nothing is hosted on the portal).
    var dl = !isVid ? (f.url || "") : "";
    // Product-less results (catalogs) route by hash instead of product + folder.
    var pName = r.product
      ? (r.product.name.indexOf(BRANDS[r.product.brand].name) === 0 ? r.product.name : BRANDS[r.product.brand].name + " " + r.product.name)
      : (r.sub || r.folder);
    var openAttr = r.openHash
      ? ' data-open="' + escapeHTML(r.openHash) + '"'
      : ' data-pid="' + pid(r.product) + '" data-folder="' + escapeHTML(r.folder) + '"';
    return '<div class="sf-cell">' +
        '<button class="sf-open"' + openAttr + ' title="' + (r.openHash ? "Open " + safe : "Open in " + pName.replace(/"/g, "")) + '">' +
          '<span class="sf-thumb' + (isVid ? " is-video" : "") + '">' + media + (isVid ? '<span class="sf-play">' + icon("play") + "</span>" : "") + "</span>" +
          '<span class="sf-meta"><span class="sf-name">' + highlight(r.label, q || "") + "</span>" +
            '<span class="sf-sub">' + (r.openHash ? highlight(r.sub || r.folder, q || "") : escapeHTML(pName) + " · " + highlight(r.folder, q || "")) +
              (f.format ? ' · <span class="sf-fmt">' + f.format + "</span>" : "") + "</span></span>" +
        "</button>" +
        (dl ? '<button class="sf-dl" data-sfdl="' + dl + '" data-sfname="' + safe + '" title="Download">' + icon("download") + "</button>" : "") +
      "</div>";
  }
  function bindSearchFiles(ctx) {
    $$(".sf-open", ctx).forEach(function (b) {
      b.addEventListener("click", function () {
        var h = b.getAttribute("data-open");            // catalogs → #catalog/<slug>
        if (h) { location.hash = h; return; }
        navToFile(b.getAttribute("data-pid"), b.getAttribute("data-folder"));
      });
    });
    $$(".sf-dl", ctx).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (b.getAttribute("data-direct")) directDownload(b.getAttribute("data-sfdl"), b.getAttribute("data-sfname"));
        else downloadOne(b.getAttribute("data-sfdl"));
      });
    });
  }
  function navToFile(pidStr, folder) {
    var p = PRODUCTS.filter(function (x) { return pid(x) === pidStr; })[0];
    if (!p) return;
    openDetail(p, folder);
    var h = productHash(p, folder);
    if (location.hash !== h) { ignoreHash = true; location.hash = h; }
  }

  // In-store marketing materials for the current brand — aggregated from each
  // product's "In-Store Marketing" folder (synced from Dropbox). Retailers browse
  // what's available and order via email.
  var INSTORE_FOLDER = "In Store Marketing Materials";
  // A product's own in-store materials, de-duplicated by base name: when a
  // transparent PNG and a white-background copy both exist, keep only the PNG so
  // retailers don't see doubles.
  function instoreOwn(p) {
    var list = (p.folders && p.folders[INSTORE_FOLDER]) || [];
    var seen = {}, out = [];
    list.forEach(function (x) {
      // Skip unnamed files (bare 64-char content-hash names) — not real materials.
      if (/^[0-9a-f]{64}$/i.test(x.name || "")) return;
      var i = seen[x.name];
      if (i === undefined) { seen[x.name] = out.length; out.push(x); }
      else if (/png/i.test(x.format) && !/png/i.test(out[i].format)) out[i] = x;
    });
    return out;
  }
  function renderInStore() {
    var box = $("#instore"); if (!box) return;
    var bk = state.view, bname = BRANDS[bk].name;
    // All orderable materials for this brand: brand-level generics + per-product.
    var mats = [];
    (window.PORTAL_INSTORE_GENERAL || []).forEach(function (x) { mats.push(x); });
    currentList(bk)
      .map(function (n) { return PRODUCTS.filter(function (p) { return p.name === n; })[0]; })
      .filter(Boolean)
      .forEach(function (p) { instoreOwn(p).forEach(function (x) { mats.push(x); }); });

    var orderCta = '<a class="btn" href="#materials">' + icon("mail") + " Order materials</a>";
    if (!mats.length) {
      box.innerHTML =
        '<div class="instore-empty">' +
          "<p>Retail displays, posters, shelf talkers and other in-store materials for " + bname +
            " will show here as they’re added — order what you need for your shop.</p>" + orderCta +
        "</div>";
      return;
    }

    // Two preview tiles (like the logos card) — clicking goes to the order page.
    var tiles = mats.slice(0, 2).map(function (x) {
      var media = x.thumb ? '<img src="' + x.thumb + '" alt="' + fileLabel(x).replace(/"/g, "") + '" loading="lazy"/>' : window.__icon("photo");
      return '<a class="logo-tile" href="#materials" title="Order marketing materials">' + media + "</a>";
    }).join("");

    box.innerHTML =
      '<div class="logo-card">' +
        '<div class="logo-card-info">' +
          '<div class="logo-card-name">Retail Marketing Materials</div>' +
          '<p class="logo-card-note">Retail displays, posters, shelf talkers and other in-store materials for ' + bname +
            " — order what you need for your shop.</p>" +
          '<div class="logo-card-actions">' + orderCta +
            '<span class="instore-count">' + mats.length + " material" + (mats.length === 1 ? "" : "s") + " available</span>" +
          "</div>" +
        "</div>" +
        '<div class="logo-preview">' + tiles + "</div>" +
      "</div>";
  }

  // ---- Catalogs & brand documents ------------------------------------------
  // Not product-specific: regional catalogs + B2B resources, each with an in-page
  // PDF viewer, a direct download, and a shareable deep link (#catalog/<slug>).
  // NOTE: the viewer needs a SAME-ORIGIN pdf — Dropbox blocks iframe embedding and
  // cross-origin fetch — which is why the Catalogs folder alone is `commitFiles`.
  function clickKey(el, fn) {
    el.addEventListener("click", fn);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); fn(e); }
    });
  }
  function loadPdfJs(cb) {
    if (window.pdfjsLib) return cb(window.pdfjsLib);
    var s = document.createElement("script");
    s.src = "assets/vendor/pdfjs/pdf.min.js";
    s.onload = function () {
      if (!window.pdfjsLib) return cb(null);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/vendor/pdfjs/pdf.worker.min.js";
      cb(window.pdfjsLib);
    };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }
  function catalogBySlug(s) { return (window.PORTAL_CATALOGS || []).filter(function (x) { return x.slug === s; })[0]; }
  function catalogFileName(c) { return (c.title + (c.region ? " - " + c.region : "")).replace(/[^\w.-]+/g, "_") + ".pdf"; }
  function catalogShareUrl(c) { return location.origin + location.pathname + "#catalog/" + c.slug; }
  function catalogDownload(c) { if (c.file) directDownload(c.file, catalogFileName(c)); else downloadOne(c.url); }

  // One card per document family (e.g. "Stündenglass 2026 Catalog"); regional
  // editions sit behind a region toggle on the card, defaulting to US.
  var CAT_REGION_ORDER = ["US", "UK", "EU", "CAD"];
  function catalogFamilies() {
    var list = window.PORTAL_CATALOGS || [], byTitle = {}, order = [];
    list.forEach(function (c) {
      if (!byTitle[c.title]) { byTitle[c.title] = { title: c.title, group: c.group, variants: [] }; order.push(c.title); }
      byTitle[c.title].variants.push(c);
    });
    return order.map(function (t) {
      var f = byTitle[t];
      f.variants.sort(function (a, b) {
        var ia = CAT_REGION_ORDER.indexOf(a.region), ib = CAT_REGION_ORDER.indexOf(b.region);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      f.primary = f.variants.filter(function (v) { return v.region === "US"; })[0] || f.variants[0];
      return f;
    });
  }
  function catalogCard(f) {
    var c = f.primary, alt = escapeHTML(f.title);
    var cover = c.thumb
      ? '<img class="cat-img" src="' + c.thumb + '" alt="' + alt + ' cover" loading="lazy" decoding="async"/>'
      : window.__icon("file");
    var multi = f.variants.length > 1;
    var regions = multi
      ? '<div class="cat-pills" role="group" aria-label="Region for ' + alt + '">' +
          f.variants.map(function (v) {
            var on = v === c;
            return '<button class="cat-pill' + (on ? " on" : "") + '" data-slug="' + v.slug + '"' +
              ' data-thumb="' + escapeHTML(v.thumb || "") + '" aria-pressed="' + on + '">' +
              escapeHTML(v.region) + "</button>";
          }).join("") + "</div>"
      : (c.region ? '<div class="cat-pills"><span class="cat-region">' + escapeHTML(c.region) + "</span></div>" : "");
    return '<div class="cat-card" data-cur="' + c.slug + '">' +
      '<div class="cat-cover" role="button" tabindex="0" data-catopen aria-label="View ' + alt + '">' +
        cover + '<span class="cat-view">' + icon("eye") + " View</span></div>" +
      '<div class="cat-meta"><span class="cat-grp">' + escapeHTML(f.group) + "</span>" +
        '<span class="cat-title">' + escapeHTML(f.title) + "</span></div>" +
      regions +
      '<div class="cat-acts">' +
        '<button class="cat-act" data-catdl>' + icon("download") + " Download</button>" +
        '<button class="cat-act" data-catshare>' + icon("link") + " Share</button>" +
      "</div></div>";
  }
  function renderCatalogs() {
    var sec = $("#catalogs-section"), box = $("#catalogs");
    if (!sec || !box) return;
    var list = window.PORTAL_CATALOGS || [];
    // Hidden until catalogs land in the Dropbox "Catalogs" folder.
    if (!list.length) { sec.style.display = "none"; box.innerHTML = ""; return; }
    sec.style.display = "";
    var cnt = $("#catalog-count");
    if (cnt) cnt.textContent = list.length + " document" + (list.length === 1 ? "" : "s");
    box.innerHTML = '<div class="cat-grid">' + catalogFamilies().map(catalogCard).join("") + "</div>";

    $$(".cat-card", box).forEach(function (card) {
      var cover = $(".cat-cover", card), img = $(".cat-img", card);
      function cur() { return catalogBySlug(card.getAttribute("data-cur")); }
      clickKey(cover, function () { openCatalog(card.getAttribute("data-cur")); });
      $$(".cat-pill", card).forEach(function (p) {
        p.addEventListener("click", function (e) {
          e.stopPropagation();
          card.setAttribute("data-cur", p.getAttribute("data-slug"));
          $$(".cat-pill", card).forEach(function (q) {
            var on = q === p;
            q.classList.toggle("on", on);
            q.setAttribute("aria-pressed", on);
          });
          var t = p.getAttribute("data-thumb");
          if (img && t) img.src = t;
          var c = cur();
          if (c && cover) cover.setAttribute("aria-label", "View " + c.title + " — " + c.region);
        });
      });
      var dl = $("[data-catdl]", card);
      if (dl) dl.addEventListener("click", function (e) { e.stopPropagation(); var c = cur(); if (c) catalogDownload(c); });
      var sh = $("[data-catshare]", card);
      if (sh) sh.addEventListener("click", function (e) {
        e.stopPropagation();
        var c = cur(); if (c) copyText(catalogShareUrl(c), "Catalog link copied");
      });
    });
  }
  function closeCatalog() {
    var ov = document.getElementById("catlb");
    if (!ov) return;
    if (ov.__key) document.removeEventListener("keydown", ov.__key);
    if (ov.__resize) window.removeEventListener("resize", ov.__resize);
    if (ov.__doc) { try { ov.__doc.destroy(); } catch (e) {} ov.__doc = null; }
    ov.remove();
    document.body.style.overflow = "";
    if (/^#catalog\//.test(location.hash)) history.replaceState(null, "", location.pathname);
  }
  function openCatalog(slug) {
    var c = catalogBySlug(slug);
    if (!c) { toast("Catalog not found"); return; }
    if (!c.file) { catalogDownload(c); return; }   // not committed yet → Dropbox
    closeCatalog();
    var ov = document.createElement("div");
    ov.className = "catlb"; ov.id = "catlb";
    ov.innerHTML =
      '<div class="catlb-bar">' +
        '<div class="catlb-t">' + escapeHTML(c.title) +
          (c.region ? ' <span class="cat-region">' + escapeHTML(c.region) + "</span>" : "") + "</div>" +
        '<div class="catlb-acts">' +
          '<button class="btn ghost sm" id="catlb-dl">' + icon("download") + " Download PDF</button>" +
          '<button class="btn ghost sm" id="catlb-share">' + icon("link") + " Share</button>" +
          '<button class="catlb-x" id="catlb-x" aria-label="Close viewer">' + icon("x") + "</button>" +
        "</div></div>" +
      '<div class="catlb-stage"><div class="catlb-load" id="catlb-load">Loading catalog…</div>' +
        '<canvas id="catlb-canvas"></canvas></div>' +
      '<div class="catlb-nav">' +
        '<button class="btn ghost sm" id="catlb-prev">' + icon("arrowLeft") + " Prev</button>" +
        '<span class="catlb-page" id="catlb-page">–</span>' +
        '<button class="btn ghost sm" id="catlb-next">Next ' + icon("arrowRight") + "</button>" +
      "</div>";
    document.body.appendChild(ov);
    document.body.style.overflow = "hidden";

    var doc = null, page = 1, busy = false;
    $("#catlb-x").addEventListener("click", closeCatalog);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeCatalog(); });
    $("#catlb-dl").addEventListener("click", function () { catalogDownload(c); });
    $("#catlb-share").addEventListener("click", function () { copyText(catalogShareUrl(c), "Catalog link copied"); });
    $("#catlb-prev").addEventListener("click", function () { go(page - 1); });
    $("#catlb-next").addEventListener("click", function () { go(page + 1); });
    ov.__key = function (e) {
      if (e.key === "Escape") closeCatalog();
      else if (e.key === "ArrowLeft") go(page - 1);
      else if (e.key === "ArrowRight") go(page + 1);
    };
    document.addEventListener("keydown", ov.__key);
    var rt = null;
    ov.__resize = function () { clearTimeout(rt); rt = setTimeout(function () { if (doc && !busy) render(); }, 180); };
    window.addEventListener("resize", ov.__resize);

    function go(n) { if (doc && !busy && n >= 1 && n <= doc.numPages) { page = n; render(); } }
    function render() {
      busy = true;
      doc.getPage(page).then(function (pg) {
        var canvas = $("#catlb-canvas"), stage = canvas.parentNode;
        var base = pg.getViewport({ scale: 1 });
        var scale = Math.min((stage.clientWidth - 24) / base.width, (stage.clientHeight - 24) / base.height);
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var vp = pg.getViewport({ scale: scale * dpr });
        canvas.width = vp.width; canvas.height = vp.height;
        canvas.style.width = Math.round(vp.width / dpr) + "px";
        canvas.style.height = Math.round(vp.height / dpr) + "px";
        return pg.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      }).then(function () {
        busy = false;
        var l = $("#catlb-load"); if (l) l.style.display = "none";
        $("#catlb-page").textContent = page + " / " + doc.numPages;
        $("#catlb-prev").disabled = page <= 1;
        $("#catlb-next").disabled = page >= doc.numPages;
      }).catch(function () { busy = false; toast("Couldn’t render that page"); });
    }
    // Never sit on "Loading catalog…" forever — hand over the PDF instead.
    var settled = false;
    var giveUp = setTimeout(function () {
      if (settled || doc) return;
      settled = true;
      toast("Viewer is taking too long — downloading instead");
      catalogDownload(c); closeCatalog();
    }, 20000);
    function bail(msg) {
      if (settled) return;
      settled = true; clearTimeout(giveUp);
      toast(msg); catalogDownload(c); closeCatalog();
    }
    loadPdfJs(function (lib) {
      if (settled) return;
      if (!lib) return bail("Viewer unavailable — downloading instead");
      lib.getDocument(c.file).promise.then(function (d) {
        if (settled) { try { d.destroy(); } catch (e) {} return; }
        settled = true; clearTimeout(giveUp);
        doc = d; ov.__doc = d; render();
      }).catch(function () { bail("Couldn’t open the catalog — downloading instead"); });
    });
  }

  // Store-locator sign-up callout — retailers request to be listed.
  function renderStoreLocator() {
    var box = $("#store-locator"); if (!box) return;
    box.innerHTML =
      '<div class="locator-card">' +
        '<div class="locator-copy">' +
          '<div class="locator-eyebrow">Retailers</div>' +
          "<h2>Get your store on our Store Locator</h2>" +
          "<p>Carry Stündenglass? Request to be added to our official store locator so customers can find your shop.</p>" +
        "</div>" +
        '<a class="btn lg" href="#locator">' + icon("mapPin") + " Request to be listed</a>" +
      "</div>";
  }

  // Bottom-of-page entry box → opens the dedicated Additional Products page.
  function renderAdditionalEntry() {
    var box = $("#additional-entry"); if (!box) return;
    var bk = state.view, legacy = legacyProducts(bk);
    if (!legacy.length) { box.innerHTML = ""; return; }
    box.innerHTML =
      '<button class="additional-entry-card" id="additional-entry-btn">' +
        '<span class="ae-main">' +
          '<span class="ae-title">Additional Products</span>' +
          '<span class="ae-sub">' + legacy.length + " older " + BRANDS[bk].name +
            " products we no longer sell — assets kept for partners who still need them.</span>" +
        "</span>" +
        '<span class="ae-go">View all →</span>' +
      "</button>";
    $("#additional-entry-btn").addEventListener("click", function () { navToAdditional(bk); });
  }

  // Dedicated page listing a brand's legacy products.
  function openAdditional(bk) {
    if (!BRANDS[bk]) { renderHome(); return; }
    $("#home").style.display = "none";
    $("#detail").style.display = "none";
    $("#styleguide").style.display = "none";
    var hero = $("#hero"); if (hero) hero.style.display = "none";
    var browse = $("#browse"); if (browse) browse.style.display = "none";
    var ad = $("#additional");
    ad.style.display = "block";
    animateIn(ad);
    window.scrollTo(0, 0);
    var legacy = legacyProducts(bk).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    ad.innerHTML =
      '<button class="back" id="add-back">' + icon("arrowLeft") + " Back to library</button>" +
      '<div class="section-head"><h2>Additional ' + BRANDS[bk].name + " Products</h2><span class=\"badge\">" + legacy.length + " product" + (legacy.length === 1 ? "" : "s") + "</span></div>" +
      '<p class="additional-note">Products we no longer sell — assets kept here for partners who still need them.</p>' +
      '<div class="grid">' + legacy.map(function (p) { return cardHTML(p, "grid"); }).join("") + "</div>";
    $("#add-back").addEventListener("click", navHome);
    bindCards(ad);
  }
  function navToAdditional(bk) {
    openAdditional(bk);
    var h = "#additional/" + bk;
    if (location.hash !== h) { ignoreHash = true; location.hash = h; }
  }

  // ---- marketing materials order page --------------------------------------
  // All orderable in-store materials: brand-level generics + any per-product
  // "In-Store Marketing" pieces.
  function availableMaterials() {
    var out = [];
    (window.PORTAL_INSTORE_GENERAL || []).forEach(function (x) {
      out.push({ name: x.name, dim: x.dim || null, thumb: x.thumb, url: x.file || x.url || null });
    });
    var seen = {};
    PRODUCTS.forEach(function (p) {
      if (p.isLogo) return;
      instoreOwn(p).forEach(function (x) {
        if (seen[x.name]) return;    // shared pieces (e.g. Retro window cling) listed once
        seen[x.name] = true;
        var lbl = instoreLabel(x);
        out.push({
          name: lbl ? lbl.name : x.name + " — " + p.name,
          dim: lbl ? lbl.dim : (x.dim || null),
          thumb: x.thumb, url: x.file || x.url || null
        });
      });
    });
    return out;
  }
  function openMaterials() {
    $("#home").style.display = "none";
    $("#detail").style.display = "none";
    $("#styleguide").style.display = "none";
    $("#additional").style.display = "none";
    var hero = $("#hero"); if (hero) hero.style.display = "none";
    var browse = $("#browse"); if (browse) browse.style.display = "none";
    var pg = $("#materials-page");
    pg.style.display = "block";
    animateIn(pg);
    setTitle("Order Marketing Materials");
    window.scrollTo(0, 0);

    var mats = availableMaterials();
    var head = '<button class="back" id="mat-back">' + icon("arrowLeft") + " Back to library</button>" +
      '<div class="section-head"><h2>Marketing Materials</h2>' +
        (mats.length ? '<span class="badge">' + mats.length + " available</span>" : "") + "</div>";

    if (!mats.length) {
      pg.innerHTML = head +
        '<div class="instore-empty"><p>Orderable in-store marketing materials will be listed here soon. In the meantime, reach out and we’ll let you know what’s available.</p>' +
        '<a class="btn ghost sm" href="mailto:' + CFG.orderEmail + "?subject=" + encodeURIComponent("Marketing Material Request") + '">' + icon("mail") + " Contact us</a></div>";
      $("#mat-back").addEventListener("click", navHome);
      return;
    }

    var lbItems = [];   // enlargeable previews (materials that have a real image)
    var rows = mats.map(function (m, i) {
      var thumb;
      if (m.thumb) {
        var li = lbItems.length;
        lbItems.push({ src: m.thumb, name: m.name, url: m.url || m.thumb });
        thumb = '<button class="mat-thumb mat-thumb-zoom" data-lbi="' + li + '" title="Click preview to enlarge" aria-label="Enlarge ' + m.name.replace(/"/g, "") + '">' +
          '<img src="' + m.thumb + '" alt="' + m.name.replace(/"/g, "") + '" loading="lazy"/>' +
          '<span class="mat-zoom-badge">' + icon("search") + "</span></button>";
      } else {
        thumb = '<div class="mat-thumb">' + window.__icon("photo") + "</div>";
      }
      return '<div class="mat-row">' + thumb +
        '<div class="mat-info"><div class="mat-name">' + m.name + "</div>" +
          (m.dim ? '<div class="mat-dim">' + m.dim + "</div>" : "") + "</div>" +
        '<div class="mat-qty"><button class="mat-step" data-step="-1" aria-label="Decrease">–</button>' +
          '<input type="number" min="0" value="0" data-mat="' + i + '" aria-label="Quantity for ' + m.name.replace(/"/g, "") + '"/>' +
          '<button class="mat-step" data-step="1" aria-label="Increase">+</button></div>' +
      "</div>";
    }).join("");

    pg.innerHTML = head +
      '<p class="mat-lead">' + icon("info") + " Set a quantity for each item, add your store details, then send your request." +
        (lbItems.length ? " Click a preview to enlarge it." : "") + "</p>" +
      '<div class="mat-layout">' +
        '<div class="mat-list">' + rows + "</div>" +
        '<aside class="mat-side">' +
          '<div class="mat-side-h">Your details</div>' +
          '<div class="mat-fields">' +
            '<label class="mat-field"><span>Store Name</span><input type="text" id="mat-store-name" placeholder="Store name"/></label>' +
            '<label class="mat-field"><span>Mailing Address</span><input type="text" id="mat-store-address" placeholder="Street, City, State, ZIP"/></label>' +
            '<label class="mat-field"><span>Email Address</span><input type="email" id="mat-store-email" placeholder="you@store.com"/></label>' +
          "</div>" +
          '<button class="btn lg mat-order-btn" id="mat-order">' + icon("mail") + ' Order Materials<span id="mat-count"></span></button>' +
          '<p class="mat-side-note">You’ll confirm and send from your email app.</p>' +
        "</aside>" +
      "</div>";

    function updateMatCount() {
      var n = 0;
      $$("[data-mat]", pg).forEach(function (inp) { n += Math.max(0, parseInt(inp.value, 10) || 0); });
      var c = $("#mat-count"); if (c) c.textContent = n ? " · " + n : "";
    }
    $("#mat-back").addEventListener("click", navHome);
    $$(".mat-step", pg).forEach(function (b) {
      b.addEventListener("click", function () {
        var inp = b.parentNode.querySelector("input");
        inp.value = Math.max(0, (parseInt(inp.value, 10) || 0) + parseInt(b.getAttribute("data-step"), 10));
        updateMatCount();
      });
    });
    $$("[data-mat]", pg).forEach(function (inp) { inp.addEventListener("input", updateMatCount); });
    $$("[data-lbi]", pg).forEach(function (t) {
      t.addEventListener("click", function () { openLightbox(lbItems, +t.getAttribute("data-lbi")); });
    });
    $("#mat-order").addEventListener("click", function () { submitMaterialOrder(mats); });
  }
  function submitMaterialOrder(mats) {
    var lines = [];
    $$("[data-mat]", $("#materials-page")).forEach(function (inp) {
      var q = parseInt(inp.value, 10) || 0;
      if (q > 0) lines.push(mats[+inp.getAttribute("data-mat")].name + " — Qty: " + q);
    });
    if (!lines.length) { toast("Set a quantity for at least one item first"); return; }
    var v = function (id) { var el = $(id); return el ? el.value.trim() : ""; };
    var body = "Store Name: " + v("#mat-store-name") +
      "\nAddress: " + v("#mat-store-address") +
      "\nE-Mail Address: " + v("#mat-store-email") +
      "\n\nRequested Marketing Materials:\n" + lines.join("\n");
    window.location.href = "mailto:" + CFG.orderEmail + "?subject=" +
      encodeURIComponent("Marketing Material Request") + "&body=" + encodeURIComponent(body);
  }
  function navMaterials() {
    openMaterials();
    if (location.hash !== "#materials") { ignoreHash = true; location.hash = "materials"; }
  }

  // ---- product training / certification ------------------------------------
  function hasTraining(p) { return !!(window.PORTAL_TRAINING && window.PORTAL_TRAINING[p.name]); }
  // Entry banner on the product page → opens the training/certification course.
  function trainingEntryHTML(p) {
    if (p.isLogo || !hasTraining(p)) return "";
    var cert = getCert(p);
    return '<button class="trn-entry" id="train-entry">' +
      '<span class="trn-entry-ic">' + icon("graduation") + "</span>" +
      '<span class="trn-entry-txt">' +
        '<span class="trn-entry-t">' + (cert ? "You’re a certified " + p.name + " Specialist" : "Become a " + p.name + " Product Specialist") + "</span>" +
        '<span class="trn-entry-s">' + (cert ? "Certificate earned " + cert.date + " · review the course or retake anytime" : "Watch the videos, learn the product, and pass a short quiz to get certified.") + "</span>" +
      "</span>" +
      '<span class="trn-entry-go">' + (cert ? icon("check") + " Certified" : "Start training →") + "</span>" +
    "</button>";
  }
  function trainingHash(p) { return "#train/" + p.brand + "/" + slugify(p.name); }
  function certKey(p) { return "gp-cert-" + p.brand + "-" + slugify(p.name); }
  function getCert(p) { try { return JSON.parse(localStorage.getItem(certKey(p)) || "null"); } catch (e) { return null; } }
  function saveCert(p, data) { try { localStorage.setItem(certKey(p), JSON.stringify(data)); } catch (e) {} }
  function navTraining(p) {
    openTraining(p);
    var h = trainingHash(p);
    if (location.hash !== h) { ignoreHash = true; location.hash = h; }
  }
  function fullProductName(p) { return p.name.indexOf(BRANDS[p.brand].name) === 0 ? p.name : BRANDS[p.brand].name + " " + p.name; }

  function openTraining(p) {
    $("#home").style.display = "none";
    $("#detail").style.display = "none";
    $("#styleguide").style.display = "none";
    $("#additional").style.display = "none";
    $("#materials-page").style.display = "none";
    $("#locator-page").style.display = "none";
    var hero = $("#hero"); if (hero) hero.style.display = "none";
    var browse = $("#browse"); if (browse) browse.style.display = "none";
    var pg = $("#training-page");
    pg.style.display = "block";
    animateIn(pg);
    window.scrollTo(0, 0);

    var t = window.PORTAL_TRAINING[p.name];
    var name = fullProductName(p);
    setTitle(name + " Training");
    var cert = getCert(p);

    var modulesHTML = t.modules.map(function (m, i) {
      return '<div class="trn-module">' +
        '<div class="trn-module-h"><span class="trn-step-n">' + (i + 1) + "</span><h3>" + m.title + "</h3></div>" +
        '<ul class="trn-points">' + m.points.map(function (pt) { return "<li>" + pt + "</li>"; }).join("") + "</ul>" +
      "</div>";
    }).join("");

    pg.innerHTML =
      '<button class="back" id="trn-back">' + icon("arrowLeft") + " Back to " + name + "</button>" +
      '<div class="trn-hero">' +
        '<div class="trn-badge">' + icon("graduation") + "</div>" +
        '<div class="trn-hero-txt">' +
          '<div class="trn-eyebrow">Product Specialist Training' + (cert ? " · <span class=\"trn-done\">" + icon("check") + " Certified</span>" : "") + "</div>" +
          "<h2>" + name + "</h2>" +
          "<p>" + t.tagline + "</p>" +
          '<div class="trn-meta">' + icon("eye") + " " + p.videos.length + " videos · " + t.modules.length + " lessons · " + t.quiz.length + "-question quiz · ~" + t.minutes + " min</div>" +
        "</div>" +
      "</div>" +
      // 1 — Watch
      '<div class="section-head"><span class="trn-sec-n">1</span><h2>Watch</h2></div>' +
      '<p class="trn-lead">' + icon("info") + " Watch the how-to-use and cleaning videos — click a video to play it in the large viewer, or download it.</p>" +
      videoHubGridHTML(p) +
      // 2 — Learn
      '<div class="section-head"><span class="trn-sec-n">2</span><h2>Learn</h2></div>' +
      '<div class="trn-modules">' + modulesHTML + "</div>" +
      // 3 — Certify
      '<div class="section-head"><span class="trn-sec-n">3</span><h2>Get Certified</h2></div>' +
      '<p class="trn-lead">' + icon("info") + " Answer all " + t.quiz.length + " questions. Score " + t.passPct + "% or higher to earn your certificate.</p>" +
      '<div id="trn-quiz"></div>';

    $("#trn-back").addEventListener("click", function () { navTo(p); });
    bindVideoHub(pg, p);
    renderQuiz(p, t);
  }

  // Reuse the video-hub cards (play / download / YouTube) without its own heading.
  function videoHubGridHTML(p) {
    var html = videoHubHTML(p);
    // strip the leading section-head + note so it sits under the training "Watch" head
    return html.replace(/^<div class="section-head">[\s\S]*?<\/div>\s*<p class="vhub-note">[\s\S]*?<\/p>/, "");
  }
  function bindVideoHub(ctx, p) {
    $$("[data-play]", ctx).forEach(function (el) {
      el.addEventListener("click", function () {
        openVideoModal(el.getAttribute("data-play"), el.getAttribute("data-title"), el.getAttribute("data-dl"), el.getAttribute("data-dlname"));
      });
    });
    $$("[data-vdl]", ctx).forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); directDownload(b.getAttribute("data-vdl"), b.getAttribute("data-vname")); });
    });
    $$("[data-soon]", ctx).forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); toast("Downloadable file coming soon — Dropbox link on the way"); });
    });
  }

  function renderQuiz(p, t) {
    var box = $("#trn-quiz");
    var questions = '<form id="trn-form" class="trn-quiz">' + t.quiz.map(function (item, qi) {
      var choices = item.choices.map(function (c, ci) {
        return '<label class="trn-choice"><input type="radio" name="q' + qi + '" value="' + ci + '"/>' +
          '<span class="trn-choice-mark"></span><span class="trn-choice-t">' + c + "</span></label>";
      }).join("");
      return '<div class="trn-q" data-qi="' + qi + '">' +
        '<div class="trn-q-n">Question ' + (qi + 1) + " of " + t.quiz.length + "</div>" +
        '<div class="trn-q-t">' + item.q + "</div>" +
        '<div class="trn-choices">' + choices + "</div>" +
        '<div class="trn-why" hidden></div>' +
      "</div>";
    }).join("") +
      '<div class="trn-actions"><button type="button" class="btn lg" id="trn-submit">' + icon("check") + " Submit Answers</button>" +
        '<span class="trn-progress" id="trn-progress"></span></div>' +
    "</form>" +
      '<div id="trn-result"></div>';
    box.innerHTML = questions;

    function answered() { return t.quiz.filter(function (_, qi) { return $("#trn-form").querySelector('input[name="q' + qi + '"]:checked'); }).length; }
    function updateProgress() { $("#trn-progress").textContent = answered() + " / " + t.quiz.length + " answered"; }
    updateProgress();
    $$('#trn-form input[type="radio"]', box).forEach(function (r) { r.addEventListener("change", updateProgress); });

    $("#trn-submit").addEventListener("click", function () {
      if (answered() < t.quiz.length) { toast("Please answer all " + t.quiz.length + " questions first"); return; }
      var correct = 0;
      t.quiz.forEach(function (item, qi) {
        var qEl = box.querySelector('.trn-q[data-qi="' + qi + '"]');
        var chosen = parseInt($("#trn-form").querySelector('input[name="q' + qi + '"]:checked').value, 10);
        qEl.classList.add("graded");
        $$(".trn-choice", qEl).forEach(function (lab, ci) {
          lab.classList.remove("is-correct", "is-wrong");
          if (ci === item.answer) lab.classList.add("is-correct");
          else if (ci === chosen) lab.classList.add("is-wrong");
          lab.querySelector("input").disabled = true;
        });
        if (chosen === item.answer) correct++;
        var why = qEl.querySelector(".trn-why");
        why.hidden = false;
        why.innerHTML = (chosen === item.answer ? '<span class="trn-tag ok">' + icon("check") + " Correct</span> " : '<span class="trn-tag no">Incorrect</span> ') + item.why;
      });
      var pct = Math.round((correct / t.quiz.length) * 100);
      var passed = pct >= t.passPct;
      renderResult(p, t, correct, pct, passed);
      $("#trn-result").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderResult(p, t, correct, pct, passed) {
    var res = $("#trn-result");
    if (!passed) {
      res.innerHTML = '<div class="trn-result fail">' +
        '<div class="trn-score">' + pct + '%<span>' + correct + " / " + t.quiz.length + "</span></div>" +
        '<div class="trn-result-txt"><strong>Not quite — you need ' + t.passPct + "% to certify.</strong>" +
          "<span>Review the explanations above, then try again.</span></div>" +
        '<button class="btn" id="trn-retry">' + icon("refresh") + " Retry quiz</button>" +
      "</div>";
      $("#trn-retry").addEventListener("click", function () { renderQuiz(p, t); window.scrollTo({ top: $("#trn-quiz").offsetTop - 80, behavior: "smooth" }); });
      return;
    }
    res.innerHTML = '<div class="trn-result pass">' +
      '<div class="trn-score">' + pct + '%<span>' + correct + " / " + t.quiz.length + "</span></div>" +
      '<div class="trn-result-txt"><strong>' + icon("check") + " You passed!</strong>" +
        "<span>Enter your name to generate your Product Specialist certificate.</span></div>" +
    "</div>" +
    '<div class="trn-certform">' +
      '<label class="mat-field"><span>Your Name</span><input type="text" id="trn-name" placeholder="Full name" autocomplete="name"/></label>' +
      '<button class="btn lg" id="trn-getcert">' + icon("award") + " Get My Certificate</button>" +
    "</div>" +
    '<div id="trn-cert"></div>';
    $("#trn-getcert").addEventListener("click", function () {
      var nm = ($("#trn-name").value || "").trim();
      if (!nm) { toast("Enter your name for the certificate"); $("#trn-name").focus(); return; }
      var d = new Date();
      var dateStr = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      saveCert(p, { name: nm, date: dateStr, score: pct });
      showCertificate(p, t, nm, dateStr, pct);
    });
  }

  // Short deterministic certificate ID from the recipient + product + date.
  function certId(seed) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var b = h.toString(36).toUpperCase(); while (b.length < 6) b = "0" + b;
    return "SG-" + b.slice(0, 3) + "-" + b.slice(3, 6);
  }
  // Gold foil seal (SVG): curved "CERTIFIED PRODUCT SPECIALIST" ring + score.
  function certSealHTML(pct) {
    return '<div class="cert-seal" aria-hidden="true">' +
      '<svg viewBox="0 0 132 132">' +
        '<defs><path id="cert-seal-arc" d="M66 66 m-49 0 a49 49 0 1 1 98 0"/></defs>' +
        '<circle class="cs-ring" cx="66" cy="66" r="62"/>' +
        '<circle class="cs-ring cs-ring2" cx="66" cy="66" r="50"/>' +
        '<text class="cs-arc"><textPath href="#cert-seal-arc" startOffset="50%">CERTIFIED · PRODUCT SPECIALIST</textPath></text>' +
        '<text class="cs-star" x="66" y="46">★</text>' +
        '<text class="cs-score" x="66" y="76">' + pct + '%</text>' +
        '<text class="cs-sub" x="66" y="94">STÜNDENGLASS</text>' +
      "</svg></div>";
  }
  function showCertificate(p, t, nm, dateStr, pct) {
    var name = fullProductName(p);
    var cid = certId(nm + "|" + name + "|" + dateStr);
    var box = $("#trn-cert");
    box.innerHTML =
      '<div class="cert" id="cert-card">' +
        '<div class="cert-inner">' +
          '<div class="cert-logo"><img src="assets/img/stundenglass-wordmark-black.png" alt="Stündenglass" /></div>' +
          '<div class="cert-eyebrow">Stündenglass · Product Specialist Program</div>' +
          '<h3 class="cert-award">Certificate of Completion</h3>' +
          '<div class="cert-presented">This certifies that</div>' +
          '<div class="cert-name">' + escapeHTML(nm) + "</div>" +
          '<div class="cert-desc">has successfully completed the Product Specialist training and demonstrated expert product knowledge of the</div>' +
          '<div class="cert-product">' + name + "</div>" +
          certSealHTML(pct) +
          '<div class="cert-foot">' +
            '<div class="cert-fcol"><span class="cert-fv">' + dateStr + '</span><span class="cert-fl">Date Issued</span></div>' +
            '<div class="cert-fcol"><span class="cert-fv cert-sig">Stündenglass</span><span class="cert-fl">Authorized By</span></div>' +
            '<div class="cert-fcol"><span class="cert-fv">' + cid + '</span><span class="cert-fl">Certificate ID</span></div>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="trn-certactions cert-print-hide">' +
        '<button class="btn lg" id="cert-print">' + icon("printer") + " Print certificate</button>" +
        '<button class="btn ghost" id="cert-dl">' + icon("download") + " Download image</button>" +
        '<button class="btn ghost" id="cert-email">' + icon("mail") + " Email my certification</button>" +
      "</div>";
    $("#cert-print").addEventListener("click", function () { window.print(); });
    $("#cert-dl").addEventListener("click", function () { downloadCertificate(name, nm, dateStr, pct, cid); });
    $("#cert-email").addEventListener("click", function () {
      var body = "I completed the " + name + " Product Specialist training.\n\nName: " + nm +
        "\nProduct: " + name + "\nScore: " + pct + "%\nDate: " + dateStr;
      window.location.href = "mailto:" + CFG.orderEmail + "?subject=" +
        encodeURIComponent(name + " — Product Specialist Certification") + "&body=" + encodeURIComponent(body);
    });
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Certified! 🎓");
  }

  // Draw the (light, print-style) certificate to a canvas and download as PNG.
  function downloadCertificate(product, nm, dateStr, pct, cid) {
    var W = 1650, H = 1170, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d");
    var GOLD = "#B8892E", INK = "#15150F", CREAM = "#FBF9F2", MUTE = "#6E6E62", cx = W / 2;
    function ls(v) { try { x.letterSpacing = v; } catch (e) {} }
    x.fillStyle = CREAM; x.fillRect(0, 0, W, H);
    x.strokeStyle = INK; x.lineWidth = 6; x.strokeRect(46, 46, W - 92, H - 92);
    x.strokeStyle = GOLD; x.lineWidth = 2; x.strokeRect(64, 64, W - 128, H - 128);
    x.textAlign = "center"; x.textBaseline = "alphabetic";
    // official brandmark PNG → ~132px, centered near the top
    if (CERT_LOGO.complete && CERT_LOGO.naturalWidth) {
      var lw = 132, lh = Math.round(lw * (CERT_LOGO.naturalHeight / CERT_LOGO.naturalWidth));
      x.drawImage(CERT_LOGO, cx - lw / 2, 96, lw, lh);
    }
    ls("4px"); x.fillStyle = GOLD; x.font = "700 22px Archivo, Arial, sans-serif";
    x.fillText("STÜNDENGLASS · PRODUCT SPECIALIST PROGRAM", cx, 322); ls("0px");
    x.fillStyle = INK; x.font = "800 46px Archivo, Arial, sans-serif"; x.fillText("Certificate of Completion", cx, 388);
    x.fillStyle = MUTE; x.font = "400 24px Archivo, Arial, sans-serif"; x.fillText("This certifies that", cx, 462);
    x.fillStyle = INK; x.font = "800 78px Archivo, Arial, sans-serif"; x.fillText(nm, cx, 552);
    x.fillStyle = GOLD; x.fillRect(cx - 150, 582, 300, 3);
    x.fillStyle = MUTE; x.font = "400 23px Archivo, Arial, sans-serif";
    x.fillText("has successfully completed the Product Specialist training", cx, 648);
    x.fillText("and demonstrated expert product knowledge of the", cx, 682);
    x.fillStyle = INK; x.font = "800 46px Archivo, Arial, sans-serif"; x.fillText(product, cx, 748);
    // gold seal
    var scy = 872, r = 70;
    x.strokeStyle = GOLD; x.lineWidth = 3; x.beginPath(); x.arc(cx, scy, r, 0, 7); x.stroke();
    x.lineWidth = 1.5; x.beginPath(); x.arc(cx, scy, r - 10, 0, 7); x.stroke();
    x.fillStyle = GOLD; x.font = "700 26px Archivo, Arial, sans-serif"; x.fillText("★", cx, scy - 16);
    x.fillStyle = INK; x.font = "800 34px Archivo, Arial, sans-serif"; x.fillText(pct + "%", cx, scy + 12);
    ls("1.5px"); x.fillStyle = GOLD; x.font = "700 11px Archivo, Arial, sans-serif"; x.fillText("STÜNDENGLASS", cx, scy + 38); ls("0px");
    // footer columns
    var fy = 1035, cols = [[dateStr, "DATE ISSUED"], ["Stündenglass", "AUTHORIZED BY"], [cid || "", "CERTIFICATE ID"]], xs = [cx - 400, cx, cx + 400];
    cols.forEach(function (col, i) {
      x.strokeStyle = GOLD; x.lineWidth = 1; x.beginPath(); x.moveTo(xs[i] - 120, fy - 34); x.lineTo(xs[i] + 120, fy - 34); x.stroke();
      x.fillStyle = INK; x.font = "700 24px Archivo, Arial, sans-serif"; x.fillText(col[0], xs[i], fy);
      ls("2px"); x.fillStyle = MUTE; x.font = "600 13px Archivo, Arial, sans-serif"; x.fillText(col[1], xs[i], fy + 28); ls("0px");
    });
    var fname = product.replace(/[^\w.-]+/g, "_") + "_Certificate.png";
    if (c.toBlob) {
      c.toBlob(function (blob) {
        var href = URL.createObjectURL(blob);
        directDownload(href, fname);
        setTimeout(function () { URL.revokeObjectURL(href); }, 8000);
      }, "image/png");
    } else {
      directDownload(c.toDataURL("image/png"), fname);
    }
  }

  // ---- store locator request page ------------------------------------------
  // A retailer fills in one or more store locations and submits them all as a
  // single email to the marketing team (CFG.locatorEmail).
  function storeBlockHTML(n) {
    return '<div class="loc-store" data-store>' +
        '<div class="loc-store-h">' +
          '<span class="loc-store-n">Store <span class="loc-store-i">' + n + "</span></span>" +
          '<button class="loc-remove" data-remove title="Remove this store">' + icon("trash") + " Remove</button>" +
        "</div>" +
        '<div class="loc-fields">' +
          '<label class="mat-field loc-wide"><span>Store Name</span><input type="text" data-f="name" placeholder="Store name"/></label>' +
          '<label class="mat-field loc-wide"><span>Address</span><input type="text" data-f="address" placeholder="123 Main St, City, State ZIP"/></label>' +
          '<div class="loc-row">' +
            '<label class="mat-field"><span>Phone</span><input type="tel" data-f="phone" placeholder="(555) 555-5555"/></label>' +
            '<label class="mat-field"><span>Website</span><input type="text" data-f="website" placeholder="yourstore.com"/></label>' +
          "</div>" +
        "</div>" +
      "</div>";
  }
  function openLocator() {
    $("#home").style.display = "none";
    $("#detail").style.display = "none";
    $("#styleguide").style.display = "none";
    $("#additional").style.display = "none";
    $("#materials-page").style.display = "none";
    var hero = $("#hero"); if (hero) hero.style.display = "none";
    var browse = $("#browse"); if (browse) browse.style.display = "none";
    var pg = $("#locator-page");
    pg.style.display = "block";
    animateIn(pg);
    setTitle("Store Locator Request");
    window.scrollTo(0, 0);

    pg.innerHTML =
      '<button class="back" id="loc-back">' + icon("arrowLeft") + " Back to library</button>" +
      '<div class="section-head"><h2>Store Locator Request</h2></div>' +
      '<p class="mat-lead">' + icon("info") + "<span>Add each store you'd like listed on our official locator, then send your request. Have more than one location? Use <strong>Add another store</strong> to include them all.</span>" +
      "</p>" +
      '<div class="mat-layout">' +
        '<div class="loc-left">' +
          '<div class="loc-stores" id="loc-stores">' + storeBlockHTML(1) + "</div>" +
          '<button class="btn ghost loc-add" id="loc-add">' + icon("plus") + " Add another store</button>" +
        "</div>" +
        '<aside class="mat-side">' +
          '<div class="mat-side-h">Your contact info</div>' +
          '<div class="mat-fields">' +
            '<label class="mat-field"><span>Your Name</span><input type="text" id="loc-contact-name" placeholder="Full name"/></label>' +
            '<label class="mat-field"><span>Email Address</span><input type="email" id="loc-contact-email" placeholder="you@company.com"/></label>' +
            '<label class="mat-field"><span>Phone <em>(optional)</em></span><input type="tel" id="loc-contact-phone" placeholder="(555) 555-5555"/></label>' +
          "</div>" +
          '<button class="btn lg mat-order-btn" id="loc-submit">' + icon("mail") + ' Submit Request<span id="loc-count"></span></button>' +
          '<p class="mat-side-note">You’ll confirm and send from your email app.</p>' +
        "</aside>" +
      "</div>";

    var stores = $("#loc-stores");
    function renumber() {
      $$(".loc-store", stores).forEach(function (s, i) {
        var n = s.querySelector(".loc-store-i"); if (n) n.textContent = i + 1;
      });
      var multi = $$(".loc-store", stores).length > 1;
      stores.classList.toggle("has-multi", multi);
      var c = $("#loc-count"); if (c) c.textContent = multi ? " · " + $$(".loc-store", stores).length + " stores" : "";
    }
    function bindRemove(ctx) {
      $$("[data-remove]", ctx).forEach(function (b) {
        if (b.__bound) return; b.__bound = true;
        b.addEventListener("click", function () {
          if ($$(".loc-store", stores).length <= 1) { toast("At least one store is required"); return; }
          b.closest(".loc-store").remove();
          renumber();
        });
      });
    }
    $("#loc-add").addEventListener("click", function () {
      stores.insertAdjacentHTML("beforeend", storeBlockHTML($$(".loc-store", stores).length + 1));
      bindRemove(stores);
      renumber();
      var last = stores.lastElementChild;
      if (last) { var f = last.querySelector("input"); if (f) f.focus(); }
    });

    bindRemove(stores);
    renumber();
    $("#loc-back").addEventListener("click", navHome);
    $("#loc-submit").addEventListener("click", submitLocatorRequest);
  }
  function submitLocatorRequest() {
    var stores = $$("#loc-stores .loc-store");
    var blocks = [], valid = 0;
    stores.forEach(function (s, i) {
      var g = function (f) { var el = s.querySelector('[data-f="' + f + '"]'); return el ? el.value.trim() : ""; };
      var name = g("name"), address = g("address"), phone = g("phone"), website = g("website");
      if (name || address || phone || website) valid++;
      blocks.push(
        "Store " + (i + 1) + ":" +
        "\n  Store Name: " + name +
        "\n  Address: " + address +
        "\n  Phone: " + phone +
        "\n  Website: " + website
      );
    });
    if (!valid) { toast("Add at least one store's details first"); return; }
    var v = function (id) { var el = $(id); return el ? el.value.trim() : ""; };
    var body = "Store Locator Request" +
      "\n\nSubmitted by: " + v("#loc-contact-name") +
      "\nContact Email: " + v("#loc-contact-email") +
      "\nContact Phone: " + v("#loc-contact-phone") +
      "\n\n" + blocks.join("\n\n");
    window.location.href = "mailto:" + CFG.locatorEmail + "?subject=" +
      encodeURIComponent("Add to Store Locator") + "&body=" + encodeURIComponent(body);
  }
  function emptyState() {
    return '<p style="grid-column:1/-1;color:var(--stone);font-size:14px;padding:30px 0;">No assets match your filters. <a href="mailto:' + CFG.requestEmail + '" style="text-decoration:underline;">Request one →</a></p>';
  }

  function bindCards(ctx) {
    $$(".card", ctx).forEach(function (card) {
      var id = card.getAttribute("data-id");
      var p = PRODUCTS.filter(function (x) { return pid(x) === id; })[0];
      card.addEventListener("click", function (e) {
        var act = e.target.closest("[data-act]");
        if (act) {
          e.stopPropagation();
          downloadAll(p);
          return;
        }
        navTo(p);
      });
      card.addEventListener("keydown", function (e) { if (e.key === "Enter") navTo(p); });
    });
  }

  // ---- rendering: detail ---------------------------------------------------
  function openDetail(p, initialFolder) {
    $("#home").style.display = "none";
    $("#styleguide").style.display = "none";
    var dBrowse = $("#browse"); if (dBrowse) dBrowse.style.display = "none";
    var dHero = $("#hero"); if (dHero) dHero.style.display = "none";
    $("#additional").style.display = "none";
    var d = $("#detail");
    d.style.display = "block";
    animateIn(d);
    window.scrollTo(0, 0);
    recordRecent(p);

    // The In-Store Marketing folder also has its own section below the gallery. In
    // the gallery it's PNG-de-duplicated (no white-bg doubles) and pinned as the
    // last tab.
    if ((p.folders[INSTORE_FOLDER] || []).length) p.folders[INSTORE_FOLDER] = instoreOwn(p);
    var folderNames = Object.keys(p.folders).filter(function (f) { return (p.folders[f] || []).length; });

    // ---- N-level folder browser. Folder keys are full "/"-joined paths
    // ("Black / Product Photos / Studio"). We navigate them like a file tree:
    // `openPath` is the current folder ("" = product root); its child folders show
    // as cards, its own files show in the gallery, and a breadcrumb walks back up.
    var SEP = " / ";
    // Immediate child folder segments directly under `path`.
    function childSegs(path) {
      var prefix = path ? path + SEP : "", seen = {}, out = [];
      folderNames.forEach(function (f) {
        var rest;
        if (!path) rest = f;
        else if (f === path) return;                 // the folder itself, not a child
        else if (f.indexOf(prefix) === 0) rest = f.slice(prefix.length);
        else return;
        var seg = rest.split(SEP)[0];
        if (seg && !seen[seg]) { seen[seg] = 1; out.push(seg); }
      });
      return out;
    }
    function joinPath(path, seg) { return path ? path + SEP + seg : seg; }
    function isFolderBranch(path) { return childSegs(path).length > 0; }
    function lastSeg(path) { var s = path.split(SEP); return s[s.length - 1]; }
    // Total files at `path` and everything beneath it.
    function filesUnder(path) {
      var prefix = path ? path + SEP : "", n = 0;
      folderNames.forEach(function (f) {
        if (path ? (f === path || f.indexOf(prefix) === 0) : true) n += (p.folders[f] || []).length;
      });
      return n;
    }
    // Sort a path's child segments: canonical categories first, then by files, A–Z.
    function sortSegs(path, segs) {
      return segs.slice().sort(function (a, b) {
        if (a === INSTORE_FOLDER) return 1; if (b === INSTORE_FOLDER) return -1;
        return (folderRank(a) - folderRank(b)) || (filesUnder(joinPath(path, b)) - filesUnder(joinPath(path, a))) || a.localeCompare(b);
      });
    }
    var openPath = "";                 // current folder ("" = product root)
    var active = "";                   // folder whose files show in the gallery (== openPath)
    // Deep-link straight to a folder (from a file-search result, or a shared
    // "Copy folder link" URL). Accepts a BRANCH path too (e.g. "Black", which
    // holds no files itself), so a shared link can land on any level.
    if (initialFolder && (p.folders[initialFolder] || isFolderBranch(initialFolder))) {
      openPath = initialFolder; active = initialFolder;
    }
    var selected = {};   // fileKey -> file object; persists while switching folder tabs

    function folderFiles() { return p.folders[active] || []; }
    function selectedList() { return Object.keys(selected).map(function (k) { return selected[k]; }); }
    function toggle(file, on) {
      var k = fileKey(active, file);
      if (on) selected[k] = file; else delete selected[k];
    }
    // Reflect selection state into the DOM without a full re-render.
    function syncSelection() {
      var n = Object.keys(selected).length;
      var bar = $("#selbar");
      if (bar) { $("#sel-n").textContent = n; bar.classList.toggle("show", n > 0); }
      document.body.classList.toggle("has-selection", n > 0);
      var ff = folderFiles();
      var some = ff.some(function (f) { return selected[fileKey(active, f)]; });
      var all = ff.length > 0 && ff.every(function (f) { return selected[fileKey(active, f)]; });
      var sa = $("#sel-all");
      if (sa) { sa.checked = all; sa.indeterminate = some && !all; }
      $$(".gcell", $("#gallery")).forEach(function (cell) {
        var k = cell.getAttribute("data-key"), on = !!selected[k];
        cell.classList.toggle("sel", on);
        var cb = $(".gcheck", cell); if (cb) cb.checked = on;
      });
    }

    // A folder card shows a real photo from inside the folder rather than a generic
    // icon. Prefer a still product shot: it reads as a cover, whereas a lifestyle
    // crop or a video poster frame is often ambiguous at thumbnail size.
    var _coverCache = {};
    function folderCover(path) {
      if (path in _coverCache) return _coverCache[path];
      var prefix = path + SEP, best = null, fallback = null;
      Object.keys(p.folders).forEach(function (f) {
        if (f !== path && f.indexOf(prefix) !== 0) return;      // this folder or below it
        var isProductShot = /product photos/i.test(f);
        (p.folders[f] || []).forEach(function (x) {
          if (!x.thumb) return;
          if (!fallback) fallback = x.thumb;                     // anything with a thumbnail
          if (best) return;
          if (isProductShot && x.type === "image") best = x.thumb;
        });
      });
      // No product shot? fall back to the first image anywhere under here, then to
      // any thumbnail at all (e.g. a video poster).
      if (!best) {
        Object.keys(p.folders).forEach(function (f) {
          if (best || (f !== path && f.indexOf(prefix) !== 0)) return;
          (p.folders[f] || []).forEach(function (x) {
            if (!best && x.thumb && x.type === "image") best = x.thumb;
          });
        });
      }
      _coverCache[path] = best || fallback || null;
      return _coverCache[path];
    }

    function render() {
      active = openPath;   // gallery + selection always target the open folder
      // N-level folder browser: child folders of openPath shown as cards, a
      // breadcrumb back to the root, and openPath's own files in the gallery below.
      function catCard(label, ic, count, path, cls) {
        var cover = folderCover(path);
        // If the image 404s (pruned thumbnail), swap back to the icon rather than
        // leaving a broken-image box on the card.
        var media = cover
          ? '<span class="catcard-ic has-img"><img src="' + escapeHTML(cover) + '" alt="" loading="lazy" decoding="async"' +
              " onerror=\"this.parentNode.classList.remove('has-img');this.parentNode.innerHTML=window.__icon('" + ic + "')\"/></span>"
          : '<span class="catcard-ic">' + icon(ic) + "</span>";
        return '<button class="catcard ' + (cls || "") + '" data-path="' + escapeHTML(path) + '">' +
          media +
          '<span class="catcard-tx"><span class="catcard-name">' + label + "</span>" +
          '<span class="catcard-c">' + count + "</span></span></button>";
      }
      function fcount(n) { return n + " file" + (n === 1 ? "" : "s"); }
      var kids = sortSegs(openPath, childSegs(openPath));
      var navCards = kids.map(function (seg) {
        var fp = joinPath(openPath, seg), branch = isFolderBranch(fp), sub = branch ? childSegs(fp).length : 0;
        var count = branch
          ? (sub + (sub === 1 ? " folder · " : " folders · ") + filesUnder(fp) + " files")
          : fcount((p.folders[fp] || []).length);
        return catCard(typeLabel(seg), branch ? "stack" : folderIcon(seg), count, fp, branch ? "is-branch" : (fp === active ? "on" : ""));
      }).join("");
      // Breadcrumb — appears once drilled in from the root.
      var crumb = "";
      if (openPath) {
        var segs = openPath.split(SEP), acc = "";
        crumb = '<div class="folder-crumb"><button class="crumb-btn" data-path="">' + icon("arrowLeft") + " All folders</button>";
        segs.forEach(function (s, i) {
          acc = acc ? acc + SEP + s : s;
          crumb += '<span class="crumb-sep">/</span>' + (i < segs.length - 1
            ? '<button class="crumb-btn crumb-mid" data-path="' + escapeHTML(acc) + '">' + typeLabel(s) + "</button>"
            : '<span class="crumb-cur">' + typeLabel(s) + "</span>");
        });
        crumb += "</div>";
      }
      var assetNav = crumb +
        (kids.length > 4 ? '<div class="catgrid-hint"><span>Swipe to see more</span>' + icon("arrowRight") + "</div>" : "") +
        (kids.length ? '<div class="catgrid" id="asset-nav">' + navCards + "</div>" : "");
      var activeCount = (p.folders[openPath] || []).length;   // files directly in this folder
      var activeLabel = openPath ? typeLabel(openPath.split(SEP).pop()) : "";
      var catTotal = folderNames.reduce(function (s, f) { return s + p.folders[f].length; }, 0);
      // Eyebrow shows the product type (falls back to category); the title is the
      // full brand-prefixed name (e.g. "Stündenglass Gravity Infuser"), without
      // double-prefixing names that already lead with the brand.
      var typeLine = p.type || p.category || BRANDS[p.brand].name;
      var fullName = p.name.indexOf(BRANDS[p.brand].name) === 0 ? p.name : BRANDS[p.brand].name + " " + p.name;
      setTitle(fullName);

      var stat = p.total + " assets" + (p.videos && p.videos.length ? " · " + p.videos.length + " videos" : "") + " · updated " + fmtDate(p.added);
      d.innerHTML =
        '<button class="back" id="back-btn">' + icon("arrowLeft") + " Back to library</button>" +
        '<div class="detail-hero">' +
          '<div class="detail-cover-lg' + (p.cover ? " clickable" : "") + '"' + (p.cover ? ' id="hero-cover"' : "") + ">" + coverHTML(p) + "</div>" +
          '<div class="detail-info">' +
            '<div class="detail-eyebrow">' + typeLine + "</div>" +
            "<h2>" + fullName + "</h2>" +
            '<div class="detail-stat">' + stat + "</div>" +
            ((p.info && p.info.description) ? '<p class="detail-desc">' + p.info.description + "</p>" : "") +
            '<div class="detail-actions">' +
              '<button class="btn" id="dl-all">' + icon("download") + " Download all</button>" +
              '<button class="btn ghost" id="copy-link">' + icon("link") + " Copy link</button>" +
            "</div>" +
            overviewFactsHTML(p) +
          "</div>" +
        "</div>" +
        trainingEntryHTML(p) +
        highlightsHTML(p) +
        fullDescHTML(p) +
        whatsInBoxHTML(p) +
        // ---- Documents (assets) — sits above Packaging, filters at the top ----
        // Empty products (no synced files yet) show a friendly note instead of an
        // empty gallery with an "undefined" folder tab.
        (catTotal > 0
          ? '<div class="section-head" id="docs-head"><h2>Download assets by category</h2><span class="badge">' + catTotal + " file" + (catTotal === 1 ? "" : "s") + "</span></div>" +
            assetNav +
            // A folder that only holds other folders still gets its own actions —
            // you can share or download "Black" without drilling into a leaf.
            (openPath && activeCount === 0
              ? '<div class="folder-toolbar">' +
                  '<h3 class="folder-title">' + escapeHTML(lastSeg(openPath)) +
                    '<span class="ft-count">' + filesUnder(openPath) + " file" + (filesUnder(openPath) === 1 ? "" : "s") + "</span></h3>" +
                  '<div class="gallery-toolbar">' +
                    '<button class="btn ghost sm" id="copy-folder">' + icon("link") + " Copy folder link</button>" +
                    '<button class="btn ghost sm" id="dl-folder">' + icon("download") + " Download folder</button>" +
                  "</div>" +
                "</div>"
              : "") +
            (activeCount > 0
              ? '<div class="folder-toolbar">' +
                  '<h3 class="folder-title">' + activeLabel + '<span class="ft-count">' + activeCount + " file" + (activeCount === 1 ? "" : "s") + "</span></h3>" +
                  '<div class="gallery-toolbar">' +
                    '<label class="selectall"><input type="checkbox" id="sel-all"/> Select all</label>' +
                    '<button class="btn ghost sm" id="copy-folder">' + icon("link") + " Copy folder link</button>" +
                    '<button class="btn ghost sm" id="dl-folder">' + icon("download") + " Download folder</button>" +
                  "</div>" +
                "</div>" +
                '<div class="gallery" id="gallery"></div>' +
                '<div class="selbar" id="selbar">' +
                  '<span class="selcount"><strong id="sel-n">0</strong> selected</span>' +
                  '<span class="selacts">' +
                    '<button class="btn ghost sm" id="sel-clear">Clear</button>' +
                    '<button class="btn sm" id="sel-dl">' + icon("download") + " Download selected</button>" +
                  "</span>" +
                "</div>"
              : (kids.length ? '<p class="pkg-note">' + icon("info") + " Choose a folder above to view and download its files." + "</p>" : ""))
          : '<div class="section-head"><h2>Download assets by category</h2></div>' +
            '<div class="usage"><span>Assets for this product are being added — check back soon, or use “Request an asset” for something specific.</span></div>') +
        (CFG.usageNote ? '<div class="usage usage-foot">' + icon("info") + "<span>" + CFG.usageNote + "</span></div>" : "") +
        // ---- product info below the assets ----
        inStoreHTML(p) +
        packagingHTML(p) +
        colorwaysHTML(p) +
        skuHTML(p) +
        videoHubHTML(p);

      if (activeCount > 0) renderGallery(p, openPath, selected, toggle, syncSelection);
      $$("[data-play]", d).forEach(function (el) {
        el.addEventListener("click", function () {
          openVideoModal(el.getAttribute("data-play"), el.getAttribute("data-title"), el.getAttribute("data-dl"), el.getAttribute("data-dlname"));
        });
      });
      $$("[data-vdl]", d).forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); directDownload(b.getAttribute("data-vdl"), b.getAttribute("data-vname")); });
      });
      $$("[data-soon]", d).forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); toast("Downloadable file coming soon — Dropbox link on the way"); });
      });
      // POP-display / packaging image → enlarge in the lightbox.
      $$("[data-lbimg]", d).forEach(function (b) {
        b.addEventListener("click", function () {
          var u = b.getAttribute("data-lbimg"), dl = b.getAttribute("data-lbdl") || u;
          openLightbox([{ src: u, name: b.getAttribute("data-lbname"), url: dl, file: dl }], 0);
        });
      });
      $$("[data-pkgdl]", d).forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); directDownload(b.getAttribute("data-pkgdl"), b.getAttribute("data-pkgname")); });
      });
      // In-store marketing tiles → enlarge in the lightbox.
      var ismItems = inStoreItems(p).items.map(function (x) {
        return { src: x.thumb || x.file || x.url, name: fileLabel(x), url: x.file || x.url || "#" };
      });
      $$("[data-ism]", d).forEach(function (t) {
        t.addEventListener("click", function () { openLightbox(ismItems, +t.getAttribute("data-ism")); });
      });
      $("#back-btn").addEventListener("click", navHome);
      var trainEntry = $("#train-entry"); if (trainEntry) trainEntry.addEventListener("click", function () { navTraining(p); });
      var heroCover = $("#hero-cover");
      if (heroCover) heroCover.addEventListener("click", function () { openLightbox([{ src: p.cover, name: fullName, url: p.cover }], 0); });
      $("#dl-all").addEventListener("click", function () { downloadAll(p); });
      $("#copy-link").addEventListener("click", function () {
        var url = location.origin + location.pathname + productHash(p);
        copyText(url, "Link copied");
      });
      var copyDesc = $("#copy-desc");
      if (copyDesc) copyDesc.addEventListener("click", function () {
        copyText(((p.info && p.info.fullDescription) || []).join("\n\n"), "Description copied");
      });
      // Folder actions work at every level: `active` is the leaf being shown, and
      // for a branch folder it equals openPath, so both resolve to the open folder.
      var dlFolderBtn = $("#dl-folder");
      if (dlFolderBtn) dlFolderBtn.addEventListener("click", function () { downloadFolder(p, openPath || active); });
      var copyFolderBtn = $("#copy-folder");
      if (copyFolderBtn) copyFolderBtn.addEventListener("click", function () {
        var path = openPath || active;
        copyText(location.origin + location.pathname + productHash(p, path), "Folder link copied");
      });
      var selAllBox = $("#sel-all");
      if (selAllBox) selAllBox.addEventListener("change", function (e) {
        var on = e.target.checked;
        folderFiles().forEach(function (f) { toggle(f, on); });
        syncSelection();
      });
      var selClearBtn = $("#sel-clear");
      if (selClearBtn) selClearBtn.addEventListener("click", function () { selected = {}; syncSelection(); });
      var selDlBtn = $("#sel-dl");
      if (selDlBtn) selDlBtn.addEventListener("click", function () { downloadFiles(selectedList(), selectedList().length + " selected"); });
      // Folder cards and breadcrumb links both navigate by full path (data-path).
      // Each hop rewrites the URL, so the address bar always names the folder you
      // are looking at — that's what "Copy folder link" hands over, and it's what
      // browser back/forward walks through.
      $$(".catcard, .crumb-btn", d).forEach(function (t) {
        t.addEventListener("click", function () {
          openPath = t.getAttribute("data-path") || "";
          var h = productHash(p, openPath);
          if (location.hash !== h) { ignoreHash = true; location.hash = h; }
          render();
        });
      });
      syncSelection();
    }
    render();

    // Arriving via a shared folder link (or a file-search hit) opens the product
    // page scrolled to the top — leaving the folder you were actually sent to far
    // below the fold, so the link reads as "it just opened the product page".
    // Bring the assets section into view so you land on the folder itself.
    // Only on arrival: drilling around in-page is already in view.
    if (openPath) {
      var head = $("#docs-head", d);
      if (head) {
        // Wait for layout (thumbnails/fonts) to settle, then offset for the sticky nav.
        // NOTE "instant", not "auto": the page sets `html { scroll-behavior: smooth }`,
        // and "auto" defers to that — which would animate a ~1300px scroll on arrival
        // (janky, and it silently does nothing at all in a background tab). A shared
        // link should just *be* at the folder.
        setTimeout(function () {
          var top = head.getBoundingClientRect().top + window.pageYOffset - 84;
          window.scrollTo({ top: Math.max(top, 0), behavior: "instant" });
        }, 60);
      }
    }
  }

  // Packaging visuals: retail outer box + (for POP products) the POP display.
  // The materials to show for a product: its own "In-Store Marketing" folder if it
  // has any, otherwise the generic brand-level pieces as placeholders.
  function inStoreItems(p) {
    // Product pages show the product's own synced "In Store Marketing Materials"
    // folder (PNG-deduped). No generic/tagged fallback — those live in the
    // brand-level section and would otherwise double up the synced pieces.
    return { items: instoreOwn(p), generic: false };
  }
  // In-store printed marketing materials for this product — a dedicated section
  // under Digital Assets.
  function inStoreHTML(p) {
    if (p.isLogo) return "";
    var r = inStoreItems(p), items = r.items;
    var head = '<div class="section-head"><h2>In Store Marketing Materials</h2>' +
      (items.length ? '<span class="badge">' + items.length + " item" + (items.length === 1 ? "" : "s") + "</span>" : "") + "</div>";
    if (!items.length) {
      return head + '<div class="instore-empty">' +
        "<p>Printed in-store materials (posters, shelf talkers, displays) for this product will appear here as they’re added.</p>" +
        '<a class="btn ghost sm" href="mailto:' + CFG.orderEmail + "?subject=" +
          encodeURIComponent("In-store material request — " + p.name) + '">' + icon("mail") + " Request materials</a>" +
      "</div>";
    }
    var prodName = p.name.indexOf(BRANDS[p.brand].name) === 0 ? p.name : BRANDS[p.brand].name + " " + p.name;
    var note = '<p class="pkg-note">' + prodName + " specific in-store materials.</p>";
    var tiles = items.map(function (x) {
      var media = x.thumb ? '<img src="' + x.thumb + '" alt="' + fileLabel(x).replace(/"/g, "") + '" loading="lazy"/>' : window.__icon("photo");
      var lbl = instoreLabel(x);
      var cap = lbl ? '<span class="instore-tile-cap"><span class="instore-tile-nm">' + escapeHTML(lbl.name) +
        "</span><span class=\"instore-tile-dim\">" + escapeHTML(lbl.dim) + "</span></span>" : "";
      return '<a class="instore-tile' + (lbl ? " has-cap" : "") + '" href="#materials" title="Order ' + fileLabel(x).replace(/"/g, "") + '">' +
        '<span class="instore-tile-media">' + media + '<span class="instore-tile-order">' + icon("mail") + " Order</span></span>" +
        cap + "</a>";
    }).join("");
    return head + note + '<div class="instore-grid">' + tiles + "</div>" +
      '<div class="instore-order"><a class="btn" href="#materials">' + icon("mail") + " Order marketing materials</a></div>";
  }

  function pkgCard(label, url, dlUrl) {
    if (!url) return "";   // no placeholder — only show packaging cards that have an image
    // Dropbox file links → raw for inline display, dl=1 for download. dlUrl lets
    // us show a same-origin thumbnail but download the full-res Dropbox file.
    var dbox = /dropbox\.com/.test(url);
    var src = dbox ? dropboxRaw(url) : url;
    var dsrc = dlUrl || url;
    var dl = /dropbox\.com/.test(dsrc) ? dropboxZipUrl(dsrc) : dsrc;
    var name = label.replace(/[^\w.-]+/g, "_") + (/\.png/i.test(dsrc) ? ".png" : /\.jpe?g/i.test(dsrc) ? ".jpg" : "");
    return '<div class="pkg-card">' +
      '<button class="pkg-media pkg-zoom" data-lbimg="' + src + '" data-lbname="' + label + '" data-lbdl="' + dl + '" title="Click to enlarge">' +
        '<img src="' + src + '" alt="' + label + '" loading="lazy"/></button>' +
      '<div class="pkg-label"><span>' + label + "</span>" +
        '<button class="pkg-dl" data-pkgdl="' + dl + '" data-pkgname="' + name + '" title="Download ' + label + '">' + icon("download") + "</button>" +
      "</div></div>";
  }
  function packagingHTML(p) {
    if (p.isLogo) return "";
    var info = p.info || {};
    // Auto-detect the single-box shot vs the POP-display shot from the product's
    // own "Packaging" Dropbox folder by filename. "POP" in the name → the display;
    // everything else → the single retail box. Prefer transparent renders, and the
    // 3/4 hero angle for the box.
    var pkgFolder = (p.folders && p.folders["Packaging"]) || [];
    var imgs = pkgFolder.filter(function (f) { return f.thumb; });
    function pick(wantPop) {
      var pool = imgs.filter(function (f) { return wantPop === /pop/i.test(f.name); });
      pool.sort(function (a, b) {
        function s(f) {
          var n = 0, nm = f.name;
          if (/3-?4/i.test(nm)) n += 3;          // 3/4 hero angle — strongest signal
          if (/front/i.test(nm)) n += 2;
          if (/transparent/i.test(nm)) n += 1;
          if (/\bside\b|-side/i.test(nm)) n -= 2; // side angles are secondary
          return n;
        }
        return s(b) - s(a);
      });
      return pool[0];
    }
    var boxFile = pick(false), popFile = pick(true);
    // Card image: explicit material override (info.boxImg/popImg) wins; else the
    // synced file — thumbnail for display, full-res Dropbox file for download.
    function boxCard(label, override, overrideDl, file) {
      if (override) return pkgCard(label, override, overrideDl);
      if (file) return pkgCard(label, file.thumb, file.url);
      return "";
    }
    // Multi-colour collections (Retro) list one retail box per colourway.
    function colorBoxCards() {
      var COLORS = [["Red", /red/i], ["Blue", /blue/i], ["Green", /green/i], ["Pink", /pink|pin/i], ["Purple", /purple|pueple/i]];
      var nonpop = imgs.filter(function (f) { return !/pop/i.test(f.name); });
      function s(f) { var n = 0, nm = f.name; if (/3-?4/i.test(nm)) n += 3; if (/front/i.test(nm)) n += 2; if (/transparent/i.test(nm)) n += 1; if (/\bside\b|-side/i.test(nm)) n -= 2; return n; }
      var out = "";
      COLORS.forEach(function (cp) {
        var pool = nonpop.filter(function (f) { return cp[1].test(f.name); });
        pool.sort(function (a, b) { return s(b) - s(a); });
        if (pool[0]) out += pkgCard("Single Retail Packaging — " + cp[0], pool[0].thumb, pool[0].url);
      });
      return out;
    }
    var popLabel = (info.innerPack && info.innerPack !== "N/A")
      ? info.innerPack + "-Pack Retail POP Display" : "Retail POP display";
    var cards, note;
    var colorCards = /retro/i.test(p.name) ? colorBoxCards() : "";
    if (colorCards) {
      // Retro collection: one retail box per colourway, then the collection POP display.
      cards = colorCards + boxCard(popLabel, info.popImg, info.popImgDl, popFile) +
        pkgCard("Master carton", info.cartonImg);
      note = "Ships in a retail-ready POP display — one retail box shown per colorway. See SKU details for inner-pack &amp; master-carton quantities.";
    } else if (info.pop) {
      // Ships in a retail-ready POP display. Label the POP card with its pack count.
      cards = boxCard("Single Retail Packaging", info.boxImg, null, boxFile) +
        boxCard(popLabel, info.popImg, info.popImgDl, popFile) +
        pkgCard("Master carton", info.cartonImg);
      note = "Ships in a retail-ready POP display — see SKU details for inner-pack &amp; master-carton quantities.";
    } else {
      // Ships in single retail boxes — no POP display for these products.
      cards = boxCard("Single Retail Packaging", info.boxImg, null, boxFile) + pkgCard("Master carton", info.cartonImg);
      note = "Ships in single retail boxes. See SKU details for case and pallet quantities and specs.";
    }
    return '<div class="section-head"><h2>Packaging</h2>' + (info.pop ? '<span class="badge">Ships in POP display</span>' : "") + "</div>" +
      (cards ? '<div class="pkg-grid">' + cards + "</div>" : "") +
      '<p class="pkg-note">' + note + "</p>";
  }

  // Collection Colorways — per-colour SKU/UPC/name for the multi-colour Retro
  // collections, in a fun, colour-coded card grid.
  function colorwaysHTML(p) {
    var ways = (window.PORTAL_COLORWAYS || {})[p.name];
    if (!ways || !ways.length) return "";
    var cards = ways.map(function (w) {
      var code = function (l, v) {
        return '<div class="cway-code"><span class="cway-cl">' + l + "</span>" +
          '<span class="cway-cv">' + (v || "—") + "</span></div>";
      };
      return '<div class="cway-card" style="--c:' + w.hex + '">' +
        '<div class="cway-top"><span class="cway-dot"></span><span class="cway-color">' + w.color + "</span></div>" +
        '<div class="cway-name">' + escapeHTML(w.name) + "</div>" +
        '<div class="cway-codes">' + code("SKU", w.sku) + code("UPC", w.upc) + "</div>" +
      "</div>";
    }).join("");
    return '<div class="section-head cways-head"><h2>Collection Colorways</h2>' +
      '<span class="badge">' + ways.length + " colors</span></div>" +
      '<div class="cways">' + cards + "</div>";
  }

  // SKU details: identifiers + the pack/case breakdown for stores & ops.
  function skuHTML(p) {
    if (p.isLogo) return "";
    var info = p.info || {};
    // Every product shows the full SKU/packaging field set (like Dash II) so
    // it's clear what still needs filling in — blanks render as a muted "—".
    var missing = 0;
    function row(label, val) {
      var v = val ? '<span class="sku-v">' + val + "</span>" : (missing++, '<span class="sku-v sku-tbd">—</span>');
      return '<div class="sku-row"><span class="sku-l">' + label + "</span>" + v + "</div>";
    }
    // Multi-colour collections list per-colour SKU/UPC in the Colorways section,
    // so the collection-level Product SKU/UPC rows are omitted here to avoid
    // duplicating the POP-display codes.
    var multiColor = !!(window.PORTAL_COLORWAYS && window.PORTAL_COLORWAYS[p.name]);
    // "N/A" values are shown as-is (not counted as a to-be-confirmed blank).
    function orNA(label, val) { return val ? '<div class="sku-row"><span class="sku-l">' + label + '</span><span class="sku-v">' + val + "</span></div>" : row(label, val); }
    var rows =
      row("Product Name", info.fullName) +
      // Multi-variant products list per-variant SKU/UPC in Collection Colorways.
      (multiColor ? "" : row("Product SKU", info.sku) + row("Product UPC", info.upc)) +
      row("Product Dimensions", info.dimensions) +
      row("Unit Weight", info.unitWeight) +
      orNA("Units Per Case", info.caseUnits) +
      orNA("Case Weight", info.caseWeight) +
      orNA("Case Dimensions", info.caseDimensions) +
      orNA("Units Per Pallet", info.palletUnits) +
      orNA("Pallet Weight", info.palletWeight) +
      row("HTS (Harmonized Tariff Schedule) Code", info.htsCode);
    return '<div class="section-head"><h2>SKU details</h2></div>' +
      '<div class="sku-table">' + rows + "</div>" +
      (missing ? '<p class="pkg-note">' + icon("info") + " Fields shown as <strong>—</strong> are still to be confirmed." + "</p>" : "");
  }

  // MSRP / warranty facts + FAQ/site CTAs (sits in the hero info column).
  function overviewFactsHTML(p) {
    var info = p.info || {};
    var faq = info.faqUrl || BRANDS[p.brand].faqUrl;
    var factItems =
      (info.msrp ? '<div class="ov-fact">' + icon("tag") + '<div class="ov-fact-t"><div class="ov-fact-l">MSRP</div><div class="ov-fact-v">' + info.msrp + "</div></div></div>" : "") +
      (info.warranty ? '<div class="ov-fact">' + icon("shield") + '<div class="ov-fact-t"><div class="ov-fact-l">Warranty</div><div class="ov-fact-v">' + info.warranty + "</div></div></div>" : "");
    var ctas =
      (info.manual ? '<a class="btn ghost sm" href="' + info.manual + '" target="_blank" rel="noopener noreferrer">' + icon("file") + " Product Manual</a>" : "") +
      (faq ? '<a class="btn ghost sm" href="' + faq + '" target="_blank" rel="noopener noreferrer">' + icon("info") + " Product FAQs</a>" : "") +
      (info.productUrl ? '<a class="btn ghost sm" href="' + info.productUrl + '" target="_blank" rel="noopener noreferrer">' + icon("link") + " View on site</a>" : "");
    if (!factItems && !ctas) return "";
    return '<div class="ov-facts">' +
      (factItems ? '<div class="ov-fact-group">' + factItems + "</div>" : "") +
      (ctas ? '<div class="ov-cta">' + ctas + "</div>" : "") +
    "</div>";
  }
  // Highlights — a full-width two-column grid below the hero.
  function highlightsHTML(p) {
    var info = p.info || {};
    if (!(info.highlights && info.highlights.length)) return "";
    return '<div class="section-head"><h2>Highlights</h2></div>' +
      '<ul class="highlights">' + info.highlights.map(function (h) { return "<li>" + h + "</li>"; }).join("") + "</ul>";
  }
  // Official scraped product description (copy-to-clipboard).
  function fullDescHTML(p) {
    var info = p.info || {};
    if (!(info.fullDescription && info.fullDescription.length)) return "";
    return '<div class="section-head"><h2>Official Product Description</h2>' +
        '<button class="btn ghost sm fd-copy" id="copy-desc">' + icon("copy") + " Copy</button></div>" +
      '<div class="fulldesc"><div class="fd-body">' +
        info.fullDescription.map(function (t) { return "<p>" + t + "</p>"; }).join("") +
      "</div></div>";
  }
  // "What's In the Box?" — contents list + components image.
  function whatsInBoxHTML(p) {
    if (p.isLogo) return "";
    var b = p.info && p.info.box;
    if (!b || !(b.contents && b.contents.length)) return "";
    var list = '<ul class="box-list">' + b.contents.map(function (c) { return "<li>" + c + "</li>"; }).join("") + "</ul>";
    var head = '<div class="section-head"><h2>What’s In the Box?</h2></div>';
    if (!b.image) return head + '<div class="box-single">' + list + "</div>";
    var img = '<div class="box-media"><img src="' + b.image + '" alt="What’s in the box" loading="lazy"/></div>';
    return head + '<div class="box-grid">' + list + img + "</div>";
  }

  // Educational video hub. Each card: click to watch in the large player, a
  // Download button (real Dropbox MP4, or a placeholder until we have the link),
  // and a "Share on YouTube" link when a matching channel video exists.
  function videoHubHTML(p) {
    if (!p.videos || !p.videos.length) return "";
    var cards = p.videos.map(function (v) {
      var safe = v.title.replace(/"/g, "");
      var poster = v.thumb ? '<img src="' + v.thumb + '" alt="' + safe + '" loading="lazy"/>' : "";
      var dlname = safe.replace(/[^\w.-]+/g, "_") + ".mp4";
      // Play source: a real Dropbox MP4 takes priority; else the Vimeo/YouTube embed.
      var playSrc = v.mp4 ? dropboxRaw(v.mp4) : (v.embed || v.url || "");
      var dl = v.mp4 ? dropboxZipUrl(v.mp4) : "";

      var thumb = '<div class="vthumb' + (playSrc ? " vplay" : "") + '"' +
        (playSrc ? ' data-play="' + playSrc + '" data-title="' + safe + '"' + (dl ? ' data-dl="' + dl + '" data-dlname="' + dlname + '"' : "") + ' role="button" tabindex="0" aria-label="Watch ' + safe + '"' : "") + ">" +
        poster + '<span class="play-badge">' + icon("play") + "</span>" + (playSrc ? '<span class="vthumb-hint">Click to watch</span>' : "") + "</div>";

      // Only offer a download when there's a real downloadable file; watch-only
      // tutorials (YouTube/Vimeo) just show Watch + the YouTube link.
      var dlBtn = v.mp4
        ? '<button class="vbtn" data-vdl="' + dl + '" data-vname="' + dlname + '">' + icon("download") + " Download</button>"
        : "";
      var ytBtn = v.youtube
        ? '<a class="vbtn" href="' + v.youtube + '" target="_blank" rel="noopener noreferrer" title="Share on YouTube">' + icon("youtube") + " YouTube</a>"
        : "";

      return '<div class="vcard">' + thumb +
        '<div class="vmeta">' +
          '<div class="vtitle">' + v.title + "</div>" +
          '<div class="vactions">' + dlBtn + ytBtn + "</div>" +
        "</div>" +
      "</div>";
    }).join("");
    return '<div class="section-head"><h2>How to use videos</h2><span class="badge">' + p.videos.length + " video" + (p.videos.length > 1 ? "s" : "") + "</span></div>" +
      '<p class="vhub-note">' + icon("eye") + " Click a video to watch it, and download it or open it on YouTube where available.</p>" +
      '<div class="vhub">' + cards + "</div>";
  }
  // Dropbox shared-file link → inline-streamable URL (raw=1) for <video>.
  function dropboxRaw(link) {
    if (/[?&]dl=/.test(link)) return link.replace(/([?&])dl=\d/, "$1raw=1");
    return link + (link.indexOf("?") === -1 ? "?raw=1" : "&raw=1");
  }
  // Large in-browser video player (modal overlay).
  function openVideoModal(src, title, dlUrl, dlName) {
    closeVideoModal();
    var ov = document.createElement("div");
    ov.className = "vlb"; ov.id = "vlb";
    // Vimeo/YouTube embeds play in an iframe; real MP4s use a <video> element.
    var isEmbed = /player\.vimeo\.com|youtube\.com\/embed/.test(src);
    var media = isEmbed
      ? '<iframe src="' + src + (src.indexOf("?") === -1 ? "?" : "&") + 'autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
      : '<video src="' + src + '" controls autoplay playsinline></video>';
    ov.innerHTML =
      '<button class="vlb-close" aria-label="Close">' + icon("x") + "</button>" +
      '<div class="vlb-stage">' + media + "</div>" +
      '<div class="vlb-bar"><span class="vlb-name">' + (title || "") + "</span>" +
        (dlUrl ? '<button class="btn vlb-dl">' + icon("download") + " Download video</button>" : "") + "</div>";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov || e.target.classList.contains("vlb-stage")) closeVideoModal(); });
    $(".vlb-close", ov).addEventListener("click", closeVideoModal);
    var dlBtn = $(".vlb-dl", ov);
    if (dlBtn) dlBtn.addEventListener("click", function () { directDownload(dlUrl, dlName); });
  }
  function closeVideoModal() {
    var ov = $("#vlb");
    if (ov) { var v = $("video", ov); if (v) v.pause(); ov.remove(); }
  }

  function renderGallery(p, folder, selected, onToggle, onChange) {
    var files = p.folders[folder] || [];
    if (!files.length) {
      $("#gallery").innerHTML = '<div class="gallery-empty">' + icon("photo") +
        "<p><strong>" + typeLabel(folder) + "</strong> are coming soon — check back shortly.</p></div>";
      if (onChange) onChange();
      return;
    }
    var items = [];     // previewable assets in this folder: { src, name, url }
    var lastIdx = null; // anchor cell for shift-click range selection
    // Show every file in the folder (thumbnails are lazy-loaded, so even large
    // folders stay responsive).
    var shown = files;
    $("#gallery").innerHTML = shown.map(function (file) {
      var key = fileKey(folder, file);
      var on = selected && selected[key];
      var ext = isExtVideo(file);   // YouTube (or other external) video link
      var hasImg = !!file.thumb;
      var lbAttr = "", ytAttr = "", badge = "";
      if (ext && hasImg) {
        ytAttr = ' data-yt="' + file.url + '"';
        badge = '<span class="play-badge">' + icon("play") + "</span>";
      } else if (hasImg) {
        lbAttr = ' data-lbidx="' + items.length + '"';
        items.push({ src: file.thumb, name: fileLabel(file), url: file.url || "#", file: file.file || null });
      }
      var thumb = hasImg
        ? '<img src="' + file.thumb + '" alt="' + file.name + '" loading="lazy" onerror="this.parentNode.innerHTML=window.__icon(\'' + (typeIcon[file.type] || "file") + '\')"/>' + badge
        : window.__icon(typeIcon[file.type] || "file");
      return (
        '<div class="gcell' + (on ? " sel" : "") + '" data-key="' + key + '">' +
          '<label class="gselect"><input type="checkbox" class="gcheck"' + (on ? " checked" : "") + ' aria-label="Select ' + fileLabel(file) + '"/></label>' +
          '<div class="gthumb' + (ext ? " is-video" : "") + '"' + lbAttr + ytAttr + ">" + thumb +
            (file.format ? '<span class="gfmt">' + file.format + "</span>" : "") + "</div>" +
          '<div class="gbar"><span class="gn">' + fileLabel(file) + '</span>' +
          '<span class="ga">' +
            '<span data-copy="' + (file.url || "#") + '" title="Copy link">' + icon("link") + "</span>" +
            '<span data-dl="' + (file.file || file.url || "#") + '" data-name="' + fileLabel(file) + '"' + (file.file ? ' data-direct="1"' : "") + ' title="' + (ext ? "Watch on YouTube" : "Download") + '">' + icon(ext ? "play" : "download") + "</span>" +
          "</span></div>" +
        "</div>"
      );
    }).join("");
    $$(".gthumb", $("#gallery")).forEach(function (t) {
      var idx = t.getAttribute("data-lbidx");
      if (idx === null) return;
      t.addEventListener("click", function () { openLightbox(items, +idx); });
    });
    $$(".gthumb[data-yt]", $("#gallery")).forEach(function (t) {
      t.addEventListener("click", function () { downloadOne(t.getAttribute("data-yt")); });
    });
    // per-asset selection checkboxes (with Dropbox-style shift-click range)
    $$(".gcell", $("#gallery")).forEach(function (cell, idx) {
      var file = shown[idx];
      var cb = $(".gcheck", cell);
      var label = $(".gselect", cell);
      if (!cb || !file) return;
      var shiftHeld = false;
      if (label) label.addEventListener("click", function (e) { shiftHeld = e.shiftKey; });
      cb.addEventListener("change", function () {
        if (shiftHeld && lastIdx !== null) {
          var a = Math.min(lastIdx, idx), b = Math.max(lastIdx, idx);
          for (var j = a; j <= b; j++) onToggle(shown[j], cb.checked);
        } else {
          onToggle(file, cb.checked);
        }
        lastIdx = idx;
        onChange();
      });
    });
    $$("[data-dl]", $("#gallery")).forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-direct")) directDownload(b.getAttribute("data-dl"), b.getAttribute("data-name"));
        else downloadOne(b.getAttribute("data-dl"));
      });
    });
    $$("[data-copy]", $("#gallery")).forEach(function (b) {
      b.addEventListener("click", function () {
        var url = b.getAttribute("data-copy");
        if (!url || url === "#") { toast("No link yet"); return; }
        copyText(url, "Link copied");
      });
    });
  }
  window.__icon = function (n) { return '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">' + icon(n).replace('stroke-width="1.8"', 'stroke-width="1.4"') + "</div>"; };

  // ---- downloads --------------------------------------------------------
  // Trigger a real browser download of a (same-origin or blob) URL.
  // Robust across desktop, tablet, and mobile (incl. iOS Safari):
  //  • same-origin / blob: / data:  → the download attribute is honored everywhere
  //  • cross-origin (Dropbox dl=1)   → the download attr is ignored, so open in a
  //    new tab and let Content-Disposition trigger the save (works on iOS/Android)
  //  • the anchor is removed on a delay — removing it immediately can cancel the
  //    download on some mobile browsers.
  function directDownload(href, name) {
    if (!href || href === "#") { toast("Download coming soon"); return; }
    var crossOrigin = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0;
    var a = document.createElement("a");
    a.href = href;
    if (crossOrigin) { a.target = "_blank"; a.rel = "noopener"; }
    else { a.download = name || ""; }
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 1500);
  }
  // Lazy-load JSZip from CDN only when a bundle download is requested.
  function loadJSZip(cb) {
    if (window.JSZip) return cb(window.JSZip);
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = function () { cb(window.JSZip || null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }
  // A single file: force a direct download from its Dropbox link (dl=1) so the
  // browser saves the file instead of opening Dropbox's preview page.
  function downloadOne(url) {
    if (!url || url === "#") { toast("Connect storage to enable downloads"); return; }
    // Per-file Dropbox links (scl/fi) → force a direct download. Leave folder
    // links (scl/fo) alone so a single-file click never pulls the whole folder.
    if (/dropbox\.com\/scl\/fi\//.test(url)) url = dropboxZipUrl(url);
    window.open(url, "_blank", "noopener");
  }
  // A folder / selection: fetch the real synced files and bundle them into a
  // .zip in the browser. Files too large to host (big videos) come via the
  // Dropbox "Download all" instead.
  function downloadFiles(files, label) {
    if (!files || !files.length) { toast("Select at least one asset first"); return; }
    var committed = files.filter(function (f) { return f && f.file; });
    // Same-origin committed files → bundle into a .zip in the browser.
    if (committed.length) {
      if (files.length === 1) { directDownload(committed[0].file, fileLabel(committed[0])); return; }
      var skipped = files.length - committed.length;
      toast("Preparing " + committed.length + " files as a .zip…");
      loadJSZip(function (JSZip) {
        if (!JSZip) { toast("Couldn’t load the zipper — try again"); return; }
        var zip = new JSZip();
        Promise.all(committed.map(function (f) {
          return fetch(f.file).then(function (r) { return r.blob(); }).then(function (b) { zip.file(fileLabel(f), b); });
        })).then(function () { return zip.generateAsync({ type: "blob" }); })
          .then(function (blob) {
            var href = URL.createObjectURL(blob);
            directDownload(href, String(label || "assets").replace(/[^\w.-]+/g, "_") + ".zip");
            setTimeout(function () { URL.revokeObjectURL(href); }, 8000);
            toast("Downloaded " + committed.length + " files" + (skipped ? " · " + skipped + " from Dropbox separately" : ""));
          })
          .catch(function () { toast("Couldn’t build the zip"); });
      });
      return;
    }
    // Dropbox-hosted files: browsers can't zip cross-origin content, so pull each
    // one straight from Dropbox. A hidden iframe per file dodges the popup blocker.
    var links = files.map(function (f) { return f && f.url ? dropboxZipUrl(f.url) : null; }).filter(Boolean);
    if (!links.length) { toast("Use “Download all” to get these from Dropbox"); return; }
    if (links.length === 1) { downloadOne(files[0].url); return; }
    toast("Downloading " + links.length + " files from Dropbox…");
    links.forEach(function (u, i) {
      setTimeout(function () {
        var f = document.createElement("iframe");
        f.style.display = "none"; f.src = u;
        document.body.appendChild(f);
        setTimeout(function () { try { f.remove(); } catch (e) {} }, 90000);
      }, i * 800);
    });
  }
  // A whole category folder: prefer the folder's Dropbox share link (one .zip);
  // fall back to the product link, then to bundling committed files.
  function downloadFolder(p, folderName) {
    var link = (p.folderLinks && p.folderLinks[folderName]) || p.dropbox;
    if (link) { toast("Opening Dropbox download…"); window.open(dropboxZipUrl(link), "_blank", "noopener"); return; }
    downloadFiles((p.folders && p.folders[folderName]) || [], folderName);
  }
  // Turn a Dropbox shared-folder link into a direct "download whole folder as
  // .zip" URL (forces dl=1).
  function dropboxZipUrl(link) {
    if (/[?&]dl=/.test(link)) return link.replace(/([?&]dl=)\d/, "$11");
    return link + (link.indexOf("?") === -1 ? "?dl=1" : "&dl=1");
  }
  function downloadAll(p) {
    // Real Dropbox: download the whole product folder as a .zip from the shared
    // link (works on the static site, no backend). Per-file/zip-of-selection
    // still needs the Dropbox API sync (see GitHub Action) to resolve paths.
    if (p.dropbox) {
      toast("Opening Dropbox download…");
      window.open(dropboxZipUrl(p.dropbox), "_blank", "noopener");
      return;
    }
    var files = [];
    Object.keys(p.folders).forEach(function (f) {
      p.folders[f].forEach(function (x) { files.push(x); });
    });
    downloadFiles(files, p.name);
  }
  window.__open = function (url) {
    if (!url || url === "#") { toast("Document coming soon"); return; }
    window.open(url, "_blank");
  };

  // ---- lightbox / asset viewer ---------------------------------------------
  var lbItems = [], lbIdx = 0;   // items: { src, name, url }
  function openLightbox(items, idx) {
    lbItems = items && items.length ? items : [];
    lbIdx = idx || 0;
    showLb();
    $("#lightbox").classList.add("open");
  }
  function lbCurrent() { return lbItems[lbIdx] || {}; }
  function showLb() {
    var it = lbCurrent();
    $("#lightbox img").src = it.src || "";
    $("#lb-name").textContent = it.name || "";
    $("#lb-count").textContent = lbItems.length > 1 ? (lbIdx + 1) + " / " + lbItems.length : "";
    var multi = lbItems.length > 1 ? "flex" : "none";
    $("#lb-prev").style.display = multi;
    $("#lb-next").style.display = multi;
  }
  function lbStep(d) {
    if (lbItems.length < 2) return;
    lbIdx = (lbIdx + d + lbItems.length) % lbItems.length;
    showLb();
  }
  function closeLightbox() { $("#lightbox").classList.remove("open"); $("#lightbox img").src = ""; lbItems = []; }
  function lbOpen() { return $("#lightbox").classList.contains("open"); }

  // ---- toast ---------------------------------------------------------------
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ---- "Talk to our team" band (above the footer, every page) ---------------
  // Driven by CFG.support so nobody has to touch markup. Needs at least one way
  // to reach a human — with neither a phone nor an email the band would just be
  // a headline, so it hides instead. Renders whichever contacts are filled in.
  function renderSupport() {
    var el = $("#support"), s = (CFG && CFG.support) || {};
    if (!el) return;
    if (!s.phone && !s.email) { el.style.display = "none"; return; }
    // The first contact is the solid button, any second one goes ghost.
    var btns = "";
    if (s.phone) {
      btns += '<a class="support-btn" href="tel:' + s.phone.replace(/[^0-9+]/g, "") + '">' +
        icon("phone") + "<span>" + escapeHTML(s.phone) + "</span></a>";
    }
    if (s.email) {
      btns += '<a class="support-btn' + (s.phone ? " ghost" : "") + '" href="mailto:' + escapeHTML(s.email) + '">' +
        icon("mail") + "<span>" + escapeHTML(s.email) + "</span></a>";
    }
    el.style.display = "";
    el.innerHTML =
      '<div class="wrap support-inner">' +
        '<div class="support-copy">' +
          '<div class="support-eyebrow">' + escapeHTML(s.eyebrow || "Questions about a product?") + "</div>" +
          '<h2 class="support-h">' + escapeHTML(s.heading || "Talk to our team.") + "</h2>" +
          (s.copy ? "<p>" + escapeHTML(s.copy) + "</p>" : "") +
        "</div>" +
        '<div class="support-actions">' + btns +
          (s.hours ? '<div class="support-hours">' + escapeHTML(s.hours) + "</div>" : "") +
        "</div>" +
      "</div>";
  }

  // ---- wire up the static shell -------------------------------------------
  function init() {
    // hero text from config
    $("#hero-tagline").textContent = CFG.tagline;
    var heroIntro = $("#hero-intro"); if (heroIntro) heroIntro.textContent = CFG.intro;
    $$(".req-mail").forEach(function (a) { a.href = "mailto:" + CFG.requestEmail; });

    renderSupport();

    // nav "Catalogs" jumps to the catalogs section. The button hides itself when
    // no catalogs have synced yet, so it can't scroll to an empty section.
    var navCat = $("#nav-catalogs");
    if (navCat) {
      if (!(window.PORTAL_CATALOGS || []).length) navCat.style.display = "none";
      else navCat.addEventListener("click", function () {
        navHome();
        var c = $("#catalogs-section"); if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // nav "Logos & assets" link scrolls down to the de-emphasized resources strip.
    var navGuides = $("#nav-guides");
    if (navGuides) navGuides.addEventListener("click", function () {
      navHome();
      var r = $("#resources"); if (r) r.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    var homeLink = $("#home-link");
    if (homeLink) {
      homeLink.addEventListener("click", navHome);
      homeLink.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navHome(); } });
    }

    // brand toggle
    $$("#view-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#view-toggle button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        state.view = b.getAttribute("data-view");
        navHome();
      });
    });
    // type filter chips (no "All assets" chip — clicking an active chip clears it)
    $$("#type-filters .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var t = c.getAttribute("data-type");
        var deselect = state.type === t;
        state.type = deselect ? "all" : t;
        $$("#type-filters .chip").forEach(function (x) { x.classList.remove("on"); });
        if (!deselect) c.classList.add("on");
        navHome();
      });
    });
    // sort toggle
    $$("#sort-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#sort-toggle button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        state.sort = b.getAttribute("data-sort");
        renderHome();
      });
    });
    // grid / list view toggle
    $$("#view-mode button").forEach(function (b) {
      b.innerHTML = icon(b.getAttribute("data-layout"));
      b.addEventListener("click", function () {
        $$("#view-mode button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        state.layout = b.getAttribute("data-layout");
        renderHome();
      });
    });
    // search — live results as you type (no page fade re-trigger per keystroke)
    var searchEl = $("#search");
    var clearEl = $("#search-clear");
    var syncClear = function () { if (clearEl) clearEl.classList.toggle("show", !!searchEl.value); };

    // Popular-search suggestions, shown when the (empty) box is focused.
    var SUGGESTIONS = ["Lifestyle", "Product Photos", "Logos", "Packaging", "Videos", "PNG"];
    var suggestEl = null;
    function buildSuggest() {
      if (suggestEl) return suggestEl;
      var host = document.querySelector(".browse-search");
      if (!host) return null;
      suggestEl = document.createElement("div");
      suggestEl.className = "search-suggest";
      suggestEl.innerHTML =
        '<div class="ss-label">Popular searches</div>' +
        '<div class="ss-chips">' + SUGGESTIONS.map(function (s) {
          return '<button type="button" class="ss-chip" data-q="' + s + '">' + s + "</button>";
        }).join("") + "</div>" +
        '<div class="ss-hint">Press <kbd>/</kbd> to search from anywhere · <kbd>Enter</kbd> opens the top result</div>';
      host.appendChild(suggestEl);
      $$(".ss-chip", suggestEl).forEach(function (b) {
        b.addEventListener("mousedown", function (e) { e.preventDefault(); });   // keep focus
        b.addEventListener("click", function () {
          searchEl.value = b.getAttribute("data-q");
          state.query = searchEl.value.trim(); state.fileFacet = "";
          syncClear(); hideSuggest(); renderHome(true);
        });
      });
      return suggestEl;
    }
    function showSuggest() { var s = buildSuggest(); if (s && !searchEl.value) s.classList.add("show"); }
    function hideSuggest() { if (suggestEl) suggestEl.classList.remove("show"); }

    searchEl.addEventListener("input", function (e) {
      state.query = e.target.value.trim();
      state.fileFacet = "";   // new query → reset the results facet
      syncClear();
      if (searchEl.value) hideSuggest(); else showSuggest();
      renderHome(true);
    });
    searchEl.addEventListener("focus", function () { if (!searchEl.value) showSuggest(); });
    searchEl.addEventListener("blur", function () { setTimeout(hideSuggest, 120); });
    searchEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { hideSuggest(); if (state.query) { searchEl.blur(); openTopResult(); } }
      if (e.key === "Escape") { searchEl.value = ""; state.query = ""; state.fileFacet = ""; syncClear(); hideSuggest(); renderHome(true); }
    });
    if (clearEl) clearEl.addEventListener("click", function () {
      searchEl.value = ""; state.query = ""; state.fileFacet = ""; syncClear(); renderHome(true); searchEl.focus();
    });
    // "/" focuses search from anywhere (unless already typing in a field).
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      e.preventDefault();
      navHome();
      searchEl.focus();
      searchEl.select();
    });
    syncClear();

    // lightbox / asset viewer
    $("#lb-copy").innerHTML = icon("link") + " Copy link";
    $("#lb-dl").innerHTML = icon("download") + " Download";
    $("#lb-close").addEventListener("click", closeLightbox);
    $("#lb-prev").addEventListener("click", function () { lbStep(-1); });
    $("#lb-next").addEventListener("click", function () { lbStep(1); });
    $("#lb-copy").addEventListener("click", function () {
      var u = lbCurrent().url;
      if (!u || u === "#") { toast("No link yet"); return; }
      copyText(u, "Link copied");
    });
    $("#lb-dl").addEventListener("click", function () { var it = lbCurrent(); if (it.file) directDownload(it.file, it.name); else downloadOne(it.url); });
    $("#lightbox").addEventListener("click", function (e) {
      if (e.target.id === "lightbox" || e.target.classList.contains("lb-stage")) closeLightbox();
    });

    // keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      var el = document.activeElement;
      var typing = el && /^(INPUT|TEXTAREA)$/.test(el.tagName);
      if (e.key === "Escape") {
        if ($("#vlb")) { closeVideoModal(); return; }
        if (lbOpen()) { closeLightbox(); return; }
        if (typing && el.id === "search") { el.value = ""; state.query = ""; var ce = $("#search-clear"); if (ce) ce.classList.remove("show"); el.blur(); renderHome(true); }
        return;
      }
      if (lbOpen()) {
        if (e.key === "ArrowLeft") lbStep(-1);
        else if (e.key === "ArrowRight") lbStep(1);
        return;
      }
      if (e.key === "/" && !typing) { e.preventDefault(); var s = $("#search"); if (s) s.focus(); }
    });

    // floating scroll-to-top — shows once you're a screen or two down
    var toTop = $("#to-top");
    if (toTop) {
      var onScroll = function () { toTop.classList.toggle("show", window.scrollY > 640); };
      window.addEventListener("scroll", onScroll, { passive: true });
      toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
      onScroll();
    }

    // restore filters from the URL (shareable views), then route to product/home
    parseURL();
    window.addEventListener("hashchange", function () {
      if (ignoreHash) { ignoreHash = false; return; }
      route();
    });
    route();
  }

  // Re-trigger a subtle fade-in each time a page renders.
  function animateIn(el) {
    if (!el) return;
    el.classList.remove("page-anim");
    void el.offsetWidth;
    el.classList.add("page-anim");
  }
  var DEFAULT_TITLE = "Stündenglass Brand Assets Portal";
  function setTitle(t) { document.title = t ? t + " — Stündenglass Brand Assets Portal" : DEFAULT_TITLE; }

  document.addEventListener("DOMContentLoaded", init);
})();
