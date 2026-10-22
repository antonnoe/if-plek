import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const lees = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('la-maison.json is geldig en compleet', () => {
  const delen = JSON.parse(lees('public/la-maison.json'));
  assert.ok(Array.isArray(delen));
  const ids = delen.map((d) => d.id);
  for (const id of ['kopen', 'kosten', 'verkopen', 'wonen']) assert.ok(ids.includes(id), id);
  const kopen = delen.find((d) => d.id === 'kopen');
  assert.equal(kopen.fasen.length, 7);
  for (const f of kopen.fasen) {
    assert.ok(f.titel && f.anker && Array.isArray(f.artikelen) && f.artikelen.length > 0, 'fase ' + f.nr);
  }
  const alle = [];
  for (const d of delen) {
    assert.ok(d.naam);
    for (const f of d.fasen || [{ artikelen: d.artikelen }]) alle.push(...f.artikelen);
  }
  for (const a of alle) {
    assert.ok(a.titel, 'titel');
    assert.ok(a.later === true || (typeof a.pad === 'string' && a.pad.startsWith('/') && a.pad.endsWith('/')), a.titel);
  }
});

test('plek.js bevat de lijst niet meer inline', () => {
  const js = lees('public/plek.js');
  assert.ok(!/var DELEN\s*=/.test(js));
  assert.ok(!js.includes('/compromis-de-vente/'));
  assert.ok(js.includes('la-maison.json'));
});

test('plek.js: mislukte fetch geeft geen exception en niets in de DOM', async () => {
  const gezet = [];
  const el = () => ({ style: {}, classList: { contains: () => false, add() {}, remove() {}, toggle() {} }, setAttribute() {}, getAttribute: () => null, appendChild(c) { gezet.push(c); }, insertBefore(c) { gezet.push(c); }, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], parentNode: null });
  const script = { src: 'https://if-plek.vercel.app/plek.js', getAttribute: () => null };
  const link = el();
  const document = {
    readyState: 'complete', currentScript: script, body: el(), head: el(),
    querySelector: (s) => (s === 'a.ifz-plek' ? link : null),
    querySelectorAll: () => [], createElement: () => el(), addEventListener() {},
    documentElement: { scrollHeight: 0 }, title: 't',
  };
  document.body.appendChild = (c) => gezet.push(c);
  document.head.appendChild = (c) => gezet.push(c);
  const window = { document, location: { href: 'https://infofrankrijk.com/compromis-de-vente/', pathname: '/compromis-de-vente/', origin: 'https://infofrankrijk.com' },
    fetch: () => Promise.reject(new Error('netwerk')), addEventListener() {}, innerWidth: 400, innerHeight: 800, pageYOffset: 0 };
  window.top = window; window.window = window;
  const ctx = vm.createContext({ ...window, window, document, location: window.location, fetch: window.fetch, URL, encodeURIComponent, decodeURIComponent });
  ctx.window = ctx; ctx.top = ctx;
  ctx.window.top = ctx;
  assert.doesNotThrow(() => vm.runInContext(lees('public/plek.js'), ctx));
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(gezet.length, 0);
});

test('vercel.json heeft CORS voor /la-maison.json', () => {
  const v = JSON.parse(lees('vercel.json'));
  const h = v.headers.find((x) => x.source === '/la-maison.json');
  assert.ok(h);
  assert.equal(h.headers.find((k) => k.key === 'Access-Control-Allow-Origin').value, '*');
  assert.match(h.headers.find((k) => k.key === 'Cache-Control').value, /max-age=60/);
});
