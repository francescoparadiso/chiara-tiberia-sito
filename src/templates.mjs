// ═══════════════════════════════════════════════════════════════════════════
// templates.mjs — il markup di ogni pagina. Riceve `ctx` (configurazione +
// dati calcolati dalla build: url del sito, foto ottimizzata, stato anteprima)
// e restituisce HTML. Nessun testo "vero" è scritto qui: i contenuti vengono
// tutti da site.config.mjs.
// ═══════════════════════════════════════════════════════════════════════════
import { esc, ph, real, stripPh, hasPh, icon, logoMark } from './lib.mjs';

const NAV = [
  ['chi-sono/', 'Chi sono'],
  ['servizi/', 'Servizi'],
  ['prima-valutazione/', 'Prima valutazione'],
  ['faq/', 'Domande frequenti'],
  ['contatti/', 'Contatti'],
];

// ── Layout ─────────────────────────────────────────────────────────────────
export function layout(ctx, page) {
  const { cfg, siteUrl, preview, photo, ogImage } = ctx;
  const depth = page.path.split('/').filter(Boolean).length;
  const root = page.absolute ? `${siteUrl}/` : depth === 0 ? './' : '../'.repeat(depth);
  const href = (p) => `${root}${p}`;
  const canonical = `${siteUrl}/${page.path}`;
  const name = cfg.person.name;
  const siteName = `${name} · ${cfg.person.role}`;
  const title = page.home ? `${name} — ${cfg.person.role}` : `${page.title} — ${name}`;
  const desc = stripPh(page.description);
  const robots = preview || page.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

  const nav = NAV.map(([p, label]) => {
    const current = page.path === p ? ' aria-current="page"' : '';
    return `<li><a href="${href(p)}"${current}>${esc(label)}</a></li>`;
  }).join('');

  const ld = (page.jsonld || []).length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': page.jsonld }).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!doctype html>
<html lang="${cfg.site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="${cfg.site.themeColor}">
<meta property="og:type" content="${page.home ? 'website' : 'article'}">
<meta property="og:locale" content="${cfg.site.locale}">
<meta property="og:site_name" content="${esc(siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
${ogImage ? `<meta property="og:image" content="${esc(siteUrl)}/assets/img/og.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="icon" href="${href('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${href('assets/fonts/fraunces-soft-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${href('assets/fonts/figtree-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${href('assets/css/style.css')}">
<link rel="stylesheet" href="${href('assets/css/motion.css')}">
<script>document.documentElement.classList.add('js')</script>
${ld}
</head>
<body>
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
${preview ? `<div class="preview-bar" role="note"><div class="wrap"><strong>Anteprima.</strong> I testi <mark class="ph">[tra parentesi, in giallo]</mark> sono segnaposto da sostituire con i dati reali. Questa pagina non è indicizzata dai motori di ricerca.</div></div>` : ''}
<header class="site-header">
  <div class="wrap site-header__in">
    <a class="brand" href="${href('')}" aria-label="${esc(name)} — ${esc(cfg.person.role)}, pagina iniziale">
      ${logoMark()}
      <span class="brand__text"><span class="brand__name">${esc(name)}</span><span class="brand__role">${esc(cfg.person.role)}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu-principale">
      <span class="nav-toggle__open">${icon('menu')}</span><span class="nav-toggle__close">${icon('close')}</span>
      <span class="sr-only">Menu</span>
    </button>
    <nav class="nav" id="menu-principale" aria-label="Principale">
      <ul>${nav}</ul>
      <a class="btn btn--primary btn--sm nav__cta" href="${href('contatti/#modulo')}">Scrivimi</a>
    </nav>
  </div>
</header>
<main id="contenuto" tabindex="-1">
${page.body(href)}
</main>
${footer(ctx, href)}
<script src="${href('assets/js/main.js')}" defer></script>
</body>
</html>
`;
}

// ── Footer ─────────────────────────────────────────────────────────────────
function footer(ctx, href) {
  const { cfg, year } = ctx;
  const b = cfg.business;
  const c = cfg.contact;
  const a = c.address;
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-col footer-col--brand">
      <p class="footer-brand">${logoMark('logo-mark logo-mark--sm')}<span>${esc(cfg.person.name)}</span></p>
      <p>${esc(cfg.person.role)}, libera professionista.</p>
      <p class="small">${esc(cfg.footerNote)}</p>
    </div>
    <div class="footer-col">
      <h2 class="footer-h">Dati professionali</h2>
      <dl class="data-list">
        <div><dt>Titolare</dt><dd>${ph(b.legalName)}</dd></div>
        <div><dt>Partita IVA</dt><dd>${ph(b.vatNumber)}</dd></div>
        ${b.fiscalCode ? `<div><dt>Codice fiscale</dt><dd>${ph(b.fiscalCode)}</dd></div>` : ''}
        <div><dt>Iscrizione</dt><dd>${ph(b.albo.albo)}, ${esc(b.albo.orderShort)} di ${ph(b.albo.province)}, n.&nbsp;${ph(b.albo.number)}</dd></div>
        <div><dt>Assicurazione</dt><dd>${ph(b.insurance)}</dd></div>
      </dl>
    </div>
    <div class="footer-col">
      <h2 class="footer-h">Contatti</h2>
      <ul class="plain">
        <li>${contactItem('mail', c.email, (v) => `mailto:${v}`)}</li>
        <li>${contactItem('phone', c.phone, (v) => `tel:${v.replace(/[^\d+]/g, '')}`)}</li>
        <li class="addr">${icon('pin')}<span>${ph(a.street)}, ${ph(a.postalCode)} ${ph(a.city)} (${ph(a.province)})</span></li>
      </ul>
    </div>
    <div class="footer-col">
      <h2 class="footer-h">Informazioni</h2>
      <ul class="plain">
        <li><a href="${href('privacy/')}">Informativa privacy</a></li>
        <li><a href="${href('cookie/')}">Cookie policy</a></li>
        <li><a href="${href('contatti/')}">Contatti</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${year} ${esc(cfg.person.name)} · P.IVA ${ph(b.vatNumber)}</p>
    <p>Questo sito non usa cookie né strumenti di tracciamento.</p>
  </div>
</footer>`;
}

function contactItem(ic, value, toHref, label = value) {
  const v = real(value);
  return v
    ? `<a class="with-icon" href="${esc(toHref(v))}">${icon(ic)}<span>${esc(label)}</span></a>`
    : `<span class="with-icon">${icon(ic)}<span>${ph(value)}</span></span>`;
}

// ── Pezzi riutilizzabili ───────────────────────────────────────────────────
function portrait(ctx, size, href) {
  const { photo, cfg } = ctx;
  if (photo) {
    const set = (list) => list.map((i) => `${href(i.url)} ${i.w}w`).join(', ');
    const sizes = size === 'lg' ? '(min-width: 900px) 440px, 80vw' : '(min-width: 900px) 380px, 80vw';
    const big = photo.jpg[photo.jpg.length - 1];
    return `<figure class="portrait portrait--${size}"><div class="portrait__deco"><div class="portrait__frame"><picture>
      ${photo.avif.length ? `<source type="image/avif" srcset="${set(photo.avif)}" sizes="${sizes}">` : ''}
      <source type="image/webp" srcset="${set(photo.webp)}" sizes="${sizes}">
      <img src="${href(big.url)}" srcset="${set(photo.jpg)}" sizes="${sizes}" width="${photo.width}" height="${photo.height}" alt="${esc(cfg.photo.alt)}" ${size === 'lg' ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </picture></div></div></figure>`;
  }
  return `<figure class="portrait portrait--${size}"><div class="portrait__deco"><div class="portrait__frame portrait__frame--ph" role="img" aria-label="Spazio per il ritratto di ${esc(cfg.person.name)}">
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <path d="M-10 510V210C-10 90 90 -10 200 -10S410 90 410 210v300z" fill="var(--sage-100)"/>
      <path d="M40 510V230c0-95 70-170 160-170s160 75 160 170v280" pathLength="1" class="arch" fill="none" stroke="var(--sage-300)" stroke-width="2"/>
      <path d="M95 510V250c0-70 48-120 105-120s105 50 105 120v260" pathLength="1" class="arch" fill="none" stroke="var(--sage-300)" stroke-width="2"/>
      <path d="M150 510V270c0-40 22-70 50-70s50 30 50 70v240" pathLength="1" class="arch" fill="var(--bg)" fill-opacity=".55" stroke="var(--sage-300)" stroke-width="2"/>
      <text x="200" y="338" text-anchor="middle" class="portrait__mono">${esc(cfg.person.initials)}</text>
    </svg>
    <span class="portrait__tag"><mark class="ph">[Qui andrà la foto di ${esc(cfg.person.givenName)}]</mark></span>
  </div></div></figure>`;
}

function ctaBand(ctx, href, text = 'Parliamone in un primo colloquio') {
  return `<section class="cta-band" aria-labelledby="cta-h">
  <div class="wrap cta-band__in">
    <div><h2 id="cta-h">${esc(text)}</h2>
    <p>Scrivimi due righe su di te o sulla persona di cui ti prendi cura: ti rispondo per capire insieme come posso esserti utile.</p></div>
    <a class="btn btn--light" href="${href('contatti/#modulo')}">Contattami ${icon('arrow')}</a>
  </div>
</section>`;
}

function pageHead(title, lead, eyebrow) {
  return `<section class="page-head"><div class="wrap">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1>${esc(title)}</h1>
    ${lead ? `<p class="lead">${ph(lead)}</p>` : ''}
  </div></section>`;
}

function modeList(ctx) {
  const { modes } = ctx.cfg;
  const out = [];
  if (modes.studio) out.push(['building', 'In studio', 'Su appuntamento, in un ambiente tranquillo.']);
  if (modes.home) out.push(['home', 'A domicilio', 'Dove le attività si svolgono davvero: a casa tua, nei comuni serviti.']);
  if (modes.online) out.push(['monitor', 'Online', 'Colloqui da remoto, quando adatti alla situazione.']);
  return out;
}

const liFromList = (arr) => arr.map((t) => `<li>${ph(t)}</li>`).join('');

// ═══ HOME ═════════════════════════════════════════════════════════════════
export function homePage(ctx) {
  const { cfg } = ctx;
  const h = cfg.home;
  const b = cfg.business;
  const services = cfg.services.items.filter((s) => s.enabled);
  const modes = modeList(ctx);
  const accent = h.titleAccent && h.title.includes(h.titleAccent) ? h.titleAccent : '';
  const titleHtml = accent
    ? esc(h.title).replace(esc(accent), (m) => `<span class="accent">${m}<svg class="accent__line" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M3 9 C 45 3, 85 13, 125 6 S 185 4, 197 8"/></svg></span>`)
    : esc(h.title);
  const tagIcons = ['home', 'play', 'path'];
  const floatTags = cfg.whatIs.chips.slice(1, 4);
  return {
    path: '',
    home: true,
    title: cfg.person.role,
    description: `${cfg.person.name}, ${cfg.person.role.toLowerCase()} libera professionista. ${h.lead}`,
    jsonld: ctx.jsonld.base,
    body: (href) => `
<section class="hero">
  <div class="hero__bg" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="wrap hero__in">
    <div class="hero__text">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h1>${titleHtml}</h1>
      <p class="lead">${ph(h.lead)}</p>
      <div class="actions">
        <a class="btn btn--primary" href="${href('contatti/#modulo')}">${esc(h.ctaPrimary)} ${icon('arrow')}</a>
        <a class="btn btn--ghost" href="${href('servizi/')}">${esc(h.ctaSecondary)}</a>
      </div>
      <ul class="facts" aria-label="In sintesi">
        <li>${icon('check')}<span>Iscritta all’${ph(b.albo.albo)}, ${esc(b.albo.orderShort)} di ${ph(b.albo.province)}</span></li>
        ${modes.length ? `<li>${icon('check')}<span>${modes.map((m) => m[1]).join(' · ')}</span></li>` : ''}
        <li>${icon('check')}<span>Primo colloquio conoscitivo</span></li>
      </ul>
    </div>
    <div class="hero__visual">${portrait(ctx, 'lg', href)}
      <ul class="float-tags" aria-hidden="true">${floatTags.map((tx, i) => `<li style="--i:${i}">${icon(tagIcons[i])}<span>${esc(tx)}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track">${[0, 1].map(() => `<ul>${cfg.whatIs.chips.map((tx) => `<li>${esc(tx)}</li>`).join('')}</ul>`).join('')}</div></div>

<section class="section" aria-labelledby="cos-e">
  <div class="wrap split">
    <div>
      <p class="eyebrow">La professione</p>
      <h2 id="cos-e">${esc(cfg.whatIs.title)}</h2>
      <p>${ph(cfg.whatIs.text)}</p>
      <p>${ph(cfg.whatIs.note)}</p>
      <p><a class="link-arrow" href="${href('faq/')}">Leggi le domande frequenti ${icon('arrow')}</a></p>
    </div>
    <div>
      <p class="chips-title">Le attività che contano</p>
      <ul class="chips">${liFromList(cfg.whatIs.chips)}</ul>
    </div>
  </div>
</section>

<section class="section section--sand" aria-labelledby="approccio">
  <div class="wrap">
    <p class="eyebrow">Il metodo</p>
    <h2 id="approccio">Un percorso costruito attorno a te</h2>
    <ol class="pillars">
      ${cfg.pillars.map((p, i) => `<li><span class="pillars__n" aria-hidden="true">${i + 1}</span><h3>${ph(p.title)}</h3><p>${ph(p.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="servizi-h">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow">Servizi</p><h2 id="servizi-h">Ambiti in cui posso accompagnarti</h2></div>
      <a class="link-arrow" href="${href('servizi/')}">Tutti i servizi ${icon('arrow')}</a>
    </div>
    <ul class="cards">
      ${services.map((s) => `<li class="card"><span class="card__icon">${icon(s.icon)}</span><h3>${ph(s.title)}</h3><p>${ph(s.text)}</p></li>`).join('')}
    </ul>
    <p class="note">${ph(cfg.services.draftNote)}</p>
  </div>
</section>

<section class="section section--sage" aria-labelledby="dove">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Dove e come</p>
      <h2 id="dove">Dove ricevo</h2>
      <p>${ph(cfg.area.intro)}</p>
      <ul class="chips chips--light">${liFromList(cfg.area.towns)}</ul>
    </div>
    <ul class="modes">
      ${modes.map(([ic, t, d]) => `<li>${icon(ic)}<div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="valutazione-h">
  <div class="wrap">
    <p class="eyebrow">Il primo passo</p>
    <h2 id="valutazione-h">Come comincia un percorso</h2>
    <ol class="steps steps--compact">
      ${cfg.firstVisit.steps.map((s) => `<li><h3>${ph(s.title)}</h3><p>${ph(s.text)}</p></li>`).join('')}
    </ol>
    <p><a class="link-arrow" href="${href('prima-valutazione/')}">Come si svolge la prima valutazione ${icon('arrow')}</a></p>
  </div>
</section>

${ctaBand(ctx, href)}`,
  };
}

// ═══ CHI SONO ═════════════════════════════════════════════════════════════
export function aboutPage(ctx) {
  const { cfg } = ctx;
  const a = cfg.about;
  return {
    path: 'chi-sono/',
    title: 'Chi sono',
    description: `${cfg.person.name}, ${cfg.person.role.toLowerCase()}: formazione, iscrizione all’Albo e modo di lavorare.`,
    jsonld: [...ctx.jsonld.base, ...ctx.jsonld.crumbs('Chi sono', 'chi-sono/')],
    body: (href) => `
${pageHead(a.title, '', 'Presentazione')}
<section class="section section--tight">
  <div class="wrap about">
    <div class="about__photo">${portrait(ctx, 'md', href)}</div>
    <div class="prose">
      <p class="lead">${ph(a.intro)}</p>
      <p>${ph(a.personal)}</p>

      <h2>Formazione e titoli</h2>
      <ul class="credentials">
        ${a.training.map((t) => `<li><strong>${ph(t.label)}</strong><span>${ph(t.detail)}</span></li>`).join('')}
      </ul>

      <h2>${esc(a.approachTitle)}</h2>
      <ul class="ticks">${a.approach.map((t) => `<li>${icon('check')}<span>${ph(t)}</span></li>`).join('')}</ul>

      <h2>Dati professionali</h2>
      <p>${ph(cfg.business.legalName)}, ${esc(cfg.person.role.toLowerCase())}, iscritta all’${ph(cfg.business.albo.albo)} dell’${esc(cfg.business.albo.orderName)} di ${ph(cfg.business.albo.province)}, n.&nbsp;${ph(cfg.business.albo.number)}. Partita IVA ${ph(cfg.business.vatNumber)}. Assicurazione di responsabilità civile professionale: ${ph(cfg.business.insurance)}.</p>
    </div>
  </div>
</section>
${ctaBand(ctx, href)}`,
  };
}

// ═══ SERVIZI ══════════════════════════════════════════════════════════════
export function servicesPage(ctx) {
  const { cfg } = ctx;
  const s = cfg.services;
  const items = s.items.filter((i) => i.enabled);
  return {
    path: 'servizi/',
    title: s.title,
    description: `I servizi di terapia occupazionale di ${cfg.person.name}: bambini e ragazzi, adulti, persone anziane, ambiente domestico e ausili, consulenza.`,
    jsonld: [...ctx.jsonld.base, ...ctx.jsonld.crumbs('Servizi', 'servizi/')],
    body: (href) => `
${pageHead(s.title, s.lead, 'Di cosa mi occupo')}
<section class="section section--tight">
  <div class="wrap">
    <p class="note note--top">${ph(s.draftNote)}</p>
    <ul class="service-list">
      ${items.map((i) => `<li id="${i.id}" class="service">
        <span class="card__icon card__icon--lg">${icon(i.icon)}</span>
        <div><h2>${ph(i.title)}</h2><p>${ph(i.text)}</p></div>
      </li>`).join('')}
    </ul>
    <aside class="callout" aria-label="Avvertenza">
      <p>${ph(s.disclaimer)}</p>
    </aside>
    <div class="modes-row">
      <h2>Dove e come</h2>
      <ul class="modes modes--inline">
        ${modeList(ctx).map(([ic, t, d]) => `<li>${icon(ic)}<div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}
      </ul>
      <p><a class="link-arrow" href="${href('contatti/#zona')}">Zona di intervento e mappa ${icon('arrow')}</a></p>
    </div>
  </div>
</section>
${ctaBand(ctx, href)}`,
  };
}

// ═══ PRIMA VALUTAZIONE ════════════════════════════════════════════════════
export function firstVisitPage(ctx) {
  const { cfg } = ctx;
  const f = cfg.firstVisit;
  return {
    path: 'prima-valutazione/',
    title: f.title,
    description: `Come si svolge il primo incontro con ${cfg.person.name}: contatto, colloquio, osservazione e restituzione.`,
    jsonld: [...ctx.jsonld.base, ...ctx.jsonld.crumbs('Prima valutazione', 'prima-valutazione/')],
    body: (href) => `
${pageHead(f.title, f.lead, 'Il primo incontro')}
<section class="section section--tight">
  <div class="wrap two-col">
    <ol class="steps">
      ${f.steps.map((s) => `<li><h2>${ph(s.title)}</h2><p>${ph(s.text)}</p></li>`).join('')}
    </ol>
    <aside class="panel" aria-labelledby="info-pratiche">
      <h2 id="info-pratiche">Informazioni pratiche</h2>
      <dl class="data-list data-list--stack">
        ${f.practical.map((p) => `<div><dt>${esc(p.label)}</dt><dd>${ph(p.value)}</dd></div>`).join('')}
      </dl>
      <a class="btn btn--primary btn--block" href="${href('contatti/#modulo')}">Richiedi un primo colloquio</a>
    </aside>
  </div>
</section>
${ctaBand(ctx, href, 'Hai una domanda prima di cominciare?')}`,
  };
}

// ═══ FAQ ══════════════════════════════════════════════════════════════════
export function faqPage(ctx) {
  const { cfg } = ctx;
  const f = cfg.faq;
  const faqLd = {
    '@type': 'FAQPage',
    mainEntity: f.items
      .filter((i) => !hasPh(i.a) && !hasPh(i.q))
      .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
  return {
    path: 'faq/',
    title: f.title,
    description: `Risposte alle domande più comuni sulla terapia occupazionale e sul lavoro di ${cfg.person.name}.`,
    jsonld: [...ctx.jsonld.base, ...ctx.jsonld.crumbs('Domande frequenti', 'faq/'), ...(faqLd.mainEntity.length ? [faqLd] : [])],
    body: (href) => `
${pageHead(f.title, f.lead, 'FAQ')}
<section class="section section--tight">
  <div class="wrap wrap--narrow">
    <div class="faq">
      ${f.items.map((i) => `<details><summary><span>${ph(i.q)}</span><svg class="faq__chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><div class="faq__a"><p>${ph(i.a)}</p></div></details>`).join('')}
    </div>
    <aside class="callout"><p>${ph(cfg.services.disclaimer)}</p></aside>
  </div>
</section>
${ctaBand(ctx, href, 'Non trovi la tua domanda?')}`,
  };
}

// ═══ CONTATTI ═════════════════════════════════════════════════════════════
export function contactPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const c = cfg.contact;
  const a = c.address;
  const cp = cfg.contactPage;
  const key = real(c.formAccessKey);
  const email = real(c.email);
  const wa = real(c.whatsapp);
  const m = cfg.area.map;
  const hasMap = typeof m.lat === 'number' && typeof m.lon === 'number';
  const osmLink = hasMap ? `https://www.openstreetmap.org/?mlat=${m.lat}&mlon=${m.lon}#map=${m.zoom}/${m.lat}/${m.lon}` : '';
  return {
    path: 'contatti/',
    title: cp.title,
    description: `Contatta ${cfg.person.name}, ${cfg.person.role.toLowerCase()}: modulo, email, telefono, zona di intervento.`,
    jsonld: [...ctx.jsonld.base, ...ctx.jsonld.crumbs('Contatti', 'contatti/')],
    body: (href) => `
${pageHead(cp.title, cp.lead, 'Scrivimi')}
<section class="section section--tight">
  <div class="wrap contact">
    <div class="contact__form" id="modulo">
      <h2>Scrivimi</h2>
      <p>${ph(cp.formIntro)}</p>
      <p class="callout callout--warn">${ph(cp.healthNotice)}</p>
      <form class="form" data-mode="${key ? 'web3forms' : 'mailto'}" data-mailto="${esc(email || '')}" action="${key ? 'https://api.web3forms.com/submit' : email ? `mailto:${esc(email)}` : '#'}" method="post" ${key ? '' : 'enctype="text/plain"'} novalidate>
        ${key ? `<input type="hidden" name="access_key" value="${esc(key)}">
        <input type="hidden" name="subject" value="Nuovo messaggio dal sito — ${esc(cfg.person.name)}">
        <input type="hidden" name="from_name" value="Sito ${esc(cfg.person.name)}">` : ''}
        <p class="form__row"><label for="f-nome">Nome e cognome <span class="req" aria-hidden="true">*</span></label>
          <input id="f-nome" name="nome" type="text" autocomplete="name" required></p>
        <p class="form__row"><label for="f-email">Email <span class="req" aria-hidden="true">*</span></label>
          <input id="f-email" name="email" type="email" autocomplete="email" required></p>
        <p class="form__row"><label for="f-tel">Telefono <span class="opt">(facoltativo)</span></label>
          <input id="f-tel" name="telefono" type="tel" autocomplete="tel"></p>
        <p class="form__row"><label for="f-per">Scrivi per</label>
          <select id="f-per" name="per_chi">
            <option>Me stesso/a</option><option>Mio figlio/a</option><option>Un familiare</option><option>Una scuola o un servizio</option><option>Altro</option>
          </select></p>
        <p class="form__row"><label for="f-msg">Messaggio <span class="req" aria-hidden="true">*</span></label>
          <textarea id="f-msg" name="messaggio" rows="5" required aria-describedby="f-msg-hint"></textarea>
          <span class="hint" id="f-msg-hint">Presentati in breve e dimmi come preferisci essere ricontattato/a. Niente informazioni sulla salute, per favore.</span></p>
        <p class="form__check"><input id="f-privacy" name="consenso_privacy" type="checkbox" value="si" required>
          <label for="f-privacy">Ho letto l’<a href="${href('privacy/')}">informativa privacy</a> e acconsento al trattamento dei miei dati per essere ricontattato/a. <span class="req" aria-hidden="true">*</span></label></p>
        <p class="sr-only" aria-hidden="true"><label>Non compilare <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label></p>
        <button class="btn btn--primary" type="submit">Invia il messaggio ${icon('arrow')}</button>
        <p class="form__status" role="status" aria-live="polite" data-status></p>
        ${key ? '' : `<p class="note">${ph('[[Il modulo è in modalità email: finché non inserisci la chiave Web3Forms in site.config.mjs apre il programma di posta dell’utente.]]')}</p>`}
      </form>
    </div>

    <aside class="contact__side" aria-label="Contatti diretti">
      <h2>Contatti diretti</h2>
      <ul class="plain contact-list">
        <li>${contactItem('mail', c.email, (v) => `mailto:${v}`)}</li>
        <li>${contactItem('phone', c.phone, (v) => `tel:${v.replace(/[^\d+]/g, '')}`)}</li>
        <li>${wa ? `<a class="with-icon" href="https://wa.me/${esc(wa)}">${icon('whatsapp')}<span>Scrivimi su WhatsApp</span></a>` : `<span class="with-icon">${icon('whatsapp')}<span>${ph('WhatsApp [[393331234567]]')}</span></span>`}</li>
        ${real(c.pec) ? `<li>${contactItem('mail', c.pec, (v) => `mailto:${v}`, `PEC: ${c.pec}`)}</li>` : ''}
        <li class="addr">${icon('pin')}<span>${ph(a.street)}, ${ph(a.postalCode)} ${ph(a.city)} (${ph(a.province)})${a.note ? `<br>${esc(a.note)}` : ''}</span></li>
        <li class="addr">${icon('clock')}<span>${ph(c.availability)}<br><span class="small">${esc(c.replyTime)}</span></span></li>
      </ul>
    </aside>
  </div>
</section>

<section class="section section--sand" id="zona" aria-labelledby="zona-h">
  <div class="wrap two-col">
    <div>
      <p class="eyebrow">Dove</p>
      <h2 id="zona-h">Zona di intervento</h2>
      <p>${ph(cfg.area.intro)}</p>
      <ul class="chips">${liFromList(cfg.area.towns)}</ul>
      <ul class="modes modes--inline modes--plain">
        ${modeList(ctx).map(([ic, t]) => `<li>${icon(ic)}<div><h3>${esc(t)}</h3></div></li>`).join('')}
      </ul>
    </div>
    <div class="map" ${hasMap ? `data-map data-lat="${m.lat}" data-lon="${m.lon}" data-zoom="${m.zoom}"` : ''}>
      <div class="map__ph">
        ${icon('pin', 'icon icon--lg')}
        ${hasMap
          ? `<p><strong>Mappa interattiva</strong></p>
        <p class="small">Per rispettare la tua privacy la mappa non viene caricata finché non lo chiedi. Caricandola, il tuo browser si collega ai server di OpenStreetMap.</p>
        <button class="btn btn--primary btn--sm" type="button" data-map-load>Mostra la mappa</button>
        <p class="small"><a href="${esc(osmLink)}" rel="noopener" target="_blank">Apri su OpenStreetMap<span class="sr-only"> (si apre in una nuova scheda)</span></a></p>`
          : `<p><strong>La mappa comparirà qui</strong></p>
        <p class="small">${ph('[[Inserisci le coordinate dello studio in site.config.mjs → area.map]]')}</p>`}
      </div>
    </div>
  </div>
</section>`,
  };
}

// ═══ PRIVACY ══════════════════════════════════════════════════════════════
export function privacyPage(ctx) {
  const { cfg } = ctx;
  const b = cfg.business;
  const c = cfg.contact;
  const p = cfg.privacy;
  const a = c.address;
  return {
    path: 'privacy/',
    title: 'Informativa privacy',
    description: `Informativa sul trattamento dei dati personali (artt. 13-14 GDPR) di ${cfg.person.name}.`,
    jsonld: [],
    body: () => `
${pageHead('Informativa privacy', `Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR). Ultimo aggiornamento: ${p.updated}.`, 'Documenti legali')}
<section class="section section--tight">
  <div class="wrap wrap--narrow prose">
    <h2>1. Titolare del trattamento</h2>
    <p>${ph(b.legalName)}, ${esc(cfg.person.role.toLowerCase())} libera professionista, P.IVA ${ph(b.vatNumber)}, con sede in ${ph(a.street)}, ${ph(a.postalCode)} ${ph(a.city)} (${ph(a.province)}). Contatto per la privacy: ${ph(c.email)}.</p>

    <h2>2. Quali dati tratto e perché</h2>
    <h3>Navigazione su questo sito</h3>
    <p>Il sito non usa cookie, non ha strumenti di analisi o di tracciamento e non incorpora contenuti di terzi che si carichino da soli. Il servizio di hosting, come ogni server web, può registrare per brevi periodi dati tecnici di connessione (come l’indirizzo IP) per garantire sicurezza e funzionamento. Fornitore di hosting: ${ph(p.hosting)}.</p>
    <h3>Modulo di contatto, email, telefono e WhatsApp</h3>
    <p>Se mi scrivi, tratto i dati che fornisci (nome, recapiti, contenuto del messaggio) al solo fine di risponderti. Base giuridica: la tua richiesta e le misure precontrattuali adottate su tua istanza (art. 6.1.b GDPR). Conservazione: ${esc(p.retentionContact)}.</p>
    <p>Il modulo non è pensato per ricevere dati sulla salute: ti chiedo di non inserirli. Eventuali dati sulla salute saranno trattati solo nell’ambito del rapporto professionale, con l’apposita informativa e il consenso richiesti.</p>
    <p>Se usi WhatsApp, il messaggio passa anche dai servizi di WhatsApp (Meta), che agisce come titolare autonomo secondo la propria informativa.</p>
    <h3>Mappa</h3>
    <p>La mappa nella pagina Contatti è caricata solo se premi «Mostra la mappa». In tal caso il tuo browser si collega ai server di ${ph(p.mapProvider.name)}, che possono ricevere il tuo indirizzo IP. Informativa: <a href="${esc(p.mapProvider.url)}" rel="noopener" target="_blank">${esc(p.mapProvider.url)}</a>.</p>

    <h2>3. Destinatari</h2>
    <p>I dati non sono diffusi né ceduti. Il messaggio inviato col modulo viene inoltrato alla mia casella email tramite ${esc(p.formProcessor.name)} (${esc(p.formProcessor.note)}), in qualità di responsabile del trattamento: <a href="${esc(p.formProcessor.url)}" rel="noopener" target="_blank">informativa</a>. Possono accedere ai dati anche i fornitori dei servizi informatici e di posta di cui mi avvalgo, vincolati alla riservatezza.</p>
    <p>${ph('[[Chiara: se usi Web3Forms con server fuori dallo Spazio Economico Europeo, verifica con il tuo consulente che le garanzie per il trasferimento (clausole contrattuali standard) siano indicate qui.]]')}</p>

    <h2>4. I tuoi diritti</h2>
    <p>Puoi chiedere in qualsiasi momento accesso ai dati, rettifica, cancellazione, limitazione, opposizione e portabilità (artt. 15-22 GDPR), scrivendo a ${ph(c.email)}. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" rel="noopener" target="_blank">www.garanteprivacy.it</a>).</p>

    <h2>5. Natura del conferimento</h2>
    <p>Il conferimento dei dati richiesti nel modulo è necessario per ricevere risposta; senza, non posso ricontattarti.</p>

    <h2>6. Modifiche</h2>
    <p>Questa informativa può essere aggiornata; la data dell’ultimo aggiornamento è indicata in alto.</p>
    <p class="small">${ph('[[Documento predisposto come base di partenza: va verificato da un consulente privacy prima della pubblicazione definitiva, anche in vista del trattamento di dati sanitari nell’attività professionale.]]')}</p>
  </div>
</section>`,
  };
}

// ═══ COOKIE ═══════════════════════════════════════════════════════════════
export function cookiePage(ctx) {
  const { cfg } = ctx;
  const p = cfg.privacy;
  return {
    path: 'cookie/',
    title: 'Cookie policy',
    description: `Cookie policy del sito di ${cfg.person.name}: nessun cookie di profilazione né analitico.`,
    jsonld: [],
    body: (href) => `
${pageHead('Cookie policy', `Ultimo aggiornamento: ${p.updated}.`, 'Documenti legali')}
<section class="section section--tight">
  <div class="wrap wrap--narrow prose">
    <h2>In breve</h2>
    <p>Questo sito <strong>non installa cookie</strong> sul tuo dispositivo e non usa strumenti di analisi, pubblicità o tracciamento. Per questo non compare nessun banner dei cookie: non ci sono scelte da fare.</p>

    <h2>Che cosa viene memorizzato</h2>
    <ul>
      <li><strong>Cookie tecnici o di profilazione:</strong> nessuno.</li>
      <li><strong>Strumenti di statistica (analytics):</strong> nessuno.</li>
      <li><strong>Font:</strong> sono ospitati sul sito stesso, nessuna richiesta a servizi esterni.</li>
    </ul>

    <h2>Contenuti di terzi, solo se li richiedi</h2>
    <p>Nella pagina <a href="${href('contatti/')}">Contatti</a> la mappa si carica solo dopo il tuo click su «Mostra la mappa». In quel caso il contenuto proviene da ${ph(p.mapProvider.name)}, che può applicare proprie regole sui dati di navigazione (<a href="${esc(p.mapProvider.url)}" rel="noopener" target="_blank">informativa</a>). Se non premi il pulsante, nessuna connessione a terzi viene effettuata.</p>

    <h2>Modulo di contatto</h2>
    <p>Quando invii il modulo, il messaggio viene trasmesso al servizio ${esc(p.formProcessor.name)} per l’inoltro via email. Non viene installato alcun cookie sul tuo dispositivo da questo sito; per i dettagli sul trattamento dei dati vedi l’<a href="${href('privacy/')}">informativa privacy</a>.</p>

    <h2>Se in futuro cambierà</h2>
    <p>Se in futuro il sito adotterà strumenti diversi, questa pagina verrà aggiornata e, quando previsto dalla legge, comparirà una richiesta di consenso prima dell’attivazione.</p>
  </div>
</section>`,
  };
}

// ═══ 404 ══════════════════════════════════════════════════════════════════
export function notFoundPage(ctx) {
  return {
    path: '404.html',
    absolute: true,
    noindex: true,
    title: 'Pagina non trovata',
    description: 'La pagina cercata non esiste o è stata spostata.',
    jsonld: [],
    body: () => `
<section class="page-head"><div class="wrap">
  <p class="eyebrow">Errore 404</p>
  <h1>Questa pagina non c’è</h1>
  <p class="lead">Forse l’indirizzo è cambiato o contiene un errore. Puoi tornare alla pagina iniziale o scrivermi.</p>
  <div class="actions"><a class="btn btn--primary" href="${ctx.siteUrl}/">Torna alla home</a><a class="btn btn--ghost" href="${ctx.siteUrl}/contatti/">Contatti</a></div>
</div></section>`,
  };
}

export { stripPh };
