/* =============================================================================
   STÜNDENGLASS ASSET PORTAL — DATA FILE
   -----------------------------------------------------------------------------
   This is the ONE file most people need to edit. No coding experience required.

   HOW IT WORKS
   - The portal is organized as:  BRAND  ->  PRODUCT  ->  ASSET FOLDERS
   - Each product mirrors its Dropbox structure (Product Photos, Lifestyle,
     Logos, Video, Packaging, etc.).
   - Real files, thumbnails and download links come from the Dropbox sync
     (assets/data/synced.js). The `folders: {}` below stay empty on purpose —
     they are filled automatically once a product's Dropbox folder is wired into
     scripts/dropbox-sync.mjs and the sync runs.
   - To add a product: copy an existing { ... } block, paste it, change the
     fields. Mind the commas between blocks.

   FIELD GUIDE (per product)
     name      : Product name shown in the UI (e.g. "Gravity Infuser")
     brand     : "stundenglass" (brand key below)
     category  : Short label shown under the name (e.g. "Gravity")
     cover     : Image URL for the product tile (or null → uses a synced photo)
     added     : ISO date the assets were added/updated "YYYY-MM-DD"
                 (drives the NEW badge + "Latest additions" ordering)
     oneSheet  : URL to the spec-sheet PDF (or "" if none yet)
     folders   : Leave as {} — the Dropbox sync fills these in.

   ⚠️ PLACEHOLDER DATA: the product lineup, copy, SKUs and prices below are
   first-pass placeholders so the shell renders. Replace with the confirmed
   Stündenglass lineup and official copy/specs.
   ========================================================================== */

window.PORTAL_CONFIG = {
  title: "Stündenglass Brand Assets Portal",
  tagline: "Everything you need, in one place.",
  intro:
    "The official asset portal for Stündenglass. Product photography, lifestyle imagery, logos, video and spec sheets — organized by product, ready to download.",
  requestEmail: "pr@stundenglass.com", // "Request an asset" mailto target — CONFIRM
  orderEmail: "pr@stundenglass.com",   // marketing-material order requests — CONFIRM
  locatorEmail: "pr@stundenglass.com", // store-locator listing requests — CONFIRM
  // Shown on each product page. Edit freely (or set to "" to hide).
  usageNote:
    "These assets are provided for approved partner, press, and retail use. Please don't alter logos or product imagery. Need something specific or a different format? Use “Request an asset.”",
};

/* Brand essentials (colors + fonts) power the "Brand essentials" panel.
   NOTE: these are PLACEHOLDER values — replace with the official Stündenglass
   brand-guide values when provided. Colors: add { name, hex }. Fonts: add
   { name, role, stack }. `logoProduct` is the product name to deep-link the
   "Download logos" button to. */
window.PORTAL_BRANDS = {
  stundenglass: {
    key: "stundenglass", name: "Stündenglass", wordmark: "STÜNDENGLASS",
    logoProduct: "Stündenglass Logos",
    colors: [
      { name: "Ink", hex: "#0A0A0A" },
      { name: "Paper", hex: "#FFFFFF" },
      { name: "Stündenglass Gold", hex: "#C9A24B" },
      { name: "Smoke", hex: "#1C1C1A" },
      { name: "Glass", hex: "#E8E8E1" },
    ],
    fonts: [
      { name: "Archivo", role: "Display / Headlines", stack: "'Archivo', sans-serif" },
      { name: "Archivo", role: "Body", stack: "'Archivo', sans-serif" },
    ],
    // Official accounts — VERIFY handles/URLs before launch.
    social: [
      { network: "Instagram", handle: "@stundenglass", url: "https://www.instagram.com/stundenglass/" },
      { network: "X", handle: "@stundenglass", url: "https://x.com/stundenglass" },
      { network: "Facebook", handle: "Stündenglass", url: "https://www.facebook.com/stundenglass" },
      { network: "YouTube", handle: "Stündenglass", url: "https://www.youtube.com/@stundenglass" },
    ],
    faqUrl: "https://stundenglass.com/pages/faq",
    warrantyUrl: "https://stundenglass.com/pages/warranty",
  },
};

/* CURRENT PRODUCT LINEUP (per brand, in display order).
   Products listed here show in the main "Current products" grid in THIS order.
   Any other (non-logo) product for that brand falls into "Additional Products".
   Names must match the product `name` exactly. ⚠️ CONFIRM the real lineup. */
window.PORTAL_CURRENT = {
  stundenglass: [
    "Gravity Infusers",
    "Kompact Gravity Infusers",
    "Classic Gravity Infusers",
    "Modül",
  ],
};

window.PORTAL_PRODUCTS = [
  /* ------------------------------ STÜNDENGLASS ----------------------------- */
  /* Featured lineup (placeholders) — add real Dropbox links in
     scripts/dropbox-sync.mjs. `folders: {}` is filled by the Dropbox sync. */
  {
    name: "Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: null,
    added: "2026-07-09",
    oneSheet: "",
    folders: {},   // real folders + thumbnails come from synced.js (Dropbox sync)
  },
  {
    name: "Kompact Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: null,
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
  {
    name: "Classic Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: null,
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
  {
    name: "Modül", brand: "stundenglass", category: "Modular", type: "Modular System",
    cover: null,
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
  {
    /* A pure brand-asset folder (no product) — set isLogo:true. Powers the
       homepage "Logos and Brand Assets" section. */
    name: "Stündenglass Logos", brand: "stundenglass", category: "Brand", isLogo: true,
    cover: null,
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
];

/* =============================================================================
   PUBLISHED VIDEOS — per-product educational video hub (SEPARATE from the
   downloadable "Video" file folders). Add entries keyed by product name.
     Array form:   "Product": [ ["<11-char-youtube-id>", "Title"], ... ]
     Vimeo form:   { title, vimeo:"id", hash?:"privacyhash", thumb:"url" }
     MP4 form:     { title, mp4:"<dropbox url>", thumbId?/thumb? }
   Empty for now.
   ========================================================================== */
var PRODUCT_VIDEOS = {
  // "Gravity Infuser": [ ["<youtubeId>", "How to Use: Stündenglass Gravity Infuser"] ],
};

// Inject videos into a product-level `videos` array (the educational video hub).
window.PORTAL_PRODUCTS.forEach(function (p) {
  var vids = PRODUCT_VIDEOS[p.name];
  if (!vids || !vids.length) return;
  var yt = function (id) { return id ? "https://www.youtube.com/watch?v=" + id : null; };
  p.videos = vids.map(function (v) {
    if (Array.isArray(v)) {
      return {
        id: v[0], title: v[1],
        embed: "https://www.youtube.com/embed/" + v[0],
        url: "https://www.youtube.com/watch?v=" + v[0],
        youtube: "https://www.youtube.com/watch?v=" + v[0],
        thumb: "https://i.ytimg.com/vi/" + v[0] + "/hqdefault.jpg",
      };
    }
    if (v.vimeo) {
      return {
        title: v.title, thumb: v.thumb || null,
        embed: "https://player.vimeo.com/video/" + v.vimeo + "?" + (v.hash ? "h=" + v.hash + "&" : "") + "title=0&byline=0&portrait=0&dnt=1",
        url: "https://vimeo.com/" + v.vimeo + (v.hash ? "/" + v.hash : ""),
        youtube: yt(v.youtube),
      };
    }
    return {
      title: v.title, mp4: v.mp4,
      thumb: v.thumbId ? "https://i.ytimg.com/vi/" + v.thumbId + "/hqdefault.jpg" : (v.thumb || null),
      youtube: yt(v.youtube),
    };
  });
});

/* =============================================================================
   PRODUCT INFO — official copy for each product hub (description, highlights,
   warranty, links). PLACEHOLDER — replace with official Stündenglass copy.
     description : short overview paragraph
     highlights  : array of key selling points (bullets)
     warranty    : manufacturer warranty summary (string)
     productUrl  : link to the live product page ("View on site")
     faqUrl      : optional per-product FAQ link (falls back to the brand FAQ)
   ========================================================================== */
var PRODUCT_INFO = {
  "Gravity Infusers": {
    description: "A refined take on the iconic 360° gravity hookah — lighter and more streamlined, with a smoother, more intuitive experience. The gravity system uses water displacement with built-in percolation for consistently smooth, cooled draws — completely contactless and effortless with every rotation.",
    highlights: [
      "360° gravity system — smooth, consistent draws",
      "Percolated filtration — water-cooled, clean hits",
      "Contactless use — effortless, no direct draw",
      "14mm universal adapter — for dry material & concentrates",
      "Multi-purpose — hookah & culinary compatible",
      "Built-in NFC — authentication & registration",
      "Works with most existing Stündenglass accessories",
    ],
    warranty: "1-year limited warranty (2 years with registration); 10-year warranty on precision-machined hardware",
    productUrl: "https://stundenglass.com/collections/infusers/products/stundenglass-gravity-infuser-v3",
  },
  "Classic Gravity Infusers": {
    description: "A sophisticated, elegantly designed 360° rotating glass infuser that generates kinetic motion via cascading water displacement, opposing airflow technology and the natural force of gravity — delivering smooth, consistent, vaporous draws.",
    highlights: [
      "360° rotatable, kinetic-motion activation",
      "Percolated water filtration — cooled, water-filtered smoke",
      "Contactless consumption via a 45° adjustable mouthpiece",
      "Borosilicate glass globes + aircraft-grade anodized aluminum",
      "14mm male-joint compatible (aluminum bowl kit + glass liner included)",
      "Versatile — mixology, culinary, hookah & aromatherapy",
      "Removable glass globes, easy to clean & maintain",
      "Patented design, backed by a 10-year warranty",
    ],
    warranty: "10-year warranty",
    productUrl: "https://stundenglass.com/collections/infusers/products/stundenglass-gravity-infuser",
  },
  "Kompact Gravity Infusers": {
    description: "The same patented 360° gravity system, dynamic design and immersive experience as the original — now in a more refined, portable size with a custom-fit travel case. Smaller globes (~2 cups) make for cooler, faster pulls.",
    highlights: [
      "Patented 360° gravity system in a portable size (~12\" tall)",
      "Smaller globes (~2 cups) for cooler, faster pulls",
      "Luxury custom-fit travel case included",
      "3-ft silicone hose + 45° adjustable mouthpiece (direct or contactless)",
      "Percolated water filtration — cooled, water-filtered smoke",
      "Dishwasher-safe borosilicate glass globes + anodized aluminum",
      "14mm male-joint compatible — dry material, concentrates & hookah",
      "Magnetic hose clips, interchangeable mouthpieces",
      "Patented design, backed by a 10-year warranty",
    ],
    warranty: "10-year warranty",
    productUrl: "https://stundenglass.com/collections/infusers/products/stundenglass-kompact-gravity-infuser",
  },
  "Modül": {
    description: "An all-in-one, portable vaporization system. The Modül base pairs with a crystal-clear borosilicate glass Dok for an unobstructed view of percolation, with interchangeable dry-material and concentrate tanks that swap in seconds — all in a premium, drop-resistant travel case.",
    highlights: [
      "All-in-one, portable smoking experience",
      "Includes both dry-material and concentrate tanks",
      "2.4\" full-color display with custom KK UI",
      "Fully customizable temperature & session-time control",
      "Clear borosilicate glass Dok — watch the percolation",
      "Heats in as little as 15 seconds",
      "6,000mAh battery — up to 50 sessions per charge",
      "USB-C charging with pass-through capability",
      "Compatible with Stündenglass, Kompact & Dok models",
      "Premium drop-resistant travel case included",
    ],
    warranty: "2-year warranty",
    productUrl: "https://stundenglass.com/collections/stundenglass-modul/products/stundenglass-modul-dok-deluxe-travel-set-clear-glass",
  },
};

/* MSRP per product (shown in the product hub). Placeholder — add as confirmed. */
var PRODUCT_MSRP = {
  "Gravity Infusers": "$499.95",
  "Classic Gravity Infusers": "$599.95",
  "Kompact Gravity Infusers": "$599.95",
  "Modül": "$499.95",
};

/* Full official product descriptions (shown under "Official product
   description" with a copy button). Placeholder — add as confirmed. */
var PRODUCT_DESCRIPTION = {
  "Gravity Infusers": [
    "The Stündenglass Gravity Infuser is a 360° gravity hookah & infusion system — a refined take on the iconic gravity hookah, featuring a lighter, more streamlined design and a smoother, more intuitive experience.",
    "Its gravity system uses water displacement with built-in percolation to provide consistently smooth, cooled draws — completely contactless and effortless with every rotation.",
    "What’s new: a lighter, more streamlined design; easier cleaning than previous generations; a universal 14mm adapter compatible with dry materials and concentrates; built-in NFC for authentication and product registration; and compatibility with most existing Stündenglass accessories.",
    "Multi-purpose by design: use it as a hookah, pair it with dry-material bowls, run concentrate tanks, or explore culinary applications for smoke-infused cocktails and dishes.",
  ],
  "Classic Gravity Infusers": [
    "Stündenglass® is honored to introduce the Gravity Infuser, a sophisticated and elegantly designed 360° rotating glass infuser that generates kinetic motion activation via cascading water displacement, opposing airflow technology and the natural force of gravity.",
    "Built from borosilicate glass globes and aircraft-grade anodized aluminum, it delivers smooth, consistent and vaporous draws through an immersive experience.",
    "Designed for functional versatility, it includes an aluminum bowl kit and a glass liner but connects to any smoking or vaporization device with a 14mm male joint. A 45° adjustable mouthpiece provides entirely contactless consumption through fluid physics.",
    "A patented design backed by an extended 10-year warranty, the unit ships in a reusable craft box with a handle for storage and transport. Durable, futuristic in design and superb in function.",
  ],
  "Kompact Gravity Infusers": [
    "Introducing the newest sensation from Stündenglass, the Kompact Gravity Infuser. The Kompact features the same patented 360° gravity system, dynamic design, and immersive experience as the original, now available in a more refined, portable size that includes a custom-fit travel case.",
    "Measuring just under a foot in height, its smaller globes hold approximately two-thirds the volume (about 2 cups) of the full-size model, which creates cooler and faster pulls.",
    "The travel case is constructed with high-grade fabric and form-fitted to cradle the Kompact Stündenglass, which arrives fully assembled. A metal-inlayed logo plate adorns the front, with an easy-to-use zipper, carrying handle and strap for over-the-shoulder use.",
    "A complete set that includes an aluminum bowl kit and a glass liner, it can also connect to any smoking or vaporization device with a 14mm male joint. Also included is a 3-foot silicone hose that connects to the 45° adjustable mouthpiece for direct draws or a steady stream of smoke for contactless consumption.",
    "The device operates through kinetic motion activation via cascading water displacement, opposing airflow technology, and the natural force of gravity, using borosilicate glass globes and aircraft-grade anodized aluminum.",
  ],
  "Modül": [
    "This all-in-one, portable kit provides everything you need to start using Stündenglass technology. The set pairs the Modül base unit with a Dok attachment made from crystal-clear borosilicate glass for an unobstructed view of percolation.",
    "Two interchangeable tanks let you switch between dry material and concentrate sessions in seconds, and a premium drop-resistant fabric travel case carries every component together.",
    "The Modül heats in as little as 15 seconds and is powered by a 6,000mAh battery supporting up to 50 sessions per charge, with USB-C charging and pass-through capability. A 2.4\" high-resolution full-color display with custom KK UI and single-hand dial control puts temperature and session time at your fingertips.",
  ],
};

/* SKU + packaging details per product (shown in the "SKU details" and
   "Packaging" hub sections). Placeholder — fill from ops/factory.
     sku, upc, fullName, dimensions, unitWeight, innerPack, masterCarton,
     caseWeight, caseDimensions, htsCode, pop, popSku, popUpc, boxImg, popImg */
var PRODUCT_SKU = {
  // "Gravity Infuser": { sku: "…", upc: "…", fullName: "GRAVITY INFUSER", dimensions: "…", unitWeight: "…", masterCarton: "…", caseWeight: "…", caseDimensions: "…", htsCode: "…" },
};

/* "What's In the Box?" contents + components image per product.
   { image: "<url>", contents: ["item", ...] }  Placeholder — add as confirmed. */
var PRODUCT_BOX = {
  "Gravity Infusers": {
    contents: [
      "Stündenglass Gravity Infuser",
      "Glass Globe × 2",
      "14mm Glass Bowl Assembly",
      "Rotatable Mouthpiece",
      "Assembly Tool Kit",
    ],
  },
  "Classic Gravity Infusers": {
    contents: [
      "Anodized Aluminum Frame",
      "Borosilicate Glass Globes",
      "Silicone Hose Assembly",
      "Infusion Chamber Assembly",
      "Cleaning Kit",
      "Sticker Set",
      "Reusable Craft Box with Handle",
    ],
  },
  "Kompact Gravity Infusers": {
    contents: [
      "Anodized Aluminum Frame",
      "Borosilicate Glass Globes",
      "Silicone Hose Assembly",
      "Infusion Chamber Assembly",
      "Cleaning Kit",
      "Sticker Set",
      "Premium Travel Case",
    ],
  },
  "Modül": {
    contents: [
      "Stündenglass Modül",
      "Clear Dok Glass",
      "Travel Case",
      "Concentrate Tank (Quartz)",
      "Dry Material Tank",
      "Carb Cap",
      "Loading Tool",
      "Charging Cable",
      "Anodized Aluminum Stand",
    ],
  },
};

// Attach info (+ MSRP + SKU/packaging + box) to each product; empty object if none.
window.PORTAL_PRODUCTS.forEach(function (p) {
  p.info = PRODUCT_INFO[p.name] || {};
  if (PRODUCT_MSRP[p.name] && !p.info.msrp) p.info.msrp = PRODUCT_MSRP[p.name];
  if (PRODUCT_DESCRIPTION[p.name] && !p.info.fullDescription) p.info.fullDescription = PRODUCT_DESCRIPTION[p.name];
  var sk = PRODUCT_SKU[p.name];
  if (sk) Object.keys(sk).forEach(function (k) { if (p.info[k] === undefined) p.info[k] = sk[k]; });
  if (PRODUCT_BOX[p.name]) p.info.box = PRODUCT_BOX[p.name];
});

/* Live Dropbox sync overlay: assets/data/synced.js (regenerated by the GitHub
   Action) defines window.PORTAL_SYNCED = { "<Product>": { folders, dropbox } }.
   When present, the real Dropbox folders/files replace the placeholder ones. */
(function () {
  var SYNCED = (typeof window !== "undefined" && window.PORTAL_SYNCED) || {};
  window.PORTAL_PRODUCTS.forEach(function (p) {
    var s = SYNCED[p.name];
    if (s && s.folders && Object.keys(s.folders).length) {
      p.folders = s.folders;
      if (s.dropbox) p.dropbox = s.dropbox;
      if (s.folderLinks) p.folderLinks = s.folderLinks;
      p.synced = true;
      p.syncedAt = s.syncedAt;
      // Logo folders have no product shot — use the primary black mark as the
      // hero cover (prefers a PNG; falls back to any thumbnailed logo file).
      if (p.isLogo && !p.cover) {
        var all = [];
        Object.keys(s.folders).forEach(function (f) { all = all.concat(s.folders[f]); });
        var cand = all.filter(function (x) { return /black/i.test(x.name) && !/white|reverse/i.test(x.name) && x.thumb; });
        var g = cand.filter(function (x) { return x.format === "PNG"; })[0] || cand[0] || all.filter(function (x) { return x.thumb; })[0];
        if (g) p.cover = g.thumb;
      }
      // Regular products with no hand-set cover → auto-pick a card cover from the
      // synced photos: prefer a clean Product Photo, then Lifestyle, then any
      // thumbnailed image. Mirrors the G Pen cards (each shows a product shot).
      if (!p.isLogo && !p.cover) {
        var pickFrom = function (folderName) {
          var arr = s.folders[folderName] || [];
          var img = arr.filter(function (x) { return x.thumb && (x.type === "image" || x.type === "vector"); })[0];
          return img ? img.thumb : null;
        };
        var cover = pickFrom("Product Photos") || pickFrom("Lifestyle Photos");
        if (!cover) {
          var imgs = [];
          Object.keys(s.folders).forEach(function (f) {
            (s.folders[f] || []).forEach(function (x) { if (x.thumb && (x.type === "image" || x.type === "vector")) imgs.push(x); });
          });
          if (imgs.length) cover = imgs[0].thumb;
        }
        if (cover) p.cover = cover;
      }
    }
  });
})();

/* Per-colourway SKU/UPC for any multi-colour collections. Shown as the
   "Collection Colorways" section on those product pages. Empty for now. */
window.PORTAL_COLORWAYS = {
  // "<Product>": [ { color: "Black", hex: "#0A0A0A", sku: "…", upc: "…", name: "…" } ],
};

/* Central POP-display library (synced from a "POP Displays" Dropbox folder) →
   matched to each product's "Retail POP display" packaging card by filename.
   Add a product + filename pattern here as POP images arrive. */
(function () {
  var POP = (typeof window !== "undefined" && window.PORTAL_SYNCED && window.PORTAL_SYNCED["POP Displays"]) || null;
  if (!POP || !POP.folders) return;
  var pops = [];
  Object.keys(POP.folders).forEach(function (f) { (POP.folders[f] || []).forEach(function (x) { pops.push(x); }); });
  var MATCH = {
    // "Gravity Infuser": /^Gravity-Infuser-Front-POP/i,
  };
  window.PORTAL_PRODUCTS.forEach(function (p) {
    var re = MATCH[p.name]; if (!re || !p.info) return;
    var img = pops.filter(function (x) { return re.test(x.name) && x.thumb; })[0];
    if (img) { if (!p.info.popImg) { p.info.popImg = img.thumb; p.info.popImgDl = img.url; } p.info.pop = true; }
  });
})();

/* Generic (brand-level) in-store marketing materials — synced from the
   "In-Store Marketing General" Dropbox folder. Shown on the home In-Store
   section. Empty until that Dropbox folder syncs. */
window.PORTAL_INSTORE_GENERAL = (function () {
  var g = (typeof window !== "undefined" && window.PORTAL_SYNCED && window.PORTAL_SYNCED["In-Store Marketing General"]) || null;
  if (g && g.folders) {
    var out = [];
    Object.keys(g.folders).forEach(function (f) { (g.folders[f] || []).forEach(function (x) { out.push(x); }); });
    if (out.length) return out;
  }
  return [];
})();

/* Product labels — short type tags shown on each current-product card. */
(function () {
  var LABELS = {
    "Gravity Infusers": "Gravity Infuser",
    "Kompact Gravity Infusers": "Compact Infuser",
    "Classic Gravity Infusers": "Classic Infuser",
    "Modül": "Modular System",
  };
  window.PORTAL_PRODUCTS.forEach(function (p) { if (LABELS[p.name]) p.label = LABELS[p.name]; });
})();

/* Web Banners placeholder — show the tab on every product page even before its
   Dropbox "Web Banners" folder exists. When the synced folder appears (with real
   banners) it replaces this empty placeholder automatically. */
(function () {
  window.PORTAL_PRODUCTS.forEach(function (p) {
    if (p.isLogo) return;
    if (!p.folders) p.folders = {};
    if (!p.folders["Web Banners"]) p.folders["Web Banners"] = [];
  });
})();

/* =============================================================================
   PRODUCT TRAINING — self-serve "Product Specialist" certification courses.
   Per product: tagline, minutes, passPct, `modules` (title + points), and a
   multiple-choice `quiz` ({ q, choices, answer, why }). Add a product key here
   to give it a training page. Empty for now.
   ========================================================================== */
window.PORTAL_TRAINING = {
  // "Gravity Infuser": { tagline: "…", minutes: 8, passPct: 80, modules: [...], quiz: [...] },
};
