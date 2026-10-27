// ═══════════════════════════════════════════════════════════════════════════
// build.mjs — generatore statico senza dipendenze obbligatorie.
//
//   node build.mjs            → genera dist/ (anteprima, segnaposto ammessi)
//   node build.mjs --strict   → come sopra, ma FALLISCE se resta un [[segnaposto]]
//   opzioni: --out=cartella  --config=altro-file.mjs (per prove)
//
// Legge site.config.mjs, compone le pagine da src/templates.mjs, copia
// src/assets/, ottimizza il ritratto (content/ritratto.*) se `sharp` c'è,
// scrive sitemap.xml, robots.txt, .nojekyll e (se richiesto) CNAME.
// Tutti i link interni sono RELATIVI: dist/ funziona identico a
// https://utente.github.io/repo/ e a https://www.dominio.it/.
// ═══════════════════════════════════════════════════════════════════════════
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { collectPlaceholders, real, stripPh } from './src/lib.mjs';
import * as T from './src/templates.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const configArg = args.find((a) => a.startsWith('--config='))?.slice(9);
const cfg = (await import(configArg ? pathToFileURL(resolve(configArg)).href : './site.config.mjs')).default;
const outDir = resolve(here, args.find((a) => a.startsWith('--out='))?.slice(6) || 'dist');

// ── 1. Indirizzo del sito ────────────────────────────────────────────────
function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (cfg.site.url) return cfg.site.url;
  const repo = process.env.GITHUB_REPOSITORY; // "utente/repo" (solo su GitHub Actions)
  if (repo) {
    const [owner, name] = repo.split('/');
    // Un repo chiamato <utente>.github.io è un sito "utente", senza sottocartella.
    return name.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${name}`
      : `https://${owner.toLowerCase()}.github.io/${name}`;
  }
  return 'http://localhost:4173';
}
const siteUrl = resolveSiteUrl().replace(/\/+$/, '');

// ── 2. Segnaposto ────────────────────────────────────────────────────────
const placeholders = collectPlaceholders(cfg);
const preview = placeholders.length > 0;
if (strict && preview) {
  console.error(`\n✗ Build finale rifiutata: restano ${placeholders.length} segnaposto in site.config.mjs:\n`);
  for (const p of placeholders) console.error(`  - ${p.path}: ${p.text}`);
  console.error('\nSostituiscili (vedi DA-COMPLETARE.md) e rilancia.\n');
  process.exit(1);
}

// ── 3. Cartella di uscita + asset statici ────────────────────────────────
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(join(here, 'src/assets'), join(outDir, 'assets'), { recursive: true });
await writeFile(join(outDir, '.nojekyll'), '');

// ── 4. Ritratto ottimizzato ──────────────────────────────────────────────
async function buildPhoto() {
  const dir = join(here, 'content');
  const files = existsSync(dir) ? await readdir(dir) : [];
  const src = files.find((f) => /^ritratto\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
  if (!src) return null;
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('! content/ritratto.* trovato ma "sharp" non è installato: esegui `npm install`. Foto ignorata.');
    return null;
  }
  const widths = [320, 480, 640, 880];
  const ratio = 5 / 4; // ritratto verticale 4:5
  const res = { avif: [], webp: [], jpg: [], width: 880, height: Math.round(880 * ratio) };
  const imgDir = join(outDir, 'assets/img');
  await mkdir(imgDir, { recursive: true });
  for (const w of widths) {
    const h = Math.round(w * ratio);
    const base = sharp(join(dir, src), { failOn: 'none' })
      .rotate() // rispetta l'orientamento EXIF
      .resize(w, h, { fit: 'cover', position: 'attention' }); // sharp toglie da solo EXIF/GPS
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(join(imgDir, `ritratto-${w}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(join(imgDir, `ritratto-${w}.webp`));
    await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(join(imgDir, `ritratto-${w}.jpg`));
    res.avif.push({ w, url: `assets/img/ritratto-${w}.avif` });
    res.webp.push({ w, url: `assets/img/ritratto-${w}.webp` });
    res.jpg.push({ w, url: `assets/img/ritratto-${w}.jpg` });
  }
  return res;
}
const photo = await buildPhoto();
const ogImage = existsSync(join(here, 'src/assets/img/og.png'));

// ── 5. Dati strutturati (solo valori veri: mai segnaposto) ───────────────
const c = cfg.contact;
const a = c.address;
const towns = cfg.area.towns.filter((t) => real(t));
const addressOk = [a.street, a.postalCode, a.city, a.province].every((v) => real(v));
const base = [
  {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: `${cfg.person.name} — ${cfg.person.role}`,
    inLanguage: cfg.site.lang,
  },
  {
    '@type': 'MedicalBusiness',
    '@id': `${siteUrl}/#studio`,
    name: `${cfg.person.name} — ${cfg.person.role}`,
    url: `${siteUrl}/`,
    description: stripPh(cfg.home.lead),
    ...(ogImage && { image: `${siteUrl}/assets/img/og.png` }),
    ...(real(c.email) && { email: c.email }),
    ...(real(c.phone) && { telephone: c.phone }),
    ...(real(cfg.business.vatNumber) && { vatID: `IT${cfg.business.vatNumber}` }),
    ...(addressOk && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        postalCode: a.postalCode,
        addressLocality: a.city,
        addressRegion: a.province,
        addressCountry: 'IT',
      },
    }),
    ...(towns.length && { areaServed: towns.map((name) => ({ '@type': 'City', name })) }),
    founder: { '@id': `${siteUrl}/#chiara` },
    employee: { '@id': `${siteUrl}/#chiara` },
  },
  {
    '@type': 'Person',
    '@id': `${siteUrl}/#chiara`,
    name: cfg.person.name,
    givenName: cfg.person.givenName,
    familyName: cfg.person.familyName,
    jobTitle: cfg.person.role,
    url: `${siteUrl}/chi-sono/`,
    worksFor: { '@id': `${siteUrl}/#studio` },
    memberOf: { '@type': 'Organization', name: cfg.business.albo.orderShort },
  },
];
const crumbs = (name, path) => [
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name, item: `${siteUrl}/${path}` },
    ],
  },
];

// ── 6. Pagine ────────────────────────────────────────────────────────────
const ctx = { cfg, siteUrl, preview, photo, ogImage, year: new Date().getFullYear(), jsonld: { base, crumbs } };
const pages = [
  T.homePage, T.aboutPage, T.servicesPage, T.firstVisitPage,
  T.faqPage, T.contactPage, T.privacyPage, T.cookiePage, T.notFoundPage,
].map((fn) => fn(ctx));

for (const page of pages) {
  const file = page.path.endsWith('.html') ? join(outDir, page.path) : join(outDir, page.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, T.layout(ctx, page));
}

// ── 7. sitemap, robots, CNAME ────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => !p.noindex);
await writeFile(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((p) => `  <url><loc>${siteUrl}/${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(
  join(outDir, 'robots.txt'),
  preview
    ? '# Anteprima con segnaposto: non indicizzare.\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
if (cfg.site.writeCname) {
  const host = new URL(siteUrl).host;
  await writeFile(join(outDir, 'CNAME'), `${host}\n`);
}

// ── 8. Riepilogo ─────────────────────────────────────────────────────────
console.log(`✓ ${pages.length} pagine → ${outDir}`);
console.log(`  URL del sito:  ${siteUrl}`);
console.log(`  Ritratto:      ${photo ? 'ottimizzato (AVIF/WebP/JPG)' : 'segnaposto (nessun content/ritratto.*)'}`);
console.log(`  Segnaposto:    ${placeholders.length}${preview ? '  → modalità ANTEPRIMA (noindex)' : '  → pronto per l’indicizzazione'}`);
if (cfg.site.writeCname) console.log(`  CNAME:         ${new URL(siteUrl).host}`);
