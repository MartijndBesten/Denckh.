"use client";

import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

const initialPoint: Point = { x: 50, y: 51 };

function toPath(points: Point[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
}

export function IdeaCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Point[]>([initialPoint]);
  const [dragging, setDragging] = useState(false);
  const [formed, setFormed] = useState(false);

  const path = useMemo(() => toPath(points), [points]);

  function pointFromEvent(event: PointerEvent<HTMLButtonElement>): Point {
    const box = canvasRef.current?.getBoundingClientRect();
    if (!box) return initialPoint;
    return {
      x: Math.max(6, Math.min(94, ((event.clientX - box.left) / box.width) * 100)),
      y: Math.max(10, Math.min(90, ((event.clientY - box.top) / box.height) * 100)),
    };
  }

  function begin(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setFormed(false);
    setPoints([initialPoint, pointFromEvent(event)]);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const next = pointFromEvent(event);
    setPoints((current) => (current.length > 26 ? current : [...current, next]));
  }

  function finish() {
    if (!dragging) return;
    setDragging(false);
    setFormed(true);
  }

  function playWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setPoints([
      initialPoint,
      { x: 60, y: 33 },
      { x: 72, y: 63 },
      { x: 42, y: 74 },
      { x: 31, y: 42 },
      initialPoint,
    ]);
    setFormed(true);
  }

  return (
    <div
      ref={canvasRef}
      className={`idea-canvas${dragging ? " is-dragging" : ""}${formed ? " is-formed" : ""}`}
      aria-label="Een klein experiment: sleep de punt om een vorm te maken"
    >
      <svg className="idea-canvas__line" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        <path d={path} pathLength="1" />
        <path className="idea-canvas__shape" d="M36 28 L69 35 L65 68 L31 63 Z" />
      </svg>
      <button
        className="idea-orb"
        type="button"
        aria-label="Sleep de punt of druk Enter om een vorm te laten ontstaan"
        aria-pressed={formed}
        onKeyDown={playWithKeyboard}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        <span aria-hidden="true" />
      </button>
      <p className="idea-canvas__hint" aria-live="polite">
        {formed ? "vorm." : "begin met een punt"}
      </p>
    </div>
  );
}
