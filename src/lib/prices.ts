// Alle prijzen van Denckh op één plek (homepage, /prijzen/ en tests lezen hier). Bedragen in euro, exclusief btw.
// Bron: prijsbesluit eigenaar, 2026-09-29 (HANDOFF B-062).

export type StopGlyph = "punt" | "schets" | "vorm";

/** Een halte op de prijslijn: van een kleine gedachte naar iets dat echt gemaakt is. */
export type PriceStop = {
  glyph: StopGlyph;
  label: string;
  from?: boolean; // "vanaf"
  price: string;
  meta: string;
  text: string;
  note?: string;
};

export const HOME_STOPS: PriceStop[] = [
  {
    glyph: "punt",
    label: "Eerst even Denckh",
    price: "€45",
    meta: "excl. btw",
    text: "60 minuten samen denken. We halen het idee uit elkaar, zoeken de richting en bepalen wat een goede volgende stap is.",
    note: "Wordt het daarna een opdracht vanaf €295? Dan verreken ik die €45.",
  },
  { glyph: "schets", label: "Eerste vorm", from: true, price: "€125", meta: "excl. btw", text: "Een kleine visual, uitwerking of concrete eerste proef." },
  { glyph: "vorm", label: "Echt maken", from: true, price: "€295", meta: "excl. btw", text: "Een afgebakend werkend resultaat. Vooraf spreken we een vaste prijs af." },
];

/** Hoe het begint: kennismaken, samen denken, en een project met een vaste prijs. */
export const START_STOPS: PriceStop[] = [
  { glyph: "punt", label: "Kennismaken", price: "vrijblijvend", meta: "circa 20 minuten", text: "Kort je idee vertellen en kijken of Denckh erbij past.", note: "Kost niets. Wil je daarna echt samen aan de slag, dan spreken we dat eerst af." },
  {
    glyph: "schets",
    label: "Even Denckh",
    price: "€45",
    meta: "excl. btw · 60 minuten",
    text: "Een uur echt samen aan je idee werken, met een duidelijke volgende stap.",
    note: "Wordt het daarna een opdracht vanaf €295? Dan verreken ik die €45.",
  },
  { glyph: "vorm", label: "Project", price: "vaste prijs", meta: "vooraf afgesproken", text: "Na de intake weet je wat jouw idee kost. Dat bedrag verandert niet zonder overleg." },
];

export const DOMAIN_NOTE = "Je eigen domeinnaam is het eerste jaar inbegrepen, tot maximaal €20 excl. btw. Hosting is niet inbegrepen.";

export type FormGroup = "zichtbaar" | "digitaal" | "online";
export const FORM_GROUPS: Record<FormGroup, string> = { zichtbaar: "Zichtbaar maken", digitaal: "Digitaal maken", online: "Online zetten" };

export type FormPrice = {
  key: string;
  group: FormGroup;
  name: string;
  price: number; // vanaf, excl. btw
  text: string;
  shape: string; // sleutel in SHAPES, of "schets" voor de lijn van de bezoeker zelf
  domain?: boolean;
  aside?: string;
};

// per groep aaneengesloten (de pagina zet de groepsnaam boven de eerste vorm van elke groep)
export const FORM_PRICES: FormPrice[] = [
  {
    key: "zonder-naam",
    group: "zichtbaar",
    name: "Iets zonder naam",
    price: 95,
    shape: "schets",
    text: "We bespreken je idee. Daarna zoek ik het zelf verder uit en werk ik een concrete richting of voorstel voor je uit. Vooraf spreken we af wat je krijgt.",
    aside: "Anders dan Even Denckh (€45): dat is 60 minuten samen denken, zonder uitzoekwerk achteraf.",
  },
  { key: "visual", group: "zichtbaar", name: "Visual / eerste vorm", price: 125, shape: "visualisatie", text: "Een schema, conceptbeeld, visueel verhaal of andere compacte uitwerking." },
  { key: "presentatie", group: "zichtbaar", name: "Presentatie", price: 195, shape: "presentatie", text: "Een compacte presentatie met een duidelijke lijn en eigen vormgeving. Inhoud grotendeels aangeleverd." },
  { key: "prototype", group: "digitaal", name: "Prototype", price: 295, shape: "prototype", text: "Een eerste klikbare of werkende versie om een idee zichtbaar en testbaar te maken." },
  { key: "spel", group: "digitaal", name: "Spel / spelconcept", price: 295, shape: "spel", text: "Basisconcept, spelmechaniek en een eerste speelbare proef. Productie niet inbegrepen." },
  { key: "uitleg", group: "digitaal", name: "Interactieve uitleg / tool", price: 395, shape: "uitleg", text: "Een product, proces of technisch verhaal begrijpelijk en interactief maken, of een kleine tool met één duidelijke functie." },
  { key: "demo", group: "digitaal", name: "Interactieve demo", price: 495, shape: "demo", text: "Maatwerk waarmee iemand iets kan ontdekken, bedienen of ervaren." },
  { key: "website", group: "online", name: "Website", price: 295, shape: "website", domain: true, text: "Een compacte responsive website voor één helder aanbod of idee, op basis van inhoud die jij aanlevert." },
  { key: "website-plus", group: "online", name: "Uitgebreidere website", price: 495, shape: "websitePlus", domain: true, text: "Meer pagina’s, meer eigen ontwerp of extra interactie dan de compacte website." },
  { key: "webshop", group: "online", name: "Webshop", price: 595, shape: "webshop", domain: true, text: "Een compacte webshop op een bestaand platform, met basisinrichting en een geteste mobiele checkout. Geen complexe maatwerk e-commerce." },
  { key: "webshop-plus", group: "online", name: "Uitgebreidere webshop", price: 795, shape: "webshopPlus", domain: true, text: "Meer eigen uitstraling, extra inrichting of interactie en uitgebreidere oplevering." },
];

export const INCLUDED = [
  "intake",
  "meedenken",
  "ontwerp en bouw binnen wat we afspreken",
  "één gebundelde correctieronde",
  "testen op desktop en mobiel, waar dat relevant is",
  "korte uitleg bij oplevering",
];

export const NOT_INCLUDED = [
  "hosting",
  "de jaarlijkse kosten van je webadres na het eerste jaar",
  "betaalde apps, software en licenties",
  "fotografie en video",
  "uitgebreide teksten schrijven",
  "een volledige huisstijl of logo",
  "veel producten invoeren",
  "complexe koppelingen met andere systemen",
  "drukwerk",
  "advertenties en SEO-campagnes",
  "beheer op de lange termijn",
  "extra correctierondes",
];

export const WEB_ADDRESS = [
  "Je webadres (de domeinnaam) komt op jouw naam, in je eigen account.",
  "Na het eerste jaar betaal je de jaarlijkse kosten voor je webadres zelf.",
  "Hosting zit er niet standaard bij.",
  "Is hosting nodig, dan help ik je die in te richten. Wat dat kost, hoor je vooraf.",
];

/** Meerwerk: geen uurtarief op de site (je koopt een resultaat met een vaste prijs), wel de afspraak vooraf. */
export const EXTRA = { title: "Iets extra nodig?", text: "Werk buiten de afgesproken scope doe ik alleen na overleg. Je hoort vooraf wat het extra kost." };

/** De prijslijst als PDF: pas zichtbaar als dit bestand in public/ staat (geen kapotte link). */
export const PRICE_PDF = "/downloads/denckh-prijslijst.pdf";
