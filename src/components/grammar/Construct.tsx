"use client";

// Een project dat uit lijnen wordt opgebouwd. Tijdens het scrollen loopt jouw lijn door een paar
// tussenvormen naar de echte vorm van het project. Scroll bepaalt alleen hoe ver het is; de pagina scrolt normaal.
// De stappen onder het beeld zijn knoppen: wijs er een aan (of klik, of tab ernaartoe) en de lijn loopt daarheen.
// Verder scrollen neemt het weer over.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { clamp, linePath, resample, type Pt } from "@/lib/ink/geometry";
import { mix, useScrollProgress, useWidth } from "@/lib/ink/hooks";
import { SN } from "@/lib/ink/shapes";
import { place, useSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";
import { BUILDS } from "./caseBuilds";

export type Stage = { outline: Pt[]; closed: boolean; details?: ReactNode; caption: string };
export type Build = (w: number, h: number) => { stages: Stage[]; final?: ReactNode };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** Binnen een overgang: 12% rust aan beide kanten, zodat elke vorm even blijft staan. */
const settle = (local: number) => ease(clamp((local - 0.12) / 0.76, 0, 1));

export function Construct({ project, label, end, ratio = 0.72, tone = "paper" }: {
  project: keyof typeof BUILDS; label: string; end?: string; ratio?: number; tone?: "paper" | "night";
}) {
  const build = BUILDS[project];
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // 0 zodra het midden van het beeld op 92% van de schermhoogte staat (het beeld komt dan half in zicht),
  // 1 als het midden op 28% staat.
  const p = useScrollProgress(ref, !reduced, { from: 0.92, to: 0.28 });
  const width = useWidth(ref, 520);
  const w = width, h = Math.round(width * ratio);
  const sketch = useSketch();
  const { stages, final } = useMemo(() => build(w, h), [build, w, h]);
  const start = useMemo(() => resample(place(sketch.points, w * 0.15, h * 0.15, w * 0.7, h * 0.7), SN), [sketch, w, h]);

  const all = [{ outline: start, closed: false, caption: sketch.own ? "jouw lijn" : "een lijn" } as Stage, ...stages];
  const M = all.length - 1; // overgangen tussen vormen
  const total = M + (final ? 1 : 0); // plus de overgang naar het echte eindbeeld
  const steps = [...all.map((s) => s.caption), ...(final ? [end ?? label] : [])];

  // heel even niets: de eerste 4% van de scrollweg blijft de lijn een lijn
  const scrollPos = clamp((p - 0.04) / 0.9, 0, 1) * total;
  const [manual, setManual] = useState<{ target: number; at: number } | null>(null);
  const goal = manual ? manual.target : scrollPos;

  // na een klik glijdt de lijn naar de gekozen stap; wie daarna flink scrolt, krijgt de scrollstand terug
  const [shown, setShown] = useState(goal);
  const shownRef = useRef(goal);
  const glide = useRef(false);
  useEffect(() => {
    if (manual && Math.abs(p - manual.at) > 0.25) {
      glide.current = true;
      const id = requestAnimationFrame(() => setManual(null));
      return () => cancelAnimationFrame(id);
    }
  }, [p, manual]);
  useEffect(() => {
    let raf = 0, last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const cur = shownRef.current;
      // altijd een fractie na-ijlen: schokkerige scroll (touch) wordt een vloeiende beweging; na een stapkeuze iets langer
      const tau = glide.current ? 170 : 90;
      const next = reduced ? goal : cur + (goal - cur) * (1 - Math.exp(-dt / tau));
      const done = Math.abs(goal - next) < 0.002;
      shownRef.current = done ? goal : next;
      setShown(shownRef.current);
      if (done) glide.current = false;
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [goal, reduced]);

  const go = (s: number) => {
    glide.current = true;
    setManual({ target: s, at: p });
  };

  const pos = clamp(shown, 0, total);
  const i = Math.min(M - 1, Math.floor(Math.min(pos, M)));
  const eased = pos >= M ? 1 : settle(pos - i);
  const finalT = final && pos > M ? settle(pos - M) : 0;
  const pts = mix(all[i].outline, all[i + 1].outline, eased);
  const closed = eased > 0.5 ? all[i + 1].closed : all[i].closed;
  const shapeIdx = eased > 0.5 ? i + 1 : i;
  const atRest = eased === 0 || eased === 1;
  const active = Math.round(pos);

  return (
    <figure className={`construct construct--${tone}`} ref={ref} style={{ ["--final" as string]: finalT }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        {final && <g className="construct__final" style={{ opacity: finalT }}>{final}</g>}
        <path d={linePath(pts, closed)} className={`construct__line${shapeIdx === 0 ? " is-sketch" : ""}`} style={{ opacity: 1 - finalT * 0.85 }} />
        {all.map((s, si) => s.details && (
          <g key={si} className={`construct__details${si === shapeIdx && atRest ? " is-on" : ""}`} style={{ opacity: si === shapeIdx ? 1 - finalT : 0 }}>
            {s.details}
          </g>
        ))}
      </svg>
      <figcaption className="construct__steps">
        <span className="visually-hidden">Stappen van lijn naar vorm. Kies een stap om die te bekijken.</span>
        <ol>
          {steps.map((c, s) => (
            <li key={s}>
              <button type="button" onClick={() => go(s)} onFocus={() => go(s)} onPointerEnter={(e) => { if (e.pointerType === "mouse") go(s); }}
                aria-current={s === active ? "step" : undefined}
                className={s === active ? "is-on" : s < active ? "is-past" : undefined}>{c}</button>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

export const rr = (x: number, y: number, w: number, h: number, r = 6) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
