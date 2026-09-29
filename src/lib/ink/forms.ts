// Van schets naar eerste vorm. Elke vorm wordt opgebouwd uit dezelfde punten als de schets,
// zodat de lijn letterlijk verandert in de vorm (geen losse afbeelding die verschijnt).
import type { Features, FormKind } from "./analyze";
import { bbox, centroid, clamp, dist, resample, simplify, smooth, type Pt } from "./geometry";

export const N = 128;

export type Form =
  | { kind: "punt"; outline: Pt[]; closed: false; center: Pt }
  | { kind: "knop"; outline: Pt[]; closed: true; center: Pt; r: number }
  | { kind: "scherm"; outline: Pt[]; closed: true; x: number; y: number; w: number; h: number; radius: number }
  | { kind: "schuif"; outline: Pt[]; closed: false; a: Pt; b: Pt }
  | { kind: "grafiek"; outline: Pt[]; closed: false; x0: number; x1: number; base: number; top: number; marks: Pt[] }
  | { kind: "route"; outline: Pt[]; closed: false; nodes: Pt[] }
  | { kind: "kaart"; outline: Pt[]; closed: false; nodes: Pt[]; edges: [number, number][] };

type Bounds = { x?: number; y?: number; w: number; h: number };

/** Houd een vorm binnen het podium, met marge. */
function fit(center: Pt, halfW: number, halfH: number, stage: Bounds, margin = 24): Pt {
  const ox = stage.x ?? 0, oy = stage.y ?? 0;
  return {
    x: clamp(center.x, ox + margin + halfW, Math.max(ox + margin + halfW, ox + stage.w - margin - halfW)),
    y: clamp(center.y, oy + margin + halfH, Math.max(oy + margin + halfH, oy + stage.h - margin - halfH)),
  };
}

/** Draai/keer een gesloten doelcontour zo dat hij zo dicht mogelijk bij de schets begint. */
function align(target: Pt[], source: Pt[]): Pt[] {
  let best = target, bestCost = Infinity;
  for (const dir of [target, target.slice().reverse()]) {
    for (let s = 0; s < dir.length; s += 4) {
      const rot = dir.slice(s).concat(dir.slice(0, s));
      let cost = 0;
      for (let i = 0; i < rot.length; i += 8) cost += dist(rot[i], source[i]);
      if (cost < bestCost) { bestCost = cost; best = rot; }
    }
  }
  return best;
}

function polyline(points: Pt[], n: number): Pt[] {
  return resample(points, n);
}

function roundedRect(x: number, y: number, w: number, h: number, r: number, n: number): Pt[] {
  const pts: Pt[] = [];
  const seg = 12;
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
  };
  corner(x + w - r, y + r, -Math.PI / 2);
  corner(x + w - r, y + h - r, 0);
  corner(x + r, y + h - r, Math.PI / 2);
  corner(x + r, y + r, Math.PI);
  pts.push({ ...pts[0] });
  return resample(pts, n);
}

function kmeans(points: Pt[], k: number): Pt[] {
  const sorted = points.slice().sort((a, b) => a.x - b.x);
  let centers = Array.from({ length: k }, (_, i) => ({ ...sorted[Math.floor(((i + 0.5) / k) * sorted.length)] }));
  for (let it = 0; it < 12; it++) {
    const sums = centers.map(() => ({ x: 0, y: 0, n: 0 }));
    for (const p of points) {
      let bi = 0, bd = Infinity;
      centers.forEach((c, i) => { const d = dist(p, c); if (d < bd) { bd = d; bi = i; } });
      sums[bi].x += p.x; sums[bi].y += p.y; sums[bi].n++;
    }
    centers = centers.map((c, i) => (sums[i].n ? { x: sums[i].x / sums[i].n, y: sums[i].y / sums[i].n } : c));
  }
  return centers;
}

function spread(nodes: Pt[], min: number): Pt[] {
  const out = nodes.map((n) => ({ ...n }));
  for (let it = 0; it < 30; it++) {
    for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
      const d = dist(out[i], out[j]);
      if (d < min && d > 0.01) {
        const push = (min - d) / 2, ux = (out[j].x - out[i].x) / d, uy = (out[j].y - out[i].y) / d;
        out[i].x -= ux * push; out[i].y -= uy * push; out[j].x += ux * push; out[j].y += uy * push;
      }
    }
  }
  return out;
}

function mst(nodes: Pt[]): [number, number][] {
  const inTree = new Set([0]);
  const edges: [number, number][] = [];
  while (inTree.size < nodes.length) {
    let best: [number, number] | null = null, bd = Infinity;
    for (const i of inTree) for (let j = 0; j < nodes.length; j++) {
      if (inTree.has(j)) continue;
      const d = dist(nodes[i], nodes[j]);
      if (d < bd) { bd = d; best = [i, j]; }
    }
    if (!best) break;
    edges.push(best); inTree.add(best[1]);
  }
  return edges;
}

export function buildForm(kind: FormKind, stroke: Pt[], f: Features, stage: Bounds): Form {
  const src = resample(stroke, N);
  const c = centroid(src);
  const small = Math.min(stage.w, stage.h);

  switch (kind) {
    case "punt": {
      return { kind, outline: src.map(() => ({ ...c })), closed: false, center: c };
    }
    case "knop": {
      const mean = src.reduce((s, p) => s + dist(p, c), 0) / src.length;
      const r = clamp(mean, 56, small * 0.3);
      const center = fit(c, r + 22, r + 22, stage);
      const ring = Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2;
        return { x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r };
      });
      return { kind, outline: align(ring, src), closed: true, center, r };
    }
    case "scherm": {
      let w = clamp(f.box.w, 180, stage.w - 48);
      let h = clamp(f.box.h, 130, stage.h - 48);
      if (w / h > 1.9) h = w / 1.9;
      if (h / w > 1.5) w = h / 1.5;
      const center = fit({ x: f.box.cx, y: f.box.cy }, w / 2, h / 2, stage);
      const x = center.x - w / 2, y = center.y - h / 2, radius = 14;
      return { kind, outline: align(roundedRect(x, y, w, h, radius, N), src), closed: true, x, y, w, h, radius };
    }
    case "schuif": {
      let a = src[0], b = src[src.length - 1];
      const len = dist(a, b);
      if (len < 200) {
        const k = 200 / Math.max(1, len), m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        a = { x: m.x + (a.x - m.x) * k, y: m.y + (a.y - m.y) * k };
        b = { x: m.x + (b.x - m.x) * k, y: m.y + (b.y - m.y) * k };
      }
      const bb = bbox([a, b]);
      const center = fit({ x: bb.cx, y: bb.cy }, bb.w / 2 + 16, bb.h / 2 + 16, stage);
      const dx = center.x - bb.cx, dy = center.y - bb.cy;
      a = { x: a.x + dx, y: a.y + dy }; b = { x: b.x + dx, y: b.y + dy };
      return { kind, outline: polyline([a, b], N), closed: false, a, b };
    }
    case "grafiek": {
      const byX = src.slice().sort((p, q) => p.x - q.x);
      const width = Math.min(Math.max(f.box.w, 220), stage.w - 80);
      const ox = stage.x ?? 0, oy = stage.y ?? 0;
      const x0 = clamp(f.box.cx - width / 2, ox + 40, Math.max(ox + 40, ox + stage.w - 40 - width));
      const scaleX = width / Math.max(1, f.box.w);
      let line = smooth(byX.map((p) => ({ x: x0 + (p.x - f.box.x0) * scaleX, y: p.y })), 6);
      const ys = line.map((p) => p.y);
      const top = Math.min(...ys), bottom = Math.max(...ys);
      const range = Math.max(60, bottom - top);
      const base = clamp(top + range + 28, oy + range + 40, oy + stage.h - 32);
      const shift = base - (top + range + 28);
      line = resample(line.map((p) => ({ x: p.x, y: p.y + shift })), N);
      const marks = [0.12, 0.34, 0.56, 0.78, 0.96].map((t) => line[Math.floor(t * (N - 1))]);
      return { kind, outline: line, closed: false, x0, x1: x0 + width, base, top: top + shift, marks };
    }
    case "route": {
      let nodes = simplify(src, Math.max(f.box.w, f.box.h) * 0.09);
      if (nodes.length > 6) nodes = [nodes[0], ...simplify(nodes, Math.max(f.box.w, f.box.h) * 0.16).slice(1, -1).slice(0, 4), nodes[nodes.length - 1]];
      if (nodes.length < 3) nodes = [src[0], src[Math.floor(N / 2)], src[N - 1]];
      const ox = stage.x ?? 0, oy = stage.y ?? 0;
      nodes = spread(nodes, 64).map((p) => ({ x: clamp(p.x, ox + 32, ox + stage.w - 32), y: clamp(p.y, oy + 32, oy + stage.h - 32) }));
      return { kind, outline: polyline(nodes, N), closed: false, nodes };
    }
    case "kaart": {
      const k = clamp(Math.round(f.loops + f.crossings / 3), 2, 5);
      let nodes = kmeans(src, k);
      const ox = stage.x ?? 0, oy = stage.y ?? 0;
      nodes = spread(nodes, 96).map((p) => ({ x: clamp(p.x, ox + 56, ox + stage.w - 56), y: clamp(p.y, oy + 40, oy + stage.h - 40) }));
      const edges = mst(nodes);
      // één doorlopende lijn die alle verbindingen bezoekt (heen en terug), zodat de schets erin kan overlopen
      const walk: Pt[] = [];
      const visit = (i: number, from: number) => {
        walk.push(nodes[i]);
        for (const [a, b] of edges) {
          const j = a === i ? b : b === i ? a : -1;
          if (j >= 0 && j !== from) { visit(j, i); walk.push(nodes[i]); }
        }
      };
      visit(0, -1);
      return { kind, outline: polyline(walk, N), closed: false, nodes, edges };
    }
  }
}
