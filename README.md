# Lieblingsfunde – statische Amazon-Affiliate-Seite

Eine kleine statische Website, die direkt über GitHub Pages veröffentlicht werden kann. Kein npm, kein Build und kein Backend nötig.

## 1. Produkte bearbeiten

Alle Produkte stehen in `products.js`.

```js
{
  id: "usb-c-ladegeraet",
  title: "USB-C Ladegerät",
  category: "Technik",
  description: "Kurze Beschreibung.",
  image: "https://...",
  url: "DEIN-AMAZON-AFFILIATE-LINK",
  price: "Bei Amazon ansehen",
  badge: "Favorit"
}
```

`id` sollte eindeutig sein. `badge` ist optional.

## 2. Pinterest-Landingpages bearbeiten

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

## 3. GitHub Pages veröffentlichen

1. Neues GitHub Repository anlegen.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. In GitHub `Settings` → `Pages` öffnen.
4. Unter `Build and deployment` die Quelle `Deploy from a branch` wählen.
5. Branch `main` und Ordner `/ (root)` wählen.
6. Speichern.

Danach ist die Seite über deine GitHub-Pages-Adresse erreichbar.

## 4. Pinterest verwenden

Verlinke einen Pin möglichst direkt auf die passende Landingpage, z. B.:

- Küchen-Pin → `https://DEINNAME.github.io/REPO/kueche.html`
- Wohn-Pin → `https://DEINNAME.github.io/REPO/wohnen.html`
- Technik-Pin → `https://DEINNAME.github.io/REPO/technik.html`

So landet der Besucher direkt bei den zum Pin passenden Empfehlungen.

## 5. Vor Veröffentlichung

- Amazon-Affiliate-Links eintragen.
- Impressum und Datenschutz vervollständigen.
- Affiliate-Hinweis prüfen und passend zu deinem Einsatz kennzeichnen.
- Nur Bilder verwenden, für die du die erforderlichen Nutzungsrechte besitzt bzw. die Amazon-Regeln einhalten.
- Bei Preisangaben auf Amazons Vorgaben und Aktualität achten; im Zweifel keinen statischen Preis nennen.

## Dateien

- `index.html` – Startseite
- `products.js` – zentrale Produktdaten
- `collections.js` – zentrale Landingpage-/Sammlungsdaten
- `script.js` – Startseitenlogik
- `collection-page.js` – gemeinsame Logik aller Landingpages
- `kueche.html`, `wohnen.html`, `technik.html` – Pinterest-Zielseiten
- `styles.css` – gemeinsames Design
- `impressum.html`, `datenschutz.html` – rechtliche Platzhalter


## Ratgeber / Originalinhalte
Die Version enthält 10 eigenständige Ratgeberseiten. Passe die Texte an deine tatsächliche Auswahl und Erfahrung an, bevor du sie veröffentlichst. Behaupte insbesondere keine eigenen Tests oder Erfahrungen, die du nicht gemacht hast. Konkrete Amazon-Produkte und Partnerlinks kannst du anschließend passend ergänzen.
