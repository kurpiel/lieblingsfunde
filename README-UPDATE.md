# Lieblingsfunde – redaktionelles Update

Dieses ZIP enthält alle Dateien, die für den redaktionellen Umbau ersetzt/ergänzt werden müssen.

## Enthalten
- `articles.js` – fünf veröffentlichte Ratgeber mit zentral gepflegten Top-Listen und 1:1-Produktzuordnung.
- `scripts/build.js` – rendert Top-Listen, Produktempfehlungen bzw. „Produktempfehlung folgt“, veröffentlicht nur fertige Ratgeber und behebt das leere Marken-Trennzeichen.
- `article-recommendations.css` – Styling für Empfehlungen direkt am jeweiligen Tipp.

## Was sich ändert
- Nur die 5 bereits bearbeiteten Ratgeber erscheinen auf Startseite und Sitemap.
- Die übrigen Ratgeber bleiben im Projekt, sind aber `published: false`.
- Produkte stehen direkt beim passenden Tipp.
- Fehlt ein Produkt, erscheint „Produktempfehlung folgt“.
- Der bisherige doppelte Produkt-Sammelblock wird bei den 5 strukturierten Ratgebern entfernt.
- Fehlende Marken erzeugen kein leeres `·` mehr.

## Installation
1. ZIP entpacken.
2. Die drei Dateien/Ordner in dein Repository kopieren und vorhandene Dateien überschreiben.
3. Im Projektordner ausführen:

   npm run build

4. Änderungen lokal prüfen.
5. Commit + Push.

Wichtig: `products.js` wird durch dieses Update nicht überschrieben. Deine vorhandenen Affiliate-/SiteStripe-Links bleiben damit unverändert.
