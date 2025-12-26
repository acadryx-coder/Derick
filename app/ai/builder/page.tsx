'use client'

import { useState, useRef } from 'react'
import { 
  Code, Upload, Rocket, GitBranch, FileText, 
  MessageSquare, Bug, Terminal, BookOpen, 
  ClipboardCopy, RefreshCw, Eye, EyeOff
} from 'lucide-react'

type BuildStage = 'idle' | 'analyzing' | 'planning' | 'coding' | 'debugging' | 'ready'
type LogType = 'info' | 'error' | 'warning' | 'success'

interface BuildLog {
  id: string
  type: LogType
  message: string
  timestamp: Date
  stage: BuildStage
}

interface ProjectFile {
  path: string
  content: string
  language: string
  status: 'generated' | 'modified' | 'failed'
}

export default function AppBuilder() {
  const [projectDescription, setProjectDescription] = useState('')
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [buildStage, setBuildStage] = useState<BuildStage>('idle')
  const [buildLogs, setBuildLogs] = useState<BuildLog[]>([])
  const [generatedFiles, setGeneratedFiles] = useState<ProjectFile[]>([])
  const [vercelLogs, setVercelLogs] = useState('')
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'docs' | 'build' | 'debug' | 'files'>('docs')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate reading docs
  const handleDocUpload = () => {
    if (fileInputRef.current?.files) {
      const files = Array.from(fileInputRef.current.files)
      const docNames = files.map(f => f.name)
      setUploadedDocs(prev => [...prev, ...docNames])
      
      // Simulate AI reading docs
      addLog('info', `📚 Reading ${files.length} document(s)...`, 'analyzing')
      addLog('success', `✅ AI has analyzed: ${docNames.join(', ')}`, 'analyzing')
    }
  }

  const addLog = (type: LogType, message: string, stage: BuildStage) => {
    const log: BuildLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      stage
    }
    setBuildLogs(prev => [...prev, log])
  }

  const simulateFullBuildProcess = async () => {
    setBuildStage('analyzing')
    setBuildLogs([])
    
    // Phase 1: AI reads and understands requirements
    addLog('info', '🧠 AI Team assembling...', 'analyzing')
    await delay(1000)
    addLog('info', '📖 Reading project documentation...', 'analyzing')
    await delay(1500)
    addLog('success', '✅ All 11 docs understood by AI team', 'analyzing')
    
    // Phase 2: Planning
    setBuildStage('planning')
    addLog('info', '📐 Technical Lead: Creating architecture...', 'planning')
    await delay(1200)
    addLog('info', '🎨 Product Designer: Wireframing UI...', 'planning')
    await delay(1000)
    addLog('info', '💻 Frontend: Component structure...', 'planning')
    await delay(800)
    addLog('info', '🔧 Backend: API design & database schema...', 'planning')
    await delay(1000)
    addLog('success', '✅ Complete technical plan ready', 'planning')
    
    // Phase 3: Coding
    setBuildStage('coding')
    addLog('info', '⚡ Generating Next.js 14 app structure...', 'coding')
    await delay(800)
    
    // Generate sample files
    const files: ProjectFile[] = [
      {
        path: 'app/layout.tsx',
        content: `// Generated from requirements docs\nimport './globals.css'\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}`,
        language: 'typescript',
        status: 'generated'
      },
      {
        path: 'app/page.tsx',
        content: `// Based on doc #3: Main Dashboard\n'use client'\n\nexport default function Home() {\n  return (\n    <main>\n      <h1>Your AI-Built Application</h1>\n      {/* Component structure from design doc #5 */}\n    </main>\n  )\n}`,
        language: 'typescript',
        status: 'generated'
      },
      {
        path: 'tailwind.config.ts',
        content: `// Configuration from brand guidelines (doc #7)\nimport type { Config } from 'tailwindcss'\n\nconst config: Config = {\n  content: [\n    './app/**/*.{js,ts,jsx,tsx,mdx}',\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n\nexport default config`,
        language: 'typescript',
        status: 'generated'
      }
    ]
    
    await delay(2000)
    addLog('success', `✅ Generated ${files.length} files`, 'coding')
    setGeneratedFiles(files)
    
    // Phase 4: Ready
    setBuildStage('ready')
    addLog('success', '🚀 Project ready! Copy files to GitHub', 'ready')
  }

  const simulateBuildFailure = async () => {
    addLog('error', '❌ Vercel build failed: Module parse error', 'debugging')
    addLog('warning', '⚠️ TypeScript errors in app/page.tsx', 'debugging')
    addLog('info', '🔧 AI debugging: Checking imports...', 'debugging')
    await delay(1000)
    addLog('info', '🔧 AI debugging: Fixing TypeScript config...', 'debugging')
    await delay(800)
    addLog('success', '✅ Fixed: Added missing type definitions', 'debugging')
    addLog('info', '🔄 Retrying build...', 'debugging')
    await delay(1200)
    addLog('success', '✅ Build successful!', 'ready')
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const copyFileToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    addLog('success', '📋 Copied to clipboard', 'ready')
  }

  const copyAllFiles = () => {
    const allCode = generatedFiles.map(f => `// ${f.path}\n${f.content}\n\n`).join('')
    navigator.clipboard.writeText(allCode)
    addLog('success', '📋 All files copied to clipboard', 'ready')
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏗️ AI App Factory</h1>
        <p className="text-gray-600">
          Upload docs → AI reads & plans → Builds app → You deploy
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: 'docs', label: 'Documentation', icon: <FileText className="w-4 h-4" /> },
          { id: 'build', label: 'Build Process', icon: <Rocket className="w-4 h-4" /> },
          { id: 'debug', label: 'Debug Mode', icon: <Bug className="w-4 h-4" /> },
          { id: 'files', label: 'Generated Files', icon: <Code className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-3 border-b-2 -mb-px ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
          >
            {tab.icon}
            <span className="ml-2 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Project Description */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Project Brief
            </h3>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your app or paste initial requirements..."
              className="w-full h-40 p-3 border rounded-lg text-sm"
            />
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Upload Docs (11+ files)
            </h3>
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleDocUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 transition-colors text-center"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Click to upload specs, designs, API docs...</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, MD supported</p>
              </button>
              
              {uploadedDocs.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded ({uploadedDocs.length}):</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {uploadedDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Build Controls */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Build Controls</h3>
            <div className="space-y-3">
              <button
                onClick={simulateFullBuildProcess}
                disabled={buildStage !== 'idle'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                <Rocket className="w-5 h-5 mr-2" />
                {buildStage === 'idle' ? 'Start AI Build' : 'Building...'}
              </button>
              
              <button
                onClick={simulateBuildFailure}
                className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <Bug className="w-4 h-4 mr-2" />
                Simulate Build Failure
              </button>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={isDebugMode}
                    onChange={(e) => setIsDebugMode(e.target.checked)}
                    className="mr-2"
                  />
                  <Terminal className="w-4 h-4 mr-1" />
                  Debug Mode
                </label>
                <button
                  onClick={() => setBuildLogs([])}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-2">
          {/* Build Status */}
          <div className="bg-white rounded-xl border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                {buildStage === 'ready' ? '✅' : '⚡'}
                <span className="ml-2">
                  {buildStage === 'idle' && 'Ready to Build'}
                  {buildStage === 'analyzing' && 'AI Reading Docs...'}
                  {buildStage === 'planning' && 'Team Planning...'}
                  {buildStage === 'coding' && 'Generating Code...'}
                  {buildStage === 'debugging' && 'Debugging Build...'}
                  {buildStage === 'ready' && 'Build Complete!'}
                </span>
              </h3>
              <div className="flex items-center space-x-2">
                {buildStage === 'ready' && generatedFiles.length > 0 && (
                  <button
                    onClick={copyAllFiles}
                    className="flex items-center text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded"
                  >
                    <ClipboardCopy className="w-4 h-4 mr-1" />
                    Copy All Files
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: buildStage === 'idle' ? '0%' :
                         buildStage === 'analyzing' ? '25%' :
                         buildStage === 'planning' ? '50%' :
                         buildStage === 'coding' ? '75%' :
                         buildStage === 'ready' ? '100%' : '100%'
                }}
              />
            </div>

            {/* Build Logs */}
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {buildLogs.length === 0 ? (
                <div className="text-gray-500">Build logs will appear here...</div>
              ) : (
                buildLogs.map(log => (
                  <div key={log.id} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : ''}`}>
                    <span className="text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Generated Files */}
          {activeTab === 'files' && generatedFiles.length > 0 && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="border-b p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    Generated Files ({generatedFiles.length})
                  </h3>
                  <div className="text-sm text-gray-600">
                    Copy and paste to GitHub
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                {generatedFiles.map((file, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Code className="w-4 h-4 mr-2 text-gray-500" />
                        <code className="text-sm font-mono">{file.path}</code>
                        <span className={`ml-3 text-xs px-2 py-1 rounded-full ${file.status === 'generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {file.status}
                        </span>
                      </div>
                      <button
                        onClick={() => copyFileToClipboard(file.content)}
                        className="text-xs border px-3 py-1 rounded hover:bg-white"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto max-h-64 overflow-y-auto">
                      {file.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Panel */}
          {isDebugMode && (
            <div className="bg-white rounded-xl border p-5 mt-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Terminal className="w-5 h-5 mr-2" />
                Vercel Build Logs
              </h3>
              <textarea
                value={vercelLogs}
                onChange={(e) => setVercelLogs(e.target.value)}
                placeholder="Paste Vercel build logs here for AI to debug..."
                className="w-full h-40 p-3 border rounded-lg font-mono text-sm bg-gray-50"
              />
              <div className="mt-3 text-sm text-gray-600">
                <p>AI will analyze build failures and suggest fixes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <div className="flex items-start">
          <MessageSquare className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Workflow:</strong>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>Upload all requirement docs (wireframes, specs, API docs)</li>
              <li>AI team reads and discusses architecture</li>
              <li>AI generates complete Next.js app</li>
              <li>If build fails: paste Vercel logs → AI debugs and fixes</li>
              <li>Copy files to GitHub → Deploy to Vercel</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
