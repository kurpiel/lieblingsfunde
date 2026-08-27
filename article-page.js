const products = window.PRODUCTS ?? [];
const currentSlug = location.pathname.split("/").pop().replace(/\.html$/, "") || "";
const matches = products.filter((product) => product.articleSlugs?.includes(currentSlug));
const articleList = document.querySelector(".article-list");
const disclosure = document.querySelector(".disclosure");

if (matches.length && disclosure && !document.querySelector(".article-products")) {
  const section = document.createElement("section");
  section.className = "article-products";
  section.innerHTML = `
    <div class="article-products-heading">
      <p class="eyebrow">Passende Produkte</p>
      <h2>Meine Produktauswahl zu diesem Ratgeber</h2>
      <p>Die Auswahl basiert auf Alltagsnutzen, Nachfrageindikatoren und einer Mischung aus günstigen Einstiegs- und höherpreisigen Produkten. Preise und Bewertungen werden bewusst nicht statisch angezeigt.</p>
    </div>
    <div class="article-product-grid">
      ${matches.map((product) => window.ProductUtils.card(product, 3)).join("")}
    </div>`;
  disclosure.before(section);
}

// Die alten Platzhalter aus der ersten Version werden entfernt, sobald echte Empfehlungen vorhanden sind.
if (matches.length && articleList) {
  articleList.querySelectorAll(".product-slot").forEach((slot) => slot.remove());
}
