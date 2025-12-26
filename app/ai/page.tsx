import AITeamChat from './components/AITeamChat'

export default function AIPage() {
  const teamMembers = [
    {
      id: 'tech-lead',
      name: 'Technical Lead',
      role: 'Architecture & Code Quality',
      description: 'Expert in system design, code reviews, and technical strategy.',
      color: 'bg-blue-500',
      icon: '⚡',
    },
    {
      id: 'designer',
      name: 'Product Designer',
      role: 'UI/UX & User Research',
      description: 'Specializes in user experience, interface design, and usability testing.',
      color: 'bg-pink-500',
      icon: '🎨',
    },
    {
      id: 'frontend',
      name: 'Frontend Developer',
      role: 'React & UI Implementation',
      description: 'Expert in modern frontend frameworks and responsive design.',
      color: 'bg-green-500',
      icon: '💻',
    },
    {
      id: 'backend',
      name: 'Backend Developer',
      role: 'APIs & Database Design',
      description: 'Specializes in server architecture, APIs, and data modeling.',
      color: 'bg-yellow-500',
      icon: '🔧',
    },
    {
      id: 'pm',
      name: 'Product Manager',
      role: 'Strategy & Roadmap',
      description: 'Focuses on product vision, feature prioritization, and market fit.',
      color: 'bg-purple-500',
      icon: '📊',
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Added the App Builder banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to Build?</h3>
            <p className="text-sm text-gray-600">Use our AI App Builder for complete projects</p>
          </div>
          <a
            href="/ai/builder"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open App Builder →
          </a>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border"
            >
              <div className={`${member.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-lg`}>
                {member.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <AITeamChat />
      </div>
    </div>
  )
      }
