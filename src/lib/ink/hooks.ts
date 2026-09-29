"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { clamp, easeInOut, lerp, type Pt } from "./geometry";

/** Is het element (ooit) in beeld geweest. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px 0px -15% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return seen;
}

/** Scrollvoortgang van een element: 0 als de bovenkant onderaan het scherm binnenkomt, 1 als het midden het bovenste derde passeert. Geen scroll-kaping: we lezen alleen. */
export function useScrollProgress<T extends Element>(ref: RefObject<T | null>, enabled = true) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.95, end = vh * 0.3 - r.height * 0.5;
      setP(clamp((start - r.top) / (start - end), 0, 1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [ref, enabled]);
  return enabled ? p : 1;
}

/** Laat een puntenreeks vloeiend overlopen naar een nieuwe doelreeks (zelfde lengte). */
export function useMorph(target: Pt[], duration = 700, instant = false) {
  const [pts, setPts] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current.length === target.length ? current.current : target;
    if (instant || duration === 0) {
      current.current = target;
      const id = requestAnimationFrame(() => setPts(target));
      return () => cancelAnimationFrame(id);
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = easeInOut(Math.min(1, (now - t0) / duration));
      const next = target.map((q, i) => ({ x: lerp(from[i].x, q.x, t), y: lerp(from[i].y, q.y, t) }));
      current.current = next;
      setPts(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, instant]);
  return pts;
}

/** Meng twee puntenreeksen (voor scroll-gestuurde overgangen). */
export function mix(a: Pt[], b: Pt[], t: number): Pt[] {
  return a.map((p, i) => ({ x: lerp(p.x, b[i].x, t), y: lerp(p.y, b[i].y, t) }));
}

/** Meet de breedte van een element (voor SVG's die zich aan hun kolom aanpassen). */
export function useWidth<T extends Element>(ref: RefObject<T | null>, fallback = 320) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}
