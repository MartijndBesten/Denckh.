"use client";

// Een project dat uit lijnen wordt opgebouwd. Tijdens het scrollen loopt jouw lijn door een paar
// tussenvormen naar de echte vorm van het project. Scroll bepaalt alleen hoe ver het is; de pagina scrolt normaal.
import { useMemo, useRef, type ReactNode } from "react";
import { clamp, linePath, resample, type Pt } from "@/lib/ink/geometry";
import { mix, useScrollProgress, useWidth } from "@/lib/ink/hooks";
import { SN } from "@/lib/ink/shapes";
import { place, useSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";
import { BUILDS } from "./caseBuilds";

export type Stage = { outline: Pt[]; closed: boolean; details?: ReactNode; caption: string };
export type Build = (w: number, h: number) => { stages: Stage[]; final?: ReactNode };

export function Construct({ project, label, ratio = 0.72, tone = "paper" }: { project: keyof typeof BUILDS; label: string; ratio?: number; tone?: "paper" | "night" }) {
  const build = BUILDS[project];
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const p = useScrollProgress(ref, !reduced);
  const width = useWidth(ref, 520);
  const w = width, h = Math.round(width * ratio);
  const sketch = useSketch();
  const { stages, final } = useMemo(() => build(w, h), [build, w, h]);
  const start = useMemo(() => resample(place(sketch.points, w * 0.15, h * 0.15, w * 0.7, h * 0.7), SN), [sketch, w, h]);

  // segmenten: schets → stage[0] → stage[1] → ... ; laatste 18% voor het echte eindbeeld
  const all = [{ outline: start, closed: false, caption: sketch.own ? "jouw lijn" : "een lijn" } as Stage, ...stages];
  const span = 0.82 / (all.length - 1);
  const pos = clamp(p / span, 0, all.length - 1);
  const i = Math.min(all.length - 2, Math.floor(pos));
  const local = clamp((pos - i - 0.15) / 0.7, 0, 1); // korte rust op elke vorm
  const eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
  const pts = mix(all[i].outline, all[i + 1].outline, eased);
  const closed = eased > 0.5 ? all[i + 1].closed : all[i].closed;
  const settled = pos >= all.length - 1 - 0.05;
  const current = eased > 0.6 ? i + 1 : i;
  const finalT = clamp((p - 0.82) / 0.14, 0, 1);

  return (
    <figure className={`construct construct--${tone}`} ref={ref} style={{ ["--final" as string]: finalT }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        {final && <g className="construct__final" style={{ opacity: finalT }}>{final}</g>}
        <path d={linePath(pts, closed)} className={`construct__line${current === 0 ? " is-sketch" : ""}`} style={{ opacity: 1 - finalT * 0.85 }} />
        {all.map((s, si) => s.details && (
          <g key={si} className={`construct__details${si === current && (settled || local > 0.92 || local < 0.05) ? " is-on" : ""}`} style={{ opacity: si === current ? 1 - finalT : 0 }}>
            {s.details}
          </g>
        ))}
      </svg>
      <figcaption className="construct__steps">
        {all.map((s, si) => <span key={si} className={si === current ? "is-on" : si < current ? "is-past" : undefined}>{s.caption}</span>)}
        {final && <span className={finalT > 0.5 ? "is-on" : undefined}>{label}</span>}
      </figcaption>
    </figure>
  );
}

export const rr = (x: number, y: number, w: number, h: number, r = 6) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
