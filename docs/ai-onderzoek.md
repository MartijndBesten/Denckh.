# Onderzoek: echte AI achter "Denckh kijkt"

Status: **onderzoek, 2026-09-29. Niets gebouwd, geen account, geen sleutel, geen betaalde dienst.**
De huidige site gebruikt vaste regels in de browser (`src/lib/ink/`). Dit document beschrijft wat nodig is om daar later
een echte interpretatielaag achter te zetten, en welke beslissingen de eigenaar eerst moet nemen.

## 1. Wat de AI zou moeten doen (en wat niet)

- **Wel:** schets + optionele zin lezen als *een vaag idee*, en teruggeven: één korte lezing ("Ik zie hier misschien
  een bediening in"), welke eerste vorm past (één van de vaste vormen: knop, scherm, regelaar, verloop, route, kaart)
  en één vervolgvraag.
- **Niet:** raden wat er getekend is (geen Pictionary), vrije tekst genereren die als belofte of advies leest, of
  beelden genereren.
- De vorm zelf blijft door de site gebouwd uit de eigen lijn. De AI kiest en formuleert; de site maakt.

## 2. Model en provider

| Optie | Waarom | Kosten (API-prijs per 1M tokens, stand 2026-09-25) |
|---|---|---|
| **Claude Opus 5.5** (`claude-opus-5-5`) | Standaardkeuze: sterkste lezing van een vaag idee, beeldinvoer, gestructureerde uitvoer | $4 invoer / $20 uitvoer |
| Claude Haiku 4.5 (`claude-haiku-4-5`) | Goedkoper en sneller; de taak is klein en sterk begrensd | $1 invoer / $5 uitvoer |

Beeld is niet eens nodig: de site kent de lijn al als punten. Een vereenvoudigde puntenreeks plus de gemeten
eigenschappen (gesloten, hoeken, kruisingen, verhouding) als tekst is kleiner en preciezer dan een afbeelding.
Beeldinvoer blijft mogelijk als uitbreiding.

**Keuze tussen de twee is aan de eigenaar.** Advies: begin met Opus 5.5 op lage inspanning (`effort: "low"`) en meet;
schakel alleen terug als kosten of snelheid dat vragen.

## 3. Kosten per interactie (schatting)

Aannames: systeemprompt ca. 800 tokens (gecachet), schets + meetwaarden ca. 400 tokens, zin max. 140 tekens, antwoord
ca. 150 tokens plus beperkt denkwerk.

| | Opus 5.5 | Haiku 4.5 |
|---|---|---|
| Per interactie | ca. $0,005 – $0,02 | ca. $0,001 – $0,004 |
| 1.000 interacties per maand | ca. $5 – $20 | ca. $1 – $4 |

Schatting, geen meting. Echte cijfers pas na een test met een bestedingslimiet.

## 4. Backend naast GitHub Pages

GitHub Pages is statisch: er draait geen code op de server. Een API-sleutel mag **nooit** in de browser. Er is dus
één klein endpoint nodig dat de sleutel bewaart en het verzoek doorzet.

| Optie | Plus | Min |
|---|---|---|
| **Serverless functie** (bijv. Cloudflare Workers) | Geen server om te beheren, secrets ingebouwd, gratis laag ruim genoeg, snel | Nieuw account bij een derde partij |
| PHP-endpoint op het bestaande Cloud86-pakket | Geen nieuwe partij, NL | Subdomein en CORS nodig, DNS-wijziging, PHP-sleutelbeheer, minder geschikt voor rate limiting |
| Vercel/Netlify-functie | Bekend | Commerciële voorwaarden en kosten nagaan |

Advies: serverless functie op een apart subdomein (bijv. `denk.denckh.nl`). Dat vraagt een DNS-record: **eigenaarsactie**.

## 5. Misbruik, spam en kosten beheersen

- Harde limieten: max. 140 tekens tekst, max. ca. 200 punten, `max_tokens` klein.
- Gestructureerde uitvoer (JSON-schema met vaste velden en maximale lengtes); alles daarbuiten wordt weggegooid en de
  site valt terug op de vaste regels.
- Rate limiting per IP (bijv. 5 per uur) plus een dagplafond voor de hele site.
- Een bestedingslimiet in de Anthropic Console.
- Optioneel een privacyvriendelijke botcheck (bijv. Cloudflare Turnstile), pas als er misbruik blijkt.
- Promptinjectie via de tekstregel: de zin wordt als data behandeld, nooit als instructie; de uitvoer kan alleen uit
  de vaste vormlijst kiezen.
- Weigert het model (`stop_reason: "refusal"`) of faalt de aanroep: stil terugvallen op de vaste regels.

## 6. Privacy (AVG)

- Schets en zin gaan naar Anthropic (VS) als verwerker. Nodig: verwerkersvoorwaarden (commerciële voorwaarden van
  Anthropic), vermelding in de privacyverklaring, en de actuele bewaartermijnen bij de provider nagaan.
- Niets zelf opslaan. Geen logging van inhoud; alleen tellers voor rate limiting.
- **Opt-in:** de echte AI alleen na een zichtbare keuze ("Laat Denckh echt meekijken"). Zonder die keuze blijft alles
  lokaal, zoals nu.
- Geen persoonsgegevens vragen in het tekenmoment.

## 7. Gevolgen voor de statische architectuur

- De site blijft statisch op GitHub Pages. Er komt één extern endpoint bij.
- De huidige vaste regels blijven de terugvaloptie en de standaard zonder opt-in.
- De interface verandert niet: `READINGS` in `src/lib/ink/interpret.ts` wordt aangevuld met een asynchrone variant.
- Sinds 2026-09-29 maakt `src/lib/ink/concept.ts` van de zin van de bezoeker een `Concept` (soort ding, onderwerp,
  drie delen, labels, aantekeningen), met trefwoorden in plaats van een model. Een echte laag zou precies dat object
  vullen (structured output tegen hetzelfde schema); de vorm tekent het dan zonder verdere wijzigingen.

## 8. Beslissingen vóór bouw (eigenaar)

1. Wil je echte AI op de publieke site, of alleen als demo op afspraak?
2. Model: Opus 5.5 of Haiku 4.5.
3. Waar draait het endpoint (serverless-account of Cloud86) en wie beheert de sleutel?
4. Maandbudget en bestedingslimiet.
5. Tekst in de privacyverklaring.

Tot die beslissingen er zijn, wordt er niets gebouwd.
