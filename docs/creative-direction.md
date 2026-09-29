# Creative direction

Status: **ronde "Het punt", 2026-09-29.** Gebouwd op branch `creatief/het-punt`, nog niet live. Vervangt de
eerdere versie van dit document (die staat in de Git-geschiedenis).

---

## 1. Kern

**De website is zelf een Denckh-project.** Je ervaart op de site wat Denckh voor een idee doet: iets vaags wordt
begrepen en krijgt een vorm die je kunt gebruiken.

De toets bij elke beslissing: *had dit op een andere bureausite kunnen staan?* Zo ja, dan opnieuw.

## 2. Het concept: *Het punt*

```
PUNT  →  LIJN  →  SCHETS  →  IDEE  →  VORM
jij      jij      Denckh kijkt   Denckh leest   samen
```

De punt achter **"Mooi."** in de openingszin is het idee. Je trekt hem uit de zin en tekent. In de zin blijft een lege
ring achter: het idee is eruit. Je lijn laat je niet meer los: hij komt verderop in de site terug.

## 3. De interactieve kern: *begin met een punt*

| Moment | Wat je ziet | Waarom |
|---|---|---|
| **Punt** | De punt staat als leesteken in de kop, ademt heel licht, leunt een fractie naar je cursor. Een vaag potloodspoor wijst naar het tekenvlak. | Uitnodigen zonder uitleg. |
| **Tekenen** | Inkt in oker. Snel bewegen = dunne lijn, langzaam = de inkt loopt uit. De pen volgt met lichte traagheid, zodat het niet voelt als Paint. | Een ontworpen materiaal, geen tekenprogramma. |
| **Loslaten** | De lijn organiseert zich: trillingen verdwijnen, de vorm blijft van jou. | Eerste stap van vaag naar helder. |
| **Denckh kijkt** | Rode potloodaantekeningen: hoekmarkeringen, cirkels op hoeken, een maatlijn, labels als "gesloten · rond · 1,1 : 1". | Zo kijkt een ontwerper naar een schets. Het is meten, geen raden. |
| **Lezing** | Eén zin: "Iets ronds en gesloten. Ik zie hier misschien een bediening in." Plus: "Dat hoeft het niet te zijn. Het is een begin." | Geen Pictionary. Een voorzichtige interpretatie. |
| **Vorm** | Op "Zal ik er vorm aan geven?" loopt je lijn punt voor punt over in een eerste vorm, gemaakt van dezelfde punten. | Letterlijk van idee naar vorm. |
| **Gebruik** | De vorm werkt: een draaiknop die draait, een regelaar die schuift, een scherm met keuzes, een verloop met meetpunten, een route in stappen, een ideeënkaart. | "Iets dat je kunt zien, testen of gebruiken." |
| **Vraag** | "Wat zat er ongeveer in je hoofd?" Eén zin. Voorbeeldreactie koppelt je zin aan de vorm en stelt een vervolgvraag. | De opstap naar een gesprek. |

Zes vormen, gekozen uit meetbare eigenschappen van de lijn (niet willekeurig):

| Lijn | Vorm |
|---|---|
| gesloten en rond | draaiknop |
| gesloten met hoeken | scherm |
| open en recht | regelaar |
| open, gaat één kant op, golft | verloop (visualisatie) |
| open met keerpunten | route |
| kruist zichzelf, meerdere lussen | ideeënkaart |

Toetsenbord: Enter pakt de punt, pijltjes tekenen, Enter laat los, Escape stopt. Voor wie niet wil tekenen: "of bekijk
een voorbeeld". Reduced motion: geen ademen, geen letterbeweging, overgangen direct.

## 4. De interactieve grammatica voor de hele site

Eén regel: **iets vaags krijgt steeds meer vorm, gemaakt van jouw lijn.**

| Moment | Grammatica |
|---|---|
| **Overgangen** | Jouw lijn, uitgerold tot een horizontale lijn met hetzelfde ritme, tekent zich tussen secties. Klein label: "jouw lijn". |
| **Van idee naar vorm.** | De letters liggen los en vinden hun plek terwijl je scrolt. Van losse tekens naar een woord. |
| **Projecten** | Geen kaartjes. Elk project wordt opgebouwd uit jouw lijn: via tussenvormen naar het project zelf. Scroll bepaalt hoe ver het is, de pagina scrolt normaal. |
| **Wat kan eruit komen?** | Hetzelfde materiaal (jouw lijn) neemt steeds een andere vorm aan: website, prototype, tool, presentatie, demo, spel, visualisatie, webshop, uitleg. De laatste, "iets waar nog geen naam voor is", blijft bewust een krabbel. |
| **Zo werkt het** | Vertel → Denckh → Vorm, getekend met jouw eigen lijn: de ruwe lijn, dezelfde lijn met rode aantekeningen, de vorm die jij bovenaan kreeg. "Wat er bovenaan met je lijn gebeurde, is precies hoe het werkt." |
| **Contact** | De punt komt terug: "En wat zit er bij jou in je hoofd?" Je schets en je zin staan klaar om mee te nemen. |
| **Woordmerk** | De punt in het logo neemt de vorm aan die jouw idee kreeg. |
| **Micro-interacties** | Links: een met de hand getekende onderstreping tekent zich. Knoppen: vullen zich met inkt van links naar rechts. Focus: inktlijn. Selectie: oker. Geen `translateY(-2px)` met schaduw. |

**Twee "hoe hebben ze dát gedaan"-momenten:**

1. **De punt is een leesteken.** Het interactieve element is de punt achter "Mooi." en laat een lege plek in de zin achter.
2. **Je lijn wordt de site.** Dezelfde krabbel wordt scheidslijn, projectconstructie, uitkomstmateriaal, werkwijze en
   logo. Wie opnieuw tekent, ziet de hele site meeveranderen.

## 5. Visuele wereld

**Kleur heeft een rol, geen decoratie:**

| Rol | Kleur | Token |
|---|---|---|
| jouw idee | oker `#C29258` (lijn `#B07F45`) | `--ochre`, `--idea` |
| Denckh kijkt | menie `#B63F26`, de kleur van rood potlood | `--menie` |
| de vorm | inkt `#211F1D` | `--ink` |
| drager | papier `#F7F4EE`, met een heel lichte vezel | `--paper` |

Menie is het beperkte tweede accent. Het doet één ding: laten zien dat Denckh kijkt. Contrast op papier: inkt 15,5 : 1,
grafiet 5,2 : 1, menie 5,1 : 1, oker alleen voor lijnen en vlakken.

**Materiaal:** papier, potlood, inkt, maatlijnen. Geen gradients, geen glas, geen schaduwen, geen rounded cards.

**Typografie:** zie `docs/typografie-proef.md`. Werkhypothese: Fraunces (soft) met ck-ligatuur voor het woordmerk en
grote zinnen, Manrope voor tekst.

**Beeld:** alleen echte beelden. Waar rechten ontbreken, zijn projecten schematisch opgebouwd uit lijnen en als
"schematisch" gemarkeerd. Portretplek staat klaar: "hier komt een echte foto. geen gegenereerde."

## 6. Toon

Ik-vorm waar het persoonlijk is, Denckh als naam, nooit "wij". Kort, direct, met een droge knipoog. De verboden lijst uit
de briefing geldt onverkort.

## 7. Wat bewust níet

Geen scrolljacking, geen WebGL, geen animatiebibliotheek, geen AI-imitatie die doet alsof ze echt is (de site zegt
eerlijk: "reageert met vaste regels in je browser").
