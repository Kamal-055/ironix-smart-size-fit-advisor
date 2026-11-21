/**
 * IRONIX Size & Fit Advisor - recommendation engine (pure functions, no DOM).
 * Works in the browser (window.SizeEngine) and in Node (module.exports) so it can be unit tested.
 *
 * Source chart: the "Size Guide" table on https://ironix.in/products/ironix-rib-tank-black
 *   S 36-38 | M 38-40 | L 40-42 | XL 40-44   (chest, inches)
 * ASSUMPTION: the published XL row (40-44) overlaps L (40-42). We treat XL as 42-44 so each
 * chest value maps to one size. IRONIX should confirm the real garment measurements.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SizeEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var CHART = [
    { size: 'S',  min: 36, max: 38, length: 26 },
    { size: 'M',  min: 38, max: 40, length: 27 },
    { size: 'L',  min: 40, max: 42, length: 28 },
    { size: 'XL', min: 42, max: 44, length: 28 } // published as 40-44, see assumption above
  ];
  var ORDER = CHART.map(function (r) { return r.size; });
  // Extra room (inches) added to the body chest, depending on the fit the customer wants.
  var EASE = { snug: 0, regular: 1, relaxed: 2 };
  var LIMITS = { in: { chest: [28, 60], height: [51, 87] }, cm: { chest: [71, 152], height: [130, 220] } };
  var CM_PER_IN = 2.54;

  function toInches(v, unit) { return unit === 'cm' ? v / CM_PER_IN : v; }
  function round(n, d) { var p = Math.pow(10, d || 1); return Math.round(n * p) / p; }

  function parseNumber(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).trim().replace(',', '.');
    if (s === '' || !/^\d+(\.\d+)?$/.test(s)) return null;
    return parseFloat(s);
  }

  /** Returns {ok:true, value} or {ok:false, errors:{field:message}} */
  function validate(input) {
    var errors = {};
    var unit = input && input.unit === 'cm' ? 'cm' : 'in';
    var fit = input && Object.prototype.hasOwnProperty.call(EASE, input.fit) ? input.fit : null;
    var chest = parseNumber(input && input.chest);
    var height = parseNumber(input && input.height);
    var L = LIMITS[unit];

    if (chest === null) errors.chest = 'Enter your chest measurement as a number.';
    else if (chest < L.chest[0] || chest > L.chest[1])
      errors.chest = 'That looks off. Chest should be between ' + L.chest[0] + ' and ' + L.chest[1] + ' ' + unit + '.';

    if (height === null) errors.height = 'Enter your height as a number.';
    else if (height < L.height[0] || height > L.height[1])
      errors.height = 'Height should be between ' + L.height[0] + ' and ' + L.height[1] + ' ' + unit + '.';

    if (!fit) errors.fit = 'Pick how you want the vest to fit.';

    if (Object.keys(errors).length) return { ok: false, errors: errors };
    return { ok: true, value: { chestIn: toInches(chest, unit), heightCm: unit === 'cm' ? height : height * CM_PER_IN, fit: fit, unit: unit } };
  }

  /** Main entry. status: 'match' | 'between' | 'below-chart' | 'above-chart' | 'out-of-range' */
  function recommend(input) {
    var v = validate(input);
    if (!v.ok) return v;
    var chest = v.value.chestIn, fit = v.value.fit, heightCm = v.value.heightCm;
    var e = round(chest + EASE[fit], 2);
    var notes = [];
    var res = { ok: true, effectiveChest: e, fit: fit, confidence: 'high', alt: null, status: 'match', notes: notes, size: null, length: null };

    if (chest < 34 || chest > 46) { res.status = 'out-of-range'; res.confidence = 'none'; return res; }

    if (e < 36) {
      res.size = 'S'; res.status = 'below-chart'; res.confidence = 'low';
      notes.push('Your chest is below the smallest size on the chart (36 in). S is the closest, but expect a looser fit.');
    } else if (e > 44) {
      res.size = 'XL'; res.status = 'above-chart'; res.confidence = 'low';
      notes.push('XL is our largest size and your measurement is above its range, so it will fit closer than the fit you chose.');
    } else {
      var hits = CHART.filter(function (r) { return e >= r.min && e <= r.max; });
      if (hits.length === 2) { // exactly on a shared boundary (38, 40 or 42)
        var lowerFirst = fit === 'snug';
        res.size = lowerFirst ? hits[0].size : hits[1].size;
        res.alt = lowerFirst ? hits[1].size : hits[0].size;
        res.status = 'between'; res.confidence = 'medium';
        notes.push('You sit exactly between ' + hits[0].size + ' and ' + hits[1].size + '. We picked ' + res.size + ' for a ' + fit + ' fit.');
      } else {
        var row = hits[0]; res.size = row.size;
        if (Math.min(e - row.min, row.max - e) < 0.5) { // close to a boundary: offer the neighbour too
          var nearTop = (row.max - e) < (e - row.min);
          var neighbour = ORDER[ORDER.indexOf(row.size) + (nearTop ? 1 : -1)];
          if (neighbour) { res.alt = neighbour; res.confidence = 'medium'; notes.push('You are close to the ' + row.size + '/' + neighbour + ' boundary, so ' + neighbour + ' is a reasonable second option.'); }
        }
      }
    }
    if (heightCm >= 185 && res.size) notes.push('At your height the longest cut (28 in) may sit shorter than you expect. It is designed as a gym-length vest.');
    var row2 = CHART.filter(function (r) { return r.size === res.size; })[0];
    res.length = row2 ? row2.length : null;
    return res;
  }

  /** Combine a recommendation with stock for one colour: stock = {S:12, M:0, ...} */
  function checkStock(result, stock) {
    if (!result || !result.size) return { state: 'none' };
    var q = stock[result.size] || 0;
    if (q > 3) return { state: 'in-stock', size: result.size, qty: q };
    if (q > 0) return { state: 'low', size: result.size, qty: q };
    if (result.alt && (stock[result.alt] || 0) > 0) return { state: 'alternative', size: result.size, alt: result.alt, qty: stock[result.alt] };
    return { state: 'sold-out', size: result.size };
  }

  return { CHART: CHART, EASE: EASE, validate: validate, recommend: recommend, checkStock: checkStock };
});
