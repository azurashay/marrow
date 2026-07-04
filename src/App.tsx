import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import { ToastProvider } from './components/ui'
import { Onboarding } from './views/Onboarding'
import { Dashboard } from './views/Dashboard'
import { Studio } from './views/Studio'
import { Research } from './views/Research'
import { Outreach } from './views/Outreach'
import { Soul } from './views/Soul'
import { Settings } from './views/Settings'

type View = 'dashboard' | 'approvals' | 'studio' | 'research' | 'outreach' | 'soul' | 'settings'

const NAV: { id: View; label: string; glyph: string }[] = [
  { id: 'dashboard', label: 'לוח הבקרה', glyph: '◉' },
  { id: 'approvals', label: 'תור האישורים', glyph: '✓' },
  { id: 'studio', label: 'אולפן התוכן', glyph: '✎' },
  { id: 'research', label: 'מחקר', glyph: '☌' },
  { id: 'outreach', label: 'קשרים', glyph: '✉' },
  { id: 'soul', label: 'הנשמה', glyph: '✦' },
  { id: 'settings', label: 'שליטה', glyph: '◈' },
]

function Shell() {
  const { state } = useStore()
  const [view, setView] = useState<View>('dashboard')

  if (!state.onboarded) return <Onboarding />

  const pendingCount = state.drafts.filter((d) => d.status === 'pending').length
  const outreachCount = state.outreach.filter((c) => c.status === 'pending').length

  return (
    <div className="shell">
      <nav className="side">
        <div className="brand">
          <span className="mark" />
          <div>
            <div className="name">Marrow</div>
            <div className="tag">marketing agent</div>
          </div>
        </div>
        {NAV.map((n) => (
          <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="glyph">{n.glyph}</span>
            {n.label}
            {n.id === 'approvals' && pendingCount > 0 && <span className="badge">{pendingCount}</span>}
            {n.id === 'outreach' && outreachCount > 0 && <span className="badge">{outreachCount}</span>}
          </button>
        ))}
        <div className="foot">
          <div className={`agent-pill ${state.paused ? 'paused' : ''}`}>
            <span className="dot" />
            {state.paused ? 'הסוכן מושהה' : 'הסוכן ער ועובד'}
          </div>
        </div>
      </nav>
      <main className="main">
        {view === 'dashboard' && <Dashboard goTo={(v) => setView(v as View)} />}
        {view === 'approvals' && <Studio key="approvals" onlyPending />}
        {view === 'studio' && <Studio key="studio" />}
        {view === 'research' && <Research />}
        {view === 'outreach' && <Outreach />}
        {view === 'soul' && <Soul />}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </StoreProvider>
  )
}
