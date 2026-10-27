# Cartella `content/`

Qui va la **foto di Chiara**.

1. Copia un file chiamato esattamente **`ritratto.jpg`** in questa cartella
   (vanno bene anche `.jpeg`, `.png`, `.webp`).
2. Lancia `npm run build` (o fai push: lo fa la pubblicazione da sola).

Cosa succede alla foto:

- viene ritagliata in **verticale 4:5** (il ritaglio sceglie da solo la zona
  più "interessante", di norma il viso) e inserita nella cornice ad arco;
- viene prodotta in **AVIF, WebP e JPG** a quattro larghezze (320–880 px): il
  browser scarica solo quella che serve, di solito 20–60 KB;
- i metadati (EXIF, posizione GPS, modello di fotocamera) **vengono eliminati**;
- se la foto non c'è, il sito mostra il segnaposto con le iniziali.

Consigli per lo scatto: formato verticale o quadrato, almeno 1200 px sul lato
corto, luce naturale, sfondo semplice, viso e spalle ben visibili, nessun
filtro pesante. Il testo alternativo (per chi usa lo screen reader) si cambia
in `site.config.mjs` → `photo.alt`.
