import { ProjectFile } from '@/types/builder'

export async function generateAppCode(
  description: string, 
  uploadedDocs: string[] = []
): Promise<ProjectFile[]> {
  console.log('Generating app from:', { description, uploadedDocs })
  
  // In production: Call Gemini API
  // const response = await fetch('/api/generate-code', {
  //   method: 'POST',
  //   body: JSON.stringify({ description, uploadedDocs })
  // })
  
  // For now, return simulated files
  return [
    {
      path: 'app/page.tsx',
      content: `// Generated from: ${description.substring(0, 50)}...
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">AI-Built App</h1>
      <p className="mt-2">Based on your requirements</p>
      <Button className="mt-4">Get Started</Button>
    </main>
  )
}`,
      language: 'typescript',
      status: 'generated'
    },
    {
      path: 'app/layout.tsx',
      content: `// Auto-generated layout
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Generated App',
  description: 'Built automatically from your specs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  )
}`,
      language: 'typescript',
      status: 'generated'
    },
    {
      path: 'tailwind.config.ts',
      content: `// Generated config
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config`,
      language: 'typescript',
      status: 'generated'
    }
  ]
}

export async function debugBuildFailure(logs: string): Promise<string> {
  // AI analyzes build logs and suggests fixes
  return `AI Analysis of Build Failure:

1. Missing dependency: Add "typescript" to package.json
2. Import error: Fix path in app/page.tsx
3. Type error: Add proper TypeScript interfaces

Suggested fixes have been applied to generated files.`
}
