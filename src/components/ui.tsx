import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { ChannelId } from '../types'
import { CHANNEL_META } from '../engine'

// ---------- channel glyph ----------
export function ChannelGlyph({ id, size = 20 }: { id: ChannelId; size?: number }) {
  const m = CHANNEL_META[id]
  return (
    <span className="cg" style={{ background: m.hue, width: size, height: size }} aria-hidden>
      {m.glyph}
    </span>
  )
}

// ---------- sparkline ----------
export function Spark({ value }: { value: number }) {
  const pts = [3, 7, 5, 9, 6, 11, 8, Math.min(13, 4 + value / 25)]
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * 7},${14 - p}`).join(' ')
  return (
    <svg width="52" height="15" viewBox="0 0 52 15">
      <path d={d} fill="none" stroke="var(--teal)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={49} cy={14 - Math.min(13, 4 + value / 25)} r="2.2" fill="var(--teal-deep)" />
    </svg>
  )
}

// ---------- relative time ----------
export function timeAgo(at: number): string {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000))
  if (s < 60) return 'עכשיו'
  const m = Math.round(s / 60)
  if (m < 60) return `לפני ${m} דק׳`
  const h = Math.round(m / 60)
  if (h < 24) return `לפני ${h} שע׳`
  return `לפני ${Math.round(h / 24)} ימים`
}

// ---------- toasts ----------
interface Toast { id: number; text: string }
const ToastCtx = createContext<(text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const n = useRef(0)
  const push = useCallback((text: string) => {
    const id = ++n.current
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="tic">✓</span>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
