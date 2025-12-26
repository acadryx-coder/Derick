import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const description = body.description || 'Build a web application'
    
    console.log('Generating code for:', description.substring(0, 100))
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
    
    const prompt = `Generate a COMPLETE Next.js 14 application.
    
    Requirements: ${description}
    
    Create these files:
    1. app/layout.tsx with Tailwind
    2. app/page.tsx with example content
    3. package.json with dependencies
    4. tailwind.config.ts
    
    Return ONLY JSON array:
    [
      {"path": "app/layout.tsx", "content": "export default function RootLayout..."},
      {"path": "app/page.tsx", "content": "export default function Home() {...}"}
    ]
    
    Make it real, working code.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    console.log('AI Code response length:', response.length)
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    let files = []
    
    if (jsonMatch) {
      try {
        files = JSON.parse(jsonMatch[0])
      } catch {
        files = [{ path: 'app/page.tsx', content: `// Generated\n// ${description}` }]
      }
    } else {
      files = [
        { path: 'app/page.tsx', content: `// ${response.substring(0, 500)}` }
      ]
    }
    
    return NextResponse.json({ 
      files,
      success: true,
      count: files.length
    })
  } catch (error: any) {
    console.error('Code generation ERROR:', error.message)
    return NextResponse.json(
      { 
        files: [
          { 
            path: 'ERROR.txt', 
            content: `AI Failed: ${error.message}\n\nTry again or simplify your request.` 
          }
        ],
        success: false,
        error: error.message
      },
      { status: 200 }
    )
  }
                  }
