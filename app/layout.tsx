import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Acadryx AI Workspace',
  description: 'Collaborate with your AI team members',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Acadryx AI Workspace
                  </h1>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <a href="/" className="text-gray-700 hover:text-primary-600">
                    Home
                  </a>
                  <a href="/ai" className="text-gray-700 hover:text-primary-600">
                    AI Team
                  </a>
                  <a href="/ai/builder" className="text-gray-700 hover:text-primary-600 font-medium">
                    App Builder
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          <footer className="bg-white border-t py-4">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
              <p>© 2024 Acadryx AI Workspace. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
