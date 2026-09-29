# Deegh

- **Bron(nen):** de broncode van de nieuwe Deegh-webshop (privé-repository van de eigenaar, laatste commit 2026-09-17).
  Zolang deze Denckh-repo publiek is, staan hier alleen gegevens die ook op de publieke site zichtbaar horen te zijn.
  Interne details (prijsafspraken, koppelingen, hosting) blijven buiten deze repo.
- **Live site zelf:** *niet* bekeken. `deegh.nl` was vanuit de werkomgeving geblokkeerd door het netwerkbeleid. Het
  domein wijst inmiddels naar een Cloud86-server. Dat past bij de geplande verhuizing, maar het is **niet**
  gecontroleerd welke versie live staat.
- **Gecontroleerd op / door:** 2026-09-29 · Claude
- **Status:** *In onderzoek*. Live stand, beeldherkomst en rol bij het merk nog bevestigen.

## Wat is het

Deegh is een eigen merk en onderneming van Martijn den Besten rond ambachtelijk pizzadeeg (diepvries-pizzabollen).
Het logo draagt "anno 2021". Een eerdere webshop draaide op een standaard webshopplatform. Deegh 2.0 is een nieuwe,
zelfgebouwde webshop.

## Aanleiding / vraag

Uit de projectdocumentatie: de oude platformsite vervangen door een eigen webshop die sneller is (mobiel), beter
vindbaar, met minder handwerk voor de eigenaar, en met zowel particuliere als zakelijke klanten in één omgeving.

[TE BEVESTIGEN: hoe Martijn de aanleiding zelf zou verwoorden.]

## Wat is er gemaakt (geverifieerd in de broncode)

| Onderdeel | Wat het is |
|---|---|
| **Eigen webshop** | WordPress + WooCommerce met een eigen, lichtgewicht thema en een eigen functieplugin. Geen kant-en-klaar thema. |
| **Productlijn** | Pakketten pizzabollen (o.a. 6, 12 en 24 stuks) en schiacciata-deeg; prijs per bol zichtbaar. [TE BEVESTIGEN: actueel assortiment op de live site] |
| **"Zo werkt Deegh"** | Stap-voor-stap-uitleg met foto's per stap: van de doos, via de deegbol, op temperatuur, vormen en beleggen, tot bakken. Plus "Welke oven gebruik jij?" en "Lukt het nog niet helemaal?". |
| **Recepten** | Receptenbibliotheek met types (pizza, focaccia, schiacciata, borrel, seizoen) en gestructureerde data. |
| **Verkooppunten** | Overzicht van winkels waar Deegh te koop is. |
| **Zakelijk** | Aparte pagina en bestelroute voor zakelijke afnemers. |
| **Over Deegh** | Het verhaal achter het merk. |
| **SEO en migratie** | Redirects van oude naar nieuwe URL's, meta-tags en structured data. |
| **Merkstijl** | Warm grijs `#554f4f`, deeg-crème `#f0e8d3` en wit; Manrope als letter. Rustig en licht. |

## Vorm (wat iemand nu kan zien of gebruiken)

[TE BEVESTIGEN na bekijken van de live site]: een webshop waar je Deegh-pizzabollen bestelt, uitleg over hoe je er een
pizza van maakt, recepten, en waar je Deegh in de winkel vindt.

## Te bevestigen

- [TE BEVESTIGEN] Staat Deegh 2.0 live op deegh.nl? Zo ja, sinds wanneer?
- [TE BEVESTIGEN] **Rol bij het merk.** Wie ontwierp het Deegh-logo en de verpakking? Wat heeft Martijn zelf gemaakt?
  De briefing noemt "merk, product, verpakking, fotografie". Op de site claimen we alleen wat hij zelf deed.
- [TE BEVESTIGEN] **Herkomst van de foto's.** Zie hieronder.

## Rechten en toestemming

- Eigen merk van de eigenaar, dus geen toestemming van derden nodig voor naam en logo.
- Foto's: herkomst per beeld bevestigen (zie tabel).

## Beeldmateriaal (bestand · herkomst)

Beoordeeld: de beelden in het thema van de nieuwe webshop. EXIF-gegevens ontbreken bij alle bestanden.

| Beeld | Observatie | Bruikbaar als "echt"? |
|---|---|---|
| `hero-handen-deeg.jpg` (persoon met uitgerekt deeg, studiosetting) | Oogt als een gegenereerd of sterk bewerkt beeld. | **Nee**, tenzij bevestigd als echte foto. De briefing sluit gegenereerde personen uit. |
| `traject-0-doos.jpg` (doos met label "deegh PIZZADEEG") | Oogt als een mockup of render. | [TE BEVESTIGEN] Echte verpakking? Zo niet, niet als verpakkingswerk tonen. |
| `traject-optemp-2bollen.jpg` | Volgens de projectdocumentatie uitgesneden uit een eigen foto. | Waarschijnlijk wel; bevestigen. |
| Overige traject-, over- en insta-beelden | Niet individueel beoordeeld. | [TE BEVESTIGEN] |

**Advies:** gebruik voor de Denckh-case bij voorkeur **screenshots van de live webshop** en eigen, bevestigde foto's.
Juist bij een site die "geen nep" als principe heeft, ondermijnt één gegenereerd beeld het hele verhaal.

## Richting voor de casetekst (concept)

- Kop, optie A: **"Van deegbol tot merk."** (briefing; klopt alleen als de merkrol bevestigd is)
- Kop, optie B: **"Van deegbol tot webshop, en alles daartussen."**
- Kern: eigen product, eigen merk, eigen shop. Een idee dat Martijn zelf verder heeft gebracht dan een website.

## Logo (2026-09-29)

- Eigenaar: "het logo van Deegh mag je er ook op zetten" (2026-09-29), met het logo als afbeelding aangeleverd.
- Bestand: `public/images/deegh-logo.jpg` (uitsnede 356×356 rond de cirkel, metadata verwijderd). Herkomst: eigenaar.
- Gebruik: in de projectconstructie als stap "een merk": de deegbol rijst en wordt de cirkel van het logo.
- Wens: een scherpere versie (SVG of groter bestand); het huidige beeld is 429×571 en wordt op grote schermen iets
  vergroot.

## Eigen werk (2026-09-29)

Eigenaar: het Deegh-logo en het merk zijn door hemzelf bedacht en ontwikkeld, destijds samen met zijn broers. Denckh mag
dit als eigen werk presenteren; "deegbol → merk → webshop" klopt. (HANDOFF B-053)
