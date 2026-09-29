# HANDOFF

Overdrachtsdocument voor de Denckh-website. Hier staan de actuele stand, alle belangrijke technische en creatieve
beslissingen, open punten en de volgende stappen. **Bijwerken aan het eind van elke werksessie.**

- Laatst bijgewerkt: 2026-09-29
- Fase: **4–7 (eerste design system, homepage en eerste case): basis gebouwd, technische eindcontrole open**
- Volgende fase: lokale preview en volledige QA, daarna de resterende case- en contactstappen

---

## Huidige stand

- Fase 0 (projectbasis) is gereed.
- Fase 1 (onderzoek) is uitgevoerd, **met een belangrijke beperking:** de live sites (`deegh.nl`,
  `intusens-demokoffer.nl`, `loflijn.nl`), `denckh.nl` en `cloud86.io` waren vanuit de werkomgeving **niet
  bereikbaar** (netwerkbeleid). Het onderzoek steunt op de broncode-repositories, DNS en zoekresultaten. Zie
  `docs/cases/`.
- Fase 2 en 3 staan als voorstel in:
  - [`docs/creative-direction.md`](docs/creative-direction.md): concept *Het punt*, bewegingstaal, kleur,
    typografie, toon;
  - [`docs/structuur-en-content.md`](docs/structuur-en-content.md): sitemap, homepage-opbouw met concepttekst,
    case-template, formulier;
  - [`docs/architectuur.md`](docs/architectuur.md): stack, hosting- en deployanalyse, formulier, privacy, SEO,
    performance, toegankelijkheid, tests.
- De eerste websitecode staat in `src/`: homepage, Deegh-case, privacy- en 404-pagina, semantische navigatie,
  interactieve punt, reduced-motion-weergave, metadata, sitemap, robots en favicon. Er is bewust geen productie-deploy
  en niets aan hosting of DNS gewijzigd.
- De contact-UI valideert lokaal, maar verstuurt nog niets. Dit is expliciet zichtbaar voor de bezoeker; een PHP/mailroute
  wordt pas toegevoegd als mailbox, privacygegevens en spammaatregelen zijn bevestigd.
- De projectschetsen zijn eigen, abstracte diagrammen. Er zijn geen Deegh-, Loflijn-, TRILUX- of LiveLink-beelden of
  logo's gekopieerd.
- Lokale QA op 2026-09-29: `npm run lint`, `npm run typecheck` en `npm run build` slagen. De homepage is visueel
  gecontroleerd op 390 px mobiel, 768 px tablet en 1440 px desktop zonder horizontale overflow. De hero-punt werkt
  met het toetsenbord, de Deegh-link opent de juiste case en het formulier valideert zonder iets te verzenden. Tijdens
  deze controles waren er geen console-errors.
- Ronde 2: de hero is vervangen door een canvas-prototype met snelheidsafhankelijke lijn, een kort
  interpretatiemoment en drie lokale mock-richtingen. Er is geen AI, geen API en geen tekening of tekst die de browser
  verlaat. Zie `docs/typografie-proef.md` voor de nieuwe woordmerkverkenning.

## Repositorygegevens

| Onderwerp | Waarde |
|---|---|
| Remote | `https://github.com/MartijndBesten/Denckh.` |
| Zichtbaarheid | Publiek (stand 2026-09-29) |
| Hoofdbranch | `main` |

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

---

## Geverifieerde feiten

Alleen wat daadwerkelijk is gecontroleerd, met datum.

| Feit | Bron | Gecontroleerd |
|---|---|---|
| Repo `MartijndBesten/Denckh.` bestaat en is publiek. | GitHub | 2026-09-28 |
| Er bestaat een Denckh-logo (PNG 270×117): donker woordmerk "Denckh" met een okerpunt en de tagline eronder. Gemeten kleuren: achtergrond `#FAF8F3`, tekst `#363434`, punt `#C8A477`. | Ander project van de eigenaar | 2026-09-29 |
| `intusens-demokoffer.nl` wijst naar GitHub Pages. De site is de publieke repo `MartijndBesten/intusens-demokoffer` (commit `d8817c7`): statische site, NL/EN/FR, offline-geschikt, `noindex`. | DNS + repo | 2026-09-29 |
| `deegh.nl` wijst naar een Cloud86-server. De broncode van de nieuwe Deegh-webshop (WordPress/WooCommerce, eigen thema en plugin) staat in een privé-repo. | DNS + repo | 2026-09-29 |
| `loflijn.nl` wijst naar een Shopify-IP. Er is geen repo voor. | DNS | 2026-09-29 |
| `denckh.nl` heeft geen A-record (geen website actief). Of het domein geregistreerd is, kon niet worden vastgesteld. | DNS | 2026-09-29 |
| De werkomgeving blokkeert `deegh.nl`, `intusens-demokoffer.nl`, `loflijn.nl`, `denckh.nl`, `cloud86.io` en `support.cloud86.io`. | curl/WebFetch | 2026-09-29 |
| `deegh.nl`, `intusens-demokoffer.nl` en `loflijn.nl` zijn daarna live bekeken via een geautoriseerde browsersessie. De inhoudelijke bevindingen zijn verwerkt in de drie casedossiers; geen externe beelden zijn gekopieerd. | Live sites + publieke bron waar beschikbaar | 2026-09-29 |

---

## Open punten

| # | Onderwerp | Toelichting | Voorstel | Wie |
|---|---|---|---|---|
| O-01 | **Reponaam eindigt op een punt** (`Denckh.`) | Geeft technisch gedoe: URL's, `Denckh..git`, Windows verwijdert een punt aan het eind van mapnamen, CI/hosting. | Hernoemen naar `denckh`. GitHub stuurt de oude URL door. | Eigenaar |
| O-02 | **Repo is publiek** | Onderzoeksdossiers en concepten zijn openbaar. Vertrouwelijke details zijn daarom bewust weggelaten. | Op privé zetten tot de livegang. | Eigenaar |
| O-03 | **Akkoord op het voorstel** | B-008 t/m B-014. | Akkoord geven of bijsturen, dan start fase 4. | Eigenaar |
| O-04 | **Logo** | Hoofdletter "Denckh." (bestaand PNG) of kleine letters "denckh." (briefing)? Een vectorbestand ontbreekt. | Kleine letters, opnieuw gezet in de displayletter met een losse SVG-punt. Bevestigen in de typografieproef (fase 4). | Eigenaar |
| O-05 | **Schrijfwijze in lopende tekst** | "Denckh" of "Denckh."? | In lopende tekst zonder punt: "Denckh". De punt alleen in het logo. | Eigenaar |
| O-06 | **TRILUX 3D-demo** | Staat niet in de eerste portfolio. | Niet tonen. Later heroverwegen, met dezelfde rechtenvraag als bij O-09. | – |
| O-07 | **Lokale werkmap** | Zie hieronder. | `C:\Denckh` | Eigenaar |
| O-08 | **Netwerktoegang werkomgeving** | Live sites konden niet worden bekeken of gescreenshot. | Voeg de domeinen toe aan de toegestane domeinen van de omgeving (of kies een ruimer toegangsniveau), of lever screenshots aan. | Eigenaar |
| O-09 | **IntuSens: rol en toestemming** | Merk en product van TRILUX; de site staat bewust op `noindex`. | Schriftelijke toestemming voor case, beelden, naam en link. Rol en opdrachtgever bevestigen. Zie `docs/cases/intusens-demokoffer.md`. | Eigenaar |
| O-10 | **Deegh: live stand, merkrol, beelden** | Is 2.0 live? Wie ontwierp logo en verpakking? Enkele beelden lijken gegenereerd of een mockup. | Bevestigen per punt. Alleen echte beelden gebruiken. Zie `docs/cases/deegh.md`. | Eigenaar |
| O-11 | **Loflijn: alles** | Nog niets geverifieerd. | Toegang tot de site of screenshots plus toelichting. Zie `docs/cases/loflijn.md`. | Eigenaar |
| O-12 | **De maker op de site** | Naam tonen? Echte foto beschikbaar? Deegh noemen in "klein, bewust"? | Naam: ja. Foto: pas als er een echte is. Deegh: ja, één zin. | Eigenaar |
| O-13 | **Bedrijfsgegevens** | KvK-nummer, adres, btw-id, e-mailadres en reactietermijn zijn nodig voor footer, privacy en formulier. | Aanleveren vóór fase 9. | Eigenaar |
| O-14 | **Domein en hosting** | Is `denckh.nl` geregistreerd en waar? Past een extra website in het huidige Cloud86-pakket? | Controleren in de registrar en in Plesk. Niets wijzigen (B-003). | Eigenaar |

### Lokaal clonen (O-07)

In PowerShell of de opdrachtprompt:

```powershell
git clone https://github.com/MartijndBesten/Denckh. C:\Denckh
cd C:\Denckh
git status          # verwacht: On branch main, up to date with 'origin/main'
```

Wordt de repo hernoemd (O-01)? Pas dan de remote aan:

```powershell
git remote set-url origin https://github.com/MartijndBesten/denckh.git
```

---

## Volgende stappen

1. **Eigenaar:** akkoord of bijsturing op B-008 t/m B-014 (O-03), plus O-01 en O-02.
2. **Eigenaar:** netwerktoegang of screenshots (O-08), zodat de live sites alsnog bekeken kunnen worden.
3. **Lokale technische controle:** afgeronde production build, visuele controles op 390 px, tablet en desktop,
   toetsenbord, reduced motion en console.
4. **Fase 8–10:** casepagina's pas uitbreiden met goedgekeurde beelden en namen; werkende contactroute, juridische
   gegevens en privacytekst alleen na bevestiging.
5. Hosting, DNS en livegang blijven buiten scope tot expliciet akkoord (B-003).


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
