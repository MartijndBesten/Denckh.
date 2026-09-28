# HANDOFF

Overdrachtsdocument voor de Denckh-website. Hier staan de actuele stand, alle belangrijke technische en creatieve
beslissingen, open punten en de volgende stappen. **Bijwerken aan het eind van elke werksessie.**

- Laatst bijgewerkt: 2026-09-28
- Fase: **0 · Projectbasis: gereed**

---

## Huidige stand

- De bestaande GitHub-repository `MartijndBesten/Denckh.` was leeg (geen commits, geen branches). Er is **geen**
  nieuwe repository aangemaakt.
- De projectbasis staat erin: `README.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/cases/README.md`, `.editorconfig`,
  `.gitattributes` en `.gitignore`.
- Hoofdbranch: `main`.
- Er is nog geen websitecode, geen framework en geen hosting.

## Repositorygegevens

| Onderwerp | Waarde |
|---|---|
| Remote | `https://github.com/MartijndBesten/Denckh.` |
| Zichtbaarheid | Publiek (stand 2026-09-28) |
| Hoofdbranch | `main` |
| Eerste commit | Projectbasis; SHA via `git log --oneline` |

---

## Beslissingenlog

Nieuwe beslissingen onderaan toevoegen. Een beslissing herzien? Voeg een nieuwe regel toe die naar de oude verwijst.
Pas de oude regel niet aan.

| # | Datum | Besluit | Reden | Status |
|---|---|---|---|---|
| B-001 | 2026-09-28 | `main` is de hoofdbranch. | De repo was leeg en nog niet anders ingericht. | Vast |
| B-002 | 2026-09-28 | Geen nieuwe repository. We werken in de bestaande `MartijndBesten/Denckh.`. | Opdracht van de eigenaar. | Vast |
| B-003 | 2026-09-28 | Hosting, DNS, Cloud86, livegang `denckh.nl` en productie-deploys zijn buiten scope tot expliciet akkoord. | Eerst een solide lokale/GitHub-basis, onderzoek en creative direction. | Vast tot nader order |
| B-004 | 2026-09-28 | Geen verzonnen claims, cases, klanten, testimonials, cijfers of resultaten. Ontbrekende inhoud wordt een gemarkeerde `[TODO: …]`. | Geloofwaardigheid. Een kleine studio staat of valt met eerlijke cases. | Vast |
| B-005 | 2026-09-28 | Een project wordt pas als case beschreven na verificatie van de werkelijke inhoud (live site en/of repo). Bron en datum worden vastgelegd in `docs/cases/`. | Voorkomt dat aannames als feit op de site komen. | Vast |
| B-006 | 2026-09-28 | Belangrijke technische en creatieve beslissingen worden in dit bestand bijgehouden. | Continuïteit tussen sessies en assistenten. | Vast |
| B-007 | 2026-09-28 | Nog geen techstack gekozen. Er worden geen framework of dependencies toegevoegd vóór een vastgelegde keuze. | De stack volgt uit de creative direction en de hostingrandvoorwaarden, niet andersom. | Open (zie O-03) |

---

## Geverifieerde feiten

Alleen wat daadwerkelijk is gecontroleerd, met datum.

| Feit | Bron | Gecontroleerd |
|---|---|---|
| Repo `MartijndBesten/Denckh.` bestaat, is publiek en was leeg. | GitHub | 2026-09-28 |
| Er bestaat al een Denckh-logo: donker woordmerk "Denckh" met een punt in een oker/zandkleurige accentkleur, met daaronder de tagline "van idee naar vorm", op een lichte crèmekleurige achtergrond. Het bestand is een PNG van 270×117 px, aangeleverd door de eigenaar. | Ander project van de eigenaar | 2026-09-28 |
| De repository voor de TRILUX LiveLink 3D-demo is gevonden in het GitHub-account. De inhoud is globaal bekeken. | GitHub | 2026-09-28 |

---

## Open punten

| # | Onderwerp | Toelichting | Voorstel | Wie |
|---|---|---|---|---|
| O-01 | **Reponaam eindigt op een punt** (`Denckh.`) | Werkt op GitHub, maar geeft technisch gedoe. URL's worden `…/Denckh.`, clone-URL's `…/Denckh..git`, en Windows verwijdert een punt aan het eind van mapnamen. Ook bij hostingkoppelingen en CI kan dit onverwacht gedrag geven. | Hernoem de repo naar `denckh`. GitHub stuurt de oude URL automatisch door. De punt blijft deel van het beeldmerk, niet van technische namen. | Eigenaar |
| O-02 | **Repo is publiek** | Alles in deze repo (ook `HANDOFF.md` en onderzoeksnotities) is openbaar. | Zet de repo op privé zolang er onderzoek en concepten in staan. Of hou vertrouwelijke notities bewust buiten de repo. | Eigenaar |
| O-03 | **Techstack** | Nog niet gekozen (B-007). | Voorlopige richting: een statische site, bijvoorbeeld met Astro. Die draait op vrijwel elke hosting (ook shared hosting zoals Cloud86), laadt snel en maakt het mogelijk om interactieve demo's per pagina in te bedden. Pas besluiten na de creative direction. | Samen |
| O-04 | **Logo als bronbestand** | Alleen een kleine PNG (270×117) gevonden. Kleuren en lettertype zijn niet vastgelegd. | Vectorbestand (SVG/AI/PDF) aanleveren. Kleurcodes en het lettertype vastleggen. | Eigenaar |
| O-05 | **Schrijfwijze merknaam** | "Denckh" of "Denckh." in lopende tekst? | Beslissen in de creative direction. | Eigenaar |
| O-06 | **TRILUX 3D-demo als case** | Bevat merkmateriaal van derden. Eigendom en toestemming voor publiek gebruik zijn niet vastgelegd. | Vóór publicatie als Denckh-case afstemmen wat mag: naam, logo's, beelden en rol. Tot die tijd niet publiek beschrijven. | Eigenaar |
| O-07 | **Lokale werkmap op de eigen computer** | Deze basis is gemaakt in een cloudomgeving, niet op de eigen computer. | Clone naar een map zonder punt aan het eind, bijvoorbeeld `C:\Denckh`. Zie hieronder. | Eigenaar |
| O-08 | **Bronnen voor Deegh, Intusens-demokoffer en Loflijn** | Nog niet onderzocht. Het is nog niet vastgesteld welke repo bij welke live site hoort. | Per case eerst de live site en eventuele repo controleren. | Onderzoeksfase |

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

1. **Open punten O-01 en O-02 beslissen** (reponaam en zichtbaarheid). Dit gaat vóór alle inhoud.
2. **Onderzoek cases** (fase 1), per case volgens het protocol in `docs/cases/README.md`:
   - https://deegh.nl
   - https://intusens-demokoffer.nl
   - https://loflijn.nl
   - TRILUX LiveLink 3D-demo (repository; eerst O-06)
3. **Creative direction** (fase 2): positionering, toon, beeldtaal, kleur, typografie, sitestructuur.
4. **Techniekkeuze** (O-03) vastleggen als beslissing. Daarna pas de bouw.
5. Hosting, DNS en livegang pas na expliciet akkoord (B-003).
