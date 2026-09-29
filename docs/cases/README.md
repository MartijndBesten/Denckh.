# Cases: register en verificatieprotocol

Hier staat welke projecten mogelijk als case op de Denckh-site komen, wat er al is gecontroleerd en wat nog niet.
**Een project komt pas op de site als het hieronder op *Geverifieerd* staat en de rechtenvraag is beantwoord.**

## Register

| Case | Bron(nen) | Status | Laatst gecontroleerd | Dossier |
|---|---|---|---|---|
| IntuSens-demokoffer | https://intusens-demokoffer.nl · publieke repo `MartijndBesten/intusens-demokoffer` | Geen toestemming voor naam, beelden of link (besluit eigenaar 2026-09-29); alleen anoniem en schematisch | 2026-09-29 | [intusens-demokoffer.md](intusens-demokoffer.md) |
| Deegh | https://deegh.nl · broncode (privé) | Goedgekeurd voor publicatie (naam en link), 2026-09-29; beeldherkomst nog open | 2026-09-29 | [deegh.md](deegh.md) |
| Loflijn | https://loflijn.nl (Shopify) | Goedgekeurd voor publicatie (naam en link), 2026-09-29; beelden nog niet aangeleverd | 2026-09-29 | [loflijn.md](loflijn.md) |
| 3D-werkdag | Privé-repository van de eigenaar | Anoniem en schematisch in "Ook gemaakt"; akkoord eigenaar 2026-09-29 | 2026-09-29 | [3d-werkdag.md](3d-werkdag.md) |
| Interactieve presentatie | Privé-repository van de eigenaar | Anoniem en schematisch in "Ook gemaakt"; akkoord eigenaar 2026-09-29 | 2026-09-29 | [presentatie.md](presentatie.md) |
| Autowasdag Sionkerk | Publieke repo `MartijndBesten/autowasdag-sionkerk` (`3162784`) | Goedgekeurd voor publicatie (naam en link), 2026-09-29, via eigenaar | 2026-09-29 | [autowasdag-sionkerk.md](autowasdag-sionkerk.md) |

Statussen: *Niet onderzocht* → *In onderzoek* → *Geverifieerd* → *Goedgekeurd voor publicatie*.

## Verificatieprotocol

Per case, in deze volgorde:

1. **Bron bekijken.** Open de live site en/of de repository. Noteer URL, datum en (bij een repo) commit-SHA.
2. **Feiten vastleggen.** Wat is het, voor wie, wat was de aanleiding en wat heeft Denckh concreet gedaan
   (rol en onderdelen)? Alleen wat je in de bron ziet of wat de eigenaar bevestigt.
3. **Onzekerheden benoemen.** Wat niet uit de bron blijkt, markeer je als `[TE BEVESTIGEN: …]`.
4. **Rechten en toestemming.** Staan er merken, logo's, beelden of namen van derden in? Leg vast wat publiek
   getoond mag worden en wie dat heeft bevestigd.
5. **Beeldmateriaal.** Maak zelf screenshots of gebruik materiaal van de eigenaar. Noteer de herkomst per bestand.
6. **Pas dan schrijven.** De casetekst bevat alleen punten uit stap 2 en 4. Geen verzonnen resultaten, cijfers of
   quotes.

## Per case een bestand

Leg het onderzoek per case vast in een eigen bestand in deze map, bijvoorbeeld `deegh.md`, met deze kopjes:

```markdown
# <Case>

- Bron(nen):
- Gecontroleerd op / door:
- Commit-SHA (bij repo):

## Wat is het
## Aanleiding / vraag
## Rol van Denckh
## Wat is er gemaakt
## Te bevestigen
## Rechten en toestemming
## Beeldmateriaal (bestand · herkomst)
```

> Let op: zolang deze repository publiek is, komen hier geen vertrouwelijke details uit privé-repositories of van
> opdrachtgevers/werkgevers (zie `CLAUDE.md`, regel 6).
