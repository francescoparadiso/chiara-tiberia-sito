// ═══════════════════════════════════════════════════════════════════════════
// lib.mjs — piccoli strumenti condivisi dai template: escape HTML, gestione
// dei segnaposto [[...]], icone SVG inline.
// ═══════════════════════════════════════════════════════════════════════════

const PH_RE = /\[\[(.*?)\]\]/g;

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const hasPh = (s) => typeof s === 'string' && /\[\[.*?\]\]/.test(s);

/** Valore "vero" oppure null se vuoto o ancora segnaposto: per link e dati strutturati. */
export const real = (s) => (typeof s === 'string' && s.trim() && !hasPh(s) ? s.trim() : null);

/** Testo con i segnaposto evidenziati (testo già escapato). */
export const ph = (s = '') =>
  esc(s).replace(
    /\[\[(.*?)\]\]/g,
    '<mark class="ph" title="Segnaposto da completare">[$1]</mark>',
  );

/** Come ph() ma toglie del tutto i segnaposto (per meta tag, JSON-LD, testo semplice). */
export const stripPh = (s = '') => String(s).replace(PH_RE, '').replace(/\s{2,}/g, ' ').trim();

/** Conta e raccoglie i segnaposto in un oggetto di configurazione. */
export function collectPlaceholders(node, path = '', out = []) {
  if (typeof node === 'string') {
    const m = node.match(PH_RE);
    if (m) out.push(...m.map((x) => ({ path, text: x })));
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => collectPlaceholders(v, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) collectPlaceholders(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

const ICONS = {
  play: '<rect x="3.5" y="12.5" width="7" height="7" rx="1.5"/><circle cx="16.5" cy="16" r="3.5"/><path d="M7 4l4 6.5H3z"/>',
  path: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  door: '<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v3"/>',
  chat: '<path d="M5 5h14v10h-8.5L6 19v-4H5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7.5L12 13l8.5-5.5"/>',
  phone:
    '<path d="M6 3.5h3l1.8 4.6-2 1.4a11 11 0 0 0 5.7 5.7l1.4-2 4.6 1.8v3a2 2 0 0 1-2.2 2A16.500 16.500 0 0 1 4 5.700 2 2 0 0 1 6 3.500z"/>',
  whatsapp:
    '<path d="M4 20l1.4-4.2A8.200 8.200 0 1 1 8.300 18.700z"/><path d="M9.200 8.800c-.4 2.700 2.600 5.700 5.500 5.700l1-1.600-2-1-.9.700a4 4 0 0 1-1.800-1.800l.7-.9-1-2z"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  building:
    '<path d="M5 21V5l7-2 7 2v16"/><path d="M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>',
};

export function icon(name, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
}

/** Logo: una porta ad arco, immagine di «accesso alle attività». */
export function logoMark(cls = 'logo-mark') {
  return `<svg class="${cls}" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false"><path d="M6 37V19a14 14 0 0 1 28 0v18z" fill="var(--sage-700)"/><path d="M14 37V20.500a6 6 0 0 1 12 0V37" fill="var(--bg)"/><circle cx="20" cy="26" r="1.700" fill="var(--clay-600)"/></svg>`;
}
