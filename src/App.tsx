import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial" }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#0f172a', letterSpacing: 0.2 }}>
              Crypto Intelligence Dashboard
            </Link>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#475569' }}>Enterprise View</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
