import { useStore } from '../store'
import { timeAgo } from '../components/ui'
import { DraftCard } from '../components/DraftCard'

export function Dashboard({ goTo }: { goTo: (v: string) => void }) {
  const { state } = useStore()
  const pending = state.drafts.filter((d) => d.status === 'pending')
  const published = state.drafts.filter((d) => d.status === 'published')
  const totalEng = published.reduce((s, d) => s + (d.engagement ?? 0), 0)
  const best = [...published].sort((a, b) => (b.engagement ?? 0) - (a.engagement ?? 0))[0]

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">DASHBOARD</div>
        <h1>בוקר טוב, {state.soul?.businessName} ☕</h1>
        <p className="sub">
          {state.paused
            ? 'הסוכן מושהה. שום דבר לא יוצא עד שתחזיר אותו.'
            : pending.length > 0
              ? `הסוכן עבד בלילה — ${pending.length} טיוטות מחכות לאישור שלך.`
              : 'הכל מאושר. הסוכן ממשיך לעבוד ברקע.'}
        </p>
      </header>

      <div className="stat-row stagger">
        <div className="card stat">
          <div className="k">ממתינות לאישור</div>
          <div className="v">{pending.length}</div>
          <div className="d">{pending.length > 0 ? 'קליק אחד מפרסום' : 'נקי לגמרי'}</div>
        </div>
        <div className="card stat">
          <div className="k">פורסמו</div>
          <div className="v">{published.length}</div>
          <div className="d">מאז שהתחלנו</div>
        </div>
        <div className="card stat">
          <div className="k">אינטראקציות</div>
          <div className="v">{totalEng.toLocaleString()}</div>
          <div className="d">{best ? `הכי חזק: ${best.engagement} בפוסט אחד` : '—'}</div>
        </div>
        <div className="card stat">
          <div className="k">תובנות מחקר</div>
          <div className="v">{state.research.length}</div>
          <div className="d">{state.research.filter((r) => !r.usedInDraft).length} עוד לא נוצלו</div>
        </div>
      </div>

      <div className="dash-grid">
        <section>
          <div className="panel-head" style={{ marginBottom: '0.9rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>ממתין לחתימה שלך</h3>
            {pending.length > 2 && (
              <button className="more" onClick={() => goTo('approvals')}>
                לכל התור ←
              </button>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="empty">
              <div className="big">התור ריק ✨</div>
              <p>הסוכן ינסח טיוטות חדשות בריצת הלילה הבאה, או שתבקש עכשיו מאולפן התוכן.</p>
            </div>
          ) : (
            <div className="drafts-grid stagger">
              {pending.slice(0, 2).map((d) => (
                <DraftCard key={d.id} draft={d} />
              ))}
            </div>
          )}
        </section>

        <aside className="card panel">
          <div className="panel-head">
            <h3>מה הסוכן עשה</h3>
          </div>
          <div className="feed">
            {state.activity.length === 0 && <p style={{ color: 'var(--faint)', fontSize: '0.88rem' }}>עוד אין פעילות.</p>}
            {state.activity.slice(0, 9).map((a) => (
              <div key={a.id} className="feed-item">
                <span className="ic">{a.icon}</span>
                <span className="t">{a.text}</span>
                <span className="when">{timeAgo(a.at)}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
