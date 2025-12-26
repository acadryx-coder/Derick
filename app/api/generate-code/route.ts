import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
      As a senior full-stack developer, create a complete Next.js 14 application.
      
      REQUIREMENTS: ${description}
      
      Generate these essential files:
      1. app/layout.tsx (with Tailwind setup)
      2. app/page.tsx (main page with example content)
      3. tailwind.config.ts
      4. package.json (with required dependencies)
      5. next.config.js
      6. .env.example (environment variables)
      
      FORMAT: Return ONLY valid JSON array:
      [
        {"path": "app/layout.tsx", "content": "// complete code here"},
        {"path": "app/page.tsx", "content": "// complete code here"}
      ]
      
      Make code production-ready with TypeScript and modern practices.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    // Clean response and parse JSON
    const cleaned = response.replace(/```json|```/g, '').trim()
    let files
    try {
      files = JSON.parse(cleaned)
    } catch {
      // Fallback if JSON parsing fails
      files = [
        {
          path: 'app/page.tsx',
          content: `// Generated from: ${description.substring(0, 100)}\n\nexport default function Home() {\n  return (\n    <main>\n      <h1>Your App</h1>\n    </main>\n  )\n}`
        }
      ]
    }
    
    return NextResponse.json({ 
      files,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'AI Generation Failed',
        details: error.message,
        files: [] 
      },
      { status: 500 }
    )
  }
}
