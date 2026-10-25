import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const L = require('../lib/vastgoed.js');
const dir = path.dirname(fileURLToPath(import.meta.url));
const csv = fs.readFileSync(path.join(dir, 'fixtures/vastgoed.csv'), 'utf8');
const html = fs.readFileSync(path.join(dir, 'fixtures/pagina.html'), 'utf8');

test('parseCsv: komma, aanhalingstekens en regeleinde in veld', () => {
  const r = L.parseCsv(csv);
  assert.equal(r[0][5], 'Le Bugue, Dordogne');
  assert.equal(r[0][6], 'Ruim huis, met "tuin" van 2000 m².\nTweede regel');
  assert.equal(r[0].length, 9);
});

test('normaliseerUrl', () => {
  const n = 'nederlanders.fr/profiles/blogs/x';
  for (const u of ['https://www.nederlanders.fr/profiles/blogs/X/', 'http://nederlanders.fr/profiles/blogs/x?a=1#b'])
    assert.equal(L.normaliseerUrl(u), n);
});

test('prijsregels', () => {
  assert.deepEqual(L.formatteerPrijs('196000'), { prijsTekst: '€ 196.000', prijs: 196000 });
  assert.deepEqual(L.formatteerPrijs('€284.800'), { prijsTekst: '€ 284.800', prijs: 284800 });
  assert.equal(L.formatteerPrijs('€ 45.000 k.k.').prijsTekst, '€ 45.000 k.k.');
  assert.equal(L.formatteerPrijs('€ 45.000 k.k.').prijs, 45000);
  assert.deepEqual(L.formatteerPrijs('Opvragen bij de verkoper'), { prijsTekst: 'Opvragen bij de verkoper', prijs: null });
  assert.deepEqual(L.formatteerPrijs(''), { prijsTekst: 'Opvragen bij de verkoper', prijs: null });
  assert.equal(L.formatteerPrijs('Prijs op aanvraag').prijs, null);
});

test('bouwItems: filter, volgorde, afwijzing', () => {
  const items = L.bouwItems(csv, L.linksUitHtml(html));
  assert.deepEqual(items.map((i) => i.titel), ['Groot huis', 'Woning Barjac', 'Zonder prijs', 'Op aanvraag', 'Huisje']);
  assert.ok(!items.some((i) => i.titel === 'Verkocht huis'));
  assert.ok(!items.some((i) => i.titel === 'Kapotte datum'));
  assert.equal(items[0].datumISO, '2026-10-13');
  assert.equal(items[1].exploitatie, true);
  assert.equal(items[0].exploitatie, false);
  assert.equal(items[4].datum, '1-9-2026');
  assert.equal(items[4].exploitatie, true);
  assert.equal(items[2].prijsTekst, 'Opvragen bij de verkoper');
});

test('live: echte bronnen', async (t) => {
  let csvL, htmlL;
  try {
    const f = (u) => fetch(u, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Mozilla/5.0' } }).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); });
    [csvL, htmlL] = await Promise.all([
      f('https://docs.google.com/spreadsheets/d/12yexSnIp7ZwV13XLRqhr9NJneoHQB4mhCAJeuldPbQc/export?format=csv'),
      f('https://www.nederlanders.fr/page/onroerend-goed')]);
  } catch (e) { return t.skip('geen netwerk'); }
  const items = L.bouwItems(csvL, L.linksUitHtml(htmlL));
  assert.ok(items.length >= 30 && items.length <= 80, 'aantal ' + items.length);
});
