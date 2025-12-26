import { ProjectFile } from '@/types/builder'

export async function generateAppCode(
  description: string, 
  uploadedDocs: string[] = []
): Promise<ProjectFile[]> {
  const response = await fetch('/api/generate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, uploadedDocs })
  })
  
  const data = await response.json()
  
  return data.files.map((file: any) => ({
    path: file.path,
    content: file.content,
    language: file.path.endsWith('.ts') || file.path.endsWith('.tsx') ? 'typescript' : 
              file.path.endsWith('.js') ? 'javascript' : 'other',
    status: 'generated'
  }))
}

export async function debugBuildFailure(logs: string): Promise<string> {
  return `AI Analysis of Build Failure: ${logs.substring(0, 200)}...`
    }
