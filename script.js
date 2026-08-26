const products = window.PRODUCTS ?? [];
const collections = window.COLLECTIONS ?? [];
const grid = document.querySelector("#productGrid");
const filters = document.querySelector("#categoryFilters");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");
const collectionCards = document.querySelector("#collectionCards");

let activeCategory = "Alle";
let query = "";

const categories = ["Alle", ...new Set(products.map((product) => product.category).filter(Boolean))];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function renderCollections() {
  if (!collectionCards) return;

  collectionCards.innerHTML = collections.map((collection) => {
    const count = products.filter((product) => {
      if (collection.productIds?.length) return collection.productIds.includes(product.id);
      if (collection.category) return product.category === collection.category;
      return true;
    }).length;

    return `
      <a class="collection-card" href="${escapeHtml(collection.page)}">
        <span class="collection-card-kicker">${escapeHtml(collection.eyebrow)}</span>
        <strong>${escapeHtml(collection.title)}</strong>
        <span>${escapeHtml(collection.description)}</span>
        <small>${count} ${count === 1 ? "Empfehlung" : "Empfehlungen"} →</small>
      </a>
    `;
  }).join("");
}

function renderFilters() {
  filters.innerHTML = categories.map((category) => `
    <button class="filter-button ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(category)}" type="button">
      ${escapeHtml(category)}
    </button>
  `).join("");

  filters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === "Alle" || product.category === activeCategory;
    const haystack = `${product.title} ${product.description} ${product.category}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  grid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
      </div>
      <div class="product-body">
        <p class="product-category">${escapeHtml(product.category)}</p>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
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

search.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderProducts();
});

year.textContent = new Date().getFullYear();
renderCollections();
renderFilters();
renderProducts();
