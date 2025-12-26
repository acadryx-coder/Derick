import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `You are an expert full-stack developer AI assistant.

Conversation history:
${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}

User: ${message}

Respond as a senior developer. Be specific about:
1. Technical approach
2. Recommended stack (Next.js 14, TypeScript, Tailwind)
3. Architecture considerations
4. Next steps

Keep response concise but helpful. If user wants to build something, offer to generate code.`

    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { response: "I'm ready to help you build. Describe your app idea." },
      { status: 200 }
    )
  }
}
