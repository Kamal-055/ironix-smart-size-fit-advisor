const test = require('node:test');
const assert = require('node:assert');
const E = require('../js/size-engine.js');
const r = (o) => E.recommend(Object.assign({ chest: 39, height: 69, unit: 'in', fit: 'snug' }, o));

test('validation: rejects empty, text, negative and out-of-limit input', () => {
  assert.ok(E.validate({ chest: '', height: 170, unit: 'cm', fit: 'snug' }).errors.chest);
  assert.ok(E.validate({ chest: 'abc', height: 170, unit: 'cm', fit: 'snug' }).errors.chest);
  assert.ok(E.validate({ chest: 20, height: 170, unit: 'in', fit: 'snug' }).errors.chest);
  assert.ok(E.validate({ chest: 100, height: 20, unit: 'cm', fit: 'snug' }).errors.height);
  assert.ok(E.validate({ chest: 100, height: 170, unit: 'cm', fit: 'tight' }).errors.fit);
  assert.ok(E.validate({ chest: '-5', height: 170, unit: 'cm', fit: 'snug' }).errors.chest);
});
test('clear match inside a range', () => {
  const x = r({ chest: 41, fit: 'snug' });
  assert.deepStrictEqual([x.size, x.status, x.confidence, x.alt], ['L', 'match', 'high', null]);
});
test('fit preference moves the size up', () => {
  assert.strictEqual(r({ chest: 37, fit: 'snug' }).size, 'S');
  assert.strictEqual(r({ chest: 37, fit: 'relaxed' }).size, 'M');
});
test('boundary: between sizes picks by fit and offers alternative', () => {
  const s = r({ chest: 38, fit: 'snug' });
  assert.deepStrictEqual([s.status, s.size, s.alt], ['between', 'S', 'M']);
  assert.strictEqual(r({ chest: 38, fit: 'regular' }).size, 'M');
  const rel = r({ chest: 38, fit: 'relaxed' });
  assert.deepStrictEqual([rel.status, rel.size, rel.alt], ['between', 'L', 'M']);
});
test('near a boundary gives medium confidence with neighbour', () => {
  const x = r({ chest: 39.8, fit: 'snug' });
  assert.deepStrictEqual([x.size, x.confidence, x.alt], ['M', 'medium', 'L']);
});
test('below and above chart are flagged low confidence', () => {
  assert.deepStrictEqual([r({ chest: 34.5 }).size, r({ chest: 34.5 }).status], ['S', 'below-chart']);
  assert.deepStrictEqual([r({ chest: 45 }).size, r({ chest: 45 }).status], ['XL', 'above-chart']);
});
test('out of range returns no size', () => {
  assert.strictEqual(r({ chest: 33 }).status, 'out-of-range');
  assert.strictEqual(r({ chest: 47 }).size, null);
});
test('cm input is converted (101.6 cm = 40 in)', () => {
  assert.strictEqual(E.recommend({ chest: 101.6, height: 175, unit: 'cm', fit: 'snug' }).effectiveChest, 40);
});
test('tall customers get a length note', () => {
  assert.ok(r({ height: 75 }).notes.some((n) => /shorter/.test(n)));
  assert.ok(!r({ height: 67 }).notes.some((n) => /shorter/.test(n)));
});
test('stock: in stock, low, alternative, sold out', () => {
  assert.strictEqual(E.checkStock({ size: 'L', alt: null }, { L: 8 }).state, 'in-stock');
  assert.strictEqual(E.checkStock({ size: 'L', alt: null }, { L: 2 }).state, 'low');
  assert.strictEqual(E.checkStock({ size: 'M', alt: 'L' }, { M: 0, L: 8 }).state, 'alternative');
  assert.strictEqual(E.checkStock({ size: 'M', alt: null }, { M: 0 }).state, 'sold-out');
});
