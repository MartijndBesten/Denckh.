# Technische architectuur en deployment

Status: **bijgewerkt 2026-09-29** naar de actuele productiesituatie. Deze ronde heeft niets aan productie,
DNS, Cloud86, Plesk of mail gewijzigd.

## 1. Actuele situatie

| Onderdeel | Stand | Bron |
|---|---|---|
| Repository | `MartijndBesten/denckh` (hernoemd; de oude naam `Denckh.` stuurt door) | GitHub, 2026-09-29 |
| Website | **GitHub Pages** onder `denckh.nl` | Eigenaar; DNS wijst naar GitHub Pages (185.199.108–111.153), gecontroleerd 2026-09-29 |
| Deploy | Workflow `.github/workflows/deploy-pages.yml`: **elke push naar `main` gaat live** | Repo |
| Mail | Cloud86 / Plesk, mailbox `info@denckh.nl`, webmail via Plesk | Eigenaar |
| Build | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, **statische export** (`out/`) | Repo |

**Werkafspraak:** omdat `main` direct live gaat, gebeurt ontwerp- en bouwwerk op een aparte branch. Mergen naar `main`
is een bewuste livegang en gebeurt alleen na akkoord van de eigenaar.

## 2. Stack

| Onderdeel | Keuze |
|---|---|
| Framework | Next.js 16, statische export, `trailingSlash: true` |
| Styling | Eén globale stylesheet met tokens (`src/app/globals.css`); Tailwind 4 is aanwezig, maar wordt nauwelijks gebruikt |
| Interactie | Eigen code, geen animatiebibliotheek: canvas (live tekenen), SVG (analyse, vormen), CSS (overgangen) |
| Fonts | Fraunces (display, eigen instantie: SOFT 100, WONK 0, opsz 72–144, wght 400–700) en Manrope, **zelf gehost en gesubset** (samen 50 KB) |
| Tests | `npm run test:e2e` (Playwright, 33 controles), `lint`, `typecheck` |

## 3. Interactie-architectuur

```
src/lib/ink/
  geometry.ts   resamplen, gladstrijken, vereenvoudigen, lijn met variabele dikte (contour), padfuncties
  analyze.ts    "Denckh kijkt": aanloop wegfilteren, lus vinden, hoeken, kruisingen, rondheid (4πA/P²), richting
  interpret.ts  voorbeeldinterpretaties (vaste regels) → later vervangbaar door een AI-laag (docs/ai-onderzoek.md)
  forms.ts      eerste vorm opgebouwd uit dezelfde N punten als de schets (zodat de lijn letterlijk vorm wordt)
  shapes.ts     vormen voor de rest van de site (website, prototype, tool, spel, …) als N-puntcontouren + details
  store.ts      de schets van de bezoeker, genormaliseerd, in sessionStorage; standaardschets als niemand tekent
  hooks.ts      in beeld, scrollvoortgang (alleen lezen, geen kaping), morph, breedte
src/components/punt/      hero: PuntStage (tekenen → kijken → lezen → vorm) + FormWidget (bruikbare mini-vormen)
src/components/grammar/   InkRule, SettleTitle, Construct (+ caseBuilds), Outcomes, Werkwijze, ContactReturn
src/components/Wordmark.tsx  woordmerk met ck-ligatuur; de punt neemt de vorm van jouw schets aan
```

Principes:

- **Canvas tijdens het tekenen, SVG daarna.** Live tekenen gaat per frame op canvas (snel). Bij loslaten wordt de lijn
  een SVG-pad met exact dezelfde geometrie; daarop werken analyse, morph en interactie.
- **Morph = dezelfde punten.** Elke vorm heeft evenveel punten als de geresamplede schets; de overgang is een
  interpolatie per punt, niet een crossfade tussen plaatjes.
- **Scroll wordt alleen gelezen.** Geen `preventDefault` op scroll, geen vastgezette secties die snelheid veranderen.
- **Touch:** alleen de punt heeft `touch-action: none`. Wie ergens anders veegt, scrolt gewoon.
- **Progressive enhancement:** alle tekst staat in de statische HTML; zonder JavaScript is de site leesbaar.

## 4. Contact

GitHub Pages kan niets verzenden. Het formulier opent daarom het eigen mailprogramma (`mailto:info@denckh.nl`) met
de ingevulde tekst. Het adres staat ook als gewone tekst. Een echte verzendroute vraagt een serverless endpoint
(zelfde afweging als in `docs/ai-onderzoek.md` §4) en is een eigenaarsbesluit.

## 5. Privacy

Geen cookies, geen analytics, geen externe verzoeken (fonts zelf gehost). De schets en de ingevulde zin staan alleen
in `sessionStorage` van de eigen browser en verdwijnen met het tabblad. Privacyverklaring bijgewerkt (`/privacy/`).

## 6. Performance en toegankelijkheid (gemeten 2026-09-29, lokaal)

| Meting | Resultaat |
|---|---|
| Lighthouse mobiel, met gzip zoals GitHub Pages levert | Performance **93**, Accessibility **100**, Best practices **100**, SEO **100** |
| LCP / TBT / CLS | 2,5 s / 240 ms / 0 |
| JavaScript homepage | 192 KB gzip, waarvan ca. 150 KB Next.js/React-runtime en ca. 40 KB eigen code |
| Fonts | 50 KB (2 bestanden, preload) |
| axe (WCAG 2.2 AA + best practices) | 0 overtredingen op home (1440 en 390 px), Deegh-case en privacy |
| e2e | 33/33: tekenen (muis, touch, toetsenbord), voorbeeld, idee maakt de vorm concreet, reduced motion, projecten (late start, klikbare stappen, Loflijn-beurt, "Ook gemaakt"), geen overflow van 320 tot 1440 px, geen console-errors |

**Kanttekening:** de JS-bundel ligt boven het eerdere budget van 130 KB. Het verschil zit bijna helemaal in de
Next.js-runtime. Astro zou hier ca. 100 KB lichter zijn; zie open punt in `HANDOFF.md`.

## 7. Bekende beperkingen

- Lighthouse draaide lokaal (gesimuleerd 4G, CPU-vertraging), niet tegen de live site: die is vanuit de werkomgeving
  niet bereikbaar.
- Niet getest op een fysieke iPhone; wel op iPhone-maat met touch-emulatie.
- `[pathLength]`-attribuutselectors bleken in Chrome niet betrouwbaar te matchen na minificatie; animaties gebruiken
  daarom klassen.
