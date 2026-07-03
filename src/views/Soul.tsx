import { useState } from 'react'
import { useStore } from '../store'
import { timeAgo, useToast } from '../components/ui'
import { uid } from '../engine'

export function Soul() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const soul = state.soul!
  const [voice, setVoice] = useState(soul.voice)
  const [audience, setAudience] = useState(soul.audience)
  const [newValue, setNewValue] = useState('')
  const dirty = voice !== soul.voice || audience !== soul.audience

  const save = () => {
    dispatch({
      type: 'UPDATE_SOUL',
      soul: {
        ...soul,
        voice,
        audience,
        learnings: [{ id: uid(), text: 'עדכנת את הקול והקהל ידנית — הסוכן מיישר קו', at: Date.now() }, ...soul.learnings],
      },
    })
    toast('הנשמה עודכנה — כל תוכן חדש ייוולד ממנה')
  }

  const addValue = () => {
    const v = newValue.trim()
    if (!v || soul.values.includes(v)) return
    dispatch({ type: 'UPDATE_SOUL', soul: { ...soul, values: [...soul.values, v] } })
    setNewValue('')
  }

  const removeValue = (v: string) =>
    dispatch({ type: 'UPDATE_SOUL', soul: { ...soul, values: soul.values.filter((x) => x !== v) } })

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">BRAND SOUL</div>
        <h1>הנשמה המותגית</h1>
        <p className="sub">
          הזיכרון החי של {soul.businessName}. כל פוסט, כל מחקר וכל תשובה נולדים מכאן — והיא לומדת ומשתפרת עם הזמן.
        </p>
      </header>

      <div className="soul-grid">
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <section className="card panel soul-voice">
            <div className="panel-head">
              <h3>הקול</h3>
              {dirty && (
                <button className="btn btn-primary btn-sm" onClick={save}>
                  שמור שינויים
                </button>
              )}
            </div>
            <div className="field">
              <label htmlFor="s-voice">איך {soul.businessName} נשמע</label>
              <textarea id="s-voice" value={voice} onChange={(e) => setVoice(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="s-aud">למי מדברים</label>
              <input id="s-aud" value={audience} onChange={(e) => setAudience(e.target.value)} />
            </div>
          </section>

          <section className="card panel">
            <div className="panel-head">
              <h3>הערכים</h3>
            </div>
            <div className="value-chips">
              {soul.values.map((v) => (
                <span key={v} className="value-chip">
                  {v}
                  <button onClick={() => removeValue(v)} aria-label={`הסר ${v}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-value">
              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addValue()}
                placeholder="הוסף ערך…"
                style={{
                  padding: '0.45rem 0.8rem',
                  background: 'var(--card-2)',
                  border: '1.5px solid var(--rule)',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                }}
              />
              <button className="btn btn-ghost btn-sm" onClick={addValue}>
                הוסף
              </button>
            </div>
          </section>
        </div>

        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <section className="card panel">
            <div className="panel-head">
              <h3>קווים אדומים</h3>
            </div>
            <div className="rule-list">
              {soul.rules.map((r) => (
                <div key={r} className="rule-item">
                  <span className="lock">🔒</span>
                  {r}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--faint)', marginTop: '0.8rem' }}>
              הסוכן לא יעבור עליהם לעולם — גם במצב אוטונומי מלא.
            </p>
          </section>

          <section className="card panel">
            <div className="panel-head">
              <h3>מה הנשמה למדה</h3>
            </div>
            {soul.learnings.map((l) => (
              <div key={l.id} className="learn-line">
                <span className="spark">✦</span>
                {l.text}
                <span className="when">{timeAgo(l.at)}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
