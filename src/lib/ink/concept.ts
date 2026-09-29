// Van zin naar onderdelen. Vaste regels, geen AI: een paar trefwoorden bepalen wat voor soort ding het is,
// het onderwerp komt uit de zin zelf. Het resultaat vult de eerste vorm met concrete onderdelen.
// Later kan hier een echte interpretatielaag achter (docs/ai-onderzoek.md); de vorm van `Concept` blijft dan gelijk.
import type { FormKind } from "./analyze";

export type Domain = "plannen" | "verkopen" | "spel" | "leren" | "inzicht" | "uitleg" | "samen" | "eten" | "techniek" | "algemeen";

/** Wat Denckh in een tegel schetst. */
export type Look = "items" | "steps" | "button" | "chart" | "calendar" | "slots" | "check" | "text" | "image" | "gauge" | "people" | "cards";

type Parts = {
  tiles: [string, string, string]; // de drie delen van het idee (scherm: drie tegels; andere vormen: drie tabs)
  looks: [Look, Look, Look]; // wat er in die tegels staat
  cta: string; // scherm: de ene knop
  steps: string[]; // route
  ends: [string, string]; // regelaar
  knob: { label: string; from: number; to: number; format?: (v: number) => string }; // draaiknop
  axis: { x: string; y: string }; // verloop
  map: string[]; // ideeënkaart (zonder het midden)
  notes: [string, string, string]; // wat Denckh bij elk van de drie delen schrijft
  question: string;
  could: (s: string) => [string, string]; // wat het concreet zou kunnen worden (s = het onderwerp uit de zin)
};

const KEYWORDS: [Domain, string[]][] = [
  ["plannen", ["afspraak", "afspraken", "reserveren", "reservering", "reserveer", "planning", "plannen", "agenda", "rooster", "boeken", "boeking", "tijdslot", "inschrijven", "inschrijving", "aanmelden", "rondleiding"]],
  ["verkopen", ["webshop", "winkel", "shop", "verkopen", "verkoop", "bestellen", "bestelling", "producten", "assortiment", "aanbod", "klanten", "betalen"]],
  ["spel", ["spel", "spelletje", "game", "spelen", "quiz", "puzzel", "kaartspel", "bordspel", "escaperoom"]],
  ["leren", ["les", "lessen", "leren", "cursus", "training", "school", "leerlingen", "oefenen", "studie", "opleiding", "workshop"]],
  ["inzicht", ["dashboard", "data", "inzicht", "grafiek", "meten", "meting", "cijfers", "verbruik", "energie", "rapport", "statistiek", "overzicht", "resultaten"]],
  ["uitleg", ["uitleg", "uitleggen", "handleiding", "instructie", "instructies", "snappen", "begrijpen", "demo", "presentatie", "laten zien", "rondleiden", "tour"]],
  ["samen", ["vereniging", "club", "kerk", "team", "vrijwilligers", "buurt", "gemeente", "community", "familie", "bruiloft", "feest", "evenement", "actie", "leden"]],
  ["eten", ["pizza", "deeg", "bakkerij", "restaurant", "recept", "recepten", "koken", "eten", "lunch", "koffie", "bier", "wijn", "menu", "catering", "foodtruck"]],
  ["techniek", ["machine", "apparaat", "installatie", "sensor", "sensoren", "techniek", "systeem", "koffer", "verlichting", "licht", "robot", "motor", "product"]],
];

const STOP = new Set(("een de het van voor bij met over in op aan en of die dat dit deze ons onze mijn m'n je jouw jullie zijn z'n haar hun wij we ik iets wat waar " +
  "waarmee zodat om te naar uit als dan nog ook heel echt soort idee maken maak wil willen zou graag kunnen kan moet nieuwe nieuw eigen simpele simpel " +
  "kleine klein grote groot goede goed leuke leuk mooie mooi handige handig slimme slim app website site tool ding iets zoiets manier hoe mensen").split(" "));

const PREP = new Set(["bij", "voor", "over", "van", "met", "rond", "rondom", "tijdens", "in"]);

const pad2 = (n: number) => String(n).padStart(2, "0");

const PARTS: Record<Domain, Parts> = {
  plannen: {
    tiles: ["kies een dag", "kies een tijd", "bevestig"], looks: ["calendar", "slots", "check"], cta: "reserveer",
    steps: ["kies", "vul in", "bevestig", "herinnering", "de dag", "terugblik"], ends: ["ochtend", "avond"],
    knob: { label: "tijd", from: 8, to: 18, format: (v) => `${pad2(v)}:00` }, axis: { x: "uren", y: "bezetting" },
    map: ["wanneer", "wie", "hoeveel", "bevestiging"],
    notes: ["laat alleen vrije dagen zien", "wat nog vrij is, zie je meteen", "bevestiging direct in je mail"],
    question: "Wie plant er, en wie moet het overzicht hebben?",
    could: (s) => [`een reserveringspagina voor ${s}: vrije dagen en tijdsloten kiezen, bevestiging per mail`, "een beheeromgeving met alle reserveringen op één plek"],
  },
  verkopen: {
    tiles: ["aanbod", "zo werkt het", "bestellen"], looks: ["items", "steps", "button"], cta: "bestel",
    steps: ["kijken", "kiezen", "bestellen", "betalen", "ontvangen", "terugkomen"], ends: ["los", "abonnement"],
    knob: { label: "aantal", from: 1, to: 24 }, axis: { x: "weken", y: "bestellingen" },
    map: ["aanbod", "klant", "prijs", "levering"],
    notes: ["eerst het product, dan de prijs", "uitleg in drie stappen", "één knop, geen omwegen"],
    question: "Wat moet iemand weten voordat die durft te bestellen?",
    could: (s) => [`een kleine webshop voor ${s}: aanbod, uitleg in drie stappen en één bestelknop`, "een productpagina die laat zien hoe het werkt, met een korte bestelroute"],
  },
  spel: {
    tiles: ["start", "speel", "score"], looks: ["image", "cards", "gauge"], cta: "speel",
    steps: ["uitleg", "eerste beurt", "tegenzet", "spanning", "finale", "winnaar"], ends: ["makkelijk", "pittig"],
    knob: { label: "spelers", from: 2, to: 10 }, axis: { x: "beurten", y: "punten" },
    map: ["doel", "beurt", "regel", "winst"],
    notes: ["regels in één zin", "eerste beurt binnen een minuut", "de stand zegt: nog een potje"],
    question: "Wanneer wil iemand nog een potje?",
    could: (s) => [`een speelbaar prototype van één beurt van ${s}, om te testen aan tafel of op een scherm`, "de spelregels als interactieve uitleg van een minuut"],
  },
  leren: {
    tiles: ["les", "oefenen", "voortgang"], looks: ["text", "check", "chart"], cta: "begin",
    steps: ["kennismaken", "leren", "oefenen", "toetsen", "herhalen", "klaar"], ends: ["beginner", "gevorderd"],
    knob: { label: "niveau", from: 1, to: 10 }, axis: { x: "lessen", y: "voortgang" },
    map: ["doel", "les", "oefening", "feedback"],
    notes: ["één doel per les", "oefenen met direct antwoord", "laat zien hoe ver je bent"],
    question: "Wat moet iemand na afloop kunnen?",
    could: (s) => [`een les over ${s} met oefeningen die direct antwoord geven`, "een overzicht waarin je ziet hoe ver je bent"],
  },
  inzicht: {
    tiles: ["nu", "verloop", "advies"], looks: ["gauge", "chart", "text"], cta: "bekijk",
    steps: ["meten", "verzamelen", "tonen", "vergelijken", "besluiten", "bijsturen"], ends: ["dag", "jaar"],
    knob: { label: "dagen terug", from: 1, to: 30 }, axis: { x: "tijd", y: "waarde" },
    map: ["bron", "meting", "grens", "actie"],
    notes: ["één getal dat telt", "de trend in één lijn", "en wat doe je dan?"],
    question: "Welk getal moet iemand in één oogopslag zien?",
    could: (s) => [`een dashboard voor ${s}: één hoofdgetal, de trend en wat je dan doet`, "een wekelijkse samenvatting op één scherm"],
  },
  uitleg: {
    tiles: ["wat is het", "hoe werkt het", "probeer zelf"], looks: ["image", "steps", "button"], cta: "start",
    steps: ["zien", "snappen", "proberen", "doen", "klaar", "verder"], ends: ["kort", "diepgaand"],
    knob: { label: "detailniveau", from: 1, to: 5 }, axis: { x: "stappen", y: "begrip" },
    map: ["wat", "hoe", "voor wie", "waarom"],
    notes: ["begin bij wat je ziet", "één ding per stap", "laat het zelf proberen"],
    question: "Wie moet het snappen, en wat weet die al?",
    could: (s) => [`een interactieve uitleg bij ${s}, stap voor stap, op telefoon of tablet (bijvoorbeeld via een QR-code)`, "een demo om mee te presenteren, naast het echte ding"],
  },
  samen: {
    tiles: ["nieuws", "meedoen", "wie doet wat"], looks: ["text", "button", "people"], cta: "doe mee",
    steps: ["zien", "aanmelden", "indelen", "meedoen", "terugblik", "volgende keer"], ends: ["klein", "iedereen"],
    knob: { label: "mensen", from: 5, to: 200 }, axis: { x: "weken", y: "aanmeldingen" },
    map: ["leden", "vrijwilligers", "agenda", "nieuws"],
    notes: ["laat zien wat er gebeurt", "meedoen in twee klikken", "overzicht voor de organisatie"],
    question: "Wie organiseert het, en wie moet er meedoen?",
    could: (s) => [`een site voor ${s} waar mensen zich aanmelden en zien wie wat doet`, "een beheeromgeving voor de organisatie, met overzicht en mails"],
  },
  eten: {
    tiles: ["menu", "bereiding", "bestellen"], looks: ["items", "steps", "button"], cta: "bestel",
    steps: ["kiezen", "bestellen", "maken", "bakken", "serveren", "delen"], ends: ["snel", "met aandacht"],
    knob: { label: "porties", from: 1, to: 12 }, axis: { x: "dagen", y: "bestellingen" },
    map: ["smaak", "bereiding", "gast", "prijs"],
    notes: ["laat het er lekker uitzien", "stap voor stap bereiden", "bestellen zonder gedoe"],
    question: "Waar en wanneer wordt het gegeten?",
    could: (s) => [`een menu- of receptpagina voor ${s}, met bestellen erbij`, "een uitleg stap voor stap: van ingrediënt tot bord"],
  },
  techniek: {
    tiles: ["overzicht", "onderdelen", "bediening"], looks: ["image", "items", "button"], cta: "start",
    steps: ["aanzetten", "instellen", "gebruiken", "controleren", "uitzetten", "onderhoud"], ends: ["uit", "maximaal"],
    knob: { label: "stand", from: 0, to: 100, format: (v) => `${v}%` }, axis: { x: "tijd", y: "stand" },
    map: ["onderdelen", "bediening", "gebruiker", "storing"],
    notes: ["eerst het geheel", "wat zit waar?", "één handeling per stap"],
    question: "Wie bedient het, en wat gaat er nu vaak mis?",
    could: (s) => [`een digitale uitleg bij ${s}: wat zit waar en hoe bedien je het`, "een nagebootste bediening om mee te oefenen of te presenteren"],
  },
  algemeen: {
    tiles: ["wat", "voor wie", "hoe"], looks: ["text", "people", "steps"], cta: "kies",
    steps: ["idee", "schets", "proef", "vorm", "test", "verder"], ends: ["klein", "groot"],
    knob: { label: "waarde", from: 0, to: 100 }, axis: { x: "tijd", y: "waarde" },
    map: ["wat", "voor wie", "hoe", "waarom"],
    notes: ["wat is de kern?", "voor wie is het?", "wat moet het doen?"],
    question: "Voor wie is het, en wat moet die ermee kunnen?",
    could: (s) => [`een klikbaar prototype van het eerste scherm van ${s}`, "drie schetsvarianten naast elkaar, om samen uit te kiezen"],
  },
};

export type Concept = Parts & { idea: string; domain: Domain; subject: string | null; phrase: string; title: string };

const words = (s: string) => s.toLowerCase().normalize("NFC").match(/[\p{L}\p{N}'-]+/gu) ?? [];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function domainOf(text: string, ws: string[]): Domain {
  let best: Domain = "algemeen", score = 0;
  for (const [d, keys] of KEYWORDS) {
    const n = keys.reduce((s, k) => s + (k.includes(" ") ? (text.includes(k) ? 1 : 0) : ws.some((w) => w === k || (k.length > 4 && w.startsWith(k))) ? 1 : 0), 0);
    if (n > score) { best = d; score = n; }
  }
  return best;
}

const DET = new Set(["een", "de", "het", "mijn", "m'n", "ons", "onze", "jouw", "je", "zijn", "haar", "hun", "deze", "dit", "die"]);

/** Het onderwerp: bij voorkeur het zelfstandig woord na "bij", "voor", "over" …; anders het eerste inhoudswoord
 *  dat geen trefwoord voor het soort ding is. `phrase` houdt het lidwoord erbij ("mijn bakkerij"). */
function subjectOf(ws: string[], domain: Domain): { word: string; phrase: string } | null {
  const own = new Set(KEYWORDS.find(([d]) => d === domain)?.[1] ?? []);
  const content = (w: string) => w.length > 2 && !STOP.has(w) && !PREP.has(w) && !/^\d+$/.test(w);
  const withDet = (i: number) => (i > 0 && DET.has(ws[i - 1]) ? `${ws[i - 1]} ${ws[i]}` : ws[i]);
  for (let i = ws.length - 2; i >= 0; i--) {
    if (!PREP.has(ws[i])) continue;
    const j = ws.findIndex((w, k) => k > i && content(w));
    if (j > 0 && !own.has(ws[j])) return { word: ws[j], phrase: withDet(j) };
  }
  let j = ws.findIndex((w) => content(w) && !own.has(w));
  if (j < 0) j = ws.findIndex(content);
  return j < 0 ? null : { word: ws[j], phrase: withDet(j) };
}

export function makeConcept(idea: string): Concept {
  const text = idea.trim().slice(0, 140);
  const ws = words(text);
  const domain = domainOf(text.toLowerCase(), ws);
  const found = subjectOf(ws, domain);
  const subject = found?.word ?? null;
  const short = text.length > 34 ? `${text.slice(0, 32).trimEnd()}…` : text;
  const parts = PARTS[domain];
  // bij inzicht is het onderwerp meestal precies wat er gemeten wordt
  const axis = domain === "inzicht" && subject ? { ...parts.axis, y: subject } : parts.axis;
  return { ...parts, axis, idea: text, domain, subject, phrase: found?.phrase ?? "dit idee", title: subject ? cap(subject) : short };
}

/** Wat de knop laat zien bij waarde 0..100. */
export function knobText(c: Concept, value: number) {
  const v = Math.round(c.knob.from + ((c.knob.to - c.knob.from) * value) / 100);
  return c.knob.format ? c.knob.format(v) : String(v);
}

/** De reactie noemt de onderdelen die in de vorm zijn verschenen. */
export function conceptReply(c: Concept, kind: FormKind, count = 3) {
  const q = `“${c.idea}”`;
  switch (kind) {
    case "scherm": return `Voor ${q} wordt dit een eerste scherm met drie delen: ${c.tiles.join(", ")}. ${c.question}`;
    case "knop": return `Voor ${q} wordt dit een knop voor ${c.knob.label}. Draai maar. ${c.question}`;
    case "schuif": return `Voor ${q} wordt dit een regelaar van ${c.ends[0]} naar ${c.ends[1]}. ${c.question}`;
    case "grafiek": return `Voor ${q} wordt dit een verloop: ${c.axis.y} over ${c.axis.x}. ${c.question}`;
    case "route": return `Voor ${q} wordt dit een route: ${c.steps.slice(0, count).join(" → ")}. ${c.question}`;
    case "kaart": return `Voor ${q} komt ${c.subject ?? "je idee"} in het midden, met ${c.map.slice(0, Math.max(1, count - 1)).join(", ")} eromheen. ${c.question}`;
    default: return "";
  }
}

/** Wat er meegaat naar de mail: concreet, zonder functies (moet in sessionStorage passen). */
export type Plan = { idea: string; title: string; form: string; parts: [string, string][]; could: [string, string]; question: string };

export function conceptPlan(c: Concept, kind: FormKind, count = 3): Plan {
  const k = c.knob, fmt = (v: number) => (k.format ? k.format(v) : String(v));
  const form: Record<string, string> = {
    scherm: `een eerste scherm “${c.title}” met drie delen en één knop (${c.cta})`,
    knop: `een draaiknop voor ${k.label}, van ${fmt(k.from)} tot ${fmt(k.to)}`,
    schuif: `een regelaar van ${c.ends[0]} naar ${c.ends[1]}`,
    grafiek: `een verloop: ${c.axis.y} over ${c.axis.x}`,
    route: `een route in ${count} stappen: ${c.steps.slice(0, count).join(" → ")}`,
    kaart: `een kaart met ${c.subject ?? "het idee"} in het midden en ${c.map.slice(0, Math.max(1, count - 1)).join(", ")} eromheen`,
  };
  return {
    idea: c.idea, title: c.title, form: form[kind] ?? "een eerste vorm",
    parts: c.tiles.map((t, i) => [t, c.notes[i]] as [string, string]),
    could: c.could(c.phrase), question: c.question,
  };
}
