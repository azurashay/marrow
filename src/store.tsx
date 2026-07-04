import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { ActivityEvent, AppState, Autonomy, ChannelId, Draft, OutreachContact, ResearchItem, Soul } from './types'
import { CHANNEL_META, uid } from './engine'

const STORAGE_KEY = 'marrow-state-v2'

const initialState: AppState = {
  onboarded: false,
  soul: null,
  channels: (Object.keys(CHANNEL_META) as ChannelId[]).map((id) => ({
    id,
    label: CHANNEL_META[id].label,
    connected: false,
  })),
  autonomy: 'supervised',
  drafts: [],
  research: [],
  outreach: [],
  activity: [],
  paused: false,
}

type Action =
  | { type: 'COMPLETE_ONBOARDING'; soul: Soul; connected: ChannelId[]; drafts: Draft[]; research: ResearchItem[]; outreach: OutreachContact[] }
  | { type: 'SET_OUTREACH_STATUS'; id: string; status: OutreachContact['status'] }
  | { type: 'SET_DRAFT_STATUS'; id: string; status: Draft['status'] }
  | { type: 'ADD_DRAFTS'; drafts: Draft[] }
  | { type: 'UPDATE_DRAFT'; id: string; hook: string; body: string }
  | { type: 'SET_AUTONOMY'; autonomy: Autonomy }
  | { type: 'TOGGLE_CHANNEL'; id: ChannelId }
  | { type: 'UPDATE_SOUL'; soul: Soul }
  | { type: 'MARK_RESEARCH_USED'; id: string }
  | { type: 'LOG'; icon: string; text: string }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'RESET' }

function log(activity: ActivityEvent[], icon: string, text: string): ActivityEvent[] {
  return [{ id: uid(), icon, text, at: Date.now() }, ...activity].slice(0, 40)
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboarded: true,
        soul: action.soul,
        channels: state.channels.map((c) => ({ ...c, connected: action.connected.includes(c.id) })),
        drafts: action.drafts,
        research: action.research,
        outreach: action.outreach,
        activity: log(
          state.activity,
          '✦',
          `הנשמה המותגית של ${action.soul.businessName} נבנתה — ${action.drafts.length} טיוטות ראשונות מחכות לאישור`,
        ),
      }
    case 'SET_DRAFT_STATUS': {
      const d = state.drafts.find((x) => x.id === action.id)
      const labels: Record<Draft['status'], string> = {
        approved: 'אושרה',
        published: 'פורסמה',
        rejected: 'נדחתה',
        pending: 'ממתינה',
      }
      return {
        ...state,
        drafts: state.drafts.map((x) =>
          x.id === action.id
            ? {
                ...x,
                status: action.status,
                engagement:
                  action.status === 'published' ? Math.round(40 + Math.random() * 260) : x.engagement,
              }
            : x,
        ),
        activity: d
          ? log(state.activity, action.status === 'rejected' ? '×' : '✓', `טיוטה ל-${CHANNEL_META[d.channel].label} ${labels[action.status]}`)
          : state.activity,
      }
    }
    case 'SET_OUTREACH_STATUS': {
      const c = state.outreach.find((x) => x.id === action.id)
      return {
        ...state,
        outreach: state.outreach.map((x) => (x.id === action.id ? { ...x, status: action.status } : x)),
        activity: c
          ? log(
              state.activity,
              action.status === 'sent' ? '✉' : '×',
              action.status === 'sent' ? `מייל אישי נשלח אל ${c.name}` : `פנייה אל ${c.name} נדחתה`,
            )
          : state.activity,
      }
    }
    case 'ADD_DRAFTS':
      return {
        ...state,
        drafts: [...action.drafts, ...state.drafts],
        activity: log(state.activity, '✎', `הסוכן ניסח ${action.drafts.length} טיוטות חדשות`),
      }
    case 'UPDATE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map((x) => (x.id === action.id ? { ...x, hook: action.hook, body: action.body } : x)),
      }
    case 'SET_AUTONOMY': {
      const labels: Record<Autonomy, string> = {
        supervised: 'מפוקח — הכל באישור שלך',
        assisted: 'משולב — תוכן רץ לבד',
        autonomous: 'אוטונומי — הסוכן רץ לבד',
      }
      return {
        ...state,
        autonomy: action.autonomy,
        activity: log(state.activity, '◈', `מצב הפעולה שונה: ${labels[action.autonomy]}`),
      }
    }
    case 'TOGGLE_CHANNEL':
      return {
        ...state,
        channels: state.channels.map((c) => (c.id === action.id ? { ...c, connected: !c.connected } : c)),
      }
    case 'UPDATE_SOUL':
      return {
        ...state,
        soul: action.soul,
        activity: log(state.activity, '✦', 'הנשמה המותגית עודכנה'),
      }
    case 'MARK_RESEARCH_USED':
      return {
        ...state,
        research: state.research.map((r) => (r.id === action.id ? { ...r, usedInDraft: true } : r)),
      }
    case 'LOG':
      return { ...state, activity: log(state.activity, action.icon, action.text) }
    case 'SET_PAUSED':
      return {
        ...state,
        paused: action.paused,
        activity: log(state.activity, action.paused ? '‖' : '▶', action.paused ? 'הסוכן הושהה — שום דבר לא יוצא' : 'הסוכן חזר לעבוד'),
      }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {}
  return initialState
}

const StoreCtx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
