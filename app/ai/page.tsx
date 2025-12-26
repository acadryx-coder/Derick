'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Code, Brain, Send, Bot, Sparkles, Copy, Check } from 'lucide-react'

type Message = {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
  files?: Array<{ path: string, content: string }>
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "I'm your AI developer. Describe what you want to build, and I'll generate the complete Next.js 14 application for you.\n\nExample: 'Build a task management app with drag-drop boards'",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])
    const userInput = input
    setInput('')
    setIsGenerating(true)

    try {
      // Step 1: AI analyzes requirements
      const analysisResponse = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          history: messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      })

      const analysisData = await analysisResponse.json()
      
      // Add AI analysis
      const analysisMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: analysisData.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, analysisMsg])

      // Step 2: Generate actual code
      const codeResponse = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: userInput,
          requirements: analysisData.response
        })
      })

      const codeData = await codeResponse.json()
      
      // Add code files
      const codeMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        text: `✅ Generated ${codeData.files?.length || 0} files. Copy and paste to GitHub:`,
        timestamp: new Date(),
        files: codeData.files || []
      }
      
      setMessages(prev => [...prev, codeMsg])

    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 3).toString(),
        sender: 'ai',
        text: "I'll generate that for you. Describe your app idea clearly.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsGenerating(false)
    }
  }

  const copyFileToClipboard = async (content: string, path: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedFile(path)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const copyAllFiles = async () => {
    const allFiles = messages
      .flatMap(m => m.files || [])
      .map(f => `// ${f.path}\n${f.content}\n\n`)
      .join('')
    
    await navigator.clipboard.writeText(allFiles)
    setCopiedFile('ALL')
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const uploadRequirements = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const file = files[0]
    const text = await file.text()
    
    setInput(`Requirements from ${file.name}:\n${text.substring(0, 1000)}...`)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-7 h-7 md:w-8 md:h-8 mr-3" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">AI Developer</h1>
                <p className="opacity-90 text-sm md:text-base">Describe → AI builds → Copy to GitHub</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
              />
              <button
                onClick={uploadRequirements}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg flex items-center"
              >
                📄 Upload Specs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((msg) => (
            <div key={msg.id}>
              {/* Message Bubble */}
              <div
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-full md:max-w-3xl rounded-2xl px-4 py-3 md:px-5 md:py-4 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none border shadow-sm'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {msg.sender === 'ai' ? (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-2 md:mr-3">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2 md:mr-3">
                        👤
                      </div>
                    )}
                    <span className="font-semibold text-sm md:text-base">
                      {msg.sender === 'ai' ? 'AI Developer' : 'You'}
                    </span>
                    <span className="text-xs opacity-75 ml-3">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap ml-9 md:ml-11 text-sm md:text-base">{msg.text}</div>
                </div>
              </div>

              {/* Generated Files */}
              {msg.files && msg.files.length > 0 && (
                <div className="mt-4 ml-9 md:ml-11 max-w-full md:max-w-3xl">
                  <div className="bg-gray-900 text-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        <span className="font-medium">Generated Files ({msg.files.length})</span>
                      </div>
                      <button
                        onClick={copyAllFiles}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center"
                      >
                        {copiedFile === 'ALL' ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-1">
                      {msg.files.slice(0, 3).map((file, idx) => (
                        <div key={idx} className="m-2 bg-gray-800 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-700 flex justify-between items-center">
                            <code className="text-sm font-mono truncate">{file.path}</code>
                            <button
                              onClick={() => copyFileToClipboard(file.content, file.path)}
                              className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded flex items-center"
                            >
                              {copiedFile === file.path ? (
                                <Check className="w-3 h-3 mr-1" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              {copiedFile === file.path ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre className="p-4 text-xs md:text-sm overflow-x-auto max-h-48 overflow-y-auto">
                            {file.content.substring(0, 500)}
                            {file.content.length > 500 && '...'}
                          </pre>
                        </div>
                      ))}
                      {msg.files.length > 3 && (
                        <div className="text-center py-2 text-gray-400 text-sm">
                          + {msg.files.length - 3} more files
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Copy files → Paste to GitHub → Deploy on Vercel
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm max-w-3xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">AI Building Your App</span>
                  <div className="ml-3 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 ml-11">
                  Analyzing requirements → Generating code → Creating files
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t pt-6">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your app (e.g., 'Build a Twitter clone with Next.js 14')..."
                className="flex-1 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Building...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Build
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-between mt-3 text-sm text-gray-500">
              <div>
                Press Enter to send • Upload specs for complex projects
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Real AI (Gemini) Active
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
          }
