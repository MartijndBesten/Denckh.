"use client";

// Woordmerk denckh. met ck-ligatuur (werkhypothese, zie docs/typografie/). De punt leeft: na je schets
// neemt hij heel klein de vorm aan die jouw idee kreeg.
import { useSketch } from "@/lib/ink/store";
import { DOT, LETTERS, LIGATURE, VIEWBOX } from "./wordmarkPaths";


export function Wordmark({ className = "", living = true }: { className?: string; living?: boolean }) {
  const sketch = useSketch();
  const kind = living && sketch.own ? sketch.kind : "punt";
  const { cx, cy, r } = DOT;
  return (
    <svg className={`wordmark ${className}`} viewBox={VIEWBOX} role="img" aria-label="denckh.">
      <path d={LETTERS} fill="currentColor" />
      <rect {...LIGATURE} fill="currentColor" />
      <g className="wordmark__dot" data-kind={kind}>
        {kind === "punt" && <circle cx={cx} cy={cy} r={r} />}
        {kind === "knop" && <><circle cx={cx} cy={cy} r={r * 0.8} className="wm-stroke" /><path d={`M${cx} ${cy} L${cx + r * 0.5} ${cy - r * 0.5}`} className="wm-stroke" /></>}
        {kind === "scherm" && <rect x={cx - r * 1.1} y={cy - r * 0.8} width={r * 2.2} height={r * 1.6} rx={r * 0.3} className="wm-stroke" />}
        {kind === "schuif" && <><path d={`M${cx - r * 1.4} ${cy} H${cx + r * 1.2}`} className="wm-stroke" /><circle cx={cx + r * 0.3} cy={cy} r={r * 0.55} /></>}
        {kind === "grafiek" && <path d={`M${cx - r * 1.2} ${cy + r * 0.6} L${cx - r * 0.3} ${cy - r * 0.1} L${cx + r * 0.3} ${cy + r * 0.3} L${cx + r * 1.2} ${cy - r * 0.8}`} className="wm-stroke" />}
        {kind === "route" && <><circle cx={cx - r * 0.9} cy={cy + r * 0.4} r={r * 0.38} /><circle cx={cx + r * 0.9} cy={cy - r * 0.4} r={r * 0.38} /><path d={`M${cx - r * 0.9} ${cy + r * 0.4} L${cx + r * 0.9} ${cy - r * 0.4}`} className="wm-stroke" /></>}
        {kind === "kaart" && <><circle cx={cx - r * 0.8} cy={cy + r * 0.5} r={r * 0.35} /><circle cx={cx + r * 0.8} cy={cy + r * 0.5} r={r * 0.35} /><circle cx={cx} cy={cy - r * 0.7} r={r * 0.35} /></>}
      </g>
    </svg>
  );
}
