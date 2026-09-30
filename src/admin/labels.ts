import type { ProductCategory } from '../config/parts'

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  frame: 'Rahmen',
  groupset: 'Schaltgruppen',
  wheels: 'Laufräder',
}

export const BIKE_TYPE_LABEL: Record<string, string> = {
  rennrad: 'Rennrad',
  gravel: 'Gravel',
  'race-gravel': 'Race-Gravel',
  'hardtail-mtb': 'Hardtail-MTB',
}
