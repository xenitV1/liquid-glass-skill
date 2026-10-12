/* Shared behaviour for the example pages: an icon sprite, the theme and
   accessibility preview switches, and small control interactions.
   URL parameters (handy for screenshots): ?theme=light|dark  &rt=1  &nobf=1 */

(function () {
  'use strict';

  /* --- icon sprite -----------------------------------------------------------
     SF Symbols are not licensed for use on the web, so these are simple
     stand-ins drawn on a 24px grid with a 1.8 stroke. */
  var icons = {
    'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'bold': '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
    'italic': '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
    'underline': '<path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/>',
    'list': '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="2.8"/>',
    'share': '<path d="M12 3v12M8 7l4-4 4 4M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'house': '<path d="M4 11l8-7 8 7M6 9.5V20h4.5v-5h3v5H18V9.5"/>',
    'photo': '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="9.5" r="1.5"/>',
    'people': '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2a4.5 4.5 0 0 1 5 4.8"/>',
    'person': '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    'moon': '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    'wifi': '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.7 15.5a5 5 0 0 1 6.6 0"/><path d="M12 19h.01" stroke-width="3"/>',
    'bluetooth': '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>',
    'speaker': '<path d="M4 9h3l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    'heart': '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6h.01" stroke-width="2.6"/>',
    'trash': '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v5.5M14 11v5.5"/>',
    'pencil': '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
    'copy': '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    'star': '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
    'ellipsis': '<path d="M6 12h.01M12 12h.01M18 12h.01" stroke-width="3"/>',
    'xmark': '<path d="M6 6l12 12M18 6L6 18"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7"/>',
    'play': '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    'pause': '<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
    'backward': '<path d="M11.5 6.5v11L3.5 12zM20.5 6.5v11L12.5 12z" fill="currentColor" stroke="none"/>',
    'forward': '<path d="M12.5 6.5v11l8-5.5zM3.5 6.5v11l8-5.5z" fill="currentColor" stroke="none"/>',
    'sidebar': '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M9 5v14"/>',
    'textformat': '<path d="M3.5 18l5-12 5 12M5.2 14h6.6M14.5 18l3-7.5 3 7.5M15.4 16h4.2"/>',
    'doc': '<path d="M6 3h8l5 5v13H6zM14 3v5h5"/>',
    'folder': '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'music': '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    'stack': '<rect x="4" y="9" width="16" height="11" rx="2.5"/><path d="M6.5 6h11M9 3h6"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'pin': '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    'calendar': '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    'bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    'fork': '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 21V3c-2 1.5-3 4-3 7h3"/>',
    'airplane': '<path d="M10.5 3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V9l7 4v2l-7-2v4.5l2.5 2V21L12 20l-4 1v-1.5l2.5-2V13l-7 2v-2l7-4z"/>',
    'transparency': '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M3.5 12h17M12 3.5v17"/><path d="M3.5 12h8.5v8.5H7.5a4 4 0 0 1-4-4z" fill="currentColor" stroke="none"/>'
  };
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  Object.keys(icons).forEach(function (id) {
    sprite += '<symbol id="i-' + id + '" viewBox="0 0 24 24">' + icons[id] + '</symbol>';
  });
  sprite += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);

  var root = document.documentElement;
  var params = new URLSearchParams(location.search);

  /* --- theme: auto / light / dark --------------------------------------- */
  function setTheme(value) {
    if (value === 'light' || value === 'dark') root.setAttribute('data-theme', value);
    else root.removeAttribute('data-theme');
    document.querySelectorAll('[data-set-theme]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-set-theme') === (value || 'auto')));
    });
    try { localStorage.setItem('lg-theme', value || 'auto'); } catch (e) { /* storage blocked */ }
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('lg-theme'); } catch (e) { /* storage blocked */ }
  var initialTheme = params.get('theme') || savedTheme || 'auto';
  setTheme(initialTheme);   /* applies the attribute now, before first paint */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-theme]');
    if (b) setTheme(b.getAttribute('data-set-theme'));
  });

  /* --- reduced transparency preview ------------------------------------- */
  function setRT(on) {
    if (on) root.setAttribute('data-rt', ''); else root.removeAttribute('data-rt');
    document.querySelectorAll('[data-toggle-rt]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(on));
    });
    if (window.LiquidGlassRefraction) window.LiquidGlassRefraction.refresh();
  }
  setRT(params.get('rt') === '1');
  /* this script runs at the top of <body>; sync the switch states once the
     controls below it exist */
  document.addEventListener('DOMContentLoaded', function () {
    setTheme(initialTheme);
    setRT(root.hasAttribute('data-rt'));
  });
  if (params.get('nobf') === '1') root.setAttribute('data-nobf', '');
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle-rt]');
    if (b) setRT(!root.hasAttribute('data-rt'));
  });

  /* --- segmented controls and tab bars: one selected item per group ------ */
  document.addEventListener('click', function (e) {
    var item = e.target.closest('[data-select-group] > button:not([data-set-theme])');
    if (!item) return;
    var group = item.parentElement;
    var mode = group.getAttribute('data-select-group');   /* "selected" or "current" */
    group.querySelectorAll(':scope > button').forEach(function (b) {
      var on = b === item;
      if (mode === 'current') {
        if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      } else {
        b.setAttribute('aria-selected', String(on));
      }
    });
  });

  /* --- switches and toggle buttons -------------------------------------- */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[role="switch"]');
    if (sw) sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'));
    var tg = e.target.closest('[data-toggle]');
    if (tg) tg.setAttribute('aria-pressed', String(tg.getAttribute('aria-pressed') !== 'true'));
  });

  /* --- glass sliders: expose the value to CSS --------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.slider input[type="range"]').forEach(function (input) {
      function sync() { input.parentElement.style.setProperty('--v', input.value); }
      input.addEventListener('input', sync);
      sync();
    });
  });
})();
