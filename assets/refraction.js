/* ============================================================================
   Liquid Glass refraction (lensing) for the web
   ----------------------------------------------------------------------------
   Real Liquid Glass bends what is behind it: text and edges passing under a
   control curve and stretch near its rim, like looking through the edge of a
   lens. Blur alone cannot do this. This module adds it with an SVG
   displacement filter used as a backdrop-filter.

   How it works
   - For each element marked [data-refract], it draws a displacement map the
     size of the element: neutral in the middle, and inside a rim ("bezel")
     band every pixel samples from further inward. That inward pull is what
     makes content curve and compress at the edge.
   - The map goes into an <feDisplacementMap>, and the element gets
     `backdrop-filter: url(#filter) blur() saturate()`.
   - The map follows the element's real border-radius, so capsules, circles
     and rounded rectangles each bend along their own outline. A
     ResizeObserver redraws it when the element changes size.

   Two ways to bend, picked per element:
   1. Backdrop mode (Chromium: Chrome, Edge, Opera, Brave, Android WebView,
      Electron). The filter runs as a backdrop-filter, so it bends whatever is
      behind the element, live, including scrolling content.
   2. Mirror mode (every browser, including Safari and Firefox), for elements
      with data-refract-source="#id". Safari and Firefox don't run url()
      filters in backdrop-filter, so the script copies the source element
      into the glass, keeps the copy lined up with the original every frame,
      and bends the copy with an ordinary CSS filter. Use it for glass over a
      known, mostly static area (a hero, a photo, a card of text). The copy
      is a snapshot of the source's markup: text typed into it later is not
      mirrored until refresh().
   Elements with neither keep the normal .glass blur, so nothing breaks.
   Everything is skipped under prefers-reduced-transparency.

   Usage
     <script src="assets/refraction.js" defer></script>
     <nav class="glass" data-refract>…</nav>
     <div class="glass" data-refract data-refract-source="#hero">…</div>

   Options, as attributes on the element (all optional):
     data-refract="0.9"        strength, 0–2 (default 1)
     data-refract-bezel="18"   rim width in px (default: half the radius, 8–20)
     data-refract-blur="3"     blur after bending, px (default 10; 0.5 on .glass-clear)
     data-refract-dispersion="0.06"  colour fringing at the rim, 0–0.2 (default 0.04)
     data-refract-magnify="0.04"  slight zoom across the whole surface (default 0)
   CSS hook: the element gets class .is-refracting while the effect is active,
   so glass that relied on heavy blur can lower its tint there if needed.

   Manual control: window.LiquidGlassRefraction.refresh() re-scans the page,
   e.g. after adding elements.
   ========================================================================== */

(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var count = 0;
  var defs = null;
  var observed = new WeakMap();

  function isChromium() {
    var brands = navigator.userAgentData && navigator.userAgentData.brands;
    if (brands && brands.some(function (b) { return /Chromium/.test(b.brand); })) return true;
    // Fallback for engines without userAgentData: Chrome UA, not Safari/Firefox
    var ua = navigator.userAgent;
    return /Chrome\/\d+/.test(ua) && !/Firefox|FxiOS|EdgiOS|CriOS/.test(ua);
  }

  function reducedTransparency() {
    return window.matchMedia('(prefers-reduced-transparency: reduce)').matches ||
      document.documentElement.hasAttribute('data-rt');
  }

  /* Backdrop mode: Chromium only. */
  function supported() {
    if (!isChromium()) return false;
    if (!window.CSS || !CSS.supports('backdrop-filter', 'url(#a)')) return false;
    return !window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  }

  function sourceOf(el) {
    var sel = el.getAttribute('data-refract-source');
    if (!sel) return null;
    try { return document.querySelector(sel); } catch (e) { return null; }
  }

  function ensureDefs() {
    if (defs) return defs;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return defs;
  }

  /* Signed distance from a point to a rounded rectangle centred at 0,0.
     Negative inside. Also returns the outward normal. */
  function roundedRectField(x, y, hw, hh, r) {
    var ax = Math.abs(x), ay = Math.abs(y);
    var qx = ax - (hw - r), qy = ay - (hh - r);
    var sx = x < 0 ? -1 : 1, sy = y < 0 ? -1 : 1;
    var dist, nx, ny;
    if (qx > 0 && qy > 0) {
      var len = Math.sqrt(qx * qx + qy * qy) || 1;
      dist = len - r;
      nx = (qx / len) * sx; ny = (qy / len) * sy;
    } else if (qx > qy) {
      dist = qx - r; nx = sx; ny = 0;
    } else {
      dist = qy - r; nx = 0; ny = sy;
    }
    return { d: dist, nx: nx, ny: ny };
  }

  /* Draw the displacement map. Red = x shift, green = y shift, 128 = none. */
  function buildMap(w, h, radius, bezel, magnify) {
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    var img = ctx.createImageData(w, h);
    var data = img.data;
    var hw = w / 2, hh = h / 2;
    var maxMag = Math.max(1e-6, magnify);
    for (var py = 0; py < h; py++) {
      for (var px = 0; px < w; px++) {
        var x = px + 0.5 - hw, y = py + 0.5 - hh;
        var f = roundedRectField(x, y, hw, hh, radius);
        var inside = -f.d;                    // distance in from the outline
        var vx = 0, vy = 0;
        if (inside < bezel && inside > -1) {
          // 1 at the outline, 0 at the inner edge of the bezel. The curve is
          // steep near the outline, like the rim of a thick convex lens.
          var t = 1 - Math.max(0, inside) / bezel;
          var m = t * t * (3 - 2 * t);        // smoothstep
          m = Math.pow(m, 1.6);
          vx = -f.nx * m;                     // sample inward
          vy = -f.ny * m;
        }
        if (magnify > 0) {                    // gentle zoom toward the centre
          vx -= (x / hw) * magnify / maxMag * 0.25;
          vy -= (y / hh) * magnify / maxMag * 0.25;
        }
        var i = (py * w + px) * 4;
        data[i] = Math.round(128 + Math.max(-1, Math.min(1, vx)) * 127);
        data[i + 1] = Math.round(128 + Math.max(-1, Math.min(1, vy)) * 127);
        data[i + 2] = 128;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  }

  function readNumber(el, name, fallback) {
    var v = parseFloat(el.getAttribute(name));
    return isFinite(v) ? v : fallback;
  }

  function apply(el, mode) {
    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width), h = Math.round(rect.height);
    if (w < 8 || h < 8) return;

    var cs = getComputedStyle(el);
    var radius = parseFloat(cs.borderTopLeftRadius) || 0;
    radius = Math.min(radius, w / 2, h / 2);

    var strength = Math.max(0, Math.min(2, readNumber(el, 'data-refract', 1) || 1));
    // The rim band: about half the corner radius, kept to under a third of
    // the short side so the middle of the control stays undistorted.
    var bezel = readNumber(el, 'data-refract-bezel', Math.max(8, Math.min(20, radius * 0.5 || 12)));
    bezel = Math.min(bezel, Math.min(w, h) * 0.32);
    // Regular glass bends a strongly blurred picture; clear glass bends a sharp
    // one (that is where text visibly curves at the rim).
    var isClear = el.classList.contains('glass-clear');
    var blur = readNumber(el, 'data-refract-blur', isClear ? 0.5 : 10);
    var dispersion = Math.max(0, Math.min(0.2, readNumber(el, 'data-refract-dispersion', 0.04)));
    var magnify = readNumber(el, 'data-refract-magnify', 0);
    var scale = Math.round(bezel * 1.2 * strength);   // max shift = scale / 2

    var key = [mode, w, h, radius, bezel, scale, blur, magnify, dispersion].join('|');
    var state = observed.get(el);
    if (state && state.key === key) return;
    if (state && state.mode !== mode) { remove(el); state = null; }

    var id = state ? state.id : 'lg-refract-' + (++count);
    var old = document.getElementById(id);
    if (old) old.remove();

    var filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', String(w));
    filter.setAttribute('height', String(h));
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    function node(tag, attrs) {
      var n = document.createElementNS(SVG_NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, String(attrs[k])); });
      filter.appendChild(n);
      return n;
    }

    node('feImage', {
      href: buildMap(w, h, radius, bezel, magnify),
      x: 0, y: 0, width: w, height: h,
      preserveAspectRatio: 'none',
      result: 'raw'
    });
    // Soften the map a little so the pull changes smoothly where the outline
    // curves (capsule ends, corners) instead of pinching into a dark knot.
    node('feGaussianBlur', { in: 'raw', stdDeviation: Math.max(1.5, bezel * 0.25).toFixed(1), result: 'map' });

    if (dispersion > 0) {
      // A touch of colour fringing at the rim, as a real lens shows: red, green
      // and blue are bent by slightly different amounts, then added back up.
      var channels = [
        { c: 'r', s: scale, m: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' },
        { c: 'g', s: scale * (1 - dispersion), m: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' },
        { c: 'b', s: scale * (1 - 2 * dispersion), m: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0' }
      ];
      channels.forEach(function (ch) {
        node('feDisplacementMap', {
          in: 'SourceGraphic', in2: 'map', scale: ch.s.toFixed(2),
          xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' + ch.c
        });
        node('feColorMatrix', { in: 'd' + ch.c, type: 'matrix', values: ch.m, result: ch.c });
      });
      node('feComposite', { in: 'r', in2: 'g', operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: 0, result: 'rg' });
      node('feComposite', { in: 'rg', in2: 'b', operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: 0 });
    } else {
      node('feDisplacementMap', {
        in: 'SourceGraphic', in2: 'map', scale: scale,
        xChannelSelector: 'R', yChannelSelector: 'G'
      });
    }
    ensureDefs().appendChild(filter);

    var value = 'url(#' + id + ') blur(' + blur + 'px) saturate(170%)';
    var next = { key: key, id: id, mode: mode };
    if (mode === 'backdrop') {
      el.style.setProperty('backdrop-filter', value);
      el.style.setProperty('-webkit-backdrop-filter', value);
    } else {
      next.mirror = state && state.mirror ? state.mirror : buildMirror(el);
      next.mirror.bend.style.filter = value;
    }
    el.classList.add('is-refracting');
    observed.set(el, next);
    if (mode === 'mirror') { mirrors.add(el); startSync(); }
  }

  /* ---- mirror mode -------------------------------------------------------- */

  var mirrors = new Set();
  var syncing = false;

  function buildMirror(el) {
    var src = sourceOf(el);
    // Outer layer clips to the glass outline; the inner one carries the
    // filter. (A filter on the clipping layer itself would paint the bent
    // pixels back into the rounded corners.)
    var box = document.createElement('div');
    box.className = 'lg-refract-mirror';
    box.setAttribute('aria-hidden', 'true');
    var bend = document.createElement('div');
    bend.className = 'lg-refract-bend';
    box.appendChild(bend);
    var copy = src.cloneNode(true);
    // No duplicate ids, no nested glass, nothing focusable in the copy.
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    copy.querySelectorAll('[data-refract]').forEach(function (n) { n.remove(); });
    copy.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function (n) {
      n.setAttribute('tabindex', '-1');
    });
    copy.setAttribute('inert', '');
    var cs = getComputedStyle(src);
    copy.style.position = 'absolute';
    copy.style.margin = '0';
    copy.style.boxSizing = 'border-box';
    copy.style.color = cs.color;
    copy.style.font = cs.font;
    bend.appendChild(copy);
    var tint = document.createElement('div');
    tint.className = 'lg-refract-tint';
    tint.setAttribute('aria-hidden', 'true');
    el.insertBefore(tint, el.firstChild);
    el.insertBefore(box, el.firstChild);
    // The glass's own fill and blur move to the tint layer above the copy.
    el.style.setProperty('background-color', 'transparent');
    el.style.setProperty('background-image', 'none');
    el.style.setProperty('backdrop-filter', 'none');
    el.style.setProperty('-webkit-backdrop-filter', 'none');
    var m = { box: box, bend: bend, copy: copy, tint: tint, src: src, x: NaN, y: NaN, w: NaN, h: NaN };
    syncMirror(el, m);
    return m;
  }

  function syncMirror(el, m) {
    var a = el.getBoundingClientRect();
    var b = m.src.getBoundingClientRect();
    var cl = el.clientLeft, ct = el.clientTop;
    var x = b.left - a.left - cl, y = b.top - a.top - ct;
    if (x !== m.x || y !== m.y) {
      m.copy.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      m.x = x; m.y = y;
    }
    if (b.width !== m.w || b.height !== m.h) {
      m.copy.style.left = '0';
      m.copy.style.top = '0';
      m.copy.style.width = b.width + 'px';
      m.copy.style.height = b.height + 'px';
      m.w = b.width; m.h = b.height;
    }
  }

  function startSync() {
    if (syncing) return;
    syncing = true;
    (function frame() {
      if (!mirrors.size) { syncing = false; return; }
      mirrors.forEach(function (el) {
        var st = observed.get(el);
        if (st && st.mirror) syncMirror(el, st.mirror);
      });
      requestAnimationFrame(frame);
    })();
  }

  function remove(el) {
    var state = observed.get(el);
    if (!state) return;
    var f = document.getElementById(state.id);
    if (f) f.remove();
    if (state.mirror) {
      state.mirror.box.remove();
      state.mirror.tint.remove();
      el.style.removeProperty('background-color');
      el.style.removeProperty('background-image');
      mirrors.delete(el);
    }
    el.style.removeProperty('backdrop-filter');
    el.style.removeProperty('-webkit-backdrop-filter');
    el.classList.remove('is-refracting');
    observed.delete(el);
  }

  function modeFor(el) {
    if (reducedTransparency()) return null;
    if (supported()) return 'backdrop';
    if (sourceOf(el)) return 'mirror';
    return null;
  }

  var ro = typeof ResizeObserver === 'function'
    ? new ResizeObserver(function (entries) {
        entries.forEach(function (e) { var m = modeFor(e.target); if (m) apply(e.target, m); });
      })
    : null;

  function refresh() {
    var els = document.querySelectorAll('[data-refract]');
    var any = false;
    els.forEach(function (el) {
      var mode = modeFor(el);
      if (mode) {
        apply(el, mode);
        any = true;
        if (ro) ro.observe(el);
      } else {
        remove(el);
        if (ro) ro.unobserve(el);
      }
    });
    document.documentElement.classList.toggle('refraction-on', any);
  }

  /* Which mode an element is using right now: 'backdrop', 'mirror' or null. */
  function modeOf(el) {
    var st = observed.get(el);
    return st ? st.mode : null;
  }

  window.LiquidGlassRefraction = { refresh: refresh, supported: supported, modeOf: modeOf };

  function start() {
    refresh();
    // Re-run when the user changes the transparency setting
    var mq = window.matchMedia('(prefers-reduced-transparency: reduce)');
    if (mq.addEventListener) mq.addEventListener('change', refresh);
    // Fonts can change element sizes after first layout
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
