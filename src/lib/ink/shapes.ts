// Vormen voor de rest van de site. Elke vorm = één contour van N punten (zodat een schets erin kan overlopen)
// plus details die pas verschijnen als de vorm er staat. Coördinaten binnen een kader (0..w, 0..h).
import { resample, type Pt } from "./geometry";

export const SN = 128;

export type Shape = { outline: Pt[]; closed: boolean; details: string[] };
type Box = { w: number; h: number };

function rrect(x: number, y: number, w: number, h: number, r: number): Pt[] {
  const pts: Pt[] = [];
  const seg = 10;
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
  };
  corner(x + r, y + r, Math.PI);
  corner(x + w - r, y + r, -Math.PI / 2);
  corner(x + w - r, y + h - r, 0);
  corner(x + r, y + h - r, Math.PI / 2);
  pts.push({ ...pts[0] });
  return resample(pts, SN);
}

function circle(cx: number, cy: number, r: number, start = -Math.PI / 2): Pt[] {
  return Array.from({ length: SN }, (_, i) => {
    const a = start + (i / (SN - 1)) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

const L = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} L${x2} ${y2}`;
const C = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const R = (x: number, y: number, w: number, h: number, r = 4) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

export const SHAPES: Record<string, (b: Box) => Shape> = {
  website: ({ w, h }) => {
    const W = Math.min(w * 0.86, h * 1.5), H = W / 1.5, x = (w - W) / 2, y = (h - H) / 2;
    return { outline: rrect(x, y, W, H, 10), closed: true, details: [
      L(x, y + 26, x + W, y + 26), C(x + 14, y + 13, 3.5), C(x + 26, y + 13, 3.5),
      R(x + 20, y + 46, W * 0.42, 14, 3), L(x + 20, y + 76, x + W * 0.58, y + 76), L(x + 20, y + 90, x + W * 0.5, y + 90),
      R(x + W * 0.64, y + 46, W * 0.28, H - 70, 6),
    ] };
  },
  webshop: ({ w, h }) => {
    const W = Math.min(w * 0.86, h * 1.5), H = W / 1.5, x = (w - W) / 2, y = (h - H) / 2;
    const tw = (W - 56) / 3;
    return { outline: rrect(x, y, W, H, 10), closed: true, details: [
      L(x, y + 26, x + W, y + 26), C(x + W - 18, y + 13, 5),
      ...[0, 1, 2].flatMap((i) => [R(x + 16 + i * (tw + 12), y + 44, tw, H * 0.42, 5), L(x + 16 + i * (tw + 12), y + 52 + H * 0.42, x + 16 + i * (tw + 12) + tw * 0.7, y + 52 + H * 0.42)]),
      R(x + W - 96, y + H - 34, 80, 20, 10),
    ] };
  },
  prototype: ({ w, h }) => {
    const H = h * 0.88, W = H * 0.5, x = (w - W) / 2, y = (h - H) / 2;
    return { outline: rrect(x, y, W, H, 22), closed: true, details: [
      L(x + W * 0.38, y + 14, x + W * 0.62, y + 14), R(x + 14, y + 36, W - 28, H * 0.34, 8),
      L(x + 14, y + H * 0.52, x + W * 0.7, y + H * 0.52), L(x + 14, y + H * 0.58, x + W * 0.55, y + H * 0.58),
      R(x + 14, y + H - 58, W - 28, 30, 15),
    ] };
  },
  tool: ({ w, h }) => {
    const x0 = w * 0.14, x1 = w * 0.86, y = h * 0.5;
    const outline = resample([{ x: x0, y }, { x: x1, y }], SN);
    return { outline, closed: false, details: [
      C(x0 + (x1 - x0) * 0.62, y, 13), ...Array.from({ length: 9 }, (_, i) => L(x0 + ((x1 - x0) * i) / 8, y + 22, x0 + ((x1 - x0) * i) / 8, y + (i % 4 === 0 ? 34 : 28))),
      L(x0, y - 44, x0 + 70, y - 44),
    ] };
  },
  presentatie: ({ w, h }) => {
    const W = Math.min(w * 0.9, h * 1.6), H = W / 1.78, x = (w - W) / 2, y = (h - H) / 2;
    return { outline: rrect(x, y, W, H, 4), closed: true, details: [
      L(x + 24, y + 34, x + W * 0.55, y + 34), C(x + 30, y + 64, 3), L(x + 42, y + 64, x + W * 0.45, y + 64), C(x + 30, y + 84, 3), L(x + 42, y + 84, x + W * 0.38, y + 84),
      C(x + W * 0.76, y + H * 0.56, H * 0.24),
    ] };
  },
  demo: ({ w, h }) => {
    const W = Math.min(w * 0.8, h * 1.45), H = W / 1.45, x = (w - W) / 2, y = (h - H) / 2 + 10;
    return { outline: rrect(x, y, W, H, 14), closed: true, details: [
      `M${x + W * 0.38} ${y} V${y - 16} Q${x + W * 0.38} ${y - 22} ${x + W * 0.44} ${y - 22} H${x + W * 0.56} Q${x + W * 0.62} ${y - 22} ${x + W * 0.62} ${y - 16} V${y}`,
      L(x + W / 2, y + 12, x + W / 2, y + H - 12), C(x + W * 0.25, y + H / 2, H * 0.2), C(x + W * 0.75, y + H / 2, H * 0.2), C(x + W * 0.75, y + H / 2, H * 0.07),
    ] };
  },
  spel: ({ w, h }) => {
    const H = h * 0.8, W = H * 0.68, x = (w - W) / 2, y = (h - H) / 2;
    return { outline: rrect(x, y, W, H, 12), closed: true, details: [
      C(x + W / 2, y + H / 2, W * 0.2), L(x + 14, y + 16, x + 30, y + 16), L(x + W - 30, y + H - 16, x + W - 14, y + H - 16),
      `M${x + W * 0.1} ${y + H + 16} H${x + W * 0.9}`, C(x + W * 0.3, y + H + 16, 4), C(x + W * 0.7, y + H + 16, 4),
    ] };
  },
  visualisatie: ({ w, h }) => {
    const x0 = w * 0.14, x1 = w * 0.88, base = h * 0.8, top = h * 0.18;
    const ys = [0.2, 0.42, 0.3, 0.62, 0.55, 0.86];
    const pts = ys.map((v, i) => ({ x: x0 + ((x1 - x0) * i) / (ys.length - 1), y: base - (base - top) * v }));
    return { outline: resample(pts, SN), closed: false, details: [
      L(x0 - 12, base + 8, x1 + 12, base + 8), L(x0 - 12, base + 8, x0 - 12, top - 10), ...pts.map((p) => C(p.x, p.y, 4)),
    ] };
  },
  uitleg: ({ w, h }) => {
    const y = h * 0.5, xs = [0.14, 0.38, 0.62, 0.86].map((t) => t * w);
    const pts = xs.map((x, i) => ({ x, y: y + (i % 2 ? -22 : 22) }));
    return { outline: resample(pts, SN), closed: false, details: pts.map((p) => C(p.x, p.y, 14)) };
  },
  knop: ({ w, h }) => ({ outline: circle(w / 2, h / 2, Math.min(w, h) * 0.32), closed: true, details: [L(w / 2, h / 2, w / 2, h / 2 - Math.min(w, h) * 0.22)] }),
  deegbol: ({ w, h }) => ({ outline: circle(w / 2, h * 0.56, Math.min(w, h) * 0.26), closed: true, details: [`M${w / 2 - Math.min(w, h) * 0.12} ${h * 0.5} q${Math.min(w, h) * 0.08} ${-Math.min(w, h) * 0.05} ${Math.min(w, h) * 0.16} 0`] }),
  pizza: ({ w, h }) => {
    const r = Math.min(w, h) * 0.36;
    return { outline: circle(w / 2, h / 2, r), closed: true, details: [C(w / 2, h / 2, r * 0.82), C(w / 2 - r * 0.3, h / 2 - r * 0.2, 7), C(w / 2 + r * 0.25, h / 2 + r * 0.1, 7), C(w / 2 - r * 0.05, h / 2 + r * 0.38, 7), C(w / 2 + r * 0.3, h / 2 - r * 0.35, 5)] };
  },
};

export const OUTCOMES: { word: string; shape: keyof typeof SHAPES | "schets" }[] = [
  { word: "website", shape: "website" },
  { word: "prototype", shape: "prototype" },
  { word: "tool", shape: "tool" },
  { word: "presentatie", shape: "presentatie" },
  { word: "interactieve demo", shape: "demo" },
  { word: "spel", shape: "spel" },
  { word: "visualisatie", shape: "visualisatie" },
  { word: "webshop", shape: "webshop" },
  { word: "interactieve uitleg", shape: "uitleg" },
  { word: "iets waar nog geen naam voor is", shape: "schets" },
];
