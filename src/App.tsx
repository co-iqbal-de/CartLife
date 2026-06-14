import { lazy, Suspense } from 'react'
import { CartridgeProvider } from './context/CartridgeContext'
import { useCartridgeContext } from './context/CartridgeContext'

const SetupPage = lazy(() => import('./pages/SetupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

function Router() {
  const { cartridge } = useCartridgeContext()
  return cartridge ? <DashboardPage /> : <SetupPage />
}

function App() {
  return (
    <CartridgeProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
          <div style={{ color: '#00D4AA', fontSize: 24, fontWeight: 700 }}>
            Cart<span style={{ color: '#fff' }}>Life</span>
          </div>
        </div>
      }>
        <Router />
      </Suspense>
    </CartridgeProvider>
  )
}

export default App
