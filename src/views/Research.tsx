import { useState } from 'react'
import type { ResearchItem } from '../types'
import { researchToDraft } from '../engine'
import { useStore } from '../store'
import { useToast } from '../components/ui'

const KIND_LABEL: Record<ResearchItem['kind'], { label: string; cls: string }> = {
  trend: { label: 'טרנד', cls: 'rk-trend' },
  audience: { label: 'תובנת קהל', cls: 'rk-audience' },
  competitor: { label: 'מתחרים', cls: 'rk-competitor' },
}

export function Research() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [workingId, setWorkingId] = useState<string | null>(null)

  const use = (item: ResearchItem) => {
    if (!state.soul || workingId) return
    setWorkingId(item.id)
    const channel = state.channels.find((c) => c.connected)?.id ?? 'linkedin'
    setTimeout(() => {
      dispatch({ type: 'ADD_DRAFTS', drafts: [researchToDraft(item, state.soul!, channel)] })
      dispatch({ type: 'MARK_RESEARCH_USED', id: item.id })
      setWorkingId(null)
      toast('התובנה הפכה לטיוטה — מחכה בתור האישורים')
    }, 1400)
  }

  return (
    <div className="page-in">
      <header className="page-head">
        <div className="crumb">RESEARCH</div>
        <h1>המחקר של הסוכן</h1>
        <p className="sub">
          מה הסוכן למד על השוק, הקהל והמתחרים שלך — וכפתור אחד שהופך תובנה לתוכן.
        </p>
      </header>

      <div className="research-grid stagger">
        {state.research.map((r) => (
          <article key={r.id} className="card lift research-card">
            <span className={`research-kind ${KIND_LABEL[r.kind].cls}`}>{KIND_LABEL[r.kind].label}</span>
            <h3>{r.title}</h3>
            <ul>
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {r.usedInDraft ? (
              <span className="used-mark">✓ הפך לטיוטה — בתור האישורים</span>
            ) : (
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'start' }} onClick={() => use(r)} disabled={workingId !== null}>
                {workingId === r.id ? (
                  <>
                    מנסח
                    <span className="thinking">
                      <i />
                      <i />
                      <i />
                    </span>
                  </>
                ) : (
                  'הפוך לפוסט ✎'
                )}
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
