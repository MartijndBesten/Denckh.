"use client";

// Het einde is een nieuw begin: de punt komt terug. Als je bovenaan iets tekende, staat het hier klaar om mee te nemen.
import { useMemo, useState } from "react";
import { linePath, resample } from "@/lib/ink/geometry";
import { place, useSketch } from "@/lib/ink/store";

const MAIL = "info@denckh.nl";

export function ContactReturn() {
  const sketch = useSketch();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const idea = text || sketch.idea || "";
  const pts = useMemo(() => resample(place(sketch.points, 12, 12, 136, 96), 80), [sketch]);

  const plan = sketch.plan;
  const href = useMemo(() => {
    // met een plan uit de hero: concreet opschrijven wat het zou kunnen worden, zodat het gesprek daar begint
    const planText = plan ? [
      `Op denckh.nl maakte Denckh er dit van: ${plan.form}.`,
      `De drie delen:\n${plan.parts.map(([t, n], i) => `${i + 1}. ${t}: ${n}`).join("\n")}`,
      `Wat het zou kunnen worden:\n- ${plan.could.join("\n- ")}`,
      `Denckh vroeg: ${plan.question}\nMijn antwoord: `,
    ] : [sketch.own ? `(Op de site tekende ik iets wat Denckh las als ${sketch.name}.)` : ""];
    const body = [
      idea ? `Mijn idee: ${idea}` : "",
      ...planText,
      name ? `Groet, ${name}` : "",
      plan ? "(Deze opzet kwam uit vaste regels op denckh.nl. Een begin, geen offerte.)" : "",
    ].filter(Boolean).join("\n\n");
    const subject = plan ? `Een idee: ${plan.title}` : "Een idee";
    return `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [idea, name, sketch, plan]);

  return (
    <div className="contact-return">
      <div className="contact-return__start" aria-hidden="true">
        <span className="contact-return__dot" />
      </div>
      <form className="contact-return__form" data-mailto={href} onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
        {sketch.own && (
          <div className="contact-return__sketch">
            <svg viewBox="0 0 160 120" aria-hidden="true"><path d={linePath(pts)} /></svg>
            <p>Je schets van bovenaan reist mee. Denckh las er {sketch.name} in.</p>
          </div>
        )}
        {plan && (
          <div className="contact-return__plan">
            <p className="contact-return__plan-head">Dit gaat mee in je mail</p>
            <p><strong>{plan.title}:</strong> {plan.form}.</p>
            <p><strong>Zou kunnen worden:</strong> {plan.could[0]}.</p>
            <p className="contact-return__plan-q">Denckh vraagt: {plan.question}</p>
          </div>
        )}
        <label htmlFor="contact-idee">Wat zit er in je hoofd?</label>
        <textarea id="contact-idee" rows={4} value={text} placeholder={sketch.idea || "Het hoeft nog niet af te zijn."} onChange={(e) => setText(e.target.value)} />
        <label htmlFor="contact-naam">Je naam <span>(mag ook later)</span></label>
        <input id="contact-naam" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <div className="contact-return__send">
          <button type="submit" className="ink-button">Vertel het me</button>
          <p>Opent je eigen mailprogramma met je tekst erin. Of mail direct naar <a className="link-draw" href={`mailto:${MAIL}`}>{MAIL}</a>.</p>
        </div>
      </form>
    </div>
  );
}
