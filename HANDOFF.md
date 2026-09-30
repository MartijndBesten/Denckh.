# HANDOFF

Overdrachtsdocument voor de Denckh-website. Hier staan de actuele stand, alle belangrijke technische en creatieve
beslissingen, open punten en de volgende stappen. **Bijwerken aan het eind van elke werksessie.**

- Laatst bijgewerkt: 2026-09-29
- Live (`main`): "begin met een punt" (B-031), ronde 2 (B-038) en ronde 3 (merge `5427b8e`, B-047)

---

## Huidige stand

**Productie.** `denckh.nl` draait op GitHub Pages vanaf `main`. Op 2026-09-29 is `creatief/het-punt` na akkoord van
de eigenaar gemerged (merge `960251b`, B-031). Mail via Cloud86/Plesk (`info@denckh.nl`). Aan DNS, Plesk en mail is
niets gewijzigd.

**Wat er live staat** (uit branch `creatief/het-punt`, zelf samengevoegd uit `main` en `codex/interactieve-kern`):

- **Fase A · typografie:** echte proef met 13 letters en 5 uitgewerkte richtingen, als contouren gezet.
  Werkhypothese: Fraunces met eigen ck-ligatuur. `docs/typografie-proef.md`, `docs/typografie/`.
- **Fase B · interactieve kern "begin met een punt":** punt uit "Mooi." trekken, tekenen met inkt die op snelheid
  reageert, Denckh kijkt (rode meetlijnen), lezing, eerste vorm uit de eigen lijn, zes bruikbare mini-vormen, één
  vraag, voorbeeldreactie. Muis, touch, toetsenbord, voorbeeld, reduced motion.
- **Fase C · grammatica:** jouw lijn als overgang, letters die hun plek vinden, projecten opgebouwd uit jouw lijn,
  "wat kan eruit komen" als één morphende lijn, werkwijze met jouw lijn, contact als nieuw begin, levend woordmerk,
  micro-interacties (getekende onderstreping, inktknoppen).
- **Fase D · homepage:** volledig omgezet. Deegh-casepagina en privacyverklaring bijgewerkt.
- **Kwaliteit:** 23/23 e2e-controles, axe 0 overtredingen, Lighthouse mobiel 93/100/100/100 (met gzip). Zie
  `docs/architectuur.md` §6.
- **Cases:** Deegh en Loflijn met naam en link; de demokoffer anoniem (geen toestemming TRILUX, B-029).
- **Bedrijfsgegevens** in footer, privacy en structured data (B-030); OpenGraph-beeld met het nieuwe woordmerk.
- **AI:** alleen onderzoek, niets gebouwd: `docs/ai-onderzoek.md`.

Nieuw werk: op een aparte branch; merge naar `main` = livegang.

**Ronde 2 (live sinds 2026-09-29, B-038).** Verwerkt de feedback van 2026-09-29:

- Projectvormen beginnen later: pas als het beeld helemaal in zicht is, met eerst een korte rust (B-032).
- De stappen onder elk project zijn knoppen: klik en de lijn loopt naar die stap (B-033).
- Loflijn heeft een eigen verhaal: een beurt in het spel in plaats van nog een webshop, plus een speelbare
  voorbeeldbeurt (B-034).
- Nieuwe sectie **Ook gemaakt**: Autowasdag Sionkerk (naam en link), een presentatie en een werkdag in 3D (beide
  anoniem) (B-035).
- 33/33 e2e-controles, axe 0 overtredingen op `/`, `/projecten/deegh/`, `/privacy/` en de hero met vorm en idee.
- Hero: je idee maakt de eerste vorm concreet (onderwerp, drie delen, labels en aantekeningen) (B-037).

**Prijzen (B-062 t/m B-066).** Richtprijzen op de site, alle bedragen uit één bestand (`src/lib/prices.ts`):

- Homepage, na *Zo werkt het*: blok **Wat kost zoiets?** (`#prijzen`). Een lijn loopt tijdens het scrollen van een
  punt (Eerst even Denckh, €45) via een schets (Eerste vorm, vanaf €125) naar een vorm (Echt maken, vanaf €295);
  elke prijs krijgt een okeronderstreping zodra de lijn hem bereikt. Daaronder *Bekijk de richtprijzen* en *Vertel je
  idee*.
- Nieuwe pagina **`/prijzen/`** (*Wat kan een idee kosten?*): kennismaken / Even Denckh / project als dezelfde lijn,
  elf vormen met vanafprijs (€95 t/m €795) waarbij één lijn de vorm aanneemt van de rij waar je leest of op wijst,
  wat standaard wel en niet inbegrepen is, webadres en hosting, los vervolgwerk (€45 per uur), en *Vertel je idee*.
- Bereikbaar via het homepageblok, de footer (*Prijzen*) en de sitemap. De kopnavigatie is ongewijzigd (B-065).
- Prijslijst-PDF (B-067): `public/downloads/denckh-prijslijst.pdf`, twee pagina's A4, gemaakt met `npm run prijslijst`
  uit `src/lib/prices.ts`. Na elke prijswijziging opnieuw draaien; de e2e-test meldt het als dat vergeten is.

**Portret en merkbestanden (B-058, B-059):** achtergrondgasten uit het portret geretoucheerd; merkbestanden in
`public/brand/` (`npm run brand`).

**Voorbeeldreeks (B-054 t/m B-057):** zes voorbeelden via "nog een voorbeeld", Deegh-voorbeeld (proef C), compactere
mobiele hulplijn, hero-intro met de positionering.

**Inventaris tekenengine (stand 2026-09-29).** Meet: lengte, kader, open/gesloten (lus aan het eind), rechtheid,
hoeken, kruisingen, lussen (totale draaiing), rondheid, cirkelvormigheid (4πA/P²), richting (monotoon in x).
Uitkomsten (`classify`): *punt* (korter dan 36 px) · *kaart* (≥ 3 kruisingen of ≥ 2,2 lussen) · *draaiknop*
(gesloten, cirkelvormigheid > 0,86) · *scherm* (gesloten, anders) · *regelaar* (rechtheid > 0,86) · *verloop*
(monotoon in x, breder dan hoog) · *route* (al het andere). Eerste vormen: draaiknop (draaibaar, toetsen), regelaar
(schuifbaar, toetsen), scherm (drie tegels, knop), verloop (meetpunten aanklikbaar), route (stappen aanklikbaar), kaart
(punten aanklikbaar, namen uit de krabbel, één vraag per punt). Na "Vertel" krijgt elke vorm onderdelen uit het idee
(B-037) en gaat een voorstel mee naar de mail (B-041). Route zit niet in de voorbeeldreeks: hij ontstaat vanzelf bij
veel vrije tekeningen en lijkt in een voorbeeld op het verloop.

**Afwerking krul (B-048 t/m B-053):** de krul uit het OG-beeld als merkelement, als hulplijn in de hero, rustiger
voorbeeld op basis van de Deegh-cirkel, één vraag per kaartpunt, favicon blijft de punt, logo-lab als merkproefpagina,
dossiers Deegh en demokoffer gesloten.

**Ronde 3 (live sinds 2026-09-29, B-047).** Eerder en vloeiender starten, stappen bij aanwijzen, Deegh-logo als stap
"een merk", concreet voorstel in de mail, kaartlabels uit de krabbel (B-039 t/m B-042), echt portret (B-043),
aangescherpte positionering (B-044), Loflijn-beurt verwijderd (B-045) en de interne logo-proef (B-046, open).

## Repositorygegevens

| Onderwerp | Waarde |
|---|---|
| Remote | `https://github.com/MartijndBesten/denckh` |
| Zichtbaarheid | Publiek |
| Hoofdbranch | `main` (live) |
| Laatste werkbranch | `creatief/ronde-3` (gemerged, B-047) |

---

## Beslissingenlog

Nieuwe beslissingen onderaan toevoegen. Een beslissing herzien? Voeg een nieuwe regel toe die naar de oude verwijst.
Pas de oude regel niet aan. *Voorstel* = wacht op akkoord van de eigenaar.

| # | Datum | Besluit | Reden | Status |
|---|---|---|---|---|
| B-001 | 2026-09-28 | `main` is de hoofdbranch. | De repo was leeg en nog niet anders ingericht. | Vast |
| B-002 | 2026-09-28 | Geen nieuwe repository. We werken in de bestaande `MartijndBesten/Denckh.`. | Opdracht van de eigenaar. | Vast |
| B-003 | 2026-09-28 | Hosting, DNS, Cloud86, livegang `denckh.nl` en productie-deploys zijn buiten scope tot expliciet akkoord. | Eerst een solide lokale/GitHub-basis, onderzoek en creative direction. | Vast tot nader order |
| B-004 | 2026-09-28 | Geen verzonnen claims, cases, klanten, testimonials, cijfers of resultaten. Ontbrekende inhoud wordt een gemarkeerde `[TODO: …]`. | Geloofwaardigheid. Een kleine studio staat of valt met eerlijke cases. | Vast |
| B-005 | 2026-09-28 | Een project wordt pas als case beschreven na verificatie van de werkelijke inhoud (live site en/of repo). Bron en datum worden vastgelegd in `docs/cases/`. | Voorkomt dat aannames als feit op de site komen. | Vast |
| B-006 | 2026-09-28 | Belangrijke technische en creatieve beslissingen worden in dit bestand bijgehouden. | Continuïteit tussen sessies en assistenten. | Vast |
| B-007 | 2026-09-28 | Nog geen techstack gekozen. Er worden geen framework of dependencies toegevoegd vóór een vastgelegde keuze. | De stack volgt uit de creative direction en de hostingrandvoorwaarden, niet andersom. | Vervangen door B-010 |
| B-008 | 2026-09-29 | Creatief concept **Het punt**: de punt uit "denckh." wordt het idee. Bovenaan de interactie *krabbel → vorm*; tijdens het scrollen de rode draad *punt → lijn → schets → vlak → vorm*, eindigend in het eerste echte project. De punt keert terug bij het contactformulier. | Maakt "van idee naar vorm" letterlijk ervaarbaar, binnen seconden en zonder de inhoud te blokkeren. Zie `docs/creative-direction.md`. | Voorstel |
| B-009 | 2026-09-29 | Eén bewegingstaal: **tekenen → invullen** (okerlijn tekent zich, daarna verschijnt de vorm). Scroll-koppeling alleen in de intro op brede schermen; op mobiel in-view; reduced motion toont eindstanden. | Consequent, licht, en mobiel betrouwbaar. Voorkomt "alles tegelijk". | Voorstel |
| B-010 | 2026-09-29 | Stack: **Next.js (App Router) + TypeScript + Tailwind CSS v4**, **Motion** (LazyMotion) alleen voor de intro en de hero-punt. Vervangt B-007. | Voorkeur eigenaar, onderhoudbaar, React herbruikbaar voor latere demo's. Afweging: Astro zou lichter zijn; het verschil is acceptabel. | Voorstel |
| B-011 | 2026-09-29 | **Statische export** (`output: 'export'`) op het **bestaande Cloud86-webhostingpakket**; contactformulier via een **PHP-endpoint** op dezelfde hosting; geen externe formulierdienst. | Node.js op Cloud86-webhosting is niet bevestigd (openbare info noemt het alleen bij VPS); de site heeft geen server nodig; geen extra kosten; alles op één plek. Zie `docs/architectuur.md`. | Voorstel |
| B-012 | 2026-09-29 | Kleuren afgeleid van het bestaande logo (papier `#FAF8F3`, inkt `#363434`, oker `#C8A477`), aangevuld met grafiet, potlood, oker-diep en nacht. **Geen extra frisse accentkleur.** | De punt moet het enige zijn dat "leeft". Contrastwaarden gecontroleerd. | Voorstel |
| B-013 | 2026-09-29 | Geen analytics, cookies of externe verzoeken bij de start (fonts zelf gehost). | Privacy, snelheid, geen cookiebanner nodig. Later alleen cookieloze statistiek als het nodig blijkt. | Voorstel |
| B-014 | 2026-09-29 | Een case gaat pas online na verificatie **én** toestemming. Liever twee echte cases dan drie halve. Voorgestelde volgorde: IntuSens-demokoffer → Deegh → Loflijn. Zonder toestemming van TRILUX komt Deegh eerst. | Volgt uit B-004/B-005. De demokoffer doorbreekt het beeld "webdesigner" het sterkst. | Voorstel |
| B-015 | 2026-09-29 | De eerste bouwstap gebruikt Next.js 16 met TypeScript, Tailwind CSS 4 en statische export. De interactie is bewust met native browser-API's gebouwd; Motion is niet nodig voor deze eerste, lichte versie. | Voldoet aan B-010/B-011 zonder extra runtimegewicht. | Vast op basis van de opdracht van de eigenaar |
| B-016 | 2026-09-29 | Zolang portfolio-rechten per merk/beeld niet zijn bevestigd, gebruikt de site alleen eigen abstracte diagrams en gecontroleerde tekst. | Een publieke GitHub-repo en later publieke site mogen geen herpublicatierecht suggereren. | Vast |
| B-017 | 2026-09-29 | Metadata-routes `robots.txt` en `sitemap.xml` worden expliciet statisch gegenereerd. | Vereist voor een betrouwbare Next.js static export. | Vast |
| B-018 | 2026-09-29 | De nieuwe hero is een lokaal UX-prototype voor `punt → krabbel → interpretatie → eerste vorm`; de reacties zijn deterministisch en geen AI. | De propositie is ervaarbaar zonder privacy-, kosten- of backendaanname. | Vast |
| B-019 | 2026-09-29 | Ontwerp- en bouwwerk gebeurt op een aparte branch; `main` alleen na akkoord eigenaar. | Elke push naar `main` gaat direct live via GitHub Pages. | Vast |
| B-020 | 2026-09-29 | Creatief concept verdiept tot **één interactieve grammatica**: de lijn van de bezoeker reist door de hele site (overgangen, projecten, uitkomsten, werkwijze, contact, woordmerk). De punt is het leesteken achter "Mooi.". Vervangt B-008/B-009. | De site moet zelf laten zien wat Denckh kan; geen losse trucjes. Zie `docs/creative-direction.md`. | Voorstel (gebouwd op branch) |
| B-021 | 2026-09-29 | Interpretatie met **vaste regels in de browser** (meetbare lijneigenschappen → zes vormen). Echte AI pas na onderzoek en besluit eigenaar (`docs/ai-onderzoek.md`). De site zegt eerlijk dat er geen AI is. | Geen sleutel client-side, geen kosten, geen privacyrisico; interface blijft gelijk voor een latere AI-laag. | Vast tot besluit |
| B-022 | 2026-09-29 | Kleur met rollen: oker = jouw idee, **menie `#B63F26`** = Denckh kijkt (beperkt tweede accent), inkt `#211F1D` = vorm, papier `#F7F4EE`. Vervangt B-012. | Tweede accent met een functie; meer contrast en drukwerkgevoel. | Voorstel |
| B-023 | 2026-09-29 | Typografie-werkhypothese: Fraunces (soft) met eigen **ck-ligatuur** voor woordmerk en grote zinnen, Manrope voor tekst; beide zelf gehost en gesubset. Levend woordmerk: de punt neemt de vorm van de schets aan. | Uit de proef met 13 letters en 5 uitgewerkte richtingen (`docs/typografie-proef.md`). | Voorstel |
| B-024 | 2026-09-29 | Geen animatiebibliotheek: canvas + SVG + CSS. Motion (B-010) vervalt. | Klein, beheersbaar; alles wat nodig is kan met native API's. | Vast |
| B-025 | 2026-09-29 | Contact via `mailto:info@denckh.nl` met ingevulde tekst en schets-samenvatting. | GitHub Pages kan niets verzenden; eerlijk en werkend zonder backend. | Voorstel |
| B-026 | 2026-09-29 | Projecten zonder toestemming: geen namen, logo's of beelden van derden; schematisch opgebouwd uit lijnen, als zodanig gemarkeerd. TRILUX 3D-demo niet getoond. | Volgt B-014/B-016. | Vast |
| B-027 | 2026-09-29 | Akkoord eigenaar: menie als tweede accent (B-022 wordt Vast). | Antwoord eigenaar. | Vast |
| B-028 | 2026-09-29 | Woordmerk: richting D (Fraunces + ck-ligatuur), **kleine letters `denckh.`**, **levend woordmerk** (punt neemt de vorm van de schets aan). B-023 wordt Vast; definitieve vectortekening volgt. | Eigenaar vroeg "wat is het beste?"; advies: kleine letters sluiten aan op `deegh` en de briefing, de ligatuur maakt het woordbeeld eigen, de levende punt vertelt het concept zonder uitleg. | Vast (op advies) |
| B-029 | 2026-09-29 | Rechten: **TRILUX niet** (IntuSens en 3D-demo zonder naam, beelden of link; demokoffer blijft alleen als anonieme, schematische case). **Loflijn wel** en **Deegh wel** (naam en link). | Antwoord eigenaar. Loflijn- en Deegh-beelden alleen na aanlevering; de live sites zijn vanuit de werkomgeving niet te screenshotten. | Vast |
| B-030 | 2026-09-29 | Bedrijfsgegevens gelijk aan deegh.nl, naam Denckh: Vlierweg 54, Houten · KvK 83176896 · btw NL003791952B15. In footer, privacy en structured data. | Antwoord eigenaar; gegevens staan ook publiek op deegh.nl. | Vast |
| B-031 | 2026-09-29 | Branch `creatief/het-punt` naar `main` gemerged: livegang. | Akkoord eigenaar ("ja zet live"). | Vast |
| B-032 | 2026-09-29 | Projectconstructies starten later: voortgang gemeten op het midden van het beeld (van 78% naar 22% van de schermhoogte), de eerste 8% blijft de lijn een lijn, 20% rust per vorm. | Feedback eigenaar: "de vormen starten iets te vroeg met aanpassen". | Vast |
| B-033 | 2026-09-29 | Stappen onder een project zijn knoppen (`aria-current="step"`). Klik = de lijn glijdt naar die stap; wie daarna een kwart van de scrollweg verder scrolt, krijgt de scrollstand terug. Geen scroll-kaping. | Feedback eigenaar: "leuk als je op de stappen ook zelf kan klikken". | Vast |
| B-034 | 2026-09-29 | Loflijn volgt een beurt in het spel (kaart met QR → lied → tijdlijn) en eindigt in een tijdlijn "van psalm tot praise", niet in een webshop. Eronder een speelbare voorbeeldbeurt met verzonnen jaartallen zonder liedtitels, zo gelabeld. | Feedback eigenaar: Loflijn leek op Deegh. Het spel zelf is het onderscheidende idee. Label voorkomt dat het als echte spelinhoud leest. | Vast (akkoord eigenaar, B-038) |
| B-035 | 2026-09-29 | Sectie "Ook gemaakt" met drie kleinere projecten, elk één vorm uit jouw lijn (nieuwe vormen `agenda` en `gebouw`). Autowasdag Sionkerk met naam en link; presentatie en 3D-werkdag zonder merknaam, beelden of link. | Eigenaar meldde deze projecten. TRILUX niet noemen (B-029). | Vast (akkoord eigenaar, B-038) |
| B-036 | 2026-09-29 | Het publieke caseregister noemt geen werkgever- of productnamen meer voor de 3D-werkdag; dossiers van privé-repo's bevatten alleen wat ook op de site staat. | Publieke repo (`CLAUDE.md`, regel 6). | Vast |
| B-037 | 2026-09-29 | Hero: na "Vertel" maakt het idee de eerste vorm concreet. Trefwoorden bepalen het soort ding (plannen, verkopen, spel, leren, inzicht, uitleg, samen, eten, techniek), het onderwerp komt uit de zin. De vorm krijgt concrete labels (knop "tijd 08:00–18:00", scherm met onderwerp, drie delen en mini-schetsen), een kader met titel en drie delen, en drie genummerde aantekeningen van Denckh. Opnieuw vertellen tekent de vorm opnieuw. Vaste regels, geen AI (`src/lib/ink/concept.ts`). | Feedback eigenaar: "nog mooier als die iets concreter zou zijn met het idee en de lijnen die hij daarna maakt". Kleurrollen blijven: oker = idee (zin, titel), rood = Denckh kijkt (aantekeningen), inkt = vorm. | Werkversie |
| B-038 | 2026-09-29 | `creatief/ronde-2` naar `main` gemerged: livegang. Autowasdag Sionkerk met naam en link; presentatie en 3D-werkdag anoniem; Loflijn-voorbeeldbeurt zoals gebouwd. | Eigenaar: "ja live", daarna "Sionkerk mag erbij", "presentatie 3D-werkdag anoniem is prima", "Loflijn is top". | Vast |
| B-039 | 2026-09-29 | Projectconstructies starten eerder (midden van het beeld van 92% naar 28% van de schermhoogte, 4% rust vooraf, 12% rust per vorm) en volgen de scroll met een korte, gladde vertraging (90 ms; na een stapkeuze 170 ms). Stappen reageren ook op aanwijzen (muis) en focus, niet alleen op klikken. | Feedback eigenaar op iPhone: "beginnen te laat en nog niet helemaal vloeiend"; "als je eroverheen gaat al verandert". | Vast |
| B-040 | 2026-09-29 | Deegh: de stap "een pizza" is vervangen door "een merk": de deegbol rijst en wordt de cirkel van het echte Deegh-logo. Nu klopt de reeks met "product → merk → webshop". | Eigenaar gaf het logo vrij en leverde het aan. | Vast |
| B-041 | 2026-09-29 | "Neem dit mee naar een gesprek": het contactblok en de mail bevatten een concreet voorstel uit het idee (eerste vorm, drie delen met aantekening, twee dingen die het zou kunnen worden, de vraag van Denckh), met de zin "Een begin, geen offerte." | Eigenaar: "mag mee naar de e-mail, maar dan moeten we wel heel concreet zijn wat het zou kunnen zijn". | Vast |
| B-042 | 2026-09-29 | Ideeënkaart zonder idee: geen "functie a / functie b" meer; Denckh noemt de punten naar de krabbel zelf ("waar je begon", "de kern", "waar je eindigde", "een zijsprong"). | Eigenaar: "functie a, functie b … niet echt heel creatief". | Vast |
| B-043 | 2026-09-29 | Echt portret in "Denckh is klein. Bewust." (`public/images/portret.jpg`): originele telefoonfoto van de eigenaar, uitsnede 4:5, kleur licht ingepast (iets lichter, minder oranje), twee andere gasten op de achtergrond onherkenbaar vervaagd. Geen naam erbij. Een eerder aangeleverde AI-bewerkte versie (met TRILUX-koffer en niet-bestaande verpakkingen) is bewust niet gebruikt. | De site belooft op die plek een echte foto; TRILUX niet tonen (B-029); geen verzonnen producten. Privacy van derden. | Vast |
| B-044 | 2026-09-29 | Positionering aangescherpt, zonder nieuwe claims. "Van idee naar vorm": je hoeft nog niet te weten wat het moet worden; Denckh zoekt de vorm die bij het idee past en maakt die. "Wat kan eruit komen?" heet nu "Wat kan een idee worden?", met "De vorm volgt uit wat het idee nodig heeft" en "bijvoorbeeld" boven de vormen (voorbeelden, geen dienstenlijst). Werkwijze: Vertel (idee, probleem of losse gedachte), Denckh (samen uitzoeken wat nodig is en welke vorm past), Vorm (zichtbaar, testbaar of bruikbaar; waar nodig verder uitgebouwd). "Klein, bewust": concreet waar Denckh graag aan werkt, afgeleid uit de cases (techniek uitleggen, een product een plek geven, iets regelen). Contact: één regel dat een half idee, vraag of probleem genoeg is. Demokoffer-aanleiding als vraag geformuleerd. Metabeschrijving mee aangepast. Geen "we": Denckh of "ik". | Review eigenaar (via ChatGPT): het belangrijkste onderscheid is dat je je oplossing nog niet hoeft te kennen. Tekst mag niet als dienstenmenu of bureau lezen. | Vast |
| B-045 | 2026-09-29 | Speelbare Loflijn-voorbeeldbeurt verwijderd (component, styles, tests). De Loflijn-case eindigt bij de constructie kaart → lied → tijdlijn, de uitleg en de link. Vervangt het tweede deel van B-034. | Review eigenaar: de beurt trekt de aandacht naar het spel in plaats van naar wat Denckh deed. De constructie is zelf al onderscheidend genoeg. | Vast |
| B-046 | 2026-09-29 | Interne logo-proef op `/logo-lab/` (noindex, niet gelinkt, niet in de sitemap): het huidige woordmerk plus zeven varianten met elk één ingreep aan de onderkant (naad d, snede e, inkeping n, open c, onderbreking k, voet h, spoor punt). Het woordmerk op de site is niet veranderd. | Eigenaar wil eerst zelf vergelijken. | Open (O-34) |
| B-047 | 2026-09-29 | `creatief/ronde-3` naar `main` gemerged (merge `5427b8e`): livegang ronde 3, inclusief `/logo-lab/` (noindex, niet gelinkt, niet in de sitemap). Woordmerk, OG-beeld (`/og.png`, okerkleurige krul) en favicon ongewijzigd. Deploy-run 36575797140 geslaagd. | Eigenaar: "Zet de huidige stand van creatief/ronde-3 live … /logo-lab/ mag mee online". | Vast |
| B-048 | 2026-09-29 | De okerkleurige krul uit het OG-beeld is het grafische merkelement van Denckh, als bron vastgelegd in `src/lib/ink/krul.ts` (vier bochten, eindigend in de punt). Merkhiërarchie: compact `denckh.` (header, klein), signatuur `denckh.` + krul (OG, social), krul los waar het iets toevoegt. Het woordmerk zelf verandert niet; de lettersnedes uit ronde 3 worden niet toegepast en staan in `/logo-lab/` onder "eerdere proeven". | Eigenaar: woordmerk is akkoord; de krul is sterk en mag merkelement worden. | Vast |
| B-049 | 2026-09-29 | Hero: de gestippelde hulplijn vóór het tekenen volgt nu de geometrie van de krul (aanloop vanaf de punt achter "Mooi", dan de vier bochten). Zelfde potloodgrijze stippeling, iets fijner; verdwijnt zodra je tekent. | Eigenaar: dezelfde lijn als in de identiteit is de eerste uitnodiging om te tekenen. | Vast |
| B-050 | 2026-09-29 | "Bekijk een voorbeeld" tekent één rustige, uit de hand getekende cirkel met de verhoudingen van de cirkel in het Deegh-logo (langzame variatie in de straal, geen hoogfrequente wiebel meer). De engine leest hem als elke eigen tekening ("rond en gesloten"). Het woord in het logo is bewust niet meegenomen: in één streek wordt dat een krabbel met kruisingen. | Eigenaar: geen wilde krabbel; het echte Deegh-logo als referentie; niet hardcoderen. | Vast |
| B-051 | 2026-09-29 | Ideeënkaart: een aangeraakt punt toont één korte vraag op de plek van het bijschrift ("de kern → Is dit waar het eigenlijk om draait?", enz.). Alleen zolang er nog geen idee is verteld; daarna zijn de punten de delen van het idee. | Proef uit de opdracht; blijft rustig (één regel, geen extra UI), dus toegepast. | Vast |
| B-052 | 2026-09-29 | Favicon blijft de punt. De krul-proef (`public/favicon-krul.svg`, vergelijking in `/logo-lab/` §5) is op 32 en 48 px herkenbaar, maar op 16 px een onduidelijk kronkeltje. | Regel uit de opdracht: alleen vervangen als de krul op 16 px rustig herkenbaar blijft. | Vast |
| B-053 | 2026-09-29 | Deegh: logo en merk zijn eigen werk van de eigenaar (destijds samen met zijn broers); Denckh presenteert "deegbol → merk → webshop" als eigen werk. Demokoffer: de eigenaar was initiatiefnemer en formuleerde zelf de ontwerpvraag ("een demokoffer vol sensortechniek moest ook zonder uitgebreide uitleg snel te begrijpen en te gebruiken zijn"). Beide dossiers bijgewerkt; sitetekst ongewijzigd. | Bevestiging eigenaar 2026-09-29. Sluit O-35 en het open punt "aanleiding" in het koffer-dossier. | Vast |
| B-054 | 2026-09-29 | "Bekijk een voorbeeld" is een vaste reeks van zes tekeningen (`src/lib/ink/examples.ts`); na elke lezing verschijnt rustig "nog een voorbeeld", na de laatste begint de reeks opnieuw. De punt tekent elk voorbeeld echt; daarna lopen ze door dezelfde engine als een eigen tekening (geen uitzonderingen per voorbeeld). Uitkomst op desktop, 390 en 320 px: cirkel → draaiknop, lijn → regelaar, rechthoek → scherm, golf → verloop, krullen → kaart, Deegh → kaart. Op mobiel beginnen voorbeelden bovenaan het tekenvlak en loopt de lijn in het verlengde van de beweging vanaf de punt (`orient: "entry"`); dat is plaatsing, geen analyse. | Eigenaar: laten ontdekken dat één handeling tot heel verschillende vormen leidt. Vóór deze ronde bestond er maar één voorbeeld (de cirkel). Zonder de mobiele plaatsing werden lijn en golf op mobiel een route en de rechthoek een draaiknop, doordat de verticale aanloop vanaf de punt meetelt. | Vast |
| B-055 | 2026-09-29 | Deegh-voorbeeld: proef A (alleen de cirkel van het logo), B (d + cirkel) en C ("deegh" als doorlopend handschrift in de cirkel), alle drie gemeten tegen `public/images/deegh-logo.jpg`. Gekozen: C. A verwijst nergens naar en B leest als een losse haak; bovendien maakt de engine van A en B een draaiknop, net als de gewone cirkel. C is herkenbaar en de engine leest hem zelf als kaart ("gesloten · 5–7 kruisingen · rond"). Eén doorlopende streek, omdat een bezoeker ook maar één streek kan zetten. | Eigenaar: rustig, herkenbaar, geen hardcoded uitkomst. | Vast |
| B-056 | 2026-09-29 | Mobiele hulplijn compacter: tekenvlak op mobiel `minmax(240px, 38svh)` (was 46svh), kleinere krul hoog in het vlak, aanloop die direct na de punt afbuigt. Op 390 px: hulplijn 380 px hoog (was 478), "begin met een punt" 95 px hoger. Desktop ongewijzigd. De aanloop kruist op mobiel nog steeds de intro (de punt staat boven de tekst en de krul begint linksonder); de krul zelf overlapt de intro niet. | Eigenaar: aanloop te lang en te verticaal. | Vast |
| B-057 | 2026-09-29 | Hero-intro: "Denckh is een kleine conceptstudio. Weet je nog niet wat het moet worden? Ook goed. Ik denk mee en maak het concreet." De oude intro was nooit vervangen: de goedgekeurde tekst van ronde 3 (B-044) stond vanaf het begin in "Van idee naar vorm", niet in de hero. Hier als vraag geformuleerd, zodat hij de zin in "Van idee naar vorm" niet letterlijk herhaalt. | Eigenaar wilde de positionering ook in de hero. | Vast |
| B-058 | 2026-09-29 | Portret (`public/images/portret.jpg`): de vervaagde gasten rechts achter de schouder zijn verwijderd met een lokale retouche. Het gebied (±8.300 px, x 451–590, y 338–430 van 600 × 750) is gevuld met de achtergrond direct erboven uit dezelfde kolommen van de originele foto (muur, donkere spleet, houten paal), dus met de eigen korrel en belichting. Het masker stopt aan de trui en aan de jasrand van de persoon in het zwart. Buiten het gebied gemiddeld 0,56/255 verschil (alleen JPEG), op Martijn 1 randpixel. Uitsnede, formaat (600 × 750), kleurbewerking en CSS ongewijzigd. Omdat de twee hoofden elkaar overlappen, zijn beide weg: alleen de voorste weghalen zou een half gezicht achterlaten. | Eigenaar: persoon achter de schouder weg, lokaal, zonder AI en zonder Martijn aan te raken. | Vast |
| B-059 | 2026-09-29 | Merkbestanden in `public/brand/` (ook `denckh-brand-assets.zip`), gemaakt met `npm run brand` (`scripts/build-brand.mjs`) uit exact dezelfde bronnen als de site: woordmerk `src/components/wordmarkPaths.ts`, krul `src/lib/ink/krul.ts`, kleuren uit `globals.css`. Varianten: compact, signatuur (verhouding als in `/og.png`: woordmerk × 0,4472, krul op 830/120), lichte signatuur, krul los. Per variant SVG-master, vector-PDF, transparante PNG (3000 px breed; krul 2000 px hoog), web-PNG, en waar gevraagd een versie op licht of donker. Controle: exacte kleuren, echte transparantie, gelijke marges rondom, signatuur tegen `og.png` gemiddeld 0,3/255 verschil. | Eigenaar wil de logo's als gewone bestanden voor social, Office, Canva en drukwerk. Logo zelf niet gewijzigd. | Vast |
| B-060 | 2026-09-29 | Deegh-stap "een merk": het echte logobestand (`public/images/deegh-logo.png`, 626 × 640, transparant, uit het eigen Deegh-thema) in plaats van de wazige screenshot-uitsnede (`deegh-logo.jpg`, verwijderd). Niet meer in een cirkel geknipt, zodat de spetterrand blijft; de inktlijn wordt de cirkel en verdwijnt dan (`hideLine`), zodat er geen zwarte rand om het logo staat. | Eigenaar: "mijn logo moet of er goed op of anders niet." | Vast |
| B-061 | 2026-09-29 | Merkoverzicht als A4-PDF (`public/brand/denckh-merkoverzicht.pdf`, ook in de zip), gebouwd door `npm run brand` (`scripts/brand-guide.mjs`) uit de echte logobestanden, de lettertypes van de site en de kleurtokens. Gecorrigeerd ten opzichte van een eerder aangeleverd overzicht: logo's niet vervormd of afgesneden, signatuur in de vaste verhouding, alles in Fraunces en Manrope, tagline als `van idee naar vorm`, geen getypt woordmerk, echt deelbeeld, Nacht-inkt toegevoegd, krullijn = Idee en eindpunt = Oker, en waar de bestanden staan. | Eigenaar vroeg een gecorrigeerde versie. | Vast |
| B-062 | 2026-09-29 | Prijzen van de eigenaar op de site, exclusief btw: Even Denckh €45 (60 minuten, verrekend bij een opdracht vanaf €295), Eerste vorm vanaf €125, Echt maken vanaf €295; per vorm: Iets zonder naam €95, Visual €125, Presentatie €195, Prototype, Spel en Website €295, Interactieve uitleg/tool €395, Interactieve demo en Website Plus €495, Webshop €595, Uitgebreidere webshop €795; los vervolgwerk €45 per uur, alleen na overleg. Eén bron: `src/lib/prices.ts` (homepage, `/prijzen/` en tests lezen daaruit). Teksten letterlijk uit de briefing. | Prijsbriefing eigenaar, 2026-09-29. Eén bron voorkomt dat homepage en prijspagina uit elkaar lopen. | Vast |
| B-063 | 2026-09-29 | Homepageblok *Wat kost zoiets?* staat na *Zo werkt het* (de werkwijze eindigt bij "vorm", de prijs volgt daaruit) en vóór *klein, bewust*. Vorm: geen prijskaarten maar één lijn (`PriceLine`): punt → schets → vorm, getekend door te scrollen (alleen lezen), pen opgetild bij elke vorm, een kleine lus vóór de laatste halte zoals in de krul. Met reduced motion staat alles er meteen. | Briefing: geen standaard pricing cards; de lijn van klein denken naar gemaakt. Zelfde grammatica als de rest van de site. | Vast |
| B-064 | 2026-09-29 | `/prijzen/`: de elf vormen als lijst met één morphende lijn (`FormPrices`) die de vorm aanneemt van de rij waar je leest (scroll) of met de muis op wijst; een punt op een okerrail loopt mee. Op mobiel staat de figuur als smalle vaste balk bovenaan. Nieuwe vormen in `shapes.ts`: `websitePlus` en `webshopPlus`. Iets zonder naam gebruikt de lijn van de bezoeker zelf. Tik op een telefoon zet geen rij vast (alleen muis). | Geen gewone prijstabel; de vorm maakt zichtbaar wat je voor de prijs krijgt. Figuur is `aria-hidden`, alle informatie staat in de lijst. | Vast |
| B-065 | 2026-09-29 | *Prijzen* niet in de kopnavigatie, wel in de footer, de sitemap en via het homepageblok. | Een vierde item laat de kop op 390 px teruglopen naar twee regels; briefing: alleen toevoegen als het de navigatie niet slechter maakt. | Vast |
| B-066 | 2026-09-29 | Prijslijst-PDF: blok *Liever alles even op een rij?* / *Download de prijslijst* staat klaar, maar verschijnt alleen als `public/downloads/denckh-prijslijst.pdf` bij de build bestaat. Domeinregel ("eerste jaar inbegrepen, tot maximaal €20 excl. btw") alleen bij Website, Website Plus en Webshop, zoals in de briefing. | Nooit een kapotte link; niets toezeggen wat niet gevraagd is. | Vast |
| B-067 | 2026-09-29 | Prijslijst-PDF als merkversie, gebouwd door `npm run prijslijst` (`scripts/price-list.mjs`): bedragen en teksten uit `src/lib/prices.ts` (dus gelijk aan de site, alle 11 vormen), echt woordmerk en krul uit `public/brand/`, Fraunces en Manrope ingesloten, de prijslijn punt → schets → vorm zoals op de homepage, geen kaarten. Intro en de zes stappen van *Zo werkt het* letterlijk uit de prijslijst van de eigenaar (v2). Kop: *Wat kan een idee kosten?* (titel van `/prijzen/`). Het script stopt als een pagina overloopt of een bedrag ontbreekt; `scripts/prijslijst.bron.txt` bewaart de vingerafdruk van `prices.ts` voor de test. | De aangeleverde PDF (ChatGPT, ReportLab) had een getypt woordmerk in Times, Helvetica/Times, prijskaarten, een andere krul, miste Website Plus en Uitgebreidere webshop, en droeg een ondertekend Content Credentials-label "gemaakt door ChatGPT". Eigenaar koos de merkversie. | Vast |
| B-068 | 2026-09-29 | Mobiel "tekst door elkaar" (melding eigenaar, iPhone): (1) hero: op een smal scherm schuift het tekstpaneel omlaag zodra de tekening met aantekeningen buiten het tekenvlak komt (`PuntStage`, gemeten met `getBBox`), zodat lijn, rode meetlijn en tekst niet meer over elkaar vallen; (2) de intro ligt boven de lijn (z-index), dus letters blijven leesbaar als je lijn erdoorheen loopt; (3) Deegh-eindbeeld: menu-items achter elkaar op gemeten woordbreedte, letter krimpt mee op een smal scherm (was: vaste afstanden met minimaal 8 px letter, waardoor woorden over elkaar vielen); (4) 320 px: invulveld, knop en aantekeningen vielen 26 px buiten beeld (raster groeide mee met het invulveld), nu `minmax(0, 1fr)`. | Gemeld door de eigenaar met schermafdrukken van de live site; nagebootst op 393 en 320 px. | Vast |
| B-069 | 2026-09-29 | (1) `/prijzen/`: naam en prijs per vorm in twee vaste kolommen; bij een lange naam ("Interactieve uitleg / tool", "Uitgebreidere webshop") loopt de naam door op een tweede regel en blijft de prijs rechts op de eerste regel. (2) Privacyverklaring aangevuld met wat de AVG vraagt zodra er een mail binnenkomt: doel (reageren, opdracht voorbereiden), niet delen behalve de mailprovider, bewaren (zolang nodig; bij een opdracht de wettelijke zeven jaar voor de administratie), rechten (inzage, aanpassen, verwijderen), klachtrecht bij de Autoriteit Persoonsgegevens, wat er in de mail meegaat, IP-adres bij de host, en een datum. Geen nieuwe verwerking door de prijzen of de PDF. | Eigenaar: "395 en 795 niet goed uitgelijnd" en "moet privacy nog aangepast worden?". | Vast |
| B-070 | 2026-09-29 | `/prijzen/`: vormen gegroepeerd in *Zichtbaar maken*, *Digitaal maken* en *Online zetten* (groepsnaam boven de eerste vorm, `FORM_GROUPS` in `prices.ts`); mobiel compacter (kleinere vaste figuur, rijen en letters). "Website Plus" heet "Uitgebreidere website". Teksten aangescherpt: Iets zonder naam (gesprek, zelf uitzoeken, concrete richting) versus Even Denckh (60 minuten samen denken); Website op basis van aangeleverde inhoud; Webshop op een bestaand platform, geen complexe maatwerk e-commerce; domeinregel met "Hosting is niet inbegrepen". Prijzen ongewijzigd; prijslijst-PDF opnieuw gemaakt. | Eigenaar, 2026-09-29. | Vast |
| B-071 | 2026-09-30 | Geen uurtarief meer op de site en in de prijslijst-PDF. In plaats van "Los vervolgwerk: €45 per uur" staat *Iets extra nodig? Werk buiten de afgesproken scope doe ik alleen na overleg. Je hoort vooraf wat het extra kost.* Even Denckh (€45 voor 60 minuten) en de vanafprijzen blijven zichtbaar. Het uurtarief blijft de interne rekenbasis voor meerwerk in offertes. | Eigenaar: Denckh verkoopt een resultaat met een vaste prijs, geen uren; een zichtbaar uurtarief nodigt uit tot narekenen en positioneert als freelancer per uur. | Vast |
| B-072 | 2026-09-30 | Eén principe op `/prijzen/`: eerst kennismaken, pas als we afspreken dat ik voor je aan het werk ga, kost het iets. Onder Kennismaken: *Kost niets. Wil je daarna echt samen aan de slag, dan spreken we dat eerst af.* Iets zonder naam: *We bespreken je idee. Daarna zoek ik het zelf verder uit en werk ik een concrete richting of voorstel voor je uit. Vooraf spreken we af wat je krijgt.* Geen administratieve taal over facturen. | Eigenaar: onduidelijk wanneer gratis kennismaken overgaat in betaald werk. | Vast |
| B-073 | 2026-09-30 | (1) Btw: bij de prijskop op `/prijzen/` en in de prijslijst-PDF staat nu *Alle bedragen zijn vanafprijzen, exclusief btw. Voor particuliere opdrachten vermeld ik vooraf ook de prijs inclusief btw.* Denckh wordt niet beperkt tot ondernemers. (2) Domeinregel ook bij Uitgebreidere webshop: elke website en webshop heeft hem. Daarna geen extra prijsteksten meer. | Eigenaar: de site trekt ook particulieren, verenigingen en stichtingen; een prijs die later hoger blijkt, moet niet verrassen. Een uitgebreidere webshop zonder domein dat de kleinere wel heeft, is vreemd. | Vast |

---

## Geverifieerde feiten

| Feit | Bron | Gecontroleerd |
|---|---|---|
| Er bestaat een Denckh-logo (PNG 270×117): donker woordmerk "Denckh" met een okerpunt en de tagline eronder. Gemeten kleuren: achtergrond `#FAF8F3`, tekst `#363434`, punt `#C8A477`. | Ander project van de eigenaar | 2026-09-29 |
| `intusens-demokoffer.nl` wijst naar GitHub Pages. De site is de publieke repo `MartijndBesten/intusens-demokoffer` (commit `d8817c7`): statische site, NL/EN/FR, offline-geschikt, `noindex`. | DNS + repo | 2026-09-29 |
| `deegh.nl` wijst naar een Cloud86-server. De broncode van de nieuwe Deegh-webshop (WordPress/WooCommerce, eigen thema en plugin) staat in een privé-repo. | DNS + repo | 2026-09-29 |
| `loflijn.nl` wijst naar een Shopify-IP. Er is geen repo voor. | DNS | 2026-09-29 |
| De werkomgeving blokkeert `deegh.nl`, `intusens-demokoffer.nl`, `loflijn.nl`, `denckh.nl`, `cloud86.io` en `support.cloud86.io`. | curl/WebFetch | 2026-09-29 |
| `deegh.nl`, `intusens-demokoffer.nl` en `loflijn.nl` zijn daarna live bekeken via een geautoriseerde browsersessie. De inhoudelijke bevindingen zijn verwerkt in de drie casedossiers; geen externe beelden zijn gekopieerd. | Live sites + publieke bron waar beschikbaar | 2026-09-29 |
| Repo hernoemd naar `MartijndBesten/denckh`; oude naam stuurt door. | GitHub | 2026-09-29 |
| `denckh.nl` wijst naar GitHub Pages (185.199.108–111.153). Live inhoud niet bekeken: domein geblokkeerd in de werkomgeving. | DNS | 2026-09-29 |
| Workflow `deploy-pages.yml` deployt elke push naar `main`; laatste run (2f9a7a2) geslaagd. | GitHub Actions | 2026-09-29 |
| Mail via Cloud86/Plesk, mailbox `info@denckh.nl`. | Eigenaar | 2026-09-29 |
| Op live `main` staat letterlijk `\n` linksboven op de homepage (typefout in `src/app/page.tsx`); op de branch opgelost. | Code | 2026-09-29 |

---

## Open beslissingen (eigenaar)

| # | Onderwerp | Voorstel |
|---|---|---|
| O-21 | **Definitieve woordmerktekening** (B-028): de ligatuur is nu opgebouwd uit fontcontouren plus een balk. | Laten tekenen/verfijnen voor print en groot formaat. |
| O-23 | **Echte AI:** publiek, alleen demo, of niet? Model, endpoint, budget. | Eerst niet publiek; besluit na `docs/ai-onderzoek.md`. |
| O-24 | **Contact:** mailto volstaat, of een echte verzendroute (serverless)? | Mailto voor nu. |
| O-25 | **Beelden Loflijn en Deegh** (naam en link mogen, B-029). Deegh-logo is binnen (B-040, eigen werk B-053, echt bestand B-060). | Scherpere logoversie (SVG) en screenshots of foto's aanleveren; de schematische constructie eindigt dan in het echte beeld. |
| O-30 | **Handelsnaam Denckh bij KvK.** De site noemt KvK 83176896 (de inschrijving van Deegh). | Controleren dat Denckh als handelsnaam bij deze inschrijving staat; zo niet, laten toevoegen bij KvK. |
| O-26 | **Deegh-beelden:** welke foto's zijn echt en van jou? | Pas daarna echte beelden in de Deegh-case. |
| O-27 | **Naam** in "klein, bewust" (portret staat er sinds B-043). | Naam tonen, of bewust weglaten. |
| O-28 | **JS-gewicht:** 192 KB gzip, waarvan ca. 150 KB Next.js-runtime. Accepteren, of later naar Astro? | Accepteren; herzien als de site groeit. |
| O-34 | **Logo-lab** (`denckh.nl/logo-lab/`): nu merkproefpagina (B-048). Woordmerk blijft; lettersnedes staan als archief onder "eerdere proeven". | Pagina weghalen of houden zodra de krul-toepassingen vaststaan. |
| O-36 | **GitHub Pages meldt `http://denckh.nl/` als omgeving-URL.** Mogelijk staat "Enforce HTTPS" uit. | Eigenaar controleert in GitHub → Settings → Pages; niet door Claude aangepast (buiten scope). |
| O-37 | **Consumentenprijzen juridisch controleren.** Tekst over particulieren staat erbij (B-073). Voor prijzen aan consumenten gelden strengere regels dan voor B2B. | Vóór actieve verkoop aan consumenten laten controleren door een deskundige hoe de prijzen op de site gepresenteerd moeten worden; niet door Claude laten invullen. |
| O-02 | Repo is publiek. | Op privé zetten kan alleen met betaald GitHub-plan voor Pages; anders bewust publiek laten en niets vertrouwelijks opnemen. |

Afgehandeld: O-01 (repo hernoemd naar `denckh`), O-08 (live sites via geautoriseerde browsersessie bekeken, zie
cases), O-14 (domein actief op GitHub Pages), O-31/O-32/O-33 (B-038), O-35 (B-053), O-38 (B-073), O-39 (B-067).

---

## Volgende stappen

0. Live controle van `/prijzen/` en het prijsblok op `denckh.nl` en een echte iPhone; besluiten O-37 (btw) en O-38.
0. Live controle van ronde 2 op `denckh.nl` en een echte iPhone.
1. Live controle op `denckh.nl` en op een echte iPhone (vanuit de werkomgeving niet bereikbaar).
2. Beslissen over O-23 (AI) en O-24 (contact).
3. Definitieve woordmerktekening en favicon/OG-beelden in de nieuwe stijl.
4. Echte beelden per project zodra rechten er zijn; de schematische constructie eindigt dan in het echte beeld.
5. AI-laag alleen na besluit O-23.

---

## Geschiedenis

## Tijdelijke publieke landingpage — 29 september 2026

- De volledige Denckh-site blijft in de Git-geschiedenis bewaard; de homepage is tijdelijk vervangen door een compacte coming-soonpagina.
- Richting: `denckh.` / `van idee naar vorm`, warm crème/antraciet/oker, met een subtiele animatie van idee naar vorm.
- Tijdelijke homepagebestanden: `src/app/page.tsx` en `src/app/coming-soon.module.css`.
- GitHub Pages deployment is voorbereid via `.github/workflows/deploy-pages.yml` en bouwt de bestaande Next.js static export uit `out/`.
- Productie is nog niet volledig geactiveerd: GitHub Pages moet in repository Settings > Pages op GitHub Actions worden gezet en `denckh.nl` moet daarna als custom domain worden ingesteld. DNS bij Cloud86 moet vervolgens naar GitHub Pages wijzen.
- Geen DNS-, Cloud86- of e-mailinstellingen zijn door deze wijziging aangepast.


### Update 29 september 2026 — uitgebreidere preview
- Op verzoek is de tijdelijke one-screen coming-soonpagina weer vervangen door de reeds gebouwde, uitgebreidere Denckh-homepage.
- De homepage toont nu de positionering, idee→vorm-uitleg, bestaande projectvoorbeelden, mogelijke uitkomsten, werkwijze en het kleinschalige karakter van Denckh.
- Bovenaan staat bewust een smalle melding dat dit een eerste versie is en dat de site nog vorm krijgt.
- Het bestaande contactformulier is nog niet gekoppeld aan een verzendroute en daarom bewust niet publiek als werkend formulier getoond; de contactsectie meldt dat de directe contactmogelijkheid volgt.
- De eerdere coming-soonstylesheet blijft voorlopig in de repo als ontwerpvariant, maar wordt niet meer door de homepage gebruikt.
