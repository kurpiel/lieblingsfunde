# Automatisches Build-System

Ab jetzt sind `products.js`, `articles.js` und `collections.js` die Datenquellen.

Nach Änderungen lokal:

```bash
npm run build
```

Der Build aktualisiert automatisch:

- Produktkarten auf der Startseite
- Produktkarten in Sammlungen
- passende Produktkarten in allen Ratgebern
- Canonical-URLs
- Open-Graph-Metadaten
- `sitemap.xml`

## GitHub Pages automatisch deployen

Die Datei `.github/workflows/pages.yml` baut die Seite bei jedem Push auf `main`
neu und deployt anschließend GitHub Pages.

In GitHub einmalig:

1. Repository → **Settings**
2. **Pages**
3. Unter **Build and deployment / Source**: **GitHub Actions** auswählen

Danach reicht:

```bash
git add .
git commit -m "Update products"
git push
```

GitHub führt `npm run build` automatisch aus und veröffentlicht die aktuelle
statische Version.

## Wichtig

`impressum.html`, `datenschutz.html` und deine Produktdaten werden vom Build
nicht überschrieben. Die Social-Preview-PNGs unter `assets/social/` bleiben
bewusst statische Design-Assets; Titel, Beschreibungen, URLs und Produktkarten
werden dagegen automatisch aktualisiert.
