'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Code, Brain, Send, Bot, Sparkles, Copy, Check, FileText } from 'lucide-react'

type Message = {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
  isCodeResponse?: boolean
  files?: Array<{ path: string, content: string }>
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI developer. We can chat about anything, and when you're ready to build an app, I'll generate the complete code for you.\n\nWhat's on your mind?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userId] = useState(() => `user_${Date.now()}`)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load conversation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`ai-chat-${userId}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (e) {
        console.log('No saved conversation')
      }
    }
  }, [userId])

  // Save conversation
  useEffect(() => {
    if (messages.length > 1) {
      const toSave = messages.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString()
      }))
      localStorage.setItem(`ai-chat-${userId}`, JSON.stringify(toSave))
    }
  }, [messages, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

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
    setIsThinking(true)

    try {
      // Step 1: Chat with AI
      console.log('Sending to AI:', userInput)
      const chatResponse = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput,
          userId 
        })
      })

      if (!chatResponse.ok) {
        throw new Error(`Chat API failed: ${chatResponse.status}`)
      }

      const chatData = await chatResponse.json()
      console.log('AI Response:', chatData)
      
      // Add AI chat response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: chatData.response || "I'm here to help!",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMsg])

      // Step 2: If user wants to build something, generate code
      const shouldGenerateCode = chatData.canGenerateCode || 
        userInput.toLowerCase().includes('build') ||
        userInput.toLowerCase().includes('create') ||
        userInput.toLowerCase().includes('make') ||
        userInput.toLowerCase().includes('app')

      if (shouldGenerateCode && chatData.response) {
        // Show "generating" message
        const generatingMsg: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          text: "🛠️ Generating code for you...",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, generatingMsg])

        // Generate actual code
        const codeResponse = await fetch('/api/generate-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            description: userInput,
            context: chatData.response
          })
        })

        if (codeResponse.ok) {
          const codeData = await codeResponse.json()
          console.log('Code generated:', codeData.files?.length, 'files')
          
          // Add code files
          const codeMsg: Message = {
            id: (Date.now() + 3).toString(),
            sender: 'ai',
            text: `✅ Generated ${codeData.files?.length || 0} files. Copy and paste to GitHub:`,
            timestamp: new Date(),
            isCodeResponse: true,
            files: codeData.files || []
          }
          
          setMessages(prev => [...prev, codeMsg])
        } else {
          const errorMsg: Message = {
            id: (Date.now() + 3).toString(),
            sender: 'ai',
            text: "⚠️ Couldn't generate code right now. Try describing your app in more detail.",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMsg])
        }
      }

    } catch (error: any) {
      console.error('Error:', error)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting. Let's try again! What would you like to build?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsThinking(false)
    }
  }

  const copyFileToClipboard = async (content: string, path: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFile(path)
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const copyAllFiles = async () => {
    const allFiles = messages
      .flatMap(m => m.files || [])
      .map(f => `// ${f.path}\n${f.content}\n\n`)
      .join('')
    
    try {
      await navigator.clipboard.writeText(allFiles)
      setCopiedFile('ALL')
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (error) {
      console.error('Copy all failed:', error)
    }
  }

  const clearChat = () => {
    if (confirm('Clear conversation?')) {
      setMessages([messages[0]]) // Keep first message
      localStorage.removeItem(`ai-chat-${userId}`)
    }
  }

  const quickStart = (idea: string) => {
    setInput(idea)
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
                <p className="opacity-90 text-sm md:text-base">Chat naturally. Say "build" to generate code.</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Buttons */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => quickStart("Build a todo app with Next.js")}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
            >
              📝 Todo App
            </button>
            <button
              onClick={() => quickStart("Create a blog with Tailwind")}
              className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100"
            >
              ✍️ Blog
            </button>
            <button
              onClick={() => quickStart("Make a dashboard with charts")}
              className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => quickStart("Good morning! How are you?")}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              👋 Just Chat
            </button>
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
                      : msg.isCodeResponse
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-bl-none'
                      : 'bg-white text-gray-900 rounded-bl-none border shadow-sm'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {msg.sender === 'ai' ? (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white mr-2 md:mr-3 ${
                        msg.isCodeResponse 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        {msg.isCodeResponse ? <Code className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2 md:mr-3">
                        👤
                      </div>
                    )}
                    <span className="font-semibold text-sm md:text-base">
                      {msg.sender === 'ai' 
                        ? (msg.isCodeResponse ? 'AI Developer (Code)' : 'AI Developer') 
                        : 'You'}
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
                <div className="mt-4 ml-9 md:ml-11 max-w-full md:max-w-3xl animate-fadeIn">
                  <div className="bg-gray-900 text-gray-100 rounded-xl overflow-hidden border border-gray-800">
                    <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <span className="font-medium">Generated Files ({msg.files.length})</span>
                        <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded ml-3">
                          Ready for GitHub
                        </span>
                      </div>
                      <button
                        onClick={copyAllFiles}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center transition-colors"
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
                    <div className="p-2 max-h-96 overflow-y-auto">
                      {msg.files.map((file, idx) => (
                        <div key={idx} className="m-2 bg-gray-800 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-700 flex justify-between items-center">
                            <code className="text-sm font-mono truncate flex items-center">
                              <span className="text-gray-400 mr-2">{idx + 1}.</span>
                              {file.path}
                            </code>
                            <button
                              onClick={() => copyFileToClipboard(file.content, file.path)}
                              className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded flex items-center transition-colors"
                            >
                              {copiedFile === file.path ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 text-xs md:text-sm overflow-x-auto max-h-48 overflow-y-auto">
                            {file.content.substring(0, 800)}
                            {file.content.length > 800 && '... (truncated)'}
                          </pre>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-800 px-4 py-2 text-center text-sm text-gray-400 border-t border-gray-700">
                      Copy → Paste to GitHub → Deploy on Vercel
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm max-w-3xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">AI Thinking</span>
                  <div className="ml-3 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t pt-6 bg-white rounded-xl p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chat naturally or say 'build' to generate code..."
                className="flex-1 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                disabled={isThinking}
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center shadow-md transition-all"
              >
                {isThinking ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-between mt-3 text-sm text-gray-500">
              <div>
                💡 Try: "Good morning!" or "Build a weather app"
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Gemini AI Online
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
                                                               }
