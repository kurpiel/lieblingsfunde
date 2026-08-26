const products = window.PRODUCTS ?? [];
const collections = window.COLLECTIONS ?? [];
const slug = window.COLLECTION_SLUG;
const collection = collections.find((item) => item.slug === slug);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const grid = document.querySelector("#collectionGrid");
const emptyState = document.querySelector("#collectionEmptyState");
const year = document.querySelector("#year");

if (!collection) {
  document.querySelector("#collectionTitle").textContent = "Sammlung nicht gefunden";
  document.querySelector("#collectionDescription").textContent = "Diese Sammlung ist noch nicht konfiguriert.";
} else {
  document.title = `${collection.title} – Lieblingsfunde`;
  document.querySelector("#collectionEyebrow").textContent = collection.eyebrow;
  document.querySelector("#collectionTitle").textContent = collection.title;
  document.querySelector("#collectionDescription").textContent = collection.description;

  const filtered = products.filter((product) => {
    if (collection.productIds?.length) return collection.productIds.includes(product.id);
    if (collection.category) return product.category === collection.category;
    return true;
  });

  grid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
      </div>
      <div class="product-body">
        <p class="product-category">${escapeHtml(product.category)}</p>
        <h2 class="product-title">${escapeHtml(product.title)}</h2>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-footer">
          ${product.price ? `<span class="product-price">${escapeHtml(product.price)}</span>` : ""}
          <a class="button button-secondary" href="${escapeHtml(product.url)}" target="_blank" rel="nofollow sponsored noopener">Bei Amazon ansehen</a>
          <small class="product-note">Affiliate-Link · Preis kann sich ändern</small>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length !== 0;
}

year.textContent = new Date().getFullYear();
