/* main.js — miglioramenti progressivi. Il sito funziona anche senza JavaScript:
   qui ci sono solo il menu mobile, il modulo di contatto e la mappa a richiesta.
   Nessun cookie, nessun tracciamento. */
(function () {
  'use strict';

  /* ── Menu mobile ─────────────────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu-principale');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  /* ── Modulo di contatto ──────────────────────────────────────────────── */
  var form = document.querySelector('form.form');
  if (form) {
    var status = form.querySelector('[data-status]');
    var button = form.querySelector('button[type="submit"]');
    var mode = form.getAttribute('data-mode');

    var say = function (msg, cls) {
      status.textContent = msg;
      status.className = 'form__status ' + (cls || '');
    };
    var clearErrors = function () {
      form.querySelectorAll('.field-error').forEach(function (n) { n.remove(); });
      form.querySelectorAll('[aria-invalid]').forEach(function (n) { n.removeAttribute('aria-invalid'); });
    };
    var validate = function () {
      clearErrors();
      var first = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || !el.checkValidity();
        if (!bad) return;
        el.setAttribute('aria-invalid', 'true');
        var msg = document.createElement('span');
        msg.className = 'field-error';
        msg.id = el.id + '-err';
        msg.textContent = el.type === 'checkbox'
          ? 'Per inviare serve il tuo consenso.'
          : el.type === 'email' && el.value.trim() ? 'Controlla l’indirizzo email.' : 'Questo campo è obbligatorio.';
        el.setAttribute('aria-describedby', ((el.getAttribute('aria-describedby') || '') + ' ' + msg.id).trim());
        (el.closest('.form__row') || el.closest('.form__check')).appendChild(msg);
        if (!first) first = el;
      });
      if (first) { first.focus(); say('Controlla i campi evidenziati.', 'is-err'); }
      return !first;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var data = new FormData(form);
      if (data.get('botcheck')) return; // trappola anti-bot

      if (mode === 'mailto') {
        var to = form.getAttribute('data-mailto');
        if (!to) { say('Indirizzo email non ancora configurato.', 'is-err'); return; }
        var body = 'Nome: ' + data.get('nome') + '\nEmail: ' + data.get('email') +
          '\nTelefono: ' + (data.get('telefono') || '-') + '\nScrivo per: ' + data.get('per_chi') +
          '\n\n' + data.get('messaggio');
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Richiesta dal sito') +
          '&body=' + encodeURIComponent(body);
        say('Si apre il tuo programma di posta per inviare il messaggio.', 'is-ok');
        return;
      }

      button.disabled = true;
      say('Invio in corso…');
      var payload = {};
      data.forEach(function (v, k) { payload[k] = v; });
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error('send');
          form.reset();
          say('Grazie, messaggio inviato. Ti risponderò appena possibile.', 'is-ok');
        })
        .catch(function () {
          say('Non sono riuscito a inviare il messaggio. Riprova o scrivimi direttamente via email.', 'is-err');
        })
        .then(function () { button.disabled = false; });
    });
  }

  /* ── Mappa a richiesta (nessuna connessione a terzi finché non si preme) ─ */
  var map = document.querySelector('[data-map]');
  if (map) {
    var load = map.querySelector('[data-map-load]');
    load.addEventListener('click', function () {
      var lat = parseFloat(map.dataset.lat);
      var lon = parseFloat(map.dataset.lon);
      var zoom = parseInt(map.dataset.zoom, 10) || 14;
      var span = 360 / Math.pow(2, zoom) * 1.2; // gradi di longitudine visibili
      var dLon = span, dLat = span * 0.55;
      var bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join('%2C');
      var f = document.createElement('iframe');
      f.title = 'Mappa della zona di intervento (OpenStreetMap)';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer';
      f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + '%2C' + lon;
      map.innerHTML = '';
      map.appendChild(f);
    });
  }
})();
