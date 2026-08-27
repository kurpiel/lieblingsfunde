const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = "https://kurpiel.github.io/lieblingsfunde/";

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function write(file, content) {
  fs.writeFileSync(path.join(ROOT, file), content, "utf8");
}

function loadWindowVar(file, varName) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(file), sandbox, { filename: file });
  return sandbox.window[varName] || [];
}

const products = loadWindowVar("products.js", "PRODUCTS");
const articles = loadWindowVar("articles.js", "ARTICLES");
const collections = loadWindowVar("collections.js", "COLLECTIONS");
const settings = loadWindowVar("settings.js", "SITE_SETTINGS");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function partnerId() {
  const id = settings?.amazon?.partnerId?.trim?.() || "";
  return /DEINE|YOUR/i.test(id) ? "" : id;
}

function productUrl(product) {
  if (product.affiliateUrl?.trim()) return product.affiliateUrl.trim();

  const tag = partnerId();
  if (tag && product.asin) {
    return `https://www.amazon.de/dp/${encodeURIComponent(product.asin)}/ref=nosim?tag=${encodeURIComponent(tag)}`;
  }

  return product.amazonUrl || "https://www.amazon.de/";
}

function productImage(product) {
  if (typeof product.image === "string") return product.image.trim();
  if (product.image && typeof product.image === "object") {
    return String(product.image.src || "").trim();
  }
  return String(product.imageUrl || "").trim();
}

function initials(product) {
  const source = product.brand || product.title || "LF";
  return source.split(/\s+/).slice(0, 2).map(x => x[0] || "").join("").toUpperCase();
}

function productCard(product, headingLevel = 3) {
  const url = productUrl(product);
  const image = productImage(product);

  const media = image
    ? `<a class="product-image-link" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener" aria-label="${esc(product.title)} bei Amazon ansehen">
        <img class="product-image" src="${esc(image)}" alt="${esc(product.title)}" loading="lazy" decoding="async" />
      </a>`
    : `<div class="product-placeholder" aria-hidden="true"><span>${esc(initials(product))}</span><small>${esc(product.brand || "Lieblingsfunde")}</small></div>`;

  const badge = product.badge ? `<span class="product-badge">${esc(product.badge)}</span>` : "";
  const highlights = (product.highlights || []).slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("");
  const note = partnerId() || product.affiliateUrl ? "Werbe-/Affiliate-Link" : "Amazon-Produktlink";

  return `<article class="product-card">
    <div class="product-image-wrap">
      ${media}
      ${badge}
    </div>
    <div class="product-body">
      <p class="product-category">${esc(product.category)} · ${esc(product.brand)}</p>
      <h${headingLevel} class="product-title">${esc(product.title)}</h${headingLevel}>
      <p class="product-description">${esc(product.description)}</p>
      ${highlights ? `<ul class="product-highlights">${highlights}</ul>` : ""}
      <div class="product-footer">
        <a class="button button-secondary" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener">Bei Amazon ansehen</a>
        <small class="product-note">${note}</small>
      </div>
    </div>
  </article>`;
}

function replaceBetweenIds(html, elementStartPattern, content, closingTag) {
  const re = new RegExp(`(${elementStartPattern})[\\s\\S]*?(</${closingTag}>)`, "i");
  if (!re.test(html)) {
    throw new Error(`Build marker not found: ${elementStartPattern}`);
  }
  return html.replace(re, `$1\n${content}\n$2`);
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
}

function upsertMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function upsertLink(html, rel, href) {
  const pattern = new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*\\/?>`, "i");
  const tag = `<link rel="${rel}" href="${esc(href)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function applyMeta(html, { title, description, url, image, type = "website" }) {
  html = setTitle(html, title);
  html = upsertLink(html, "canonical", url);
  html = upsertMeta(html, "name", "description", description);
  html = upsertMeta(html, "property", "og:site_name", "Lieblingsfunde");
  html = upsertMeta(html, "property", "og:type", type);
  html = upsertMeta(html, "property", "og:title", title);
  html = upsertMeta(html, "property", "og:description", description);
  html = upsertMeta(html, "property", "og:url", url);
  html = upsertMeta(html, "property", "og:image", image);
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  return html;
}

// STARTSEITE
{
  let html = read("index.html");

  html = applyMeta(html, {
    title: "Lieblingsfunde – praktische Empfehlungen für Zuhause & Alltag",
    description: "Ausgewählte Produktempfehlungen, praktische Alltagshelfer und Ratgeber rund um Küche, Wohnen, Technik und Homeoffice.",
    url: BASE_URL,
    image: BASE_URL + "assets/social/lieblingsfunde.png",
  });

  const cards = products.map(p => productCard(p, 3)).join("\n");
  html = replaceBetweenIds(
    html,
    '<section class="product-grid" id="productGrid" aria-live="polite">',
    cards,
    "section"
  );

  const collectionCards = collections.map(c => {
    const ids = c.productIds || [];
    const count = ids.length
      ? products.filter(p => ids.includes(p.id)).length
      : products.filter(p => p.category === c.category).length;

    return `<a class="collection-card" href="${esc(c.page)}">
      <span class="collection-card-kicker">${esc(c.eyebrow)}</span>
      <strong>${esc(c.title)}</strong>
      <span>${esc(c.description)}</span>
      <small>${count} ${count === 1 ? "Empfehlung" : "Empfehlungen"} →</small>
    </a>`;
  }).join("\n");

  html = replaceBetweenIds(
    html,
    '<div class="collection-cards" id="collectionCards">',
    collectionCards,
    "div"
  );

  const articleCards = articles.map(a => `<a class="article-card" href="${esc(a.slug)}.html">
    <span class="eyebrow">${esc(a.category)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.description)}</p>
    <strong>Ratgeber lesen →</strong>
  </a>`).join("\n");

  html = replaceBetweenIds(
    html,
    '<div class="article-cards" id="articleCards">',
    articleCards,
    "div"
  );

  write("index.html", html);
}

// SAMMLUNGEN
for (const collection of collections) {
  const file = collection.page;
  if (!fs.existsSync(path.join(ROOT, file))) continue;

  let html = read(file);
  html = applyMeta(html, {
    title: `${collection.title} | Lieblingsfunde`,
    description: collection.description,
    url: BASE_URL + file,
    image: BASE_URL + `assets/social/${collection.slug}.png`,
  });

  html = html.replace(
    /(<p class="eyebrow" id="collectionEyebrow">)[\s\S]*?(<\/p>)/i,
    `$1${esc(collection.eyebrow)}$2`
  );
  html = html.replace(
    /(<h1 id="collectionTitle">)[\s\S]*?(<\/h1>)/i,
    `$1${esc(collection.title)}$2`
  );
  html = html.replace(
    /(<p class="hero-text" id="collectionDescription">)[\s\S]*?(<\/p>)/i,
    `$1${esc(collection.description)}$2`
  );

  const ids = collection.productIds || [];
  const filtered = ids.length
    ? products.filter(p => ids.includes(p.id))
    : products.filter(p => p.category === collection.category);

  html = replaceBetweenIds(
    html,
    '<section class="product-grid collection-grid" id="collectionGrid" aria-live="polite">',
    filtered.map(p => productCard(p, 2)).join("\n"),
    "section"
  );

  write(file, html);
}

// RATGEBER
for (const article of articles) {
  const file = `${article.slug}.html`;
  if (!fs.existsSync(path.join(ROOT, file))) continue;

  let html = read(file);
  html = applyMeta(html, {
    title: `${article.title} | Lieblingsfunde`,
    description: article.description,
    url: BASE_URL + file,
    image: BASE_URL + `assets/social/${article.slug}.png`,
    type: "article",
  });

  // vorhandenen statischen Produktblock ersetzen statt doppelt einzufügen
  const matches = products.filter(p => (p.articleSlugs || []).includes(article.slug));
  const section = `<section class="article-products">
    <div class="article-products-heading">
      <p class="eyebrow">Passende Produkte</p>
      <h2>Meine Produktauswahl zu diesem Ratgeber</h2>
      <p>Die Auswahl basiert auf Alltagsnutzen, Nachfrageindikatoren und einer Mischung aus günstigen Einstiegs- und höherpreisigen Produkten. Preise und Bewertungen werden bewusst nicht statisch angezeigt.</p>
    </div>
    <div class="article-product-grid">
      ${matches.map(p => productCard(p, 3)).join("\n")}
    </div>
  </section>`;

  const existing = /<section class="article-products">[\s\S]*?<\/section>\s*(?=<section class="disclosure">)/i;
  if (existing.test(html)) {
    html = html.replace(existing, section + "\n");
  } else {
    html = html.replace('<section class="disclosure">', section + '\n<section class="disclosure">');
  }

  write(file, html);
}

// SITEMAP
const urls = [
  BASE_URL,
  ...collections.map(c => BASE_URL + c.page),
  ...articles.map(a => BASE_URL + `${a.slug}.html`)
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.flatMap(url => ["  <url>", `    <loc>${url}</loc>`, "  </url>"]),
  "</urlset>",
  ""
].join("\n");

write("sitemap.xml", sitemap);

console.log(`Build abgeschlossen: ${products.length} Produkte, ${collections.length} Sammlungen, ${articles.length} Ratgeber.`);
