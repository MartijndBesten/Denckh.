"use client";

// Letters die nog los liggen en tijdens het scrollen hun plek vinden: van losse tekens naar een woord.
import { Fragment, useRef, type CSSProperties } from "react";
import { seeded } from "@/lib/ink/geometry";
import { useScrollProgress } from "@/lib/ink/hooks";
import { useReducedMotion } from "@/lib/ink/useReducedMotion";

export function SettleTitle({ text, as = "h2", id, className = "" }: { text: string; as?: "h1" | "h2" | "h3"; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const p = useScrollProgress(ref, !reduced);
  const loose = Math.max(0, 1 - p / 0.7); // bij 70% scrollvoortgang staat alles recht
  const rand = seeded(text.length * 97);
  const words = text.split(" ");
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={`settle ${className}`} aria-label={text}>
    {words.map((word, wi) => (
      <Fragment key={wi}>
      <span className="settle__word" aria-hidden="true">
        {[...word].map((ch, ci) => {
          const r = rand(), s = rand(), t = rand();
          const style = {
            "--dx": `${(r - 0.5) * 0.5 * loose}em`,
            "--dy": `${(s - 0.5) * 0.7 * loose}em`,
            "--rot": `${(t - 0.5) * 22 * loose}deg`,
          } as CSSProperties;
          return <span key={ci} className="settle__ch" style={style}>{ch}</span>;
        })}
      </span>
      {wi < words.length - 1 ? " " : null}
      </Fragment>
    ))}
    </Tag>
  );
}
