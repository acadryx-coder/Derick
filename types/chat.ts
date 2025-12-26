export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  sender?: string
  timestamp: Date
}

export interface TeamMember {
  id: string
  name: string
  role: string
  color: string
  icon: string
}
