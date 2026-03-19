'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, FileText, Trash2, LogOut, Search, Settings,
  ChevronRight, Loader2, BookOpen, Sparkles, MoreHorizontal
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/lib/auth'

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
  content: string
  icon?: string
}

export default function WorkspacePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  useEffect(() => {
    if (user) fetchPages()
  }, [user])

  async function fetchPages() {
    if (!user) return
    try {
      setLoading(true)
      const response = await fetch('/api/pages', {
        headers: { 'x-user-id': user.id },
      })
      if (!response.ok) throw new Error('Failed to fetch pages')
      const data = await response.json()
      setPages(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function createPage(e: React.FormEvent) {
    e.preventDefault()
    if (!newPageTitle.trim() || !user) return
    setCreating(true)
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }),
      })
      if (!response.ok) throw new Error('Failed to create page')
      const { data } = await response.json()
      setPages([data, ...pages])
      setNewPageTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page')
    } finally {
      setCreating(false)
    }
  }

  async function deletePage(pageId: string) {
    if (!user) return
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id },
      })
      setPages(pages.filter((p) => p.id !== pageId))
    } catch {
      setError('Failed to delete page')
    }
  }

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?'

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#191919]">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#191919] text-white">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#1a1a1a]">
        {/* User */}
        <div className="flex items-center gap-2 px-3 py-3 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <span className="text-sm font-medium text-zinc-200 truncate flex-1">
            {user?.email?.split('@')[0]}
          </span>
          <ChevronRight size={14} className="text-zinc-600" />
        </div>

        {/* Search */}
        <div className="px-2 pb-1">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
            <Search size={14} className="text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none flex-1 w-full"
            />
          </div>
        </div>

        {/* Nav */}
        <div className="px-2 py-1 space-y-0.5">
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <BookOpen size={14} />
            <span>All Pages</span>
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <Sparkles size={14} />
            <span>Agents</span>
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>

        <div className="px-3 py-2 mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1">Pages</p>
        </div>

        {/* Pages list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-zinc-600" size={18} />
            </div>
          ) : filteredPages.length === 0 ? (
            <p className="text-xs text-zinc-600 px-2 py-4 text-center">
              {searchQuery ? 'No results' : 'No pages yet'}
            </p>
          ) : (
            filteredPages.map((page) => (
              <div
                key={page.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
              >
                <FileText size={13} className="text-zinc-600 flex-shrink-0" />
                <span className="text-sm text-zinc-300 truncate flex-1">{page.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deletePage(page.id) }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* New page */}
        <div className="p-2 border-t border-white/5">
          <form onSubmit={createPage}>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">
              <Plus size={14} className="text-zinc-500 flex-shrink-0" />
              <input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="New page..."
                className="bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none flex-1 w-full"
                onKeyDown={(e) => e.key === 'Enter' && !creating && createPage(e as unknown as React.FormEvent)}
              />
              {creating && <Loader2 size={12} className="animate-spin text-zinc-600" />}
            </div>
          </form>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors border-t border-white/5"
        >
          <LogOut size={14} />
          <span>Log out</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="m-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-400">✕</button>
          </div>
        )}

        {pages.length === 0 && !loading ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <FileText size={32} className="text-zinc-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">Start with a page</h2>
              <p className="text-zinc-500 text-sm max-w-xs">
                Create your first page to organize your knowledge, notes, and documents.
              </p>
            </div>
            <form onSubmit={createPage} className="flex gap-2 w-full max-w-sm">
              <input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Page title..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 text-sm"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newPageTitle.trim() || creating}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create
              </button>
            </form>
          </div>
        ) : (
          /* Pages grid */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">My Workspace</h1>
                  <p className="text-zinc-500 text-sm mt-1">{pages.length} page{pages.length !== 1 ? 's' : ''}</p>
                </div>
                <form onSubmit={createPage} className="flex gap-2">
                  <input
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="New page title..."
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 text-sm w-48"
                  />
                  <button
                    type="submit"
                    disabled={!newPageTitle.trim() || creating}
                    className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    Create
                  </button>
                </form>
              </div>

              <div className="grid gap-2">
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-zinc-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{page.title}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {new Date(page.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
