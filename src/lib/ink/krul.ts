// De Denckh-krul: de handgetekende okerlijn uit het Open Graph-beeld (public/og.png), hier als bron.
// Vier vloeiende bochten die eindigen in een punt. Bewust niet geometrisch perfect; dat is het karakter.
// Gebruik: signatuur (woordmerk + krul), hulplijn in de hero, favicon-proef. Nooit onderdeel van het woordmerk zelf.
import type { Pt } from "./geometry";

/** Het kader waarin de krul is getekend. */
export const KRUL_BOX = { w: 300, h: 380 };

/** Cubische bochten [P0, C1, C2, P3], in de richting van het Open Graph-beeld: van linksonder naar de punt rechtsonder. */
export const KRUL_SEGMENTS: [Pt, Pt, Pt, Pt][] = [
  [{ x: 40, y: 330 }, { x: 20, y: 250 }, { x: 120, y: 230 }, { x: 150, y: 180 }],
  [{ x: 150, y: 180 }, { x: 180, y: 130 }, { x: 250, y: 80 }, { x: 180, y: 50 }],
  [{ x: 180, y: 50 }, { x: 110, y: 20 }, { x: 60, y: 90 }, { x: 110, y: 140 }],
  [{ x: 110, y: 140 }, { x: 160, y: 190 }, { x: 250, y: 220 }, { x: 262, y: 300 }],
];

/** Waar de punt zit in het Open Graph-beeld: het einde van de lijn. */
export const KRUL_END: Pt = { x: 262, y: 300 };
export const KRUL_START: Pt = { x: 40, y: 330 };

/** Het pad zoals in het Open Graph-beeld. */
export const KRUL_PATH = "M40 330 C 20 250, 120 230, 150 180 S 250 80, 180 50 S 60 90, 110 140 S 250 220, 262 300";

/** Hetzelfde pad, met elk punt door `map` gehaald (verplaatsen en schalen). */
export function krulPath(map: (p: Pt) => Pt): string {
  const f = (p: Pt) => { const q = map(p); return `${q.x.toFixed(1)} ${q.y.toFixed(1)}`; };
  return KRUL_SEGMENTS.map((s, i) => `${i === 0 ? `M${f(s[0])} ` : ""}C ${f(s[1])}, ${f(s[2])}, ${f(s[3])}`).join(" ");
}

/** Plaats de krul passend in een kader (x, y, w, h), verhoudingen behouden, gecentreerd. Geeft de afbeelding terug. */
export function krulFit(x: number, y: number, w: number, h: number): (p: Pt) => Pt {
  const s = Math.min(w / KRUL_BOX.w, h / KRUL_BOX.h);
  const ox = x + (w - KRUL_BOX.w * s) / 2, oy = y + (h - KRUL_BOX.h * s) / 2;
  return (p) => ({ x: ox + p.x * s, y: oy + p.y * s });
}
