"use client";

// Richtprijzen per vorm. Eén lijn (die van de bezoeker, of die van Denckh) neemt de vorm aan van de rij waar je bent:
// tijdens het scrollen de rij in het midden van het scherm, met de muis de rij waar je op wijst (alleen muis: een tik
// op een telefoon zet geen rij vast). Zelfde lijn, andere vorm, andere prijs. De figuur is versiering (aria-hidden);
// alle informatie staat in de lijst zelf.
import { useEffect, useMemo, useRef, useState } from "react";
import { linePath, resample } from "@/lib/ink/geometry";
import { useMorph } from "@/lib/ink/hooks";
import { SHAPES, SN } from "@/lib/ink/shapes";
import { place, useSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";
import { DOMAIN_NOTE, type FormPrice } from "@/lib/prices";

export function FormPrices({ items }: { items: FormPrice[] }) {
  const figRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  // vaste tekenmaat; de svg schaalt mee. --k is de schaal op het scherm, zodat de lijn overal even dik blijft (geen
  // vector-effect: dat rekent streepjes in schermpixels en dan tekenen de details maar voor een deel)
  const w = 360, h = 252;
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(() => { const k = svg.getBoundingClientRect().width / w; if (k > 0) svg.style.setProperty("--k", k.toFixed(3)); });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);
  const sketch = useSketch();
  const [scrolled, setScrolled] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? scrolled;
  // de punt op de lijn langs de lijst: hij loopt mee naar de vorm waar je bent
  const [dotY, setDotY] = useState<number | null>(null);
  useEffect(() => {
    const list = listRef.current;
    const name = list?.children[active]?.querySelector<HTMLElement>(".fp__name");
    if (!list || !name) return;
    // offsetTop van de naam telt al vanaf de rail (die is positioned); rijen zelf zijn dat niet
    let id = 0;
    const place = () => { cancelAnimationFrame(id); id = requestAnimationFrame(() => setDotY(name.offsetTop + name.offsetHeight / 2)); };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => { ro.disconnect(); cancelAnimationFrame(id); };
  }, [active]);

  // de rij die het dichtst bij het leespunt staat (onder de vaste figuur op mobiel)
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const list = listRef.current, fig = figRef.current;
      if (!list || !fig) return;
      const rows = [...list.children] as HTMLElement[];
      const figBottom = Math.max(0, fig.getBoundingClientRect().bottom);
      const stacked = getComputedStyle(fig).position === "sticky" && fig.getBoundingClientRect().width > list.getBoundingClientRect().width * 0.9;
      const target = stacked ? figBottom + (innerHeight - figBottom) * 0.3 : innerHeight * 0.45;
      let best = 0, bestD = Infinity;
      rows.forEach((r, i) => { const b = r.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - target); if (d < bestD) { bestD = d; best = i; } });
      setScrolled(best);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    raf = requestAnimationFrame(read);
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const item = items[active];
  const raw = useMemo(() => resample(place(sketch.points, w * 0.14, h * 0.14, w * 0.72, h * 0.72), SN), [sketch, w, h]);
  const shape = useMemo(() => (item.shape === "schets" || !SHAPES[item.shape] ? null : SHAPES[item.shape]({ w, h })), [item, w, h]);
  const pts = useMorph(shape ? shape.outline : raw, 700, reduced);

  // details tekenen met hun echte lengte: pathLength rekent Chrome in een geschaalde svg verkeerd (dan komt maar een
  // deel op papier)
  const detailsRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const g = detailsRef.current;
    if (!g || reduced) return;
    const ease = getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() || "ease-out";
    const anims = [...g.querySelectorAll("path")].map((el, i) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len} ${len}`;
      return el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 500, delay: 420 + i * 40, easing: ease, fill: "backwards" });
    });
    return () => anims.forEach((a) => a.cancel());
  }, [item.key, reduced]);

  return (
    <div className="fp">
      <div className="fp__figure" ref={figRef} aria-hidden="true">
        <svg ref={svgRef} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <path d={linePath(pts, !!shape?.closed)} className={`fp__line${shape ? "" : " is-sketch"}`} />
          {shape && (
            <g key={item.key} className="fp__details" ref={detailsRef}>
              {shape.details.map((d, i) => <path key={i} d={d} />)}
            </g>
          )}
        </svg>
        <p className="fp__now"><span>{item.name}</span><span className="fp__now-price">vanaf €{item.price}</span></p>
      </div>
      <div className="fp__rail">
      {dotY !== null && <span className="fp__dot" style={{ transform: `translateY(${dotY}px)` }} aria-hidden="true" />}
      <ul className="fp__list" ref={listRef}>
        {items.map((it, i) => (
          <li key={it.key} className={`fp__row${i === active ? " is-on" : ""}`} onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)} onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}>
            <div className="fp__top">
              <h3 className="fp__name">{it.name}</h3>
              <p className="fp__price"><span className="fp__from">vanaf</span> €{it.price}</p>
            </div>
            <p className="fp__text">{it.text}</p>
            {it.aside && <p className="fp__aside">{it.aside}</p>}
            {it.domain && <p className="fp__domain">{DOMAIN_NOTE}</p>}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
