"use client";

import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number; t: number };
type Phase = "idle" | "drawing" | "thinking" | "reading" | "formed";

const prompts = [
  { name: "een bediening", text: "Ik zie hier misschien een bediening in.", shape: "interface" },
  { name: "een route", text: "Dit zou een route met een paar duidelijke keuzes kunnen zijn.", shape: "flow" },
  { name: "een object", text: "Hier zit mogelijk een product met twee functies in.", shape: "object" },
];

function classify(points: Point[]) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  if (width > height * 1.7) return prompts[1];
  if (height > width * 1.25) return prompts[0];
  return prompts[2];
}

export function IdeaCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [interpretation, setInterpretation] = useState(prompts[0]);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const box = element.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    element.width = box.width * ratio;
    element.height = box.height * ratio;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, box.width, box.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    points.slice(1).forEach((current, index) => {
      const previous = points[index];
      const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
      const speed = distance / Math.max(10, current.t - previous.t);
      context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(current.x, current.y);
      context.lineWidth = Math.min(11, Math.max(2.5, 2.5 + speed * 13));
      context.strokeStyle = "#C8A477"; context.globalAlpha = 0.88; context.stroke();
    });
  }, [points]);

  function point(event: PointerEvent<HTMLButtonElement>): Point {
    const box = canvas.current?.getBoundingClientRect();
    return { x: event.clientX - (box?.left ?? 0), y: event.clientY - (box?.top ?? 0), t: performance.now() };
  }
  function begin(event: PointerEvent<HTMLButtonElement>) { event.currentTarget.setPointerCapture(event.pointerId); setPhase("drawing"); setPoints([point(event)]); }
  function draw(event: PointerEvent<HTMLButtonElement>) { if (phase === "drawing") setPoints((current) => current.length > 100 ? current : [...current, point(event)]); }
  function finish() {
    if (phase !== "drawing" || points.length < 4) return;
    const result = classify(points); setInterpretation(result); setPhase("thinking");
    window.setTimeout(() => setPhase("reading"), 760);
    sessionStorage.setItem("denckh-sketch", result.shape);
    window.dispatchEvent(new CustomEvent("denckh-sketch", { detail: result.shape }));
  }
  function restart() { setPoints([]); setPhase("idle"); }
  function keyboardStart(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault(); const t = performance.now();
    setPoints([{ x: 88, y: 174, t }, { x: 164, y: 98, t: t + 120 }, { x: 258, y: 132, t: t + 240 }, { x: 231, y: 249, t: t + 360 }, { x: 118, y: 245, t: t + 480 }, { x: 88, y: 174, t: t + 590 }]);
    setInterpretation(prompts[0]); setPhase("reading");
  }

  return <div className={`idea-canvas idea-canvas--${phase}`}>
    <canvas ref={canvas} aria-hidden="true" /><div className="idea-canvas__grid" aria-hidden="true" />
    <button className="idea-orb" type="button" aria-label="Begin met een punt. Teken met muis of vinger, of druk Enter voor een voorbeeld." aria-pressed={phase === "formed"} onPointerDown={begin} onPointerMove={draw} onPointerUp={finish} onPointerCancel={finish} onKeyDown={keyboardStart}><span /></button>
    <div className="idea-canvas__copy" aria-live="polite">
      {phase === "idle" && <><strong>begin met een punt</strong><span>sleep · teken · laat los</span></>}
      {phase === "drawing" && <><strong>laat maar lopen</strong><span>er hoeft nog niets te kloppen</span></>}
      {phase === "thinking" && <><strong>Denckh denkt even</strong><span>de lijn zoekt een eerste richting</span></>}
      {phase === "reading" && <><strong>{interpretation.text}</strong><span>Dat hoeft het niet te zijn. Het is een begin.</span><button type="button" onClick={() => setPhase("formed")}>Geef er vorm aan</button><button className="quiet-button" type="button" onClick={restart}>Teken opnieuw</button></>}
      {phase === "formed" && <><strong>eerste vorm: {interpretation.name}</strong><span>Een richting om samen verder te onderzoeken.</span><div className={`first-form first-form--${interpretation.shape}`} aria-hidden="true"><i /><i /><i /></div><button className="quiet-button" type="button" onClick={restart}>Nog een idee</button></>}
    </div>
  </div>;
}
