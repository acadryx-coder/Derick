import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  const { message, discussionHistory } = await request.json()
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  const prompt = `
    You are 5 AI specialists discussing a project together:
    1. Technical Lead (architecture)
    2. Product Designer (UI/UX)
    3. Frontend Developer (React)
    4. Backend Developer (APIs)
    5. Product Manager (strategy)
    
    Previous discussion: ${JSON.stringify(discussionHistory.slice(-5))}
    
    New input: ${message}
    
    Generate a REAL discussion where each specialist responds with their perspective.
    Format: Return JSON array of {member: string, message: string}
  `
  
  const result = await model.generateContent(prompt)
  const response = await result.response.text()
  
  try {
    const discussion = JSON.parse(response)
    return NextResponse.json({ discussion })
  } catch {
    // Fallback if JSON parsing fails
    return NextResponse.json({
      discussion: [
        { member: 'Technical Lead', message: response.substring(0, 100) + '...' }
      ]
    })
  }
}
