import { ReactNode } from 'react'

export default function AILayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Team Workspace</h1>
        <p className="text-gray-600 mt-2">
          Collaborate with your dedicated AI team members. Each specialist is ready to help with their expertise.
        </p>
      </div>
      <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}
