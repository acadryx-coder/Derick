export interface ProjectFile {
  path: string
  content: string
  language: string
  status: 'generated' | 'modified' | 'failed'
}

export interface BuildLog {
  id: string
  type: 'info' | 'error' | 'warning' | 'success'
  message: string
  timestamp: Date
  stage: BuildStage
}

export type BuildStage = 'idle' | 'analyzing' | 'planning' | 'coding' | 'debugging' | 'ready'
