// Voorbeeldinterpretaties. Vaste regels, geen AI. Later kan hier een echte interpretatielaag achter komen
// (zie docs/ai-onderzoek.md); de interface blijft dan hetzelfde.
import type { FormKind } from "./analyze";

type Reading = {
  name: string; // "een draaiknop"
  readings: string[]; // wat Denckh ziet
  caption: string; // onder de eerste vorm
  reply: (idea: string) => string; // reactie op "wat zat er in je hoofd?"
};

export const READINGS: Record<FormKind, Reading> = {
  punt: {
    name: "een punt",
    readings: ["Een punt. Daar begint alles mee. Trek hem eens een stukje verder."],
    caption: "Nog een punt.",
    reply: () => "",
  },
  knop: {
    name: "een draaiknop",
    readings: [
      "Iets ronds en gesloten. Ik zie hier misschien een bediening in.",
      "Een rond geheel. Dat kan iets zijn dat je vastpakt en draait.",
    ],
    caption: "Eerste vorm: een draaiknop. Draai maar.",
    reply: (idea) => `Voor “${idea}” zou dit het begin van een bediening kunnen zijn: één knop, één waarde. De vraag is dan: wat moet hij regelen, en voor wie?`,
  },
  scherm: {
    name: "een scherm",
    readings: [
      "Een kader met hoeken. Dit zou zomaar een scherm kunnen zijn.",
      "Iets met randen en een binnenkant. Daar past informatie in.",
    ],
    caption: "Eerste vorm: een scherm met drie keuzes. Kies er een.",
    reply: (idea) => `Voor “${idea}” zou dit een eerste scherm kunnen zijn. Wat moet iemand daar als eerste zien, en wat moet die daar kunnen doen?`,
  },
  schuif: {
    name: "een schuifregelaar",
    readings: [
      "Eén vastberaden lijn. Daar hoort iets bij dat je kunt verschuiven.",
      "Een rechte beweging van A naar B. Dat is een schaal.",
    ],
    caption: "Eerste vorm: een regelaar. Schuif maar.",
    reply: (idea) => `Voor “${idea}” zou dit een instelling kunnen zijn tussen twee uitersten. Wat staat er aan het ene eind, en wat aan het andere?`,
  },
  grafiek: {
    name: "een verloop",
    readings: [
      "Een lijn die ergens naartoe gaat. Dit leest als iets dat verandert in de tijd.",
      "Op en neer, maar met een richting. Dat kan een visualisatie worden.",
    ],
    caption: "Eerste vorm: een verloop met meetpunten. Raak er een aan.",
    reply: (idea) => `Voor “${idea}” zou dit een visualisatie kunnen zijn. Wat wil je dat iemand in één oogopslag ziet veranderen?`,
  },
  route: {
    name: "een route",
    readings: [
      "Een beweging met een paar keerpunten. Dit zou een route met duidelijke keuzes kunnen zijn.",
      "Het gaat ergens heen, maar niet in één keer. Ik zie stappen.",
    ],
    caption: "Eerste vorm: een route in stappen. Loop hem door.",
    reply: (idea) => `Voor “${idea}” zou dit een stap-voor-stap-uitleg kunnen zijn. Wat is de eerste stap die iemand moet zetten?`,
  },
  kaart: {
    name: "een ideeënkaart",
    readings: [
      "Veel tegelijk. Er zitten waarschijnlijk meerdere ideeën in die bij elkaar horen.",
      "Het draait om iets heen. Dat zijn een paar gedachten die met elkaar verbonden zijn.",
    ],
    caption: "Eerste vorm: een kaart van wat erin zit. Raak een punt aan.",
    reply: (idea) => `Voor “${idea}” is dit een manier om het te ordenen. Welke van deze punten moet als eerste vorm krijgen?`,
  },
};

export function readingFor(kind: FormKind, seed: number) {
  const r = READINGS[kind];
  return r.readings[Math.abs(Math.round(seed)) % r.readings.length];
}
