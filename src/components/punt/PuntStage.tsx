"use client";

// "Begin met een punt": de punt achter "Mooi." is het idee. Je trekt hem uit de zin en tekent.
// Denckh kijkt (meetlijnen), zegt wat het ziet, en geeft er op verzoek een eerste, bruikbare vorm aan.
// Alles gebeurt in de browser. Er wordt niets verstuurd.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from "react";
import { analyze, classify, measureLabels, type Features, type FormKind } from "@/lib/ink/analyze";
import { conceptPlan, conceptReply, makeConcept, type Concept } from "@/lib/ink/concept";
import { buildForm, N, type Form } from "@/lib/ink/forms";
import { bbox, clamp, dist, easeInOut, easeOut, lerp, linePath, outlinePath, resample, smooth, type InkPt, type Pt } from "@/lib/ink/geometry";
import { READINGS, readingFor } from "@/lib/ink/interpret";
import { EXAMPLES, placeExample } from "@/lib/ink/examples";
import { KRUL_BOX, KRUL_START, krulFit, krulPath } from "@/lib/ink/krul";
import { normalize, setSketch } from "@/lib/ink/store";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";
import { FormWidget } from "./FormWidget";

type Phase = "idle" | "drawing" | "kijken" | "lezen" | "vormen" | "vorm";
type Zone = { x: number; y: number; w: number; h: number };

/** Eén korte vraag per punt op de ideeënkaart. Alleen zolang er nog geen idee is verteld. */
const NODE_QUESTIONS: Record<string, string> = {
  "de kern": "Is dit waar het eigenlijk om draait?",
  "een zijsprong": "Hoort dit erbij, of is dit misschien een ander idee?",
  "waar je begon": "Was dit ook het begin van je gedachte?",
  "waar je eindigde": "Kwam je hier bewust uit?",
  "nog een gedachte": "Is dit een tweede idee, of hoort het bij het eerste?",
  "een uitloper": "Hoort dit er nog bij?",
};

const MIN_W = 1.6;
const MAX_W = 7.5;
const INK = "var(--ink)";

export function PuntStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const homeRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const raw = useRef<InkPt[]>([]);
  const pen = useRef<Pt & { w: number; t: number }>({ x: 0, y: 0, w: MAX_W, t: 0 });
  const frame = useRef(0);
  const home = useRef<Pt>({ x: 0, y: 0 });
  const zone = useRef<Zone>({ x: 0, y: 0, w: 300, h: 300 });

  const [phase, setPhase] = useState<Phase>("idle");
  const [ink, setInk] = useState<InkPt[]>([]);
  const [features, setFeatures] = useState<Features | null>(null);
  const [kind, setKind] = useState<FormKind>("route");
  const [reading, setReading] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [morph, setMorph] = useState(0);
  const [idea, setIdea] = useState("");
  const [reply, setReply] = useState("");
  const [concept, setConcept] = useState<Concept | null>(null);
  const [nodeQuestion, setNodeQuestion] = useState<string | null>(null);
  // alleen voor de bediening ("nog een voorbeeld"); de analyse weet niet of een tekening een voorbeeld was
  const [fromExample, setFromExample] = useState(false);
  const nextExample = useRef(0);
  const [keyboard, setKeyboard] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const phaseRef = useRef<Phase>("idle");
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // --- maten: podium, thuispositie van de punt (de punt achter "Mooi."), vrije zone voor vormen
  const measure = useCallback(() => {
    const stage = stageRef.current, homeEl = homeRef.current;
    if (!stage || !homeEl) return;
    const s = stage.getBoundingClientRect();
    const h = homeEl.getBoundingClientRect();
    home.current = { x: h.left - s.left + h.width / 2, y: h.top - s.top + h.height / 2 };
    const zoneEl = stage.querySelector<HTMLElement>("[data-zone]");
    if (zoneEl) {
      const z = zoneEl.getBoundingClientRect();
      zone.current = { x: z.left - s.left, y: z.top - s.top, w: z.width, h: z.height };
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(s.width * ratio);
      canvas.height = Math.round(s.height * ratio);
      canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    setSize({ w: s.width, h: s.height });
    if (phaseRef.current === "idle") placeDot(home.current);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  function placeDot(p: Pt, scale = 1) {
    const d = dotRef.current;
    if (d) d.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
  }

  // --- op een smal scherm staat de tekst onder het tekenvlak. Tekent iemand groter dan het vlak, dan schuift de tekst
  // mee omlaag: lijn, aantekeningen en tekst vallen nooit over elkaar.
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [push, setPush] = useState(0);
  const pushRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    const fit = () => {
      raf = 0;
      const svg = svgRef.current, panel = panelRef.current, stacked = zone.current.y > home.current.y + 40;
      let next = 0;
      if (svg && panel && stacked && phase !== "idle" && phase !== "drawing") {
        const b = svg.getBBox(), top = panel.offsetTop - (parseFloat(getComputedStyle(panel).marginTop) || 0); // ook midden in de overgang
        if (b.height > 0) next = Math.max(0, Math.ceil(b.y + b.height + 16 - top));
      }
      if (next !== pushRef.current) { pushRef.current = next; setPush(next); }
    };
    raf = requestAnimationFrame(fit);
    const late = setTimeout(() => { if (!raf) raf = requestAnimationFrame(fit); }, 900); // na de animaties
    return () => { cancelAnimationFrame(raf); clearTimeout(late); };
  }, [phase, features, form, concept, size]);

  // --- nabijheid: in rust leunt de punt een fractie naar de cursor
  useEffect(() => {
    if (phase !== "idle" || reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = stage.getBoundingClientRect();
        const q = { x: e.clientX - s.left, y: e.clientY - s.top };
        const d = dist(q, home.current);
        const pull = d < 160 ? (1 - d / 160) * 0.22 : 0;
        placeDot({ x: lerp(home.current.x, q.x, pull), y: lerp(home.current.y, q.y, pull) }, 1 + pull * 0.6);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); placeDot(home.current); };
  }, [phase, reduced]);

  // --- tekenen op canvas (snel), per frame
  const paint = useCallback(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = stageRef.current!.getBoundingClientRect();
    ctx.clearRect(0, 0, s.width, s.height);
    const pts = raw.current;
    if (pts.length > 1) {
      ctx.fillStyle = getComputedStyle(stageRef.current!).getPropertyValue("--idea").trim() || "#B07F45";
      ctx.fill(new Path2D(outlinePath(pts)));
    }
    frame.current = 0;
  }, []);

  function schedule() {
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }

  function addPoint(target: Pt, time: number, pressure?: number) {
    const p = pen.current;
    const stream = 0.42; // lichte traagheid: de pen volgt, hij springt niet
    const nx = lerp(p.x, target.x, stream), ny = lerp(p.y, target.y, stream);
    const d = Math.hypot(nx - p.x, ny - p.y);
    const dt = Math.max(8, time - p.t);
    const speed = d / dt; // px per ms
    let w = clamp(MAX_W - speed * 5.2, MIN_W, MAX_W);
    if (pressure && pressure > 0 && pressure !== 0.5) w = clamp(w * (0.55 + pressure), MIN_W, MAX_W * 1.2);
    const sw = lerp(p.w, w, 0.22);
    pen.current = { x: nx, y: ny, w: sw, t: time };
    if (d > 0.6 && raw.current.length < 1600) raw.current.push({ x: nx, y: ny, w: sw });
    placeDot({ x: nx, y: ny }, 0.62);
    schedule();
  }

  function localPoint(e: { clientX: number; clientY: number }): Pt {
    const s = stageRef.current!.getBoundingClientRect();
    return { x: e.clientX - s.left, y: e.clientY - s.top };
  }

  // --- start, bewegen, loslaten
  function reset(keepFocus = true) {
    raw.current = [];
    setInk([]); setForm(null); setFeatures(null); setMorph(0); setReply(""); setConcept(null); setNodeQuestion(null); setFromExample(false); setKeyboard(false);
    setPhase("idle");
    paint();
    placeDot(home.current);
    if (keepFocus) dotRef.current?.focus({ preventScroll: true });
  }

  function begin(e: PointerEvent<HTMLButtonElement>) {
    if (phase !== "idle") return;
    e.preventDefault();
    stageRef.current!.setPointerCapture(e.pointerId);
    const start = home.current;
    raw.current = [{ x: start.x, y: start.y, w: MAX_W }];
    pen.current = { x: start.x, y: start.y, w: MAX_W, t: e.timeStamp };
    setFromExample(false);
    setPhase("drawing");
    addPoint(localPoint(e), e.timeStamp, e.pressure);
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    if (phase !== "drawing" || keyboard) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events) addPoint(localPoint(ev), ev.timeStamp, ev.pressure);
  }

  const release = useCallback(() => {
    const pts = raw.current;
    if (pts.length < 2) { reset(false); return; }
    // aanloop uit de kop (buiten het tekenvlak) telt niet mee voor de vorm
    const z = zone.current, m = 24;
    const inside = (p: Pt) => p.x > z.x - m && p.x < z.x + z.w + m && p.y > z.y - m && p.y < z.y + z.h + m;
    let first = 0;
    while (first < pts.length * 0.4 && !inside(pts[first])) first++;
    const f = analyze(first > 0 && pts.length - first > 8 ? pts.slice(first) : pts);
    const k = classify(f);
    setFeatures(f);
    setKind(k);
    setReading(readingFor(k, f.length));
    // de lijn organiseert zich: resample + zachte smoothing, dikte blijft
    const settled = smooth(resample(pts, Math.max(24, Math.min(220, Math.round(f.length / 5)))), 2);
    const from = resample(pts, settled.length);
    const t0 = performance.now();
    const dur = reduced ? 0 : 420;
    const step = (now: number) => {
      const t = dur ? easeOut(Math.min(1, (now - t0) / dur)) : 1;
      setInk(from.map((p, i) => ({ x: lerp(p.x, settled[i].x, t), y: lerp(p.y, settled[i].y, t), w: lerp(p.w, settled[i].w, t) })));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    const c = canvasRef.current?.getContext("2d");
    const s = stageRef.current!.getBoundingClientRect();
    c?.clearRect(0, 0, s.width, s.height);
    const end = pts[pts.length - 1];
    placeDot(end, 0.62);
    if (k === "punt") {
      setPhase("lezen");
      return;
    }
    setPhase("kijken");
    window.setTimeout(() => setPhase("lezen"), reduced ? 200 : 1700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function end() {
    if (phase !== "drawing" || keyboard) return;
    release();
  }

  // --- toetsenbord: Enter pakt de punt, pijltjes tekenen, Enter laat los, Escape stopt
  function onDotKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (phase === "idle" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      raw.current = [{ ...home.current, w: MAX_W }];
      pen.current = { ...home.current, w: MAX_W, t: performance.now() };
      setFromExample(false);
      setKeyboard(true);
      setPhase("drawing");
      return;
    }
    if (phase === "drawing" && keyboard) {
      const stepSize = e.shiftKey ? 36 : 14;
      const p = pen.current;
      const dirs: Record<string, Pt> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      if (dirs[e.key]) {
        e.preventDefault();
        const target = { x: clamp(p.x + dirs[e.key].x * stepSize, 8, size.w - 8), y: clamp(p.y + dirs[e.key].y * stepSize, 8, size.h - 8) };
        for (let i = 1; i <= 4; i++) {
          const q = { x: lerp(p.x, target.x, i / 4), y: lerp(p.y, target.y, i / 4) };
          raw.current.push({ ...q, w: 4 });
          pen.current = { ...q, w: 4, t: performance.now() };
        }
        placeDot(pen.current, 0.62);
        schedule();
      }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setKeyboard(false); release(); }
      if (e.key === "Escape") { e.preventDefault(); reset(); }
    }
  }

  // --- voorbeeld afspelen (voor wie niet wil of kan tekenen). Een vaste reeks tekeningen (src/lib/ink/examples.ts);
  //     elke klik tekent de volgende. De punt tekent ze echt, daarna leest de engine ze als elke eigen tekening.
  function playExample() {
    if (phase !== "idle") reset(false);
    const z = zone.current;
    const example = EXAMPLES[nextExample.current % EXAMPLES.length];
    nextExample.current += 1;
    setFromExample(true);
    const target = placeExample(example, z, home.current);
    const start = home.current;
    const path = [start, ...resample([start, target[0]], 12).slice(1), ...target];
    raw.current = [{ ...start, w: MAX_W }];
    pen.current = { ...start, w: MAX_W, t: 0 };
    setPhase("drawing");
    let i = 0;
    const tick = (now: number) => {
      const until = reduced ? path.length : Math.min(path.length, i + 3);
      for (; i < until; i++) addPoint(path[i], now + i * 16);
      if (i < path.length) requestAnimationFrame(tick);
      else window.setTimeout(release, 120);
    };
    requestAnimationFrame(tick);
  }

  // --- vorm geven: de schets verandert punt voor punt in de vorm
  function giveForm() {
    if (!features || phase !== "lezen") return;
    // houd ruimte vrij voor het kader dat het idee er later omheen tekent (titel boven, drie delen onder)
    const z0 = zone.current;
    const z = { x: z0.x + 18, y: z0.y + 44, w: z0.w - 36, h: z0.h - 96 };
    const f = buildForm(kind, features.core, features, z);
    setForm(f);
    setPhase("vormen");
    const t0 = performance.now();
    const dur = reduced ? 0 : 1100;
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      setMorph(easeInOut(t));
      if (t < 1) requestAnimationFrame(step);
      else {
        setPhase("vorm");
        const target = f.outline;
        placeDot(f.kind === "knop" ? f.center : target[target.length - 1], 0.001);
        setSketch({ ...normalize(ink), kind, name: READINGS[kind].name, own: true });
      }
    };
    requestAnimationFrame(step);
  }

  function submitIdea(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = idea.trim().slice(0, 140);
    if (!text || !form) return;
    // het idee maakt de vorm concreet: onderdelen, onderwerp en aantekeningen (vaste regels, zie concept.ts)
    const c = makeConcept(text);
    const count = form.kind === "route" || form.kind === "kaart" ? form.nodes.length : 3;
    setConcept(c);
    setReply(conceptReply(c, kind, count) || READINGS[kind].reply(text));
    setSketch({ idea: text, plan: conceptPlan(c, kind, count) });
  }

  // --- afgeleide weergave
  const from = ink.length ? resample(ink, N) : [];
  const morphPts: InkPt[] = form && from.length
    ? from.map((p, i) => ({ x: lerp(p.x, form.outline[i].x, morph), y: lerp(p.y, form.outline[i].y, morph), w: lerp(p.w, 2.2, morph) }))
    : ink;
  const showInk = phase === "kijken" || phase === "lezen";
  const annotations = features && (phase === "kijken" || phase === "lezen") ? buildAnnotations(features) : null;

  return (
    <div
      ref={stageRef}
      className={`punt punt--${phase}${reduced ? " punt--still" : ""}`}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <canvas ref={canvasRef} className="punt__canvas" aria-hidden="true" />

      <div className="punt__copy">
        <h1 className="punt__title">
          Heb je een idee?<br />
          Mooi<span ref={homeRef} className="punt__home" aria-hidden="true" /><span className="visually-hidden">.</span>
        </h1>
        <p className="punt__intro">
          Denckh is een kleine conceptstudio. Weet je nog niet wat het moet worden? Ook goed. Ik denk mee en maak het concreet.
        </p>
      </div>

      <div className="punt__zone" data-zone aria-hidden="true" />

      <svg ref={svgRef} className="punt__svg" width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} aria-hidden={phase !== "vorm"}>
        {(showInk || phase === "vormen") && morphPts.length > 1 && (
          <path d={outlinePath(morphPts)} className="punt__ink" style={{ fill: phase === "vormen" ? `color-mix(in srgb, var(--idea) ${Math.round((1 - morph) * 100)}%, ${INK})` : undefined }} />
        )}
        {annotations}
        {phase === "idle" && size.w > 0 && <GhostHint from={home.current} zone={zone.current} />}
        {phase === "vorm" && form && (
          <>
            <path d={linePath(form.outline, form.closed)} className="punt__form" />
            <FormWidget form={form} concept={concept ?? undefined} onPick={(name) => setNodeQuestion(name ? NODE_QUESTIONS[name] ?? null : null)} />
            {concept && <IdeaMarks form={form} concept={concept} zone={zone.current} stage={size} />}
          </>
        )}
      </svg>

      <button
        ref={dotRef}
        type="button"
        className="punt__dot"
        aria-label={phase === "drawing" && keyboard ? "Teken met de pijltjestoetsen. Enter laat los, Escape stopt." : "De punt. Sleep om te tekenen, of druk Enter en teken met de pijltjestoetsen."}
        onPointerDown={begin}
        onKeyDown={onDotKey}
        disabled={phase === "kijken" || phase === "vormen"}
      />

      <div ref={panelRef} className="punt__panel" aria-live="polite" style={push ? { marginTop: push } : undefined}>
        {phase === "idle" && (
          <p className="punt__hint">
            <span className="punt__hint-main">begin met een punt</span>
            <span className="punt__hint-sub">pak hem vast en teken wat er in je hoofd zit · <button type="button" className="link-button" onClick={playExample}>of bekijk een voorbeeld</button></span>
          </p>
        )}
        {phase === "drawing" && <p className="punt__hint"><span className="punt__hint-main">laat maar lopen</span><span className="punt__hint-sub">{keyboard ? "pijltjes tekenen · Enter laat los" : "er hoeft nog niets te kloppen"}</span></p>}
        {phase === "kijken" && <p className="punt__hint punt__hint--look"><span className="punt__hint-main">Denckh kijkt.</span></p>}
        {phase === "lezen" && (
          <div className="punt__reading">
            <p className="punt__say">{reading}</p>
            {kind !== "punt" && <p className="punt__small">Dat hoeft het niet te zijn. Het is een begin.</p>}
            <div className="punt__actions">
              {kind !== "punt" && <button type="button" className="ink-button" onClick={giveForm}>Zal ik er vorm aan geven?</button>}
              <button type="button" className="link-button" onClick={() => reset()}>Teken opnieuw</button>
              {fromExample && <button type="button" className="link-button" onClick={playExample}>nog een voorbeeld</button>}
            </div>
          </div>
        )}
        {phase === "vorm" && (
          <div className="punt__reading">
            <p className="punt__say">{nodeQuestion && !concept ? nodeQuestion : READINGS[kind].caption}</p>
            <form className="punt__ask" onSubmit={submitIdea}>
              <label htmlFor="punt-idee">{concept ? "Iets anders in je hoofd? Probeer maar." : "Wat zat er ongeveer in je hoofd?"}</label>
              <div className="punt__ask-row">
                <input id="punt-idee" value={idea} onChange={(e) => setIdea(e.target.value)} maxLength={140} placeholder="bijvoorbeeld: een uitleg bij ons product" autoComplete="off" />
                <button type="submit" className="ink-button" disabled={!idea.trim()}>Vertel</button>
              </div>
            </form>
            {reply && <p className="punt__reply">{reply}</p>}
            {concept && (
              <ol className="punt__notes" aria-label="Aantekeningen van Denckh">
                {concept.notes.map((n, i) => <li key={`${concept.idea}-${n}`}><strong>{concept.tiles[i]}</strong> {n}</li>)}
              </ol>
            )}
            <div className="punt__actions">
              <a className="link-draw" href="#contact">Neem dit mee naar een gesprek</a>
              <button type="button" className="link-button" onClick={() => reset()}>Nog een idee</button>
              {fromExample && <button type="button" className="link-button" onClick={playExample}>nog een voorbeeld</button>}
            </div>
            <p className="punt__note">Dit prototype reageert met vaste regels in je browser. Er wordt niets verstuurd of bewaard.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Rode potloodaantekeningen: hoe Denckh naar de schets kijkt. */
function buildAnnotations(f: Features) {
  const { box } = f;
  const pad = 14, arm = 12;
  const x0 = box.x0 - pad, y0 = box.y0 - pad, x1 = box.x1 + pad, y1 = box.y1 + pad;
  const brackets = [
    `M${x0} ${y0 + arm} V${y0} H${x0 + arm}`,
    `M${x1 - arm} ${y0} H${x1} V${y0 + arm}`,
    `M${x1} ${y1 - arm} V${y1} H${x1 - arm}`,
    `M${x0 + arm} ${y1} H${x0} V${y1 - arm}`,
  ];
  const labels = measureLabels(f);
  const corners = f.closed && f.circularity > 0.86 ? [] : f.corners.slice(0, 6);
  let delay = 0;
  const next = () => `${(delay += 110)}ms`;
  return (
    <g className="punt__look">
      {brackets.map((d, i) => <path key={i} d={d} pathLength={1} className="look-line" style={{ animationDelay: next() }} />)}
      {corners.map((c, i) => <circle key={`c${i}`} cx={c.x} cy={c.y} r={9} pathLength={1} className="look-line" style={{ animationDelay: next() }} />)}
      <line x1={x0} y1={y1 + 18} x2={x1} y2={y1 + 18} pathLength={1} className="look-line look-line--thin" style={{ animationDelay: next() }} />
      <text x={x0} y={y1 + 40} className="look-text" style={{ animationDelay: next() }}>
        {labels.join("  ·  ")}
      </text>
    </g>
  );
}

/** Het idee maakt de vorm concreet. Een scherm heeft zijn delen al (tegels); elke andere vorm krijgt een kader
 *  met het onderwerp als titel en de drie delen van het idee als tabs. Oker = het idee, rood = Denckh kijkt. */
function IdeaMarks({ form, concept, zone, stage }: { form: Form; concept: Concept; zone: Zone; stage: { w: number; h: number } }) {
  const text = concept.idea.length > 44 ? `${concept.idea.slice(0, 42).trimEnd()}…` : concept.idea;
  const mark = (x: number, y: number, i: number) => (
    <g key={`m${i}`} className="idea-mark" style={{ animationDelay: `${500 + i * 160}ms` }}>
      <circle cx={x} cy={y} r={8.5} />
      <text x={x} y={y + 3.8}>{i + 1}</text>
    </g>
  );

  if (form.kind === "scherm") {
    const { x, y, w } = form;
    const pad = Math.max(14, w * 0.07), tileY = y + pad + 26, tileW = (w - pad * 2 - 16) / 3;
    const cy = y - 16 > zone.y + 4 ? y - 14 : y + form.h + 24;
    return (
      <g className="punt__idea" key={concept.idea} aria-hidden="true">
        <text x={x} y={cy} className="idea-text">“{text}”</text>
        {[0, 1, 2].map((i) => mark(x + pad + i * (tileW + 8) + tileW - 2, tileY + 2, i))}
      </g>
    );
  }

  // hoe ver de vorm met streepjes en labels reikt
  const r = reach(form);
  const pad = 16, bar = 32, foot = 34;
  let x0 = r.x0 - pad, x1 = r.x1 + pad;
  // breed genoeg voor drie tabs; op een smal scherm gewoon de hele breedte
  const minW = Math.min(stage.w - 8, 340);
  if (x1 - x0 < minW) { const m = clamp((x0 + x1) / 2, minW / 2 + 4, stage.w - minW / 2 - 4); x0 = m - minW / 2; x1 = m + minW / 2; }
  x0 = Math.max(4, x0); x1 = Math.min(stage.w - 4, x1);
  const y0 = Math.max(4, r.y0 - pad - bar), y1 = Math.min(stage.h - 4, r.y1 + pad + foot);
  const W = x1 - x0, slot = W / 3;
  const d = `M${x0 + 14} ${y0} H${x1 - 14} Q${x1} ${y0} ${x1} ${y0 + 14} V${y1 - 14} Q${x1} ${y1} ${x1 - 14} ${y1} H${x0 + 14} Q${x0} ${y1} ${x0} ${y1 - 14} V${y0 + 14} Q${x0} ${y0} ${x0 + 14} ${y0} Z`;
  const longest = Math.max(...concept.tiles.map((t) => t.length));
  const fs = clamp((slot - 34) / (longest * 0.56), 9, 11.5);
  return (
    <g className="punt__idea" key={concept.idea} aria-hidden="true">
      {y0 - 14 > zone.y && <text x={x0} y={y0 - 12} className="idea-text">“{text}”</text>}
      <path d={d} pathLength={1} className="idea-frame" />
      <path d={`M${x0} ${y0 + bar} H${x1} M${x0} ${y1 - foot} H${x1}`} pathLength={1} className="idea-frame idea-frame--thin" />
      <text x={x0 + 14} y={y0 + 21} className="idea-title">{concept.title}</text>
      {concept.tiles.map((t, i) => (
        <g key={t}>
          {mark(x0 + slot * i + 16, y1 - foot / 2, i)}
          <text x={x0 + slot * i + 29} y={y1 - foot / 2 + 3.8} className="idea-tab" style={{ fontSize: fs }}>{t}</text>
        </g>
      ))}
      <path d={`M${x0 + 29} ${y1 - foot / 2 + 8} h${Math.min(slot - 36, concept.tiles[0].length * fs * 0.58)}`} className="idea-active" />
    </g>
  );
}

/** Het gebied dat een vorm inclusief streepjes en labels inneemt. */
function reach(form: Form) {
  switch (form.kind) {
    case "knop": { const { center: c, r } = form, e = r + 36; return { x0: c.x - e, x1: c.x + e, y0: c.y - r - 24, y1: c.y + r * 0.72 + 36 }; }
    case "schuif": { const b = bbox([form.a, form.b]); return { x0: b.x0 - 46, x1: b.x1 + 46, y0: b.y0 - 46, y1: b.y1 + 52 }; }
    case "grafiek": return { x0: form.x0 - 22, x1: form.x1 + 18, y0: form.top - 44, y1: form.base + 24 };
    case "route": case "kaart": { const b = bbox(form.nodes); return { x0: b.x0 - 40, x1: b.x1 + 40, y0: b.y0 - 28, y1: b.y1 + 44 }; }
    default: { const b = bbox(form.outline); return { x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1 }; }
  }
}

/** De hulplijn vóór het tekenen: van de punt naar het tekenvlak, en daar de Denckh-krul (dezelfde lijn als in het
 *  Open Graph-beeld). Gestippeld en potloodgrijs: een voorstel, geen opdracht om over te trekken. */
function GhostHint({ from, zone }: { from: Pt; zone: Zone }) {
  // mobiel: het tekenvlak ligt onder de intro. Dan een kleinere krul hoog in het vlak en een aanloop die na ~90 px al
  // afbuigt, zodat punt en krul dicht bij elkaar blijven en "begin met een punt" eerder in beeld komt.
  const stacked = zone.y > from.y + 40;
  let fit, c1: Pt, c2: Pt;
  const p0 = { x: from.x + (stacked ? 14 : 18), y: from.y + (stacked ? 6 : 0) };
  if (stacked) {
    const kh = zone.h * 0.86, kw = (kh * KRUL_BOX.w) / KRUL_BOX.h;
    fit = krulFit(zone.x + (zone.w - kw) * 0.62, zone.y + zone.h * 0.04, kw, kh);
    const a = fit(KRUL_START);
    c1 = { x: p0.x + 80, y: p0.y + 40 };
    c2 = { x: a.x - 60, y: a.y - 12 };
  } else {
    const m = Math.min(zone.w, zone.h) * 0.08;
    fit = krulFit(zone.x + m, zone.y + m, zone.w - m * 2, zone.h - m * 2);
    const a = fit(KRUL_START);
    // aanloop: eerst weg van de kop, dan met een boog van linksonder de krul in
    c1 = { x: p0.x + (a.x - p0.x) * 0.15, y: p0.y + (a.y - p0.y) * 0.55 };
    c2 = { x: a.x - Math.max(40, (a.x - p0.x) * 0.3), y: a.y + 24 };
  }
  const a = fit(KRUL_START);
  const d = `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${a.x.toFixed(1)} ${a.y.toFixed(1)} ${krulPath(fit).replace(/^M[^C]*/, "")}`;
  return <path d={d} pathLength={1} className="punt__ghost" />;
}
