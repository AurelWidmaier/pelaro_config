const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

const kgFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Gramm -> "2,07 kg" (ab 1 kg) bzw. "323 g". */
export function formatWeight(grams: number): string {
  return grams >= 1000 ? `${kgFormatter.format(grams / 1000)} kg` : `${Math.round(grams)} g`
}
