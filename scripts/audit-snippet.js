// Verifica a campione, da incollare nella console del browser (o eseguire via
// javascript_tool) su ogni pagina di dist/ servita in locale: contrasto AA dei
// testi, alt delle immagini, ordine dei titoli, nomi accessibili di link e
// campi, id duplicati, landmark. Restituisce un oggetto con i problemi.
(() => {
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  cv.canvas.width = cv.canvas.height = 1;
  const rgba = (c) => {
    cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (f, b) => f.slice(0, 3).map((v, i) => v * f[3] + b[i] * (1 - f[3]));
  const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 0.99) break;
    }
    let b = [255, 255, 255];
    for (const l of layers.reverse()) b = over(l, b);
    return b;
  };
  const out = { page: location.pathname, lowContrast: [], imgNoAlt: [], headings: [], noName: [], dupIds: [], landmarks: {} };
  const seen = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.sr-only')) return;
    const fg = rgba(cs.color); const bg = bgOf(el);
    const f = over(fg, bg);
    const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    const r = ratio(f, bg);
    if (r < need) {
      const key = el.tagName + el.className + r.toFixed(2);
      if (!seen.has(key)) { seen.add(key); out.lowContrast.push({ el: el.tagName + '.' + el.className, text: el.textContent.trim().slice(0, 30), ratio: +r.toFixed(2), need }); }
    }
  });
  document.querySelectorAll('img').forEach((i) => { if (!i.hasAttribute('alt')) out.imgNoAlt.push(i.src); });
  let prev = 0;
  document.querySelectorAll('h1,h2,h3,h4').forEach((h) => { const l = +h.tagName[1]; if (l > prev + 1 && prev) out.headings.push(`salto h${prev}→h${l}: ${h.textContent.trim().slice(0, 30)}`); prev = l; });
  out.h1 = document.querySelectorAll('h1').length;
  document.querySelectorAll('a,button').forEach((e) => { if (!(e.textContent.trim() || e.getAttribute('aria-label'))) out.noName.push(e.outerHTML.slice(0, 80)); });
  document.querySelectorAll('input,select,textarea').forEach((e) => { if (e.type !== 'hidden' && !e.labels?.length && !e.getAttribute('aria-label')) out.noName.push(e.outerHTML.slice(0, 80)); });
  const ids = {}; document.querySelectorAll('[id]').forEach((e) => { ids[e.id] = (ids[e.id] || 0) + 1; });
  out.dupIds = Object.keys(ids).filter((k) => ids[k] > 1);
  ['header', 'nav', 'main', 'footer'].forEach((t) => { out.landmarks[t] = document.querySelectorAll(t).length; });
  out.htmlLang = document.documentElement.lang;
  return out;
})();
