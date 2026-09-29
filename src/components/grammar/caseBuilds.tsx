// Drie projecten, drie soorten denken. Alleen geverifieerde inhoud (zie docs/cases/). Geen logo's of beelden van derden:
// de eindbeelden zijn schematische weergaven, zo gemarkeerd.
import { SHAPES } from "@/lib/ink/shapes";
import { resample } from "@/lib/ink/geometry";
import { rr, type Build } from "./Construct";

const D = (d: string, key: number) => <path key={key} d={d} pathLength={1} className="c-anim" />;

/** Deegh: product → merk → webshop. Namen uit de broncode van de webshop (menu en producten). */
export const deeghBuild: Build = (w, h) => {
  const bol = SHAPES.deegbol({ w, h });
  const pizza = SHAPES.pizza({ w, h });
  const shop = SHAPES.webshop({ w, h });
  const W = Math.min(w * 0.86, h * 1.5), H = W / 1.5, x = (w - W) / 2, y = (h - H) / 2;
  const tw = (W - 56) / 3;
  const nav = ["Webshop", "Zo werkt Deegh", "Verkooppunten", "Zakelijk"];
  const products = [["Deegh Gezin", "6 pizzabollen"], ["Deegh Voorraad", "12 pizzabollen"], ["Deegh Pizza-avond", "24 pizzabollen"]];
  const fs = Math.max(8, Math.min(11, W / 48));
  return {
    stages: [
      { ...bol, caption: "een deegbol", details: bol.details.map(D) },
      { ...pizza, caption: "een pizza", details: pizza.details.map(D) },
      { ...shop, caption: "een plek om te bestellen", details: shop.details.map(D) },
    ],
    final: (
      <g className="deegh-shot">
        <path d={rr(x, y, W, H, 10)} fill="#ffffff" stroke="#554f4f" strokeOpacity=".35" />
        <path d={rr(x, y, W, 26, 10)} fill="#f0e8d3" />
        <text x={x + 14} y={y + 17} fontSize={fs + 3} fontWeight="700" fill="#554f4f">deegh</text>
        {nav.map((n, i) => <text key={n} x={x + W * 0.3 + i * (W * 0.165)} y={y + 17} fontSize={fs} fill="#554f4f">{n}</text>)}
        <text x={x + 16} y={y + 56} fontSize={fs + 5} fontWeight="700" fill="#554f4f">Ons deeg</text>
        {products.map(([n, s], i) => (
          <g key={n}>
            <path d={rr(x + 16 + i * (tw + 12), y + 70, tw, H * 0.38, 6)} fill="#f0e8d3" />
            <circle cx={x + 16 + i * (tw + 12) + tw / 2} cy={y + 70 + H * 0.19} r={Math.min(tw, H * 0.38) * 0.22} fill="#fbf7ec" stroke="#554f4f" strokeOpacity=".25" />
            <text x={x + 16 + i * (tw + 12)} y={y + 86 + H * 0.38} fontSize={fs} fontWeight="700" fill="#554f4f">{n}</text>
            <text x={x + 16 + i * (tw + 12)} y={y + 100 + H * 0.38} fontSize={fs - 1} fill="#554f4f">{s}</text>
          </g>
        ))}
      </g>
    ),
  };
};

/** Demokoffer: complexe techniek → begrijpelijke uitleg. Zonder merknamen of productbeelden (toestemming open). */
export const kofferBuild: Build = (w, h) => {
  const koffer = SHAPES.demo({ w, h });
  const W = Math.min(w * 0.8, h * 1.45), H = W / 1.45, x = (w - W) / 2, y = (h - H) / 2 + 10;
  const callouts = [
    { cx: x + W * 0.25, cy: y + H / 2, n: 1, lx: x + W * 0.06, ly: y + H * 0.14 },
    { cx: x + W * 0.75, cy: y + H / 2, n: 2, lx: x + W * 0.94, ly: y + H * 0.14 },
    { cx: x + W * 0.75, cy: y + H / 2 + H * 0.2, n: 3, lx: x + W * 0.94, ly: y + H * 0.9 },
  ];
  const flow = resample([{ x: w * 0.12, y: h * 0.5 }, { x: w * 0.88, y: h * 0.5 }], 128);
  const steps = [0.12, 0.38, 0.62, 0.88].map((t) => ({ x: w * t, y: h * 0.5 }));
  const labels = ["ontgrendel", "kies", "draai", "klaar"];
  return {
    stages: [
      { ...koffer, caption: "een koffer vol techniek", details: koffer.details.map(D) },
      { ...koffer, caption: "wat zit waar?", details: [
        ...koffer.details.map(D),
        ...callouts.map((c, i) => (
          <g key={`c${i}`} className="callout">
            <path d={`M${c.cx} ${c.cy} L${c.lx} ${c.ly}`} pathLength={1} className="c-anim" />
            <circle cx={c.lx} cy={c.ly} r={11} />
            <text x={c.lx} y={c.ly + 4} textAnchor="middle">{c.n}</text>
          </g>
        )),
      ] },
      { outline: flow, closed: false, caption: "bediening in stappen", details: steps.map((s, i) => (
        <g key={i} className="callout">
          <circle cx={s.x} cy={s.y} r={14} />
          <text x={s.x} y={s.y + 4} textAnchor="middle">{i + 1}</text>
          <text x={s.x} y={s.y + 36} textAnchor="middle" className="callout__label">{labels[i]}</text>
        </g>
      )) },
    ],
  };
};

/** Loflijn: een beurt in het spel. Kaart (QR) → lied → plek op de tijdlijn. Schematisch: geen kaartontwerpen,
 *  productfoto's of muziek overgenomen. Spelstappen van de live site (docs/cases/loflijn.md). */
export const spelBuild: Build = (w, h) => {
  // 1 · de kaart, met een abstracte QR-code
  const cH = h * 0.78, cW = cH * 0.68, cx = (w - cW) / 2, cy = (h - cH) / 2;
  const card = resample(rrPts(cx, cy, cW, cH, 12), 128);
  const q = cW * 0.66, qx = cx + (cW - q) / 2, qy = cy + cH * 0.18, m = q / 9;
  const sq = (a: number, b: number, s: number) => `M${qx + a * m} ${qy + b * m} h${s * m} v${s * m} h${-s * m} Z`;
  const finders = [[0, 0], [6, 0], [0, 6]];
  const modules = [[4, 0], [3, 1], [5, 1], [4, 2], [0, 4], [2, 4], [4, 4], [5, 5], [7, 4], [8, 5], [3, 6], [4, 7], [6, 6], [7, 7], [8, 8], [5, 8], [3, 8]];
  const cardDetails = [
    <path key="f" d={finders.map(([a, b]) => rr(qx + a * m, qy + b * m, m * 3, m * 3, 2)).join(" ")} pathLength={1} className="c-anim" />,
    <path key="m" d={[...finders.map(([a, b]) => sq(a + 0.9, b + 0.9, 1.2)), ...modules.map(([a, b]) => sq(a + 0.08, b + 0.08, 0.84))].join(" ")} className="c-fade" />,
    <path key="l" d={`M${cx + cW * 0.3} ${cy + cH * 0.86} H${cx + cW * 0.7}`} pathLength={1} className="c-anim" />,
  ];

  // 2 · het lied: de lijn gaat trillen
  const x0 = w * 0.1, x1 = w * 0.9, mid = h * 0.46;
  const wave = Array.from({ length: 128 }, (_, i) => {
    const t = i / 127, env = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(t * 9.3));
    return { x: x0 + (x1 - x0) * t, y: mid + Math.sin(t * Math.PI * 18) * h * 0.2 * env };
  });
  const pr = Math.min(18, h * 0.07), px = w / 2, py = h * 0.84;
  const waveDetails = [`M${px - pr} ${py} a${pr} ${pr} 0 1 0 ${2 * pr} 0 a${pr} ${pr} 0 1 0 ${-2 * pr} 0`,
    `M${px - pr * 0.3} ${py - pr * 0.45} L${px + pr * 0.5} ${py} L${px - pr * 0.3} ${py + pr * 0.45} Z`,
    `M${x0} ${py} H${px - pr - 10} M${px + pr + 10} ${py} H${x1}`];

  // 3 · de tijdlijn: drie kaarten liggen er al, de nieuwe zoekt zijn plek
  const ly = h * 0.7, lx0 = w * 0.06, lx1 = w * 0.94;
  const line = resample([{ x: lx0, y: ly }, { x: lx1, y: ly }], 128);
  const tw = Math.min(54, w * 0.1), th = tw * 1.4;
  const placed = [0.2, 0.5, 0.8].map((t) => lx0 + (lx1 - lx0) * t);
  const gap = (placed[1] + placed[2]) / 2;
  const lineDetails = [
    ...placed.map((x, i) => <path key={`p${i}`} d={`${rr(x - tw / 2, ly - th - 10, tw, th, 5)} M${x} ${ly - 6} V${ly + 6}`} pathLength={1} className="c-anim" />),
    <path key="new" d={`${rr(gap - tw / 2, ly - th * 2 - 22, tw, th, 5)} M${gap} ${ly - th - 18} V${ly - 8}`} pathLength={1} className="c-anim c-idea" />,
  ];

  // eindbeeld: een volle tijdlijn, van psalm tot praise (op dezelfde lijn als stap 3)
  const n = 7, slot = (lx1 - lx0) / n, fw = Math.min(42, slot * 0.72), fh = fw * 1.4, fs = Math.max(10, Math.min(13, w / 40));
  return {
    stages: [
      { outline: card, closed: true, caption: "scan de kaart", details: cardDetails },
      { outline: wave, closed: false, caption: "luister naar het lied", details: waveDetails.map(D) },
      { outline: line, closed: false, caption: "leg hem op de tijdlijn", details: lineDetails },
    ],
    final: (
      <g className="loflijn-shot">
        <path d={`M${lx0} ${ly} H${lx1}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
        {Array.from({ length: n }, (_, i) => {
          const x = lx0 + slot * (i + 0.5);
          return <path key={i} d={rr(x - fw / 2, ly - fh - 10, fw, fh, 5)} className={i === 4 ? "loflijn-shot__new" : "loflijn-shot__card"} />;
        })}
        <text x={lx0} y={ly + 26} fontSize={fs}>psalm</text>
        <text x={lx1} y={ly + 26} fontSize={fs} textAnchor="end">praise</text>
      </g>
    ),
  };
};

/** Afgeronde rechthoek als puntenreeks (voor vormen die moeten kunnen morphen). */
function rrPts(x: number, y: number, w: number, h: number, r: number) {
  const pts: { x: number; y: number }[] = [];
  const corner = (ccx: number, ccy: number, a0: number) => {
    for (let i = 0; i <= 8; i++) { const a = a0 + (i / 8) * (Math.PI / 2); pts.push({ x: ccx + Math.cos(a) * r, y: ccy + Math.sin(a) * r }); }
  };
  corner(x + r, y + r, Math.PI); corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2);
  pts.push({ ...pts[0] });
  return pts;
}

export const BUILDS = { deegh: deeghBuild, koffer: kofferBuild, spel: spelBuild };
