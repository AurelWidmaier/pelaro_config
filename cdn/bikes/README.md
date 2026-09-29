# Komplettbike-Bilder

Fertige Bilder eines ganzen Bikes. Sie werden im Konfigurator nur angezeigt,
wenn die Auswahl exakt zum Dateinamen passt:

    <rahmen>_<laufräder>_<schaltgruppe>.<png|jpg|jpeg|webp>

Beispiel: `spcycleR088_ent2_er7.png`

Die Kurznamen stehen als `imageKey` in `src/config/parts.ts`:

| Teil | imageKey |
|---|---|
| BXT Pro-145 Aero | `bxtPro145` |
| Spcycle R088 | `spcycleR088` |
| BXT Gravel 135 | `bxtGravel135` |
| Elitewheels ENT 2.0 | `ent2` |
| LTWOO ER7 2x12 | `er7` |

Groß-/Kleinschreibung ist egal. Neue Bilder einfach hier ablegen und pushen:
Der Pages-Workflow erzeugt daraus automatisch `manifest.json`, die App
kennt das Bild danach ohne Codeänderung. Für neue Teile einen `imageKey`
in `parts.ts` ergänzen.
