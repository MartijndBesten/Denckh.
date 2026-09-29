"use client";

// De eerste vorm is geen plaatje: hij doet iets. Elke vorm krijgt één kleine, echte interactie.
// Vertel je wat je in je hoofd had, dan krijgt de vorm de onderdelen van dat idee (zie concept.ts).
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { knobText, type Concept, type Look } from "@/lib/ink/concept";
import type { Form } from "@/lib/ink/forms";
import { clamp, dist, type Pt } from "@/lib/ink/geometry";

const f1 = (n: number) => n.toFixed(1);

/** Label dat opnieuw verschijnt als het idee verandert. */
function Say({ c, children, ...rest }: { c?: Concept } & React.SVGProps<SVGTextElement>) {
  return <text key={c?.idea} {...rest} className={`${rest.className ?? "fw-label"}${c ? " fw-say" : ""}`}>{children}</text>;
}

/** Breek een label op één spatie als het niet past. */
function lines(label: string, max: number) {
  if (label.length <= max || !label.includes(" ")) return [label];
  const mid = label.lastIndexOf(" ", Math.max(max, Math.ceil(label.length / 2)));
  const at = mid > 0 ? mid : label.indexOf(" ");
  return [label.slice(0, at), label.slice(at + 1)];
}

function Knob({ form, concept }: { form: Extract<Form, { kind: "knop" }>; concept?: Concept }) {
  const [value, setValue] = useState(40);
  const angle = (-135 + (value / 100) * 270) * (Math.PI / 180);
  const { center: c, r } = form;
  const set = (v: number) => setValue(clamp(Math.round(v), 0, 100));
  function drag(e: PointerEvent<SVGGElement>) {
    if (e.buttons !== 1) return;
    const svg = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const a = Math.atan2(e.clientY - svg.top - c.y, e.clientX - svg.left - c.x) * (180 / Math.PI) + 90;
    const norm = ((a + 360 + 135) % 360);
    if (norm <= 270) set((norm / 270) * 100);
  }
  function key(e: KeyboardEvent<SVGGElement>) {
    const step = e.shiftKey ? 10 : 2;
    if (["ArrowUp", "ArrowRight"].includes(e.key)) { e.preventDefault(); set(value + step); }
    if (["ArrowDown", "ArrowLeft"].includes(e.key)) { e.preventDefault(); set(value - step); }
  }
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const a = (-135 + i * 22.5 - 90) * (Math.PI / 180);
    return { x1: c.x + Math.cos(a) * (r + 8), y1: c.y + Math.sin(a) * (r + 8), x2: c.x + Math.cos(a) * (r + (i % 3 === 0 ? 20 : 14)), y2: c.y + Math.sin(a) * (r + (i % 3 === 0 ? 20 : 14)) };
  });
  const ind = { x: c.x + Math.sin(angle) * (r - 16), y: c.y - Math.cos(angle) * (r - 16) };
  return (
    <g className="fw fw--knob" role="slider" tabIndex={0} aria-label={concept ? `Draaiknop: ${concept.knob.label}` : "Draaiknop"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}
      aria-valuetext={concept ? `${concept.knob.label} ${knobText(concept, value)}` : undefined}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag(e); }} onPointerMove={drag} onKeyDown={key}>
      <circle cx={c.x} cy={c.y} r={r + 24} className="fw-hit" />
      {ticks.map((t, i) => <line key={i} {...t} className="fw-draw" style={{ animationDelay: `${i * 30}ms` }} />)}
      <circle cx={c.x} cy={c.y} r={r - 26} className="fw-draw fw-soft" />
      <line x1={c.x} y1={c.y} x2={ind.x} y2={ind.y} className="fw-indicator" />
      <circle cx={ind.x} cy={ind.y} r={6} className="fw-dot" />
      <text x={c.x} y={c.y + r * 0.5} className="fw-value">{concept ? knobText(concept, value) : value}</text>
      {concept && <Say c={concept} x={c.x} y={c.y + r * 0.5 + 18} className="fw-label fw-label--center">{concept.knob.label}</Say>}
      {concept && [0, 100].map((v) => {
        const a = ((v ? 135 : -135) - 90) * (Math.PI / 180);
        return <Say key={v} c={concept} x={c.x + Math.cos(a) * (r + 30)} y={c.y + Math.sin(a) * (r + 30) + 14} className="fw-label fw-label--center">{knobText(concept, v)}</Say>;
      })}
    </g>
  );
}

function Slider({ form, concept }: { form: Extract<Form, { kind: "schuif" }>; concept?: Concept }) {
  const [t, setT] = useState(0.5);
  const { a, b } = form;
  const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  function drag(e: PointerEvent<SVGGElement>) {
    if (e.buttons !== 1) return;
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const q = { x: e.clientX - box.left, y: e.clientY - box.top };
    const ab = { x: b.x - a.x, y: b.y - a.y };
    setT(clamp(((q.x - a.x) * ab.x + (q.y - a.y) * ab.y) / (ab.x ** 2 + ab.y ** 2), 0, 1));
  }
  function key(e: KeyboardEvent<SVGGElement>) {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (["ArrowUp", "ArrowRight"].includes(e.key)) { e.preventDefault(); setT((v) => clamp(v + step, 0, 1)); }
    if (["ArrowDown", "ArrowLeft"].includes(e.key)) { e.preventDefault(); setT((v) => clamp(v - step, 0, 1)); }
  }
  const nx = -(b.y - a.y) / dist(a, b), ny = (b.x - a.x) / dist(a, b);
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const q = { x: a.x + (b.x - a.x) * (i / 10), y: a.y + (b.y - a.y) * (i / 10) };
    const l = i % 5 === 0 ? 14 : 8;
    return { x1: q.x + nx * 10, y1: q.y + ny * 10, x2: q.x + nx * (10 + l), y2: q.y + ny * (10 + l) };
  });
  return (
    <g className="fw fw--slider" role="slider" tabIndex={0} aria-label={concept ? `Regelaar van ${concept.ends[0]} naar ${concept.ends[1]}` : "Regelaar"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(t * 100)}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag(e); }} onPointerMove={drag} onKeyDown={key}>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="fw-hit fw-hit--line" />
      {ticks.map((tk, i) => <line key={i} {...tk} className="fw-draw" style={{ animationDelay: `${i * 30}ms` }} />)}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} className="fw-fill" />
      <circle cx={p.x} cy={p.y} r={13} className="fw-handle" />
      <text x={p.x - nx * 34} y={p.y - ny * 34 + 5} className="fw-value fw-value--small">{Math.round(t * 100)}</text>
      {concept && [a, b].map((q, i) => (
        <Say key={i} c={concept} x={q.x + nx * 44} y={q.y + ny * 44 + 4} className="fw-label fw-label--center">{concept.ends[i]}</Say>
      ))}
    </g>
  );
}

/** Een mini-schets in een tegel: net genoeg lijnen om te zien wat daar zou komen. */
function Mini({ look, x, y, w, h, delay }: { look: Look; x: number; y: number; w: number; h: number; delay: number }) {
  const s = Math.min(w, h), cx = x + w / 2, cy = y + h / 2;
  const P = (d: string, i: number, cls = "fw-draw") => <path key={i} d={d} className={cls} style={{ animationDelay: `${delay + i * 60}ms` }} />;
  const circ = (px: number, py: number, r: number) => `M${px - r} ${py} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
  const row = (i: number, n: number) => y + (h * (i + 0.5)) / n;
  const line = (x0: number, yy: number, len: number) => `M${x0} ${yy} H${x0 + len}`;
  const box = (bx: number, by: number, bw: number, bh: number, r = 3) =>
    `M${bx + r} ${by} H${bx + bw - r} Q${bx + bw} ${by} ${bx + bw} ${by + r} V${by + bh - r} Q${bx + bw} ${by + bh} ${bx + bw - r} ${by + bh} H${bx + r} Q${bx} ${by + bh} ${bx} ${by + bh - r} V${by + r} Q${bx} ${by} ${bx + r} ${by} Z`;
  switch (look) {
    case "items": { const r = s * 0.16; return <g>{[0, 1, 2, 3].map((i) => P(circ(x + w * (i % 2 ? 0.72 : 0.28), y + h * (i < 2 ? 0.3 : 0.72), r), i))}</g>; }
    case "steps": return <g>{[0, 1, 2].map((i) => P(`${circ(x + 5, row(i, 3), 4)} ${line(x + 14, row(i, 3), w * (0.75 - i * 0.12))}`, i))}</g>;
    case "check": return <g>{[0, 1, 2].map((i) => P(`M${x + 1} ${row(i, 3)} l3 3 l6 -7 ${line(x + 14, row(i, 3), w * (0.7 - i * 0.1))}`, i))}</g>;
    case "text": return <g>{[0.9, 0.75, 0.85, 0.5].map((l, i) => P(line(x, row(i, 4), w * l), i, "fw-draw fw-soft"))}</g>;
    case "button": return <g>{P(line(x, y + h * 0.25, w * 0.8), 0, "fw-draw fw-soft")}{P(line(x, y + h * 0.42, w * 0.6), 1, "fw-draw fw-soft")}{P(box(x + w * 0.1, y + h * 0.62, w * 0.8, Math.min(18, h * 0.3), 9), 2, "fw-draw fw-accent")}</g>;
    case "chart": return <g>{P(`M${x} ${y + h} H${x + w}`, 0)}{P(`M${x + 2} ${y + h * 0.85} L${x + w * 0.3} ${y + h * 0.6} L${x + w * 0.55} ${y + h * 0.68} L${x + w * 0.95} ${y + h * 0.15}`, 1, "fw-draw fw-accent-line")}</g>;
    case "calendar": { const c = 4, r = 3, cw = w / c, ch = h / r; return <g>{Array.from({ length: c * r }, (_, i) => P(box(x + (i % c) * cw + 1.5, y + Math.floor(i / c) * ch + 1.5, cw - 3, ch - 3, 2), i, i === 6 ? "fw-draw fw-accent" : "fw-draw"))}</g>; }
    case "slots": return <g>{[0, 1, 2].map((i) => P(box(x, y + (h * i) / 3 + 2, w, h / 3 - 4, 6), i, i === 1 ? "fw-draw fw-accent" : "fw-draw"))}</g>;
    case "image": return <g>{P(box(x, y, w, h, 4), 0)}{P(`M${x + 3} ${y + h - 3} L${x + w * 0.38} ${y + h * 0.45} L${x + w * 0.6} ${y + h * 0.7} L${x + w * 0.75} ${y + h * 0.55} L${x + w - 3} ${y + h - 3}`, 1)}{P(circ(x + w * 0.75, y + h * 0.28, s * 0.08), 2)}</g>;
    case "gauge": { const r = s * 0.42; return <g>{P(`M${cx - r} ${cy + r * 0.35} A${r} ${r} 0 1 1 ${cx + r} ${cy + r * 0.35}`, 0, "fw-draw fw-soft")}{P(`M${cx - r} ${cy + r * 0.35} A${r} ${r} 0 0 1 ${cx + r * 0.55} ${cy - r * 0.62}`, 1, "fw-draw fw-accent-line")}</g>; }
    case "people": { const r = s * 0.12; return <g>{[0.2, 0.5, 0.8].map((t, i) => P(`${circ(x + w * t, y + h * 0.38, r)} M${x + w * t - r * 1.6} ${y + h * 0.85} Q${x + w * t} ${y + h * 0.45} ${x + w * t + r * 1.6} ${y + h * 0.85}`, i))}</g>; }
    case "cards": { const cw = w * 0.34, ch = h * 0.8; return <g>{[-1, 0, 1].map((k, i) => P(box(cx - cw / 2 + k * cw * 0.45, y + h * 0.1 + Math.abs(k) * 4, cw, ch, 3), i, k === 0 ? "fw-draw fw-accent" : "fw-draw"))}</g>; }
  }
}

function Screen({ form, concept }: { form: Extract<Form, { kind: "scherm" }>; concept?: Concept }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { x, y, w, h } = form;
  const pad = Math.max(14, w * 0.07);
  const bar = { x: x + pad, y: y + pad, w: w * 0.38, h: 8 };
  const tileY = y + pad + 26;
  const tileH = Math.max(34, h - pad * 2 - 26 - 40);
  const tileW = (w - pad * 2 - 16) / 3;
  const labels = concept ? concept.tiles : ["idee", "schets", "vorm"];
  const fs = Math.min(11, tileW / 5.5);
  const cta = concept ? concept.cta : "kies";
  const maxChars = Math.floor((tileW - 14) / (fs * 0.58));
  return (
    <g className="fw fw--screen">
      {concept
        ? <Say c={concept} x={bar.x} y={bar.y + 9} className="fw-title">{concept.title}</Say>
        : <rect {...bar} rx={4} className="fw-draw fw-block" />}
      <line x1={x + w - pad - 44} y1={y + pad + 4} x2={x + w - pad} y2={y + pad + 4} className="fw-draw" />
      {labels.map((label, i) => {
        const tx = x + pad + i * (tileW + 8);
        return (
          <g key={i} role="button" tabIndex={0} aria-pressed={picked === i} aria-label={`Kies ${label}`} className={`fw-tile${picked === i ? " is-picked" : ""}`}
            onClick={() => setPicked(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(i); } }}>
            <rect x={tx} y={tileY} width={tileW} height={tileH} rx={6} className="fw-draw" style={{ animationDelay: `${120 + i * 90}ms` }} />
            <Say c={concept} x={tx + 8} y={tileY + 18} className="fw-label" style={{ fontSize: fs }}>
              {lines(label, maxChars).map((l, li) => <tspan key={li} x={tx + 8} dy={li ? fs * 1.25 : 0}>{l}</tspan>)}
            </Say>
            {concept ? (
              <Mini key={concept.idea} look={concept.looks[i]} x={tx + 10} y={tileY + (lines(label, maxChars).length > 1 ? 40 : 28)} w={tileW - 20} h={Math.max(12, tileH - (lines(label, maxChars).length > 1 ? 50 : 38))} delay={150 + i * 120} />
            ) : (
              <>
                <line x1={tx + 10} y1={tileY + tileH - 22} x2={tx + tileW * 0.75} y2={tileY + tileH - 22} className="fw-draw fw-soft" />
                <line x1={tx + 10} y1={tileY + tileH - 12} x2={tx + tileW * 0.5} y2={tileY + tileH - 12} className="fw-draw fw-soft" />
              </>
            )}
          </g>
        );
      })}
      <rect x={x + w - pad - 92} y={y + h - pad - 26} width={92} height={26} rx={13} className={`fw-draw fw-button${picked !== null ? " is-ready" : ""}`} />
      <Say c={concept} x={x + w - pad - 46} y={y + h - pad - 9} className="fw-label fw-label--center">{picked !== null ? (concept ? `${cta} ✓` : "gekozen") : cta}</Say>
    </g>
  );
}

function Chart({ form, concept }: { form: Extract<Form, { kind: "grafiek" }>; concept?: Concept }) {
  const [active, setActive] = useState<number | null>(null);
  const { x0, x1, base, top, marks } = form;
  const value = (p: Pt) => Math.round(((base - p.y) / Math.max(1, base - top + 20)) * 100);
  return (
    <g className="fw fw--chart">
      <line x1={x0 - 14} y1={base} x2={x1 + 14} y2={base} className="fw-draw" />
      <line x1={x0 - 14} y1={base} x2={x0 - 14} y2={top - 24} className="fw-draw" />
      {concept && (
        <>
          <Say c={concept} x={x1 + 14} y={base + 18} className="fw-label fw-label--end">{concept.axis.x} →</Say>
          <Say c={concept} x={x0 - 8} y={top - 28} className="fw-label">↑ {concept.axis.y}</Say>
        </>
      )}
      {marks.map((m, i) => (
        <g key={i} role="button" tabIndex={0} aria-label={`Meetpunt ${i + 1}${concept ? ` (${concept.axis.y})` : ""}: ${value(m)}`} className={`fw-mark${active === i ? " is-active" : ""}`}
          onClick={() => setActive(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}>
          <line x1={m.x} y1={m.y} x2={m.x} y2={base} className="fw-draw fw-soft" style={{ animationDelay: `${i * 70}ms` }} />
          <circle cx={m.x} cy={m.y} r={active === i ? 8 : 5} className="fw-dot" />
          <circle cx={m.x} cy={m.y} r={20} className="fw-hit" />
          {active === i && <text x={m.x} y={m.y - 16} className="fw-value fw-value--small">{value(m)}</text>}
        </g>
      ))}
    </g>
  );
}

/** Label aan de kant waar de lijn niet loopt: onder een dal, boven een top. */
function labelBelow(nodes: Pt[], i: number) {
  const nb = [nodes[i - 1], nodes[i + 1]].filter(Boolean);
  const avg = nb.reduce((sum, q) => sum + q.y, 0) / Math.max(1, nb.length);
  return avg <= nodes[i].y;
}

function Route({ form, concept }: { form: Extract<Form, { kind: "route" }>; concept?: Concept }) {
  const [step, setStep] = useState(0);
  return (
    <g className="fw fw--route">
      {form.nodes.map((n, i) => (
        <g key={i} role="button" tabIndex={0} aria-label={`Stap ${i + 1} van ${form.nodes.length}${concept ? `: ${concept.steps[i] ?? ""}` : ""}`} aria-current={step === i ? "step" : undefined}
          className={`fw-node${i <= step ? " is-done" : ""}`} onClick={() => setStep(i)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStep(i); } }}>
          <circle cx={n.x} cy={n.y} r={22} className="fw-hit" />
          <circle cx={n.x} cy={n.y} r={13} className="fw-node-circle" />
          <text x={n.x} y={n.y + 4.5} className="fw-label fw-label--center">{i + 1}</text>
          {concept && concept.steps[i] && <Say c={concept} x={n.x} y={labelBelow(form.nodes, i) ? n.y + 34 : n.y - 22} className="fw-label fw-label--center">{concept.steps[i]}</Say>}
        </g>
      ))}
    </g>
  );
}

function ConceptMap({ form, concept }: { form: Extract<Form, { kind: "kaart" }>; concept?: Concept }) {
  const [active, setActive] = useState<number | null>(null);
  const labels = concept ? [concept.subject ?? "idee", ...concept.map]
    : form.names;
  return (
    <g className="fw fw--map">
      {form.edges.map(([a, b], i) => (
        <line key={i} x1={form.nodes[a].x} y1={form.nodes[a].y} x2={form.nodes[b].x} y2={form.nodes[b].y}
          className={`fw-edge${active !== null && (a === active || b === active) ? " is-active" : ""}`} />
      ))}
      {form.nodes.map((n, i) => (
        <g key={i} role="button" tabIndex={0} aria-pressed={active === i} aria-label={labels[i]} className={`fw-node${active === i ? " is-done" : ""}`}
          onClick={() => setActive(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}>
          <circle cx={n.x} cy={n.y} r={30} className="fw-hit" />
          <circle cx={n.x} cy={n.y} r={16} className="fw-node-circle" />
          <Say c={concept} x={n.x} y={n.y + 34} className={`fw-label fw-label--center${concept && i === 0 ? " fw-label--idea" : ""}`}>{labels[i]}</Say>
        </g>
      ))}
    </g>
  );
}

export function FormWidget({ form, concept }: { form: Form; concept?: Concept }) {
  switch (form.kind) {
    case "knop": return <Knob form={form} concept={concept} />;
    case "schuif": return <Slider form={form} concept={concept} />;
    case "scherm": return <Screen form={form} concept={concept} />;
    case "grafiek": return <Chart form={form} concept={concept} />;
    case "route": return <Route form={form} concept={concept} />;
    case "kaart": return <ConceptMap form={form} concept={concept} />;
    default: return null;
  }
}

export { f1 };
