# Denckh.

**van idee naar vorm**

Dit is de repository voor de nieuwe website van Denckh.

## Wat is Denckh

Denckh is een kleine creatieve conceptstudio. We werken ideeën uit tot digitale concepten, prototypes en bruikbare
vormen.

Denckh doet nadrukkelijk meer dan webdesign. Een website kan de uitkomst zijn, maar net zo goed een interactieve demo,
een prototype, een tool of een ander concept dat een idee concreet en toetsbaar maakt.

## Status

| Fase | Stand |
|---|---|
| 0 · Projectbasis (repo, documentatie, werkafspraken) | **Gereed** |
| 1 · Onderzoek bestaande projecten | Uitgevoerd (live sites nog niet bekeken, zie `HANDOFF.md`) |
| 2 · Creative direction | Voorstel: [`docs/creative-direction.md`](docs/creative-direction.md) |
| 3 · Structuur en content | Voorstel: [`docs/structuur-en-content.md`](docs/structuur-en-content.md) |
| Architectuur en deployment | Voorstel: [`docs/architectuur.md`](docs/architectuur.md) |
| 4 · Design system | Eerste tokens en uitwerking in de websitecode gereed |
| 5–7 · Homepage en eerste case | Eerste werkende versie in opbouw; zie `HANDOFF.md` |
| 8–10 · Cases, contact, QA | Vervolg na de eerste technische controle |
| Hosting, DNS en livegang (denckh.nl) | **Bewust buiten scope** tot expliciet akkoord |

De actuele stand, genomen beslissingen en open punten staan in [`HANDOFF.md`](HANDOFF.md).

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
│   └── architectuur.md         ← stack, hosting, deploy, privacy, SEO, performance, a11y
├── .editorconfig
├── .gitattributes
└── .gitignore
```

De websitecode staat in `src/` en gebruikt Next.js met statische export. Zie `docs/architectuur.md` en `HANDOFF.md`.

## Repository

- GitHub: `MartijndBesten/Denckh.`
- Hoofdbranch: `main`
