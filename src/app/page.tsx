'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, BookOpen, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#191919] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AGENT</span>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-1.5 rounded-lg border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <div className="container mx-auto px-8 py-32 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-8">
          <Sparkles size={12} />
          AI-powered knowledge workspace
        </div>
        <h1 className="text-6xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Your second brain,<br />powered by AI
        </h1>
        <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
          Create pages, organize knowledge, and build AI agents — all in one workspace.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition shadow-lg shadow-violet-500/20"
          >
            Get started free
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 border border-white/10 rounded-xl font-semibold text-zinc-400 hover:text-white hover:border-white/20 transition"
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="container mx-auto px-8 pb-32 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <BookOpen size={20} className="text-violet-400" />,
              title: 'Knowledge System',
              desc: 'Organize pages and documents in a powerful linked workspace',
            },
            {
              icon: <Sparkles size={20} className="text-violet-400" />,
              title: 'Agent Builder',
              desc: 'Create intelligent AI agents with visual configuration tools',
            },
            {
              icon: <Zap size={20} className="text-violet-400" />,
              title: 'Export & Deploy',
              desc: 'Export agents for use in any external system or workflow',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2 text-zinc-100">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
