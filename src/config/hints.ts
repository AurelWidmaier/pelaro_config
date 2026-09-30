/**
 * Einsteiger-Tipps („Nimm das, wenn …“) für Unterauswahlen, nach der ID der
 * Varianten-Gruppe. Produkt-Tipps stehen am Produkt selbst (Feld `hint`).
 */
export const VARIANT_HINTS: Record<string, string> = {
  size: 'Nimm die Größe, die zu deiner Körpergröße passt – der Größenrechner unten hilft dir dabei.',
  finish: 'Reine Geschmackssache: Matt wirkt edel und zeigt Kratzer weniger, Glänzend lässt sich leichter putzen.',
  color: 'Reine Optik – Schwarz ist am günstigsten, Lackierungen kosten Aufpreis.',
  crankLength:
    'Nimm 165 mm bis etwa 170 cm Körpergröße, 170 mm bis etwa 180 cm, 172,5 mm bis etwa 188 cm und darüber 175 mm.',
  chainring:
    'Kleinere Zähnezahlen machen es bergauf leichter. Nimm die kleinste Option, wenn du einsteigst oder viele Berge fährst.',
  cassette:
    'Je größer die höchste Zahl (z. B. 34T oder 50T), desto leichter kommst du bergauf. Nimm die größte, wenn du einsteigst oder es bei dir hügelig ist.',
  bottomBracket: 'Wird automatisch passend zu deinem Rahmen gewählt – hier musst du nichts tun.',
  rimDepth:
    'Nimm 30–38 mm, wenn du viel bergauf oder bei Wind fährst (leichter und ruhiger), 45–50 mm als Allrounder und höher nur für schnelle, flache Strecken.',
  bearing: 'Nimm Stahllager – sie sind günstiger und robust. Keramiklager rollen nur minimal leichter.',
  freehub: 'Wird automatisch passend zu deiner Schaltgruppe gewählt.',
  hub: 'Nimm 6 Sperrklinken, wenn du sparen willst. Die 36T-Zahnscheibe greift schneller und hält länger.',
  tireWidth:
    'Nimm 40 mm, wenn du viel auf Asphalt und festem Schotter fährst, 45 mm für mehr Komfort und Grip auf ruppigen Wegen.',
}
