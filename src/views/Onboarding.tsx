import { useEffect, useState } from 'react'
import type { ChannelId, GoalId } from '../types'
import { GOALS, CHANNEL_META, RESEARCH_STEPS, buildSoul, generateDrafts, generateResearch } from '../engine'
import { useStore } from '../store'
import { ChannelGlyph } from '../components/ui'

export function Onboarding() {
  const { dispatch } = useStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [site, setSite] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState<GoalId | null>(null)
  const [channels, setChannels] = useState<ChannelId[]>(['linkedin', 'instagram'])
  const [buildIdx, setBuildIdx] = useState(-1)

  const toggleChannel = (id: ChannelId) =>
    setChannels((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  // שלב הבנייה — סימולציית מחקר של הסוכן
  useEffect(() => {
    if (step !== 3) return
    setBuildIdx(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    RESEARCH_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setBuildIdx(i + 1), 950 * (i + 1)))
    })
    timers.push(
      setTimeout(() => {
        const soul = buildSoul({ businessName: name, website: site, goal: goal!, audience })
        dispatch({
          type: 'COMPLETE_ONBOARDING',
          soul,
          connected: channels,
          drafts: generateDrafts(soul, channels, 6),
          research: generateResearch(soul),
        })
      }, 950 * RESEARCH_STEPS.length + 700),
    )
    return () => timers.forEach(clearTimeout)
  }, [step])

  const canNext =
    step === 0 ? name.trim().length > 1 : step === 1 ? goal !== null : step === 2 ? channels.length > 0 : false

  return (
    <div className="onb">
      <div className="onb-card">
        <div className="onb-progress" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        {step === 0 && (
          <div className="onb-step" key="s0">
            <h1>בוא נכיר את העסק שלך</h1>
            <p className="lead">שלוש שאלות קצרות — ואת השאר הסוכן ילמד לבד.</p>
            <div className="field">
              <label htmlFor="f-name">שם העסק</label>
              <input id="f-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="למשל: סטודיו ורד" autoFocus />
            </div>
            <div className="field">
              <label htmlFor="f-site">אתר / עמוד קיים</label>
              <input id="f-site" value={site} onChange={(e) => setSite(e.target.value)} placeholder="https://…" dir="ltr" style={{ textAlign: 'left' }} />
              <div className="hint">הסוכן יקרא אותו כדי ללמוד את הקול שלך. אפשר גם להשאיר ריק.</div>
            </div>
            <div className="field">
              <label htmlFor="f-aud">מי הלקוחות שלך, במשפט?</label>
              <input id="f-aud" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="למשל: בעלי עסקים קטנים שרוצים להתבלט" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="onb-step" key="s1">
            <h1>מה המטרה של השיווק?</h1>
            <p className="lead">זה מכוון את כל מה שהסוכן יכתוב, יחקור ויפרסם.</p>
            <div className="goal-grid">
              {GOALS.map((g) => (
                <button key={g.id} className={`goal-opt ${goal === g.id ? 'on' : ''}`} onClick={() => setGoal(g.id)}>
                  <div className="g-label">{g.label}</div>
                  <div className="g-desc">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onb-step" key="s2">
            <h1>איפה העסק שלך חי?</h1>
            <p className="lead">חבר את הערוצים — הסוכן יתאים את התוכן לכל אחד מהם.</p>
            <div className="chan-row">
              {(Object.keys(CHANNEL_META) as ChannelId[]).map((id) => (
                <button key={id} className={`chan-opt ${channels.includes(id) ? 'on' : ''}`} onClick={() => toggleChannel(id)}>
                  <ChannelGlyph id={id} size={22} />
                  {CHANNEL_META[id].label}
                  <span className="st">{channels.includes(id) ? 'מחובר ✓' : 'חבר'}</span>
                </button>
              ))}
            </div>
            <div className="hint" style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: 'var(--faint)' }}>
              במוצר המלא: התחברות אמיתית בקליק (OAuth). כאן — הדגמה.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onb-step" key="s3">
            <h1>הסוכן לומד את {name}…</h1>
            <p className="lead">בונה את הנשמה המותגית — הזיכרון שכל תוכן עתידי ייוולד ממנו.</p>
            <div className="build-seq">
              {RESEARCH_STEPS.map((s, i) => (
                <div key={s} className={`build-line ${i < buildIdx ? 'done' : i === buildIdx ? 'active' : ''}`}>
                  <span className="ind">{i < buildIdx ? '✓' : ''}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="onb-actions">
            <button className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              חזרה
            </button>
            <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              {step === 2 ? 'בנה את הנשמה ✦' : 'המשך'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
