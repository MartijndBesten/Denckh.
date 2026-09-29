# CLAUDE.md

Werkinstructies voor Claude (en andere AI-assistenten) in deze repository. Lees ook [`HANDOFF.md`](HANDOFF.md)
voordat je iets wijzigt: daar staat de actuele stand.

## Het project

- **Denckh** is een kleine creatieve conceptstudio.
- **Tagline:** `van idee naar vorm` (altijd zo geschreven: kleine letters, geen punt).
- Denckh werkt ideeën uit tot **digitale concepten, prototypes en bruikbare vormen**.
- Denckh is **nadrukkelijk breder dan webdesign**. Positioneer het nooit als "webdesignbureau".
- Deze repo bevat de nieuwe website voor Denckh. Het beoogde domein is `denckh.nl`.

## Harde regels

1. **Niets verzinnen.** Geen verzonnen claims, cases, klanten, opdrachtgevers, testimonials, quotes, cijfers,
   resultaten, awards, teamleden of klantlogo's. Ook geen onverifieerbare superlatieven.
   Ontbreekt informatie? Gebruik een duidelijk gemarkeerde placeholder (`[TODO: …]`) en meld het. Schrijf nooit
   geloofwaardig ogende nep-inhoud, ook niet tijdelijk.
2. **Cases alleen na verificatie.** Beschrijf een project pas als case nadat je de werkelijke inhoud hebt bekeken
   (live site en/of repository). Leg bron, datum en bevindingen vast in [`docs/cases/`](docs/cases/README.md).
   Wat je niet hebt gecontroleerd, benoem je als onzeker.
3. **Merken en rechten van derden.** Gebruik geen logo's, screenshots of namen van derden (bijv. werkgevers,
   leveranciers, opdrachtgevers) zonder vastgelegde toestemming. Suggereer geen opdrachtgeverschap dat niet klopt.
4. **Beslissingen vastleggen.** Elke belangrijke technische of creatieve beslissing komt in het beslissingenlog in
   `HANDOFF.md`: datum, besluit, reden, gevolg. Werk ook *Huidige stand* en *Open punten* bij aan het eind van een
   werksessie.
5. **Buiten scope tot expliciet akkoord van de eigenaar:**
   - hosting inrichten of wijzigen (waaronder Cloud86);
   - DNS aanpassen;
   - `denckh.nl` live zetten of een productie-deploy doen;
   - GitHub Pages of een andere publieke publicatie activeren;
   - secrets, API-keys of betaalde diensten toevoegen.
6. **Publieke repo.** Zolang deze repository publiek is, komt er geen vertrouwelijke informatie in (interne
   werkgeversinformatie, details uit privé-repositories, klantgegevens, contactgegevens van derden).

## Werkwijze

- **Taal:** websiteteksten en documentatie in het Nederlands. Code, bestandsnamen en identifiers mogen Engels zijn.
- **Toon (werkversie, nog vast te stellen in de creative direction):** direct, concreet, menselijk. Geen wollige
  marketingtaal.
- **Git:** `main` is de hoofdbranch. Kleine, beschrijvende commits. Grotere wijzigingen via een aparte branch en
  een pull request. Nooit force-pushen naar `main`.
- **Techniek:** het stackvoorstel staat in `HANDOFF.md` (B-010, B-011) en `docs/architectuur.md`. Voeg geen
  framework, dependencies of buildtooling toe zolang die besluiten de status *Voorstel* hebben.
- **Ontwerp:** volg `docs/creative-direction.md`. Er is één bewegingstaal (tekenen → invullen). Voeg geen losse
  effecten toe die daarbuiten vallen.
- **Twijfel:** stel een korte, gerichte vraag aan de eigenaar in plaats van een harde aanname te maken.

## Naam en schrijfwijze

- De naam is **Denckh**. In het bestaande beeldmerk staat een punt achter de naam ("Denckh.") in een accentkleur.
- De GitHub-repository heet `Denckh.` (met punt). Zie open punt over de reponaam in `HANDOFF.md`.
- Of de punt ook in lopende tekst wordt geschreven, is nog niet besloten (open punt).
