'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Code, Bot, Zap, Brain, Sparkles } from 'lucide-react'
import Link from 'next/link'

type Message = {
  id: string
  sender: string
  text: string
  timestamp: Date
  isAI: boolean
}

type AITeamMember = {
  id: string
  name: string
  role: string
  color: string
  icon: string
  isActive: boolean
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI Team',
      text: 'Hello! We\'re your AI development team. Describe what you want to build, and we\'ll discuss it together before coding.',
      timestamp: new Date(Date.now() - 300000),
      isAI: true
    }
  ])
  const [input, setInput] = useState('')
  const [isTeamThinking, setIsTeamThinking] = useState(false)
  const [teamMembers] = useState<AITeamMember[]>([
    { id: 'tech-lead', name: 'Technical Lead', role: 'Architecture', color: 'bg-blue-500', icon: '⚡', isActive: true },
    { id: 'designer', name: 'Product Designer', role: 'UI/UX', color: 'bg-pink-500', icon: '🎨', isActive: true },
    { id: 'frontend', name: 'Frontend Dev', role: 'React', color: 'bg-green-500', icon: '💻', isActive: true },
    { id: 'backend', name: 'Backend Dev', role: 'APIs', color: 'bg-yellow-500', icon: '🔧', isActive: true },
    { id: 'pm', name: 'Product Manager', role: 'Strategy', color: 'bg-purple-500', icon: '📊', isActive: true },
  ])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-team-discussion')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load discussion', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      const toSave = messages.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString()
      }))
      localStorage.setItem('ai-team-discussion', JSON.stringify(toSave))
    }
  }, [messages])

  const simulateTeamResponse = async (userMessage: string) => {
    setIsTeamThinking(true)
    
    // Simulate AI team discussion
    const responses = [
      { sender: 'Technical Lead', text: `I'll design the architecture for "${userMessage}". Thinking about scalability...` },
      { sender: 'Product Designer', text: `Working on user flows and wireframes. Focus on intuitive UX.` },
      { sender: 'Frontend Dev', text: `Preparing component structure with React and Tailwind.` },
      { sender: 'Backend Dev', text: `Planning API endpoints and database schema.` },
      { sender: 'Product Manager', text: `Defining MVP scope and success metrics.` },
    ]
    
    for (const response of responses) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: response.sender,
        text: response.text,
        timestamp: new Date(),
        isAI: true
      }])
    }
    
    // Final consensus
    await new Promise(resolve => setTimeout(resolve, 800))
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'AI Team',
      text: 'Team consensus reached! Ready to build.',
      timestamp: new Date(),
      isAI: true
    }])
    
    setIsTeamThinking(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: input,
      timestamp: new Date(),
      isAI: false
    }
    
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput('')
    
    // Get AI team response
    simulateTeamResponse(currentInput)
  }

  const clearChat = () => {
    if (confirm('Clear team discussion?')) {
      setMessages([messages[0]]) // Keep welcome message
      localStorage.removeItem('ai-team-discussion')
    }
  }

  const startBuild = () => {
    // Pass discussion to builder
    const discussionText = messages
      .filter(m => !m.isAI || m.sender !== 'AI Team')
      .map(m => `${m.sender}: ${m.text}`)
      .join('\n')
    
    window.location.href = `/ai/builder?context=${encodeURIComponent(discussionText)}`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-primary-600" />
              AI Development Team
            </h1>
            <p className="text-gray-600 mt-1">
              Discuss with your full AI team. When ready, they'll build the app.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Clear Chat
            </button>
            <button
              onClick={startBuild}
              disabled={messages.length <= 1}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Build App
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chat Area */}
        <div className="lg:w-2/3 flex flex-col border-r">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'You'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : msg.sender === 'AI Team'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none border'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {msg.sender !== 'You' && msg.sender !== 'AI Team' ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white mr-2 ${
                        teamMembers.find(m => m.name === msg.sender)?.color
                      }`}>
                        {teamMembers.find(m => m.name === msg.sender)?.icon}
                      </div>
                    ) : null}
                    <span className="font-semibold">
                      {msg.sender}
                    </span>
                    <span className="text-xs opacity-75 ml-3">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTeamThinking && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">AI Team Thinking</span>
                    <div className="ml-3 flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to build..."
                className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isTeamThinking}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTeamThinking}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Team Sidebar */}
        <div className="lg:w-1/3 bg-gray-50 p-6">
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Members
            </h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div className={`${member.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mr-3`}>
                    {member.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
            <h3 className="font-semibold mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Quick Start
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setInput('Build a task management app with drag-drop')}
                className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-500"
              >
                <div className="font-medium">Task Manager</div>
                <div className="text-sm text-gray-600">Kanban board, tasks, teams</div>
              </button>
              <button
                onClick={() => setInput('Create an e-commerce store')}
                className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-500"
              >
                <div className="font-medium">E-commerce</div>
                <div className="text-sm text-gray-600">Products, cart, payments</div>
              </button>
              <Link
                href="/ai/builder"
                className="block text-center p-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
              >
                Go to App Builder →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
            }
