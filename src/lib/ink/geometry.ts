// Geometrie voor de inktlijn: resamplen, gladstrijken, vereenvoudigen en een lijn met variabele dikte als contour.

export type Pt = { x: number; y: number };
export type InkPt = Pt & { w: number };

export const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function length(points: Pt[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i]);
  return total;
}

export function bbox(points: Pt[]) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of points) {
    x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

export function centroid(points: Pt[]): Pt {
  const s = points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
  return { x: s.x / points.length, y: s.y / points.length };
}

/** Verdeel een lijn opnieuw in n punten op gelijke afstand (booglengte). */
export function resample<T extends Pt>(points: T[], n: number): T[] {
  if (points.length < 2) return Array.from({ length: n }, () => ({ ...points[0] }));
  const total = length(points);
  const step = total / (n - 1);
  const out: T[] = [{ ...points[0] }];
  let acc = 0;
  let i = 1;
  let prev: T = points[0];
  while (out.length < n - 1 && i < points.length) {
    const cur = points[i];
    const d = dist(prev, cur);
    if (acc + d >= step && d > 0) {
      const t = (step - acc) / d;
      const q = { ...cur, x: lerp(prev.x, cur.x, t), y: lerp(prev.y, cur.y, t) } as T;
      if ("w" in cur && "w" in prev) (q as unknown as InkPt).w = lerp((prev as unknown as InkPt).w, (cur as unknown as InkPt).w, t);
      out.push(q);
      prev = q;
      acc = 0;
    } else {
      acc += d;
      prev = cur;
      i++;
    }
  }
  while (out.length < n) out.push({ ...points[points.length - 1] });
  return out;
}

/** Laplace-smoothing: haalt trillingen weg zonder de vorm te veranderen. */
export function smooth<T extends Pt>(points: T[], passes = 2, closed = false): T[] {
  let cur = points.map((p) => ({ ...p }));
  for (let k = 0; k < passes; k++) {
    cur = cur.map((p, i) => {
      const a = cur[i - 1] ?? (closed ? cur[cur.length - 1] : p);
      const b = cur[i + 1] ?? (closed ? cur[0] : p);
      return { ...p, x: (a.x + 2 * p.x + b.x) / 4, y: (a.y + 2 * p.y + b.y) / 4 };
    });
  }
  return cur;
}

/** Ramer–Douglas–Peucker: de 'hoekpunten' van een schets. */
export function simplify(points: Pt[], epsilon: number): Pt[] {
  if (points.length < 3) return points.slice();
  const a = points[0], b = points[points.length - 1];
  let maxD = 0, idx = 0;
  const lenAB = dist(a, b) || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const d = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x) / lenAB;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > epsilon) {
    const left = simplify(points.slice(0, idx + 1), epsilon);
    const right = simplify(points.slice(idx), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [a, b];
}

/** Contour van een lijn met variabele dikte, als SVG-pad (gesloten, ronde uiteinden). */
export function outlinePath(points: InkPt[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return circlePath(p.x, p.y, p.w / 2);
  }
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(points.length - 1, i + 1)];
    let nx = -(b.y - a.y), ny = b.x - a.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const r = points[i].w / 2;
    left.push({ x: points[i].x + nx * r, y: points[i].y + ny * r });
    right.push({ x: points[i].x - nx * r, y: points[i].y - ny * r });
  }
  const f = (n: number) => n.toFixed(1);
  const start = points[0], end = points[points.length - 1];
  let d = `M${f(left[0].x)} ${f(left[0].y)}`;
  for (let i = 1; i < left.length; i++) {
    const m = { x: (left[i - 1].x + left[i].x) / 2, y: (left[i - 1].y + left[i].y) / 2 };
    d += ` Q${f(left[i - 1].x)} ${f(left[i - 1].y)} ${f(m.x)} ${f(m.y)}`;
  }
  d += ` L${f(left[left.length - 1].x)} ${f(left[left.length - 1].y)}`;
  d += ` A${f(end.w / 2)} ${f(end.w / 2)} 0 0 1 ${f(right[right.length - 1].x)} ${f(right[right.length - 1].y)}`;
  for (let i = right.length - 2; i >= 0; i--) {
    const m = { x: (right[i + 1].x + right[i].x) / 2, y: (right[i + 1].y + right[i].y) / 2 };
    d += ` Q${f(right[i + 1].x)} ${f(right[i + 1].y)} ${f(m.x)} ${f(m.y)}`;
  }
  d += ` L${f(right[0].x)} ${f(right[0].y)}`;
  d += ` A${f(start.w / 2)} ${f(start.w / 2)} 0 0 1 ${f(left[0].x)} ${f(left[0].y)} Z`;
  return d;
}

export function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
}

/** Een gewone lijn door punten (vloeiend), als SVG-pad. */
export function linePath(points: Pt[], closed = false): string {
  if (points.length < 2) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(points[0].x)} ${f(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const m = { x: (points[i - 1].x + points[i].x) / 2, y: (points[i - 1].y + points[i].y) / 2 };
    d += ` Q${f(points[i - 1].x)} ${f(points[i - 1].y)} ${f(m.x)} ${f(m.y)}`;
  }
  const last = points[points.length - 1];
  d += ` L${f(last.x)} ${f(last.y)}`;
  return closed ? d + " Z" : d;
}

/** Tel hoe vaak de lijn zichzelf kruist (grof, O(n²) op een beperkte set). */
export function selfIntersections(points: Pt[]): number {
  let count = 0;
  const seg = (p1: Pt, p2: Pt, p3: Pt, p4: Pt) => {
    const d = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (d === 0) return false;
    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / d;
    return ua > 0 && ua < 1 && ub > 0 && ub < 1;
  };
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      if (i === 0 && j === points.length - 2) continue;
      if (seg(points[i], points[i + 1], points[j], points[j + 1])) count++;
    }
  }
  return count;
}

/** Totale draaiing (radialen) langs de lijn. */
export function totalTurning(points: Pt[]) {
  let t = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const a = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x);
    const b = Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x);
    let d = b - a;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    t += d;
  }
  return t;
}

/** Deterministische pseudo-random uit een getal (voor variatie zonder toeval). */
export function seeded(seed: number) {
  let s = Math.floor(Math.abs(seed)) % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
