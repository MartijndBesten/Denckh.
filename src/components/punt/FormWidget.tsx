"use client";

// De eerste vorm is geen plaatje: hij doet iets. Elke vorm krijgt één kleine, echte interactie.
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Form } from "@/lib/ink/forms";
import { clamp, dist, type Pt } from "@/lib/ink/geometry";

const f1 = (n: number) => n.toFixed(1);

function Knob({ form }: { form: Extract<Form, { kind: "knop" }> }) {
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
    <g className="fw fw--knob" role="slider" tabIndex={0} aria-label="Draaiknop" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag(e); }} onPointerMove={drag} onKeyDown={key}>
      <circle cx={c.x} cy={c.y} r={r + 24} className="fw-hit" />
      {ticks.map((t, i) => <line key={i} {...t} className="fw-draw" style={{ animationDelay: `${i * 30}ms` }} />)}
      <circle cx={c.x} cy={c.y} r={r - 26} className="fw-draw fw-soft" />
      <line x1={c.x} y1={c.y} x2={ind.x} y2={ind.y} className="fw-indicator" />
      <circle cx={ind.x} cy={ind.y} r={6} className="fw-dot" />
      <text x={c.x} y={c.y + r * 0.5} className="fw-value">{value}</text>
    </g>
  );
}

function Slider({ form }: { form: Extract<Form, { kind: "schuif" }> }) {
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
    <g className="fw fw--slider" role="slider" tabIndex={0} aria-label="Regelaar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(t * 100)}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag(e); }} onPointerMove={drag} onKeyDown={key}>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="fw-hit fw-hit--line" />
      {ticks.map((tk, i) => <line key={i} {...tk} className="fw-draw" style={{ animationDelay: `${i * 30}ms` }} />)}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} className="fw-fill" />
      <circle cx={p.x} cy={p.y} r={13} className="fw-handle" />
      <text x={p.x - nx * 34} y={p.y - ny * 34 + 5} className="fw-value fw-value--small">{Math.round(t * 100)}</text>
    </g>
  );
}

function Screen({ form }: { form: Extract<Form, { kind: "scherm" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { x, y, w, h } = form;
  const pad = Math.max(14, w * 0.07);
  const bar = { x: x + pad, y: y + pad, w: w * 0.38, h: 8 };
  const tileY = y + pad + 26;
  const tileH = Math.max(34, h - pad * 2 - 26 - 40);
  const tileW = (w - pad * 2 - 16) / 3;
  const labels = ["idee", "schets", "vorm"];
  return (
    <g className="fw fw--screen">
      <rect {...bar} rx={4} className="fw-draw fw-block" />
      <line x1={x + w - pad - 44} y1={y + pad + 4} x2={x + w - pad} y2={y + pad + 4} className="fw-draw" />
      {labels.map((label, i) => {
        const tx = x + pad + i * (tileW + 8);
        return (
          <g key={label} role="button" tabIndex={0} aria-pressed={picked === i} aria-label={`Kies ${label}`} className={`fw-tile${picked === i ? " is-picked" : ""}`}
            onClick={() => setPicked(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(i); } }}>
            <rect x={tx} y={tileY} width={tileW} height={tileH} rx={6} className="fw-draw" style={{ animationDelay: `${120 + i * 90}ms` }} />
            <text x={tx + 8} y={tileY + 18} className="fw-label" style={{ fontSize: Math.min(11, tileW / 5.5) }}>{label}</text>
            <line x1={tx + 10} y1={tileY + tileH - 22} x2={tx + tileW * 0.75} y2={tileY + tileH - 22} className="fw-draw fw-soft" />
            <line x1={tx + 10} y1={tileY + tileH - 12} x2={tx + tileW * 0.5} y2={tileY + tileH - 12} className="fw-draw fw-soft" />
          </g>
        );
      })}
      <rect x={x + w - pad - 92} y={y + h - pad - 26} width={92} height={26} rx={13} className={`fw-draw fw-button${picked !== null ? " is-ready" : ""}`} />
      <text x={x + w - pad - 46} y={y + h - pad - 9} className="fw-label fw-label--center">{picked !== null ? "gekozen" : "kies"}</text>
    </g>
  );
}

function Chart({ form }: { form: Extract<Form, { kind: "grafiek" }> }) {
  const [active, setActive] = useState<number | null>(null);
  const { x0, x1, base, top, marks } = form;
  const value = (p: Pt) => Math.round(((base - p.y) / Math.max(1, base - top + 20)) * 100);
  return (
    <g className="fw fw--chart">
      <line x1={x0 - 14} y1={base} x2={x1 + 14} y2={base} className="fw-draw" />
      <line x1={x0 - 14} y1={base} x2={x0 - 14} y2={top - 24} className="fw-draw" />
      {marks.map((m, i) => (
        <g key={i} role="button" tabIndex={0} aria-label={`Meetpunt ${i + 1}: ${value(m)}`} className={`fw-mark${active === i ? " is-active" : ""}`}
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

function Route({ form }: { form: Extract<Form, { kind: "route" }> }) {
  const [step, setStep] = useState(0);
  return (
    <g className="fw fw--route">
      {form.nodes.map((n, i) => (
        <g key={i} role="button" tabIndex={0} aria-label={`Stap ${i + 1} van ${form.nodes.length}`} aria-current={step === i ? "step" : undefined}
          className={`fw-node${i <= step ? " is-done" : ""}`} onClick={() => setStep(i)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStep(i); } }}>
          <circle cx={n.x} cy={n.y} r={22} className="fw-hit" />
          <circle cx={n.x} cy={n.y} r={13} className="fw-node-circle" />
          <text x={n.x} y={n.y + 4.5} className="fw-label fw-label--center">{i + 1}</text>
        </g>
      ))}
    </g>
  );
}

function ConceptMap({ form }: { form: Extract<Form, { kind: "kaart" }> }) {
  const [active, setActive] = useState<number | null>(null);
  const labels = form.nodes.length === 2 ? ["functie a", "functie b"] : ["wat", "voor wie", "hoe", "waarom", "wanneer"];
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
          <text x={n.x} y={n.y + 34} className="fw-label fw-label--center">{labels[i]}</text>
        </g>
      ))}
    </g>
  );
}

export function FormWidget({ form }: { form: Form }) {
  switch (form.kind) {
    case "knop": return <Knob form={form} />;
    case "schuif": return <Slider form={form} />;
    case "scherm": return <Screen form={form} />;
    case "grafiek": return <Chart form={form} />;
    case "route": return <Route form={form} />;
    case "kaart": return <ConceptMap form={form} />;
    default: return null;
  }
}

export { f1 };
