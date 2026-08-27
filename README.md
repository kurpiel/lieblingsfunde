# Lieblingsfunde – statische Amazon-Affiliate-Seite

Eine kleine statische Website, die direkt über GitHub Pages veröffentlicht werden kann. Kein npm, kein Build und kein Backend nötig.

## 1. Amazon Partner-ID einmal eintragen

Öffne `settings.js` und trage deine Partner-ID ein:

```js
window.SITE_SETTINGS = {
  amazon: {
    partnerId: "DEINE-PARTNER-ID-21",
    domain: "www.amazon.de"
  }
};
```

Danach erzeugt die Website für jedes Produkt mit ASIN automatisch einen Partnerlink nach dem Muster:

```text
https://www.amazon.de/dp/ASIN/ref=nosim?tag=DEINE-PARTNER-ID-21
```

Solange die Partner-ID leer ist, bleibt die Seite im sicheren Fallback-Modus und verwendet neutrale Amazon-Produkt- oder Suchlinks.

`affiliateUrl` in `products.js` bleibt als optionaler Override erhalten. Wenn du für ein einzelnes Produkt lieber einen SiteStripe-Link verwendest, trägst du ihn dort ein; er hat Vorrang vor dem automatisch erzeugten Link.

## 2. Produkte bearbeiten

Alle Produkte stehen in `products.js`.

```js
{
  id: "anker-737-powerbank",
  title: "Anker 737 Powerbank (PowerCore 24K)",
  category: "Technik",
  asin: "B09VPHVT2Z",
  affiliateUrl: "", // optionaler SiteStripe-Override
  amazonUrl: "https://www.amazon.de/dp/B09VPHVT2Z",
  description: "Kurze Beschreibung.",
  imageUrl: "", // von Amazon bereitgestellte bzw. zulässig nutzbare Bild-URL
  badge: "Top-Auswahl"
}
```

`id` sollte eindeutig sein. `badge` ist optional.

## 3. Pinterest-Landingpages bearbeiten

Die Sammlungen stehen zentral in `collections.js`. Die mitgelieferten Seiten sind:

- `kueche.html`
- `wohnen.html`
- `technik.html`

Eine Sammlung kann automatisch alle Produkte einer Kategorie anzeigen:

```js
{
  slug: "kueche",
  page: "kueche.html",
  title: "Praktische Küchenhelfer",
  eyebrow: "Küche",
  description: "...",
  category: "Küche"
}
```

Oder du stellst eine individuelle Auswahl über Produkt-IDs zusammen:

```js
{
  slug: "geschenkideen",
  page: "geschenkideen.html",
  title: "10 schöne Geschenkideen",
  eyebrow: "Geschenke",
  description: "...",
  productIds: ["tischleuchte", "milchaufschaeumer", "usb-c-ladegeraet"]
}
```

Für eine komplett neue Landingpage kopierst du z. B. `kueche.html`, benennst sie um und änderst dort nur:

```html
<script>window.COLLECTION_SLUG = "dein-slug";</script>
```

Anschließend ergänzt du die Sammlung in `collections.js`.

## 4. GitHub Pages veröffentlichen

1. Neues GitHub Repository anlegen.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. In GitHub `Settings` → `Pages` öffnen.
4. Unter `Build and deployment` die Quelle `Deploy from a branch` wählen.
5. Branch `main` und Ordner `/ (root)` wählen.
6. Speichern.

Danach ist die Seite über deine GitHub-Pages-Adresse erreichbar.

## 5. Pinterest verwenden

Verlinke einen Pin möglichst direkt auf die passende Landingpage, z. B.:

- Küchen-Pin → `https://DEINNAME.github.io/REPO/kueche.html`
- Wohn-Pin → `https://DEINNAME.github.io/REPO/wohnen.html`
- Technik-Pin → `https://DEINNAME.github.io/REPO/technik.html`

So landet der Besucher direkt bei den zum Pin passenden Empfehlungen.

## 6. Vor Veröffentlichung

- Amazon-Affiliate-Links eintragen.
- Impressum und Datenschutz vervollständigen.
- Affiliate-Hinweis prüfen und passend zu deinem Einsatz kennzeichnen.
- Nur Bilder verwenden, für die du die erforderlichen Nutzungsrechte besitzt bzw. die Amazon-Regeln einhalten.
- Bei Preisangaben auf Amazons Vorgaben und Aktualität achten; im Zweifel keinen statischen Preis nennen.

## Dateien

- `index.html` – Startseite
- `settings.js` – deine zentrale Amazon Partner-ID
- `products.js` – zentrale Produktdaten
- `collections.js` – zentrale Landingpage-/Sammlungsdaten
- `script.js` – Startseitenlogik
- `collection-page.js` – gemeinsame Logik aller Landingpages
- `kueche.html`, `wohnen.html`, `technik.html` – Pinterest-Zielseiten
- `styles.css` – gemeinsames Design
- `impressum.html`, `datenschutz.html` – rechtliche Platzhalter


## Ratgeber / Originalinhalte
Die Version enthält 10 eigenständige Ratgeberseiten. Passe die Texte an deine tatsächliche Auswahl und Erfahrung an, bevor du sie veröffentlichst. Behaupte insbesondere keine eigenen Tests oder Erfahrungen, die du nicht gemacht hast. Konkrete Amazon-Produkte und Partnerlinks kannst du anschließend passend ergänzen.

## Produktdaten – neue Version

Die Seite enthält jetzt 20 recherchierte Kernprodukte. Alle Produktdaten liegen zentral in `products.js`.

### Automatische Partnerlinks

Für 19 der 20 Kernprodukte ist eine konkrete recherchierte ASIN hinterlegt. Sobald du in `settings.js` deine Partner-ID einträgst, werden deren Affiliate-Links automatisch erzeugt.

Beim **Philips Hue Smart Plug** ist die Hersteller-Produktnummer hinterlegt, aber die ASIN bewusst noch offen. Hier solltest du die konkrete Amazon.de-Variante selbst öffnen und entweder die ASIN ergänzen oder einen SiteStripe-Link bei `affiliateUrl` eintragen. So vermeiden wir, versehentlich auf eine falsche Variante zu verlinken.

Ein manueller SiteStripe-Link ist weiterhin jederzeit möglich:

```js
affiliateUrl: "https://amzn.to/DEIN-LINK",
```

Reihenfolge der Linkwahl:

1. `affiliateUrl` (manuell/SiteStripe), falls vorhanden.
2. Automatisch aus `asin` + Partner-ID.
3. `amazonUrl` als neutraler Fallback.

### Produktbilder

Die Produktkarten unterstützen jetzt pro Produkt eine `imageUrl`:

```js
imageUrl: "https://...",
```

Solange `imageUrl` leer ist, erscheint automatisch ein neutraler Marken-Platzhalter. Kann ein externes Bild später nicht mehr geladen werden, fällt die Karte ebenfalls automatisch auf diesen Platzhalter zurück.

Das Produktbild ist klickbar und führt auf denselben Amazon-Link wie der Button. Bilder werden mit `loading="lazy"` und `decoding="async"` geladen, damit die Startseite trotz vieler Produkte schnell bleibt. Das Layout verwendet `object-fit: contain`, damit Produktfotos nicht abgeschnitten werden.

**Empfohlener Workflow:** Öffne das konkrete Produkt als Amazon-Partner und verwende nur eine Bildquelle, die Amazon dir für das Partnerprogramm bereitstellt bzw. für deren Nutzung du anderweitig die Rechte hast. Trage die externe Bild-URL in `imageUrl` ein. Lade Amazon-Produktbilder nicht einfach herunter und speichere sie nicht im GitHub-Repository.

Beispiel:

```js
{
  id: "anker-737-powerbank",
  title: "Anker 737 Powerbank (PowerCore 24K)",
  asin: "B09VPHVT2Z",
  imageUrl: "HIER-DIE-ZULÄSSIGE-BILD-URL-EINTRAGEN",
  affiliateUrl: ""
}
```

`image` aus älteren Datenständen wird technisch weiterhin unterstützt, für neue Einträge solltest du aber nur noch `imageUrl` verwenden.

### Preise und Bewertungen

`research.priceRange`, `research.ratingSnapshot` und `research.reviewCountSnapshot` dienen ausschließlich deiner internen Auswahl. Sie werden bewusst nicht auf der Website angezeigt, da diese Werte schnell veralten.

### Ratgeber-Zuordnung

Über `articleSlugs` legst du fest, in welchen Ratgebern ein Produkt automatisch angezeigt wird. Beispiel:

```js
articleSlugs: ["technik-alltag", "usb-c-zubehoer", "homeoffice-helfer"]
```

Damit musst du ein Produkt nur einmal pflegen und kannst es auf mehreren Pinterest-Landingpages einsetzen.


## Produkt-Admin

Öffne lokal oder auf GitHub Pages `products-admin.html`. Die Seite zeigt dir für jedes Produkt:

- ob eine ASIN vorhanden ist
- ob ein Bild hinterlegt ist
- ob ein manueller Affiliate-Link gesetzt ist oder der automatische Link über `partnerId` funktioniert
- auf wie vielen Ratgeberseiten das Produkt verwendet wird

### Neues Bildformat

Für neue Produkte:

```js
image: {
  src: "HIER_DIE_ZULÄSSIGE_BILD_URL",
  source: "amazon"
}
```

`source` kann später auch z. B. `manufacturer` oder `creators-api` sein.

Die Admin-Seite ist nur für dich gedacht und sollte nicht in der öffentlichen Navigation verlinkt werden.


## Übergangs-Bilder ohne Amazon API

Unter `assets/products/` liegen generische SVG-Illustrationen für die wichtigsten Produkttypen. Sie zeigen **nicht das konkrete Markenprodukt**, sondern dienen nur als neutrale Kategorieillustration.

In `products.js` werden sie so referenziert:

```js
image: {
  src: "assets/products/powerbank.svg",
  source: "illustration"
}
```

Sobald offizielle Amazon-/Creators-API-Bilder verfügbar sind, kann `src` ersetzt und `source` auf `amazon` oder `creators-api` geändert werden.
