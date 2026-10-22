import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const lees = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('ondernemen.json is geldig: vier stappen, items volledig', () => {
  const d = JSON.parse(lees('public/ondernemen.json'));
  assert.equal(d.stappen.length, 4);
  d.stappen.forEach((s, i) => {
    assert.equal(s.nr, i + 1);
    assert.ok(s.titel && Array.isArray(s.items) && s.items.length > 0);
    for (const it of s.items) {
      assert.ok(it.titel, 'titel');
      assert.ok(['artikel', 'tool'].includes(it.soort), it.titel);
      if (it.soort === 'tool') assert.ok(it.module, it.titel);
      else assert.ok(it.later === true || it.url || (it.pad.startsWith('/') && it.pad.endsWith('/')), it.titel);
      if (it.soort === 'artikel') assert.ok(it.later === true || it.pad || it.url, it.titel);
      if (it.ook) assert.ok(Array.isArray(it.ook));
    }
  });
  const g = d.stappen[1].items.find((i) => i.module === 'gitekompas');
  assert.ok(g);
  assert.deepEqual(d.stappen[1].items.find((i) => i.pad === '/gite-beginnen-in-frankrijk/').ook, ['wonen']);
});

test('vercel.json: CORS open en cache voor /ondernemen.json', () => {
  const v = JSON.parse(lees('vercel.json'));
  const h = v.headers.find((x) => x.source === '/ondernemen.json');
  assert.ok(h);
  const g = Object.fromEntries(h.headers.map((x) => [x.key, x.value]));
  assert.equal(g['Access-Control-Allow-Origin'], '*');
  assert.equal(g['Cache-Control'], 'public, max-age=60, must-revalidate');
});
