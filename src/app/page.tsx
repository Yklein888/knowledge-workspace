'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, BookOpen, Zap, ArrowRight, Bot } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AGENT</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white transition"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition shadow-lg shadow-violet-500/20"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative container mx-auto px-8 pt-28 pb-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs mb-8 backdrop-blur-sm">
          <Sparkles size={11} />
          AI-powered workspace
        </div>

        <h1 className="text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Your second brain,
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            powered by AI
          </span>
        </h1>

        <p className="text-lg text-zinc-500 mb-10 leading-relaxed max-w-xl mx-auto">
          Create pages, organize knowledge, and build AI agents — all in one unified workspace designed for teams that move fast.
        </p>

        <div className="flex gap-3 justify-center mb-16">
          <button
            onClick={() => router.push('/signup')}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition shadow-xl shadow-violet-500/25 text-sm"
          >
            Start for free
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 border border-white/10 rounded-xl font-semibold text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition text-sm"
          >
            Sign in
          </button>
        </div>

        {/* Preview window */}
        <div className="relative mx-auto max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Fake titlebar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-[#141414]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="ml-3 flex-1 h-5 rounded bg-white/5 max-w-xs" />
            </div>
            {/* Fake content */}
            <div className="flex h-48">
              <div className="w-48 border-r border-white/5 p-3 space-y-1.5">
                {['All Pages', 'Agents', 'Settings'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${i === 0 ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>
                    <div className="w-3 h-3 rounded bg-white/10" />
                    {item}
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5 mt-2">
                  {['Meeting notes', 'Project plan', 'Research'].map((p) => (
                    <div key={p} className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-600">
                      <div className="w-2 h-2 rounded bg-white/10" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="h-4 w-1/3 bg-white/10 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                  <div className="h-3 w-4/6 bg-white/5 rounded" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-6 w-20 bg-violet-500/20 border border-violet-500/30 rounded-md text-xs text-violet-400 flex items-center justify-center">AI Draft</div>
                  <div className="h-6 w-16 bg-white/5 border border-white/10 rounded-md" />
                </div>
              </div>
            </div>
          </div>
          {/* Glow under preview */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-violet-600/15 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Features */}
      <div id="features" className="relative container mx-auto px-8 pb-32 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <BookOpen size={18} className="text-violet-400" />,
              title: 'Knowledge System',
              desc: 'Organize pages and documents in a powerful linked workspace. Everything connected, nothing lost.',
            },
            {
              icon: <Bot size={18} className="text-violet-400" />,
              title: 'Agent Builder',
              desc: 'Create intelligent AI agents visually. Add MCP servers, set goals, and deploy in minutes.',
            },
            {
              icon: <Zap size={18} className="text-violet-400" />,
              title: 'API & Integrations',
              desc: 'Connect external systems with API tokens. Full programmatic control over your workspace.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/15 transition">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2 text-zinc-100 text-sm">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
