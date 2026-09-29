const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const centFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Ganze Beträge ohne, krumme Beträge mit Cent: "649 €" bzw. "17,69 €". */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? currencyFormatter.format(rounded) : centFormatter.format(rounded)
}

const kgFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Gramm -> "2,07 kg" (ab 1 kg) bzw. "323 g". */
export function formatWeight(grams: number): string {
  return grams >= 1000 ? `${kgFormatter.format(grams / 1000)} kg` : `${Math.round(grams)} g`
}
