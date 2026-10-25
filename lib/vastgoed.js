'use strict';
// Pure logica voor /api/vastgoed, los van het netwerk.

function parseCsv(tekst) {
  const rijen = [];
  let rij = [], veld = '', inQ = false;
  const s = String(tekst || '').replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { veld += '"'; i++; } else inQ = false; }
      else veld += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { rij.push(veld); veld = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      rij.push(veld); veld = '';
      rijen.push(rij); rij = [];
    } else veld += c;
  }
  if (veld !== '' || rij.length) { rij.push(veld); rijen.push(rij); }
  return rijen.filter((r) => r.some((v) => v.trim() !== ''));
}

function normaliseerUrl(u) {
  let s = String(u || '').trim();
  if (!s) return '';
  s = s.replace(/&amp;/g, '&').replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/^\/\//, '');
  s = s.split('#')[0].split('?')[0].replace(/^www\./i, '').replace(/\/+$/, '');
  return s.toLowerCase();
}

function linksUitHtml(html) {
  const set = new Set();
  const re = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(String(html || '')))) {
    const n = normaliseerUrl(m[1] != null ? m[1] : m[2]);
    if (n) set.add(n);
  }
  return set;
}

const OPVRAGEN = 'Opvragen bij de verkoper';

function fmtGetal(n) {
  return '€ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function prijsGetal(tekst) {
  const m = String(tekst).trim().match(/^€?\s*(\d{1,3}(?:\.\d{3})+|\d+)(?:\s*k\.?\s?k\.?)?$/i);
  return m ? parseInt(m[1].replace(/\./g, ''), 10) : null;
}

function formatteerPrijs(ruw) {
  const t = String(ruw == null ? '' : ruw).trim();
  if (!t) return { prijsTekst: OPVRAGEN, prijs: null };
  const kaal = t.replace(/^€\s*/, '');
  if (/^(\d{1,3}(\.\d{3})+|\d+)$/.test(kaal)) {
    const n = parseInt(kaal.replace(/\./g, ''), 10);
    return { prijsTekst: fmtGetal(n), prijs: n };
  }
  return { prijsTekst: t, prijs: prijsGetal(t) };
}

function parseDatum(d) {
  const m = String(d || '').trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})(?!\d)/);
  if (!m) return null;
  const dag = +m[1], mnd = +m[2], jaar = +m[3];
  const dt = new Date(Date.UTC(jaar, mnd - 1, dag));
  if (dt.getUTCFullYear() !== jaar || dt.getUTCMonth() !== mnd - 1 || dt.getUTCDate() !== dag) return null;
  const p = (x) => String(x).padStart(2, '0');
  return { datum: dag + '-' + mnd + '-' + jaar, datumISO: jaar + '-' + p(mnd) + '-' + p(dag) };
}

function isExploitatie(v) {
  const t = String(v || '').trim().toLowerCase();
  return t !== '' && !/^(nee|no|false|onwaar|0|n)$/.test(t);
}

function bouwItems(csvTekst, paginaLinks) {
  const links = paginaLinks instanceof Set ? paginaLinks : new Set(paginaLinks || []);
  const uit = [];
  parseCsv(csvTekst).forEach((r, idx) => {
    const c = (i) => (r[i] == null ? '' : String(r[i]));
    const titel = c(1).trim();
    const url = c(2).trim();
    const dat = parseDatum(c(7));
    if (!titel || !url || !dat) return;
    if (!links.has(normaliseerUrl(url))) return;
    const p = formatteerPrijs(c(3));
    uit.push({
      item: {
        titel, url, prijsTekst: p.prijsTekst, prijs: p.prijs,
        foto: c(4).trim(), plaats: c(5), omschrijving: c(6),
        datum: dat.datum, datumISO: dat.datumISO, exploitatie: isExploitatie(c(8)),
      },
      ts: c(0).trim(), idx,
    });
  });
  const tsKey = (t) => {
    const m = t.match(/^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    return m ? m[3] + m[2].padStart(2, '0') + m[1].padStart(2, '0') + (m[4] || '0').padStart(2, '0') + (m[5] || '00') : '';
  };
  uit.sort((a, b) =>
    b.item.datumISO.localeCompare(a.item.datumISO) ||
    tsKey(b.ts).localeCompare(tsKey(a.ts)) || a.idx - b.idx);
  return uit.map((x) => x.item);
}

module.exports = { parseCsv, normaliseerUrl, linksUitHtml, formatteerPrijs, parseDatum, bouwItems, OPVRAGEN };
