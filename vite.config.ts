import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { allPages, type PageMeta } from './src/seo/pages.ts'

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Titel, Beschreibung, Canonical und Open Graph einer Seite ins HTML schreiben. */
function withMeta(template: string, page: PageMeta, siteUrl: string): string {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const tags = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
  ]
  if (siteUrl) {
    tags.push(`<link rel="canonical" href="${siteUrl}${page.path}" />`, `<meta property="og:url" content="${siteUrl}${page.path}" />`)
  }
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)
}

/**
 * Beim Build bekommt jede öffentliche Seite eine eigene HTML-Datei mit passendem
 * Titel und Beschreibung (z. B. dist/tutorial/bremsen/index.html) – Suchmaschinen
 * sehen sie so schon ohne JavaScript. Dazu sitemap.xml und robots.txt.
 * Die Domain kommt aus VITE_SITE_URL (z. B. in .env.production).
 */
function seoPages(): Plugin {
  let outDir = 'dist'
  let siteUrl = ''
  return {
    name: 'pelaro-seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      siteUrl = (loadEnv(config.mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? '').replace(/\/$/, '')
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf-8')
      const pages = allPages()
      for (const page of pages) {
        const file = join(outDir, page.path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, withMeta(template, page, siteUrl))
      }

      const robots = ['User-agent: *', 'Disallow: /admin', '']
      if (siteUrl) {
        const urls = pages.map((page) => `  <url><loc>${siteUrl}${page.path}</loc></url>`).join('\n')
        writeFileSync(
          join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )
        robots.push(`Sitemap: ${siteUrl}/sitemap.xml`, '')
      } else {
        this.warn('VITE_SITE_URL fehlt – sitemap.xml und Canonical-Links werden nicht erzeugt.')
      }
      writeFileSync(join(outDir, 'robots.txt'), robots.join('\n'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
  server: {
    watch: {
      // Bildordner gehören nicht zur App. Unter Windows sind Dateien beim
      // Hineinkopieren kurz gesperrt (EBUSY), was den Dev-Server sonst abstürzen lässt.
      ignored: ['**/_incoming/**', '**/cdn/**', '**/dist/**'],
    },
  },
})
