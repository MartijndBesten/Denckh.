# Technische architectuur en deployment

Status: **bijgewerkt, 2026-09-29.** De site draait volgens de eigenaar op GitHub Pages onder `denckh.nl`; Cloud86/Plesk verzorgt mail voor `info@denckh.nl`. Deze ronde wijzigt geen productie-infrastructuur.

---

## 1. Samenvatting

| Onderdeel | Keuze |
|---|---|
| Framework | **Next.js (App Router) + TypeScript**, als **statische export** (`output: 'export'`) |
| Styling | **Tailwind CSS v4** met design-tokens als CSS-variabelen |
| Animatie | SVG + CSS. **Motion** (via `LazyMotion`) alleen voor de scroll-gekoppelde intro en de hero-punt |
| Hosting | **GitHub Pages** onder `denckh.nl` (door eigenaar bevestigd) |
| Mail | **Cloud86 / Plesk**, mailbox `info@denckh.nl` (door eigenaar bevestigd) |
| Contactformulier | Nog niet gekoppeld. Een Pages-compatibele, server-side verzendroute vereist eerst apart ontwerp en geheimbeheer. |
| Deploy | GitHub Pages; deze ronde verandert geen workflow, custom domain of Pages-instelling. |
| Analytics | **Geen** bij de start. Dus ook geen cookiebanner nodig |
| Extra kosten | Naar verwachting alleen de domeinnaam *(te bevestigen)* |

## 2. Waarom een statische export (en geen Next.js-server)

**Wat vaststaat:**
- De eigenaar heeft al een Cloud86 *Webhosting*-pakket (shared hosting met Plesk, PHP, LiteSpeed). Daar draait ook
  Deegh.
- Volgens openbare informatie noemt Cloud86 Node.js bij *Managed VPS*, niet bij gewone webhosting. De Cloud86-site zelf
  was vanuit de werkomgeving niet bereikbaar. **Status: waarschijnlijk, niet bevestigd.**
- Een Next.js-server (SSR, API-routes, image-optimalisatie) heeft een draaiend Node-proces nodig.

**Wat de site nodig heeft:** vaste inhoud (home, drie cases, contact, privacy) en één dynamisch onderdeel: het
formulier. Er is geen login, geen database en geen gepersonaliseerde inhoud.

**Conclusie:** een server zou alleen kosten en beheer toevoegen. De statische export levert gewone HTML, CSS, JS en
beelden die op elke webserver draaien, ook op Cloud86 shared hosting. Het formulier loopt via PHP, dat daar standaard
beschikbaar is.

| Optie | Pro | Contra | Oordeel |
|---|---|---|---|
| **A. Statische export op Cloud86** | Geen extra kosten, alles op één plek (NL), mail op hetzelfde domein, overal draaibaar | Geen Next-image-optimalisatie of API-routes (opgelost met een build-script en PHP) | **Aanbevolen** |
| B. Next.js-server op Vercel | Alle Next-functies, preview-URL's | Hobby-plan is niet voor commercieel gebruik → betaald plan. Extra account, data bij een VS-partij | Niet nodig |
| C. Next.js op een Cloud86 Managed VPS | Alle functies, NL | Duurder, zelf beheren | Overkill |
| D. GitHub Pages | Gratis, zoals de IntuSens-site | Geen PHP → formulier via derde partij. Publiek repo | Alleen als terugvaloptie |

**Eerlijke kanttekening:** voor een content-site als deze is **Astro** technisch lichter (minder JavaScript: grofweg
20–30 KB tegen 90–100 KB voor de Next-basis). Next.js is gekozen omdat de eigenaar dat voorkeur geeft en omdat
React-componenten later makkelijk hergebruikt kunnen worden voor demo's en prototypes. De extra JS is acceptabel: de
grootste paint is tekst, en de rest laadt zonder te blokkeren. Deze afweging staat als voorstel B-010 in `HANDOFF.md`.

### Gevolgen van de statische export (en de oplossing)

| Beperking | Oplossing |
|---|---|
| Geen `next/image`-optimalisatie | Build-script met `sharp`: AVIF + WebP in 3–4 breedtes, vaste afmetingen tegen CLS. Eigen `<Picture>`-component |
| Geen middleware of redirects | `.htaccess` (LiteSpeed leest die): HTTPS, `www` → zonder `www`, caching, security-headers, 404-pagina |
| Geen API-routes | `public/api/contact.php` |
| `sitemap.ts`/`robots.ts` | Statisch gegenereerd bij de build (in fase 5 verifiëren; anders een build-script) |
| Nette URL's | `trailingSlash: true` → `/projecten/deegh/index.html` |

## 3. Projectstructuur (vanaf fase 5)

```
.
├── src/
│   ├── app/                    routes: page.tsx, projecten/[slug], contact, privacy, not-found, sitemap, robots
│   ├── components/
│   │   ├── punt/               de punt: hero-interactie (krabbel → vorm) en rode draad
│   │   ├── sketch/             lijntekeningen (wireframes, woordschetsen)
│   │   └── ui/                 knoppen, formulier, layout
│   ├── content/                cases als getypeerde data (alleen geverifieerde feiten + bronverwijzing)
│   ├── lib/                    helpers (vormherkenning krabbel, paden, seo)
│   └── styles/                 tokens en globale css
├── public/
│   ├── api/contact.php         formulierverwerking
│   ├── fonts/                  zelf gehoste woff2 (subset)
│   └── .htaccess
├── scripts/                    beeld-pipeline, controle na de build
├── tests/                      Playwright (e2e, a11y, overflow, reduced motion)
└── docs/
```

## 4. Contactformulier

- **Werkt zonder JavaScript:** een gewone POST naar `/api/contact.php` en daarna een redirect naar een
  bedankt-toestand. Met JS: `fetch` met inline meldingen.
- **Velden:** naam, e-mail, bericht (verplicht). Link en bestand optioneel: pdf/jpg/png/webp, max. 10 MB, MIME
  gecontroleerd met `finfo`.
- **Spam:** honeypot-veld, minimale invultijd en een eenvoudige limiet per IP. Geen reCAPTCHA (privacy, frictie).
- **Verzenden:** naar het eigen adres (bijv. `hallo@denckh.nl`), met `Reply-To` op de bezoeker. Het bestand gaat als
  bijlage mee en wordt **niet** op de server bewaard.
- **Gegevens:** geen database. Berichten staan alleen in de mailbox.
- **Configuratie:** afzender en eventuele SMTP-gegevens staan in een configbestand **buiten de webroot en buiten Git**.
- **Lokaal testen:** met `php -S` (PHP 8.4 is beschikbaar in de werkomgeving).

## 5. Privacy, cookies, juridisch

- **Geen cookies, geen tracking, geen externe verzoeken:** fonts zelf gehost, geen embeds van derden. Dus geen
  cookiebanner nodig.
- **Privacyverklaring** is wel nodig: het formulier verwerkt persoonsgegevens (AVG). Kort en concreet.
- **Bedrijfsgegevens op de site** (Nederlandse informatieplicht voor online diensten): naam, KvK-nummer, e-mail en
  adres; btw-id waar van toepassing. Zie open punten in `HANDOFF.md`.
- **Analytics later?** Alleen cookieloos: serverstatistieken in Plesk (gratis) of een EU-gehoste cookieloze dienst.
  Beslissen als het nodig blijkt.

## 6. SEO

- Metadata per pagina (title, description, canonical, `lang="nl"`).
- OpenGraph en Twitter-kaarten met een eigen OG-beeld per pagina (de punt + titel), gegenereerd bij de build.
- Structured data (JSON-LD): `Organization` met `founder` (`Person`) op de home, `CreativeWork` en `BreadcrumbList`
  op casepagina's. Alleen velden met bevestigde inhoud.
- `sitemap.xml` en `robots.txt`.
- Favicon, app-iconen en manifest: de okerpunt op papier (SVG + PNG).

## 7. Performance-doelen

| Meting | Doel (mobiel, middensegment, 4G) |
|---|---|
| LCP | < 2,0 s |
| CLS | < 0,05 |
| INP | < 200 ms |
| JS homepage (gz) | ≤ 130 KB totaal, waarvan de concept-interactie ≤ 25 KB |
| Beelden | AVIF/WebP, `loading="lazy"` onder de vouw, vaste afmetingen |
| Fonts | 2 families, gesubset (Latin), displayletter met preload, `font-display: swap` |

Animaties gebruiken alleen `transform`, `opacity`, `stroke-dashoffset` en `clip-path`. Er wordt niet gemeten in de
layout tijdens het scrollen.

## 8. Toegankelijkheid (WCAG 2.2 AA)

- Semantische koppen (één `h1` per pagina), landmarks, skip-link.
- Zichtbare focus: 2px `inkt`-ring met offset, ook op de punt.
- De hero-punt is een verrijking: de inhoud staat er ook zonder. Toetsenbordgebruikers krijgen een knop *"Laat zien"*
  die de krabbel → vorm-demo afspeelt.
- `prefers-reduced-motion`: eindstanden, geen scroll-koppeling.
- Contrast volgens de tokens in `creative-direction.md`. Oker nooit als kleine tekst op licht.
- Formulier: labels, foutmeldingen via `aria-describedby`, bevestiging via `role="status"`.
- Klikdoelen ≥ 44 px, tekst ≥ 16 px, geen horizontale scroll vanaf 320 px breed.

## 9. Kwaliteit en tests

- TypeScript `strict`, ESLint, Prettier.
- **Playwright**, lokaal en in CI:
  - alle pagina's laden zonder console-errors;
  - geen horizontale overflow op 320, 390, 768 en 1440 px;
  - reduced-motion-weergave klopt;
  - formulier: validatie en verzenden (tegen een lokale PHP-server met een test-mailer);
  - toegankelijkheid via axe.
- GitHub Actions: `lint` + `typecheck` + `build` + tests bij elke push. **Geen automatische deploy.**

## 10. Deployment: stappenplan (pas na akkoord)

Niets hiervan gebeurt voordat de eigenaar per stap akkoord geeft.

| # | Stap | Wie | Kosten |
|---|---|---|---|
| 1 | Controleren of `denckh.nl` geregistreerd is en bij wie. Nu zijn geen DNS-records gevonden | Eigenaar | Domein: *te bevestigen*, doorgaans enkele euro's tot ca. €15 per jaar |
| 2 | In Plesk controleren of het huidige pakket nog een website toelaat, en `denckh.nl` toevoegen | Eigenaar | Naar verwachting €0 *(te bevestigen)* |
| 3 | DNS: A/AAAA (of nameservers) naar Cloud86, plus MX/SPF/DKIM/DMARC voor mail | Eigenaar | €0 |
| 4 | SSL (Let's Encrypt) activeren in Plesk | Eigenaar | €0 |
| 5 | Mailbox aanmaken (bijv. `hallo@denckh.nl`) en afzender voor het formulier | Eigenaar | €0 (binnen pakket) |
| 6 | Staging: subdomein (bijv. `concept.denckh.nl`) met wachtwoord, om te testen vóór livegang | Samen | €0 |
| 7 | Deploy-workflow (handmatig starten) via SFTP, met inloggegevens als GitHub-secrets. Alternatief: `out/` handmatig uploaden met FileZilla | Samen | €0 |
| 8 | Livegang na volledige QA (fase 10) | Eigenaar geeft akkoord | – |

**Accounts en rechten:** GitHub (aanwezig), Cloud86/Plesk (eigenaar), domeinregistrar (eigenaar), mailbox
(eigenaar). Claude krijgt geen toegang tot Plesk. SFTP-gegevens staan alleen als GitHub-secret als de eigenaar voor
automatisch uploaden kiest. Let op: in een publieke repo zijn de workflow-logs openbaar, dus secrets mogen nooit worden
gelogd.
