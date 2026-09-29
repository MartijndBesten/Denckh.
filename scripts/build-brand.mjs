// Exporteert de Denckh-merkbestanden naar public/brand/ (SVG-masters, PNG's, vector-PDF's en een zip).
// Bron: exact het woordmerk van de site (src/components/wordmarkPaths.ts) en de krul uit het Open Graph-beeld
// (src/lib/ink/krul.ts). Hier wordt niets aan het logo veranderd; alleen samengesteld en weggeschreven.
// Gebruik: npm run brand
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { DOT, LETTERS, LIGATURE } from "../src/components/wordmarkPaths.ts";
import { KRUL_END, KRUL_PATH } from "../src/lib/ink/krul.ts";

const OUT = path.resolve("public/brand");
// kleuren = de tokens in src/app/globals.css
const C = { ink: "#211F1D", ochre: "#C29258", idea: "#B07F45", paper: "#F7F4EE", night: "#171614", nightInk: "#F2EEE6" };

// Signatuur zoals in public/og.png (1200 × 630): woordmerk geschaald 0,4472 met de linkerkant van de d op x 110 en de
// basislijn op y 417,5; de krul (300 × 380) linksboven op (830, 120), lijndikte 6, eindpunt r 15.
const S = 0.4472, TX = 110 - 11 * S, TY = 252 + 370 * S;

const wordmark = (ink) =>
  `<path d="${LETTERS}" fill="${ink}"/><rect x="${LIGATURE.x}" y="${LIGATURE.y}" width="${LIGATURE.width}" height="${LIGATURE.height}" rx="${LIGATURE.rx}" fill="${ink}"/>` +
  `<circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${C.ochre}"/>`;
const curl = `<path d="${KRUL_PATH}" fill="none" stroke="${C.idea}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${KRUL_END.x}" cy="${KRUL_END.y}" r="15" fill="${C.ochre}"/>`;
const signature = (ink) => `<g transform="translate(${TX.toFixed(3)} ${TY.toFixed(3)}) scale(${S})">${wordmark(ink)}</g><g transform="translate(830 120)">${curl}</g>`;

const MARKS = [
  { name: "compact", title: "denckh.", body: wordmark(C.ink), rough: [-20, -400, 1600, 440] },
  { name: "signature", title: "denckh. met de Denckh-krul", body: signature(C.ink), rough: [80, 130, 1060, 350] },
  { name: "signature-light", title: "denckh. met de Denckh-krul, licht", body: signature(C.nightInk), rough: [80, 130, 1060, 350] },
  { name: "curl", title: "Denckh-krul", body: curl, rough: [0, 0, 300, 380] },
];

const svgDoc = (title, body, vb, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" width="${w}" height="${h}" role="img" aria-label="${title}">\n<title>${title}</title>\n${body}\n</svg>\n`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

/** Tekent een SVG op een canvas; geeft een PNG (data-URL) of de strakke alpha-bbox terug. */
const raster = (svg, W, H, opts = {}) => page.evaluate(async ({ svg, W, H, opts }) => {
  const img = new Image(); img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg))); await img.decode();
  const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  if (opts.bg) { g.fillStyle = opts.bg; g.fillRect(0, 0, W, H); }
  const box = opts.box ?? [0, 0, W, H];
  g.drawImage(img, box[0], box[1], box[2], box[3]);
  if (!opts.measure) return c.toDataURL("image/png");
  const d = g.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 2) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return [x0, y0, x1 + 1, y1 + 1];
}, { svg, W, H, opts });
const save = (file, dataUrl) => fs.writeFileSync(path.join(OUT, file), Buffer.from(dataUrl.split(",")[1], "base64"));

const report = [];
for (const m of MARKS) {
  // 1 · strakke begrenzing: ruim renderen, alpha scannen, terugrekenen naar SVG-eenheden
  const [rx, ry, rw, rh] = m.rough, k = 4000 / rw, W = Math.round(rw * k), H = Math.round(rh * k);
  const [a, b, c, d] = await raster(svgDoc(m.title, m.body, m.rough, W, H), W, H, { measure: true });
  const pad = ((d - b) / k) * 0.02; // 2 % van de hoogte: geen afgesneden randen, geen loze marge
  const vb = [rx + a / k - pad, ry + b / k - pad, (c - a) / k + 2 * pad, (d - b) / k + 2 * pad].map((v) => +v.toFixed(2));
  const ratio = vb[2] / vb[3];

  // 2 · SVG-master (nominale maat 1000 px op de lange kant)
  const nw = ratio >= 1 ? 1000 : Math.round(1000 * ratio), nh = ratio >= 1 ? Math.round(1000 / ratio) : 1000;
  const svg = svgDoc(m.title, m.body, vb, nw, nh);
  fs.writeFileSync(path.join(OUT, `denckh-${m.name === "curl" ? "curl" : `logo-${m.name}`}.svg`), svg);
  const base = m.name === "curl" ? "denckh-curl" : `denckh-logo-${m.name}`;

  // 3 · PNG transparant, hoge resolutie (breed: 3000 px; krul: 2000 px lang) en een lichte webversie
  const big = m.name === "curl" ? [Math.round(2000 * ratio), 2000] : [3000, Math.round(3000 / ratio)];
  save(`${base}-transparent.png`, await raster(svg, big[0], big[1]));
  const web = m.name === "curl" ? [Math.round(600 * ratio), 600] : [1200, Math.round(1200 / ratio)];
  save(`${base}-transparent-web.png`, await raster(svg, web[0], web[1]));

  // 4 · op achtergrond (ruimte eromheen: 14 % van de breedte), en een vector-PDF voor drukwerk
  const bgFile = { compact: "light-bg", signature: "light-bg", "signature-light": "dark-preview" }[m.name];
  if (bgFile) {
    const Wb = 3000, inner = Wb * 0.72, hb = inner / ratio, Hb = Math.round(hb + Wb * 0.28);
    const bgName = bgFile === "dark-preview" ? "denckh-logo-signature-dark-preview" : `${base}-${bgFile}`;
    save(`${bgName}.png`, await raster(svg, Wb, Hb, { bg: bgFile === "dark-preview" ? C.night : C.paper, box: [(Wb - inner) / 2, (Hb - hb) / 2, inner, hb] }));
  }
  const pdfPage = await browser.newPage();
  const mmW = 120, mmH = +(mmW / ratio).toFixed(2);
  await pdfPage.setContent(`<html><head><style>@page{size:${mmW}mm ${mmH}mm;margin:0}html,body{margin:0}svg{display:block;width:${mmW}mm;height:${mmH}mm}</style></head><body>${svg}</body></html>`);
  fs.writeFileSync(path.join(OUT, `${base}.pdf`), await pdfPage.pdf({ width: `${mmW}mm`, height: `${mmH}mm`, printBackground: false }));
  await pdfPage.close();
  report.push(`${base}: viewBox ${vb.join(" ")}, png ${big.join("×")}`);
}
await browser.close();

// 5 · zip met alles
const zip = path.join(OUT, "denckh-brand-assets.zip");
fs.rmSync(zip, { force: true });
const files = fs.readdirSync(OUT).filter((f) => /\.(svg|png|pdf|txt)$/.test(f)).sort();
execFileSync("zip", ["-q", "-X", zip, ...files], { cwd: OUT });
console.log(report.join("\n"));
console.log(`${files.length} bestanden + ${path.relative(process.cwd(), zip)}`);
