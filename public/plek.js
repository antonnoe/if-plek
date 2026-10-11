/* plek.js, zwevend element "Past de LOCATIE?" voor Infofrankrijk-tools.
   Geen bibliotheken, geen cookies, geen opslag, geen tracking, geen netwerkverzoeken.
   Faalt het script, dan blijft de gewone link a.ifz-plek staan. */
(function () {
  'use strict';
  try {
    if (window !== window.top) { var l = document.querySelectorAll('a.ifz-plek'); for (var i = 0; i < l.length; i++) { if (l[i].parentNode) l[i].parentNode.removeChild(l[i]); } return; } /* nooit in een iframe, ook de gewone link niet */
    if (window.__ifzPlek || document.querySelector('.ifz[data-ifz-live]')) return; /* dubbel laden */
    var bron = document.querySelector('a.ifz-plek');
    if (!bron || !document.body) return;
    window.__ifzPlek = true;

    var script = document.currentScript || document.querySelector('script[src*="plek.js"]');
    var data = function (n) { return script && script.getAttribute ? script.getAttribute(n) : null; };
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

    /* ---- Stijl, alles onder .ifz ---- */
    var css = [
      '.ifz{--z-p:#800000;--z-ink:#252525;--z-muted:#626262;font-family:Mulish,Arial,sans-serif;font-size:16px;line-height:1.5;color:var(--z-ink);}',
      '.ifz *{box-sizing:border-box;}',
      '.ifz .ifz-vast{position:fixed;right:20px;bottom:20px;z-index:9990;margin:0;}',
      '.ifz .ifz-knop{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:6px 16px 6px 12px;border-radius:999px;background:#fff;border:2px solid var(--z-p);color:var(--z-muted);font:inherit;font-weight:400;font-size:.9375rem;line-height:1.3;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.18);text-transform:none;letter-spacing:0;}',
      '.ifz .ifz-knop:hover{background:#fff7f7;}',
      '.ifz .ifz-loc{color:var(--z-p);font-weight:800;}',
      '.ifz .ifz-knop:focus-visible{outline:3px solid #252525;outline-offset:3px;}',
      '.ifz .ifz-knop svg{flex:0 0 20px;}',
      '.ifz .ifz-paneel{position:absolute;right:0;bottom:56px;width:340px;max-width:calc(100vw - 32px);background:#fff;border:1px solid #e5e2df;border-top:4px solid var(--z-p);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:16px 16px 14px;text-align:left;}',
      '.ifz .ifz-paneel[hidden]{display:none;}',
      '.ifz .ifz-kop{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin:0 0 8px;}',
      '.ifz .ifz-kop h2{font-family:Poppins,Arial,sans-serif;font-size:1.05rem;font-weight:400;color:var(--z-muted);margin:0;padding:0;line-height:1.35;text-transform:none;letter-spacing:0;}',
      '.ifz .ifz-kop h2 .ifz-loc{font-weight:700;}',
      '.ifz .ifz-kop h2:focus{outline:none;}',
      '.ifz .ifz-dicht{flex:0 0 44px;border:0;background:none;width:44px;height:44px;margin:-10px -10px 0 0;padding:0;border-radius:6px;cursor:pointer;color:var(--z-muted);font:inherit;font-size:1.6rem;line-height:1;}',
      '.ifz .ifz-dicht:hover{background:rgba(128,0,0,.06);}',
      '.ifz .ifz-dicht:focus-visible{outline:3px solid var(--z-p);}',
      '.ifz .ifz-intro{font-size:.875rem;color:var(--z-muted);margin:0 0 10px;}',
      '.ifz .ifz-lijst{list-style:none;margin:0 0 12px;padding:0;}',
      '.ifz .ifz-lijst li{margin:0;padding:0;list-style:none;}',
      '.ifz .ifz-lijst a{display:block;min-height:44px;padding:9px 10px;border-radius:6px;text-decoration:none;color:var(--z-ink);border:1px solid transparent;}',
      '.ifz .ifz-lijst a:hover{background:rgba(128,0,0,.05);border-color:rgba(128,0,0,.16);}',
      '.ifz .ifz-lijst a:focus-visible{outline:3px solid var(--z-p);outline-offset:0;}',
      '.ifz .ifz-lijst b{display:block;color:var(--z-p);font-weight:800;font-size:.9375rem;}',
      '.ifz .ifz-lijst span{display:block;font-size:.8125rem;color:var(--z-muted);}',
      '.ifz .ifz-bewaar{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:44px;border:2px solid var(--z-p);border-radius:8px;background:#fff;color:var(--z-p);font-weight:800;text-decoration:none;font-size:.9375rem;}',
      '.ifz .ifz-bewaar:hover{background:#fff7f7;}',
      '.ifz .ifz-bewaar:focus-visible{outline:3px solid #252525;outline-offset:2px;}',
      '.ifz .ifz-wat{font-size:.8125rem;color:var(--z-muted);margin:2px 0 8px;text-align:center;}',
      '.ifz .ifz-wat a{display:inline-block;padding:12px 4px;color:var(--z-p);}',
      '.ifz .ifz-onafh{font-size:.75rem;color:var(--z-muted);border-top:1px solid #eee;padding:8px 0 0;margin:0;line-height:1.45;}',
      '.ifz .ifz-onafh strong{color:var(--z-ink);}',
      '.ifz-ruimte{display:none;}',
      '@media(max-width:600px){',
      ' .ifz-ruimte{display:block;height:76px;}',
      ' .ifz .ifz-vast{right:12px;bottom:12px;transition:transform .25s ease,visibility .25s;}',
      ' .ifz .ifz-vast.ifz-weg{transform:translateY(90px);visibility:hidden;}',
      ' .ifz .ifz-knop{padding:6px 12px 6px 10px;font-size:.875rem;}',
      ' .ifz .ifz-naam{white-space:nowrap;}',
      ' .ifz .ifz-paneel{position:fixed;left:8px;right:8px;bottom:68px;width:auto;max-width:none;max-height:72vh;overflow:auto;}',
      '}',
      '@media(prefers-reduced-motion:reduce){.ifz .ifz-vast{transition:none!important;}}',
      '@media print{.ifz,.ifz-ruimte{display:none!important;}}'
    ].join('\n');

    /* ---- Opbouw ---- */
    var pin = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#800000"/></svg>';
    var naam = 'Past de <b class="ifz-loc">LOCATIE</b>?';
    var w = document.createElement('div');
    w.className = 'ifz';
    w.setAttribute('data-ifz-live', '');
    w.innerHTML =
      '<div class="ifz-vast">' +
      '<div class="ifz-paneel" id="ifz-paneel" role="region" aria-labelledby="ifz-titel" hidden>' +
      '<div class="ifz-kop"><h2 id="ifz-titel" tabindex="-1">' + naam + '</h2>' +
      '<button type="button" class="ifz-dicht" aria-label="Sluiten">×</button></div>' +
      '<p class="ifz-intro">Kijk verder dan het huis zelf.</p>' +
      '<ul class="ifz-lijst">' +
      (data('data-ifz-enquete') === 'ja' ? '<li><a href="https://infofrankrijk.com/regio-enquete/"><b>Regio-enquête</b><span>Uw prioriteiten naast de regio’s</span></a></li>' : '') +
      '<li><a href="https://infofrankrijk.com/de-franse-integratiegids/"><b>Franse integratiegids</b><span>Hoe word je deel van je omgeving?</span></a></li>' +
      '<li><a href="https://www.cafeclaude.fr/"><b>Café Claude</b><span>Stel uw eigen vraag, deels voor abonnees</span></a></li>' +
      '</ul>' +
      '<a class="ifz-bewaar" href="' + bewaarLink().replace(/&/g, '&amp;') + '">Bewaar in Mijn Dossier</a>' +
      '<p class="ifz-wat">Voor abonnees. <a href="https://infofrankrijk.com/dossierfrankrijk-nl/">Wat is Mijn Dossier?</a></p>' +
      '<p class="ifz-onafh"><strong>Onafhankelijk.</strong> Makelaars, Nederlandse of Franse, hebben geen invloed op onze artikelen en tools. Wij verkopen uw gegevens niet door.</p>' +
      '</div>' +
      '<button type="button" class="ifz-knop" aria-expanded="false" aria-controls="ifz-paneel">' + pin + '<span class="ifz-naam">' + naam + '</span></button>' +
      '</div>';

    var st = document.createElement('style');
    st.setAttribute('data-ifz', '');
    st.textContent = css;
    document.head.appendChild(st);
    var ruimte = document.createElement('div');
    ruimte.className = 'ifz-ruimte';
    ruimte.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ruimte);
    document.body.appendChild(w);

    var vast = w.querySelector('.ifz-vast'), knop = w.querySelector('.ifz-knop'),
        paneel = w.querySelector('.ifz-paneel'), dicht = w.querySelector('.ifz-dicht'),
        kop = w.querySelector('#ifz-titel'), bewaar = w.querySelector('.ifz-bewaar');

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
    }
    function sluit(terug) {
      paneel.hidden = true;
      knop.setAttribute('aria-expanded', 'false');
      if (terug) knop.focus();
      plaats();
    }
    knop.addEventListener('click', function () { if (paneel.hidden) open(); else sluit(true); });
    dicht.addEventListener('click', function () { sluit(true); });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && !paneel.hidden) sluit(true);
    });
    document.addEventListener('click', function (e) {
      if (!paneel.hidden && !vast.contains(e.target)) sluit(false);
    });
    window.addEventListener('scroll', plaats, { passive: true });
    window.addEventListener('resize', plaats);
    plaats();

    if (bron.parentNode) bron.parentNode.removeChild(bron);    /* de link is vervangen door het element */
  } catch (e) {
    /* bij een fout blijft de gewone link staan */
    try {
      var s = document.querySelector('.ifz[data-ifz-live]'); if (s) s.parentNode.removeChild(s);
      var r = document.querySelector('.ifz-ruimte'); if (r) r.parentNode.removeChild(r);
      window.__ifzPlek = false;
    } catch (e2) {}
  }
})();
