// "Achter Denckh" (A4-PDF, één pagina): de achtergrond van Martijn, tekst van de eigenaar (september 2026), in de huisstijl:
// woordmerk en krul uit public/brand/, de lettertypes van de site, het portret van de site.
// Gebruik: npm run achter  →  public/downloads/denckh-achter-denckh.pdf
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BRAND = path.resolve("public/brand"), FONTS = path.resolve("public/fonts");
const OUT = path.resolve("public/downloads/denckh-achter-denckh.pdf");
// kleuren = de tokens in src/app/globals.css
const C = { ink: "#211F1D", graphite: "#6B655E", ochre: "#C29258", ochreDeep: "#8A6232", idea: "#B07F45", paper: "#F7F4EE", rule: "#E2DCD1" };
const svg = (name) => fs.readFileSync(path.join(BRAND, name), "utf8").replace(/ width="\d+" height="\d+"/, "").replace(/<title>.*?<\/title>\n?/, "");
const font = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(FONTS, f)).toString("base64");
const portrait = "data:image/jpeg;base64," + fs.readFileSync(path.resolve("public/images/portret.jpg")).toString("base64");
// de lettertypes van de site hebben geen →; een getekende pijl
const ARROW = `<svg class="arr" viewBox="0 0 18 10"><path d="M1 5h15M12 1l4 4-4 4"/></svg>`;

const PILLARS = [
  ["Techniek", "Van systeem tot toepassing.", ["Elektrotechnisch opgeleid", "Jarenlange ervaring in verlichtingstechniek", "Lichtsturing, smart lighting en smart building", "Elektrische en technische installaties", "Technische producten en systemen"]],
  ["Commercie", "Van eigenschap naar klantwaarde.", ["NIMA Sales A en B", "Jarenlange ervaring met klantcontact en verkoop", "Technische eigenschappen vertalen naar klantwaarde", "Ervaring met aansturen en organiseren"]],
  ["Concept en presentatie", "Van complex naar begrijpelijk.", ["Showroom- en beursstandconcepten", "Technische producten vertalen naar eenvoudige demonstraties", "Maquettes en 3D-presentaties laten ontwikkelen", "Interactieve productuitleg, presentaties en verkoopverhalen"]],
  ["Maken en ondernemen", "Van idee naar praktijk.", ["Deegh vanaf nul opgezet", "Productontwikkeling, prijsstelling, verpakking en verkoop", "Websites, webshops, calculaties en Excel-tools", "Praktisch ontwerpen, bouwen en verbouwen"]],
];
const STEPS = [["Begrijpen", "Wat is de vraag?"], ["Vereenvoudigen", "Wat moet iemand snappen?"], ["Vorm geven", "Welke vorm past?"], ["Maken", "Van idee naar iets dat werkt."]];
const OUTCOMES = ["interactieve uitleg", "prototype", "tool of calculator", "presentatie", "beurs- of showroomconcept", "website of webshop"];

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Achter Denckh · Martijn den Besten</title><style>
@font-face { font-family: "Fraunces Denckh"; src: url(${font("fraunces-denckh.woff2")}) format("woff2"); font-weight: 400 700; }
@font-face { font-family: "Manrope Denckh"; src: url(${font("manrope-denckh.woff2")}) format("woff2"); font-weight: 200 800; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: "Manrope Denckh", sans-serif; font-size: 9.2pt; line-height: 1.5; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; padding: 14mm 20mm 12mm; background: ${C.paper}; display: flex; flex-direction: column; overflow: hidden; }
h1, h2, h3 { font-family: "Fraunces Denckh", serif; font-weight: 560; letter-spacing: -0.03em; margin: 0; }
p { margin: 0; }
.label { font-size: 7.2pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.ochreDeep}; }
.top { display: flex; justify-content: space-between; align-items: flex-start; }
.top .mark svg { height: 7.5mm; width: auto; display: block; }
.top .label { margin-top: 1.5mm; }
.hero { position: relative; margin: 5mm 0 5mm; padding-right: 40mm; }
.hero h1 { font-size: 30pt; line-height: 1.02; margin-bottom: 2.5mm; }
.hero .sub { font-family: "Fraunces Denckh", serif; font-size: 13pt; letter-spacing: -0.01em; margin-bottom: 3mm; }
.hero .lead { color: ${C.graphite}; font-size: 9.8pt; max-width: 120mm; }
.hero .curl { position: absolute; right: 2mm; top: -3mm; }
.hero .curl svg { height: 32mm; width: auto; display: block; }
.pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 4.5mm 12mm; padding-top: 5mm; border-top: 0.3mm solid ${C.rule}; }
.pillar h2 { font-size: 13pt; margin: 1.2mm 0 2mm; letter-spacing: -0.015em; }
ul { margin: 0; padding: 0; list-style: none; }
li { position: relative; padding-left: 4.5mm; margin-bottom: 0.5mm; color: ${C.graphite}; }
li::before { content: ""; position: absolute; left: 0.5mm; top: 1.55mm; width: 1.7mm; height: 1.7mm; border-radius: 50%; background: ${C.ochre}; }
.thread { margin-top: 5mm; padding-top: 4.5mm; border-top: 0.3mm solid ${C.rule}; }
.thread h2 { font-size: 19pt; margin-bottom: 2mm; }
.thread > p { color: ${C.graphite}; max-width: 150mm; }
.steps { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 4.5mm; }
.steps::before { content: ""; position: absolute; left: 2mm; width: calc(75% + 3mm); top: 2mm; height: 0.4mm; background: ${C.idea}; opacity: 0.55; }
.step { position: relative; }
.step .dot { display: block; width: 4.2mm; height: 4.2mm; border-radius: 50%; background: ${C.ochre}; box-shadow: 0 0 0 1.2mm ${C.paper}; margin-bottom: 2.6mm; }
.step:last-child .dot { background: ${C.paper}; border: 0.45mm solid ${C.ink}; border-radius: 1mm; }
.step h3 { font-size: 11pt; letter-spacing: -0.015em; margin-bottom: 0.6mm; }
.step p { color: ${C.graphite}; font-size: 8.4pt; }
.outcomes { margin-top: 5mm; }
.outcomes p { margin-top: 1.4mm; font-size: 9.6pt; }
.outcomes span + span::before { content: "·"; margin: 0 1.6mm; color: ${C.ochre}; }
.arr { width: 3.4mm; height: 2mm; margin: 0 0.8mm; vertical-align: 0.1em; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.me { margin-top: auto; display: flex; align-items: center; gap: 6mm; padding: 4mm 0 4mm; border-top: 0.3mm solid ${C.rule}; }
.me img { width: 18mm; height: 18mm; border-radius: 50%; object-fit: cover; object-position: 50% 30%; }
.me h3 { font-size: 14pt; }
.me .muted { color: ${C.graphite}; font-size: 8.6pt; }
.me .site { margin-left: auto; text-align: right; }
.me .site b { font-weight: 700; }
footer { display: flex; align-items: center; gap: 6mm; font-size: 7.2pt; color: ${C.graphite}; padding-top: 4mm; border-top: 0.3mm solid ${C.rule}; }
footer span:last-child { margin-left: auto; }
.foot-mark svg { height: 3.4mm; width: auto; display: block; }
</style></head><body>
<section class="page">
  <div class="top"><span class="mark">${svg("denckh-logo-compact.svg")}</span><p class="label">Profiel · september 2026</p></div>
  <div class="hero">
    <h1>Achter Denckh</h1>
    <p class="sub">Techniek begrijpen. Ideeën eenvoudig maken.</p>
    <p class="lead">Denckh is van Martijn den Besten. Mijn achtergrond ligt niet in één creatief vakgebied, maar in de combinatie van techniek, commercie, conceptontwikkeling en praktisch realiseren.</p>
    <span class="curl">${svg("denckh-curl.svg")}</span>
  </div>
  <div class="pillars">${PILLARS.map(([k, t, items]) => `<div class="pillar"><p class="label">${k}</p><h2>${t}</h2><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("")}</div>
  <div class="thread">
    <h2>De rode draad.</h2>
    <p>Eerst begrijpen hoe iets werkelijk werkt. Daarna zoeken naar de eenvoudigste vorm waarin een ander het kan begrijpen, gebruiken of kopen. Dat kan digitaal zijn, maar ook fysiek.</p>
    <div class="steps">${STEPS.map(([t, d]) => `<div class="step"><span class="dot"></span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
  <div class="outcomes"><p class="label">Mogelijke uitkomsten</p><p>${OUTCOMES.map((o) => `<span>${o}</span>`).join("")}</p></div>
  <div class="me">
    <img src="${portrait}" alt="">
    <div><h3>Martijn den Besten</h3><p class="muted">techniek · commercie · concept · maken</p></div>
    <div class="site"><p><b>denckh.nl</b></p><p class="muted">info@denckh.nl</p></div>
  </div>
  <footer><span class="foot-mark">${svg("denckh-logo-compact.svg")}</span><span>van idee naar vorm · achter Denckh · september 2026</span><span>begrijpen ${ARROW} vereenvoudigen ${ARROW} vorm geven ${ARROW} maken</span></footer>
</section>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
if (process.env.ACHTER_PREVIEW) { await page.setViewportSize({ width: 794, height: 1123 }); await page.locator(".page").screenshot({ path: path.join(process.env.ACHTER_PREVIEW, "achter-denckh.png") }); }
const over = await page.$eval(".page", (el) => Math.round((el.scrollHeight - el.clientHeight) / 3.78));
if (over > 0) throw new Error(`Achter Denckh: inhoud loopt ${over} mm over`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
await browser.close();
console.log(`${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
