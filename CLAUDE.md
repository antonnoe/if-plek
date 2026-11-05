# CLAUDE.md

Repo: if-plek (vaste bron van het zwevende element La Maison voor Infofrankrijk en de tools)

## Wat dit is
Het script `plek.js` dat op Infofrankrijk en in de tools het zwevende element La Maison toont (tabs Kopen, Kosten, Verkopen), de bijbehorende indeling in JSON, de plaatsingsbestanden voor WordPress en een kleine vastgoed-API voor Infopoche (README.md).

## Live adres
https://if-plek.vercel.app (README.md). Het script staat op https://if-plek.vercel.app/plek.js en de indeling op /la-maison.json.

## Opbouw
- `public/plek.js`: het script, zonder afhankelijkheden, cookies of opslag
- `public/la-maison.json`: de indeling van La Maison, enige plek om fasen en artikelen aan te passen; Infopoche leest hetzelfde bestand
- `public/ondernemen.json`: aanvullende indeling (getest in `tests/ondernemen.test.mjs`)
- `public/plaatsing/`: HTML voor /past-de-locatie/ en het hubblok voor de gids (bron voor plaatsing in WordPress, noindex)
- `public/index.html`: startpagina van het project
- `api/vastgoed.js` en `lib/vastgoed.js`: GET /api/vastgoed, vastgoedadvertenties van Nederlanders.fr als JSON voor Infopoche
- `tests/`: `la-maison.test.mjs`, `ondernemen.test.mjs`, `vastgoed.test.mjs` met `fixtures/`
- `vercel.json`: headers (noindex, nosniff, cache van 60 seconden, CORS voor `la-maison.json` en `ondernemen.json`)

## Techniek
- Vanilla JavaScript, geen afhankelijkheden en geen `package.json`
- Tests: `node --test tests/*.test.mjs`
- Vercel serverless functie voor `api/vastgoed.js`

## Externe diensten en namen van omgevingsvariabelen
- Vercel (hosting)
- Google Sheet achter de verzamelpagina https://www.nederlanders.fr/page/onroerend-goed (publieke CSV-export, alleen gelezen)
- Omgevingsvariabelen: geen

## Hoe het live gaat
Vercel serveert `public/` en de functie in `api/` (README.md, `vercel.json`). Sites sluiten het script in met een script-tag naar https://if-plek.vercel.app/plek.js, in de automatische modus met `data-ifz-auto="ja"`. Valt Vercel uit, dan ontbreekt alleen het zwevende element en blijft de gewone link staan (README.md).

## Regels en besluiten
- `public/la-maison.json` is de enige bron van waarheid voor de indeling, pure JSON zonder commentaar (README.md)
- Alleen live artikelen opnemen in de indeling, controleer met een HTTP-status 200 (README.md)
- Het script gebruikt geen cookies of opslag, doet één netwerkverzoek voor de indeling en in een iframe verschijnt het element niet (README.md)
- Regio-enquête alleen tonen met `data-ifz-enquete="ja"` op de scripttag (README.md)
- Vastgoed-API: de sheet wordt alleen gelezen en nooit geschreven, alleen advertenties waarvan de url als link op de verzamelpagina staat, en bij een onbereikbare bron status 502 zonder terugval op alle rijen (README.md)

## Laatst nagelopen
Laatst nagelopen: 5 november 2026
