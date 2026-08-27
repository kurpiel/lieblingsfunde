# Lieblingsfunde – SEO/Pinterest-Update

Basis-URL: https://kurpiel.github.io/lieblingsfunde/

## Enthalten
- Canonical-URLs für Startseite, Sammlungen und Ratgeber
- vollständige Open-Graph-Daten inklusive 1200×630-PNGs
- sitemap.xml
- aktualisierte robots.txt
- statisch vorgerenderte Produktkarten für Crawler
- statisch vorgerenderte Ratgeber- und Sammlungskarten auf der Startseite
- keine doppelten Produktbereiche auf Ratgeberseiten
- products-admin.html mit noindex,nofollow

## Einspielen
Kopiere den Inhalt dieses ZIPs in dein bestehendes Repository und überschreibe
nur die gleichnamigen Dateien.

Deine bereits angepassten Dateien `impressum.html`, `datenschutz.html`,
`products.js`, `settings.js` und deine Produkt-Illustrationen bleiben dabei
unverändert.

## Wichtig bei GitHub Project Pages
Die Datei `robots.txt` liegt unter `https://kurpiel.github.io/lieblingsfunde/robots.txt`.
Nach dem Robots-Standard wird die maßgebliche robots.txt normalerweise am
Origin-Root (`https://kurpiel.github.io/robots.txt`) erwartet. Die Sitemap
funktioniert dennoch als eigene URL und kann direkt in der Google Search
Console eingereicht werden:
https://kurpiel.github.io/lieblingsfunde/sitemap.xml
