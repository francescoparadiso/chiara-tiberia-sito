# Sito di Chiara Tiberia — terapista occupazionale

Sito vetrina **statico** (HTML/CSS/JS, nessun server, nessun database, nessun cookie).
Generato da un piccolo script Node **senza dipendenze obbligatorie**; la sola dipendenza di sviluppo è
`sharp`, per ottimizzare la foto.

> Stato: **anteprima con segnaposto**. Cosa manca è in [`DA-COMPLETARE.md`](DA-COMPLETARE.md).

## Struttura

```
site.config.mjs        ← L'UNICO file da modificare: dati, testi, indirizzo del sito
content/ritratto.jpg   ← la foto di Chiara (da aggiungere)
src/templates.mjs      ← il markup delle pagine
src/assets/            ← CSS, JS, font (self-hosted), favicon, immagine social
build.mjs              ← genera dist/
scripts/serve.mjs      ← piccolo server per l'anteprima locale
.github/workflows/pages.yml ← pubblicazione automatica su GitHub Pages
```

Pagine: Home · Chi sono · Servizi · Prima valutazione · Domande frequenti · Contatti (modulo, mappa, zona)
· Privacy · Cookie · 404.

## Comandi

```bash
npm install          # una volta sola
npm run build        # genera dist/ (segnaposto ammessi → anteprima noindex)
npm run serve        # anteprima su http://localhost:4173
npm start            # build + serve
npm run build:final  # build di produzione: FALLISCE se resta un [[segnaposto]]
```

## Pubblicare su GitHub Pages

1. Crea su GitHub un repository **pubblico** vuoto (es. `chiara-tiberia-sito`). Nei piani gratuiti Pages richiede un repo pubblico.
2. Dalla cartella del progetto:
   ```bash
   git remote add origin https://github.com/TUO-UTENTE/chiara-tiberia-sito.git
   git push -u origin main
   ```
3. Su GitHub: **Settings → Pages → Build and deployment → Source: «GitHub Actions»**.
4. Il workflow parte da solo a ogni push su `main`. Dopo un paio di minuti il sito è su
   `https://TUO-UTENTE.github.io/chiara-tiberia-sito/`.

Non serve configurare l'URL: tutti i link interni sono relativi, e l'indirizzo assoluto (canonical, sitemap,
Open Graph) viene ricavato da solo dal repository. Finché ci sono segnaposto la pagina è `noindex`.

## Passare al dominio proprio

Il punto unico da cambiare è **`site.url` in `site.config.mjs`**. Due strade:

### A) Dominio proprio, sito ancora su GitHub Pages
1. In `site.config.mjs`: `url: 'https://www.dominio.it'` e `writeCname: true`.
2. Presso chi gestisce il dominio, DNS: record **CNAME** `www` → `TUO-UTENTE.github.io`.
   Per il dominio "nudo" (senza www) quattro record **A**: `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`.
3. Su GitHub: **Settings → Pages → Custom domain**, poi spunta **Enforce HTTPS** (a DNS propagato).
4. Push: la build scrive anche il file `CNAME`.

### B) Hosting separato (FTP / cPanel / altro)
1. `url: 'https://www.dominio.it'` e `writeCname: false` (il CNAME serve solo a GitHub).
2. `npm run build:final` (verifica che non restino segnaposto).
3. Carica **il contenuto** di `dist/` nella cartella pubblica (`public_html`, `www`…).
4. Imposta HTTPS sul pannello dell'hosting. Su Apache, un `.htaccess` utile:
   ```apache
   ErrorDocument 404 /404.html
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
5. Invia `https://www.dominio.it/sitemap.xml` a Google Search Console.

Niente altro da cambiare: nessun `base`, nessun nome di repo scritto nel codice. Se in futuro vuoi che GitHub
continui a pubblicare in parallelo, basta lasciare il workflow com'è.

## Modulo di contatto

Scelta: **Web3Forms** (gratuito, senza cookie, funziona su siti statici) con ripiego su `mailto`.
Si attiva incollando l'Access Key in `contact.formAccessKey`. Include campo trappola anti-spam, controllo dei campi
accessibile, consenso privacy obbligatorio e un avviso a non scrivere dati sulla salute. Alternative se un giorno
servisse: Formspree (stesso meccanismo) o il proprio server.

## Accessibilità, prestazioni, SEO

- Contrasti verificati WCAG AA (testo ≥ 4,9:1 sulle superfici più chiare, ≥ 5,2:1 sui bottoni; bordi dei campi ≥ 3,4:1).
- Link «Vai al contenuto», focus visibile, menu da tastiera (Esc chiude), `aria-current`, un solo `h1` per pagina,
  nessun salto di livello nei titoli, ordine di lettura coerente, `lang="it"`.
- `prefers-reduced-motion` rispettato; stile di stampa; modalità ad alto contrasto di sistema.
- Solo tema chiaro. Mobile-first, nessun overflow orizzontale (verificato a 375 px).
- Nessuna richiesta a terzi: font ospitati sul sito (~80 KB), nessun analytics, mappa solo su richiesta.
- Foto: AVIF/WebP/JPG a 4 larghezze, `srcset`, EXIF rimosso.
- SEO: `title`/`description` per pagina, canonical, Open Graph/Twitter, `sitemap.xml`, `robots.txt`,
  dati strutturati schema.org (`MedicalBusiness` con `Person`, `WebSite`, `BreadcrumbList`, `FAQPage`):
  vengono emessi **solo i dati veri**, mai i segnaposto.

Per rifare i controlli: avvia `npm run serve` e incolla `scripts/audit-snippet.js` nella console del browser
(contrasto, alt, titoli, nomi accessibili, id duplicati).

## Note

- I font sono Fraunces e Figtree (licenza OFL, file di licenza in `src/assets/fonts/`).
- L'immagine social `og.png` si rigenera con `node scripts/make-og.mjs`.
- Le pagine usano cartelle (`/chi-sono/`) anziché `.html`: URL puliti ovunque, anche su hosting statici semplici.
