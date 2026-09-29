// Interne proef: het huidige woordmerk naast zeven subtiele varianten, elk met één ingreep aan de onderkant.
// Niet gelinkt, niet in de sitemap, noindex. Geen besluit: zie HANDOFF.md (open punt logo-lab).
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DOT, LETTERS, LIGATURE, VIEWBOX } from "@/components/wordmarkPaths";

export const metadata: Metadata = {
  title: "Logo-lab (intern)",
  robots: { index: false, follow: false },
};

type Variant = { key: string; name: string; cut?: ReactNode; extra?: ReactNode };

/** Een band dwars op een schuine streek: middelpunt c, richting van de streek (dx, dy), halve lengte l, halve breedte b. */
function band(cx: number, cy: number, dx: number, dy: number, l: number, b: number) {
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, px = uy, py = -ux;
  const pt = (s: number, t: number) => `${cx + px * s + ux * t},${cy + py * s + uy * t}`;
  return `${pt(l, b)} ${pt(l, -b)} ${pt(-l, -b)} ${pt(-l, b)}`;
}

const VARIANTS: Variant[] = [
  { key: "huidig", name: "huidig" },
  // d: de buik raakt de stok onderaan net niet
  { key: "naad-d", name: "naad d", cut: <rect x={158} y={-62} width={11} height={66} /> },
  // e: de onderste uithaal schuin afgesneden
  { key: "snede-e", name: "snede e", cut: <polygon points="425,-102 472,-102 472,-45" /> },
  // n: een kleine inkeping in de voet van het rechterbeen
  { key: "inkeping-n", name: "inkeping n", cut: <circle cx={680} cy={3} r={19} /> },
  // c: de onderste uithaal korter, recht op de streek afgesneden
  { key: "open-c", name: "open c", cut: <polygon points="893,-60 937,-8 948,-8 948,-112 893,-112" /> },
  // k: een smalle opening in het schuine been
  { key: "onderbreking-k", name: "onderbreking k", cut: <polygon points={band(1117, -80, 0.53, 0.85, 46, 8)} /> },
  // h: de rechterhelft van de laatste voet weg, zodat de punt vrij naast de stok staat
  { key: "voet-h", name: "voet h", cut: <rect x={1436} y={-50} width={40} height={60} /> },
  // punt: een haarlijn over de basislijn, alsof de punt uit de h is gerold
  { key: "spoor-punt", name: "spoor punt", extra: <rect x={1458} y={-5} width={46} height={5} rx={2.5} className="lab__trail" /> },
];

function Mark({ v, id, label }: { v: Variant; id: string; label?: boolean }) {
  return (
    <svg viewBox={VIEWBOX} className="lab__mark" role={label ? "img" : undefined} aria-label={label ? `denckh. (${v.name})` : undefined} aria-hidden={label ? undefined : true}>
      {v.cut && (
        <mask id={id} maskUnits="userSpaceOnUse" x={0} y={-380} width={1560} height={400}>
          <rect x={0} y={-380} width={1560} height={400} fill="#fff" />
          <g fill="#000">{v.cut}</g>
        </mask>
      )}
      <g mask={v.cut ? `url(#${id})` : undefined}>
        <path d={LETTERS} fill="currentColor" />
        <rect {...LIGATURE} fill="currentColor" />
      </g>
      {v.extra}
      <circle {...DOT} className="lab__dot" />
    </svg>
  );
}

export default function LogoLab() {
  return (
    <main className="lab" id="inhoud">
      <header className="lab__head">
        <p className="lab__kicker">intern · geen besluit</p>
        <h1>Logo-lab</h1>
        <p>Het huidige woordmerk en zeven varianten, elk met één ingreep aan de onderkant. Per variant: groot, headerformaat,
          ongeveer 100 px breed, en licht op donker. De favicon is alleen de punt en verandert bij geen enkele variant.</p>
      </header>
      {VARIANTS.map((v) => (
        <section key={v.key} className="lab__row" aria-labelledby={`lab-${v.key}`}>
          <h2 id={`lab-${v.key}`}>{v.name}</h2>
          <div className="lab__big"><Mark v={v} id={`m-${v.key}-big`} label /></div>
          <div className="lab__sizes">
            <div className="lab__paper"><span className="lab__header"><Mark v={v} id={`m-${v.key}-hdr`} /></span><span className="lab__small"><Mark v={v} id={`m-${v.key}-sm`} /></span></div>
            <div className="lab__night"><span className="lab__mid"><Mark v={v} id={`m-${v.key}-night`} /></span><span className="lab__small"><Mark v={v} id={`m-${v.key}-nsm`} /></span></div>
          </div>
        </section>
      ))}
    </main>
  );
}
