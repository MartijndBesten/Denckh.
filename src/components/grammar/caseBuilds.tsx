// Drie projecten, drie soorten denken. Alleen geverifieerde inhoud (zie docs/cases/). Geen logo's of beelden van derden:
// de eindbeelden zijn schematische weergaven, zo gemarkeerd.
import { SHAPES } from "@/lib/ink/shapes";
import { linePath, resample } from "@/lib/ink/geometry";
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

/** Een spel: kaarten op tafel → een tijdlijn → een plek online. Zonder kaartontwerpen of namen (toestemming open). */
export const spelBuild: Build = (w, h) => {
  const card = SHAPES.spel({ w, h });
  const line = resample([{ x: w * 0.08, y: h * 0.62 }, { x: w * 0.92, y: h * 0.62 }], 128);
  const cw = Math.min(56, w * 0.11), ch = cw * 1.4;
  const years = ["1", "2", "3", "4"];
  const slots = [0.2, 0.4, 0.6, 0.8].map((t) => w * t);
  const shop = SHAPES.webshop({ w, h });
  return {
    stages: [
      { ...card, caption: "een kaart", details: card.details.map(D) },
      { outline: line, closed: false, caption: "een tijdlijn om op te leggen", details: slots.map((sx, i) => (
        <g key={i}>
          <path d={rr(sx - cw / 2, h * 0.62 - ch - 12, cw, ch, 6)} pathLength={1} className="c-anim" />
          <text x={sx} y={h * 0.62 + 24} textAnchor="middle" className="callout__label">{years[i]}</text>
          <path d={linePath([{ x: sx, y: h * 0.62 - 6 }, { x: sx, y: h * 0.62 + 6 }])} pathLength={1} className="c-anim" />
        </g>
      )) },
      { ...shop, caption: "uitleg en een kooproute", details: shop.details.map(D) },
    ],
  };
};

export const BUILDS = { deegh: deeghBuild, koffer: kofferBuild, spel: spelBuild };
