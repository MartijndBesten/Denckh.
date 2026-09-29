// Voorbeeldtekeningen voor "bekijk een voorbeeld". Alleen geometrie: een reeks punten in een eenheidsvak (0..1),
// die de punt in de hero echt tekent. Daarna leest dezelfde engine hem als elke eigen tekening (analyze → classify →
// buildForm). Hier staat dus nergens wat eruit moet komen; het label is alleen voor ontwikkelaars en tests.
import { bbox, type Pt } from "./geometry";

/** `orient: "entry"`: de tekening loopt in het verlengde van de beweging vanaf de punt (zoals een pen die doorloopt). */
export type Example = { key: string; points: Pt[]; orient?: "entry" };
type Zone = { x: number; y: number; w: number; h: number };

/** Kleine, vaste onregelmatigheid: een hand trilt niet willekeurig, maar ook niet nul. */
const wobble = (i: number, amp: number) => Math.sin(i * 0.9) * amp + Math.sin(i * 0.37 + 1.3) * amp * 0.6;

/** Catmull-Rom door steunpunten: een vloeiende pennenstreek, n punten per stuk. */
function stroke(ctrl: Pt[], n = 8): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
}

const P = (x: number, y: number): Pt => ({ x, y });

/** Een uit de hand getekende cirkel: langzaam wisselende straal, sluit net iets voorbij het begin. */
function handCircle(cx: number, cy: number, r: number, from = -0.62, n = 96): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, a = t * Math.PI * 2 * 1.03 + Math.PI * from;
    const rr = r * (1 + 0.035 * Math.sin(t * Math.PI * 3 + 0.8) + 0.02 * Math.sin(t * Math.PI * 6.4));
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.98 };
  });
}

// ---- Deegh: gebaseerd op public/images/deegh-logo.jpg (uitsnede 356 × 356 px). Daarin: cirkel met middelpunt
//      (178, 178) en straal ~138 px; het woord "deegh" van x ≈ 70 tot 290, basislijn y ≈ 195, x-hoogte ≈ 148,
//      stokken van d en h tot ≈ 120. Hieronder omgerekend naar het eenheidsvak (÷ 356).
const LOGO = { cx: 0.5, cy: 0.5, r: 0.388, base: 0.548, xh: 0.416, asc: 0.337 };

/** De letter d zoals je hem snel met pen schrijft: buik tegen de klok in, dicht tegen de stok, stok hoog op en omlaag. */
function penD(x: number): Pt[] {
  const { base, xh, asc } = LOGO, m = (base + xh) / 2;
  return [P(x + 0.078, xh + 0.03), P(x + 0.05, xh + 0.002), P(x + 0.018, xh + 0.02), P(x + 0.004, m), P(x + 0.012, base - 0.01),
    P(x + 0.042, base + 0.004), P(x + 0.07, base - 0.022), P(x + 0.08, m), P(x + 0.083, asc - 0.045), P(x + 0.087, m), P(x + 0.093, base)];
}

/** e: kort dwarsstreepje, lus omhoog, buik omlaag en open naar rechts. */
function penE(x: number): Pt[] {
  const { base, xh } = LOGO, m = (base + xh) / 2 + 0.008;
  return [P(x, m), P(x + 0.055, m - 0.004), P(x + 0.045, xh + 0.005), P(x + 0.02, xh), P(x + 0.002, m - 0.01),
    P(x + 0.008, base - 0.012), P(x + 0.035, base + 0.004), P(x + 0.062, base - 0.014)];
}

/** g: buik, stok omlaag met een korte haal onder de basislijn. */
function penG(x: number): Pt[] {
  const { base, xh } = LOGO, m = (base + xh) / 2;
  return [P(x + 0.07, xh + 0.02), P(x + 0.035, xh + 0.004), P(x + 0.008, m), P(x + 0.014, base - 0.02), P(x + 0.045, base - 0.006),
    P(x + 0.07, m + 0.01), P(x + 0.074, xh), P(x + 0.076, base + 0.03), P(x + 0.06, base + 0.058), P(x + 0.03, base + 0.056)];
}

/** h: stok omhoog tot boven de x-hoogte, omlaag, boog, tweede poot. */
function penH(x: number): Pt[] {
  const { base, xh, asc } = LOGO;
  return [P(x, xh + 0.03), P(x + 0.004, asc - 0.045), P(x + 0.008, base), P(x + 0.012, xh + 0.05), P(x + 0.04, xh + 0.004),
    P(x + 0.066, xh + 0.03), P(x + 0.07, base)];
}

/** Na de letters: van de laatste letter naar de rand, en dan de cirkel eromheen, zoals je een woord omcirkelt. */
function aroundCircle(from: Pt): Pt[] {
  const { cx, cy, r } = LOGO;
  const start = -0.02; // vlak rechts van het midden
  const edge = { x: cx + Math.cos(Math.PI * start) * r, y: cy + Math.sin(Math.PI * start) * r };
  return [...stroke([from, P((from.x + edge.x) / 2 + 0.02, from.y - 0.03), edge], 6).slice(1), ...handCircle(cx, cy, r, start, 110).slice(1)];
}

// Drie proeven (HANDOFF B-054). Gekozen: C. A verwijst nergens naar (elke cirkel), B leest als een losse haak.
// A en B blijven hier staan zodat de afweging na te spelen is; ze zitten niet in de reeks.

/** A · zeer eenvoudig: alleen de cirkel van het logo. */
export function deeghA(): Pt[] {
  return handCircle(LOGO.cx, LOGO.cy, LOGO.r, -0.62, 100);
}

/** B · herkenbaar vereenvoudigd: de d van "deegh" en de cirkel eromheen. */
export function deeghB(): Pt[] {
  const d = stroke(penD(0.2), 7);
  return [...d, ...aroundCircle(d[d.length - 1])];
}

/** C · iets completer: "deegh" als doorlopend handschrift, dan de cirkel eromheen. */
export function deeghC(): Pt[] {
  const letters = [...penD(0.2), ...penE(0.31), ...penE(0.39), ...penG(0.47), ...penH(0.57)];
  const w = stroke(letters, 6);
  return [...w, ...aroundCircle(w[w.length - 1])];
}

/** De vaste reeks: zes tekeningen die elk een andere kant van de engine laten zien (draaiknop, regelaar, scherm,
 *  verloop, kaart, en Deegh). Volgorde: van eenvoudig naar rijker; na de laatste weer de eerste. */
export const EXAMPLES: Example[] = [
  { key: "cirkel", points: handCircle(0.5, 0.5, 0.42) },
  {
    key: "lijn",
    orient: "entry",
    // één rustige streek; hij loopt door in de richting waarin de punt het tekenvlak in komt
    points: Array.from({ length: 61 }, (_, i) => {
      const t = i / 60;
      return { x: 0.06 + t * 0.88, y: 0.42 + t * 0.12 + Math.sin(t * Math.PI) * 0.02 + wobble(i, 0.003) };
    }),
  },
  {
    key: "rechthoek",
    // vier rechte zijden, breed als een scherm, licht scheef zoals uit de hand. In elke hoek blijft de pen even
    // hangen (dat doet een hand ook), anders snijdt de traagheid van de pen de hoek af.
    points: [P(0.1, 0.24), P(0.9, 0.22), P(0.91, 0.72), P(0.09, 0.74), P(0.1, 0.27)].flatMap((c, i, arr) => {
      if (i === arr.length - 1) return [c];
      const d = arr[i + 1];
      return [c, c, c, ...Array.from({ length: 26 }, (_, k) => {
        const t = k / 26;
        return { x: c.x + (d.x - c.x) * t + wobble(i * 26 + k, 0.002), y: c.y + (d.y - c.y) * t + Math.sin(t * Math.PI) * 0.006 };
      })];
    }),
  },
  {
    key: "golf",
    // een lijn die golft maar ergens heen gaat: van linksboven, op en neer, naar rechtsonder
    points: Array.from({ length: 81 }, (_, i) => {
      const t = i / 80;
      return { x: 0.06 + t * 0.88, y: 0.3 + t * 0.3 + (1 - Math.cos(t * Math.PI * 2.6)) * 0.13 + wobble(i, 0.002) };
    }),
  },
  {
    key: "krullen",
    points: Array.from({ length: 181 }, (_, i) => {
      const t = i / 180, a = t * Math.PI * 2 * 3 - Math.PI / 2;
      return { x: 0.1 + t * 0.72 + Math.cos(a) * 0.12, y: 0.52 + Math.sin(a) * 0.16 * (0.85 + 0.15 * Math.sin(t * 5)) + wobble(i, 0.002) };
    }),
  },
  { key: "deegh", points: deeghC() },
];

/** Zet een voorbeeld in het tekenvlak. Alleen plaatsing, geen analyse: de engine ziet daarna gewoon punten.
 *  Ligt het vlak onder de punt (mobiel), dan begint de tekening bovenaan het vlak, zodat de aanloop vanaf de punt
 *  kort blijft; anders gecentreerd, zoals voorheen. */
export function placeExample(example: Example, z: Zone, from: Pt): Pt[] {
  const stacked = z.y > from.y + 40;
  let pts = example.points;
  if (example.orient === "entry") {
    const a = pts[0], b = pts[pts.length - 1];
    const r = Math.atan2(z.y + z.h / 2 - from.y, z.x + z.w / 2 - from.x) - Math.atan2(b.y - a.y, b.x - a.x);
    const c = Math.cos(r), s = Math.sin(r);
    pts = pts.map((p) => ({ x: a.x + (p.x - a.x) * c - (p.y - a.y) * s, y: a.y + (p.x - a.x) * s + (p.y - a.y) * c }));
  }
  const bx = z.x + z.w * (stacked ? 0.04 : 0.2), bw = z.w * (stacked ? 0.92 : 0.6);
  const by = z.y + z.h * (stacked ? 0.04 : 0.16), bh = z.h * (stacked ? 0.86 : 0.68);
  const bb = bbox(pts), sc = Math.min(bw / Math.max(bb.w, 0.001), bh / Math.max(bb.h, 0.001));
  const ox = bx + (bw - bb.w * sc) / 2 - bb.x0 * sc;
  const oy = stacked ? by - bb.y0 * sc : by + (bh - bb.h * sc) / 2 - bb.y0 * sc;
  return pts.map((p) => ({ x: ox + p.x * sc, y: oy + p.y * sc }));
}
