import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Tutorial } from './pages/Tutorial'
import { ConfiguratorPage } from './pages/Configurator/ConfiguratorPage'
import { ConfiguratorProvider } from './context/ConfiguratorContext'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route
            path="/konfigurator"
            element={
              <ConfiguratorProvider>
                <ConfiguratorPage />
              </ConfiguratorProvider>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App
