/** Domain der Seite – per VITE_SITE_URL festlegbar, sonst die aktuelle. */
export function siteUrl(path = ''): string {
  const base: string = import.meta.env.VITE_SITE_URL ?? window.location.origin
  return base.replace(/\/$/, '') + path
}

/** Brotkrumen-Pfad als schema.org BreadcrumbList. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  }
}
