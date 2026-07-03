import { useState } from 'react'
import type { ChannelId, DraftStatus } from '../types'
import { CHANNEL_META, generateDrafts } from '../engine'
import { useStore } from '../store'
import { DraftCard } from '../components/DraftCard'
import { useToast } from '../components/ui'

type Filter = 'all' | DraftStatus | ChannelId

export function Studio({ onlyPending = false }: { onlyPending?: boolean }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState<Filter>(onlyPending ? 'pending' : 'all')
  const [working, setWorking] = useState(false)

  const connected = state.channels.filter((c) => c.connected).map((c) => c.id)

  const generate = () => {
    if (!state.soul || working) return
    setWorking(true)
    setTimeout(() => {
      dispatch({ type: 'ADD_DRAFTS', drafts: generateDrafts(state.soul!, connected, 3) })
      setWorking(false)
      toast('3 טיוטות חדשות נוספו לתור')
    }, 1600)
  }

  const drafts = state.drafts.filter((d) => {
    if (filter === 'all') return d.status !== 'rejected'
    if (filter === 'pending' || filter === 'approved' || filter === 'published' || filter === 'rejected')
      return d.status === filter
    return d.channel === filter && d.status !== 'rejected'
  })

  const statusFilters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'הכל' },
    { id: 'pending', label: `ממתין (${state.drafts.filter((d) => d.status === 'pending').length})` },
    { id: 'published', label: 'פורסם' },
  ]

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">CONTENT STUDIO</div>
        <h1>{onlyPending ? 'תור האישורים' : 'אולפן התוכן'}</h1>
        <p className="sub">
          {onlyPending
            ? 'כל מה שהסוכן ניסח ומחכה לחתימה שלך. אשר בקליק — או דחה, והוא ילמד.'
            : 'כל התוכן שהסוכן יצר, בכל הערוצים. הכל נולד מהנשמה המותגית שלך.'}
        </p>
      </header>

      <div className="filters">
        {statusFilters.map((f) => (
          <button key={f.id} className={`filter-chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
        <span style={{ width: 1, background: 'var(--rule)', margin: '0 0.3rem' }} />
        {connected.map((id) => (
          <button key={id} className={`filter-chip ${filter === id ? 'on' : ''}`} onClick={() => setFilter(id)}>
            {CHANNEL_META[id].label}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginInlineStart: 'auto' }} onClick={generate} disabled={working}>
          {working ? (
            <>
              הסוכן מנסח
              <span className="thinking">
                <i />
                <i />
                <i />
              </span>
            </>
          ) : (
            '+ בקש טיוטות חדשות'
          )}
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="empty">
          <div className="big">אין כאן כלום כרגע</div>
          <p>בקש טיוטות חדשות והסוכן ינסח אותן מהנשמה המותגית.</p>
        </div>
      ) : (
        <div className="drafts-grid stagger">
          {drafts.map((d) => (
            <DraftCard key={d.id} draft={d} />
          ))}
        </div>
      )}
    </div>
  )
}
