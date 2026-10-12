/* plek.js, zwevend element "La Maison" voor Infofrankrijk en de tools (kopen, kosten, verkopen, wonen).
   Ook: het paneel open op de homepage, een wegwijzer boven en onder elk La Maison-artikel en een balk op de vastgoedcategorieën.
   Geen bibliotheken, geen cookies, geen opslag, geen tracking. Eén netwerkverzoek, alleen op de homepage, naar de eigen site
   (welk La Maison-artikel het laatst is bijgewerkt); mislukt dat, dan blijft die regel gewoon weg.
   Faalt het script, dan blijft de gewone link a.ifz-plek staan. */
(function ifzStart() {
  'use strict';
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ifzStart); return; } /* ook veilig als het script in de head wordt geladen */
  try {
    if (window !== window.top) { var l = document.querySelectorAll('a.ifz-plek'); for (var i = 0; i < l.length; i++) { if (l[i].parentNode) l[i].parentNode.removeChild(l[i]); } return; } /* nooit in een iframe, ook de gewone link niet */
    if (window.__ifzPlek || document.querySelector('.ifz[data-ifz-live]')) return; /* dubbel laden */
    var bron = document.querySelector('a.ifz-plek');
    var auto = false;
    if (!document.body) return;
    if (!bron) { var sc0 = document.currentScript || document.querySelector('script[src*="plek.js"]'); auto = !!(sc0 && sc0.getAttribute('data-ifz-auto') === 'ja'); if (!auto) return; }
    window.__ifzPlek = true;

    var script = document.currentScript || document.querySelector('script[src*="plek.js"]');
    var data = function (n) { return script && script.getAttribute ? script.getAttribute(n) : null; };
    /* ===== INDELING: de enige plek om La Maison aan te passen =====
       Drie delen: kopen (met zeven fasen), kosten, verkopen. Per regel een titel en een pad (begin- en eindslash),
       of { titel, later: true } voor iets dat nog komt (grijs, geen link). Alleen live artikelen opnemen.
       Een pad mag op meer plekken staan; de pagina is "thuis" in de eerste plek (volgorde kopen, kosten, verkopen). */
    var SITE = 'https://infofrankrijk.com';
    var GIDS = SITE + '/gids-huis-kopen-frankrijk/';
    var GIDSPAD = '/gids-huis-kopen-frankrijk/';
    var INTEGRATIEPAD = '/de-franse-integratiegids/'; /* staat onder "Past de locatie?" bij fase 2 */
    var KLUSSEN = SITE + '/klussen/';
    var CAFE = 'https://www.cafeclaude.fr/';
    var LAMAISON = SITE + '/la-maison/';
    var LAMAISONPAD = '/la-maison/';
    var CATPADEN = ['/categorie/vastgoed/'];                  /* balk bovenaan deze categoriepagina's en hun subcategorieën, behalve: */
    var CATNIET = ['/categorie/vastgoed/huren-en-verhuren/'];  /* verhuur valt buiten La Maison */
    var FORUMTAG = 'https://www.nederlanders.fr/profiles/blog/list?tag=';   /* bij de verhuizing van Nederlanders.fr alleen deze regel en de lijst hieronder aanpassen */
    var FORUM = ['Woningen Algemeen', 'Woningbeheer en Huishouding', 'Bouw', 'Inrichting', 'Exterieur', 'Telecommunicatie'];
    var DELEN = [
      { id: 'kopen', naam: 'Kopen', fasen: [
        { nr: 1, titel: 'Voorbereiding', anker: '#fase1', artikelen: [
          { titel: 'Franse bankrekening openen', pad: '/franse-bankrekening-openen-dit-zijn-de-regels-en-uw-rechten/' }
        ] },
        { nr: 2, titel: 'Waar en hoe zoeken', anker: '#fase2', artikelen: [
          { titel: 'De Franse integratiegids', pad: '/de-franse-integratiegids/' },
          { titel: 'De Franse makelaar: mandaat en provisie', pad: '/carte-professionnelle-bankgarantie-bon-de-visite-mandat/' },
          { titel: 'Huizen van leden te koop', pad: '/huizen-van-leden-te-koop/' }
        ] },
        { nr: 3, titel: 'Bezichtigen', anker: '#fase3', artikelen: [
          { titel: 'Vastgoed analyseren per adres', pad: '/vastgoed-in-frankrijk-analyseren-per-adres-prijzen-risicos-dpe-plu/' },
          { titel: 'Vochtbestrijding en diagnosetool', pad: '/dossier-vochtbestrijding-en-diagnosetool/' },
          { titel: 'De fosse septique', pad: '/dossier-fosse-septique/' },
          { titel: 'Water en riool bij uw huis', pad: '/water-en-riool-frankrijk/' },
          { titel: 'Een woning van leem', pad: '/handleiding-voor-een-woning-opgetrokken-uit-leem/' },
          { titel: 'Van grange of atelier naar woning', pad: '/van-grange-of-atelier-naar-woning-eerst-goed-controleren-of-dat-zomaar-kancheck-eerst-het-plu-via-adres-ban/' }
        ] },
        { nr: 4, titel: 'Bod en compromis', anker: '#fase4', artikelen: [
          { titel: 'Compromis de vente', pad: '/compromis-de-vente/' },
          { titel: 'Kopen en viager', pad: '/kopen-en-viager/' },
          { titel: 'Samen eigenaar: de indivision', pad: '/samen-eigenaar-in-frankrijk-rechten-plichten-en-valkuilen-van-indivision/' },
          { titel: 'De SCI (Société Civile Immobilière)', pad: '/sci-societe-civile-immobiliere/' }
        ] },
        { nr: 5, titel: 'Tot de akte', anker: '#fase5', artikelen: [
          { titel: 'Verplichte technische onderzoeken', pad: '/de-verplichte-technische-onderzoeken-bij-de-verkoop-van-een-huis/' },
          { titel: 'DPE: energielabel en verplichtingen', pad: '/dpe-2026-in-frankrijk-uitleg-verplichtingen-en-aandachtspunten/' },
          { titel: 'De mairie, van de wieg tot het graf', pad: '/la-mairie-van-de-wieg-tot-het-graf/' }
        ] },
        { nr: 6, titel: 'Acte authentique', anker: '#fase6', artikelen: [
          { titel: 'De Franse notaris', pad: '/le-notaire/' },
          { titel: 'Begrippenlijst notaris en makelaar', pad: '/begrippenlijst-makelaardij-en-notarissen-frankrijk/' }
        ] },
        { nr: 7, titel: 'Na de aankoop', anker: '#fase7', artikelen: [
          { titel: 'Verzekeringen in Frankrijk', pad: '/verzekeringen-in-frankrijk/' }
        ] }
      ] },
      { id: 'kosten', naam: 'Kosten', artikelen: [
        { titel: 'Kosten koper (rekentool)', pad: '/vastgoed-transactiekosten/' },
        { titel: 'Lening of hypotheek', later: true },
        { titel: 'De taxe foncière', pad: '/de-taxe-fonciere-onroerendgoedbelasting/' },
        { titel: 'Taxe d’habitation tweede woning', pad: '/taxe-dhabitation-tweede-woning/' },
        { titel: 'Subsidies voor energierenovatie', pad: '/subsidies-voor-energierenovatie-in-frankrijk-overzicht-en-spelregels/' },
        { titel: 'MaPrimeRénov’ 2026', pad: '/maprimerenov-2026-bezint-eer-ge-begint/' },
        { titel: 'Éco-PTZ, renteloze lening', pad: '/eco-ptz-renteloze-lening-voor-energierenovatie-in-frankrijk/' },
        { titel: 'Btw van 5,5 % op renovatie', pad: '/tva-a-55-bij-renovatie-in-frankrijk-wanneer-geldt-het-lage-btw-tarief/' },
        { titel: 'CEE-premies', pad: '/cee-en-primes-energie-energiebesparingspremies-in-frankrijk-uitgelegd/' },
        { titel: 'Lokale subsidies', pad: '/lokale-subsidies-voor-energierenovatie-in-frankrijk-zo-vindt-u-wat-er-geldt/' }
      ] },
      { id: 'verkopen', naam: 'Verkopen', artikelen: [
        { titel: 'Verkoop van uw huis: 5 adviezen, 5 valkuilen, 5 fasen', pad: '/verkoop-van-uw-huis-in-frankrijk-5-adviezen-5-valkuilen-5-fasen/' },
        { titel: 'De plus-value immobilière', pad: '/de-plus-value-immobiliere/' },
        { titel: 'Plus-value-calculator (rekentool)', pad: '/plus-value-calculator/' },
        { titel: 'Arrest De Ruyter: mis het voordeel niet', pad: '/zorg-dat-je-het-voordeel-arrest-de-ruyter-niet-misloopt/' }
      ] },
      { id: 'wonen', naam: 'Wonen', artikelen: [
        { titel: 'EnergiePortaal (rekentool)', pad: '/energieportaal-bereken-de-energieprestatie-van-uw-franse-woning/' },
        { titel: 'De keuze van het verwarmingssysteem', pad: '/de-keuze-van-het-verwarmingssysteem/' },
        { titel: 'Aanleg centrale verwarming', later: true },
        { titel: 'Rookgasafvoer en schoorsteen', pad: '/rookgasafvoer-schoorsteen-frankrijk-regels-verzekering/' },
        { titel: 'De isolatie van het Franse huis', pad: '/de-isolatie-van-het-franse-huis/' },
        { titel: 'Handboek zonnepanelen', pad: '/handboek-zonnepanelen-en-energieopwekking-frankrijk/' },
        { titel: 'Gedupeerd door natuurgeweld', pad: '/gedupeerd-door-natuurgeweld-in-frankrijk-uw-verzekering-goed-regelen/' }
      ] }
    ];
    /* ===== einde INDELING ===== */

    var MAX = 1800;
    var BASIS = 'https://www.dossierfrankrijk.nl/nieuw?titel=';

    /* ---- Bewaar-link: titel + inhoud, totaal hoogstens MAX tekens, bron-URL altijd intact ---- */
    function kap(tekst, ruimte) {                              /* kapt op woordgrens, rekent in gecodeerde lengte */
      if (encodeURIComponent(tekst).length <= ruimte) return tekst;
      var w = tekst.split(/\s+/), s;
      while (w.length > 1) {
        w.pop(); s = w.join(' ') + '…';
        if (encodeURIComponent(s).length <= ruimte) return s;
      }
      s = w[0] || '';
      while (s.length && encodeURIComponent(s + '…').length > ruimte) s = s.slice(0, -1);
      return s ? s + '…' : '';
    }
    function bewaarLink() {
      var url = location.href;
      var titel = (data('data-ifz-titel') || document.title || 'Infofrankrijk').replace(/\s+/g, ' ').trim();
      var tekst = (data('data-ifz-inhoud') || 'Bewaard vanaf Infofrankrijk, om later terug te vinden.').replace(/\s+/g, ' ').trim();
      var vast = BASIS.length + '&inhoud='.length;
      if (vast + encodeURIComponent(url).length + 40 > MAX) {  /* URL zelf te lang: laat hash en query weg */
        url = location.origin + location.pathname;
      }
      var ue = encodeURIComponent(url);
      var ruimte = MAX - vast - ue.length;                     /* gedeeld door titel en tekst */
      var tmax = Math.min(encodeURIComponent(titel).length, Math.max(60, Math.floor(ruimte / 3)));
      titel = kap(titel, tmax);
      ruimte -= encodeURIComponent(titel).length;
      var sep = encodeURIComponent(' ').length;
      var inhoud = kap(tekst, Math.max(0, ruimte - sep));
      inhoud = (inhoud ? inhoud + ' ' : '') + url;
      return BASIS + encodeURIComponent(titel) + '&inhoud=' + encodeURIComponent(inhoud);
    }


    /* ---- Hulpfuncties ---- */
    function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function norm(p) {
      p = String(p || '/');
      try { p = decodeURIComponent(p); } catch (e0) {}
      p = p.split('#')[0].split('?')[0].toLowerCase();
      if (p.charAt(0) !== '/') p = '/' + p;
      if (p.charAt(p.length - 1) !== '/') p += '/';
      return p;
    }
    var nu = norm(data('data-ifz-pad') || location.pathname);
    function lijstvan(deel) {                                  /* alle artikelregels van een deel, ook uit fasen */
      var r = [], j, f;
      if (deel && deel.fasen) { for (f = 0; f < deel.fasen.length; f++) { var a = deel.fasen[f].artikelen || []; for (j = 0; j < a.length; j++) r.push(a[j]); } }
      else if (deel && deel.artikelen) { r = deel.artikelen; }
      return r;
    }
    function thuis() {                                         /* { deel, fase } van de huidige pagina, of null */
      for (var d = 0; d < DELEN.length; d++) {
        var de = DELEN[d];
        if (de.fasen) { for (var f = 0; f < de.fasen.length; f++) { var ar = de.fasen[f].artikelen || []; for (var j = 0; j < ar.length; j++) { if (ar[j].pad && norm(ar[j].pad) === nu) return { deel: d, fase: f }; } } }
        else { var a2 = de.artikelen || []; for (var k = 0; k < a2.length; k++) { if (a2[k].pad && norm(a2[k].pad) === nu) return { deel: d, fase: -1 }; } }
      }
      return null;
    }
    var hier = thuis();
    var thuispagina = !!(document.body && document.body.classList && document.body.classList.contains('home'));
    function opCat() { for (var c = 0; c < CATNIET.length; c++) if (nu.indexOf(CATNIET[c]) === 0) return false; for (var c2 = 0; c2 < CATPADEN.length; c2++) if (nu.indexOf(CATPADEN[c2]) === 0) return true; return false; }
    var categorie = opCat();
    var op = (nu === GIDSPAD || nu === LAMAISONPAD || nu === '/past-de-locatie/' || nu === '/klussen/' || hier || thuispagina || categorie);
    function item(a) {
      if (a.later || !a.pad) return '<li class="ifz-later">' + esc(a.titel) + ' <i>komt later</i></li>';
      if (norm(a.pad) === nu) return '<li class="ifz-hier"><span>u bent hier</span>' + esc(a.titel) + '</li>';
      return '<li><a href="' + esc(SITE + a.pad) + '">' + esc(a.titel) + '</a></li>';
    }
    function locatieblok() {
      var integ = '<div class="ifz-r' + (nu === INTEGRATIEPAD ? ' ifz-hier' : '') + '">' + (nu === INTEGRATIEPAD ? '<span>u bent hier</span>Integratiegids' : '<a href="' + esc(SITE + INTEGRATIEPAD) + '">Integratiegids</a>') + '</div>';
      var enq = data('data-ifz-enquete') === 'ja'
        ? '<div class="ifz-r"><a href="' + esc(SITE + '/regio-enquete/') + '">Regio-enquête</a></div>'
        : '<div class="ifz-r ifz-later">Regio-enquête <i>komt later</i></div>';
      return '<div class="ifz-sub"><b>Past de locatie?</b>' + integ + enq + '<div class="ifz-r ifz-later">Regio- en gemeentecijfers <i>komt later</i></div></div>';
    }
    function deelHtml(d, i, actief) {
      var de = DELEN[d], u = '';
      if (de.fasen) {
        u += '<p class="ifz-gids"><a href="' + esc(GIDS) + '">Naar de gids huis kopen <span aria-hidden="true">→</span></a></p><ol class="ifz-f">';
        for (var f = 0; f < de.fasen.length; f++) {
          var fa = de.fasen[f], cur = !!(hier && hier.deel === d && hier.fase === f);
          u += '<li' + (cur ? ' class="ifz-cur"' : '') + '><a class="ifz-fk" href="' + esc(GIDS + fa.anker) + '"><span class="ifz-n">' + esc(fa.nr) + '</span>' + esc(fa.titel) + '</a>';
          if (fa.nr === 2) u += locatieblok();
          if (cur) {
            var rest = '', ar = fa.artikelen || [];
            for (var j = 0; j < ar.length; j++) { if (fa.nr === 2 && ar[j].pad && norm(ar[j].pad) === INTEGRATIEPAD) continue; rest += item(ar[j]); }
            if (rest) u += '<ul class="ifz-s">' + rest + '</ul>';
          }
          u += '</li>';
        }
        u += '</ol>';
      } else {
        u += '<ul class="ifz-s ifz-plat">';
        var ar2 = de.artikelen || [];
        for (var k = 0; k < ar2.length; k++) u += item(ar2[k]);
        u += '</ul>';
      }
      return '<div class="ifz-tabpaneel" role="tabpanel" id="ifz-tp-' + esc(de.id) + '" aria-labelledby="ifz-tab-' + esc(de.id) + '"' + (actief ? '' : ' hidden') + '>' + u + '</div>';
    }

    /* ---- Stijl, alles onder .ifz ---- */
    var css = [
      '.ifz{--z-p:#800000;--z-ink:#252525;--z-muted:#636363;--z-l:#e6e1dc;--z-bg:#faf8f6;font-family:Mulish,Arial,sans-serif;font-size:16px;line-height:1.4;color:var(--z-ink);}',
      '.ifz *{box-sizing:border-box;}',
      '.ifz .ifz-vast{position:fixed;left:0;right:0;bottom:20px;width:max-content;margin:0 auto;z-index:9990;}',
      '.ifz .ifz-vast.ifz-uit{opacity:0;transition:opacity .7s ease;pointer-events:none;}',
      '.ifz .ifz-knop{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 18px 8px 14px;border-radius:999px;background:#fff;border:2px solid var(--z-p);color:var(--z-p);font-family:Poppins,Arial,sans-serif;font-weight:600;font-size:1rem;line-height:1.3;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,.15);text-transform:none;letter-spacing:0;}',
      '.ifz .ifz-knop:hover{background:#fff7f7;}',
      '.ifz .ifz-knop:focus-visible{outline:3px solid #252525;outline-offset:3px;}',
      '.ifz .ifz-knop svg{flex:0 0 22px;}',
      '.ifz .ifz-paneel{position:absolute;left:50%;transform:translateX(-50%);bottom:56px;width:360px;max-width:calc(100vw - 32px);max-height:calc(100vh - 100px);display:flex;flex-direction:column;background:#fff;border:1px solid var(--z-l);border-top:4px solid var(--z-p);border-radius:10px;box-shadow:0 10px 36px rgba(0,0,0,.22);text-align:left;font-size:.9375rem;}',
      '.ifz .ifz-paneel[hidden],.ifz .ifz-tabpaneel[hidden]{display:none;}',
      '.ifz .ifz-kop{flex:none;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:14px 16px 10px;}',
      '.ifz .ifz-kop h2{display:flex;gap:8px;align-items:center;font-family:Poppins,Arial,sans-serif;font-size:1.25rem;font-weight:600;color:var(--z-p);margin:0;padding:0;line-height:1.3;text-transform:none;letter-spacing:0;}',
      '.ifz .ifz-kop h2:focus{outline:none;}',
      '.ifz .ifz-kop small{display:block;color:var(--z-muted);font-size:.8125rem;margin-top:2px;}',
      '.ifz .ifz-dicht{flex:none;width:44px;height:44px;margin:-4px -6px 0 0;border:1px solid var(--z-l);background:#fff;border-radius:50%;cursor:pointer;color:var(--z-muted);font:inherit;font-size:1.5rem;line-height:1;padding:0;}',
      '.ifz .ifz-dicht:hover{background:#fff7f7;}',
      '.ifz .ifz-dicht:focus-visible,.ifz .ifz-tabs button:focus-visible{outline:3px solid var(--z-p);outline-offset:2px;}',
      '.ifz .ifz-tabs{flex:none;display:flex;margin:0 16px;border:1.5px solid var(--z-p);border-radius:8px;overflow:hidden;}',
      '.ifz .ifz-tabs button{flex:1;min-height:44px;border:0;background:#fff;color:var(--z-p);font-family:Poppins,Arial,sans-serif;font-weight:500;font-size:.9375rem;padding:6px 0;cursor:pointer;text-transform:none;letter-spacing:0;}',
      '.ifz .ifz-tabs button+button{border-left:1.5px solid var(--z-p);}',
      '.ifz .ifz-tabs button[aria-selected="true"]{background:var(--z-p);color:#fff;}',
      '.ifz .ifz-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:10px 16px 6px;}',
      '.ifz p{margin:0;padding:0;}',
      '.ifz .ifz-gids{padding:0 0 4px;border-bottom:1px solid var(--z-l);}',
      '.ifz .ifz-gids a{display:flex;align-items:center;min-height:44px;font-weight:700;color:var(--z-p);text-decoration:none;}',
      '.ifz .ifz-gids a:hover,.ifz a:hover{text-decoration:underline;}',
      '.ifz ol.ifz-f,.ifz ul.ifz-s{list-style:none;margin:0;padding:0;}',
      '.ifz ol.ifz-f>li{margin:0;padding:0;list-style:none;border-bottom:1px solid var(--z-l);}',
      '.ifz .ifz-fk{display:flex;align-items:center;gap:10px;min-height:44px;color:var(--z-ink);font-weight:600;text-decoration:none;}',
      '.ifz .ifz-n{flex:none;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--z-p);color:var(--z-p);font-size:.75rem;display:grid;place-items:center;font-weight:700;}',
      '.ifz li.ifz-cur>.ifz-fk .ifz-n{background:var(--z-p);color:#fff;}',
      '.ifz ul.ifz-s{margin:0 0 8px 32px;}',
      '.ifz ul.ifz-s li{margin:0;padding:0;list-style:none;}',
      '.ifz ul.ifz-s a{display:block;padding:8px 0;min-height:36px;color:#333;text-decoration:none;}',
      '.ifz ul.ifz-s a:hover{text-decoration:underline;color:var(--z-p);}',
      '.ifz ul.ifz-plat{margin:0 0 8px 0;}',
      '.ifz ul.ifz-plat a{padding:10px 0;border-bottom:1px solid var(--z-l);}',
      '.ifz .ifz-hier{background:#f6ecec;border-left:3px solid var(--z-p);margin-left:-8px;padding:4px 6px;}',
      '.ifz ul.ifz-plat .ifz-hier{margin-left:0;}',
      '.ifz .ifz-hier span{display:block;font-size:.75rem;color:var(--z-p);font-weight:700;}',
      '.ifz .ifz-sub{margin:0 0 8px 32px;background:var(--z-bg);border-radius:6px;padding:8px 10px;}',
      '.ifz .ifz-sub b{display:block;font-family:Poppins,Arial,sans-serif;font-weight:500;font-size:.875rem;margin:0 0 2px;}',
      '.ifz .ifz-sub .ifz-r{padding:2px 0;}',
      '.ifz .ifz-sub .ifz-r a{display:inline-block;padding:7px 0;min-height:36px;}',
      '.ifz .ifz-sub .ifz-hier{margin-left:-8px;}',
      '.ifz a{color:var(--z-p);}',
      '.ifz .ifz-later{color:#636363;cursor:default;padding:8px 0;}',
      '.ifz ul.ifz-s li.ifz-later{padding:8px 0;}',
      '.ifz .ifz-later i{font-style:normal;font-size:.6875rem;border:1px solid #bbb;border-radius:3px;padding:0 5px;margin-left:4px;white-space:nowrap;}',
      '.ifz .ifz-voet{flex:none;border-top:1px solid var(--z-l);padding:10px 16px 12px;background:var(--z-bg);border-radius:0 0 10px 10px;}',
      '.ifz .ifz-kif{font-weight:600;}',
      '.ifz .ifz-kif a{display:inline-block;padding:8px 0;}',
      '.ifz .ifz-sec{margin:0;font-size:.8125rem;color:var(--z-muted);}',
      '.ifz .ifz-sec a{display:inline-block;padding:10px 0;color:var(--z-muted);}',
      '.ifz .ifz-onafh{font-size:.75rem;color:var(--z-muted);margin:0;line-height:1.45;}',
      '.ifz a:focus-visible{outline:3px solid var(--z-p);outline-offset:1px;border-radius:2px;}',
      '.ifz .ifz-hl{color:var(--z-p);text-decoration:none;}',
      '.ifz .ifz-hl:hover{text-decoration:underline;}',
      '.ifz .ifz-vers{font-size:.8125rem;color:var(--z-p);font-weight:700;margin:6px 0 0;}',
      '.ifz .ifz-vers a{color:var(--z-p);}',
      '.ifz .ifz-tabs button{font-size:.875rem;}',
      '.ifz.ifz-inline{margin:0 auto 40px;max-width:560px;}',
      '.ifz.ifz-tegel{margin:0 0 66px;max-width:none;}',
      '.ifz.ifz-tegel .ifz-paneel{border:1px solid #d8d8d8!important;border-top:4px solid var(--z-p)!important;border-radius:0!important;box-shadow:none!important;}',
      '.ifz.ifz-tegel .ifz-voet{border-radius:0;}',
      '.ifz.ifz-inline .ifz-vast{position:static;width:auto;margin:0;}',
      '.ifz.ifz-inline .ifz-paneel{position:static;transform:none;width:auto;max-width:none;max-height:none;box-shadow:0 3px 16px rgba(0,0,0,.08);}',
      '.ifz.ifz-inline .ifz-body{max-height:none;overflow:visible;}',
      '.ifz.ifz-inline .ifz-knop,.ifz.ifz-inline .ifz-dicht{display:none;}',
      '.ifzw{font-family:Mulish,Arial,sans-serif;font-size:.875rem;line-height:1.5;color:#636363;}',
      '.ifzw a{color:#800000;font-weight:700;text-decoration:none;}',
      '.ifzw a:hover{text-decoration:underline;}',
      '.ifzw-kruim{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center;border-bottom:1px solid #e6e1dc;padding:0 0 8px;margin:0 0 14px;}',
      '.ifzw-fase{background:#faf5f5;color:#800000;border-radius:999px;padding:0 10px;font-weight:700;}',
      '.ifzw-verder{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:stretch;margin:28px 0 8px;}',
      '.ifzw-volg{display:block;border:1px solid #e6e1dc;border-left:4px solid #800000;padding:12px 16px;background:#faf5f5;}',
      '.ifzw-volg small{display:block;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#636363;}',
      '.ifzw-volg b{font-family:Poppins,Arial,sans-serif;font-weight:500;font-size:1.05rem;}',
      '.ifzw-terug{display:flex;align-items:center;justify-content:center;border:2px solid #800000;border-radius:999px;padding:10px 18px;min-height:44px;white-space:nowrap;font-family:Poppins,Arial,sans-serif;font-weight:600;}',
      '.ifzw-balk{border:1px solid #e6e1dc;border-left:4px solid #800000;background:#faf5f5;padding:12px 16px;margin:0 0 24px;font-size:.9375rem;}',
      '@media(max-width:600px){.ifzw-verder{grid-template-columns:1fr;}}',
      '@media print{.ifzw{display:none!important;}}',
      '.ifz-ruimte{display:none;}',
      '@media(max-width:600px){',
      ' .ifz-ruimte{display:block;height:76px;}',
      ' .ifz .ifz-vast{bottom:12px;transition:transform .25s ease,visibility .25s;}',
      ' .ifz .ifz-vast.ifz-weg{transform:translateY(90px);visibility:hidden;}',
      ' .ifz .ifz-paneel{position:fixed;left:0;right:0;bottom:0;transform:none;width:auto;max-width:none;max-height:78vh;border-radius:14px 14px 0 0;}',
      ' .ifz .ifz-voet{border-radius:0;}',
      '}',
      '@media(prefers-reduced-motion:reduce){.ifz .ifz-vast{transition:none!important;}}',
      '@media print{.ifz,.ifz-ruimte{display:none!important;}}'
    ].join('\n');

    /* ---- Automatische modus: één scripttag voor de hele site. Het element verschijnt alleen op de gids, op /past-de-locatie/ en op paden uit INDELING ---- */
    if (auto) {
      if (!op) { window.__ifzPlek = false; return; }
      bron = document.createElement('a'); bron.className = 'ifz-plek'; bron.href = SITE + '/past-de-locatie/'; bron.textContent = 'La Maison'; bron.style.display = 'none'; document.body.appendChild(bron);
    }

    /* ---- Opbouw ---- */
    var huis = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#800000" stroke-width="2" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
    var actief = hier ? hier.deel : 0, tabs = '', panelen = '';
    for (var t = 0; t < DELEN.length; t++) {
      tabs += '<button type="button" role="tab" id="ifz-tab-' + esc(DELEN[t].id) + '" aria-controls="ifz-tp-' + esc(DELEN[t].id) + '" aria-selected="' + (t === actief ? 'true' : 'false') + '" tabindex="' + (t === actief ? '0' : '-1') + '">' + esc(DELEN[t].naam) + '</button>';
      panelen += deelHtml(t, t, t === actief);
    }
    var w = document.createElement('div');
    w.className = 'ifz';
    w.setAttribute('data-ifz-live', '');
    w.innerHTML =
      '<div class="ifz-vast">' +
      '<div class="ifz-paneel" id="ifz-paneel" role="region" aria-labelledby="ifz-titel" hidden>' +
      '<div class="ifz-kop"><div><h2 id="ifz-titel" tabindex="-1">' + huis + (nu === LAMAISONPAD ? 'La Maison' : '<a class="ifz-hl" href="' + esc(LAMAISON) + '">La Maison</a>') + '</h2><small>kopen, kosten, verkopen, wonen</small><p class="ifz-vers" hidden></p></div>' +
      '<button type="button" class="ifz-dicht" aria-label="Sluiten">×</button></div>' +
      '<div class="ifz-tabs" role="tablist" aria-label="Kopen, kosten, verkopen of wonen">' + tabs + '</div>' +
      '<div class="ifz-body">' + panelen + '</div>' +
      '<div class="ifz-voet">' +
      '<div class="ifz-kif">Verbouwen en klussen: <a href="' + esc(KLUSSEN) + '">dossier Klussen in Frankrijk</a></div>' +
      '<p class="ifz-sec"><a href="' + esc(CAFE) + '">Café Claude</a> · <a class="ifz-bewaar" href="' + bewaarLink().replace(/&/g, '&amp;') + '">Bewaar in Mijn Dossier</a></p>' +
      '<p class="ifz-onafh"><strong>Onafhankelijk.</strong> Makelaars, Nederlandse of Franse, hebben geen invloed op onze artikelen en tools.</p>' +
      '</div></div>' +
      '<button type="button" class="ifz-knop" aria-expanded="false" aria-controls="ifz-paneel">' + huis + '<span class="ifz-naam">La Maison</span></button>' +
      '</div>';

    var st = document.createElement('style');
    st.setAttribute('data-ifz', '');
    st.textContent = css;
    document.head.appendChild(st);
    var ruimte = document.createElement('div');
    ruimte.className = 'ifz-ruimte';
    ruimte.setAttribute('aria-hidden', 'true');
    /* homepage: paneel open in de pagina, boven "Recent geplaatste berichten"; lukt dat niet, dan gewoon zwevend */
    var inline = false;
    if (thuispagina) {
      var kolom = document.querySelector('.et_pb_blog_grid .column');   /* als gewone tegel bovenaan de eerste kolom van de recente berichten */
      if (kolom) { w.className = 'ifz ifz-inline ifz-tegel'; kolom.insertBefore(w, kolom.firstChild); inline = true; }
    }
    if (thuispagina && !inline) {
      var kandidaten = document.querySelectorAll('h1,h2,h3,h4,.et_pb_text_inner');
      for (var hk = 0; hk < kandidaten.length; hk++) {
        var tx = (kandidaten[hk].textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (tx.indexOf('recent geplaatste berichten') === 0 && tx.length < 60) {
          var anker = kandidaten[hk].closest('.et_pb_module') || kandidaten[hk];
          w.className = 'ifz ifz-inline';
          anker.parentNode.insertBefore(w, anker);
          inline = true; break;
        }
      }
    }
    if (!inline) { document.body.appendChild(ruimte); document.body.appendChild(w); }

    var vast = w.querySelector('.ifz-vast'), knop = w.querySelector('.ifz-knop'),
        paneel = w.querySelector('.ifz-paneel'), dicht = w.querySelector('.ifz-dicht'),
        kop = w.querySelector('#ifz-titel'), bewaar = w.querySelector('.ifz-bewaar'),
        tabknoppen = w.querySelectorAll('.ifz-tabs button'), tabpanelen = w.querySelectorAll('.ifz-tabpaneel');

    function kies(n, focus) {
      for (var q = 0; q < tabknoppen.length; q++) {
        var aan = q === n;
        tabknoppen[q].setAttribute('aria-selected', aan ? 'true' : 'false');
        tabknoppen[q].setAttribute('tabindex', aan ? '0' : '-1');
        tabpanelen[q].hidden = !aan;
      }
      if (focus) tabknoppen[n].focus();
    }
    for (var tb = 0; tb < tabknoppen.length; tb++) {
      (function (n) {
        tabknoppen[n].addEventListener('click', function () { kies(n, false); });
        tabknoppen[n].addEventListener('keydown', function (e) {
          var m = null;
          if (e.key === 'ArrowRight') m = (n + 1) % tabknoppen.length;
          else if (e.key === 'ArrowLeft') m = (n + tabknoppen.length - 1) % tabknoppen.length;
          if (m !== null) { e.preventDefault(); kies(m, true); }
        });
      })(tb);
    }

    /* ---- Wegwijzers: regel boven en vervolgstap onder elk La Maison-artikel, balk op de vastgoedcategorieën ---- */
    function plat() {                                          /* alle regels met pad, in leesvolgorde, met deel en fase */
      var r = [], seen = {};
      for (var d = 0; d < DELEN.length; d++) {
        var de = DELEN[d];
        if (de.fasen) { for (var f = 0; f < de.fasen.length; f++) { var ar = de.fasen[f].artikelen || []; for (var j = 0; j < ar.length; j++) if (ar[j].pad && !seen[norm(ar[j].pad)]) { seen[norm(ar[j].pad)] = 1; r.push({ a: ar[j], d: d, f: f }); } } }
        else { var a2 = de.artikelen || []; for (var k = 0; k < a2.length; k++) if (a2[k].pad && !seen[norm(a2[k].pad)]) { seen[norm(a2[k].pad)] = 1; r.push({ a: a2[k], d: d, f: -1 }); } }
      }
      return r;
    }
    function wegwijzers() {
      try {
        var div;
        var fv = document.getElementById('ifz-forum');                /* forumknoppen op de pagina La Maison */
        if (fv) { var fh = ''; for (var fi = 0; fi < FORUM.length; fi++) fh += '<li><a target="_blank" rel="noopener" href="' + esc(FORUMTAG + encodeURIComponent(FORUM[fi]).replace(/%20/g, '+')) + '">' + esc(FORUM[fi]) + '</a></li>'; fv.innerHTML = fh; }
        if (categorie && !hier) {
          var doel = document.querySelector('#main-content .et_pb_section, #main-content, .et-l--body, main');
          if (!doel) return;
          div = document.createElement('div'); div.className = 'ifzw ifzw-balk';
          div.innerHTML = 'Alles over het Franse huis, van kopen tot wonen, staat op één plek: <a href="' + esc(LAMAISON) + '">La Maison</a>.';
          doel.insertBefore(div, doel.firstChild);
          return;
        }
        if (nu === GIDSPAD) {                                       /* gids: ankers na het laden opnieuw goed zetten, en een einde met terugweg */
          var gi = document.querySelector('.et_pb_post_content, .entry-content');
          if (gi) { div = document.createElement('div'); div.className = 'ifzw ifzw-verder'; div.style.gridTemplateColumns = '1fr'; div.innerHTML = '<a class="ifzw-terug" href="' + esc(LAMAISON) + '">Terug naar La Maison</a>'; gi.appendChild(div); }
          var herpos = function () { try { if (/^#fase[1-7]$/.test(location.hash)) { var t = document.getElementById(location.hash.slice(1)) || document.querySelector('[name="' + location.hash.slice(1) + '"]'); if (t) t.scrollIntoView(); } } catch (e5) {} };
          if (document.readyState === 'complete') setTimeout(herpos, 400); else window.addEventListener('load', function () { setTimeout(herpos, 400); });
          window.addEventListener('hashchange', function () { setTimeout(herpos, 400); });
          return;
        }
        if (!hier) return;
        var de = DELEN[hier.deel];
        var kruim = '<a href="' + esc(LAMAISON) + '">La Maison</a><span aria-hidden="true">›</span><a href="' + esc(de.fasen ? GIDS : LAMAISON) + '">' + esc(de.naam) + '</a>';
        if (hier.fase >= 0) kruim += '<span aria-hidden="true">›</span><span class="ifzw-fase">fase ' + esc(de.fasen[hier.fase].nr) + ' van ' + de.fasen.length + ': ' + esc(de.fasen[hier.fase].titel.toLowerCase()) + '</span>';
        var titel = document.querySelector('.et_pb_title_container h1.entry-title, h1.entry-title');
        var inhoud = document.querySelector('.et_pb_post_content, .entry-content');
        if (titel && titel.parentNode) {
          div = document.createElement('nav'); div.className = 'ifzw ifzw-kruim'; div.setAttribute('aria-label', 'Plaats in La Maison');
          div.innerHTML = kruim; titel.parentNode.insertBefore(div, titel);
        }
        if (!inhoud) return;
        var lijst = plat(), i = -1;
        for (var q = 0; q < lijst.length; q++) if (norm(lijst[q].a.pad) === nu) { i = q; break; }
        var volg = null;
        for (var v = i + 1; v < lijst.length; v++) { if (lijst[v].d === hier.deel) { volg = lijst[v]; break; } }
        var vh = '';
        if (volg) {
          var lab = volg.f >= 0 ? 'Fase ' + DELEN[volg.d].fasen[volg.f].nr + ': ' + volg.a.titel : volg.a.titel;
          vh = '<a class="ifzw-volg" href="' + esc(SITE + volg.a.pad) + '"><small>Volgende stap</small><b>' + esc(lab) + '</b></a>';
        }
        div = document.createElement('div'); div.className = 'ifzw ifzw-verder';
        div.innerHTML = vh + '<a class="ifzw-terug" href="' + esc(LAMAISON) + '">Terug naar La Maison</a>';
        if (!vh) div.style.gridTemplateColumns = '1fr';
        inhoud.appendChild(div);
      } catch (e3) {}
    }
    function laatsteVers() {                                   /* één verzoek naar de eigen site; bij een fout geen regel */
      try {
        if (!window.fetch) return;
        var slugs = [], l = plat();
        for (var q = 0; q < l.length; q++) slugs.push('slug[]=' + encodeURIComponent(norm(l[q].a.pad).replace(/\//g, '')));
        fetch(SITE + '/wp-json/wp/v2/posts?per_page=1&orderby=modified&order=desc&_fields=title,link,modified&' + slugs.join('&'), { credentials: 'omit' })
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (j) {
            if (!j || !j[0] || !j[0].modified) return;
            var dd = j[0].modified.slice(0, 10).split('-'), el = w.querySelector('.ifz-vers');
            var t = document.createElement('textarea'); t.innerHTML = j[0].title && j[0].title.rendered || ''; /* entiteiten ontcijferen zonder HTML uit te voeren */
            el.innerHTML = 'Laatst bijgewerkt: <a href="' + esc(j[0].link) + '">' + esc(t.value) + '</a> · ' + dd[2] + '-' + dd[1] + '-' + dd[0];
            el.hidden = false;
          }).catch(function () {});
      } catch (e4) {}
    }
    function plaats() {                                        /* smal: lipje alleen aan het einde van de pagina */
      if (!paneel.hidden) { vast.classList.remove('ifz-weg'); return; }
      var smal = window.innerWidth <= 600;
      var eind = window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 76;
      vast.classList.toggle('ifz-weg', smal && !eind);
    }
    function open() {
      bewaar.setAttribute('href', bewaarLink());
      paneel.hidden = false;
      knop.setAttribute('aria-expanded', 'true');
      vast.classList.remove('ifz-weg');
      kop.focus();
      var hr = w.querySelector('.ifz-tabpaneel:not([hidden]) .ifz-hier'); /* scroll naar "u bent hier" */
      if (hr && hr.scrollIntoView) { try { hr.scrollIntoView({ block: 'center' }); } catch (e1) {} }
    }
    function sluit(terug) {
      paneel.hidden = true;
      knop.setAttribute('aria-expanded', 'false');
      if (terug) knop.focus();
      plaats();
    }
    if (inline) {
      paneel.hidden = false; knop.setAttribute('aria-expanded', 'true');
      kop.removeAttribute('tabindex');
      laatsteVers();
      if (bron && bron.parentNode) bron.parentNode.removeChild(bron);
      return;
    }
    wegwijzers();
    knop.addEventListener('click', function () { if (paneel.hidden) open(); else sluit(true); });
    dicht.addEventListener('click', function () { sluit(true); });
    /* rustige fade-out van het paneel na het kiezen van een link */
    paneel.addEventListener('click', function (e) {
      var l = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!l || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || l.target === '_blank') return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      vast.classList.add('ifz-uit');
      setTimeout(function () { window.location.href = l.href; }, 700);
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && !paneel.hidden) sluit(true);
    });
    document.addEventListener('click', function (e) {
      if (!paneel.hidden && !vast.contains(e.target)) sluit(false);
    });
    window.addEventListener('scroll', plaats, { passive: true });
    window.addEventListener('resize', plaats);
    plaats();

    if (bron && bron.parentNode) bron.parentNode.removeChild(bron);    /* de link is vervangen door het element */
  } catch (e) {
    /* bij een fout blijft de gewone link staan */
    try {
      var s = document.querySelector('.ifz[data-ifz-live]'); if (s) s.parentNode.removeChild(s);
      var r = document.querySelector('.ifz-ruimte'); if (r) r.parentNode.removeChild(r);
      window.__ifzPlek = false;
    } catch (e2) {}
  }
})();
