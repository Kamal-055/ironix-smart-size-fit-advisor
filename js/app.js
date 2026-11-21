/* IRONIX Size & Fit Advisor - UI layer. All user text is written with textContent (no innerHTML), so input cannot inject markup. */
(function () {
  'use strict';
  var E = window.SizeEngine, PRODUCTS = window.IRONIX_PRODUCTS;
  var $ = function (id) { return document.getElementById(id); };
  var state = { colour: PRODUCTS[0], unit: 'in', result: null, cart: [] };
  var rs = function (n) { return 'Rs. ' + n.toLocaleString('en-IN'); };

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }

  /* ---------- product + colours ---------- */
  function totalStock(p) { return Object.keys(p.stock).reduce(function (a, k) { return a + p.stock[k]; }, 0); }
  function renderSwatches() {
    var box = $('swatches'); box.textContent = '';
    PRODUCTS.forEach(function (p) {
      var b = el('button', 'swatch' + (totalStock(p) === 0 ? ' soldout' : ''));
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(p === state.colour));
      var dot = el('i'); dot.style.background = p.hex; b.appendChild(dot);
      b.appendChild(document.createTextNode(p.colour));
      if (totalStock(p) === 0) b.appendChild(el('small', '', 'Sold out'));
      b.addEventListener('click', function () { state.colour = p; renderProduct(); if (state.result) renderResult(); });
      box.appendChild(b);
    });
  }
  function renderProduct() {
    var p = state.colour;
    $('vestShape').style.fill = p.hex;
    $('ribs').setAttribute('stroke', p.id === 'white' ? '#000' : '#fff');
    $('price').textContent = rs(p.price); $('mrp').textContent = rs(p.mrp);
    $('colourCaption').textContent = 'The Keeper - ' + p.colour;
    renderSwatches();
  }
  function drawRibs() {
    var g = $('ribs'), NS = 'http://www.w3.org/2000/svg';
    for (var x = 56; x <= 146; x += 6) { var l = document.createElementNS(NS, 'line'); l.setAttribute('x1', x); l.setAttribute('x2', x); l.setAttribute('y1', 70); l.setAttribute('y2', 224); g.appendChild(l); }
  }

  /* ---------- size chart ---------- */
  function renderChart() {
    var tb = document.querySelector('#chartTable tbody'); tb.textContent = '';
    E.CHART.forEach(function (r) {
      var tr = el('tr'); tr.dataset.size = r.size;
      [r.size, r.min + ' - ' + r.max, String(r.length)].forEach(function (t) { tr.appendChild(el('td', '', t)); });
      tb.appendChild(tr);
    });
  }
  function highlightChart(size, alt) {
    document.querySelectorAll('#chartTable tbody tr').forEach(function (tr) {
      tr.classList.toggle('hl', tr.dataset.size === size);
      tr.classList.toggle('alt', !!alt && tr.dataset.size === alt);
    });
  }

  /* ---------- form ---------- */
  function setUnit(u) {
    state.unit = u;
    document.querySelectorAll('.chip').forEach(function (c) { var on = c.dataset.unit === u; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
    $('chestHint').textContent = 'Fullest part, ' + u; $('heightHint').textContent = u;
    $('chest').placeholder = u === 'in' ? 'e.g. 39' : 'e.g. 99'; $('height').placeholder = u === 'in' ? 'e.g. 69' : 'e.g. 175';
  }
  function showErrors(errors) {
    ['chest', 'height', 'fit'].forEach(function (f) {
      var msg = errors && errors[f] ? errors[f] : '';
      $(f + 'Err').textContent = msg;
      if (f !== 'fit') $(f).setAttribute('aria-invalid', msg ? 'true' : 'false');
    });
  }
  function onSubmit(ev) {
    ev.preventDefault();
    var fitEl = document.querySelector('input[name=fit]:checked');
    var res = E.recommend({ chest: $('chest').value, height: $('height').value, unit: state.unit, fit: fitEl ? fitEl.value : null });
    if (!res.ok) { showErrors(res.errors); state.result = null; $('result').hidden = true; highlightChart(null); var first = Object.keys(res.errors)[0]; if ($(first)) $(first).focus(); return; }
    showErrors(null); state.result = res; renderResult();
    $('result').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- result ---------- */
  var CONF = { high: 'High confidence', medium: 'Between sizes', low: 'Low confidence' };
  function renderResult() {
    var res = state.result, box = $('result'); box.textContent = ''; box.hidden = false;
    if (res.status === 'out-of-range') {
      highlightChart(null);
      var top0 = el('div', 'result-top'); top0.appendChild(el('div', 'size-badge none', '?'));
      var t0 = el('div'); t0.appendChild(el('h3', '', 'We cannot size you reliably'));
      t0.appendChild(el('p', '', 'Your chest is outside the 34 to 46 in range this advisor covers, and our sizes run S to XL. A wrong guess would cost you an exchange fee.'));
      top0.appendChild(t0); box.appendChild(top0);
      var a = el('a', 'primary', 'Ask IRONIX support'); a.href = 'mailto:support@ironix.in?subject=Size%20help%20-%20The%20Keeper'; a.style.display = 'block'; a.style.textAlign = 'center'; a.style.textDecoration = 'none'; a.style.marginTop = '14px';
      box.appendChild(a); return;
    }
    highlightChart(res.size, res.alt);
    var top = el('div', 'result-top'); top.appendChild(el('div', 'size-badge', res.size));
    var t = el('div'); t.appendChild(el('h3', '', 'We recommend size ' + res.size));
    var p = el('p'); p.appendChild(el('span', 'pill ' + res.confidence, CONF[res.confidence]));
    p.appendChild(document.createTextNode('Chest ' + res.effectiveChest + ' in with ease, back length ' + res.length + ' in')); t.appendChild(p);
    top.appendChild(t); box.appendChild(top);
    if (res.notes.length) { var ul = el('ul', 'notes'); res.notes.forEach(function (n) { ul.appendChild(el('li', '', n)); }); box.appendChild(ul); }

    var st = E.checkStock(res, state.colour.stock), s = el('div', 'stock ' + st.state);
    var canAdd = true, addSize = res.size;
    if (st.state === 'in-stock') s.textContent = 'In stock in ' + state.colour.colour + '.';
    else if (st.state === 'low') s.textContent = 'Only ' + st.qty + ' left in size ' + st.size + ' (' + state.colour.colour + ').';
    else if (st.state === 'alternative') { s.textContent = 'Size ' + st.size + ' is sold out in ' + state.colour.colour + '. Size ' + st.alt + ' is your closest option and is in stock.'; addSize = st.alt; }
    else { s.textContent = 'Size ' + st.size + ' is sold out in ' + state.colour.colour + '.'; canAdd = false; }
    box.appendChild(s);

    var acts = el('div', 'actions');
    var add = el('button', 'primary', 'Add size ' + addSize + ' to cart'); add.type = 'button'; add.disabled = !canAdd;
    add.addEventListener('click', function () { addToCart(addSize); }); acts.appendChild(add);
    if (res.alt && st.state !== 'alternative') {
      var altStock = state.colour.stock[res.alt] || 0;
      var ab = el('button', 'secondary', 'Choose ' + res.alt + ' instead'); ab.type = 'button'; ab.disabled = altStock === 0;
      ab.addEventListener('click', function () { addToCart(res.alt); }); acts.appendChild(ab);
    }
    box.appendChild(acts);
    if (!canAdd) box.appendChild(notifyForm(st.size));
  }

  /* back-in-stock form (validation + success state) */
  function notifyForm(size) {
    var wrap = el('div'); var f = el('form', 'notify'); f.noValidate = true;
    var i = el('input'); i.type = 'email'; i.placeholder = 'you@example.com'; i.setAttribute('aria-label', 'Email for back-in-stock alert');
    var b = el('button', 'secondary', 'Notify me'); b.type = 'submit';
    var msg = el('p', 'err'); msg.setAttribute('role', 'alert');
    f.appendChild(i); f.appendChild(b); wrap.appendChild(f); wrap.appendChild(msg);
    f.addEventListener('submit', function (ev) {
      ev.preventDefault(); var v = i.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.className = 'err'; msg.textContent = 'Enter a valid email address.'; i.setAttribute('aria-invalid', 'true'); return; }
      i.setAttribute('aria-invalid', 'false'); msg.className = 'success'; msg.textContent = 'Done. We would email you when size ' + size + ' is back (demo: nothing is sent).'; f.hidden = true;
    });
    return wrap;
  }

  /* ---------- cart ---------- */
  function addToCart(size) {
    var stock = state.colour.stock[size] || 0;
    var line = state.cart.filter(function (l) { return l.id === state.colour.id && l.size === size; })[0];
    var inCart = line ? line.qty : 0;
    if (inCart >= stock) { toast('Only ' + stock + ' available in ' + size + '.'); return; } // stock cap edge case
    if (line) line.qty++; else state.cart.push({ id: state.colour.id, colour: state.colour.colour, size: size, price: state.colour.price, qty: 1 });
    renderCart(); toast('Added: The Keeper ' + state.colour.colour + ', size ' + size);
  }
  function renderCart() {
    var ul = $('cartList'); ul.textContent = ''; var count = 0, sum = 0;
    state.cart.forEach(function (l, idx) {
      count += l.qty; sum += l.qty * l.price;
      var li = el('li'); var left = el('div'); left.appendChild(el('strong', '', 'The Keeper - ' + l.colour)); left.appendChild(el('div', 'fine', 'Size ' + l.size + ' x ' + l.qty));
      var right = el('div'); right.appendChild(el('div', '', rs(l.qty * l.price)));
      var rm = el('button', '', 'Remove'); rm.type = 'button'; rm.addEventListener('click', function () { state.cart.splice(idx, 1); renderCart(); }); right.appendChild(rm);
      li.appendChild(left); li.appendChild(right); ul.appendChild(li);
    });
    $('cartCount').textContent = count; $('subtotal').textContent = rs(sum); $('cartEmpty').hidden = count > 0;
  }
  function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function openCart() { $('drawer').hidden = false; $('closeCart').focus(); }
  function closeCart() { $('drawer').hidden = true; $('cartBtn').focus(); }

  /* ---------- init ---------- */
  drawRibs(); renderChart(); renderProduct(); renderCart();
  document.querySelectorAll('.chip').forEach(function (c) { c.addEventListener('click', function () { setUnit(c.dataset.unit); $('chest').value = ''; $('height').value = ''; state.result = null; $('result').hidden = true; showErrors(null); highlightChart(null); }); });
  $('sizeForm').addEventListener('submit', onSubmit);
  $('cartBtn').addEventListener('click', openCart); $('closeCart').addEventListener('click', closeCart);
  $('drawer').addEventListener('click', function (e) { if (e.target === $('drawer')) closeCart(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('drawer').hidden) closeCart(); });
})();
