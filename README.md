# Denckh.

**van idee naar vorm**

Dit is de repository voor de nieuwe website van Denckh.

## Wat is Denckh

Denckh is een kleine creatieve conceptstudio. We werken ideeën uit tot digitale concepten, prototypes en bruikbare
vormen.

Denckh doet nadrukkelijk meer dan webdesign. Een website kan de uitkomst zijn, maar net zo goed een interactieve demo,
een prototype, een tool of een ander concept dat een idee concreet en toetsbaar maakt.

## Status

| Onderdeel | Stand |
|---|---|
| Live (`main`) | Interactieve versie "begin met een punt" op `denckh.nl` via GitHub Pages |
| Mail | Cloud86/Plesk, `info@denckh.nl` |

De actuele stand, genomen beslissingen en open punten staan in [`HANDOFF.md`](HANDOFF.md).

## Lokaal draaien

```bash
npm ci
npm run dev            # ontwikkelen op http://localhost:3000
npm run build          # statische export naar out/
npx serve out -l 8711  # build bekijken
npm run test:e2e       # 42 interactiecontroles (vereist de server op poort 8711)
```

## Uitgangspunten

- **Geen verzonnen inhoud.** Geen verzonnen claims, cases, klanten, testimonials, cijfers of resultaten. Alles wat
  op de site komt, is herleidbaar naar een gecontroleerde bron.
- **Cases pas na verificatie.** Een project wordt pas als case beschreven nadat de werkelijke inhoud (live site of
  repository) is bekeken. Zie [`docs/cases/`](docs/cases/README.md).
- **Beslissingen vastleggen.** Belangrijke technische en creatieve beslissingen komen in [`HANDOFF.md`](HANDOFF.md),
  met datum en reden.

## Structuur

```
.
├── README.md          ← dit bestand: wat is Denckh, status, uitgangspunten
├── CLAUDE.md          ← werkinstructies voor Claude (en andere AI-assistenten) in deze repo
├── HANDOFF.md         ← actuele stand, beslissingenlog, open punten, volgende stappen
├── docs/
│   ├── cases/                  ← caseregister, verificatieprotocol en dossier per case
│   ├── creative-direction.md   ← concept, bewegingstaal, kleur, typografie, toon
│   ├── structuur-en-content.md ← sitemap, homepage-opbouw, concepttekst, formulier
│   ├── architectuur.md         ← stack, hosting, interactie-architectuur, performance, a11y
│   ├── ai-onderzoek.md         ← wat nodig is voor echte AI (nog niets gebouwd)
│   ├── typografie-proef.md     ← typografische richtingen en werkhypothese
│   └── typografie/             ← proefpagina, woordmerk-SVG's
├── src/lib/ink/                ← inkt-engine: geometrie, analyse, interpretatie, vormen
├── src/components/punt/        ← hero: begin met een punt
├── src/components/grammar/     ← de lijn die door de site reist
├── tests/interaction.mjs       ← e2e-controles
├── .editorconfig
├── .gitattributes
└── .gitignore
```

De websitecode staat in `src/` en gebruikt Next.js met statische export. Zie `docs/architectuur.md`.

## Repository

- GitHub: `MartijndBesten/denckh` (live via GitHub Pages op `denckh.nl`; elke push naar `main` gaat live)
- Nieuw werk: op een aparte branch, merge naar `main` = livegang
- Hoofdbranch: `main`
