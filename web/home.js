/*
 * The home screen for web-app TVs (LG webOS, Samsung Tizen), with the Android app's design and behavior (HomeView):
 *  - top: the "For You" title and the tabs (Explore, Movies, Shows); icon-only glass buttons at the right (Live TV,
 *    HDMI Inputs, Settings) and the crypto quotes at the end of the tab row;
 *  - three picks for this hour in the selected tab; the background is the first one's photo, blurred and almost white;
 *  - the glass shelf with the apps; ↓ opens the drawer (inputs, shortcuts, weather, prices); ↑ or Back closes it;
 *  - a night look from sunset to sunrise; a screensaver after a few idle minutes.
 * The remote's arrows, OK and Back move the focus; a pointer (LG's Magic Remote) focuses what it points at.
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function sym(name, parent, size) {
    var s = el('span', 'sym', parent);
    s.style.webkitMaskImage = 'url(symbols/' + name + '.png)';
    s.style.maskImage = 'url(symbols/' + name + '.png)';
    if (size) { s.style.width = size + 'px'; s.style.height = size + 'px'; }
    return s;
  }

  function coin(i, parent) {
    var c = window.COINS && window.COINS[i];
    if (!c) return;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    for (var k = 0; k < c.length; k++) {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', c[k]);
      p.setAttribute('fill-rule', 'evenodd');
      svg.appendChild(p);
    }
    parent.appendChild(svg);
  }

  function hasClass(e, c) { return (' ' + e.className + ' ').indexOf(' ' + c + ' ') >= 0; }
  function setClass(e, c, on) {
    if (!e) return;
    if (on && !hasClass(e, c)) e.className = (e.className + ' ' + c).replace(/^\s+/, '');
    else if (!on && hasClass(e, c)) e.className = (' ' + e.className + ' ').replace(' ' + c + ' ', ' ').replace(/^\s+|\s+$/g, '');
  }

  var stage = $('stage'), body = document.body;

  /** The 1920 × 1080 stage fills the window (on the TV it already is 1920 × 1080). */
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.webkitTransform = stage.style.transform = s === 1 ? '' : 'scale(' + s + ')';
  }

  // MARK: - Apps on the shelf

  /** Shelf apps in this order when installed, like the Android app: key, LG app id, name on the TV, brand gradient. */
  var SHELF = [
    // miguel-custom: Apple TV moved to the far left of the dock.
    ['appletv', /appletv|apple\.tv/, /apple tv/i, ['#1C1C1E', '#000000']],
    ['netflix', /^netflix$/, /netflix/i, ['#0A0A0A', '#000000']],
    ['youtube', /youtube/, /^youtube$/i, ['#1C1C1E', '#09090A']],
    // miguel-custom: the Vodafone box on HDMI 1 (an input, not an app: see EXTRA_TILES), right after YouTube.
    ['vodafone', /^source:HDMI:1$/, /^vodafone tv$/i, ['#E60000', '#A30000']],
    ['prime', /^amazon$/, /prime video|amazon/i, ['#2AA8FF', '#0A68D4']],
    ['disney', /disney/, /disney/i, ['#173584', '#08143F']],
    ['max', /hbo|wbd/, /^(hbo )?max$|hbo max/i, ['#5C30E8', '#221684']],
    ['hulu', /^hulu/, /hulu/i, ['#1CE783', '#0B8F4E']],
    ['paramount', /paramount|cbs/, /paramount/i, ['#0064FF', '#002A86']],
    ['peacock', /peacock/, /peacock/i, ['#1C1C1E', '#000000']],
    ['nfl', /nfl/, /^nfl/i, ['#013369', '#00163D']],
    ['globoplay', /globoplay/, /globoplay/i, ['#FF8A1F', '#FF2D5A']],
    // miguel-custom: the IPTV app (SmartOne IPTV Player on the living-room TV), just before Spotify.
    ['iptv', /^p9WC6wWKA1\.SmartOne$/, /^iptv$/i, ['#3A3A40', '#161618']],
    ['spotify', /spotify/, /spotify/i, ['#1DB954', '#0F7A36']]
  ];
  var MAX_SHELF = 8;
  // miguel-custom: shelf keys left out of the default dock (their brand colors still apply elsewhere).
  var SHELF_SKIP = {netflix: true};
  // miguel-custom: dock tiles that aren't installed apps. TV.launch switches sources for 'source:' ids (as the drawer's
  // HDMI keys do); Samsung only, as that's the id format tv.js uses there.
  var VODAFONE = 'source:HDMI:1';
  var EXTRA_TILES = [{id: VODAFONE, title: 'Vodafone TV', icon: '', color: '#E60000'}];

  function shelfKey(app) {
    for (var i = 0; i < SHELF.length; i++) if (SHELF[i][1].test(app.id) || SHELF[i][2].test(app.title)) return SHELF[i];
    return null;
  }

  function darken(hex, f) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#161618';
    var n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + Math.round(r * f) + ',' + Math.round(g * f) + ',' + Math.round(b * f) + ')';
  }

  /** A name that fits the tile on one line (the font shrinks for long names). */
  function wordFit(title, width, max) {
    return Math.max(18, Math.min(max, Math.floor(width * 0.8 / (Math.max(4, title.length) * 0.56))));
  }

  /** An app's face: its own icon on its brand color (or its name, when the icon can't be read). */
  function face(app, box, wordSize) {
    var k = shelfKey(app);
    var top = k ? k[3][0] : app.color ? darken(app.color, 0.92) : '#2A2A2E';
    var bottom = k ? k[3][1] : app.color ? darken(app.color, 0.62) : '#161618';
    box.style.background = '-webkit-linear-gradient(top, ' + top + ', ' + bottom + ')';
    box.style.background = 'linear-gradient(' + top + ', ' + bottom + ')';
    var word = el('div', 'word', box, app.title);
    if (wordSize) word.style.fontSize = wordSize + 'px';
    if (app.icon) {
      var img = el('img', '', box);
      word.style.visibility = 'hidden';
      img.onerror = function () { img.parentNode.removeChild(img); word.style.visibility = ''; };
      img.src = app.icon;
    }
  }

  var apps = [], shelf = [], others = [], inputs = [];

  function pickShelf() {
    var chosen = Prefs.shelf(), out = [];
    // miguel-custom: a dock order saved before the Vodafone tile existed gets it once, after YouTube (still removable).
    var flag = 'fmtv.miguel.vodafone', seen = '1';
    try { seen = localStorage.getItem(flag); localStorage.setItem(flag, '1'); } catch (e) {}
    if (chosen && !seen && TV.name === 'tizen' && chosen.indexOf(VODAFONE) < 0) {
      var yt = -1;
      for (var k = 0; k < chosen.length; k++) if (/youtube/i.test(chosen[k])) yt = k;
      chosen = chosen.slice();
      chosen.splice(yt < 0 ? chosen.length : yt + 1, 0, VODAFONE);
      Prefs.set('shelf', chosen);
    }
    if (chosen) {
      for (var i = 0; i < chosen.length && out.length < MAX_SHELF; i++) {
        for (var j = 0; j < apps.length; j++) if (apps[j].id === chosen[i]) out.push(apps[j]);
      }
    } else {
      for (var s = 0; s < SHELF.length && out.length < MAX_SHELF; s++) {
        if (SHELF_SKIP[SHELF[s][0]]) continue;   // miguel-custom
        for (var a = 0; a < apps.length; a++) {
          if ((SHELF[s][1].test(apps[a].id) || SHELF[s][2].test(apps[a].title)) && out.indexOf(apps[a]) < 0) { out.push(apps[a]); break; }
        }
      }
      if (!out.length) out = apps.slice(0, MAX_SHELF);
    }
    shelf = out;
    others = apps.filter(function (x) { return shelf.indexOf(x) < 0; });
  }

  // MARK: - Focus

  var Z = {TOP: 'top', CARDS: 'cards', SHELF: 'shelf', DRAWER: 'drawer', APPS: 'apps', SETTINGS: 'settings', EDIT: 'edit', GALLERY: 'gallery', THEMES: 'themes'};   // miguel-custom: GALLERY, THEMES
  var st = {zone: Z.SHELF, top: 0, tab: 0, card: 0, shelf: 0, drawer: 0, grid: 0, row: 0, edit: 0, theme: 0};   // miguel-custom: theme
  var cards = [];

  function sheetOpen() { return st.zone === Z.APPS || st.zone === Z.SETTINGS || st.zone === Z.EDIT || st.zone === Z.THEMES; }   // miguel-custom: THEMES

  function updateFocus() {
    var i, list;
    list = $('tabs').children;
    for (i = 0; i < list.length; i++) {
      setClass(list[i], 'on', i === st.tab);
      setClass(list[i], 'focus', st.zone === Z.TOP && st.top === i);
    }
    list = $('buttons').children;
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.TOP && st.top === 3 + i);
    setClass($('quotes'), 'hide', st.zone === Z.TOP && st.top >= 3);
    list = $('cards').children;
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.CARDS && st.card === i);
    list = $('tiles').children;
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.SHELF && st.shelf === i);
    list = document.querySelectorAll('#drawer .key');
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.DRAWER && st.drawer === i);
    list = document.querySelectorAll('#apps .cell');
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.APPS && st.grid === i);
    var rows = Math.max(1, Math.ceil(others.length / 5)), r = Math.floor(st.grid / 5), first = Math.max(0, Math.min(rows - 3, r - 1));
    $('apps').lastChild.style.webkitTransform = $('apps').lastChild.style.transform = 'translateY(' + (-first * 239) + 'px)';
    focusRows($('settings'), st.row, st.zone === Z.SETTINGS);
    focusRows($('shelfedit'), st.edit, st.zone === Z.EDIT);
    list = document.querySelectorAll('#themes .tcard');   // miguel-custom
    for (i = 0; i < list.length; i++) setClass(list[i], 'focus', st.zone === Z.THEMES && st.theme === i);
    setClass(body, 'drawer-open', st.zone === Z.DRAWER || st.zone === Z.GALLERY);   // miguel-custom: the gallery opens over the drawer
  }

  function focusRows(sheet, index, on) {
    var rows = sheet.querySelectorAll('.row');
    for (var i = 0; i < rows.length; i++) setClass(rows[i], 'focus', on && i === index);
    var holder = sheet.querySelector('.rows');
    if (!holder) return;
    var visible = 7, first = Math.max(0, Math.min(rows.length - visible, index - 3));
    holder.style.webkitTransform = holder.style.transform = 'translateY(' + (-first * 78) + 'px)';
  }

  function nearest(nodes, x) {
    var best = 0, bestD = 1e9;
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect(), d = Math.abs((r.left + r.right) / 2 - x);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function centerX(node) {
    if (!node) return 960;
    var r = node.getBoundingClientRect();
    return (r.left + r.right) / 2;
  }

  // MARK: - Top: title, tabs, buttons, quotes

  var TAB_KIND = [null, 'movie', 'tv'];

  function renderTop() {
    $('title').textContent = tr('Olá Helena e Miguel', 'For You', 'Para ti');   // miguel-custom: greeting instead of "Para você"
    // miguel-custom: no Explorar / Filmes / Séries tabs (nor their picks): the top row is only the round buttons (3-5).
    $('tabs').innerHTML = '';
    var buttons = $('buttons');
    buttons.innerHTML = '';
    // miguel-custom: a Temas (palette) button before Ajustes: the theme picker.
    var defs = [['live_tv', tr('TV aberta', 'Live TV', 'TV en vivo')], ['hdmi', tr('Entradas HDMI', 'HDMI Inputs', 'Entradas HDMI')],
      ['palette', tr('Temas', 'Themes', 'Temas')], ['settings', tr('Ajustes', 'Settings', 'Ajustes')]];
    for (var b = 0; b < defs.length; b++) {
      var r = el('button', 'round' + (b === defs.length - 1 ? ' last' : ''), buttons);
      r.style.left = (1772 - 88 * (defs.length - 1 - b)) + 'px';
      sym(defs[b][0], r);
      el('div', 'tip', r, defs[b][1]);
      hover(r, Z.TOP, 3 + b);
    }
  }

  function renderQuotes() {
    var q = $('quotes'), coins = Data.activeCoins();
    q.innerHTML = '';
    for (var i = 0; i < coins.length; i++) {
      var item = el('span', 'q', q);
      coin(coins[i], item);
      el('span', '', item, Data.compact(Data.prices[coins[i]]));
    }
  }

  // MARK: - Picks and background

  function renderCards() {
    var list = [];   // miguel-custom: no picks on the home; the big clock and date (.no-picks) take their place
    var holder = $('cards');
    setClass(body, 'no-picks', !list.length);
    var same = list.length === cards.length;
    for (var i = 0; same && i < list.length; i++) same = list[i].id === cards[i].id && list[i].backdrop === cards[i].backdrop && list[i].meta === cards[i].meta;
    if (same && holder.children.length === list.length) return;
    cards = list;
    holder.innerHTML = '';
    var rects = [[80, 1040], [1160, 320], [1520, 320]];
    for (var c = 0; c < list.length; c++) {
      var p = list[c], card = el('div', 'card', holder);
      card.style.left = rects[c][0] + 'px';
      card.style.width = rects[c][1] + 'px';
      var img = el('div', 'img', card);
      img.style.backgroundImage = 'url(' + Data.image(p.backdrop, c === 0 ? 'w1280' : 'w780') + ')';
      el('div', 'name', card, p.title);
      if (c === 0 && p.meta) el('div', 'meta', card, p.meta);
      hover(card, Z.CARDS, c);
    }
    st.card = Math.min(st.card, Math.max(0, list.length - 1));
    if (!list.length && st.zone === Z.CARDS) st.zone = Z.SHELF;
    backdrop(list.length ? Data.image(list[0].backdrop, 'w300') : '');
    updateFocus();
  }

  var bgUrl = null, bgFront = 'bgA';

  /** The first pick's photo as the background: drawn tiny and stretched, it's already as soft as a heavy blur. */
  function backdrop(url) {
    if (url === bgUrl) return;
    bgUrl = url;
    var next = bgFront === 'bgA' ? 'bgB' : 'bgA';
    if (!url) {
      setClass($('bgA'), 'on', false);
      setClass($('bgB'), 'on', false);
      return;
    }
    var img = new Image();
    img.onload = function () {
      if (bgUrl !== url) return;
      var canvas = $(next), ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setClass(canvas, 'on', true);
      setClass($(bgFront), 'on', false);
      bgFront = next;
    };
    img.src = url;
  }

  function renderClock() {
    var d = new Date(), c = $('clock');
    c.firstChild.textContent = Data.time(d.getTime());
    try {
      c.lastChild.textContent = d.toLocaleDateString(I18N.locale(), {weekday: 'long', day: 'numeric', month: 'long'});
    } catch (e) {
      c.lastChild.textContent = d.toDateString();
    }
  }

  // MARK: - Shelf

  function renderShelf() {
    var n = shelf.length, gap = 48, pad = 40;
    // 16:9 tiles, as on Android: never taller than 126, and the glass keeps its bottom edge.
    var tw = Math.min(126 * 16 / 9, (1760 - Math.max(0, n - 1) * gap) / Math.max(1, n)), th = tw * 9 / 16;
    var width = n * tw + Math.max(0, n - 1) * gap, left = (1920 - width) / 2;
    var platter = $('platter');
    platter.style.display = n ? '' : 'none';
    platter.style.left = (left - pad) + 'px';
    platter.style.width = (width + 2 * pad) + 'px';
    platter.style.top = (814 + 126 - th) + 'px';
    platter.style.height = (th + 2 * pad) + 'px';
    $('quotes').style.right = (1920 - left - width) + 'px';
    var tiles = $('tiles');
    tiles.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var t = el('div', 'tile', tiles);
      t.style.left = (left + i * (tw + gap)) + 'px';
      t.style.top = (854 + 126 - th) + 'px';
      t.style.width = tw + 'px';
      t.style.height = th + 'px';
      face(shelf[i], t, wordFit(shelf[i].title, tw, 30));
      hover(t, Z.SHELF, i);
    }
    st.shelf = Math.min(st.shelf, Math.max(0, n - 1));
  }

  // MARK: - Drawer

  var drawerItems = [], drawerInputs = 0;

  function renderDrawer() {
    var d = $('drawer');
    d.innerHTML = '';
    drawerItems = [];
    for (var i = 0; i < inputs.length; i++) {
      var x = inputs[i];
      drawerItems.push({label: x.label || tr('TV aberta', 'Live TV', 'TV en vivo'), symbol: x.symbol, off: !x.connected, run: launcher(x.id, x.label)});
    }
    drawerInputs = drawerItems.length;
    drawerItems.push({label: tr('Todos os Apps', 'All Apps', 'Todas las apps'), symbol: 'apps', run: openApps});
    drawerItems.push({label: tr('Ajustes do Início', 'Home Settings', 'Ajustes de inicio'), symbol: 'settings', run: openSettings});
    drawerItems.push({label: tr('Ajustes da TV', 'TV Settings', 'Ajustes del TV'), symbol: 'tv_settings', run: tvSettings});
    var n = drawerItems.length, gap = 18, groupGap = 56, groups = drawerInputs > 0 && drawerInputs < n ? 2 : 1;
    var tw = Math.min(230, (1760 - Math.max(0, n - groups) * gap - (groups - 1) * groupGap) / Math.max(1, n));
    var xPos = 80;
    for (var k = 0; k < n; k++) {
      if (k === drawerInputs && k > 0) {
        xPos += groupGap - gap;
        el('div', 'row-title', d, tr('Atalhos', 'Shortcuts', 'Accesos directos')).style.left = (xPos + 4) + 'px';
      }
      if (k === 0 && drawerInputs) el('div', 'row-title', d, tr('Entradas', 'Inputs', 'Entradas')).style.left = '84px';
      var item = drawerItems[k], key = el('div', 'key glass' + (item.off ? ' off' : ''), d);
      key.style.left = xPos + 'px';
      key.style.width = tw + 'px';
      sym(item.symbol, key);
      el('div', 'label', key, item.label);
      hover(key, Z.DRAWER, k);
      xPos += tw + gap;
    }
    renderPanels();
    updateFocus();
  }

  function renderPanels() {
    var d = $('drawer');
    var old = d.querySelectorAll('.panel');
    for (var o = 0; o < old.length; o++) d.removeChild(old[o]);
    var wx = Prefs.weather(), coins = Data.activeCoins(), qt = coins.length > 0;
    var split = 80 + 1760 * 0.585;
    if (wx) {
      var w = el('div', 'panel glass', d);
      w.id = 'weather';
      w.style.left = '80px';
      w.style.width = ((qt ? split - 16 : 1840) - 80) + 'px';
      renderWeather(w);
    }
    if (qt) {
      var q = el('div', 'panel glass', d);
      q.id = 'prices';
      var left = wx ? split + 16 : 80;
      q.style.left = left + 'px';
      q.style.width = (1840 - left) + 'px';
      renderPrices(q, coins);
    }
  }

  function renderWeather(card) {
    el('div', 'head', card, Data.city || tr('Clima', 'Weather', 'Clima'));
    var w = Data.weather;
    if (!w) {
      el('div', 'cond', card, tr('Sem dados do clima agora.', 'No weather data right now.', 'No hay datos del clima ahora.')).style.top = '96px';
      return;
    }
    var now = el('div', 'now', card);
    sym(Data.symbol(w.code, w.isDay), now);
    el('span', 'temp', now, Data.degrees(w.temp));
    el('div', 'cond', card, Data.condition(w.code, w.isDay));
    el('div', 'range', card, I18N.lang === 'ru' ? 'Макс. ' + Data.degrees(w.max) + '   Мин. ' + Data.degrees(w.min) : tr('Máx. ' + Data.degrees(w.max) + '   Mín. ' + Data.degrees(w.min), 'H:' + Data.degrees(w.max) + '   L:' + Data.degrees(w.min),
        'Máx. ' + Data.degrees(w.max) + '   Mín. ' + Data.degrees(w.min)));
    el('div', 'split', card);
    var hours = el('div', 'hours', card), width = parseFloat(card.style.width) - 30 - 422, hw = width / 6;
    for (var i = 0; i < w.hours.length && i < 6; i++) {
      var h = el('div', 'hour', hours), x = w.hours[i];
      h.style.left = (hw * i) + 'px';
      h.style.width = hw + 'px';
      el('div', 't', h, Data.hour(x.at));
      sym(Data.symbol(x.code, x.day), h);
      el('div', 'd', h, Data.degrees(x.temp));
    }
    var sun = el('div', 'sun', card);
    if (w.sunrise) { var a = el('span', '', sun); sym('sunrise', a); a.appendChild(document.createTextNode(tr('Nascer ', 'Sunrise ', 'Amanecer ') + Data.time(w.sunrise))); }
    if (w.sunset) { var b = el('span', '', sun); sym('sunset', b); b.appendChild(document.createTextNode(tr('Pôr do sol ', 'Sunset ', 'Atardecer ') + Data.time(w.sunset))); }
  }

  function renderPrices(card, coins) {
    el('div', 'head', card, tr('Cotações', 'Crypto', 'Cripto'));
    var stale = Data.staleness(Data.pricesAt, 5 * 60000);
    el('div', 'side', card, stale || tr('variação em 24 h', '24h change', 'variación en 24 h'));
    for (var j = 0; j < coins.length; j++) {
      var i = coins[j], row = el('div', 'coin', card);
      row.style.top = (86 + 52 * j) + 'px';
      coin(i, row);
      el('span', 'n', row, Data.coinName(i));
      el('span', 'p', row, Data.money(Data.prices[i]));
      var ch = Data.changes[i];
      if (!isNaN(ch)) el('span', 'c ' + (ch >= 0 ? 'up' : 'down'), row, Data.change(ch));
    }
  }

  function openDrawer() {
    if (!drawerItems.length) return;
    var tiles = $('tiles').children;
    st.zone = Z.DRAWER;
    st.drawer = Math.min(drawerItems.length - 1, nearest(document.querySelectorAll('#drawer .key'), centerX(tiles[st.shelf])));
    updateFocus();
  }

  function closeDrawer() {
    var keys = document.querySelectorAll('#drawer .key');
    st.zone = Z.SHELF;
    if (shelf.length) st.shelf = nearest($('tiles').children, centerX(keys[st.drawer]));
    updateFocus();
  }

  // MARK: - All Apps

  function renderApps() {
    var sheet = $('apps');
    sheet.firstChild.textContent = tr('Todos os Apps', 'All Apps', 'Todas las apps');
    var grid = sheet.lastChild;
    grid.innerHTML = '';
    for (var i = 0; i < others.length; i++) {
      var r = Math.floor(i / 5), c = i % 5, cell = el('div', 'cell', grid);
      cell.style.left = (130 + c * 340) + 'px';
      cell.style.top = (196 + r * 239) + 'px';
      face(others[i], el('div', 'face', cell), wordFit(others[i].title, 300, 34));
      el('div', 'label', cell, others[i].title);
      hover(cell, Z.APPS, i);
    }
  }

  function openApps() {
    renderApps();
    st.zone = Z.APPS;
    st.grid = 0;
    setClass($('apps'), 'open', true);
    updateFocus();
  }

  function closeSheets() {
    if (st.zone === Z.THEMES) { st.zone = Z.SHELF; hideThemes(); }   // miguel-custom: the picker, cancelled
    setClass($('apps'), 'open', false);
    setClass($('settings'), 'open', false);
    setClass($('shelfedit'), 'open', false);
    st.zone = Z.SHELF;
    updateFocus();
  }

  // MARK: - Home Settings

  function settingRows() {
    var lang = Prefs.language(), unit = Prefs.temperature(), theme = Prefs.theme();
    var auto = tr('Automático', 'Automatic', 'Automático'), on = tr('Ligado', 'On', 'Activado'), off = tr('Desligado', 'Off', 'Desactivado');
    var rows = [
      {label: tr('Idioma', 'Language', 'Idioma'), value: lang === 'ru' ? 'Русский' : lang === 'de' ? 'Deutsch' : lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : lang === 'es' ? 'Español' : auto,
        step: function (d) { cycle('language', ['auto', 'de', 'en', 'es', 'pt', 'ru'], lang, d); I18N.set(Prefs.language()); renderAll(); }},
      {label: tr('Temperatura', 'Temperature', 'Temperatura'), value: unit === 'C' ? '°C' : unit === 'F' ? '°F' : auto,
        step: function (d) { cycle('temperature', ['auto', 'C', 'F'], unit, d); renderPanels(); }},
      // miguel-custom: the Omarchy themes first, then the original looks.
      {label: tr('Tema', 'Theme', 'Tema'), value: omarchy(theme) ? omarchy(theme).name : theme === 'light' ? tr('Claro', 'Light', 'Claro') : theme === 'dark' ? tr('Escuro', 'Dark', 'Oscuro') : auto,
        step: function () { openThemes(true); }},   // miguel-custom: the theme picker
      {label: tr('Widget do clima', 'Weather widget', 'Widget del clima'), toggle: Prefs.weather(),
        step: function () { Prefs.set('weather', !Prefs.weather()); renderPanels(); }},
      {label: tr('Widget de cotações', 'Quotes widget', 'Widget de cotizaciones'), toggle: Prefs.quotes(),
        step: function () { Prefs.set('quotes', !Prefs.quotes()); Data.settingsChanged(); }}
    ];
    var names = ['Bitcoin', 'Ethereum', 'Solana', tr('Dólar', 'Dollar', 'Dólar')];
    var count = Data.currency === 'BRL' ? 4 : 3;
    for (var i = 0; i < count; i++) {
      (function (i) {
        rows.push({label: names[i], toggle: Prefs.quotes() && Prefs.coin(i), dim: !Prefs.quotes(),
          step: function () { if (Prefs.quotes()) { Prefs.setCoin(i, !Prefs.coin(i)); Data.settingsChanged(); } }});
      })(i);
    }
    rows.push({label: tr('Prateleira', 'Shelf', 'Estante'), value: '›', step: function (d) { if (d >= 0) openShelfEdit(); }});
    rows.push({label: tr('Ajustes da TV', 'TV Settings', 'Ajustes del TV'), value: '›', step: function (d) { if (d >= 0) tvSettings(); }});
    return rows;
  }

  function cycle(name, values, current, d) {
    var i = values.indexOf(current);
    Prefs.set(name, values[(i + (d || 1) + values.length) % values.length]);
  }

  var rowsNow = [];

  function renderSettings() {
    var box = $('settings').firstChild;
    box.innerHTML = '';
    var title = el('div', 'title', box);
    sym('settings', title);
    title.appendChild(document.createTextNode(tr('Ajustes do Início', 'Home Settings', 'Ajustes de inicio')));
    var list = el('div', 'list', box), holder = el('div', 'rows', list);
    rowsNow = settingRows();
    list.style.height = Math.min(rowsNow.length, 7) * 78 + 'px';
    for (var i = 0; i < rowsNow.length; i++) {
      var r = rowsNow[i], row = el('div', 'row' + (r.dim ? ' dim' : ''), holder, r.label);
      if (r.toggle !== undefined) setClass(el('div', 'toggle', row), 'on', r.toggle);
      else {
        var v = el('span', 'value', row);
        if (r.value === '›') v.textContent = '›';
        else { el('span', 'chev', v, '‹'); v.appendChild(document.createTextNode(r.value)); el('span', 'chev', v, '›'); }
      }
      hover(row, Z.SETTINGS, i);
    }
    el('div', 'hint', box, tr('OK ou as setas mudam o valor.', 'OK or the arrows change the value.', 'OK o las flechas cambian el valor.'));
    updateFocus();
  }

  function openSettings() {
    st.zone = Z.SETTINGS;
    st.row = 0;
    renderSettings();
    setClass($('settings'), 'open', true);
    updateFocus();
  }

  // MARK: - Shelf editor: which apps, in what order

  function ordinal(n) {
    if (I18N.lang === 'ru') return n + '-е';
    if (I18N.lang === 'de') return n + '.';
    if (I18N.lang !== 'en') return n + 'º';
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function editList() {
    var ids = shelf.map(function (a) { return a.id; });
    return {ids: ids, rows: apps.slice().sort(function (a, b) {
      var ia = ids.indexOf(a.id), ib = ids.indexOf(b.id);
      if (ia >= 0 || ib >= 0) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    })};
  }

  function renderShelfEdit() {
    var box = $('shelfedit').firstChild, e = editList();
    box.innerHTML = '';
    var title = el('div', 'title', box);
    sym('apps', title);
    title.appendChild(document.createTextNode(tr('Prateleira', 'Shelf', 'Estante')));
    var list = el('div', 'list', box), holder = el('div', 'rows', list);
    list.style.height = Math.min(e.rows.length, 7) * 78 + 'px';
    for (var i = 0; i < e.rows.length; i++) {
      var a = e.rows[i], at = e.ids.indexOf(a.id), row = el('div', 'row', holder, a.title);
      el('span', 'value', row, at >= 0 ? tr('Na prateleira · ', 'On · ', 'En el estante · ') + ordinal(at + 1) : tr('Fora', 'Off', 'Fuera'));
      hover(row, Z.EDIT, i);
    }
    el('div', 'hint', box, tr('OK põe ou tira · ← → mudam a ordem', 'OK adds or removes · ← → change the order', 'OK pone o quita · ← → cambian el orden'));
    updateFocus();
  }

  function openShelfEdit() {
    setClass($('settings'), 'open', false);
    st.zone = Z.EDIT;
    st.edit = 0;
    renderShelfEdit();
    setClass($('shelfedit'), 'open', true);
    updateFocus();
  }

  function editShelf(dx) {
    var e = editList(), app = e.rows[st.edit];
    if (!app) return;
    var ids = e.ids.slice(), at = ids.indexOf(app.id);
    if (dx === 0) {
      if (at >= 0) ids.splice(at, 1);
      else if (ids.length < MAX_SHELF) ids.push(app.id);
      else { toast(tr('A prateleira cabe até ' + MAX_SHELF + ' apps.', 'The shelf holds up to ' + MAX_SHELF + ' apps.', 'El estante tiene hasta ' + MAX_SHELF + ' apps.')); return; }
    } else {
      if (at < 0) return;
      var to = Math.max(0, Math.min(ids.length - 1, at + dx));
      ids.splice(at, 1);
      ids.splice(to, 0, app.id);
    }
    Prefs.set('shelf', ids);
    pickShelf();
    renderShelf();
    var again = editList();
    for (var i = 0; i < again.rows.length; i++) if (again.rows[i].id === app.id) st.edit = i;
    renderShelfEdit();
  }

  // MARK: - Opening things

  function launcher(id, name) {
    return function () {
      TV.launch(id, null, function (ok) {
        if (!ok) toast(tr('Não deu para abrir ', "Couldn't open ", 'No se pudo abrir ') + (name || id));
      });
    };
  }

  function tvSettings() {
    TV.settings(function (ok) {
      if (!ok) toast(tr('Não deu para abrir os Ajustes da TV', "Couldn't open TV Settings", 'No se pudieron abrir los Ajustes del TV'));
    });
  }

  function liveTV() {
    for (var i = 0; i < inputs.length; i++) if (inputs[i].key === 'live') return inputs[i];
    return null;
  }

  function activate() {
    switch (st.zone) {
      case Z.TOP:
        if (st.top < 3) return;
        if (st.top === 3) { var live = liveTV(); if (live) launcher(live.id, tr('TV aberta', 'Live TV', 'TV en vivo'))(); }
        else if (st.top === 4) { st.zone = Z.SHELF; openDrawer(); st.drawer = 1 < drawerInputs ? 1 : 0; updateFocus(); }
        else if (st.top === 5) openThemes(false);   // miguel-custom: the palette button
        else openSettings();
        return;
      case Z.CARDS:
        var p = cards[st.card], app = p && Data.appFor(p.app);
        if (app) launcher(app.id, app.title)();
        return;
      case Z.SHELF:
        if (shelf[st.shelf]) launcher(shelf[st.shelf].id, shelf[st.shelf].title)();
        return;
      case Z.DRAWER:
        if (drawerItems[st.drawer]) drawerItems[st.drawer].run();
        return;
      case Z.APPS:
        if (others[st.grid]) launcher(others[st.grid].id, others[st.grid].title)();
        return;
      case Z.SETTINGS:
        if (rowsNow[st.row]) { rowsNow[st.row].step(1); if (st.zone === Z.SETTINGS) renderSettings(); }
        return;
      case Z.EDIT:
        editShelf(0);
        return;
      case Z.THEMES:   // miguel-custom
        closeThemes(true);
        return;
    }
  }

  function selectTab(i) {
    if (i === st.tab) return;
    st.tab = i;
    renderCards();
  }

  function move(dx, dy) {
    var tiles = $('tiles').children, cardNodes = $('cards').children;
    switch (st.zone) {
      case Z.SHELF:
        if (dx) st.shelf = Math.max(0, Math.min(shelf.length - 1, st.shelf + dx));
        else if (dy > 0) { openDrawer(); return; }
        else if (dy < 0) {
          if (cards.length) { st.zone = Z.CARDS; st.card = nearest(cardNodes, centerX(tiles[st.shelf])); }
          else { st.zone = Z.TOP; st.top = 3; }   // miguel-custom: the first round button (no tabs)
        }
        break;
      case Z.CARDS:
        if (dx) st.card = Math.max(0, Math.min(cards.length - 1, st.card + dx));
        else if (dy < 0) { st.zone = Z.TOP; st.top = st.tab; }
        else if (shelf.length) { st.zone = Z.SHELF; st.shelf = nearest(tiles, centerX(cardNodes[st.card])); }
        break;
      case Z.TOP:
        if (dx) {
          st.top = Math.max(3, Math.min(6, st.top + dx));   // miguel-custom: 3 (no tabs), was 0; 6 (the palette button)
          if (st.top < 3) selectTab(st.top);   // as on Apple TV: focusing a tab selects it
        } else if (dy > 0) {
          if (cards.length) { st.zone = Z.CARDS; st.card = Math.min(cards.length - 1, st.top < 3 ? 0 : cards.length - 1); }
          else st.zone = Z.SHELF;
        }
        break;
      case Z.DRAWER:
        if (dx) st.drawer = Math.max(0, Math.min(drawerItems.length - 1, st.drawer + dx));
        else if (dy < 0) { closeDrawer(); return; }
        else if (dy > 0) { openGallery(); return; }   // miguel-custom: ↓ again: the wallpaper gallery
        break;
      case Z.GALLERY:   // miguel-custom: ← → browse, ↑ returns to the drawer
        if (dx) showWall(dx);
        else if (dy < 0) closeGallery();
        return;
      case Z.APPS:
        var g = st.grid + dx + dy * 5;
        if (g >= 0 && g < others.length && (dx === 0 || Math.floor(g / 5) === Math.floor(st.grid / 5))) st.grid = g;
        break;
      case Z.SETTINGS:
        if (dy) st.row = Math.max(0, Math.min(rowsNow.length - 1, st.row + dy));
        else if (dx && rowsNow[st.row]) {
          var r = rowsNow[st.row];
          if (r.value !== '›') { r.step(dx); renderSettings(); }
        }
        break;
      case Z.EDIT:
        if (dy) st.edit = Math.max(0, Math.min(apps.length - 1, st.edit + dy));
        else if (dx) editShelf(dx);
        break;
      case Z.THEMES:   // miguel-custom: the grid, no wrapping; ↓ on the next-to-last row reaches the last card
        var n = themeChoices().length, to = st.theme + dx + dy * THEME_COLS;
        if (dx && Math.floor(to / THEME_COLS) !== Math.floor(st.theme / THEME_COLS)) to = st.theme;
        if (dy > 0 && to >= n && Math.floor(st.theme / THEME_COLS) < Math.floor((n - 1) / THEME_COLS)) to = n - 1;
        if (to >= 0 && to < n && to !== st.theme) { st.theme = to; previewTheme(); }
        break;
    }
    updateFocus();
  }

  function back() {
    if (st.zone === Z.GALLERY) { closeGallery(); return; }   // miguel-custom
    if (st.zone === Z.THEMES) { closeThemes(false); return; }   // miguel-custom: cancel
    if (st.zone === Z.EDIT) { setClass($('shelfedit'), 'open', false); openSettings(); st.row = rowsNow.length - 2; updateFocus(); return; }
    if (sheetOpen()) { closeSheets(); return; }
    if (st.zone === Z.DRAWER) { closeDrawer(); return; }
    if (st.zone !== Z.SHELF && shelf.length) { st.zone = Z.SHELF; updateFocus(); return; }
    TV.back();
  }

  /** The pointer focuses what it's over (the Magic Remote, or a mouse when previewing). */
  function hover(node, zone, index) {
    node.onmouseover = function () {
      if (saverOn || st.zone === Z.GALLERY || (sheetOpen() !== (zone === Z.APPS || zone === Z.SETTINGS || zone === Z.EDIT || zone === Z.THEMES))) return;   // miguel-custom: not under the gallery
      if (zone === Z.DRAWER && st.zone !== Z.DRAWER) return;
      if (zone !== Z.DRAWER && st.zone === Z.DRAWER && zone !== Z.SHELF) return;
      if (zone === Z.SHELF && st.zone === Z.DRAWER) closeDrawer();
      st.zone = zone;
      if (zone === Z.TOP) { st.top = index; if (index < 3) selectTab(index); }
      else if (zone === Z.CARDS) st.card = index;
      else if (zone === Z.SHELF) st.shelf = index;
      else if (zone === Z.DRAWER) st.drawer = index;
      else if (zone === Z.APPS) st.grid = index;
      else if (zone === Z.SETTINGS) st.row = index;
      else if (zone === Z.EDIT) st.edit = index;
      else if (zone === Z.THEMES && st.theme !== index) { st.theme = index; previewTheme(); }   // miguel-custom
      updateFocus();
    };
    node.onclick = function () { node.onmouseover(); activate(); };
  }

  // MARK: - Toast

  var toastTimer = 0;
  function toast(text) {
    var t = $('toast');
    t.textContent = text;
    setClass(t, 'on', true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { setClass(t, 'on', false); }, 6000);
  }

  // MARK: - Night, clock, screensaver

  function checkNight() {
    if (st.zone === Z.THEMES) return;   // miguel-custom: the picker is previewing a theme
    setClass(body, 'night', Data.isNight(Date.now()));
    applyTheme(Prefs.theme());   // miguel-custom
  }

  // MARK: - Omarchy themes (miguel-custom): web/themes.js; the palette goes into home.css's variables on <body>.

  function omarchy(id) {
    var list = window.OMARCHY || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  var themeShown = null;

  function applyTheme(id) {
    if (id === themeShown) return;
    themeShown = id;
    var t = omarchy(id);
    setClass(body, 'omarchy', !!t);
    setClass(body, 'omarchy-light', !!t && t.mode === 'light');
    if (!t) return;
    for (var k in t.c) {
      if (!t.c.hasOwnProperty(k)) continue;
      var hex = t.c[k];
      body.style.setProperty('--' + k, hex);
      body.style.setProperty('--' + k + '-rgb', parseInt(hex.substr(1, 2), 16) + ', ' + parseInt(hex.substr(3, 2), 16) + ', ' + parseInt(hex.substr(5, 2), 16));
    }
  }

  // MARK: - Theme picker (miguel-custom): the palette button, or Ajustes do Início › Tema. A panel over the bottom
  // of the home with every theme as a card (its default wallpaper, a swatch strip, the name); the arrows move and the
  // focused theme is previewed live on the whole home; OK applies it, Back cancels.

  var THEME_COLS = 9, themeFromSettings = false, themePreview = 0;
  var CLASSIC = {auto: ['#F5F5F7', '#1C1C1E', '#0A84FF', '#FF453A', '#30D158', '#FFD60A'],
    light: ['#F5F5F7', '#E2E2E7', '#1D1D1F', '#0A84FF', '#30D158', '#FF453A'],
    dark: ['#1C1C1E', '#0B0B0D', '#F5F5F7', '#0A84FF', '#30D158', '#FF453A']};

  function themeChoices() {
    return (window.OMARCHY || []).map(function (t) {
      return {id: t.id, name: t.name, thumb: 'wallpapers/thumbs/' + t.id + '.jpg', swatches: [t.c.bg, t.c.fg, t.c.accent, t.c.red, t.c.green, t.c.yellow]};
    }).concat([
      {id: 'auto', name: tr('Clássico', 'Classic', 'Clásico'), swatches: CLASSIC.auto},
      {id: 'light', name: tr('Clássico claro', 'Classic light', 'Clásico claro'), swatches: CLASSIC.light},
      {id: 'dark', name: tr('Clássico escuro', 'Classic dark', 'Clásico oscuro'), swatches: CLASSIC.dark}]);
  }

  function renderThemes() {
    var box = $('themes').firstChild, list = themeChoices(), saved = Prefs.theme();
    box.innerHTML = '';
    var head = el('div', 'head', box);
    sym('palette', head);
    head.appendChild(document.createTextNode(tr('Temas', 'Themes', 'Temas')));
    el('div', 'hint', box, tr('As setas pré-visualizam · OK aplica · Voltar cancela', 'Arrows preview · OK applies · Back cancels', 'Las flechas previsualizan · OK aplica · Atrás cancela'));
    var grid = el('div', 'grid', box);
    for (var i = 0; i < list.length; i++) {
      var t = list[i], card = el('div', 'tcard' + (t.id === saved ? ' on' : ''), grid);
      card.style.left = (i % THEME_COLS) * 196 + 'px';
      card.style.top = Math.floor(i / THEME_COLS) * 160 + 'px';
      var thumb = el('div', 'thumb' + (t.thumb ? '' : ' ' + t.id), card);
      if (t.thumb) thumb.style.backgroundImage = 'url(' + t.thumb + ')';
      var strip = el('div', 'swatches', card);
      for (var s = 0; s < t.swatches.length; s++) el('span', '', strip).style.backgroundColor = t.swatches[s];
      el('div', 'name', card, t.name);
      hover(card, Z.THEMES, i);
    }
  }

  function openThemes(fromSettings) {
    themeFromSettings = fromSettings;
    setClass($('settings'), 'open', false);
    var list = themeChoices();
    st.theme = 0;
    for (var i = 0; i < list.length; i++) if (list[i].id === Prefs.theme()) st.theme = i;
    st.zone = Z.THEMES;
    renderThemes();
    setClass($('themes'), 'open', true);
    setClass(body, 'picking', true);
    updateFocus();
  }

  /** Shows a theme without saving it (the Classic looks by the clock, as Automático would). */
  function showTheme(id) {
    var t = omarchy(id), h = new Date().getHours();
    setClass(body, 'night', t ? t.mode !== 'light' : id === 'dark' ? true : id === 'light' ? false : h < 7 || h >= 19);
    applyTheme(id);
  }

  function previewTheme() {
    clearTimeout(themePreview);
    var t = themeChoices()[st.theme];
    themePreview = setTimeout(function () { if (st.zone === Z.THEMES && t) showTheme(t.id); }, 300);   // after the key repeat settles
  }

  function hideThemes() {
    clearTimeout(themePreview);
    setClass($('themes'), 'open', false);
    setClass(body, 'picking', false);
    checkNight();
  }

  function closeThemes(apply) {
    var t = themeChoices()[st.theme];
    if (apply && t) Prefs.set('theme', t.id);
    st.zone = Z.SHELF;
    hideThemes();
    if (apply && t) toast(tr('Tema: ', 'Theme: ', 'Tema: ') + t.name);
    if (themeFromSettings) { openSettings(); st.row = 2; updateFocus(); }   // back on the Tema row
    else { st.zone = Z.TOP; st.top = 5; updateFocus(); }
  }

  var saverOn = false, idleAt = Date.now(), saverIndex = 0, saverTimer = 0, SAVER_AFTER = 3 * 60000;   // miguel-custom: 3 idle minutes (was 5)

  // miguel-custom: the bundled Omarchy wallpapers as {url, title, theme}, the active theme's first.
  function wallpapers() {
    var theme = Prefs.theme();
    var all = (window.WALLPAPERS || []).map(function (n) {
      var t = n.split('--')[0], title = omarchy(t) ? omarchy(t).name : '';   // miguel-custom: "<theme>--<name>.jpg"
      // miguel-custom: Omarchy 4.5's default wallpaper, credited to its artist.
      if (/^tokyo-night--0-liftoff\./.test(n)) title += tr(' · Liftoff, de Tom Ballard', ' · Liftoff by Tom Ballard', ' · Liftoff, de Tom Ballard');
      return {url: 'wallpapers/' + n, theme: t, title: title};
    });
    return all.filter(function (w) { return w.theme === theme; }).concat(all.filter(function (w) { return w.theme !== theme; }));
  }

  // MARK: - Wallpaper gallery (miguel-custom): ↓ from the drawer's row, full screen; ← → browse, ↑ or Back return.

  var galleryList = [], galleryIndex = 0, galleryFront = 0, galleryHint = 0;

  function openGallery() {
    galleryList = wallpapers();
    if (!galleryList.length) return;
    st.zone = Z.GALLERY;
    galleryIndex = 0;
    var g = $('gallery');
    g.innerHTML = '';
    el('div', 'photo', g);
    el('div', 'photo', g);
    el('div', 'shade', g);
    var cap = el('div', 'caption', g);
    el('div', 'name', cap);
    el('div', 'count', cap);
    var hint = el('div', 'hint', g, tr('‹ › para ver mais  ·  ↑ ou Voltar para sair', '‹ › to browse  ·  ↑ or Back to return', '‹ › para ver más  ·  ↑ o Atrás para volver'));
    clearTimeout(galleryHint);
    galleryHint = setTimeout(function () { setClass(hint, 'quiet', true); }, 5000);
    showWall(0);
    setClass(g, 'on', true);
    updateFocus();
  }

  function showWall(d) {
    var n = galleryList.length, g = $('gallery'), photos = g.querySelectorAll('.photo');
    galleryIndex = (galleryIndex + d + n) % n;
    var p = galleryList[galleryIndex];
    galleryFront = 1 - galleryFront;
    photos[galleryFront].style.backgroundImage = 'url(' + p.url + ')';
    setClass(photos[galleryFront], 'on', true);
    setClass(photos[1 - galleryFront], 'on', false);
    g.querySelector('.caption .name').textContent = p.title;
    g.querySelector('.caption .count').textContent = (galleryIndex + 1) + ' / ' + n;
    new Image().src = galleryList[(galleryIndex + 1) % n].url;   // the next one is ready when → is pressed
  }

  function closeGallery() {
    setClass($('gallery'), 'on', false);
    st.zone = Z.DRAWER;
    updateFocus();
  }

  function showSaver() {
    var photos = Data.showcase().filter(function (p) { return p.backdrop && Data.appFor(p.app); });
    // miguel-custom: Omarchy wallpapers instead of the picks' backdrops, from a random one.
    var walls = wallpapers(), own = walls.filter(function (w) { return w.theme === Prefs.theme(); });
    if (own.length) walls = own;   // miguel-custom: with an Omarchy theme, only its wallpapers
    if (walls.length) {
      photos = walls;
      saverIndex = Math.floor(Math.random() * photos.length);
    }
    saverOn = true;
    var s = $('saver');
    s.innerHTML = '';
    var a = el('div', 'photo', s), b = el('div', 'photo', s);
    el('div', 'shade', s);
    var clock = el('div', 'clock', s);
    el('div', 'time', clock);
    el('div', 'date', clock);
    el('div', 'title', clock);
    var front = a;
    function next() {
      if (!saverOn) return;
      var p = photos.length ? photos[saverIndex++ % photos.length] : null;
      var back = front === a ? b : a;
      if (p) {
        back.style.backgroundImage = 'url(' + (p.url || Data.image(p.backdrop, 'original')) + ')';   // miguel-custom: p.url
        back.style.webkitTransform = back.style.transform = 'scale(1.0)';
        clock.lastChild.textContent = p.title;
        setTimeout(function () {
          setClass(back, 'on', true);
          setClass(front, 'on', false);
          back.style.webkitTransform = back.style.transform = 'scale(1.08) translateX(-1.5%)';
          front = back;
        }, 60);
      }
      tickSaverClock(clock);
      saverTimer = setTimeout(next, 12000);
    }
    setClass(s, 'on', true);
    next();
  }

  function tickSaverClock(clock) {
    var d = new Date();
    clock.firstChild.textContent = Data.time(d.getTime()).replace(/ (AM|PM)$/, '');
    try {
      clock.children[1].textContent = d.toLocaleDateString(I18N.locale(), {weekday: 'long', day: 'numeric', month: 'long'});
    } catch (e) {
      clock.children[1].textContent = d.toDateString();
    }
  }

  function hideSaver() {
    saverOn = false;
    clearTimeout(saverTimer);
    setClass($('saver'), 'on', false);
  }

  function poke() {
    idleAt = Date.now();
    if (saverOn) { hideSaver(); return true; }
    return false;
  }

  // MARK: - Keys

  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (poke()) { e.preventDefault(); return; }   // the first press only wakes the screen
    if (k === TV.keys.left) move(-1, 0);
    else if (k === TV.keys.right) move(1, 0);
    else if (k === TV.keys.up) move(0, -1);
    else if (k === TV.keys.down) move(0, 1);
    else if (k === TV.keys.ok) activate();
    else if (k === TV.keys.back || k === 27 || k === 8) back();
    else return;
    e.preventDefault();
  });
  document.addEventListener('mousemove', function () { poke(); });

  // MARK: - Start

  function renderAll() {
    renderTop();
    renderQuotes();
    cards = [];
    renderCards();
    renderShelf();
    renderDrawer();
    renderClock();
    checkNight();
    if (st.zone === Z.SETTINGS) renderSettings();
    updateFocus();
  }

  function loadApps(done) {
    TV.apps(function (list) {
      apps = list;
      Data.setApps(apps);
      if (TV.name === 'tizen') apps = apps.concat(EXTRA_TILES);   // miguel-custom: after setApps (not a streaming app)
      pickShelf();
      TV.inputs(function (list2) {
        inputs = list2;
        if (done) done();
      });
    });
  }

  /** Back to the home screen (the app was opened again): the shelf, everything closed, the first tab. */
  function reset() {
    hideSaver();
    closeSheets();
    setClass($('gallery'), 'on', false);   // miguel-custom
    st.zone = Z.SHELF;
    st.shelf = 0;
    if (st.tab !== 0) { st.tab = 0; renderCards(); }
    updateFocus();
  }

  Data.onChange(function () {
    renderQuotes();
    renderCards();
    renderPanels();
    checkNight();
  });

  function reopened() {
    // LG: with handlesRelaunch the app has to come to the front itself, or opening it again while it runs shows nothing.
    if (window.PalmSystem && window.PalmSystem.activate) window.PalmSystem.activate();
    reset();
    loadApps(function () { renderShelf(); renderDrawer(); Data.refresh(); });
  }

  window.addEventListener('resize', fit);
  document.addEventListener('webOSRelaunch', reopened);   // LG: opened again while running
  window.addEventListener('appcontrol', reopened);        // Samsung: the same
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { hideSaver(); return; }
    idleAt = Date.now();
    loadApps(function () { renderShelf(); renderDrawer(); updateFocus(); Data.refresh(); });
  });

  // miguel-custom: a look chosen before the Omarchy themes existed ("Escuro" here) moves to Tokyo Night once;
  // Ajustes do Início, Tema can switch back.
  try {
    if (!localStorage.getItem('fmtv.miguel.theme')) {
      localStorage.setItem('fmtv.miguel.theme', '1');
      if (Prefs.theme() !== 'osaka-jade') Prefs.set('theme', 'tokyo-night');
    }
  } catch (e) {}
  I18N.set(Prefs.language());
  fit();
  renderTop();
  loadApps(function () {
    renderAll();
    Data.refresh();
  });
  setInterval(function () {
    renderClock();
    checkNight();
    Data.refresh();
    if (saverOn) tickSaverClock($('saver').querySelector('.clock'));
  }, 30000);
  // miguel-custom: the screensaver arms on every screen (it never started while Ajustes do Início, Todos os Apps or
  // the shelf editor was left open), checked every 5 s instead of with the 30 s refresh (up to 30 s late).
  setInterval(function () {
    if (!saverOn && !document.hidden && Date.now() - idleAt > SAVER_AFTER) showSaver();
  }, 5000);

  // For the browser preview and tests.
  window.FreeMyTV = {state: st, move: move, activate: activate, back: back, showSaver: showSaver, hideSaver: hideSaver, toast: toast, openThemes: openThemes};   // miguel-custom: openThemes
})();
