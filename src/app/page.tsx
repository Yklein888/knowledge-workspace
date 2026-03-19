'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
            Knowledge Workspace
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-8">
            Smart knowledge management with embedded AI agent builder
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('[data-features]')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              Learn More
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8" data-features>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Knowledge System</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Organize pages, documents, and links in a powerful workspace
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Agent Builder</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Create intelligent AI agents with visual configuration
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Export & Deploy</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Export agents for use in external systems and workflows
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
