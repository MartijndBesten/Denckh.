"use client";

// Jouw lijn, uitgerold. Het ritme van de schets uit de hero wordt de overgang tussen twee secties.
import { useRef } from "react";
import { linePath, resample, smooth } from "@/lib/ink/geometry";
import { useInView, useWidth } from "@/lib/ink/hooks";
import { useSketch } from "@/lib/ink/store";

export function InkRule({ note }: { note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const width = useWidth(ref, 900);
  const sketch = useSketch();
  const h = 56;
  const pts = resample(sketch.points, 72);
  const ys = pts.map((p) => p.y);
  const mean = ys.reduce((s, v) => s + v, 0) / ys.length;
  const amp = 16 / Math.max(0.2, Math.max(...ys) - Math.min(...ys));
  const line = smooth(pts.map((p, i) => ({ x: 4 + (i / (pts.length - 1)) * (width - 16), y: h / 2 + (p.y - mean) * amp })), 2);
  const end = line[line.length - 1];
  return (
    <div ref={ref} className={`ink-rule${seen ? " is-drawn" : ""}`} aria-hidden="true">
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
        <path d={linePath(line)} pathLength={1} className="ink-rule__line" />
        <circle cx={end.x} cy={end.y} r={4.5} className="ink-rule__dot" />
      </svg>
      {note && <span className="ink-rule__note">{sketch.own ? note : "een lijn van Denckh"}</span>}
    </div>
  );
}
