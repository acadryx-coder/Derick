import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

// Store conversation memory
const userMemories = new Map()

export async function POST(request: Request) {
  try {
    const { message, userId = 'default' } = await request.json()
    
    // Get user's conversation history
    const history = userMemories.get(userId) || []
    
    // Build conversation context
    const chatHistory = history
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n')
    
    const prompt = `You are an AI developer assistant. Chat naturally with users.
    
    Previous conversation:
    ${chatHistory}
    
    User: ${message}
    
    Respond naturally like a human developer. If they want to build something, say you'll generate the code.
    Be helpful, technical, and conversational.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    // Store in memory
    history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    )
    userMemories.set(userId, history.slice(-20)) // Keep last 20 messages
    
    return NextResponse.json({ 
      response,
      canGenerateCode: shouldGenerateCode(message)
    })
  } catch (error) {
    return NextResponse.json({
      response: `Hi! I'm your AI developer. What would you like to build today?`,
      canGenerateCode: false
    })
  }
}

function shouldGenerateCode(message: string): boolean {
  const buildKeywords = ['build', 'create', 'make', 'generate', 'app', 'website', 'code']
  return buildKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  )
  }
