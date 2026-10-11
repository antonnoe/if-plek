# if-plek

Vaste bron van het zwevende element "Past de LOCATIE?" voor Infofrankrijk en de tools.

- Script: `public/plek.js`, geen afhankelijkheden, geen cookies, geen opslag, geen netwerkverzoeken.
- Insluiten: `<a class="ifz-plek" href="https://infofrankrijk.com/past-de-locatie/">Past de LOCATIE?</a>` plus `<script src="https://if-plek.vercel.app/plek.js" defer></script>`. Zonder script blijft de gewone link werken.
- Valt Vercel uit, dan ontbreekt alleen het zwevende element; de gewone link blijft staan.
- In een iframe verschijnt het element niet.
- Regio-enquête alleen tonen met `data-ifz-enquete="ja"` op de scripttag.
- Cache: 5 minuten, aanpassingen zijn dus snel zichtbaar.

## Andere thema's in deze categorie (fasen van de gids huis kopen)

- Het blok `FASEN` staat bovenaan in `public/plek.js`, tussen de regels `FASEN` en `einde FASEN`. Dat is de enige plek om aan te passen: per fase `nr`, `titel`, `anker` (`#fase1` tot `#fase7` op de gids) en `artikelen` (`titel` en `pad`, met begin- en eindslash).
- Artikel toevoegen of weghalen: één regel in de lijst van die fase. Een artikel mag in twee fasen staan. Neem alleen live artikelen op (controleer met `curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" URL`, 200 is goed; 301 of 404 niet).
- Het paneel bepaalt de fase aan de hand van `location.pathname`. Staat de pagina in een of twee fasen, dan toont het paneel de fase met link naar de gids en de zusterartikelen. Anders, of op de gids zelf, staat er één regel "Alle fasen van de gids huis kopen".
- Testen op een andere pagina: `data-ifz-pad="/het-gemeentehuis-la-mairie/"` op de scripttag.
- Is `FASEN` leeg, dan verschijnt alleen die ene regel en gaat er niets stuk.

## Eén regel voor de hele site (automatische modus)

`<script src="https://if-plek.vercel.app/plek.js" data-ifz-auto="ja" defer></script>`

Het script toont het element dan alleen op de gids, op /past-de-locatie/ en op artikelen die in FASEN staan. Op alle andere pagina's gebeurt niets. Er is geen gewone link nodig. Nieuw artikel erbij: alleen FASEN aanpassen.

## Plaatsingsbestanden

`public/plaatsing/` bevat de HTML voor /past-de-locatie/ en het hubblok voor de gids (bron voor het plaatsen in WordPress, noindex).
