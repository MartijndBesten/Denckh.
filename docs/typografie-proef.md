# Typografieproef

- **Ronde 2 (Codex, 2026-09-29):** drie richtingen in tekst beschreven (A zachte serif, B uitgesneden woordbeeld,
  C grotesk met één afwijking). Geen beeld.
- **Ronde 3 (2026-09-29): echte proef.** Alle woordmerken zijn als contouren gezet vanuit de fontbestanden
  (HarfBuzz + fontTools), met kerning, eigen punt en maatwerk. Bekijken: `docs/typografie/proef.html` of
  `docs/typografie/proef.png`. Bruikbare SVG's: `docs/typografie/denckh-woordmerk*.svg`.

## Getest

Eerst een contactvel van 13 letters (Fraunces soft/wonk, Hedvig Letters Serif, Bricolage Grotesque, Besley, Young
Serif, Caprasimo, Literata, Newsreader, Recursive casual, Familjen Grotesk, Instrument Serif). Afgevallen:

- Young Serif (vorige voorstel): te zwaar en stug; de eigenaar vond hem niet mooi genoeg.
- Hedvig, Newsreader, Instrument Serif: te literair of te dun voor een woordmerk.
- Caprasimo, Recursive casual: te speels, richting kinderachtig.

Uitgewerkt, elk met `denckh.` / `Denckh.`, tagline, vergrote `ckh` en toepassing met lopende tekst:

| Richting | Letter | Oordeel |
|---|---|---|
| A · Zacht ambacht | Fraunces (SOFT 100, opsz 144, 560) | Warm, rond, familie met het ronde Deegh-woordbeeld. Goede `ckh`. Nog niet eigen genoeg. |
| B · Eigenwijs grotesk | Bricolage Grotesque (wdth 88, 620) | Jong, ink traps. `ckh` wordt een blok; minder warmte. Alternatief als het technischer moet. |
| C · Oud woord, nieuw gezet | Besley (760) | Clarendon: schuift naar historisch. Afgevallen. |
| **D · Eigen woordmerk: ck-ligatuur** | Fraunces-basis, de kop van de `c` loopt door in de stok van de `k`, punt als eigen cirkel op de basislijn | **Werkhypothese.** In oud zetsel (Fraktur) was ck een vaste ligatuur; hier komt dat terug in een moderne letter. Het vreemde woordbeeld wordt een herkenbaar ritme. |
| E · Grotesk met ligatuur | Bricolage-basis | Opvallend, maar minder volwassen. Reserve. |

## Details van de werkhypothese (D)

- Tracking −14 (op 2000 upm), `ck` 10 eenheden strakker, verbinding als afgeronde balk op x-hoogte.
- De punt is een losse cirkel (d = 340 eenheden, iets groter dan de punt-glyph), op de basislijn, 40 eenheden dichter
  op de `h`. In het logo is de punt een apart element, zodat hij kan leven (zie hieronder).
- Kleine letters (`denckh.`) als werkversie, zoals de briefing en als zusje van `deegh`. `Denckh.` staat in de proef
  ernaast.
- Tekstletter: Manrope, dezelfde tekststem als Deegh. De familieband zit in de stem, niet in het logo.

## Levend woordmerk (voorstel, in de site gebouwd)

De punt in het woordmerk neemt heel klein de vorm aan die de schets van de bezoeker kreeg: een knopje, een kadertje,
een lijntje met een schuif. Zonder schets is het gewoon een punt. Het merk laat zo zien wat Denckh doet, zonder uitleg.

## Nog te doen

- Definitieve vectortekening van de ligatuur (nu opgebouwd uit fontcontouren plus een balk; oké voor schermgebruik,
  nog niet verfijnd voor print of groot formaat).
- Keuze kleine letter of hoofdletter (open punt eigenaar).
- Check bij 16 px (favicon): alleen de punt.

## Logo-lab (2026-09-29, open)

Op branch `creatief/ronde-3` staat een interne proefpagina `/logo-lab/` (noindex, niet gelinkt, niet in de sitemap):
het huidige woordmerk naast zeven varianten met elk één ingreep aan de onderkant: naad d, snede e, inkeping n, open c,
onderbreking k, voet h en spoor punt. Per variant groot, headerformaat, ca. 100 px en licht op donker. Er is geen
winnaar gekozen (HANDOFF B-046, O-34). De contouren staan sindsdien in `src/components/wordmarkPaths.ts`.
