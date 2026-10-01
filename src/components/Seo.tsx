import { useEffect } from 'react'
import { SITE_NAME, type PageMeta } from '../seo/pages'
import { siteUrl } from '../seo/url'

interface SeoProps {
  meta: PageMeta
  /** Strukturierte Daten (schema.org) für Google */
  jsonLd?: object | object[]
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Setzt Titel, Beschreibung, Canonical, Open Graph und JSON-LD der aktuellen Seite.
 * Beim Build bekommt jede Seite dieselben Angaben schon ins HTML (vite.config.ts).
 */
export function Seo({ meta, jsonLd, noindex }: SeoProps) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const url = siteUrl(meta.path)
    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:site_name', SITE_NAME)
    setCanonical(url)

    document.getElementById('page-jsonld')?.remove()
    if (ld) {
      const script = document.createElement('script')
      script.id = 'page-jsonld'
      script.type = 'application/ld+json'
      script.textContent = ld
      document.head.appendChild(script)
    }
  }, [meta.path, meta.title, meta.description, noindex, ld])

  return null
}
