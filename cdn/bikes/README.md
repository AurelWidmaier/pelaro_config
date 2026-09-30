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
| Elitewheels SLR Gravel | `slr` |
| RUJIXU RD300 Alu | `rujix` |
| LTWOO ER7 2x12 | `er7` |
| LTWOO GRT12 1x12 | `grt12` |
| LTWOO R9 2x11 | `r9` |

## Unterordner

- `jpg/` – derselbe Build als Foto mit Hintergrund, gleicher Dateiname wie das
  PNG (z. B. `jpg/spcycleR088_ent2_er7.jpg`). Im Konfigurator per Klick oder
  Wischen das zweite Bild; es füllt die ganze Bildfläche.
- `real/<rahmen>/` – echte Fotos, nur nach Rahmen sortiert (siehe `real/README.md`).

Groß-/Kleinschreibung ist egal. Neue Bilder einfach hier ablegen und pushen:
Der Pages-Workflow erzeugt daraus automatisch `manifest.json`, die App
kennt das Bild danach ohne Codeänderung. Für neue Teile einen `imageKey`
in `parts.ts` ergänzen.
