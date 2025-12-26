'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Code, Bot, Zap } from 'lucide-react'
import Link from 'next/link'

interface TeamDiscussion {
  id: string
  member: string
  message: string
  timestamp: Date
  type: 'question' | 'suggestion' | 'decision'
}

export default function AIPage() {
  const [discussion, setDiscussion] = useState<TeamDiscussion[]>([
    {
      id: '1',
      member: 'Technical Lead',
      message: 'Team, I just analyzed the requirements. We should use Next.js 14 with App Router.',
      timestamp: new Date(Date.now() - 3600000),
      type: 'suggestion'
    },
    {
      id: '2',
      member: 'Product Designer',
      message: 'Agreed. I\'ll create the design system first. Any specific branding?',
      timestamp: new Date(Date.now() - 3500000),
      type: 'question'
    }
  ])
  const [teamInput, setTeamInput] = useState('')
  const [isTeamThinking, setIsTeamThinking] = useState(false)

  const teamMembers = [
    { id: 'tech-lead', name: 'Technical Lead', color: 'bg-blue-500', icon: '⚡' },
    { id: 'designer', name: 'Product Designer', color: 'bg-pink-500', icon: '🎨' },
    { id: 'frontend', name: 'Frontend Dev', color: 'bg-green-500', icon: '💻' },
    { id: 'backend', name: 'Backend Dev', color: 'bg-yellow-500', icon: '🔧' },
    { id: 'pm', name: 'Product Manager', color: 'bg-purple-500', icon: '📊' },
  ]

  const simulateTeamDiscussion = async (input: string) => {
    setIsTeamThinking(true)
    
    // Simulate AI team discussing
    const responses = [
      { member: 'Technical Lead', message: `Based on "${input}", I recommend microservices architecture.` },
      { member: 'Product Designer', message: `I'll create wireframes for that. User flow first.` },
      { member: 'Frontend Dev', message: `I can implement with React hooks and Tailwind.` },
      { member: 'Backend Dev', message: `API design needed. REST or GraphQL?` },
      { member: 'Product Manager', message: `Let's define MVP scope and timeline.` },
    ]
    
    for (const response of responses) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setDiscussion(prev => [...prev, {
        id: Date.now().toString(),
        member: response.member,
        message: response.message,
        timestamp: new Date(),
        type: 'suggestion'
      }])
    }
    
    setIsTeamThinking(false)
  }

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamInput.trim()) return
    
    // Add user message
    setDiscussion(prev => [...prev, {
      id: Date.now().toString(),
      member: 'You',
      message: teamInput,
      timestamp: new Date(),
      type: 'question'
    }])
    
    const input = teamInput
    setTeamInput('')
    simulateTeamDiscussion(input)
  }

  const startBuildProcess = () => {
    // Trigger actual build based on discussion
    setDiscussion(prev => [...prev, {
      id: Date.now().toString(),
      member: 'Team Lead',
      message: 'Consensus reached! Starting build process...',
      timestamp: new Date(),
      type: 'decision'
    }])
    
    // Redirect to builder with context
    setTimeout(() => {
      window.location.href = '/ai/builder?context=' + encodeURIComponent(JSON.stringify(discussion))
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left: Team Discussion */}
      <div className="lg:w-2/3 flex flex-col">
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-3" />
              AI Team Discussion
            </h2>
            <button
              onClick={startBuildProcess}
              disabled={discussion.length < 3}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50 flex items-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Build Now
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Team Memory Active:</strong> All 5 AI specialists share context and discuss together.
              When ready, they'll build the complete app.
            </p>
          </div>
          
          {/* Discussion Thread */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
            {discussion.map((msg) => (
              <div key={msg.id} className={`p-4 rounded-lg ${msg.member === 'You' ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  {teamMembers.find(m => m.name === msg.member) ? (
                    <div className={`${teamMembers.find(m => m.name === msg.member)?.color} w-8 h-8 rounded-full flex items-center justify-center text-white mr-3`}>
                      {teamMembers.find(m => m.name === msg.member)?.icon}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white mr-3">
                      👤
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">{msg.member}</span>
                    <span className="text-xs text-gray-500 ml-3">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p className="ml-11">{msg.message}</p>
              </div>
            ))}
            
            {isTeamThinking && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">AI Team Thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Team Input */}
          <form onSubmit={handleTeamSubmit} className="mt-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                placeholder="Discuss with the entire AI team..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isTeamThinking}
              />
              <button
                type="submit"
                disabled={!teamInput.trim() || isTeamThinking}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right: Team Members & Actions */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Your AI Team
          </h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`${member.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mr-3`}>
                  {member.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-gray-600">
                    {member.id === 'tech-lead' && 'Architecture & Systems'}
                    {member.id === 'designer' && 'UI/UX & Design'}
                    {member.id === 'frontend' && 'React & Frontend'}
                    {member.id === 'backend' && 'APIs & Backend'}
                    {member.id === 'pm' && 'Strategy & Planning'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setTeamInput('Let\'s build a task management app')}
              className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-500 transition-colors"
            >
              <div className="font-medium">Start Task App</div>
              <div className="text-sm text-gray-600">Pre-filled discussion</div>
            </button>
            <button
              onClick={() => setTeamInput('I need an e-commerce platform')}
              className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-500 transition-colors"
            >
              <div className="font-medium">Build E-commerce</div>
              <div className="text-sm text-gray-600">Complete store setup</div>
            </button>
            <Link
              href="/ai/builder"
              className="block w-full text-center p-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Go to App Builder →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
      }
