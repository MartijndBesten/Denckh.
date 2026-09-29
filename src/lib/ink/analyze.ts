// "Denckh kijkt": meetbare eigenschappen van een schets. Geen AI, alleen geometrie.
import { bbox, centroid, dist, length, resample, selfIntersections, simplify, totalTurning, type Pt } from "./geometry";

export type FormKind = "punt" | "knop" | "scherm" | "schuif" | "grafiek" | "route" | "kaart";

export type Features = {
  length: number;
  box: ReturnType<typeof bbox>;
  closed: boolean;
  straightness: number;
  corners: Pt[];
  crossings: number;
  loops: number;
  roundness: number; // 0 = perfecte cirkel (spreiding van de straal)
  circularity: number; // 4πA/P²: cirkel 1, vierkant 0,79
  monotoneX: number; // 0..1, aandeel segmenten in de hoofdrichting
  horizontal: boolean;
  /** het deel van de lijn dat de vorm draagt (zonder aanloop uit de kop) */
  core: Pt[];
};

/** Zoek of de lijn zich ergens sluit: het eindpunt komt terug bij een eerder punt. Alles daarvoor is aanloop. */
function findLoop(all: Pt[]): { core: Pt[]; closed: boolean } {
  const end = all[all.length - 1];
  const limit = Math.floor(all.length * 0.6);
  let best = 0, bestD = Infinity;
  for (let i = 0; i < limit; i++) {
    const d = dist(all[i], end);
    if (d < bestD) { bestD = d; best = i; }
  }
  const loop = all.slice(best);
  const b = bbox(loop);
  const span = Math.max(b.w, b.h, 1);
  if (loop.length > 12 && length(loop) > span * 2.2 && bestD < span * 0.2) return { core: loop, closed: true };
  return { core: all, closed: false };
}

function area(p: Pt[]) {
  let a = 0;
  for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i].x * q.y - q.x * p[i].y; }
  return a / 2;
}

export function analyze(raw: Pt[]): Features {
  const all = resample(raw, 160);
  const { core, closed } = findLoop(all);
  const pts = resample(core, 96);
  const len = length(core);
  const box = bbox(pts);
  const span = Math.max(box.w, box.h, 1);
  const gap = dist(pts[0], pts[pts.length - 1]);
  const straightness = len > 0 ? gap / len : 0;
  const simple = simplify(pts, span * 0.075);
  const corners: Pt[] = [];
  for (let i = 1; i < simple.length - 1; i++) {
    const a = simple[i - 1], b = simple[i], c = simple[i + 1];
    const a1 = Math.atan2(b.y - a.y, b.x - a.x), a2 = Math.atan2(c.y - b.y, c.x - b.x);
    let d = Math.abs(a2 - a1);
    if (d > Math.PI) d = 2 * Math.PI - d;
    if (d > 0.95) corners.push(b);
  }
  // kruisingen en lussen over de hele lijn: een wilde krabbel blijft een krabbel, ook als hij ergens sluit
  const crossings = Math.max(selfIntersections(resample(core, 64)), selfIntersections(resample(all, 80)));
  const loops = Math.max(Math.abs(totalTurning(pts)), Math.abs(totalTurning(resample(all, 120)))) / (2 * Math.PI);
  const c = centroid(pts);
  const radii = pts.map((p) => dist(p, c));
  const mean = radii.reduce((s, r) => s + r, 0) / radii.length;
  const sd = Math.sqrt(radii.reduce((s, r) => s + (r - mean) ** 2, 0) / radii.length);
  let pos = 0, neg = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    if (dx > 0.5) pos++;
    else if (dx < -0.5) neg++;
  }
  return {
    length: len,
    box,
    closed,
    straightness,
    corners,
    crossings,
    loops,
    roundness: mean > 0 ? sd / mean : 1,
    circularity: closed ? (4 * Math.PI * Math.abs(area(pts))) / Math.max(1, length(pts) ** 2) : 0,
    monotoneX: Math.max(pos, neg) / Math.max(1, pos + neg),
    horizontal: box.w >= box.h,
    core,
  };
}

export function classify(f: Features): FormKind {
  if (f.length < 36) return "punt";
  if (f.crossings >= 3 || f.loops >= 2.2) return "kaart";
  if (f.closed) return f.circularity > 0.86 ? "knop" : "scherm";
  if (f.straightness > 0.86) return "schuif";
  if (f.monotoneX > 0.86 && f.box.w > f.box.h * 0.9) return "grafiek";
  return "route";
}

/** Korte meetlabels die bij het kijken naast de schets verschijnen. */
export function measureLabels(f: Features): string[] {
  const out: string[] = [];
  out.push(f.closed ? "gesloten" : "open");
  const round = f.closed && f.circularity > 0.86;
  if (f.corners.length && !round) out.push(`${f.corners.length} ${f.corners.length === 1 ? "hoek" : "hoeken"}`);
  if (f.crossings) out.push(`${f.crossings} ${f.crossings === 1 ? "kruising" : "kruisingen"}`);
  if (!f.closed && f.straightness > 0.86) out.push("één richting");
  if (f.closed && f.circularity > 0.86) out.push("rond");
  const ratio = f.box.w / Math.max(1, f.box.h);
  out.push(ratio > 1 ? `${ratio.toFixed(1).replace(".", ",")} : 1` : `1 : ${(1 / Math.max(ratio, 0.01)).toFixed(1).replace(".", ",")}`);
  return out.slice(0, 3);
}
