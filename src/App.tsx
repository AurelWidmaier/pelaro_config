import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ConsentBanner } from './components/ConsentBanner'
import { CatalogGate } from './components/CatalogGate'
import { Home } from './pages/Home'
import { Tutorial } from './pages/Tutorial'
import { Shop } from './pages/Shop'
import { ConfiguratorPage } from './pages/Configurator/ConfiguratorPage'
import { ConfiguratorProvider } from './context/ConfiguratorContext'
import { trackPageView } from './lib/analytics'

// Der Admin-Bereich wird nur geladen, wenn jemand /admin aufruft.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/konfigurator"
            element={
              <CatalogGate>
                <ConfiguratorProvider>
                  <ConfiguratorPage />
                </ConfiguratorProvider>
              </CatalogGate>
            }
          />
        </Routes>
      </main>
      <ConsentBanner />
    </>
  )
}

export default App
