import type { Autonomy, ChannelId } from '../types'
import { CHANNEL_META } from '../engine'
import { useStore } from '../store'
import { ChannelGlyph, useToast } from '../components/ui'

const DIAL: { id: Autonomy; label: string; desc: string }[] = [
  { id: 'supervised', label: 'מפוקח', desc: 'הכל באישור שלך' },
  { id: 'assisted', label: 'משולב', desc: 'תוכן רץ לבד' },
  { id: 'autonomous', label: 'אוטונומי', desc: 'הסוכן רץ לבד' },
]

export function Settings() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const dialIdx = DIAL.findIndex((d) => d.id === state.autonomy)

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">SETTINGS</div>
        <h1>שליטה ובקרה</h1>
        <p className="sub">כמה חופש יש לסוכן — ואיפה עובר הקו. אפשר לשנות בכל רגע.</p>
      </header>

      <div style={{ display: 'grid', gap: '1.2rem', maxWidth: 720 }}>
        <section className="card panel">
          <div className="panel-head">
            <h3>חוגת האמון</h3>
          </div>
          <div className="dial-wrap">
            <div
              className="dial-thumb"
              style={{ insetInlineStart: `calc(5px + ${dialIdx} * (100% - 10px) / 3)` }}
            />
            {DIAL.map((d) => (
              <button
                key={d.id}
                className={`dial-opt ${state.autonomy === d.id ? 'on' : ''}`}
                onClick={() => {
                  dispatch({ type: 'SET_AUTONOMY', autonomy: d.id })
                  toast(`מצב הפעולה: ${d.label}`)
                }}
              >
                <span className="dl">{d.label}</span>
                <span className="dd">{d.desc}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--faint)', marginTop: '0.9rem' }}>
            ההמלצה שלנו: להתחיל מפוקח, ולהעלות את החוגה כשאתה סומך על האיכות. עסקאות ופניות חמות תמיד יגיעו אליך —
            בכל מצב.
          </p>
        </section>

        <section className="card panel">
          <div className="panel-head">
            <h3>ערוצים מחוברים</h3>
          </div>
          {(Object.keys(CHANNEL_META) as ChannelId[]).map((id) => {
            const c = state.channels.find((x) => x.id === id)!
            return (
              <div key={id} className="setting-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <ChannelGlyph id={id} size={26} />
                  <div>
                    <div className="s-label">{CHANNEL_META[id].label}</div>
                    <div className="s-desc">{c.connected ? 'מחובר — הסוכן מפרסם לכאן' : 'לא מחובר'}</div>
                  </div>
                </div>
                <button
                  className={`switch ${c.connected ? 'on' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_CHANNEL', id })}
                  aria-label={`חבר או נתק ${CHANNEL_META[id].label}`}
                />
              </div>
            )
          })}
        </section>

        <section className="kill">
          <div>
            <h4>{state.paused ? 'הסוכן מושהה' : 'עצירת חירום'}</h4>
            <p>
              {state.paused
                ? 'שום דבר לא מתפרסם ולא נשלח. הטיוטות נשמרות.'
                : 'קליק אחד עוצר הכל — פרסום, ניסוח, מחקר. בלי למחוק כלום.'}
            </p>
          </div>
          <button
            className={state.paused ? 'btn btn-primary' : 'btn btn-danger'}
            onClick={() => dispatch({ type: 'SET_PAUSED', paused: !state.paused })}
          >
            {state.paused ? '▶ החזר לעבודה' : '‖ עצור את הסוכן'}
          </button>
        </section>

        <button
          className="btn btn-ghost btn-sm"
          style={{ justifySelf: 'start', color: 'var(--faint)' }}
          onClick={() => {
            if (confirm('לאפס את הדמו? כל הנתונים יימחקו ותחזור לאונבורדינג.')) dispatch({ type: 'RESET' })
          }}
        >
          איפוס הדמו ↺
        </button>
      </div>
    </div>
  )
}
