"use client";

// Eén beurt uit het spel, om zelf te doen: waar hoort deze kaart op de tijdlijn?
// Voorbeeld van het spelprincipe. Geen echte kaarten, liedjes of jaartallen uit het spel.
import { useEffect, useRef, useState } from "react";

const START = [1742, 1936, 2004];
const DECK = [1968, 1815, 2019];

type Result = { year: number; slot: number; ok: boolean };

function QrMark() {
  return (
    <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true" className="turn__qr">
      <path d="M1 1h6v6H1zM13 1h6v6h-6zM1 13h6v6H1z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 3h2v2H3zM15 3h2v2h-2zM3 15h2v2H3zM10 2h1.6v1.6H10zM9 9h2v2H9zM13 10h2v2h-2zM10 14h1.6v1.6H10zM15 15h2v2h-2zM17 11h1.6v1.6H17z" fill="currentColor" />
    </svg>
  );
}

export function LoflijnTurn() {
  const [line, setLine] = useState(START);
  const [draw, setDraw] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const card = DECK[draw];
  const done = draw >= DECK.length;
  const choosing = !result && !done;

  // toetsenbord: na een keuze naar de knop, na "volgende kaart" terug naar de tijdlijn
  const nextRef = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLOListElement>(null);
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) return;
    if (choosing) lineRef.current?.querySelector<HTMLButtonElement>(".turn__slot")?.focus();
    else nextRef.current?.focus();
  }, [choosing, draw]);

  const place = (slot: number) => {
    if (!choosing) return;
    touched.current = true;
    const before = line[slot - 1] ?? -Infinity, after = line[slot] ?? Infinity;
    const ok = card > before && card < after;
    setResult({ year: card, slot, ok });
    if (ok) setLine([...line.slice(0, slot), card, ...line.slice(slot)]);
  };
  const next = () => { touched.current = true; setResult(null); setDraw(draw + 1); };
  const reset = () => { touched.current = true; setResult(null); setDraw(0); setLine(START); };

  const where = (slot: number) =>
    slot === 0 ? `vóór ${line[0]}` : slot === line.length ? `na ${line[line.length - 1]}` : `tussen ${line[slot - 1]} en ${line[slot]}`;
  const rightSlot = (year: number) => { const i = line.findIndex((y) => y > year); return i === -1 ? line.length : i; };

  return (
    <div className="turn" role="group" aria-labelledby="turn-titel">
      <div className="turn__head">
        <h4 id="turn-titel">Speel een beurt</h4>
        <p className="turn__note">Voorbeeld van het spelprincipe. De jaartallen zijn ter illustratie, niet van echte kaarten.</p>
      </div>

      <div className="turn__hand">
        {!done && !result && (
          <div className="turn__card turn__card--new" aria-hidden="true"><QrMark /><span>?</span></div>
        )}
        <p className="turn__say" aria-live="polite">
          {done ? "De stapel is op. Zo speel je het ook aan tafel: kaart voor kaart bouw je samen een tijdlijn."
            : result ? (result.ok ? `Goed. Dit lied is van ${result.year}: de kaart blijft liggen.` : `Net niet. Dit lied is van ${result.year}, dus hij hoort ${where(rightSlot(result.year))}. De kaart gaat terug in de doos.`)
            : "Je hebt het lied gehoord. Waar leg je deze kaart?"}
        </p>
        {(result || done) && (
          <button ref={nextRef} type="button" className="ink-button turn__next" onClick={done ? reset : next}>
            {done ? "Opnieuw" : draw === DECK.length - 1 ? "Klaar" : "Volgende kaart"}
          </button>
        )}
      </div>

      <div className="turn__board">
        <ol className="turn__line" aria-label="Tijdlijn" ref={lineRef}>
          {line.map((year, i) => (
            <li key={year} className="turn__item">
              {i === 0 && <Slot off={!choosing} label={where(0)} onPick={() => place(0)} />}
              <span className={`turn__card${result?.ok && result.year === year ? " turn__card--placed" : ""}`}>{year}</span>
              <Slot off={!choosing} label={where(i + 1)} onPick={() => place(i + 1)} />
            </li>
          ))}
        </ol>
        <p className="turn__ends" aria-hidden="true"><span>eerder</span><span>later</span></p>
      </div>
    </div>
  );
}

function Slot({ label, onPick, off }: { label: string; onPick: () => void; off: boolean }) {
  return (
    <button type="button" className="turn__slot" onClick={onPick} disabled={off} aria-hidden={off || undefined} aria-label={`Leg de kaart ${label}`}>
      <span aria-hidden="true">+</span>
    </button>
  );
}
