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
  websitePlus: ({ w, h }) => {
    // meer pagina's: een tweede pagina erachter, en meer inhoud op de voorste
    const W = Math.min(w * 0.8, h * 1.4), H = W / 1.5, ox = W * 0.07, oy = H * 0.1;
    const x = (w - W) / 2 + ox / 2, y = (h - H) / 2 + oy / 2, bx = x - ox, by = y - oy;
    return { outline: rrect(x, y, W, H, 10), closed: true, details: [
      `M${x} ${by + H} H${bx} V${by} H${bx + W} V${y}`,
      L(x, y + 24, x + W, y + 24), L(x + W - 70, y + 12, x + W - 54, y + 12), L(x + W - 46, y + 12, x + W - 30, y + 12), L(x + W - 22, y + 12, x + W - 12, y + 12),
      R(x + 16, y + 38, W * 0.5, H * 0.3, 5), L(x + W * 0.6, y + 42, x + W - 18, y + 42), L(x + W * 0.6, y + 54, x + W - 30, y + 54), C(x + W - 36, y + 38 + H * 0.2, 8),
      L(x + 16, y + H * 0.66, x + W * 0.44, y + H * 0.66), L(x + 16, y + H * 0.76, x + W * 0.38, y + H * 0.76),
      L(x + W * 0.52, y + H * 0.66, x + W - 18, y + H * 0.66), L(x + W * 0.52, y + H * 0.76, x + W * 0.82, y + H * 0.76),
    ] };
  },
  webshopPlus: ({ w, h }) => {
    // meer eigen uitstraling: een beeldbanner, meer producten en een eigen knop
    const W = Math.min(w * 0.86, h * 1.5), H = W / 1.5, x = (w - W) / 2, y = (h - H) / 2;
    const tw = (W - 32 - 3 * 10) / 4, ty = y + 34 + H * 0.26;
    return { outline: rrect(x, y, W, H, 10), closed: true, details: [
      L(x, y + 24, x + W, y + 24), C(x + W - 18, y + 12, 5), C(x + W - 34, y + 12, 3),
      R(x + 16, y + 32, W - 32, H * 0.22, 5), L(x + 28, y + 32 + H * 0.15, x + W * 0.4, y + 32 + H * 0.15),
      ...[0, 1, 2, 3].flatMap((i) => [R(x + 16 + i * (tw + 10), ty, tw, H * 0.3, 4), L(x + 16 + i * (tw + 10), ty + H * 0.3 + 9, x + 16 + i * (tw + 10) + tw * 0.7, ty + H * 0.3 + 9)]),
      R(x + W - 104, y + H - 30, 88, 18, 9), R(x + 16, y + H - 30, 60, 18, 9),
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
  agenda: ({ w, h }) => {
    const W = Math.min(w * 0.72, h * 1.25), H = W * 0.7, x = (w - W) / 2, y = (h - H) / 2 + 6;
    const cols = 3, rows = 3, pad = 12, gx = 8, top = y + 30;
    const sw = (W - pad * 2 - gx * (cols - 1)) / cols, sh = (y + H - pad - top - gx * (rows - 1)) / rows;
    const slot = (c: number, r: number) => R(x + pad + c * (sw + gx), top + r * (sh + gx), sw, sh, 4);
    const cx = x + pad + 1 * (sw + gx) + sw / 2, cy = top + 1 * (sh + gx) + sh / 2, k = Math.min(sw, sh) * 0.22;
    return { outline: rrect(x, y, W, H, 10), closed: true, details: [
      L(x, y + 22, x + W, y + 22), L(x + W * 0.28, y - 8, x + W * 0.28, y + 8), L(x + W * 0.72, y - 8, x + W * 0.72, y + 8),
      ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => slot(c, r))),
      `M${cx - k} ${cy} L${cx - k * 0.2} ${cy + k * 0.8} L${cx + k * 1.2} ${cy - k * 0.8}`,
    ] };
  },
  gebouw: ({ w, h }) => {
    // isometrisch kantoor: lange gevel links, korte zijgevel rechts, verdiepingen en ramen; erboven loopt de zon over de dag
    const H = h * 0.34, Wl = Math.min(w * 0.3, h * 0.6), Dr = Wl * 0.52, cx = w * 0.56, yb = h * 0.92;
    const Lx = -Wl * 0.87, Ly = -Wl * 0.5, Rx = Dr * 0.87, Ry = -Dr * 0.5;
    const B0 = { x: cx, y: yb }, B1 = { x: cx + Lx, y: yb + Ly }, B2 = { x: cx + Rx, y: yb + Ry };
    const up = (p: Pt, k = 1) => ({ x: p.x, y: p.y - H * k });
    const at = (a: Pt, b: Pt, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    const T0 = up(B0), T1 = up(B1), T2 = up(B2), T3 = { x: T0.x + Lx + Rx, y: T0.y + Ly + Ry };
    const floors = [1 / 3, 2 / 3].map((k) => `M${up(B1, k).x} ${up(B1, k).y} L${up(B0, k).x} ${up(B0, k).y} L${up(B2, k).x} ${up(B2, k).y}`);
    const mullions = [0.25, 0.5, 0.75].map((t) => { const a = at(B1, B0, t); return L(a.x, a.y, a.x, a.y - H); });
    const side = at(B0, B2, 0.5);
    const s0 = { x: w * 0.06, y: h * 0.3 }, s1 = { x: w * 0.96, y: h * 0.26 }, sc = { x: w * 0.5, y: -h * 0.2 };
    const t = 0.72, sx = (1 - t) ** 2 * s0.x + 2 * (1 - t) * t * sc.x + t * t * s1.x, sy = (1 - t) ** 2 * s0.y + 2 * (1 - t) * t * sc.y + t * t * s1.y;
    return { outline: resample([B1, B0, B2, T2, T3, T1, B1], SN), closed: true, details: [
      L(B0.x, B0.y, T0.x, T0.y), `M${T1.x} ${T1.y} L${T0.x} ${T0.y} L${T2.x} ${T2.y}`, ...floors, ...mullions, L(side.x, side.y, side.x, side.y - H),
      `M${s0.x} ${s0.y} Q${sc.x} ${sc.y} ${s1.x} ${s1.y}`, C(sx, sy, Math.min(w, h) * 0.045),
    ] };
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
