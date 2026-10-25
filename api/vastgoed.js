'use strict';
const { linksUitHtml, bouwItems } = require('../lib/vastgoed.js');

const SHEET = 'https://docs.google.com/spreadsheets/d/12yexSnIp7ZwV13XLRqhr9NJneoHQB4mhCAJeuldPbQc/export?format=csv';
const PAGINA = 'https://www.nederlanders.fr/page/onroerend-goed';

async function haal(url) {
  const r = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfoPocheVastgoed/1.0)' },
  });
  if (!r.ok) throw new Error('status ' + r.status);
  return r.text();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'GET') {
    res.statusCode = 405; res.setHeader('Allow', 'GET, OPTIONS');
    return res.end();
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const [csv, html] = await Promise.all([haal(SHEET), haal(PAGINA)]);
    const links = linksUitHtml(html);
    const advLinks = [...links].filter((l) => /nederlanders\.fr\/profiles\/blogs\//.test(l));
    if (advLinks.length < 5) throw new Error('pagina leeg');
    const items = bouwItems(csv, links);
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400');
    res.statusCode = 200;
    res.end(JSON.stringify({ bijgewerkt: new Date().toISOString(), bron: PAGINA, aantal: items.length, items }));
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 502;
    res.end(JSON.stringify({ fout: 'bron niet bereikbaar' }));
  }
};
