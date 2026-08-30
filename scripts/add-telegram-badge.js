/* Add a compact Telegram mark without covering the creative or its copy. */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  throw new Error("Usage: node scripts/add-telegram-badge.js <input> <output>");
}

const source = sharp(input);
const meta = await source.metadata();
if (!meta.width || !meta.height) throw new Error("Cannot determine image dimensions");

const diameter = Math.max(68, Math.min(116, Math.round(meta.width * 0.11)));
const padding = Math.max(18, Math.round(diameter * 0.24));
const plane = `
  <svg width="${diameter}" height="${diameter}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#061225" flood-opacity="0.28"/>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="46" fill="#2AABEE" filter="url(#shadow)"/>
    <path d="M19 47.2 76.4 25c2.7-1 5.1 2.5 3.7 5.4L61.6 76.8c-1 2.6-4.7 3.1-6.4.8L43.4 60.4 31 70.5c-1.4 1.1-3.5.1-3.4-1.7l1.6-18.1-9.7-3.7c-3.2-1.2-3.1-5.7-.5-6.7Z" fill="#fff"/>
    <path d="M30.4 51 65.5 34.4 43.5 58.9" fill="none" stroke="#2AABEE" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

await fs.promises.mkdir(path.dirname(output), { recursive: true });
await source
  .composite([{ input: Buffer.from(plane), left: meta.width - diameter - padding, top: padding }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
