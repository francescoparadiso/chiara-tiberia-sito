# Da completare prima della pubblicazione reale

Tutto si inserisce in **un solo file: [`site.config.mjs`](site.config.mjs)**.
Ogni dato mancante è un testo tra doppie quadre, `[[così]]`, che nel sito appare
evidenziato in giallo. Finché ne resta uno, il sito è in modalità **anteprima**
(barra in alto, `noindex`, `robots.txt` che esclude i motori di ricerca).
Quando hai finito: `npm run build:final` rifiuta di procedere se ne resta anche solo uno.

## 1. Dati che servono a Chiara (obbligatori)

| Cosa | Dove nel file | Note |
|---|---|---|
| Partita IVA (11 cifre) | `business.vatNumber` | Compare nel footer e nei dati strutturati |
| Codice fiscale | `business.fiscalCode` | Facoltativo sul sito: se non lo vuoi mostrare, cancella la riga |
| Provincia dell'Ordine TSRM e PSTRP | `business.albo.province` | |
| Numero di iscrizione all'Albo | `business.albo.number` | Albo dei Terapisti Occupazionali |
| Compagnia e n. polizza RC professionale | `business.insurance` | Assicurazione obbligatoria per i professionisti sanitari |
| Email | `contact.email` | Quella che riceverà i messaggi del modulo |
| Telefono | `contact.phone` | |
| WhatsApp | `contact.whatsapp` | Solo cifre col prefisso, es. `393331234567` |
| Indirizzo dello studio | `contact.address.*` | Via, CAP, città, sigla provincia |
| Giorni e orari di reperibilità | `contact.availability` | |
| Comuni serviti a domicilio | `area.towns` | Aggiungi o togli voci |
| Coordinate dello studio | `area.map.lat / lon` | Da openstreetmap.org (tasto destro → «Mostra indirizzo»). Finché mancano la mappa non compare |
| Nome del fornitore di hosting | `privacy.hosting` | Si sa quando scegli l'hosting; compare nell'informativa privacy |

## 2. Foto

- File **`content/ritratto.jpg`** (vedi [`content/README.md`](content/README.md)).
- Formato verticale o quadrato, almeno 1200 px sul lato corto.
- La build la ritaglia, la converte in AVIF/WebP/JPG e toglie i metadati.
- Se vuoi, anche il testo alternativo: `photo.alt`.

## 3. Testi da rivedere e fare propri

I testi sono scritti in modo **generico e prudente**: nessuna promessa di risultati, nessuna
testimonianza, nessuna affermazione clinica. Vanno comunque letti e adattati da Chiara.

- **Formazione e titoli** (`about.training`): università, anno, corsi, esperienze.
- **Riga personale** (`about.personal`), se vuole.
- **Servizi** (`services.items`): l'elenco è un esempio. Conferma, modifica o metti `enabled: false`
  ai servizi che non offre. Togli poi la nota `services.draftNote`.
- **Prima valutazione** (`firstVisit`): durata e costo del primo incontro; verifica la frase sulla fattura / detrazioni
  con il commercialista.
- **FAQ** (`faq.items`): in particolare la risposta su **prescrizione medica** e quella su **costi e disdetta**.
- Modalità di lavoro (`modes`): ora *in studio* e *a domicilio* attivi, *online* spento.

## 4. Modulo di contatto

1. Vai su [web3forms.com](https://web3forms.com), inserisci l'email di Chiara e ricevi l'**Access Key**.
2. Incollala in `contact.formAccessKey`. (È pubblica per costruzione, non è un segreto.)
3. Fino ad allora il modulo non invia nulla da solo: apre il programma di posta (modalità `mailto`).

## 5. Aspetti legali: da far vedere a un professionista

Le pagine **Privacy** e **Cookie** sono una base ragionata, non una consulenza legale.

- Far verificare l'**informativa privacy** da un consulente (anche in vista dei dati sanitari trattati nello studio,
  che richiedono una informativa e un consenso dedicati, separati da quelli del sito).
- Verificare con il fornitore del modulo (Web3Forms) il tema dei **trasferimenti di dati fuori UE**.
- **Pubblicità sanitaria**: il sito è informativo e senza toni promozionali; conviene un controllo rispetto al Codice
  deontologico e alle indicazioni dell'Ordine di appartenenza.
- Se Chiara opera in regime forfettario/esente IVA, le diciture vanno **in fattura**, non nel sito.

## 6. Scelte fatte di default (modificabili)

- Solo nome personale, senza nome di studio né logo: il logo è un arco-porta con il nome in carattere tipografico.
- Colori: salvia, sabbia e un accento argilla; titoli in Fraunces, testo in Figtree (entrambi ospitati nel sito).
- Nessun cookie né analytics; mappa caricata solo su richiesta; nessun social.
- Immagine di anteprima per i social generata in `src/assets/img/og.png` (rigenerabile con `node scripts/make-og.mjs`).

## 7. Facoltativi

- PEC (`contact.pec`), logo definitivo (sostituire `src/assets/img/favicon.svg` e `logoMark` in `src/lib.mjs`),
  profili social, Google Business Profile (consigliato per la SEO locale: si fa fuori dal sito).
