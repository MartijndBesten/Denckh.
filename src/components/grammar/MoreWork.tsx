"use client";

// "Ook gemaakt": kleinere projecten, elk als één vorm. Zodra ze in beeld komen, loopt jouw lijn erin over.
// Alleen geverifieerde inhoud (docs/cases/). Werk voor derden zonder naam, tenzij toestemming is vastgelegd.
import { useEffect, useMemo, useRef, useState } from "react";
import { linePath, resample } from "@/lib/ink/geometry";
import { useInView, useMorph, useWidth } from "@/lib/ink/hooks";
import { SHAPES, SN } from "@/lib/ink/shapes";
import { place, useSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";

type Item = { shape: keyof typeof SHAPES; kind: string; title: string; text: string; link?: { href: string; label: string }; note?: string; accentLast?: boolean };

const ITEMS: Item[] = [
  {
    shape: "agenda",
    kind: "evenement → reserveren en regelen",
    title: "Autowasdag Sionkerk",
    text: "Een autowasdag van een kerk in Houten kreeg een eigen site. Bezoekers reserveerden een tijdslot, vrijwilligers meldden zich aan en de organisatie regelde alles vanuit één beheeromgeving. Na afloop werd de site een terugblik.",
    link: { href: "https://autowasdagsionkerk.nl", label: "autowasdagsionkerk.nl" },
    accentLast: true,
  },
  {
    shape: "presentatie",
    kind: "complexe techniek → een verhaal in schermen",
    title: "Een presentatie die je bedient",
    text: "Een presentatie over een technisch systeem die je niet afspeelt maar bedient: hoofdstukken per onderwerp, schema's waar je doorheen klikt en een PDF om achter te laten.",
    note: "Zonder merknaam of beelden.",
  },
  {
    shape: "gebouw",
    kind: "systeem → zichtbaar gedrag",
    title: "Een werkdag in 3D",
    text: "Een interactief 3D-model van een kantoorgebouw dat één werkdag doorloopt. Je ziet hoe het gebouw reageert op mensen, daglicht en tijd, en je grijpt zelf in: tijd versnellen, een ruimte aanklikken, iemand laten lopen.",
    note: "Zonder merknaam of beelden.",
  },
];

function Glyph({ item, delay }: { item: Item; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, "0px 0px -20% 0px");
  const reduced = useReducedMotion();
  const width = useWidth(ref, 300);
  const w = width, h = Math.round(width * 0.62);
  const sketch = useSketch();
  const [formed, setFormed] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const id = window.setTimeout(() => setFormed(true), reduced ? 0 : delay);
    return () => window.clearTimeout(id);
  }, [seen, delay, reduced]);

  const raw = useMemo(() => resample(place(sketch.points, w * 0.2, h * 0.14, w * 0.6, h * 0.72), SN), [sketch, w, h]);
  const shape = useMemo(() => SHAPES[item.shape]({ w, h }), [item.shape, w, h]);
  const on = formed || reduced;
  const pts = useMorph(on ? shape.outline : raw, 900, reduced);

  return (
    <div className="more__figure" ref={ref}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <path d={linePath(pts, on && shape.closed)} className={`more__line${on ? "" : " is-sketch"}`} />
        {on && (
          <g className="more__details">
            {shape.details.map((d, i) => (
              <path key={i} d={d} pathLength={1} className={item.accentLast && i === shape.details.length - 1 ? "is-accent" : undefined}
                style={{ animationDelay: `${reduced ? 0 : 640 + i * 45}ms` }} />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export function MoreWork() {
  return (
    <ul className="more">
      {ITEMS.map((item, i) => (
        <li key={item.title} className="more__item">
          <Glyph item={item} delay={i * 260} />
          <p className="case__kind">{item.kind}</p>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          {item.link && <p className="case__links"><a className="link-draw" href={item.link.href} rel="noopener">{item.link.label}</a></p>}
          {item.note && <p className="case__note">{item.note}</p>}
        </li>
      ))}
    </ul>
  );
}
