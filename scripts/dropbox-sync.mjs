/* =============================================================================
   DROPBOX SYNC — regenerates assets/data/synced.js from real Dropbox folders.
   Runs in GitHub Actions (see .github/workflows/dropbox-sync.yml). Node 18+.

   Env (GitHub Secrets): DROPBOX_APP_KEY, DROPBOX_APP_SECRET, DROPBOX_REFRESH_TOKEN

   For each product it lists the shared folder, walks the subfolders, and builds a
   thumbnail for EVERY file:
     - images  → Dropbox get_thumbnail_v2 (jpeg)
     - svg     → the vector itself (committed, renders natively)
     - pdf     → first page rendered with pdftoppm (poppler)
     - video   → a frame grabbed with ffmpeg
   Thumbnails are content-addressed (named by Dropbox content_hash) and committed
   under assets/synced/<slug>/, so unchanged files are never re-downloaded.
   Writes window.PORTAL_SYNCED into assets/data/synced.js.
   ========================================================================== */
import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmSync, createWriteStream } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

// Dropbox app key / secret / refresh token are all URL-safe alphanumerics. Strip
// anything that isn't printable ASCII (spaces, newlines, and smart-quote / em-dash /
// non-breaking-space artifacts a copy-paste into the GitHub UI can introduce) — a
// single junk byte otherwise makes the Basic auth header non-ASCII and Dropbox 400s.
const clean = (s) => (s || "").replace(/[^\x21-\x7E]/g, "");
const APP_KEY = clean(process.env.DROPBOX_APP_KEY);
const APP_SECRET = clean(process.env.DROPBOX_APP_SECRET);
const REFRESH = clean(process.env.DROPBOX_REFRESH_TOKEN);
if (!APP_KEY || !APP_SECRET || !REFRESH) {
  console.error("Missing DROPBOX_* env vars — nothing to sync.");
  process.exit(0);
}

// Products to sync: portal product name → its public Dropbox shared-folder link.
//
// ⚠️ SETUP: paste each Stündenglass product's Dropbox shared-folder link (the
// "scl/fo/..." URL) into the matching `link` below. Entries with an empty link
// are skipped automatically (see the .filter() after this array), so the sync
// runs cleanly while you wire folders in one at a time. `name` MUST match the
// product `name` in assets/data/assets.js exactly. `slug` is the local folder
// name for committed thumbnails — keep it kebab-case and unique.
//
// Optional flags:
//   deep: true      → recurse nested shoot folders (colorway → type → shoot)
//   flat: "Logos"   → bucket a flat (subfolder-less) folder under this name
//   pngThumbs: true → keep transparent PNG logo thumbnails (don't flatten to white)
const PRODUCTS = [
  // Catalogs go FIRST: they're a handful of direct file links and finish in
  // seconds, so they publish immediately instead of queueing behind the
  // multi-hour walks of the big photo libraries below.
  {
    // Catalogs & brand documents (PDFs) — powers the home "Catalogs" section and
    // the in-page PDF viewer. These PDFs are COMMITTED to the repo, the one and
    // only exception to "nothing is hosted on the portal": Dropbox blocks iframe
    // embedding (frame-ancestors) and cross-origin fetch (no CORS), so a Dropbox
    // link alone can't be rendered in the viewer — the PDF must be same-origin.
    // The Download button still points at Dropbox.
    //
    // Unlike every other product, these are DIRECT FILE links (/scl/fi/…), not a
    // folder link — so `files` replaces `link` and we skip the folder walk. To add
    // a catalog: add a row here, then map its filename in PORTAL_CATALOG_META
    // (assets/data/assets.js) to give it a title/region/group.
    name: "Catalogs",
    slug: "catalogs",
    flat: "Catalogs",
    files: [
      { link: "https://www.dropbox.com/scl/fi/plss2bshdtye4olwiemqx/Stundenglass-2026-Catalog-US.pdf?rlkey=2zhmue3zcpvfo56jgxjdl8i3x&dl=0" },
      { link: "https://www.dropbox.com/scl/fi/ttq5nn5anpx41et9c2oxs/Stundenglass-Catalog-2026-UK.pdf?rlkey=74p4oc77ciaqoxyuq8wuf17wy&dl=0" },
      { link: "https://www.dropbox.com/scl/fi/bjgagiviuecvrcyemv86y/Stundenglass-Catalog-2026-EU.pdf?rlkey=hg8x6ep0ys6mjcmokxye5lhp6&dl=0" },
      { link: "https://www.dropbox.com/scl/fi/8xkao50mhju93n35yuo9o/STDN_Catalog_2026_CAD.pdf?rlkey=e6eqeqrwxprrajidd9h002jdv&dl=0" },
    ],
  },
  // The normal (non-deep) path preserves ONE nested level as "Parent / Child"
  // folders (e.g. "Black / Product Photos"), which powers the portal drill-down:
  // color/edition → category → files. Full recursive `deep` mode is avoided here
  // because its extra list calls got throttled by Dropbox on big first passes.
  { name: "Gravity Infusers",         slug: "gravity-infusers",         link: "https://www.dropbox.com/scl/fo/3j4un063pxgcbtl7yqq5z/ACmVjEjB25HyZTAucWfMCLk?rlkey=b620zqgmr0hxb5lbtazvd4qfk&dl=0" },
  { name: "Kompact Gravity Infusers", slug: "kompact-gravity-infusers", link: "https://www.dropbox.com/scl/fo/ao5gxkfe1rsfeupwxuosk/h?rlkey=ji0x0ttk1kth2s9yqyatd16sv&dl=0" },
  { name: "Classic Gravity Infusers", slug: "classic-gravity-infusers", link: "https://www.dropbox.com/scl/fo/zg2lt1b24hyg51akxtqyr/h?rlkey=umf2vggz3vro82dduczc419q1&dl=0" },
  { name: "Modül",                    slug: "modul",                    link: "https://www.dropbox.com/scl/fo/so2i8hzeo5p3ikqx1e1ej/h?rlkey=rb1vhopjo5qyoft8eqr7bgz0v&dl=0" },
  { name: "Accessories",              slug: "accessories",              link: "https://www.dropbox.com/scl/fo/97kd80esi1s6yo5e7u90y/AMxpq46IhGjSUzcOx3QuKIo?rlkey=s8y3isccrpry4980bw40ertir&dl=0" },
  {
    // Overall Stündenglass brand logos (black/white/various). Powers the homepage
    // "Logos and Brand Assets" section. `flat` = folder name to bucket files
    // under if the Dropbox folder has no subfolders.
    name: "Stündenglass Logos",
    slug: "stundenglass-logos",
    link: "https://www.dropbox.com/scl/fo/nhw7byl8oghujix4nz3tj/h?rlkey=vu0gbmf1ujev6qam52v3qiurx&dl=0",
    flat: "Logos",
    pngThumbs: true,
  },
  {
    // Central library of retail POP display images — matched to each product's
    // "Retail POP display" packaging card by filename (see assets.js).
    name: "POP Displays",
    slug: "pop-displays",
    link: "",
    flat: "POP Displays",
  },
  {
    // Brand-level in-store marketing pieces shown on the home "In-Store
    // Marketing Materials" section (window.PORTAL_INSTORE_GENERAL in assets.js).
    name: "In-Store Marketing General",
    slug: "instore-general",
    link: "",
    flat: "In-Store Marketing",
  },
// Skip any product that has neither a folder link nor direct file links yet.
].filter((p) => (p.link && p.link.trim()) || (p.files && p.files.length));

const FOLDER_ORDER = ["Product Photos", "Lifestyle Photos", "Web Banners", "Logos", "Social Videos", "TV Screen Videos", "Packaging", "In-Store Marketing", "Documents"];
// Normalize inconsistent Dropbox folder names to the canonical tab names above,
// so a folder called "TV Screen" or "Video" still lands in the right section.
const FOLDER_ALIAS = {
  "TV Screen": "TV Screen Videos", "TV Screens": "TV Screen Videos", "TV Videos": "TV Screen Videos",
  "Video": "Social Videos", "Videos": "Social Videos", "Social Video": "Social Videos",
  "Lifestyle": "Lifestyle Photos", "Lifestyle Photo": "Lifestyle Photos",
  "Product Photo": "Product Photos", "Product Images": "Product Photos", "E-Comm": "Product Photos",
  "Misc": "Documents", "Docs": "Documents", "Logo": "Logos",
  "In Store Marketing": "In-Store Marketing", "Instore Marketing": "In-Store Marketing",
  "In-Store Materials": "In-Store Marketing", "In Store Materials": "In-Store Marketing",
  "POS": "In-Store Marketing", "POS Materials": "In-Store Marketing", "Point of Sale": "In-Store Marketing",
  "Retail Marketing": "In-Store Marketing", "In Store": "In-Store Marketing",
  "Web Banner": "Web Banners", "Banners": "Web Banners", "Banner": "Web Banners",
  "Website Banners": "Web Banners", "Website Banner": "Web Banners",
  "Web Banner Ads": "Web Banners", "Banner Ads": "Web Banners", "Digital Banners": "Web Banners",
};
const MAX_COMMIT = 50 * 1024 * 1024;   // commit originals up to 50 MB (bigger files → Dropbox)
const RASTER = /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i;   // Dropbox can thumbnail these directly
const VIDEO = /\.(mp4|mov|m4v|webm|avi|mkv)$/i;

function dlLink(link) { return /[?&]dl=/.test(link) ? link.replace(/([?&]dl=)\d/, "$11") : link + (link.includes("?") ? "&dl=1" : "?dl=1"); }
function ext(name) { return (name.split(".").pop() || "").toLowerCase(); }
function typeOf(e) {
  if (e === "svg") return "vector";
  if (RASTER.test("." + e)) return "image";
  if (VIDEO.test("." + e)) return "video";
  if (e === "pdf") return "pdf";
  return "file";
}

async function getToken() {
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString("base64") },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH }),
    });
    if (r.ok) return (await r.json()).access_token;
    lastErr = "token " + r.status + " " + (await r.text());
    if ((r.status >= 500 || r.status === 429) && attempt < 3) { await new Promise((s) => setTimeout(s, 2000 * (attempt + 1))); continue; }
    break;
  }
  throw new Error(lastErr);
}

async function rpc(tok, endpoint, body) {
  // Retry transient Dropbox failures — 5xx server errors and 429 rate limits —
  // with exponential backoff, so a momentary hiccup (e.g. "list_folder 500
  // unexpected error") doesn't abort the whole sync.
  let lastErr = "";
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch("https://api.dropboxapi.com/2/" + endpoint, {
      method: "POST",
      headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) return r.json();
    lastErr = endpoint + " " + r.status + " " + (await r.text());
    if ((r.status >= 500 || r.status === 429) && attempt < 5) {
      const wait = r.status === 429 ? 2000 * (attempt + 1) : Math.min(1000 * 2 ** attempt, 15000);
      console.error("retrying " + endpoint + " after " + r.status + " (attempt " + (attempt + 1) + ")");
      await new Promise((s) => setTimeout(s, wait));
      continue;
    }
    break;
  }
  throw new Error(lastErr);
}

// Create (or fetch the existing) direct download link for ONE file, so the portal
// downloads it straight from Dropbox — nothing large is hosted on GitHub. `id` is
// the file's Dropbox id ("id:..."). Retries once on rate-limit; returns null on
// failure (caller falls back to the folder link).
async function sharedFileLink(tok, id) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      method: "POST",
      headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
      body: JSON.stringify({ path: id }),
    });
    if (r.ok) return (await r.json()).url;
    const e = await r.json().catch(() => ({}));
    const tag = e && e.error && e.error[".tag"];
    if (tag === "shared_link_already_exists") {
      const meta = e.error.shared_link_already_exists && e.error.shared_link_already_exists.metadata;
      if (meta && meta.url) return meta.url;
      const r2 = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
        method: "POST",
        headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
        body: JSON.stringify({ path: id, direct_only: true }),
      });
      if (r2.ok) { const j = await r2.json(); if (j.links && j.links[0]) return j.links[0].url; }
      return null;
    }
    if (r.status === 429) { await new Promise((s) => setTimeout(s, 1500 * (attempt + 1))); continue; }
    warnOnce("link", "shared link failed " + r.status + ": " + JSON.stringify(e).slice(0, 160));
    return null;
  }
  return null;
}

async function listFolder(tok, link, path, recursive) {
  let res = await rpc(tok, "files/list_folder", { path, shared_link: { url: link }, recursive: !!recursive });
  let entries = res.entries;
  while (res.has_more) {
    res = await rpc(tok, "files/list_folder/continue", { cursor: res.cursor });
    entries = entries.concat(res.entries);
  }
  return entries;
}

// Recursively collect every file under `base`, labelling each with its path
// relative to `base` (e.g. "Renders / MJ Arsenal · 10mm_Female"). Used for `deep`
// products whose Dropbox folders nest several levels (colorway → type → shoot).
async function collectDeep(tok, link, base, label) {
  const entries = await listFolder(tok, link, base);
  let files = [];
  for (const e of entries) {
    if (e[".tag"] === "file") {
      e.relPath = base + "/" + e.name;
      e.displayName = (label ? label + " · " : "") + e.name.replace(/\.[^.]+$/, "");
      files.push(e);
    } else if (e[".tag"] === "folder") {
      files = files.concat(await collectDeep(tok, link, base + "/" + e.name, label ? label + " / " + e.name : e.name));
    }
  }
  return files;
}

let warned = {};
function warnOnce(key, msg) { if (!warned[key]) { warned[key] = true; console.error(msg); } }

// Dropbox passes call parameters in the "Dropbox-API-Arg" HTTP header, which must
// be ASCII. Filenames often contain non-ASCII (e.g. macOS screenshots use U+202F,
// a narrow no-break space, before AM/PM), so escape every non-ASCII char to \uXXXX
// per Dropbox's HTTP-header-safe JSON requirement.
function apiArg(obj) {
  return JSON.stringify(obj).replace(/[\u0080-\uffff]/g, function (c) {
    return "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
  });
}

// Dropbox-rendered thumbnail (raster images only) → writes jpeg to outFile.
async function thumbV2(tok, link, path, outFile) {
  const r = await fetch("https://content.dropboxapi.com/2/files/get_thumbnail_v2", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + tok,
      "Dropbox-API-Arg": apiArg({ resource: { ".tag": "link", url: link, path }, format: "jpeg", size: "w640h480", mode: "fitone_bestfit" }),
    },
  });
  if (!r.ok) { warnOnce("thumbV2", "thumbnail failed " + r.status + ": " + (await r.text()).slice(0, 200)); return false; }
  writeFileSync(outFile, Buffer.from(await r.arrayBuffer()));
  return true;
}

// Download a file from the shared link to disk (streamed — safe for big videos).
// `path` locates a file *inside* a shared folder; for a shared link that already
// points at a single file (/scl/fi/…) it must be omitted, or Dropbox 400s.
async function downloadFile(tok, link, path, outFile) {
  const arg = path ? { url: link, path } : { url: link };
  const r = await fetch("https://content.dropboxapi.com/2/sharing/get_shared_link_file", {
    method: "POST",
    headers: { Authorization: "Bearer " + tok, "Dropbox-API-Arg": apiArg(arg) },
  });
  if (!r.ok) { warnOnce("dl", "download failed " + r.status + ": " + (await r.text()).slice(0, 200)); return false; }
  await pipeline(Readable.fromWeb(r.body), createWriteStream(outFile));
  return true;
}

function videoFrame(src, out) {
  for (const args of [["-y", "-ss", "1", "-i", src, "-frames:v", "1", "-vf", "scale=640:-1", out],
                      ["-y", "-i", src, "-frames:v", "1", "-vf", "scale=640:-1", out]]) {
    try { execFileSync("ffmpeg", args, { stdio: "ignore" }); if (existsSync(out)) return true; } catch { /* try next */ }
  }
  return false;
}

function pdfFirstPage(src, outBase) {
  try { execFileSync("pdftoppm", ["-jpeg", "-singlefile", "-scale-to", "640", src, outBase], { stdio: "ignore" }); return existsSync(outBase + ".jpg"); }
  catch (e) { warnOnce("pdf", "pdftoppm failed: " + e.message); return false; }
}

// White/light logos are invisible on the default white thumbnail — composite
// the (usually transparent) art onto a dark neutral gray so it shows. ImageMagick
// reads PNG/SVG/AI/PDF; `[0]` takes the first page/layer.
const LIGHT = /white/i;
function grayThumb(src, out, e) {
  try {
    if (e === "ai" || e === "pdf" || e === "eps") {
      // Illustrator/PDF render onto an opaque white artboard via Ghostscript's
      // default device, hiding the gray. Render with pngalpha (transparent) first,
      // then composite the art onto gray.
      const png = out + ".src.png";
      execFileSync("gs", ["-q", "-dNOPAUSE", "-dBATCH", "-dSAFER", "-sDEVICE=pngalpha", "-r150", "-dFirstPage=1", "-dLastPage=1", "-o", png, src], { stdio: "ignore" });
      execFileSync("convert", ["-background", "#3f3f46", png, "-flatten", "-resize", "640x480>", out], { stdio: "ignore" });
      try { unlinkSync(png); } catch {}
    } else {
      execFileSync("convert", ["-background", "#3f3f46", src + "[0]", "-flatten", "-resize", "640x480>", out], { stdio: "ignore" });
    }
    return existsSync(out);
  } catch (err) { warnOnce("gray", "gray thumb failed: " + err.message); return false; }
}

const tok = await getToken();

// Start from whatever is already published, so a partial run never wipes the
// products it didn't get to. Big libraries (one product here has ~6k files) need
// a Dropbox share link minted per file, which is rate-limited and can take hours —
// so we PERSIST AND COMMIT AFTER EACH PRODUCT. A run that's cancelled or times out
// keeps everything it finished, and the next run resumes from the cached links
// instead of starting over.
const SYNCED_FILE = "assets/data/synced.js";
function loadSynced() {
  try {
    const raw = readFileSync(SYNCED_FILE, "utf8").replace(/^\s*window\.PORTAL_SYNCED\s*=\s*/, "").replace(/;\s*$/, "");
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? o : {};
  } catch { return {}; }
}
const synced = loadSynced();

function git(...args) {
  try { execFileSync("git", args, { stdio: "pipe" }); return true; } catch { return false; }
}
git("config", "user.name", "dropbox-sync[bot]");
git("config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com");

// Commit + push whatever the sync has produced so far (its own files only).
function saveProgress(note) {
  writeFileSync(SYNCED_FILE, "window.PORTAL_SYNCED = " + JSON.stringify(synced, null, 2) + ";\n");
  git("add", "assets/data/synced.js", "assets/synced");
  try { execFileSync("git", ["diff", "--cached", "--quiet"], { stdio: "pipe" }); return; } catch { /* has changes */ }
  if (!git("commit", "-m", `Dropbox sync: ${note} [skip ci]`)) return;
  for (let i = 0; i < 5; i++) {
    if (git("push")) { console.log(`  ↳ committed progress: ${note}`); return; }
    git("rebase", "--abort");
    git("pull", "--rebase", "--autostash", "origin", "main");
  }
  console.error(`  ↳ could not push progress for ${note}`);
}

// Products defined as a list of DIRECT file links (currently just Catalogs) skip
// the folder walk entirely: fetch each file's metadata, commit the original so the
// in-page viewer has a same-origin copy, and render a first-page cover. Files are
// named by Dropbox's `rev`, so an unchanged catalog is never re-downloaded and a
// re-uploaded one lands under a new name (no stale-cache problem).
async function syncDirectFiles(p) {
  const dir = join("assets", "synced", p.slug);
  const filesDir = join(dir, "files");
  mkdirSync(filesDir, { recursive: true });
  const keep = new Set(), keepFiles = new Set();
  const out = [];

  for (const spec of p.files) {
    const meta = await rpc(tok, "sharing/get_shared_link_metadata", { url: spec.link });
    if (!meta || meta[".tag"] !== "file") { console.error(`  ! not a file link: ${spec.link.slice(0, 60)}…`); continue; }
    const name = meta.name;                       // e.g. "Stundenglass-2026-Catalog-US.pdf"
    const e = ext(name);
    const base = name.replace(/\.[^.]+$/, "");
    const rev = meta.rev;

    const cf = `${rev}.${e}`;
    const localPath = join(filesDir, cf);
    if (!existsSync(localPath)) {
      console.error(`  ↓ ${name}`);
      await downloadFile(tok, spec.link, "", localPath);
    }
    if (!existsSync(localPath)) { console.error(`  ! download failed: ${name}`); continue; }
    keepFiles.add(cf);

    // First-page cover for the catalog card.
    let thumb = null;
    const tName = `${rev}.jpg`;
    if (e === "pdf") {
      if (!existsSync(join(dir, tName))) pdfFirstPage(localPath, join(dir, rev));
      if (existsSync(join(dir, tName))) { thumb = `assets/synced/${p.slug}/${tName}`; keep.add(tName); }
    }

    out.push({
      name: base,
      type: e === "pdf" ? "pdf" : "file",
      format: e.toUpperCase(),
      url: dlLink(spec.link),                     // Download button → Dropbox
      thumb,
      file: `assets/synced/${p.slug}/files/${cf}`, // viewer needs it same-origin
    });
  }

  synced[p.name] = { folders: { [p.flat || "Files"]: out } };

  // Prune anything from a previous rev so old catalogs don't pile up in the repo.
  for (const f of readdirSync(dir)) {
    if (f === "files" || keep.has(f)) continue;
    try { rmSync(join(dir, f), { recursive: true, force: true }); } catch {}
  }
  for (const f of readdirSync(filesDir)) {
    if (keepFiles.has(f)) continue;
    try { rmSync(join(filesDir, f), { force: true }); } catch {}
  }
  console.error(`${p.name}: ${out.length} file(s)`);
  saveProgress(p.name);
}

for (const p of PRODUCTS) {
  if (p.files) { await syncDirectFiles(p); continue; }

  const dir = join("assets", "synced", p.slug);
  mkdirSync(dir, { recursive: true });
  const keep = new Set();   // thumbnail filenames referenced this run (for pruning)
  const tmp = join(dir, "_tmp");

  // Recursive listing isn't allowed through a shared link, so walk the tree
  // folder-by-folder (one list call per folder) and emit ONE spec per folder that
  // has direct files, named by its full path ("A / B / C"). Powers folders-within-
  // folders drill-down at any depth.
  //
  // Each spec carries the folder's Dropbox `id`, which is what lets us mint a
  // per-folder share link below so "Download folder" zips EXACTLY that folder.
  // Without the id it silently fell back to the whole-product zip — so a 9-file
  // "Product Photos" handed you all 105 files.
  const top = await listFolder(tok, p.link, "");
  const folderSpecs = [];
  const folderIds = {};   // "A / B" -> Dropbox folder id, for EVERY folder (leaf or not)
  async function walkFolder(base, label, entries, id) {
    if (label && id) folderIds[label] = id;
    if (!entries) entries = await listFolder(tok, p.link, base);
    const direct = entries.filter((e) => e[".tag"] === "file");
    if (direct.length) {
      direct.forEach((f) => { f.relPath = base + "/" + f.name; f.displayName = f.name.replace(/\.[^.]+$/, ""); });
      folderSpecs.push({ name: label || p.flat || "Files", prefix: base, files: direct });
    }
    const subFolders = entries.filter((e) => e[".tag"] === "folder");
    subFolders.sort((a, b) => {
      const da = FOLDER_ALIAS[a.name] || a.name, db = FOLDER_ALIAS[b.name] || b.name;
      const ia = FOLDER_ORDER.indexOf(da), ib = FOLDER_ORDER.indexOf(db);
      return ((ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)) || da.localeCompare(db);
    });
    for (const ss of subFolders) {
      const seg = FOLDER_ALIAS[ss.name] || ss.name;
      await walkFolder(base + "/" + ss.name, label ? label + " / " + seg : seg, null, ss.id);
    }
  }
  await walkFolder("", "", top, null);   // product root has no id — it IS p.link

  const filesDir = join(dir, "files");
  mkdirSync(filesDir, { recursive: true });
  const keepFiles = new Set();   // committed original filenames (under files/)

  // Per-file Dropbox download links, cached by file id so we only hit the sharing
  // API for new/changed files (not every file every run). Committed as _links.json.
  const linkCacheFile = join(dir, "_links.json");
  const linkCache = existsSync(linkCacheFile) ? JSON.parse(readFileSync(linkCacheFile, "utf8")) : {};
  let minted = 0;   // newly-minted per-file links this run (drives checkpointing)
  keep.add("_links.json");

  const folders = {};
  for (const spec of folderSpecs) {
    const files = spec.files;
    files.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name, undefined, { numeric: true }));
    const out = [];
    for (const f of files) {
      const e = ext(f.name), type = typeOf(e), path = f.relPath || (spec.prefix + "/" + f.name);
      const hash = f.content_hash, size = f.size || 0;
      // Assets are NOT hosted here — every one downloads straight from Dropbox via
      // its per-file share link, so `file` stays null and all download paths fall
      // through to the Dropbox URL. We only commit small preview THUMBNAILS.
      //
      // The ONE exception is `commitFiles` products (the Catalogs folder): Dropbox
      // blocks iframe embedding AND cross-origin fetch, so an in-page PDF viewer
      // cannot read a Dropbox link — the PDF must be same-origin to be viewable.
      let thumb = null, fileRel = null;
      try {
        if (p.commitFiles && size <= MAX_COMMIT && type !== "video") {
          const cf = `${hash}.${e}`;
          if (!existsSync(join(filesDir, cf))) await downloadFile(tok, p.link, path, join(filesDir, cf));
          if (existsSync(join(filesDir, cf))) { fileRel = `assets/synced/${p.slug}/files/${cf}`; keepFiles.add(cf); }
        }
        const localOrig = fileRel ? join(filesDir, `${hash}.${e}`) : null;

        // White/light logos → composite onto gray (baked into the thumbnail) so
        // they're visible. Distinct `-lt.jpg` name so old white thumbs get pruned.
        if (LIGHT.test(f.name) && type !== "video") {
          const tn = hash + "-lt2.jpg";
          if (!existsSync(join(dir, tn))) {
            const src = localOrig || (await downloadFile(tok, p.link, path, tmp + "." + e) ? tmp + "." + e : null);
            if (src) { grayThumb(src, join(dir, tn), e); if (src === tmp + "." + e) unlinkSync(src); }
          }
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        }

        // Thumbnail (reuses the committed original when we have it). Skipped when
        // the gray light-logo composite above already produced one.
        if (thumb) {
          /* light composite done */
        } else if (type === "vector") {
          // Rasterize the SVG to a transparent PNG preview. The original SVG is
          // NOT committed — it downloads from Dropbox like everything else.
          const tn = hash + "-svg.png";
          if (!existsSync(join(dir, tn))) {
            const src = (await downloadFile(tok, p.link, path, tmp + ".svg")) ? tmp + ".svg" : null;
            if (src) {
              try { execFileSync("convert", ["-background", "none", src, "-resize", "640x480>", join(dir, tn)], { stdio: "ignore" }); }
              catch (e2) { warnOnce("svgthumb", "svg thumb failed: " + e2.message); }
              try { unlinkSync(src); } catch {}
            }
          }
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        } else if (type === "image" && p.pngThumbs) {
          // Logos: transparent PNG thumbnails. Dropbox's thumbnail service flattens
          // alpha to white, so resize the original with ImageMagick to keep it.
          const tn = hash + "-tr.png";
          if (!existsSync(join(dir, tn))) {
            const src = (await downloadFile(tok, p.link, path, tmp + "." + e)) ? tmp + "." + e : null;
            if (src) {
              try { execFileSync("convert", [src + "[0]", "-resize", "640x480>", join(dir, tn)], { stdio: "ignore" }); }
              catch (e2) { warnOnce("pngthumb", "png thumb failed: " + e2.message); }
              try { unlinkSync(src); } catch {}
            }
          }
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        } else if (type === "image") {
          const tn = hash + ".jpg";
          if (!existsSync(join(dir, tn))) await thumbV2(tok, p.link, path, join(dir, tn));
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        } else if (type === "pdf" || e === "ai") {
          const tn = hash + ".jpg";
          if (!existsSync(join(dir, tn))) {
            const src = localOrig || (await downloadFile(tok, p.link, path, tmp + ".pdf") ? tmp + ".pdf" : null);
            if (src) { pdfFirstPage(src, join(dir, hash)); if (src === tmp + ".pdf") unlinkSync(src); }
          }
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        } else if (type === "video") {
          const tn = hash + ".jpg";
          if (!existsSync(join(dir, tn))) {
            const src = localOrig || (await downloadFile(tok, p.link, path, tmp + "." + e) ? tmp + "." + e : null);
            if (src) { videoFrame(src, join(dir, tn)); if (src === tmp + "." + e) unlinkSync(src); }
          }
          if (existsSync(join(dir, tn))) { thumb = `assets/synced/${p.slug}/${tn}`; keep.add(tn); }
        }
      } catch (err) { warnOnce("gen-" + type, "asset error (" + f.name + "): " + err.message); }

      // Per-file download link (cached). Every file downloads straight from
      // Dropbox; if the link can't be made, fall back to the folder link.
      let dlUrl = linkCache[f.id];
      if (!dlUrl && f.id) {
        try { dlUrl = await sharedFileLink(tok, f.id); } catch { dlUrl = null; }
        if (dlUrl) linkCache[f.id] = dlUrl;
        minted++;
        // Minting is rate-limited and a big product can take hours. Checkpoint the
        // link cache + thumbnails periodically so a cancelled/timed-out run keeps
        // the work it already did and the next run resumes instead of restarting.
        if (minted % 250 === 0) {
          writeFileSync(linkCacheFile, JSON.stringify(linkCache));
          git("add", "assets/synced");
          let dirty = true;
          try { execFileSync("git", ["diff", "--cached", "--quiet"], { stdio: "pipe" }); dirty = false; } catch {}
          if (dirty && git("commit", "-m", `Dropbox sync: ${p.name} progress (${minted} links) [skip ci]`)) {
            for (let i = 0; i < 5; i++) {
              if (git("push")) break;
              git("rebase", "--abort");
              git("pull", "--rebase", "--autostash", "origin", "main");
            }
          }
          console.log(`  ↳ ${p.name}: checkpointed ${minted} new links`);
        }
      }

      out.push({ name: f.displayName || f.name.replace(/\.[^.]+$/, ""), type, format: e.toUpperCase(), url: dlUrl || p.link, thumb, file: fileRel });
    }
    if (out.length) folders[spec.name] = (folders[spec.name] || []).concat(out);  // concat so aliased names merge
  }

  // Per-folder Dropbox share link (cached by folder id) so "Download folder" zips
  // exactly that folder. Minted for EVERY folder, including branch folders that
  // hold only other folders ("Black") — the portal offers Download/Copy there too.
  // Only falls back to the whole-product link if Dropbox won't mint one; that's a
  // real fallback now, not the silent default it used to be.
  const folderLinks = {};
  let folderLinksMinted = 0;
  for (const path of Object.keys(folderIds)) {
    const id = folderIds[path];
    let fl = linkCache[id];
    if (!fl) {
      try { fl = await sharedFileLink(tok, id); } catch { fl = null; }
      if (fl) { linkCache[id] = fl; folderLinksMinted++; }
    }
    folderLinks[path] = dlLink(fl || p.link);
  }
  if (folderLinksMinted) console.error(`  ↳ minted ${folderLinksMinted} folder link(s)`);

  // Prune thumbnails / originals for files that no longer exist.
  for (const fn of readdirSync(dir)) if (fn !== "files" && !keep.has(fn)) { try { unlinkSync(join(dir, fn)); } catch {} }
  for (const fn of readdirSync(filesDir)) if (!keepFiles.has(fn)) { try { unlinkSync(join(filesDir, fn)); } catch {} }

  writeFileSync(linkCacheFile, JSON.stringify(linkCache));

  synced[p.name] = { folders, dropbox: dlLink(p.link), folderLinks };
  const total = Object.values(folders).reduce((n, a) => n + a.length, 0);
  const withThumb = Object.values(folders).reduce((n, a) => n + a.filter((x) => x.thumb).length, 0);
  const withLink = Object.values(folders).reduce((n, a) => n + a.filter((x) => /scl\/fi\//.test(x.url)).length, 0);
  console.log(`${p.name}: ${folderSpecs.length} folders, ${total} files, ${withThumb} thumbnails, ${withLink} per-file links`);
  // Persist + publish this product immediately, so hours of rate-limited link
  // minting survive a cancelled/timed-out run and the next one resumes.
  saveProgress(p.name);
}

saveProgress("all products");
console.log("Wrote assets/data/synced.js");
