import { useState } from 'react'
import type { Draft } from '../types'
import { CHANNEL_META } from '../engine'
import { useStore } from '../store'
import { ChannelGlyph, Spark, useToast } from './ui'

const KIND_LABEL: Record<Draft['kind'], string> = {
  post: 'פוסט',
  reel: 'ריל / וידאו',
  carousel: 'קרוסלה',
}

export function DraftCard({ draft }: { draft: Draft }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [stamp, setStamp] = useState<null | 'approve' | 'reject'>(null)
  const [leaving, setLeaving] = useState(false)

  const act = (status: 'approved' | 'rejected') => {
    setStamp(status === 'approved' ? 'approve' : 'reject')
    setTimeout(() => setLeaving(true), 650)
    setTimeout(() => {
      dispatch({ type: 'SET_DRAFT_STATUS', id: draft.id, status })
      if (status === 'approved') {
        // סימולציית פרסום — במערכת האמיתית: קריאת publish ל-API
        setTimeout(() => {
          dispatch({ type: 'SET_DRAFT_STATUS', id: draft.id, status: 'published' })
          toast(`פורסם ל-${CHANNEL_META[draft.channel].label}`)
        }, 1100)
      }
    }, 1050)
  }

  const isPending = draft.status === 'pending'

  return (
    <article className={`card lift draft ${leaving ? 'leaving' : ''}`}>
      {stamp && (
        <div className={`stamp ${stamp === 'reject' ? 'reject' : ''}`}>
          <span>{stamp === 'approve' ? 'אושר' : 'נדחה'}</span>
        </div>
      )}
      <div className="draft-top">
        <span className="chan-chip">
          <ChannelGlyph id={draft.channel} />
          {CHANNEL_META[draft.channel].label}
        </span>
        <span className="kind-chip">{KIND_LABEL[draft.kind]}</span>
        {draft.fromResearch && <span className="from-research">מתוך מחקר</span>}
        {!isPending && (
          <span className={`status-tag status-${draft.status}`} style={{ marginInlineStart: 'auto' }}>
            {draft.status === 'published' ? 'פורסם' : draft.status === 'approved' ? 'בתור' : 'נדחה'}
          </span>
        )}
      </div>
      <h3 className="hook">{draft.hook}</h3>
      <p className={`body ${open ? 'open' : ''}`}>{draft.body}</p>
      <button className="expand" onClick={() => setOpen(!open)}>
        {open ? 'פחות' : 'קרא הכל'}
      </button>
      <div className="tags">
        {draft.hashtags.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
      {isPending ? (
        <div className="draft-actions">
          <button className="btn btn-primary btn-sm" onClick={() => act('approved')} disabled={!!stamp}>
            אשר ופרסם
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => act('rejected')} disabled={!!stamp}>
            דחה
          </button>
        </div>
      ) : draft.status === 'published' && draft.engagement != null ? (
        <div className="eng">
          <Spark value={draft.engagement} />
          {draft.engagement} אינטראקציות
        </div>
      ) : null}
    </article>
  )
}
