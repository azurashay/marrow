export type ChannelId = 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'youtube'

export type GoalId = 'leads' | 'awareness' | 'sales' | 'community'

export type Autonomy = 'supervised' | 'assisted' | 'autonomous'

export interface Channel {
  id: ChannelId
  label: string
  connected: boolean
}

export interface Soul {
  businessName: string
  website: string
  goal: GoalId
  audience: string
  voice: string
  values: string[]
  rules: string[]
  learnings: Learning[]
  artist?: boolean
  agentEmail?: string
}

export interface Learning {
  id: string
  text: string
  at: number
}

export type DraftStatus = 'pending' | 'approved' | 'published' | 'rejected'

export interface Draft {
  id: string
  channel: ChannelId
  kind: 'post' | 'reel' | 'carousel'
  hook: string
  body: string
  hashtags: string[]
  status: DraftStatus
  createdAt: number
  engagement?: number
  fromResearch?: string
}

export interface ResearchItem {
  id: string
  kind: 'trend' | 'audience' | 'competitor'
  title: string
  points: string[]
  usedInDraft?: boolean
}

export type OutreachStatus = 'pending' | 'sent' | 'rejected'

export interface OutreachContact {
  id: string
  name: string
  role: string
  platform: string
  why: string[]
  subject: string
  email: string
  status: OutreachStatus
}

export interface ActivityEvent {
  id: string
  icon: string
  text: string
  at: number
}

export interface AppState {
  onboarded: boolean
  soul: Soul | null
  channels: Channel[]
  autonomy: Autonomy
  drafts: Draft[]
  research: ResearchItem[]
  outreach: OutreachContact[]
  activity: ActivityEvent[]
  paused: boolean
}
