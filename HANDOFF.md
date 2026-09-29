# HANDOFF

Overdrachtsdocument voor de Denckh-website. Hier staan de actuele stand, alle belangrijke technische en creatieve
beslissingen, open punten en de volgende stappen. **Bijwerken aan het eind van elke werksessie.**

- Laatst bijgewerkt: 2026-09-29
- Live (`main`): "begin met een punt" (B-031) plus ronde 2 (gemerged uit `creatief/ronde-2`, B-038)

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

## Repositorygegevens

| Onderwerp | Waarde |
|---|---|
| Remote | `https://github.com/MartijndBesten/denckh` |
| Zichtbaarheid | Publiek |
| Hoofdbranch | `main` (live) |
| Laatste werkbranch | `creatief/ronde-2` (gemerged, B-038) |

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
| O-25 | **Beelden Loflijn en Deegh** (naam en link mogen, B-029). Deegh-logo is binnen (B-040). | Scherpere logoversie (SVG) en screenshots of foto's aanleveren; de schematische constructie eindigt dan in het echte beeld. |
| O-30 | **Handelsnaam Denckh bij KvK.** De site noemt KvK 83176896 (de inschrijving van Deegh). | Controleren dat Denckh als handelsnaam bij deze inschrijving staat; zo niet, laten toevoegen bij KvK. |
| O-26 | **Deegh-beelden:** welke foto's zijn echt en van jou? | Pas daarna echte beelden in de Deegh-case. |
| O-27 | **Naam** in "klein, bewust" (portret staat er sinds B-043). | Naam tonen, of bewust weglaten. |
| O-28 | **JS-gewicht:** 192 KB gzip, waarvan ca. 150 KB Next.js-runtime. Accepteren, of later naar Astro? | Accepteren; herzien als de site groeit. |
| O-02 | Repo is publiek. | Op privé zetten kan alleen met betaald GitHub-plan voor Pages; anders bewust publiek laten en niets vertrouwelijks opnemen. |

Afgehandeld: O-01 (repo hernoemd naar `denckh`), O-08 (live sites via geautoriseerde browsersessie bekeken, zie
cases), O-14 (domein actief op GitHub Pages), O-31/O-32/O-33 (B-038).

---

## Volgende stappen

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
