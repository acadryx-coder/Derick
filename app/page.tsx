import { Brain, Users, MessageSquare, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'AI Team',
      description: 'Collaborate with specialized AI team members for every project.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Real-time Chat',
      description: 'Communicate with each AI team member individually.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Session Memory',
      description: 'AI remembers your conversation within each browser session.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Always Available',
      description: 'Access your AI team anytime, anywhere from any device.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const teamMembers = [
    { name: 'Technical Lead', role: 'Architecture & Code Reviews', color: 'bg-blue-500' },
    { name: 'Product Designer', role: 'UI/UX & User Research', color: 'bg-pink-500' },
    { name: 'Frontend Developer', role: 'React & UI Implementation', color: 'bg-green-500' },
    { name: 'Backend Developer', role: 'APIs & Database Design', color: 'bg-yellow-500' },
    { name: 'Product Manager', role: 'Strategy & Roadmap', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">Acadryx AI Workspace</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Collaborate with a full AI team of specialists. Get expert insights from Technical Leads, 
          Product Designers, Developers, and Product Managers all in one place.
        </p>
        <Link
          href="/ai"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
        >
          Start Collaborating →
        </Link>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Team Preview */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your AI Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`${member.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Ready to provide expert guidance and collaborate on your projects.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Supercharge Your Projects?
          </h2>
          <p className="text-primary-100 mb-6 text-lg">
            Join thousands of developers and product teams already collaborating with AI.
          </p>
          <Link
            href="/ai"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Launch AI Workspace
          </Link>
        </div>
      </section>
    </div>
  )
    }
