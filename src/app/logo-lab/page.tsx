// Interne merkproefpagina. Niet gelinkt, niet in de sitemap, noindex. Geen besluit: zie HANDOFF.md.
// Boven: de merkhiërarchie zoals die nu is (woordmerk, signatuur met krul, krul los), de hulplijn in de hero en de
// favicon-vergelijking. Onder "eerdere proeven": de lettersnedes uit ronde 3, die niet worden toegepast.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/Wordmark";
import { DOT, LETTERS, LIGATURE, VIEWBOX } from "@/components/wordmarkPaths";
import { KRUL_BOX, KRUL_END, KRUL_PATH, KRUL_START, krulFit, krulPath } from "@/lib/ink/krul";

export const metadata: Metadata = {
  title: "Logo-lab (intern)",
  robots: { index: false, follow: false },
};

/** De krul zoals in het Open Graph-beeld: okerlijn met de punt aan het eind. */
function Krul({ draw = false, className = "" }: { draw?: boolean; className?: string }) {
  return (
    <svg viewBox={`0 0 ${KRUL_BOX.w} ${KRUL_BOX.h}`} className={`lab__krul ${className}`} aria-hidden="true">
      <path d={KRUL_PATH} pathLength={1} className={draw ? "lab__krul-line lab__krul-line--draw" : "lab__krul-line"} />
      <circle cx={KRUL_END.x} cy={KRUL_END.y} r={15} className={draw ? "lab__krul-dot lab__krul-dot--draw" : "lab__krul-dot"} />
    </svg>
  );
}

/** De hulplijn zoals in de hero: punt, aanloop en de gestippelde krul. Statische weergave op één maat. */
function HeroHint() {
  const W = 560, H = 330, zone = { x: 200, y: 20, w: 340, h: 290 };
  const m = Math.min(zone.w, zone.h) * 0.08;
  const fit = krulFit(zone.x + m, zone.y + m, zone.w - m * 2, zone.h - m * 2);
  const a = fit(KRUL_START), p0 = { x: 70, y: 90 };
  const c1 = { x: p0.x + (a.x - p0.x) * 0.15, y: p0.y + (a.y - p0.y) * 0.55 };
  const c2 = { x: a.x - Math.max(40, (a.x - p0.x) * 0.3), y: a.y + 24 };
  const d = `M${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${a.x} ${a.y} ${krulPath(fit).replace(/^M[^C]*/, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lab__hero" aria-hidden="true">
      <text x={24} y={98} className="lab__hero-word">Mooi</text>
      <circle cx={p0.x - 14} cy={p0.y} r={12} className="lab__krul-dot" />
      <path d={d} pathLength={1} className="lab__ghost" />
    </svg>
  );
}

const FAVICONS = [
  { src: "/favicon.svg", name: "huidig: de punt" },
  { src: "/favicon-krul.svg", name: "proef: de krul" },
];

type Variant = { key: string; name: string; cut?: ReactNode; extra?: ReactNode };

function band(cx: number, cy: number, dx: number, dy: number, l: number, b: number) {
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, px = uy, py = -ux;
  const pt = (s: number, t: number) => `${cx + px * s + ux * t},${cy + py * s + uy * t}`;
  return `${pt(l, b)} ${pt(l, -b)} ${pt(-l, -b)} ${pt(-l, b)}`;
}

const OLD_VARIANTS: Variant[] = [
  { key: "naad-d", name: "naad d", cut: <rect x={158} y={-62} width={11} height={66} /> },
  { key: "snede-e", name: "snede e", cut: <polygon points="425,-102 472,-102 472,-45" /> },
  { key: "inkeping-n", name: "inkeping n", cut: <circle cx={680} cy={3} r={19} /> },
  { key: "open-c", name: "open c", cut: <polygon points="893,-60 937,-8 948,-8 948,-112 893,-112" /> },
  { key: "onderbreking-k", name: "onderbreking k", cut: <polygon points={band(1117, -80, 0.53, 0.85, 46, 8)} /> },
  { key: "voet-h", name: "voet h", cut: <rect x={1436} y={-50} width={40} height={60} /> },
  { key: "spoor-punt", name: "spoor punt", extra: <rect x={1458} y={-5} width={46} height={5} rx={2.5} className="lab__trail" /> },
];

function OldMark({ v, id }: { v: Variant; id: string }) {
  return (
    <svg viewBox={VIEWBOX} className="lab__mark" aria-hidden="true">
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
        <p>Merkproef rond punt, lijn en vorm. Het woordmerk “denckh.” blijft zoals het is. De krul is de lijn uit het
          Open Graph-beeld; hier staat hoe hij zich verhoudt tot het woordmerk, de hero en de favicon.</p>
      </header>

      <section className="lab__row" aria-labelledby="lab-compact">
        <h2 id="lab-compact">1 · compact: woordmerk</h2>
        <p className="lab__note">Header en kleine functionele toepassingen. Ongewijzigd.</p>
        <div className="lab__big"><Wordmark living={false} className="lab__wm" /></div>
        <div className="lab__sizes">
          <div className="lab__paper"><span className="lab__header"><Wordmark living={false} className="lab__wm" /></span><span className="lab__small"><Wordmark living={false} className="lab__wm" /></span></div>
          <div className="lab__night"><span className="lab__mid"><Wordmark living={false} className="lab__wm" /></span><span className="lab__small"><Wordmark living={false} className="lab__wm" /></span></div>
        </div>
      </section>

      <section className="lab__row" aria-labelledby="lab-signatuur">
        <h2 id="lab-signatuur">2 · signatuur: woordmerk + krul</h2>
        <p className="lab__note">Waar ruimte is: Open Graph, social, briefpapier. Dit is de opbouw van het huidige <code>/og.png</code>.</p>
        <div className="lab__sig lab__paper"><Wordmark living={false} className="lab__wm" /><Krul /></div>
        <div className="lab__sig lab__night"><Wordmark living={false} className="lab__wm" /><Krul /></div>
        <p className="lab__note">Het echte Open Graph-beeld, onveranderd:</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/og.png" alt="Open Graph-beeld: denckh. met de krul en de tagline van idee naar vorm" width={600} height={315} className="lab__og" />
      </section>

      <section className="lab__row" aria-labelledby="lab-krul">
        <h2 id="lab-krul">3 · de krul los</h2>
        <p className="lab__note">Als grafisch herkenningselement, waar het iets toevoegt. Links stil, in het midden één keer getekend (daarna stil), rechts op donker.</p>
        <div className="lab__krullen">
          <div className="lab__paper"><Krul /></div>
          <div className="lab__paper"><Krul draw /></div>
          <div className="lab__night"><Krul /></div>
        </div>
      </section>

      <section className="lab__row" aria-labelledby="lab-hero">
        <h2 id="lab-hero">4 · hero: de hulplijn is de krul</h2>
        <p className="lab__note">Vóór het tekenen: van de punt achter “Mooi” loopt een potloodgrijze stippellijn de krul in. Zodra je zelf tekent, verdwijnt hij. Live te zien op de homepage.</p>
        <div className="lab__paper"><HeroHint /></div>
      </section>

      <section className="lab__row" aria-labelledby="lab-favicon">
        <h2 id="lab-favicon">5 · favicon: punt of krul</h2>
        <p className="lab__note">Beide op 16, 32 en 48 px, zoals een browser ze toont. De proef vervangt de huidige favicon alleen als de krul op 16 px rustig herkenbaar blijft.</p>
        <div className="lab__favs">
          {FAVICONS.map((f) => (
            <div key={f.src} className="lab__fav">
              <p>{f.name}</p>
              <div className="lab__fav-row">
                {[16, 32, 48].map((n) => (
                  <span key={n} className="lab__fav-cell">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.src} width={n} height={n} alt="" />
                    <small>{n}</small>
                  </span>
                ))}
                <span className="lab__fav-cell lab__fav-cell--dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.src} width={32} height={32} alt="" />
                  <small>tab, donker</small>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="lab__old">
        <summary>eerdere proeven (ronde 3): lettersnedes, niet toegepast</summary>
        <p className="lab__note">Zeven varianten met één ingreep aan de onderkant. Het woordmerk blijft ongewijzigd; dit blijft staan als archief.</p>
        {OLD_VARIANTS.map((v) => (
          <section key={v.key} className="lab__row lab__row--old" aria-label={v.name}>
            <h3>{v.name}</h3>
            <div className="lab__big"><OldMark v={v} id={`m-${v.key}-big`} /></div>
          </section>
        ))}
      </details>
    </main>
  );
}
