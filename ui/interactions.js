/* Rupee Desk — interactions.js
   Three jobs: stamp check years from ui/dates.json, run the rank filter,
   keep deep links to a venue working. No dependencies. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- 1. check years ------------------------------------------------ */
  /* Every element with data-check="<key>" gets the year stored under
     checks.<key> in ui/dates.json. Year only — we never print a day. */

  function stampYears(data) {
    var checks = (data && data.checks) || {};
    var nodes = document.querySelectorAll('[data-check]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-check');
      var year = checks[key] || data.edition;
      if (year) nodes[i].textContent = year;
    }
    if (data.edition) {
      var ed = document.querySelectorAll('[data-edition]');
      for (var j = 0; j < ed.length; j++) ed[j].textContent = data.edition;
    }
  }

  function loadYears() {
    var url = root.getAttribute('data-dates') || 'ui/dates.json';
    if (!window.fetch) return;
    fetch(url, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) stampYears(d); })
      .catch(function () { /* markup already carries a fallback year */ });
  }

  /* ---- 2. comparison-table filter ------------------------------------ */
  /* Buttons carry data-pick; table rows carry data-traits="a b c". Rows are
     hidden rather than removed so the table keeps its column widths. */

  function wireFilter() {
    var bar = document.querySelector('[data-filter]');
    if (!bar) return;
    var buttons = bar.querySelectorAll('button[data-pick]');
    var cards = document.querySelectorAll('[data-traits]');
    var empty = document.querySelector('[data-empty]');

    function apply(pick) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var traits = ' ' + cards[i].getAttribute('data-traits') + ' ';
        var keep = pick === 'all' || traits.indexOf(' ' + pick + ' ') > -1;
        cards[i].hidden = !keep;
        if (keep) shown++;
      }
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute('aria-pressed', String(buttons[b].getAttribute('data-pick') === pick));
      }
      if (empty) empty.hidden = shown !== 0;
    }

    bar.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-pick]');
      if (!btn) return;
      apply(btn.getAttribute('data-pick'));
    });

    apply('all');
  }


  /* ---- 3. sortable comparison table ---------------------------------- */
  /* Every sortable header carries data-sort="num|text"; every cell carries
     data-v with the value to sort on, so the printed text stays human while
     the sort stays correct (0.080% beats 0.100%, "withheld" sorts to zero). */

  function wireSort() {
    var table = document.getElementById('compare-table');
    if (!table) return;
    var heads = table.querySelectorAll('th[data-sort]');
    var body = table.tBodies[0];

    function value(row, index, type) {
      var cell = row.children[index];
      var raw = cell.getAttribute('data-v');
      if (raw === null) raw = cell.textContent;
      return type === 'num' ? parseFloat(raw) : String(raw).toLowerCase();
    }

    function sortBy(index, type, dir) {
      var rows = [].slice.call(body.rows);
      rows.sort(function (a, b) {
        var x = value(a, index, type), y = value(b, index, type);
        if (type === 'num') {
          if (isNaN(x)) x = Infinity;
          if (isNaN(y)) y = Infinity;
        }
        if (x < y) return -dir;
        if (x > y) return dir;
        return 0;
      });
      for (var i = 0; i < rows.length; i++) body.appendChild(rows[i]);
    }

    for (var h = 0; h < heads.length; h++) {
      (function (th) {
        var index = [].indexOf.call(th.parentNode.children, th);
        var type = th.getAttribute('data-sort');
        th.querySelector('.sortbtn').addEventListener('click', function () {
          var current = th.getAttribute('aria-sort');
          /* First click on a fresh column sorts the useful way: ascending for
             rank and fees, descending for scores and volume. */
          var dir;
          if (current === 'ascending') dir = -1;
          else if (current === 'descending') dir = 1;
          else dir = th.hasAttribute('data-desc-first') ? -1 : 1;
          for (var i = 0; i < heads.length; i++) heads[i].setAttribute('aria-sort', 'none');
          th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
          sortBy(index, type, dir);
        });
      })(heads[h]);
    }
  }

  /* ---- 4. small-screen menu ------------------------------------------ */
  /* The nav is a plain list that CSS hides below 820px; this only flips a
     flag the stylesheet reads, so the links still work with JS switched off. */

  function wireMenu() {
    var btn = document.querySelector('[data-menu]');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- 5. deep links -------------------------------------------------- */
  /* A card hidden by a filter still has to open when someone lands on
     #binance from search or from another page. */

  function revealTarget() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    if (el.hidden) el.hidden = false;
    var box = el.closest('details');
    if (box) box.open = true;
  }

  function start() {
    loadYears();
    wireFilter();
    wireSort();
    wireMenu();
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
