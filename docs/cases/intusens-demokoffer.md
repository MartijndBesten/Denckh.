# IntuSens-demokoffer

- **Bron(nen):** publieke repository `MartijndBesten/intusens-demokoffer` (de bestanden die GitHub Pages publiceert op
  `intusens-demokoffer.nl`, zie `CNAME` en `.github/workflows/pages.yml`). De site is lokaal gerenderd en gescreenshot.
- **Live site zelf:** *niet* bekeken. `intusens-demokoffer.nl` was vanuit de werkomgeving geblokkeerd door het
  netwerkbeleid. Wel vastgesteld: het domein wijst naar GitHub Pages (185.199.108–111.153).
- **Gecontroleerd op / door:** 2026-09-29 · Claude
- **Commit-SHA:** `d8817c70bf060a1a8d7d94792b1b9720bcc4e6de` (2026-09-28)
- **Status:** *In onderzoek*. Inhoud geverifieerd; rechten en rol nog niet (zie onderaan).

## Wat is het

Een interactieve website bij een fysieke demokoffer met TRILUX IntuSens-sensoren. In de broncode heet het een
"Interactive Sales Guide". Paginatitel: *IntuSens demokoffer · TRILUX*.

## Aanleiding / vraag

Bevestigd door de eigenaar (2026-09-29): hij was zelf initiatiefnemer en formuleerde zelf de ontwerp-/gebruiksvraag.
Strekking: een demokoffer vol sensortechniek moest ook zonder uitgebreide uitleg snel te begrijpen en te gebruiken
zijn. Geen externe klantvraag. (HANDOFF B-053)

Uit de bron blijkt: de site hoort bij een fysieke koffer (QR-stickers voor op de koffer zitten in de repo) en moet ook
zonder internet werken "bij de klant" (comment in de service worker).

## Wat is er gemaakt (geverifieerd in de bron)

| Onderdeel | Wat het doet |
|---|---|
| **De koffer: "Wat zit waar?"** | Interactieve, in code getekende illustratie van de koffer. In het deksel alle bouwvormen, in de onderzijde twee werkende sensoren (Switch en DALI-2 Broadcast). Hover of tik voor info, schakelaar *Namen tonen*. |
| **Sensorfamilie** | Overzicht van de familie ("vijf bouwvormen, één bedienconcept", uit de OG-beschrijving). |
| **Vier regelvarianten** | Uitleg van de varianten. |
| **Bediening** | Per sensor (Switch / DALI-2 Broadcast) een stap-voor-stap-flow die het display en de handeling nabootst, met instelbereik per stap. |
| **Snelstart** | Korte route voor direct gebruik. |
| **Start demo** | Geregisseerde presentatiemodus van 9 schermen, met voortgangsbalk, vorige/volgende en volledig scherm. |
| **Drie talen** | NL, EN en FR. |
| **Offline** | Een service worker cachet alle bestanden, zodat de site na het eerste bezoek zonder internet werkt. |
| **Installeerbaar** | Web-app-manifest (PWA). |
| **Printversie** | A4-handleiding als aparte HTML-pagina. |
| **QR-codes** | Sticker 80 mm voor op de koffer, 50 mm, en een A4-vel. Brug tussen de fysieke koffer en de site. |
| **Beeld** | Echte foto's van de koffer en onderdelen (`assets/processed/`), plus SVG-illustraties. |

**Techniek:** plain HTML/CSS/JS, geen build, geen externe afhankelijkheden. Statisch gehost. In de footer staat: "Deze
site gebruikt geen cookies of tracking." `robots.txt` blokkeert alle crawlers en de pagina heeft `noindex`: de site is
bewust niet vindbaar in zoekmachines.

**Vermelding:** in de footer staat "Website gemaakt door" met het Denckh-logo.

## Vorm (wat iemand nu kan zien of gebruiken)

Een site die je opent via de QR-code op de koffer of via de URL. Je kunt de koffer verkennen, per sensor de bediening
doorlopen, of de demo als presentatie afspelen. Ook offline.

## Te bevestigen

- Aanleiding: eigen initiatief van de eigenaar (bevestigd 2026-09-29, B-053).
- [TE BEVESTIGEN] Is de fysieke koffer (indeling, opdruk) ook door Denckh/Martijn bedacht of gemaakt, of alleen de site?
- [TE BEVESTIGEN] Wordt de koffer met site daadwerkelijk ingezet, en door wie? Geen aantallen of effecten claimen
  zonder bron.

## Rechten en toestemming

- **Blokkerend voor publicatie.** Het gaat om een product en merk van TRILUX (logo's, productnamen, productfoto's).
  De site staat bewust op `noindex`. Een link of screenshots vanaf denckh.nl maken hem vindbaarder.
- Nodig vóór publicatie: schriftelijke toestemming van TRILUX voor (a) het tonen als Denckh-case, (b) het gebruik van
  screenshots en foto's, (c) het noemen van TRILUX en IntuSens, en (d) een link naar de site.
- Terugvaloptie zonder toestemming: de case alleen tonen als geanonimiseerde beschrijving ("demokoffer voor een
  sensorfamilie"), zonder merknamen, logo's of link. Minder sterk, wel eerlijk.

## Beeldmateriaal (bestand · herkomst)

| Bestand | Herkomst | Bruikbaar? |
|---|---|---|
| Screenshots van de gerenderde site (desktop en mobiel) | Zelf gemaakt vanuit de repo, 2026-09-29 | Na toestemming (merk van derden) |
| `assets/processed/koffer-hero.jpg` e.a. | Foto's in de repo; fotograaf [TE BEVESTIGEN] | Na toestemming |

## Richting voor de casetekst (concept, pas definitief na bevestiging)

- Kop, optie A: **"Een koffer vol sensoren. En een site die uitlegt wat je in handen hebt."**
- Kop, optie B: **"Scan de koffer, snap de sensor."** (QR op de koffer → uitleg; claimt geen tijd of effect)
- Vermijden: "in één minuut begrijpt". Dat is een meetbare claim zonder bron.
