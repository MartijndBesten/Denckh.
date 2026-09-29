"use client";

// "Wat kan een idee worden?" Eén stuk materiaal (jouw lijn) dat steeds een andere vorm aanneemt. Voorbeelden, geen dienstenlijst.
import { useEffect, useMemo, useRef, useState } from "react";
import { linePath, resample } from "@/lib/ink/geometry";
import { useInView, useMorph, useWidth } from "@/lib/ink/hooks";
import { OUTCOMES, SHAPES, SN } from "@/lib/ink/shapes";
import { place, useSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";

export function Outcomes() {
  const boxRef = useRef<HTMLDivElement>(null);
  const seen = useInView(boxRef);
  const reduced = useReducedMotion();
  const width = useWidth(boxRef, 420);
  const w = Math.min(width, 560), h = Math.round(Math.min(width, 560) * 0.68);
  const sketch = useSketch();
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  // automatisch doorlopen zolang niemand zelf kiest
  useEffect(() => {
    if (!seen || touched || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % OUTCOMES.length), 2600);
    return () => window.clearInterval(id);
  }, [seen, touched, reduced]);

  const raw = useMemo(() => resample(place(sketch.points, w * 0.12, h * 0.12, w * 0.76, h * 0.76), SN), [sketch, w, h]);
  const outcome = OUTCOMES[index];
  const shape = useMemo(() => (outcome.shape === "schets" ? null : SHAPES[outcome.shape]({ w, h })), [outcome, w, h]);
  const target = shape ? shape.outline : raw;
  const pts = useMorph(target, 820, reduced);
  const isSketch = !shape;

  return (
    <div className="outcomes">
      <div className="outcomes__figure" ref={boxRef}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          <path d={linePath(pts, !!shape?.closed)} className={`outcomes__line${isSketch ? " is-sketch" : ""}`} />
          {shape && (
            <g key={index} className="outcomes__details">
              {shape.details.map((d, i) => <path key={i} d={d} pathLength={1} style={{ animationDelay: `${520 + i * 60}ms` }} />)}
            </g>
          )}
        </svg>
      </div>
      <div className="outcomes__words">
        <p className="outcomes__now" aria-live="polite">
          <span className="visually-hidden">Getoond: </span>{isSketch ? "Of iets waar nog geen naam voor is." : outcome.word}
        </p>
        <p className="outcomes__eg" id="outcomes-eg">bijvoorbeeld</p>
        <ul className="outcomes__list" aria-labelledby="outcomes-eg">
          {OUTCOMES.map((o, i) => (
            <li key={o.word}>
              <button type="button" aria-pressed={i === index} className={i === index ? "is-on" : undefined}
                onClick={() => { setTouched(true); setIndex(i); }}>
                {o.shape === "schets" ? "iets zonder naam" : o.word}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
