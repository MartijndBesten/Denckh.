// Prijslijst (A4-PDF, twee pagina's) uit dezelfde bron als de site: bedragen en teksten uit src/lib/prices.ts, woordmerk
// en krul uit public/brand/, de lettertypes van de site. De intro en de stappen van "Zo werkt het" komen uit de
// prijslijst van de eigenaar (september 2026); de site heeft daar geen eigen tekst voor.
// Gebruik: npm run prijslijst  →  public/downloads/denckh-prijslijst.pdf (+ scripts/prijslijst.bron.txt voor de test)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { DOMAIN_NOTE, FORM_PRICES, HOME_STOPS, HOURLY, INCLUDED, NOT_INCLUDED, PRICE_PDF, WEB_ADDRESS } from "../src/lib/prices.ts";

const BRAND = path.resolve("public/brand"), FONTS = path.resolve("public/fonts");
const OUT = path.join(path.resolve("public"), PRICE_PDF);
// kleuren = de tokens in src/app/globals.css
const C = { ink: "#211F1D", graphite: "#6B655E", ochre: "#C29258", ochreDeep: "#8A6232", idea: "#B07F45", paper: "#F7F4EE", rule: "#E2DCD1" };

const svg = (name) => fs.readFileSync(path.join(BRAND, name), "utf8").replace(/ width="\d+" height="\d+"/, "").replace(/<title>.*?<\/title>\n?/, "");
const font = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(FONTS, f)).toString("base64");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Dezelfde drie tekens als op de site (PriceLine): punt, schets, vorm.
const GLYPH = {
  punt: `<circle cx="32" cy="24" r="14" fill="none" stroke="${C.idea}" stroke-width="1.6" opacity="0.55"/><circle cx="32" cy="24" r="7" fill="${C.ochre}"/>`,
  schets: `<g fill="none" stroke="${C.idea}" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2" d="M15 15 C 26 12, 40 14, 50 13 C 51.5 21, 52 28, 50 35 C 38 36.5, 26 37, 14 35 C 13 27, 12.5 21, 16 16"/><path stroke-width="1.4" d="M20 23 C 27 20.5, 33 26, 44 22"/><path stroke-width="1.4" d="M21 29.5 C 26 28.5, 30 30.5, 36 29"/></g>`,
  vorm: `<g fill="none" stroke="${C.ink}" stroke-linecap="round"><rect x="11" y="9" width="42" height="30" rx="4" stroke-width="2"/><path d="M11 17 H53" stroke-width="1.4"/><rect x="17" y="23" width="13" height="10" rx="1.5" stroke-width="1.4"/><rect x="34" y="23" width="13" height="10" rx="1.5" stroke-width="1.4"/></g>`,
};

/** De prijslijn tussen de tekens (in mm): een golf, en voor de laatste halte een kleine lus zoals in de krul. */
function priceLine(xs, y, gw) {
  const f = (p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  return xs.slice(0, -1).map((x, i) => {
    const A = { x: x + gw / 2 + 2, y }, B = { x: xs[i + 1] - gw / 2 - 2, y }, L = B.x - A.x;
    const at = (t, off) => ({ x: A.x + L * t, y: y + off });
    const wave = Math.min(4, L * 0.08) * (i % 2 ? -1 : 1);
    if (i < xs.length - 2) return `M${f(A)} C ${f(at(0.32, -wave))}, ${f(at(0.68, wave))}, ${f(B)}`;
    const r = Math.min(3.6, L * 0.08), M = at(0.46, 0), E = { x: M.x + r * 0.4, y };
    return `M${f(A)} C ${f(at(0.18, -wave))}, ${f(at(0.34, wave * 0.6))}, ${f(M)}` +
      ` C ${f({ x: M.x + r * 2.4, y: y - r * 1.9 })}, ${f({ x: M.x - r * 1.2, y: y - r * 2.1 })}, ${f(E)}` +
      ` C ${f(at(0.72, wave * 0.5))}, ${f(at(0.86, -wave * 0.3))}, ${f(B)}`;
  }).join(" ");
}

const W = 170, GAP = 8, COL = (W - 2 * GAP) / 3, GW = 16; // inhoudsbreedte, kolommen en tekenbreedte in mm
const xs = [0, 1, 2].map((i) => i * (COL + GAP) + GW / 2);

const stops = HOME_STOPS.map((s) => `<div class="stop">
  <svg class="glyph" viewBox="0 0 64 48">${GLYPH[s.glyph]}</svg>
  <p class="label">${esc(s.label)}</p>
  <p class="price">${s.from ? '<span class="from">vanaf</span>' : ""}<span class="amount">${esc(s.price)}</span><span class="meta">${esc(s.meta)}</span></p>
  <p class="text">${esc(s.text)}</p>${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
</div>`).join("");

const form = (it) => `<div class="form">
  <div class="form__top"><h3>${esc(it.name)}</h3><p class="form__price"><span class="from">vanaf</span> €${it.price}</p></div>
  <p class="form__text">${esc(it.text)}</p>${it.aside ? `<p class="form__aside">${esc(it.aside)}</p>` : ""}${it.domain ? `<p class="form__domain">${esc(DOMAIN_NOTE)}</p>` : ""}
</div>`;

const STEPS = [
  ["Kennismaken", "Circa 20 minuten vrijblijvend: past de vraag bij Denckh?"],
  ["Intake", "Doel, materiaal, wensen en gewenste vorm scherp krijgen."],
  ["Prijs vooraf", "Bij duidelijke scope een vaste prijs. Anders eerst Even Denckh."],
  ["Maken", "Concept, ontwerp en realisatie in korte lijnen."],
  ["Feedback", "Eén gebundelde correctieronde standaard inbegrepen."],
  ["Opleveren", "Werkende vorm, link of bestanden zoals vooraf afgesproken."],
];

const foot = (n) => `<footer><span class="foot-mark">${svg("denckh-logo-compact.svg")}</span><span>van idee naar vorm · prijslijst september 2026</span><span>${n}/2</span></footer>`;

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Prijslijst Denckh · september 2026</title><style>
@font-face { font-family: "Fraunces Denckh"; src: url(${font("fraunces-denckh.woff2")}) format("woff2"); font-weight: 400 700; }
@font-face { font-family: "Manrope Denckh"; src: url(${font("manrope-denckh.woff2")}) format("woff2"); font-weight: 200 800; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: "Manrope Denckh", sans-serif; font-size: 9.2pt; line-height: 1.5; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; padding: 14mm 20mm 12mm; background: ${C.paper}; position: relative; overflow: hidden; break-after: page; display: flex; flex-direction: column; }
.page:last-child { break-after: auto; }
h1, h2, h3 { font-family: "Fraunces Denckh", serif; font-weight: 560; letter-spacing: -0.03em; margin: 0; }
h1 { font-size: 30pt; line-height: 1.02; margin-bottom: 3mm; }
h2 { font-size: 19pt; line-height: 1.1; margin-bottom: 2mm; }
h3 { font-size: 11pt; line-height: 1.25; letter-spacing: -0.015em; }
p { margin: 0; }
.muted { color: ${C.graphite}; }
.label { font-size: 7.2pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.ochreDeep}; margin-bottom: 1.6mm; }
.top { display: flex; align-items: flex-start; justify-content: space-between; }
.top .mark svg { height: 7.5mm; width: auto; display: block; }
.top .label { margin: 1.5mm 0 0; }
.hero { position: relative; margin: 6mm 0 4mm; padding-right: 42mm; }
.hero .sub { font-family: "Fraunces Denckh", serif; font-size: 12.5pt; letter-spacing: -0.01em; margin-bottom: 3mm; }
.hero .lead { color: ${C.graphite}; font-size: 9.8pt; max-width: 118mm; }
.hero .curl { position: absolute; right: 2mm; top: -4mm; }
.hero .curl svg { height: 34mm; width: auto; display: block; }
/* de prijslijn */
.line { position: relative; }
.line > svg { position: absolute; left: 0; top: 0; width: ${W}mm; height: 12mm; overflow: visible; }
.stops { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 ${GAP}mm; }
.glyph { width: ${GW}mm; height: 12mm; display: block; margin-bottom: 3mm; overflow: visible; }
.price { display: flex; align-items: baseline; gap: 1.4mm; margin-bottom: 1.6mm; }
.from { font-size: 7.6pt; color: ${C.graphite}; font-family: "Manrope Denckh", sans-serif; font-weight: 500; letter-spacing: 0; }
.amount { font-family: "Fraunces Denckh", serif; font-weight: 560; font-size: 24pt; line-height: 1; letter-spacing: -0.03em; border-bottom: 0.7mm solid ${C.ochre}; padding-bottom: 0.6mm; }
.meta { font-size: 7.4pt; font-weight: 600; color: ${C.graphite}; }
.text { color: ${C.graphite}; font-size: 8.4pt; line-height: 1.45; }
.note { margin-top: 2mm; padding-left: 3mm; border-left: 0.5mm solid ${C.idea}; font-size: 8pt; }
/* vormen */
.forms-head { display: flex; align-items: baseline; justify-content: space-between; margin: 5mm 0 1mm; padding-top: 4mm; border-top: 0.3mm solid ${C.rule}; }
.forms-head p { font-size: 8pt; color: ${C.graphite}; }
.forms { column-count: 2; column-gap: 10mm; }
.form { padding: 1.8mm 0 1.9mm; border-bottom: 0.3mm solid ${C.rule}; break-inside: avoid; }
.form__top { display: flex; align-items: baseline; justify-content: space-between; gap: 4mm; margin-bottom: 0.8mm; }
.form__price { font-family: "Fraunces Denckh", serif; font-weight: 560; font-size: 12pt; letter-spacing: -0.02em; white-space: nowrap; }
.form__price .from { margin-right: 0.6mm; }
.form__text { color: ${C.graphite}; font-size: 8pt; line-height: 1.4; }
.form__aside, .form__domain { font-size: 7.4pt; line-height: 1.35; margin-top: 0.8mm; }
.form__domain { color: ${C.ochreDeep}; }
/* pagina 2 */
.steps { position: relative; margin: 4mm 0 0; }
.steps::before { content: ""; position: absolute; left: 1.9mm; top: 2.6mm; bottom: 5.2mm; width: 0.4mm; background: ${C.idea}; opacity: 0.55; border-radius: 0.2mm; }
.step { display: grid; grid-template-columns: 8mm 34mm 1fr; align-items: baseline; padding: 1.35mm 0; }
.step .dot { width: 4.2mm; height: 4.2mm; border-radius: 50%; background: ${C.ochre}; box-shadow: 0 0 0 1.2mm ${C.paper}; position: relative; top: 0.8mm; }
.step:last-child .dot { background: ${C.paper}; border: 0.45mm solid ${C.ink}; border-radius: 1mm; }
.step h3 { font-size: 11pt; }
.step p { color: ${C.graphite}; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; margin-top: 6mm; padding-top: 5mm; border-top: 0.3mm solid ${C.rule}; }
.block { margin-top: 6mm; padding-top: 5mm; border-top: 0.3mm solid ${C.rule}; }
ul.two { columns: 2; column-gap: 12mm; }
ul.two li { break-inside: avoid; }
ul { margin: 2.6mm 0 0; padding: 0; list-style: none; }
li { position: relative; padding-left: 5mm; margin-bottom: 1.25mm; }
li::before { content: ""; position: absolute; left: 0.6mm; top: 1.55mm; width: 1.8mm; height: 1.8mm; border-radius: 50%; background: ${C.ochre}; }
ul.not li { color: ${C.graphite}; }
ul.not li::before { background: none; border: 0.3mm solid ${C.graphite}; width: 1.6mm; height: 1.6mm; }
.small { font-size: 8pt; color: ${C.graphite}; margin-top: 2.4mm; }
.hourly { font-family: "Fraunces Denckh", serif; font-weight: 560; font-size: 15pt; letter-spacing: -0.02em; margin: 2mm 0 1.2mm; }
.hourly .meta { font-family: "Manrope Denckh", sans-serif; letter-spacing: 0; margin-left: 1mm; }
.close { margin-top: auto; display: flex; align-items: baseline; justify-content: space-between; padding: 5mm 0 6mm; }
.close h2 { font-size: 17pt; margin: 0; }
.close p { font-size: 10pt; }
.close b { font-weight: 700; }
footer { display: flex; align-items: center; gap: 6mm; font-size: 7.2pt; color: ${C.graphite}; padding-top: 4mm; border-top: 0.3mm solid ${C.rule}; }
footer span:last-child { margin-left: auto; }
.foot-mark svg { height: 3.4mm; width: auto; display: block; }
.p1 footer { margin-top: auto; }
</style></head><body>

<section class="page p1">
  <div class="top"><span class="mark">${svg("denckh-logo-compact.svg")}</span><p class="label">Prijslijst · september 2026</p></div>
  <div class="hero">
    <h1>Wat kan een idee kosten?</h1>
    <p class="sub">Richtprijzen voor compacte ideeën die concreet mogen worden.</p>
    <p class="lead">Je hoeft nog niet precies te weten wat het moet worden. Na een korte kennismaking maken we de vraag scherp. Daarna weet je vooraf wat Denckh voor je kan maken en wat dat kost.</p>
    <span class="curl">${svg("denckh-curl.svg")}</span>
  </div>
  <div class="line">
    <svg viewBox="0 0 ${W} 12"><path d="${priceLine(xs, 6, GW)}" fill="none" stroke="${C.idea}" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="stops">${stops}</div>
  </div>
  <div class="forms-head"><h2>Richtprijzen per vorm.</h2><p>Alle bedragen zijn vanafprijzen, exclusief btw.</p></div>
  <div class="forms">${FORM_PRICES.map(form).join("")}</div>
  ${foot(1)}
</section>

<section class="page p2">
  <div class="top"><span class="mark">${svg("denckh-logo-compact.svg")}</span><p class="label">Prijslijst · september 2026</p></div>
  <div style="margin-top:11mm">
    <h1 style="font-size:26pt">Zo werkt het.</h1>
    <p class="muted" style="font-size:9.8pt">Geen groot bureauproces. Eerst begrijpen wat er nodig is, daarna gericht maken.</p>
  </div>
  <div class="steps">${STEPS.map(([t, d]) => `<div class="step"><span class="dot"></span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
  <div class="cols">
    <div><h2>Wat zit er standaard bij?</h2><ul>${INCLUDED.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <h3 style="margin-top:8mm">Los vervolgwerk</h3><p class="hourly">${esc(HOURLY.price)} per uur<span class="meta">excl. btw</span></p><p class="small" style="margin-top:0">${esc(HOURLY.note)}</p></div>
    <div><h2>Niet standaard inbegrepen</h2><ul class="not">${NOT_INCLUDED.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="small">Heb je iets hiervan nodig? Dan spreken we het vooraf apart af.</p></div>
  </div>
  <div class="block">
    <h3>Je eigen webadres en hosting</h3><p class="small" style="color:${C.ochreDeep}">Website, Uitgebreidere website en Webshop: ${esc(DOMAIN_NOTE.charAt(0).toLowerCase() + DOMAIN_NOTE.slice(1))}</p>
    <ul class="not two">${WEB_ADDRESS.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </div>
  <div class="close"><h2>Benieuwd wat jouw idee kost?</h2><p>Vertel je idee: <b>info@denckh.nl</b> · denckh.nl</p></div>
  ${foot(2)}
</section>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
// voorbeeld als PNG per pagina: PRIJSLIJST_PREVIEW=map npm run prijslijst
if (process.env.PRIJSLIJST_PREVIEW) {
  await page.setViewportSize({ width: 794, height: 1123 });
  const pages = await page.$$(".page");
  for (const [i, el] of pages.entries()) await el.screenshot({ path: path.join(process.env.PRIJSLIJST_PREVIEW, `prijslijst-${i + 1}.png`) });
}
// controle: elke pagina past precies op één A4, en geen enkel bedrag of tekstje valt weg
const overflow = await page.$$eval(".page", (els) => els.map((el, i) => [i + 1, Math.round((el.scrollHeight - el.clientHeight) / 3.78)]).filter(([, mm]) => mm > 0));
if (overflow.length) throw new Error(`Prijslijst: inhoud loopt over (pagina, mm): ${JSON.stringify(overflow)}`);
const text = await page.evaluate(() => document.body.innerText);
const missing = [...FORM_PRICES.map((f) => `€${f.price}`), ...HOME_STOPS.map((s) => s.price), ...FORM_PRICES.map((f) => f.name)].filter((t) => !text.includes(t));
if (missing.length) throw new Error(`Prijslijst: ontbreekt ${missing.join(", ")}`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
await browser.close();

// vingerafdruk van de bron: de e2e-test meldt het als prices.ts is gewijzigd zonder een nieuwe prijslijst
const hash = crypto.createHash("sha256").update(fs.readFileSync(path.resolve("src/lib/prices.ts"))).digest("hex");
fs.writeFileSync(path.resolve("scripts/prijslijst.bron.txt"), `${hash}  src/lib/prices.ts\n`);
console.log(`${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
