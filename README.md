# if-plek

Vaste bron van het zwevende element "Past de LOCATIE?" voor Infofrankrijk en de tools.

- Script: `public/plek.js`, geen afhankelijkheden, geen cookies, geen opslag, geen netwerkverzoeken.
- Insluiten: `<a class="ifz-plek" href="https://infofrankrijk.com/past-de-locatie/">Past de LOCATIE?</a>` plus `<script src="https://if-plek.vercel.app/plek.js" defer></script>`. Zonder script blijft de gewone link werken.
- Valt Vercel uit, dan ontbreekt alleen het zwevende element; de gewone link blijft staan.
- In een iframe verschijnt het element niet.
- Regio-enquête alleen tonen met `data-ifz-enquete="ja"` op de scripttag.
- Cache: 5 minuten, aanpassingen zijn dus snel zichtbaar.
