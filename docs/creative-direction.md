# Creative direction

Status: **voorstel, 2026-09-29.** Wacht op akkoord van de eigenaar. Onderdelen met *(proef)* worden in fase 4
gevalideerd met een visuele proef.

---

## 1. Kern in één zin

**Denckh maakt van een idee iets dat je kunt zien, testen of gebruiken, en de site laat dat zelf gebeuren.**

De bezoeker moet na het bezoek denken: *"Hier kan ik met een vaag idee naartoe, en dan ontstaat er iets."*

## 2. Het concept: *Het punt*

De punt achter **denckh.** is het idee. Op de site volg je die ene punt terwijl hij vorm krijgt.

```
punt  →  lijn  →  schets  →  vlak  →  vorm
idee     denken   verkennen   structuur  iets echts
```

Het concept heeft twee lagen. Ze gebruiken dezelfde bewegingstaal.

### 2a. Bovenaan: *Krabbel → vorm* (interactie)

In de hero staat een grote okerkleurige punt. Die kun je vastpakken en slepen (muis of vinger). Terwijl je sleept,
laat de punt een ruwe potloodlijn achter: jouw vage idee. Laat je los, dan trekt de krabbel zich rustig samen tot een
schone vorm, bijvoorbeeld een cirkel, een afgerond vlak of een lijn. Welke vorm het wordt, hangt af van wat je tekende.
Klein label: *vorm.* Daarna keert de punt terug.

- Doet de bezoeker niets? Dan speelt het één keer vanzelf af, kort en rustig.
- Het is een aanbod, geen opdracht: alle inhoud is leesbaar zonder interactie.
- Op mobiel reageert alleen een veeg die **op de punt** begint. De rest van het scherm scrolt gewoon (geen
  scroll-kaping).
- Waarom dit sterker is dan alleen een scroll-animatie: de bezoeker ervaart "van idee naar vorm" binnen 5 seconden met
  de eigen hand. Het is de belofte van Denckh in het klein.

### 2b. Tijdens het scrollen: *de rode draad* (verhaal)

Als je verder scrolt, verlaat de punt de hero en wordt hij een dunne okerlijn:

1. **Punt:** de hero.
2. **Lijn:** naast de tekst "Van idee naar vorm." trekt de punt een lijn.
3. **Schets:** de lijn loopt uit in een losse, handgetekende contour (net niet recht).
4. **Vlak:** de contour sluit en vult zich rustig met een vlak.
5. **Vorm:** het vlak wordt het kader van het eerste echte project. Er verschijnt een screenshot of foto in.

Daarna volgen de projecten: de vorm die ideeën eerder kregen. Aan het eind keert de punt terug bij het
contactformulier: *jouw idee is het volgende punt.* Het verhaal is rond.

## 3. Bewegingstaal: *tekenen → invullen*

Eén motion language, overal consequent:

| Regel | Invulling |
|---|---|
| **Wat beweegt** | Alleen de punt en de lijn in oker. De rest staat stil. |
| **Hoe** | Een lijn tekent zichzelf (SVG `pathLength`/`stroke-dashoffset`) en daarna vult of verschijnt de vorm (opacity, clip-path). |
| **Karakter** | Licht handmatig: vooraf berekende, iets "wiebelige" paden. Geen random ruis per frame. |
| **Tempo** | Rustig. 500–1200 ms, ease-out (`cubic-bezier(.2,.7,.2,1)`). Geen bounce. Alleen de hero-punt veert licht (spring). |
| **Scroll-gekoppeld** | Alleen de intro (punt → vorm), en alleen op brede schermen, maximaal ca. 1,5 schermhoogte vastgezet. Op mobiel spelen dezelfde beelden af zodra ze in beeld komen, zonder vastzetten. |
| **Hover op cases** | Over de echte screenshot ligt eerst een lijntekening (wireframe/contour). Bij hover of focus tekent die zich af en verschijnt het echte beeld. Op touch gebeurt dit één keer bij in beeld komen. |
| **Reduced motion** | Alles staat meteen in de eindstand, geen scroll-koppeling. De hero-punt is statisch; de krabbel-interactie blijft beschikbaar zonder animatie van de overgang. |

**Bewust niet:** parallax-lagen, zwevende blobs, cursor-trails over de hele pagina, tekst die letter voor letter
invliegt, 3D/WebGL, confetti.

## 4. Visuele identiteit

### Kleur

Afgeleid van het bestaande logo (gemeten: achtergrond `#FAF8F3`, tekst `#363434`, punt `#C8A477`).

| Token | Hex | Gebruik | Contrast |
|---|---|---|---|
| `papier` | `#FAF8F3` | Paginagrond | – |
| `papier-2` | `#F1ECE2` | Rustige banden en vlakken | – |
| `inkt` | `#363434` | Tekst, lijnen UI | 11,7 : 1 op papier |
| `grafiet` | `#6E6862` | Secundaire tekst, labels | 5,2 : 1 op papier (AA) |
| `potlood` | `#A8A29A` | Schetslijnen (decoratief, geen tekst) | – |
| `oker` | `#C8A477` | De punt, de lijn, vlakken. **Nooit als kleine tekst op licht** (2,2 : 1) | 5,3 : 1 op inkt |
| `oker-diep` | `#7A5C33` | Tekstaccent als oker leesbaar moet zijn | 5,8 : 1 op papier |
| `nacht` | `#1F1E1D` | Donkere secties (bijv. een case) | 15,7 : 1 met papier |

**Geen extra frisse accentkleur.** De punt moet het enige zijn dat "leeft". Een tweede accent verdunt dat. Als het
ontwerp in fase 4 te braaf blijkt, is een koel *blauwdrukblauw* voor alleen de schetsfase het eerste alternatief om te
testen.

### Case-werelden

Het Denckh-kader (typografie, punt, lijn) blijft constant. Binnen elke case domineert de **eigen identiteit van het
project**, zodat bezoekers de reikwijdte zien:

- **Deegh:** licht, crème en warm grijs, beeldgedreven.
- **IntuSens-demokoffer:** zwart en wit, technisch, strak (zoals de site zelf).
- **Loflijn:** volgt uit het bekijken van de site.

### Typografie *(proef)*

| Rol | Voorstel | Waarom | Alternatief voor de proef |
|---|---|---|---|
| Logo en grote statements | **Young Serif** (OFL) | Zwaar, zacht, iets eigenwijs, oude-letter-gevoel zonder historisch te worden. Sluit aan bij het bestaande logo. | Fraunces (variabel, "soft"-as) |
| Tekst en interface | **Manrope** (OFL) | Helder en modern. Deegh gebruikt hem ook: dezelfde stem, ander karakter. Familie zonder kopie. | Hanken Grotesk |

- Displayletter **alleen** voor het logo, de hero en een handvol zinnen. Nooit voor lopende tekst of UI.
- Maatvoering ingetogen: hero ≈ `clamp(2.5rem, 7vw, 5rem)`, sectiekoppen ≈ 2–2,5rem, body 18px, regelafstand 1,6,
  regelbreedte ≤ 66 tekens.
- Fonts zelf hosten (geen Google Fonts-verzoeken: sneller en privacyvriendelijk).

### Logo

- Werkvoorstel: **denckh.** in kleine letters (zoals de briefing en als zusje van "deegh"), gezet in de displayletter,
  met de punt als los SVG-element in oker. Zo kan dezelfde punt in logo, hero en contact terugkomen.
- Het bestaande PNG-logo heeft een hoofdletter D ("Denckh.") en de tagline eronder. Keuze hoofdletter of kleine
  letter: **open punt**.
- Nodig: definitieve logovorm als SVG.

### Beeld

- Alleen echte screenshots en echte foto's. Geen stockbeelden, geen gegenereerde mensen.
- Screenshots in een rustig, consistent kader: geen schuine 3D-mockups, geen apparaatfoto's met glans.
- Portret van de maker: plek gereserveerd, pas vullen met een echte foto.

### Vorm en details

- Hoeken: recht of licht afgerond (≤ 4px). Geen "rounded cards" overal.
- Scheiding door witruimte en dunne lijnen, niet door kaarten met schaduw.
- Iconen: geen iconensets. Waar nodig een kleine, met de hand getekende lijn in de stijl van de schetsen.

## 5. Toon

- **Ik** waar het persoonlijk is, **Denckh** als naam. Nooit "wij".
- Kort, direct, concreet, met een droge knipoog. Aanspreken met *je*.
- Eerst het beeld of voorbeeld, dan de uitleg.

**Verboden woorden en frasen** (briefing, aangevuld): *impact creëren, innovatieve digitale oplossingen, jouw digitale
partner, oplossingen op maat, grenzen verleggen, ideeën tot leven brengen, passie, full service, next level,
cutting-edge, ontzorgen, naadloos, state of the art, gamechanger, boost, one-stop-shop, vrijblijvende offerte.*

**Voorbeeld van de toon:**

> Soms weet je precies wat je wilt. Soms heb je alleen een gedachte waarvan je denkt: hier zit iets in.
> Denckh denkt mee, maakt het zichtbaar en bouwt een eerste vorm.

## 6. Wat de site bewust níet is

Geen hero → diensten → drie kaarten → over mij → formulier. Geen gradients, blobs, glassmorphism, badges,
nep-statistieken, logo-muren of testimonials. Geen eindeloze secties: de homepage heeft **zeven** blokken en is binnen
ongeveer acht schermhoogtes op mobiel klaar.
