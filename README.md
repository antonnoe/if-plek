# if-plek

Vaste bron van het zwevende element "La Maison" voor Infofrankrijk en de tools.

- Script: `public/plek.js`, geen afhankelijkheden, geen cookies, geen opslag. Eén netwerkverzoek voor de indeling: `la-maison.json`, van dezelfde herkomst als het script (zonder cookies of opslag); op de homepage komt daar het bestaande verzoek naar de eigen site bij (laatst bijgewerkt). Lukt het laden van de indeling niet, dan gebeurt er niets en blijft de gewone link staan.
- Insluiten: `<a class="ifz-plek" href="https://infofrankrijk.com/past-de-locatie/">Past de LOCATIE?</a>` plus `<script src="https://if-plek.vercel.app/plek.js" defer></script>`. Zonder script blijft de gewone link werken.
- Valt Vercel uit, dan ontbreekt alleen het zwevende element; de gewone link blijft staan.
- In een iframe verschijnt het element niet.
- Regio-enquête alleen tonen met `data-ifz-enquete="ja"` op de scripttag.
- Cache: 5 minuten, aanpassingen zijn dus snel zichtbaar.

## Andere thema's in deze categorie (fasen van de gids huis kopen)

- De fasen staan in `public/la-maison.json` (deel `kopen`). Dat is de enige plek om aan te passen: per fase `nr`, `titel`, `anker` (`#fase1` tot `#fase7` op de gids) en `artikelen` (`titel` en `pad`, met begin- en eindslash).
- Artikel toevoegen of weghalen: één regel in de lijst van die fase. Een artikel mag in twee fasen staan. Neem alleen live artikelen op (controleer met `curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" URL`, 200 is goed; 301 of 404 niet).
- Het paneel bepaalt de fase aan de hand van `location.pathname`. Staat de pagina in een of twee fasen, dan toont het paneel de fase met link naar de gids en de zusterartikelen. Anders, of op de gids zelf, staat er één regel "Alle fasen van de gids huis kopen".
- Testen op een andere pagina: `data-ifz-pad="/het-gemeentehuis-la-mairie/"` op de scripttag.
- Is `FASEN` leeg, dan verschijnt alleen die ene regel en gaat er niets stuk.

## Eén regel voor de hele site (automatische modus)

`<script src="https://if-plek.vercel.app/plek.js" data-ifz-auto="ja" defer></script>`

Het script toont het element dan alleen op de gids, op /past-de-locatie/ en op artikelen die in `la-maison.json` staan. Op alle andere pagina's gebeurt niets. Er is geen gewone link nodig. Nieuw artikel erbij: alleen `la-maison.json` aanpassen.

## Plaatsingsbestanden

`public/plaatsing/` bevat de HTML voor /past-de-locatie/ en het hubblok voor de gids (bron voor het plaatsen in WordPress, noindex).

Tools die nog niet bestaan staan grijs en niet-klikbaar met het label "komt later"; in plek.js wordt de enquête pas een link met data-ifz-enquete="ja".

## La Maison

Het zwevende element heet La Maison (huisicoon, tabs Kopen, Kosten, Verkopen). De indeling staat op één plek: `public/la-maison.json` (een array van delen met `id`, `naam` en `fasen` of `artikelen`; pure JSON, geen commentaar). `plek.js` laadt dat bestand en de mobiele app InfoPoche (infopoche.fr) leest hetzelfde bestand: één bron van waarheid. `vercel.json` zet daarvoor `Access-Control-Allow-Origin: *` op `/la-maison.json` (publieke gegevens, geen credentials) en een cache van 60 seconden. Vaste adressen en de forumlijst (`FORUM`, `FORUMTAG`, `CATPADEN`) blijven in `plek.js`. Per deel titels en paden (met begin- en eindslash); `later: true` toont een regel grijs als "komt later". De pagina is thuis in de eerste plek waar het pad staat (volgorde kopen, kosten, verkopen). In de automatische modus verschijnt het element alleen op de gids, op /past-de-locatie/ en op paden uit de indeling. De regio-enquête wordt een link met `data-ifz-enquete="ja"` op de scripttag. Zonder script blijft een gewone `a.ifz-plek` staan.

## Tests

`node --test tests/*.test.mjs` (geen afhankelijkheden).

## Vastgoed-API (InfoPoche)

`GET /api/vastgoed` (`api/vastgoed.js`, logica in `lib/vastgoed.js`) levert de vastgoedadvertenties van Nederlanders.fr als JSON voor InfoPoche. Bron: de Google Sheet achter de verzamelpagina https://www.nederlanders.fr/page/onroerend-goed (publieke CSV-export, alleen gelezen, nooit geschreven). Filterregel: alleen rijen waarvan de advertentie-URL (genormaliseerd: zonder protocol, www, slot-slash, #-deel en querystring, hoofdletterongevoelig) als href op die pagina staat; verkochte advertenties zijn daar weg en vallen zo vanzelf af. Rijen zonder titel, url of leesbare datum vervallen. Uitvoer: `{bijgewerkt, bron, aantal, items:[{titel, url, prijsTekst, prijs, foto, plaats, omschrijving, datum, datumISO, exploitatie}]}`, nieuwste datum eerst. Een lege prijs wordt "Opvragen bij de verkoper", een kaal getal "€ 196.000", andere tekst blijft staan. Valt de sheet of de pagina weg, of staan er minder dan 5 advertentielinks op de pagina, dan komt status 502 met `{"fout":"bron niet bereikbaar"}` (geen terugval op alle rijen). CORS `*` (GET, OPTIONS), cache 15 minuten, time-out 8 s per bron, geen opslag of cookies.
