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

  const href = useMemo(() => {
    const body = [idea, sketch.own ? `(Op de site tekende ik iets wat Denckh las als ${sketch.name}.)` : "", name ? `Groet, ${name}` : ""]
      .filter(Boolean)
      .join("\n\n");
    return `mailto:${MAIL}?subject=${encodeURIComponent("Een idee")}&body=${encodeURIComponent(body)}`;
  }, [idea, name, sketch]);

  return (
    <div className="contact-return">
      <div className="contact-return__start" aria-hidden="true">
        <span className="contact-return__dot" />
      </div>
      <form className="contact-return__form" onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
        {sketch.own && (
          <div className="contact-return__sketch">
            <svg viewBox="0 0 160 120" aria-hidden="true"><path d={linePath(pts)} /></svg>
            <p>Je schets van bovenaan reist mee. Denckh las er {sketch.name} in.</p>
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
