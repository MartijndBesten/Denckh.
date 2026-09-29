// Merkoverzicht (A4-PDF) uit de echte merkbestanden: logo's uit public/brand/*.svg, de lettertypes van de site
// (public/fonts) en de kleurtokens. Wordt aangeroepen door build-brand.mjs; schrijft public/brand/denckh-merkoverzicht.pdf.
import fs from "node:fs";
import path from "node:path";

const FONTS = path.resolve("public/fonts");

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
/** Pijl als vorm: de afgeslankte lettertypes van de site hebben geen →. */
const ARROW = `<svg class="arr" viewBox="0 0 18 10" aria-hidden="true"><path d="M1 5h15M12 1l4 4-4 4"/></svg>`;

export async function buildGuide({ browser, out, C }) {
  const svg = (name) => fs.readFileSync(path.join(out, name), "utf8").replace(/ width="\d+" height="\d+"/, "").replace(/<title>.*?<\/title>\n?/, "");
  const font = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(FONTS, f)).toString("base64");
  const og = "data:image/png;base64," + fs.readFileSync(path.resolve("public/og.png")).toString("base64");

  const colors = [
    ["Papier", C.paper, "Basis en achtergrond. Warm, nooit spierwit."],
    ["Papier 2", "#EFE9DE", "Zachte vlakken, kaders."],
    ["Inkt", C.ink, "Woordmerk, koppen, tekst. De vorm."],
    ["Grafiet", "#6B655E", "Lopende tekst, uitleg."],
    ["Potlood", "#A9A198", "Hulplijnen, zoals de stippellijn in de hero."],
    ["Idee", C.idea, "De lijn van de krul, getekende lijnen."],
    ["Oker", C.ochre, "De punt, het eindpunt van de krul, accent."],
    ["Oker diep", "#8A6232", "Kleine tekst in oker (leesbaar op papier)."],
    ["Menie", "#B63F26", "Denckh kijkt: analyse, aantekeningen. Spaarzaam."],
    ["Nacht", C.night, "Donkere achtergrond."],
    ["Nacht-inkt", C.nightInk, "Woordmerk en tekst op donker."],
  ];

  const files = [
    ["Dagelijks, social (WhatsApp, Instagram, LinkedIn)", "denckh-logo-signature-light-bg.png · denckh-logo-compact-light-bg.png"],
    ["Transparant plaatsen (Canva, PowerPoint, Word)", "denckh-logo-…-transparent.png"],
    ["E-mailhandtekening, klein op het web", "denckh-logo-compact-transparent-web.png"],
    ["Donkere achtergrond", "denckh-logo-signature-light-transparent.png"],
    ["Drukwerk", "de .pdf- of .svg-bestanden (vector, schaalbaar)"],
    ["Krul als los element", "denckh-curl.svg · denckh-curl-transparent.png"],
  ];

  const foot = (n) => `<footer><span class="foot-mark">${svg("denckh-logo-compact.svg")}</span><span>Merkoverzicht · september 2026</span><span>${n}</span></footer>`;

  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
@font-face { font-family: "Fraunces Denckh"; src: url(${font("fraunces-denckh.woff2")}) format("woff2"); font-weight: 400 700; }
@font-face { font-family: "Manrope Denckh"; src: url(${font("manrope-denckh.woff2")}) format("woff2"); font-weight: 200 800; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: "Manrope Denckh", sans-serif; font-size: 9.6pt; line-height: 1.55; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; padding: 20mm 20mm 16mm; background: ${C.paper}; position: relative; overflow: hidden; break-after: page; display: flex; flex-direction: column; }
.page:last-child { break-after: auto; }
h1, h2, h3, .display { font-family: "Fraunces Denckh", serif; font-weight: 560; letter-spacing: -0.03em; margin: 0; }
h1 { font-size: 34pt; line-height: 1; }
h2 { font-size: 26pt; line-height: 1.05; margin-bottom: 3mm; }
h3 { font-size: 13pt; line-height: 1.2; margin: 0 0 1.2mm; letter-spacing: -0.015em; }
p { margin: 0 0 2.4mm; }
.lead { font-size: 11.5pt; color: #6B655E; max-width: 150mm; margin-bottom: 8mm; }
.muted { color: #6B655E; }
.label { font-size: 7.4pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #8A6232; margin: 0 0 2mm; }
.arr { width: 3.6mm; height: 2mm; margin: 0 1mm; vertical-align: 0.15em; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
footer { margin-top: auto; display: flex; align-items: center; gap: 6mm; font-size: 7.4pt; color: #6B655E; padding-top: 5mm; border-top: 0.3mm solid #E2DCD1; }
footer span:last-child { margin-left: auto; }
.foot-mark svg { height: 3.6mm; width: auto; display: block; }
.panel { background: #EFE9DE; border-radius: 2mm; padding: 8mm; display: flex; align-items: center; justify-content: center; }
.panel svg { display: block; height: auto; }
.panel.night { background: ${C.night}; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 8mm; }
.cap { font-size: 8.4pt; color: #6B655E; margin: 2mm 0 0; }
.cap b { color: ${C.ink}; font-weight: 650; }
.file { font-size: 7.6pt; color: #8A6232; }
/* cover */
.cover-mark { margin: 24mm 0 10mm; }
.cover-mark svg { width: 150mm; height: auto; display: block; }
.tagline { font-size: 15pt; color: #6B655E; margin: 0 0 22mm; }
.plv { display: flex; align-items: center; gap: 6mm; margin: 6mm 0 10mm; }
.plv figure { margin: 0; text-align: center; font-size: 8pt; color: #6B655E; }
.plv svg.step { width: 34mm; height: 22mm; display: block; margin-bottom: 1.5mm; }
.strip { display: grid; grid-template-columns: repeat(5, 1fr); height: 18mm; border-radius: 2mm; overflow: hidden; }
.strip div { display: flex; align-items: flex-end; padding: 2mm 2.5mm; font-size: 7pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
/* kleur */
table { width: 100%; border-collapse: collapse; }
td { padding: 2.2mm 2mm; border-bottom: 0.3mm solid #E2DCD1; vertical-align: middle; }
td.sw { width: 13mm; padding: 1.2mm 0; }
td.sw div { width: 11mm; height: 8mm; border-radius: 1mm; box-shadow: inset 0 0 0 0.25mm rgba(33,31,29,.12); }
td.name { font-weight: 650; width: 26mm; }
td.hex { font-variant-numeric: tabular-nums; width: 20mm; }
td.rgb { font-variant-numeric: tabular-nums; width: 31mm; color: #6B655E; font-size: 8.2pt; white-space: nowrap; }
/* typografie */
.specimen { font-family: "Fraunces Denckh", serif; font-weight: 560; letter-spacing: -0.04em; font-size: 40pt; line-height: 0.95; margin: 2mm 0 5mm; }
.dot { display: inline-block; width: 0.2em; height: 0.2em; border-radius: 50%; background: ${C.ochre}; margin-left: 0.04em; }
.alphabet { font-size: 12pt; color: #6B655E; margin-bottom: 6mm; letter-spacing: 0.01em; }
.alphabet.serif { font-family: "Fraunces Denckh", serif; font-size: 15pt; letter-spacing: -0.01em; }
.scale > div { display: grid; grid-template-columns: 34mm 1fr; gap: 4mm; align-items: baseline; padding: 2.4mm 0; border-bottom: 0.3mm solid #E2DCD1; }
.scale .k { font-size: 7.6pt; color: #6B655E; }
ul, ol { margin: 0 0 3mm; padding-left: 4.5mm; }
li { margin-bottom: 1mm; }
.og { width: 100%; border-radius: 2mm; display: block; box-shadow: 0 0 0 0.3mm #E2DCD1; }
.note { border-left: 0.6mm solid #B63F26; padding: 1mm 0 1mm 4mm; margin: 4mm 0; }
.icon { width: 16mm; height: 12mm; display: block; margin-bottom: 1.5mm; }
</style></head><body>

<section class="page">
  <p class="label">Merkoverzicht</p>
  <div class="cover-mark">${svg("denckh-logo-signature.svg")}</div>
  <p class="tagline">van idee naar vorm</p>
  <h2>Punt, lijn, vorm.</h2>
  <p class="lead">Denckh is een kleine conceptstudio van één persoon. De visuele taal draait om één eenvoudig principe: een punt wordt een lijn, en de lijn wordt een vorm. De okeren punt is het idee. De lijn is het denken en maken. De vorm verschilt per toepassing.</p>
  <div class="plv">
    <figure><svg class="step" viewBox="0 0 100 64"><circle cx="50" cy="32" r="9" fill="${C.ochre}"/></svg>punt</figure>
    ${ARROW}
    <figure><svg class="step" viewBox="0 0 100 64"><path d="M10 42 C 26 14, 42 54, 58 32 S 82 16, 90 24" fill="none" stroke="${C.idea}" stroke-width="3" stroke-linecap="round"/></svg>lijn</figure>
    ${ARROW}
    <figure><svg class="step" viewBox="0 0 100 64"><rect x="16" y="10" width="68" height="44" rx="6" fill="none" stroke="${C.ink}" stroke-width="2.4"/><path d="M16 22h68" stroke="${C.ink}" stroke-width="1.6"/><rect x="24" y="30" width="22" height="16" rx="2" fill="none" stroke="${C.ink}" stroke-width="1.4"/><rect x="54" y="30" width="22" height="16" rx="2" fill="none" stroke="${C.ink}" stroke-width="1.4"/></svg>vorm</figure>
  </div>
  <div class="strip">
    <div style="background:${C.paper};box-shadow:inset 0 0 0 0.3mm #E2DCD1">Papier</div>
    <div style="background:${C.ink};color:${C.nightInk}">Inkt</div>
    <div style="background:${C.ochre};color:${C.ink}">Oker</div>
    <div style="background:#6B655E;color:${C.nightInk}">Grafiet</div>
    <div style="background:#B63F26;color:${C.nightInk}">Menie</div>
  </div>
  ${foot(1)}
</section>

<section class="page">
  <h2>1. Logo</h2>
  <p class="lead">Het woordmerk blijft rustig. De krul is een los signatuurelement en hoeft niet overal naast het logo te staan. Gebruik altijd de bestanden; typ het logo nooit opnieuw en stel de signatuur niet zelf samen.</p>
  <p class="label">Compact woordmerk</p>
  <div class="panel" style="padding:10mm 8mm">${svg("denckh-logo-compact.svg").replace("<svg ", '<svg style="width:120mm" ')}</div>
  <p class="cap"><b>Standaard.</b> Header, documenten, kleine toepassingen, overal waar rust belangrijk is. <span class="file">denckh-logo-compact</span></p>
  <div class="grid2" style="margin-top:7mm">
    <div><p class="label">Signatuur</p><div class="panel">${svg("denckh-logo-signature.svg").replace("<svg ", '<svg style="width:66mm" ')}</div>
      <p class="cap"><b>Waar ruimte is.</b> Social, deelbeelden, presentaties, covers. <span class="file">denckh-logo-signature</span></p></div>
    <div><p class="label">Lichte signatuur</p><div class="panel night">${svg("denckh-logo-signature-light.svg").replace("<svg ", '<svg style="width:66mm" ')}</div>
      <p class="cap"><b>Op donker.</b> Lichte letters, punt en krul blijven oker. <span class="file">denckh-logo-signature-light</span></p></div>
    <div><p class="label">De krul</p><div class="panel" style="height:38mm">${svg("denckh-curl.svg").replace("<svg ", '<svg style="height:28mm;width:auto" ')}</div>
      <p class="cap"><b>Los element.</b> Als herkenning, ruim en luchtig. <span class="file">denckh-curl</span></p></div>
    <div><p class="label">Schrijfwijze</p>
      <p style="margin-top:1mm">Woordmerk: <b>denckh.</b> (kleine letters, okeren punt)<br>In lopende tekst: <b>Denckh</b> (zonder punt)<br>Tagline: <b>van idee naar vorm</b> (kleine letters, geen punt)</p>
      <p class="muted" style="font-size:8.6pt">Op de website is de punt levend: na je tekening neemt hij heel klein de vorm van je idee aan. In print en in de bestanden is hij altijd rond en oker.</p></div>
  </div>
  <div class="note"><p style="margin:0"><b>Niet doen.</b> Geen ander lettertype in het woordmerk, geen extra icoon naast het logo, geen schaduwen of verlopen, het logo niet uitrekken of bijsnijden, de krul niet geometrisch gladmaken en de punt niet van kleur laten wisselen.</p></div>
  ${foot(2)}
</section>

<section class="page">
  <h2>2. Kleur</h2>
  <p class="lead">Kleur heeft een rol. Oker is het idee, menie is Denckh die kijkt, inkt is de vorm. Papier is de rustige basis.</p>
  <table>${colors.map(([n, hex, role]) => `<tr><td class="sw"><div style="background:${hex}"></div></td><td class="name">${n}</td><td class="hex">${hex.toUpperCase()}</td><td class="rgb">RGB ${rgb(hex)}</td><td>${role}</td></tr>`).join("")}</table>
  <div class="grid2" style="margin-top:8mm">
    <div><h3>Praktische regel</h3><p class="muted">Gebruik vooral papier en inkt. Oker is het herkenningsaccent, geen vlakvulling. Menie alleen als er echt iets wordt gemarkeerd of geanalyseerd. Zo blijft Denckh volwassen en niet creatief om het creatief zijn.</p></div>
    <div><h3>Leesbaarheid</h3><p class="muted">Oker op papier is te licht voor tekst. Zet kleine tekst in oker diep of inkt; oker zelf alleen voor de punt, de krul en grotere accenten.</p></div>
  </div>
  ${foot(3)}
</section>

<section class="page">
  <h2>3. Typografie</h2>
  <p class="lead">Twee lettertypes: een warme serif voor koppen, een sobere sans voor tekst. De spanning zit in die combinatie.</p>
  <p class="label">Fraunces · koppen en korte zinnen</p>
  <div class="specimen">Heb je een idee?<br>Mooi<span class="dot"></span></div>
  <p class="alphabet serif">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789</p>
  <p class="label">Manrope · lopende tekst, navigatie, knoppen</p>
  <p style="font-size:11pt;max-width:150mm">Je hoeft nog niet te weten wat het moet worden. Denckh denkt mee, zoekt de vorm die bij het idee past en maakt die concreet.</p>
  <p class="alphabet">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789</p>
  <div class="scale">
    <div><span class="k">Kop · Fraunces 560, −3%</span><span class="display" style="font-size:20pt">Wat er al vorm kreeg.</span></div>
    <div><span class="k">Inleiding · Fraunces 560</span><span class="display" style="font-size:12.5pt;letter-spacing:-0.015em">Van deegbol tot een plek waar je bestelt.</span></div>
    <div><span class="k">Tekst · Manrope 400</span><span>Direct en menselijk. Korte zinnen, geen vakjargon.</span></div>
    <div><span class="k">Label · Manrope 700, kapitalen</span><span class="label" style="margin:0">product ${ARROW} merk ${ARROW} webshop</span></div>
  </div>
  <div class="grid2" style="margin-top:6mm">
    <div><h3>Toon</h3><p class="muted">Koppen kort en met ruimte. Tekst direct en menselijk. Geen overdadige kapitalen, geen scriptfont, geen techlettertype als merkstem.</p></div>
    <div><h3>Gebruiken</h3><p class="muted">Fraunces en Manrope zijn vrij te gebruiken (SIL Open Font License) en te downloaden via Google Fonts. Op de site: de zachte Fraunces (SOFT 100, WONK uit). Het woordmerk is geen getypte tekst, gebruik altijd het bestand.</p></div>
  </div>
  ${foot(4)}
</section>

<section class="page">
  <h2>4. Visuele taal</h2>
  <p class="lead">De herkenning zit niet in veel grafische elementen, maar in een paar consequente keuzes.</p>
  <div class="grid2" style="gap:8mm 10mm">
    <div><svg class="icon" viewBox="0 0 64 48"><circle cx="32" cy="24" r="7" fill="${C.ochre}"/></svg><h3>Punt</h3><p class="muted">Een idee begint klein. De okeren punt mag als zelfstandig accent terugkomen.</p></div>
    <div><svg class="icon" viewBox="0 0 64 48"><path d="M6 34 C 18 8, 34 44, 46 18 S 58 14, 60 22" fill="none" stroke="${C.idea}" stroke-width="2.4" stroke-linecap="round"/></svg><h3>Lijn</h3><p class="muted">Lijnen mogen iets menselijks houden. Niet alles perfect geometrisch of spiegelglad maken.</p></div>
    <div><svg class="icon" viewBox="0 0 300 380" style="width:auto">${fs.readFileSync(path.join(out, "denckh-curl.svg"), "utf8").match(/<path[^>]+\/><circle[^>]+\/>/)[0]}</svg><h3>Krul</h3><p class="muted">De handgetekende krul is een signatuur, geen verplicht logo-onderdeel. In de hero van de site is dezelfde krul een potloodgrijze stippellijn: de uitnodiging om zelf te tekenen.</p></div>
    <div><svg class="icon" viewBox="0 0 64 48"><rect x="8" y="8" width="48" height="32" rx="3" fill="${C.paper}" stroke="#E2DCD1"/></svg><h3>Papier</h3><p class="muted">Lichte, warme achtergronden. Vermijd hard spierwit als standaard wanneer Denckh zelf de drager bepaalt.</p></div>
    <div><svg class="icon" viewBox="0 0 64 48"><circle cx="12" cy="24" r="4" fill="${C.ochre}"/><path d="M18 24 C 30 10, 38 38, 50 24" fill="none" stroke="${C.idea}" stroke-width="2" stroke-linecap="round"/><rect x="50" y="16" width="10" height="16" rx="2" fill="none" stroke="${C.ink}" stroke-width="1.6"/></svg><h3>Beweging</h3><p class="muted">Als iets beweegt, heeft het betekenis: tekenen, verbinden, vormen. Geen beweging puur als decoratie.</p></div>
    <div><svg class="icon" viewBox="0 0 64 48"><rect x="10" y="8" width="44" height="32" rx="2" fill="none" stroke="${C.ink}" stroke-width="1.6"/><path d="M14 36 L28 22 L38 30 L44 25 L50 36" fill="none" stroke="${C.ink}" stroke-width="1.4"/><circle cx="44" cy="16" r="3" fill="${C.ochre}"/></svg><h3>Beeld</h3><p class="muted">Echte projecten, echte materialen, echte mensen. Geen gegenereerde studiobeelden. Een beeld mag rustig, tactiel en een beetje onvolmaakt zijn.</p></div>
  </div>
  <div class="note" style="margin-top:9mm"><p style="margin:0"><b>Menie is Denckh die kijkt.</b> Op de site tekent menie meetlijnen en aantekeningen bij jouw lijn. Buiten die rol komt menie niet voor.</p></div>
  ${foot(5)}
</section>

<section class="page">
  <h2>5. Delen en bestanden</h2>
  <p class="lead" style="margin-bottom:5mm">Een gedeelde link toont het deelbeeld: de signatuur met de tagline. Die opbouw is het uitgangspunt voor social.</p>
  <div class="grid2" style="align-items:start">
    <div><img class="og" src="${og}" alt=""><p class="cap">Het deelbeeld (1200 × 630), zoals WhatsApp en LinkedIn het tonen.</p></div>
    <div><h3>Opbouw voor social</h3><ol class="muted"><li>Veel rustige ruimte.</li><li>Eén duidelijke kop in Fraunces.</li><li>Compact woordmerk of signatuur.</li><li>Oker als accent, niet als achtergrond.</li><li>Eén boodschap per beeld.</li></ol></div>
  </div>
  <h3 style="margin-top:3mm">Formaten</h3>
  <ul class="muted"><li>Vierkant 1080 × 1080: een statement of projectdetail.</li><li>Staand 1080 × 1350: een project met meer context.</li><li>Story en Status 1080 × 1920: grote kop, veel ruimte, de krul als route of signatuur.</li></ul>
  <h3 style="margin-top:4mm">Welk bestand waarvoor</h3>
  <table>${files.map(([use, f]) => `<tr><td style="width:62mm">${use}</td><td class="file" style="font-size:8.2pt">${f}</td></tr>`).join("")}</table>
  <p class="cap" style="margin-top:3mm">Alle bestanden: <b>denckh.nl/brand/</b>, of in één keer als <b>denckh-brand-assets.zip</b>.</p>
  <p class="muted" style="margin-top:5mm">Gebruik dit merkoverzicht als basis, niet als keurslijf. Denckh mag per project anders voelen, zolang woordmerk, typografie, kleurdiscipline en punt ${ARROW} lijn ${ARROW} vorm herkenbaar blijven.</p>
  ${foot(6)}
</section>
</body></html>`;

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // controle: elke pagina moet precies op één A4 passen
  const overflow = await page.$$eval(".page", (els) => els.map((el, i) => [i + 1, Math.round((el.scrollHeight - el.clientHeight) / 3.78)]).filter(([, mm]) => mm > 0));
  if (overflow.length) throw new Error(`Merkoverzicht: inhoud loopt over (pagina, mm): ${JSON.stringify(overflow)}`);
  fs.writeFileSync(path.join(out, "denckh-merkoverzicht.pdf"), await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
  await page.close();
}
