// De lijn van de bezoeker reist mee door de site. Alles blijft in de browser (sessionStorage); er wordt niets verstuurd.
import { useSyncExternalStore } from "react";
import type { FormKind } from "./analyze";
import type { Plan } from "./concept";
import { bbox, resample, type Pt } from "./geometry";

export type Sketch = {
  /** 96 punten, genormaliseerd naar 0..1 binnen het eigen kader */
  points: Pt[];
  aspect: number;
  kind: FormKind;
  name: string;
  idea?: string;
  /** wat Denckh van het idee maakte; gaat mee naar de mail */
  plan?: Plan;
  own: boolean;
};

const KEY = "denckh:schets";

/** De schets van Denckh zelf, voor wie (nog) niets tekent. */
function defaultPoints(): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const a = t * Math.PI * 2.35;
    pts.push({
      x: 0.12 + t * 0.62 + Math.cos(a) * 0.16 * (1 - t * 0.4),
      y: 0.55 + Math.sin(a) * 0.3 * (1 - t * 0.5) - t * 0.18 + Math.sin(t * 17) * 0.015,
    });
  }
  return pts;
}

export function normalize(points: Pt[]): { points: Pt[]; aspect: number } {
  const r = resample(points, 96);
  const b = bbox(r);
  const s = Math.max(b.w, b.h, 1);
  return {
    points: r.map((p) => ({ x: (p.x - b.x0) / s, y: (p.y - b.y0) / s })),
    aspect: b.w / Math.max(1, b.h),
  };
}

const fallback: Sketch = { ...normalize(defaultPoints()), kind: "route", name: "een route", own: false };

let current: Sketch = fallback;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) current = { ...fallback, ...JSON.parse(raw) };
  } catch {
    /* geen opslag beschikbaar: gebruik de standaardschets */
  }
}

export function setSketch(next: Partial<Sketch>) {
  current = { ...current, ...next };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* negeren */
  }
  listeners.forEach((l) => l());
}

export function clearSketch() {
  current = fallback;
  try { window.sessionStorage.removeItem(KEY); } catch { /* negeren */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  queueMicrotask(l);
  return () => listeners.delete(l);
}

export function useSketch(): Sketch {
  return useSyncExternalStore(subscribe, () => current, () => fallback);
}

/** Plaats een genormaliseerde schets in een kader (x, y, breedte, hoogte), behoudt verhoudingen. */
export function place(points: Pt[], x: number, y: number, w: number, h: number): Pt[] {
  const b = bbox(points);
  const s = Math.min(w / Math.max(b.w, 0.001), h / Math.max(b.h, 0.001));
  const ox = x + (w - b.w * s) / 2 - b.x0 * s;
  const oy = y + (h - b.h * s) / 2 - b.y0 * s;
  return points.map((p) => ({ x: ox + p.x * s, y: oy + p.y * s }));
}
