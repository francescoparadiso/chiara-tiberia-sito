// Genera src/assets/img/og.png (1200×630, immagine di anteprima per i social)
// dal nome e dal ruolo in site.config.mjs. Si lancia a mano, una volta:
//   node scripts/make-og.mjs
// Il file va poi committato. (Usa i font di sistema: Georgia / Segoe UI.)
import sharp from 'sharp';
import cfg from '../site.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/assets/img/og.png');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FBF7F0"/>
  <circle cx="1080" cy="40" r="330" fill="#E1EBE1"/>
  <circle cx="60" cy="640" r="260" fill="#F4E1D6"/>
  <g transform="translate(110 150) scale(6)">
    <path d="M6 37V19a14 14 0 0 1 28 0v18z" fill="#35544A"/>
    <path d="M14 37V20.5a6 6 0 0 1 12 0V37" fill="#FBF7F0"/>
    <circle cx="20" cy="26" r="1.7" fill="#A24A2D"/>
  </g>
  <text x="400" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="600" fill="#1E2A24">${esc(cfg.person.name)}</text>
  <text x="404" y="360" font-family="'Segoe UI', Arial, sans-serif" font-size="40" fill="#35544A">${esc(cfg.person.role)}</text>
  <rect x="404" y="400" width="96" height="5" rx="2.5" fill="#A24A2D"/>
  <text x="404" y="460" font-family="'Segoe UI', Arial, sans-serif" font-size="28" fill="#55645B">Le attività di ogni giorno, al centro del percorso.</text>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log('✓', out);
