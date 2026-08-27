window.ProductUtils = (() => {
  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getPartnerId() {
    return window.SITE_SETTINGS?.amazon?.partnerId?.trim() || "";
  }

  function getAmazonDomain() {
    return window.SITE_SETTINGS?.amazon?.domain?.trim() || "www.amazon.de";
  }

  function generatedAffiliateUrl(product) {
    const partnerId = getPartnerId();
    const asin = product.asin?.trim();

    if (!partnerId || !asin) return "";

    return `https://${getAmazonDomain()}/dp/${encodeURIComponent(asin)}/ref=nosim?tag=${encodeURIComponent(partnerId)}`;
  }

  function getUrl(product) {
    return product.affiliateUrl?.trim()
      || generatedAffiliateUrl(product)
      || product.amazonUrl
      || "https://www.amazon.de/";
  }

  function hasAffiliateUrl(product) {
    return Boolean(product.affiliateUrl?.trim() || generatedAffiliateUrl(product));
  }

  function getLinkMode(product) {
    if (product.affiliateUrl?.trim()) return "manual";
    if (generatedAffiliateUrl(product)) return "generated";
    return "fallback";
  }

  function getImageUrl(product) {
    // `image` bleibt als Abwärtskompatibilität für ältere Datenstände erhalten.
    return product.imageUrl?.trim() || product.image?.trim() || "";
  }

  function initials(product) {
    const source = product.brand || product.title || "LF";
    return source.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function placeholder(product, hidden = false) {
    return `<div class="product-placeholder" aria-hidden="true"${hidden ? " hidden" : ""}><span>${escapeHtml(initials(product))}</span><small>${escapeHtml(product.brand || "Lieblingsfunde")}</small></div>`;
  }

  function media(product) {
    const imageUrl = getImageUrl(product);
    const productUrl = getUrl(product);

    if (!imageUrl) {
      return placeholder(product);
    }

    return `
      <a class="product-image-link" href="${escapeHtml(productUrl)}" target="_blank" rel="nofollow sponsored noopener" aria-label="${escapeHtml(product.title)} bei Amazon ansehen">
        <img
          class="product-image"
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(product.title)}"
          loading="lazy"
          decoding="async"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        />
        ${placeholder(product, true)}
      </a>`;
  }

  function card(product, headingLevel = 3) {
    const heading = Math.max(2, Math.min(6, Number(headingLevel) || 3));
    const mode = getLinkMode(product);
    const highlights = (product.highlights || []).slice(0, 3);
    const note = mode === "manual"
      ? "Werbe-/Affiliate-Link (SiteStripe)"
      : mode === "generated"
        ? "Werbe-/Affiliate-Link"
        : product.asin
          ? "Partner-ID noch nicht in settings.js eingetragen"
          : "ASIN/Partnerlink noch prüfen · neutraler Amazon-Link";

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          ${media(product)}
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
        </div>
        <div class="product-body">
          <p class="product-category">${escapeHtml(product.category)} · ${escapeHtml(product.brand || "")}</p>
          <h${heading} class="product-title">${escapeHtml(product.title)}</h${heading}>
          <p class="product-description">${escapeHtml(product.description)}</p>
          ${highlights.length ? `<ul class="product-highlights">${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          <div class="product-footer">
            <a class="button button-secondary" href="${escapeHtml(getUrl(product))}" target="_blank" rel="nofollow sponsored noopener">Bei Amazon ansehen</a>
            <small class="product-note">${escapeHtml(note)}</small>
          </div>
        </div>
      </article>`;
  }

  return {
    escapeHtml,
    getPartnerId,
    generatedAffiliateUrl,
    getUrl,
    hasAffiliateUrl,
    getLinkMode,
    getImageUrl,
    media,
    card
  };
})();
