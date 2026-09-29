# Export-Bilder

Spezielle Komplettbike-Bilder für den PDF-Export („Als PDF herunterladen“ im
Ergebnis). Gleiches Namensschema wie in `cdn/bikes/`:

    <rahmen>_<laufräder>_<schaltgruppe>.<png|jpg|jpeg|webp>

Beispiel: `spcycleR088_ent2_er7.png` (Kurznamen siehe `cdn/bikes/README.md`).

Gibt es hier kein Bild für die Kombination, nimmt der Export das
Vorschaubild aus `cdn/bikes/` (mit Hinweis „KI-Bild · nur Vorschau“), sonst
das Rahmenbild. Neue Bilder einfach ablegen und pushen: Der Pages-Workflow
erzeugt `manifest.json` automatisch.

Empfehlung: Querformat, ca. 2400 × 1440 px (5:3), freigestellt oder auf
hellem Hintergrund.
