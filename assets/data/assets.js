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
  // All three inbound requests go to marketing. (Product support is separate —
  // that's support.email below, the customer-service inbox.)
  requestEmail: "marketing@grencoscience.com", // "Request an asset"
  orderEmail: "marketing@grencoscience.com",   // marketing-material orders
  locatorEmail: "marketing@grencoscience.com", // store-locator listing requests
  // Shown on each product page. Edit freely (or set to "" to hide).
  usageNote:
    "These assets are provided for approved partner, press, and retail use. Please don't alter logos or product imagery. Need something specific or a different format? Use “Request an asset.”",

  /* "Talk to our team" band above the footer. Needs at least a phone OR an email
     to show; it renders whichever of the two are filled in. Note this is the
     customer-service inbox — the pr@ address above is for asset requests. */
  support: {
    phone: "+1-800-993-4503",
    email: "customerservice@stundenglass.com",
    hours: "M–F · 10:00 AM – 6:00 PM EST",
    eyebrow: "Questions about a product?",
    heading: "Talk to our team.",
    copy:
      "Our customer service team has been with us since we launched in 2020 and knows every detail of Stündenglass and Modül — how to assemble them, take them apart, clean and maintain them. They're always happy to walk you through anything or answer any additional questions you might have.",
  },
};

/* Brand essentials (colors + fonts) power the "Brand essentials" panel.
   Pulled from the live stundenglass.com Shopify theme (its CSS variables are the
   source of truth): the brand is strictly monochrome — black + white with warm
   neutral surfaces, no accent colour. Type is Montserrat (headings) + Inter (body).
   NOTE the warm section colours on the store (terracotta/peach) are Shopify
   per-section "color schemes" — seasonal campaign accents, not brand colours — so
   they're intentionally not listed here.
   Colors: add { name, hex }. Fonts: add { name, role, stack }. */
window.PORTAL_BRANDS = {
  stundenglass: {
    key: "stundenglass", name: "Stündenglass", wordmark: "STÜNDENGLASS",
    logoProduct: "Stündenglass Logos",
    colors: [
      { name: "Ink", hex: "#000000" },      // primary — text, buttons (--color-text-body)
      { name: "Paper", hex: "#FFFFFF" },     // page background (--color-bg)
      { name: "Charcoal", hex: "#0F0F0F" },  // dark image / hero surfaces (--color-large-image-bg)
      { name: "Stone", hex: "#E8E8E1" },     // warm neutral borders & dividers (--color-border)
    ],
    fonts: [
      { name: "Montserrat", role: "Display / Headlines", stack: "'Montserrat', sans-serif" },
      { name: "Inter", role: "Body", stack: "'Inter', sans-serif" },
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
    "Accessories",
  ],
};

window.PORTAL_PRODUCTS = [
  /* ------------------------------ STÜNDENGLASS ----------------------------- */
  /* Featured lineup (placeholders) — add real Dropbox links in
     scripts/dropbox-sync.mjs. `folders: {}` is filled by the Dropbox sync. */
  {
    name: "Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: "assets/img/covers/gravity-infusers.png",
    added: "2026-07-09",
    oneSheet: "",
    defaultFolder: "Black / Product Photos",   // see the note on Classic below
    folders: {},   // real folders + thumbnails come from synced.js (Dropbox sync)
  },
  {
    name: "Kompact Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: "assets/img/covers/kompact-gravity-infusers.png",
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
  {
    name: "Classic Gravity Infusers", brand: "stundenglass", category: "Gravity", type: "Gravity Infuser",
    cover: "assets/img/covers/classic-gravity-infusers.png",
    added: "2026-07-09",
    oneSheet: "",
    /* No defaultFolder needed: Classic now has a top-level "Product Photos" folder
       in Dropbox, which the fallback rule opens automatically. (It used to open
       "Black / Product Photos"; that path was reorganised away in Dropbox, and the
       guard degraded to this same result rather than an empty gallery.) */
    folders: {},
  },
  {
    name: "Modül", brand: "stundenglass", category: "Modular", type: "Modular System",
    cover: "assets/img/covers/modul.png",
    added: "2026-07-09",
    oneSheet: "",
    folders: {},
  },
  {
    name: "Accessories", brand: "stundenglass", category: "Accessories", type: "Accessories",
    cover: "assets/img/covers/accessories.png",
    added: "2026-07-10",
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
   PUBLISHED VIDEOS — per-product "How to use" hub at the bottom of each product
   page (SEPARATE from the downloadable "Video" asset folders above it).
   Keyed by product name — the name must match `name` in PORTAL_PRODUCTS exactly.

     Array form:   "Product": [ ["<11-char-youtube-id>", "Title"], ... ]
     Vimeo form:   { title, vimeo:"id", hash?:"privacyhash", thumb:"url" }
     MP4 form:     { title, mp4:"<dropbox url>", youtube?:"<id>", thumbId?/thumb? }

   We use the MP4 form: the video plays and downloads from the Dropbox master
   (highest quality, and keeps downloads on Dropbox like every other asset), while
   `youtube` adds the "YouTube" button and `thumbId` borrows YouTube's poster frame
   so we don't have to host cover images.
   ⚠️ `youtube`/`thumbId` take the 11-char VIDEO ID, not the full URL.
   ========================================================================== */
var PRODUCT_VIDEOS = {
  "Gravity Infusers": [
    {
      title: "How to Use Your Stündenglass",
      mp4: "https://www.dropbox.com/scl/fi/1bvsmcebt242dhd2lgujd/Getting-Started-with-Your-St-ndenglass.mp4?rlkey=3ixa2zvqc8fr02dtgqd15unfg&st=4sp1nffz&dl=0",
      youtube: "HinNP7St1Bg", thumbId: "HinNP7St1Bg",
    },
    {
      title: "How to Clean Your Stündenglass",
      mp4: "https://www.dropbox.com/scl/fi/2hg4ww7lglfj1n1am115n/How-to-Clean-Your-St-ndenglass.mp4?rlkey=4elhsuqnvmazia3oy54f7ytlb&st=5nwksmwt&dl=0",
      youtube: "XtZmZbc2d7c", thumbId: "XtZmZbc2d7c",
    },
  ],
  "Classic Gravity Infusers": [
    {
      title: "How to Use Your Classic Gravity Infuser",
      mp4: "https://www.dropbox.com/scl/fi/oyypwwe1qo2nhyvn93vzd/St-ndenglass-Tutorial-2024.mp4?rlkey=zp085hf4l3c252rauuz6lwv84&st=4wb8cvr2&dl=0",
      youtube: "9edpmLcN88g", thumbId: "9edpmLcN88g",
    },
    {
      title: "How to Clean Your Classic Gravity Infuser",
      mp4: "https://www.dropbox.com/scl/fi/8kngurtccir16xxow43td/St-nden-Cleaning-condensed.mp4?rlkey=38x3flbowb70i6lizh260pmwd&st=2b06xtg7&dl=0",
      youtube: "sdikAiCuPlc", thumbId: "sdikAiCuPlc",
    },
  ],
  "Kompact Gravity Infusers": [
    {
      title: "How to Use Your Kompact",
      mp4: "https://www.dropbox.com/scl/fi/klcpz8y25p08dg0qlfeb5/Kompact-Hookah-How-to.mp4?rlkey=wtozdf99actyn0q29tuboywo8&st=pnn3q6qd&dl=0",
      youtube: "7u9pFBl9z3o", thumbId: "7u9pFBl9z3o",
    },
    {
      title: "How to Clean Your Kompact",
      mp4: "https://www.dropbox.com/scl/fi/milhb2y89sufsg968cn0t/Kompact-Cleaning.mp4?rlkey=5p31uowxm1npmnhwgszt547fl&st=r4qbo1uu&dl=0",
      youtube: "jtpro43OAvg", thumbId: "jtpro43OAvg",
    },
  ],
  "Modül": [
    {
      title: "How to Use the Stündenglass Modül Dok",
      mp4: "https://www.dropbox.com/scl/fi/icln6pscil0tgqf9bmvek/How-To-Use-St-ndenglass-Mod-l-Dok.mp4?rlkey=w9gejm6or235139z7lge1hpjc&st=rrriwvl4&dl=0",
      youtube: "kEZzAZ92130", thumbId: "kEZzAZ92130",
    },
    {
      title: "How to Clean Your Modül",
      mp4: "https://www.dropbox.com/scl/fi/oqx7a8dpa7tk895r7nuov/How-to-Clean-SG-Mod-l.mp4?rlkey=7w08o57mw5qsy8nrrhwffqmaj&st=urmrbq62&dl=0",
      youtube: "cN2aQKLBye8", thumbId: "cN2aQKLBye8",
    },
  ],
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
  // Shared per-product specs. Multi-variant products list per-SKU codes in
  // PORTAL_COLORWAYS below (so Product SKU/UPC are omitted from this table).
  // Infusers palletize (Units/Pallet + Pallet Weight; case = N/A). Modül ships
  // in cases (Units/Case + Case Weight/Dimensions).
  "Gravity Infusers": {
    fullName: "Stündenglass Gravity Infuser",
    dimensions: "260 × 175 × 390 mm", unitWeight: "2.52 kg",
    caseUnits: "N/A", caseWeight: "N/A", caseDimensions: "N/A",
    palletUnits: "98", palletWeight: "446.2 kg",
    htsCode: "9614.00.00",
  },
  "Kompact Gravity Infusers": {
    sku: "SG3-KIT-STBK-02", upc: "811736024884",
    fullName: "Stündenglass Kompact Gravity Infuser",
    caseUnits: "N/A", caseWeight: "N/A", caseDimensions: "N/A",
    palletUnits: "96", palletWeight: "413.4 kg",
    htsCode: "9614.00.00",
  },
  "Classic Gravity Infusers": {
    fullName: "Stündenglass Gravity Infuser — Classic",
    caseUnits: "N/A", caseWeight: "N/A", caseDimensions: "N/A",
    palletUnits: "60", palletWeight: "378.6 kg",
    htsCode: "9614.00.00",
  },
  "Modül": {
    fullName: "Stündenglass Modül + Dok Deluxe Travel Set",
    dimensions: "280 × 200 × 85 mm", unitWeight: "1.62 kg",
    caseUnits: "10", caseWeight: "17.2 kg", caseDimensions: "450 × 430 × 320 mm",
    htsCode: "",
  },
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
  "Gravity Infusers": [
    { color: "Black", hex: "#0A0A0A", sku: "SG4-KIT-STBK-02", upc: "811736029896", name: "Stündenglass Gravity Infuser — Black" },
    { color: "Violet Purple", hex: "#7A4EAB", sku: "SG4-KIT-STPU-02", upc: "811736020299", name: "Stündenglass Gravity Infuser — Violet Purple" },
    { color: "Olive Green", hex: "#6B7A3A", sku: "SG4-KIT-STGR-02", upc: "852570004168", name: "Stündenglass Gravity Infuser — Olive Green" },
    { color: "Desert Rose", hex: "#C08497", sku: "SG4-KIT-STDR-02", upc: "811736023108", name: "Stündenglass Gravity Infuser — Desert Rose" },
  ],
  "Classic Gravity Infusers": [
    { color: "Black", hex: "#0A0A0A", sku: "SG2-KIT-STBK-02", upc: "852570004014", name: "Stündenglass Gravity Infuser — Classic" },
    { color: "Wiz Khalifa Edition", hex: "#8B7FD1", sku: "SG2-KIT-KKPU-02", upc: "811736028974", name: "Khalifa × Stündenglass Gravity Infuser — Classic (Violet Sky / Mints)" },
  ],
  "Modül": [
    { color: "Clear Glass", hex: "#CBD9E0", sku: "SGM-DFK-GLBK-02", upc: "811736028677", name: "Modül + Dok Deluxe Travel Set — Clear Glass" },
    { color: "Purple Glass", hex: "#8B4AD6", sku: "SGM-DFK-PUBK-02", upc: "811736029667", name: "Modül + Dok Deluxe Travel Set — Purple Glass" },
    { color: "Green Glass", hex: "#4CAF50", sku: "SGM-DFK-GRBK-02", upc: "811736029674", name: "Modül + Dok Deluxe Travel Set — Green Glass" },
    { color: "Amber Glass", hex: "#C9822E", sku: "SGM-DFK-AMBK-02", upc: "811736029650", name: "Modül + Dok Deluxe Travel Set — Amber Glass" },
    { color: "Bubble Glass", hex: "#B0A8D8", sku: "SGM-DFK-IRBK-02", upc: "811736028714", name: "Modül + Dok Deluxe Travel Set — Bubble Glass" },
    { color: "Pink Glass", hex: "#E8479E", sku: "SGM-DFK-PKBK-02", upc: "811736028707", name: "Modül + Dok Deluxe Travel Set — Pink Glass" },
    { color: "Wiz Khalifa Edition", hex: "#8B7FD1", sku: "SGM-DFK-KKPU-02", upc: "811736029070", name: "Wiz Khalifa × Stündenglass Modül + Dok Deluxe Travel Set" },
    { color: "Grateful Dead — Legacy Patchwork", hex: "#E23B34", sku: "SGM-DFK-GDAO-02", upc: "811736028509", name: "Grateful Dead × Stündenglass Modül + Dok Deluxe Travel Set — Legacy Patchwork" },
  ],
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

/* =============================================================================
   CATALOGS & B2B BRAND DOCUMENTS — synced from the "Catalogs" Dropbox folder.
   These aren't product-specific, so they get their own home-page section with an
   in-site page viewer, a download, and a shareable deep link (#catalog/<slug>).

   TO ADD A CATALOG: just drop the PDF in the Dropbox "Catalogs" folder. It shows
   up on the next sync, titled by its filename. The map below is OPTIONAL — use it
   only to give a file a prettier title, a region badge, or a group. Anything not
   listed here still appears, so new drops never need a code change.

     "<exact filename, no .pdf>": { title, region, group, order }

   The whole section stays hidden until at least one PDF syncs.
   ========================================================================== */
window.PORTAL_CATALOG_GROUPS = ["Regional Catalogs", "B2B Resources"];
window.PORTAL_CATALOG_META = {
  /* The four 2026 catalogs share one `title`, so they collapse into a SINGLE card
     with US / UK / EU / CAD region pills. `order` sets the pill order.
     Keys are the exact Dropbox filenames minus ".pdf" — note these use SPACES;
     the hyphens in the Dropbox URL are just its slug, not the real name. */
  "Stundenglass - 2026 Catalog - US": { title: "Stündenglass 2026 Catalog", region: "US",  group: "Regional Catalogs", order: 1 },
  "Stundenglass Catalog - 2026 - UK": { title: "Stündenglass 2026 Catalog", region: "UK",  group: "Regional Catalogs", order: 2 },
  "Stundenglass Catalog - 2026 - EU": { title: "Stündenglass 2026 Catalog", region: "EU",  group: "Regional Catalogs", order: 3 },
  "STDN_Catalog_2026_CAD":            { title: "Stündenglass 2026 Catalog", region: "CAD", group: "Regional Catalogs", order: 4 },
};

window.PORTAL_CATALOGS = (function () {
  var src = (typeof window !== "undefined" && window.PORTAL_SYNCED && window.PORTAL_SYNCED["Catalogs"]) || null;
  if (!src || !src.folders) return [];
  // Fold accents first, or "Stündenglass" would slug to "st-ndenglass" — these
  // slugs are the shareable #catalog/<slug> deep links, so they must stay clean.
  function slugify(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var out = [];
  Object.keys(src.folders).forEach(function (f) {
    (src.folders[f] || []).forEach(function (x) {
      if (!/^pdf$/i.test(x.format || "")) return;
      var m = window.PORTAL_CATALOG_META[x.name] || {};
      var title = m.title || x.name;
      out.push({
        title: title,
        region: m.region || "",
        group: m.group || "Brand Documents",
        order: m.order || 99,
        slug: slugify(title) + (m.region ? "-" + slugify(m.region) : ""),
        thumb: x.thumb || null,   // first-page cover
        file: x.file || null,     // same-origin PDF → in-site viewer + download
        url: x.url || null,       // Dropbox link (fallback)
      });
    });
  });
  var G = window.PORTAL_CATALOG_GROUPS;
  out.sort(function (a, b) {
    var ga = G.indexOf(a.group), gb = G.indexOf(b.group);
    return (ga < 0 ? 99 : ga) - (gb < 0 ? 99 : gb) || a.order - b.order || a.title.localeCompare(b.title);
  });
  return out;
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
    "Accessories": "Accessories",
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
