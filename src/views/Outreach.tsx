import { useState } from 'react'
import type { OutreachContact } from '../types'
import { useStore } from '../store'
import { useToast } from '../components/ui'

function ContactCard({ c }: { c: OutreachContact }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const { state } = useStore()
  const [open, setOpen] = useState(false)
  const [stamp, setStamp] = useState<null | 'approve' | 'reject'>(null)

  const act = (status: 'sent' | 'rejected') => {
    setStamp(status === 'sent' ? 'approve' : 'reject')
    setTimeout(() => {
      dispatch({ type: 'SET_OUTREACH_STATUS', id: c.id, status })
      if (status === 'sent') toast(`נשלח מ-${state.soul?.agentEmail ?? 'המייל של הסוכן'}`)
      setStamp(null)
    }, 1050)
  }

  return (
    <article className="card lift draft" style={{ opacity: c.status === 'rejected' ? 0.5 : 1 }}>
      {stamp && (
        <div className={`stamp ${stamp === 'reject' ? 'reject' : ''}`}>
          <span>{stamp === 'approve' ? 'נשלח' : 'נדחה'}</span>
        </div>
      )}
      <div className="draft-top">
        <span className="chan-chip" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{c.name}</span>
        <span className="kind-chip">{c.platform}</span>
        {c.status !== 'pending' && (
          <span className={`status-tag ${c.status === 'sent' ? 'status-published' : 'status-rejected'}`} style={{ marginInlineStart: 'auto' }}>
            {c.status === 'sent' ? 'נשלח ✉' : 'נדחה'}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '-0.3rem' }}>{c.role}</div>

      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal-deep)', marginBottom: '0.35rem' }}>
          למה דווקא הוא/היא
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.35rem' }}>
          {c.why.map((w) => (
            <li key={w} style={{ fontSize: '0.85rem', color: 'var(--ink-2)', paddingInlineStart: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', insetInlineStart: 0, color: 'var(--teal)', fontWeight: 700 }}>›</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: 'var(--card-2)', border: '1px solid var(--rule-2)', borderRadius: 'var(--r-m)', padding: '0.8rem 0.95rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--faint)', fontWeight: 500 }}>נושא: </span>
          <bdi>{c.subject}</bdi>
        </div>
        <p className={`body ${open ? 'open' : ''}`} style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', direction: 'ltr', textAlign: 'left', fontFamily: 'var(--sans)' }}>
          {c.email}
        </p>
        <button className="expand" onClick={() => setOpen(!open)}>
          {open ? 'פחות' : 'קרא את כל המייל'}
        </button>
      </div>

      {c.status === 'pending' && (
        <div className="draft-actions">
          <button className="btn btn-primary btn-sm" onClick={() => act('sent')} disabled={!!stamp}>
            אשר ושלח ✉
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => act('rejected')} disabled={!!stamp}>
            דחה
          </button>
        </div>
      )}
    </article>
  )
}

export function Outreach() {
  const { state } = useStore()
  const soul = state.soul!
  const pending = state.outreach.filter((c) => c.status === 'pending').length

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">OUTREACH</div>
        <h1>קשרים — אחד־אחד</h1>
        <p className="sub">
          הסוכן מגלה אנשים שהעולם של {soul.businessName} רלוונטי להם באמת, נכנס לעומק של מי שהם, וכותב לכל אחד
          מייל אחר. אפס העתק־הדבק. אתה מאשר — הוא שולח.
        </p>
      </header>

      <div className="card panel" style={{ marginBottom: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal-soft)', display: 'grid', placeItems: 'center', fontSize: '1.1rem' }}>✉</span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700 }}>המייל של הסוכן</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--teal-deep)', direction: 'ltr', textAlign: 'start' }}>
            {soul.agentEmail ?? `agent@${soul.businessName.toLowerCase().replace(/\s/g, '')}.com`}
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', maxWidth: 320 }}>
          תיבה ייעודית שהסוכן מתפעל: שולח פניות, קורא תשובות, ומעביר אליך כל הזדמנות חמה. בדמו — סימולציה.
        </div>
      </div>

      {pending === 0 && state.outreach.length > 0 && (
        <div className="empty" style={{ marginBottom: '1.3rem' }}>
          <div className="big">כל הפניות טופלו ✉</div>
          <p>הסוכן ימשיך לגלות אנשים חדשים בריצת הלילה הבאה.</p>
        </div>
      )}

      <div className="drafts-grid stagger">
        {state.outreach.map((c) => (
          <ContactCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  )
}
