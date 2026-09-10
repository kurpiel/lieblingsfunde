const products = window.PRODUCTS ?? [];
const isCuratedHomeGrid = document.body.classList.contains("curated-home");

const grid = document.querySelector("#productGrid");
const filters = document.querySelector("#categoryFilters");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");

let activeCategory = "Alle";
let query = "";

const categories = [
  "Alle",
  ...new Set(products.map((product) => product.category).filter(Boolean)),
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderFilters() {
  if (!filters) return;

  filters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-button ${category === activeCategory ? "active" : ""}"
          data-category="${escapeHtml(category)}"
          type="button">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");

  filters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category ?? "Alle";
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  if (!grid) return;

  const normalizedQuery = query.toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Alle" || product.category === activeCategory;

    const haystack =
      `${product.title} ${product.description} ${product.category} ${product.brand || ""}`.toLowerCase();

    return matchesCategory && haystack.includes(normalizedQuery);
  });

  grid.innerHTML = filtered
    .map((product) => window.ProductUtils.card(product, 3))
    .join("");

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }
}

search?.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderProducts();
});

if (year) {
  year.textContent = new Date().getFullYear();
}

// Nur die interaktiven Filter werden beim Start erzeugt.
// Die Produkt-, Sammlungs- und Ratgeberkarten bleiben in ihrer
// statisch vorgerenderten HTML-Version bestehen, bis ein Nutzer
// Suche oder Filter verwendet.
renderFilters();


// Carousel auf der Startseite für aktuell hervorgehobene Produkte.
const featuredCarouselTrack = document.querySelector("#featuredCarouselTrack");
const featuredPrev = document.querySelector("#featuredPrev");
const featuredNext = document.querySelector("#featuredNext");

function scrollFeaturedCarousel(direction) {
  if (!featuredCarouselTrack) return;

  const firstCard = featuredCarouselTrack.querySelector(".product-card");
  const gap = 18;
  const step = firstCard
    ? firstCard.getBoundingClientRect().width + gap
    : featuredCarouselTrack.clientWidth * 0.85;

  featuredCarouselTrack.scrollBy({
    left: direction * step,
    behavior: "smooth",
  });
}

featuredPrev?.addEventListener("click", () => scrollFeaturedCarousel(-1));
featuredNext?.addEventListener("click", () => scrollFeaturedCarousel(1));

featuredCarouselTrack?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    scrollFeaturedCarousel(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    scrollFeaturedCarousel(1);
  }
});
