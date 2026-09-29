"use client";

// Prijzen als lijn: een punt (een kleine gedachte) die tijdens het scrollen via een schets (een eerste vorm) naar iets
// gemaakts loopt. Scroll leest alleen, net als bij de projecten. Met reduced motion staat de lijn er meteen helemaal.
import { useEffect, useRef, useState } from "react";
import { clamp, type Pt } from "@/lib/ink/geometry";
import { useScrollProgress } from "@/lib/ink/hooks";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";
import type { PriceStop, StopGlyph } from "@/lib/prices";

type Geo = { w: number; h: number; d: string; marks: number[] };

/** Een getekende verbinding van halte naar halte, met de pen even opgetild bij elke vorm; tussen de laatste twee
 *  een kleine lus, zoals in de krul. */
function buildPath(boxes: DOMRect[], origin: DOMRect): { segs: string[]; start: Pt } {
  const c = boxes.map((r) => ({ x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2, w: r.width, h: r.height }));
  const segs: string[] = [];
  let start: Pt = { x: 0, y: 0 };
  for (let i = 0; i < c.length - 1; i++) {
    const a = c[i], b = c[i + 1];
    const across = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
    const A = across ? { x: a.x + a.w / 2 + 8, y: a.y } : { x: a.x, y: a.y + a.h / 2 + 8 };
    const B = across ? { x: b.x - b.w / 2 - 8, y: b.y } : { x: b.x, y: b.y - b.h / 2 - 8 };
    if (i === 0) start = A;
    else segs.push(`M${A.x.toFixed(1)} ${A.y.toFixed(1)}`); // de pen tilt op bij de vorm en gaat erachter verder
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), u = { x: dx / L, y: dy / L }, n = { x: -u.y, y: u.x };
    const at = (t: number, off: number) => ({ x: A.x + dx * t + n.x * off, y: A.y + dy * t + n.y * off });
    const f = (q: Pt) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    const wave = Math.min(18, L * 0.08) * (i % 2 ? -1 : 1);
    if (i < c.length - 2) {
      segs.push(`C ${f(at(0.32, -wave))}, ${f(at(0.68, wave))}, ${f(B)}`);
    } else {
      // laatste stuk: halverwege één lus, dan rustig naar de vorm
      const r = Math.min(16, L * 0.08), M = at(0.46, 0);
      const E = { x: M.x + u.x * r * 0.4, y: M.y + u.y * r * 0.4 };
      segs.push(`C ${f(at(0.18, -wave))}, ${f(at(0.34, wave * 0.6))}, ${f(M)}`);
      segs.push(`C ${f({ x: M.x + u.x * r * 2.4 - n.x * r * 1.9, y: M.y + u.y * r * 2.4 - n.y * r * 1.9 })}, ${f({ x: M.x - u.x * r * 1.2 - n.x * r * 2.1, y: M.y - u.y * r * 1.2 - n.y * r * 2.1 })}, ${f(E)}`);
      segs.push(`C ${f(at(0.72, wave * 0.5))}, ${f(at(0.86, -wave * 0.3))}, ${f(B)}`);
    }
  }
  return { segs, start };
}

function Glyph({ kind, t }: { kind: StopGlyph; t: number }) {
  const off = (k: number) => ({ strokeDashoffset: 1 - clamp(t * 1.4 - k * 0.25, 0, 1) });
  return (
    <svg className={`pl__glyph pl__glyph--${kind}`} viewBox="0 0 64 48" aria-hidden="true">
      {kind === "punt" && (
        <>
          <circle cx="32" cy="24" r="14" className="pl__ring" />
          <circle cx="32" cy="24" r="7" className="pl__dot" />
        </>
      )}
      {kind === "schets" && (
        <>
          <path pathLength={1} style={off(0)} className="pl__sketch" d="M15 15 C 26 12, 40 14, 50 13 C 51.5 21, 52 28, 50 35 C 38 36.5, 26 37, 14 35 C 13 27, 12.5 21, 16 16" />
          <path pathLength={1} style={off(1)} className="pl__sketch pl__sketch--thin" d="M20 23 C 27 20.5, 33 26, 44 22" />
          <path pathLength={1} style={off(2)} className="pl__sketch pl__sketch--thin" d="M21 29.5 C 26 28.5, 30 30.5, 36 29" />
        </>
      )}
      {kind === "vorm" && (
        <>
          <rect x="11" y="9" width="42" height="30" rx="4" pathLength={1} style={off(0)} className="pl__form" />
          <path d="M11 17 H53" pathLength={1} style={off(1)} className="pl__form pl__form--thin" />
          <rect x="17" y="23" width="13" height="10" rx="1.5" pathLength={1} style={off(2)} className="pl__form pl__form--thin" />
          <rect x="34" y="23" width="13" height="10" rx="1.5" pathLength={1} style={off(2)} className="pl__form pl__form--thin" />
        </>
      )}
    </svg>
  );
}

export function PriceLine({ stops, label }: { stops: PriceStop[]; label: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const p = useScrollProgress(ref, !reduced, { from: 0.9, to: 0.42 });
  const [geo, setGeo] = useState<Geo | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const glyphs = [...el.querySelectorAll<SVGSVGElement>(".pl__glyph")].map((g) => g.getBoundingClientRect());
      if (glyphs.length < 2 || !box.width) return;
      const { segs, start } = buildPath(glyphs, box);
      // lengte per stuk, zodat elke vorm oplicht op het moment dat de lijn hem bereikt
      const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"), probe = document.createElementNS(ns, "path");
      svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
      svg.appendChild(probe); document.body.appendChild(svg);
      const mStart = `M${start.x.toFixed(1)} ${start.y.toFixed(1)}`;
      const lens = segs.map((_, i) => { probe.setAttribute("d", `${mStart} ${segs.slice(0, i + 1).join(" ")}`); return probe.getTotalLength(); });
      svg.remove();
      const total = lens[lens.length - 1] || 1;
      // haltes: 0 (de punt), en het einde van elk verbindingsstuk; het laatste stuk bestaat uit drie delen
      // een stop is bereikt waar het stuk ervoor eindigt: vlak voor de volgende M, of aan het einde
      const ends = segs.map((sg, i) => (i + 1 < segs.length && segs[i + 1].startsWith("M") ? lens[i] : null)).filter((v): v is number => v !== null);
      setGeo({ w: box.width, h: box.height, d: `${mStart} ${segs.join(" ")}`, marks: [0, ...ends.map((l) => l / total), 1].slice(0, stops.length) });
    };
    raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(measure); });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [stops.length]);

  const drawn = reduced ? 1 : clamp(p * 1.08, 0, 1);
  const reach = (i: number) => (i === 0 ? 1 : geo ? clamp((drawn - geo.marks[i]) / 0.1 + 1, 0, 1) : 0);

  return (
    <ol className="pl" ref={ref} aria-label={label}>
      {geo && (
        <svg className="pl__line" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          <path d={geo.d} pathLength={1} style={{ strokeDashoffset: 1 - drawn }} />
        </svg>
      )}
      {stops.map((s, i) => (
        <li key={s.label} className={`pl__stop${reach(i) >= 1 ? " is-reached" : ""}`}>
          <Glyph kind={s.glyph} t={reach(i)} />
          <div className="pl__body">
            <p className="pl__label">{s.label}</p>
            <p className="pl__price">
              {s.from && <span className="pl__from">vanaf </span>}
              <span className="pl__amount">{s.price}</span>
              <span className="pl__meta"> {s.meta}</span>
            </p>
            <p className="pl__text">{s.text}</p>
            {s.note && <p className="pl__note">{s.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
