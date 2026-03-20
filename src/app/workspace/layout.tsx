'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Plus, FileText, Trash2, LogOut, Search, Settings,
  ChevronRight, Loader2, BookOpen, Sparkles,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/lib/auth'
import CommandPalette from '@/components/CommandPalette'

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
  content: string
  icon?: string
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { user, loading: userLoading } = useUser()
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    if (!userLoading && !user) router.push('/login')
  }, [user, userLoading, router])

  // Cmd+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const { data: pages = [], isLoading: pagesLoading } = useQuery<Page[]>({
    queryKey: ['pages', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/pages', { headers: { 'x-user-id': user!.id } })
      if (!res.ok) throw new Error('Failed to fetch pages')
      const json = await res.json()
      return json.data ?? []
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify({
          title,
          slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }),
      })
      if (!res.ok) throw new Error('Failed to create page')
      return res.json().then((d) => d.data)
    },
    onSuccess: (newPage) => {
      queryClient.setQueryData(['pages', user?.id], (old: Page[] = []) => [newPage, ...old])
      toast.success('Page created')
      router.push(`/workspace/${newPage.id}`)
    },
    onError: () => toast.error('Failed to create page'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (pageId: string) => {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.id },
      })
      if (!res.ok) throw new Error('Failed to delete page')
    },
    onSuccess: (_, pageId) => {
      queryClient.setQueryData(['pages', user?.id], (old: Page[] = []) =>
        old.filter((p) => p.id !== pageId),
      )
      toast.success('Page deleted')
      if (pathname.includes(pageId)) router.push('/workspace')
    },
    onError: () => toast.error('Failed to delete page'),
  })

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value.trim()
      if (val && !createMutation.isPending) {
        createMutation.mutate(val)
        e.currentTarget.value = ''
      }
    }
  }

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

        {/* Search / Cmd+K */}
        <div className="px-2 pb-1">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors text-left"
          >
            <Search size={14} className="text-zinc-500" />
            <span className="text-sm text-zinc-600 flex-1">Search pages...</span>
            <kbd className="text-[10px] text-zinc-700 border border-white/10 rounded px-1">⌘K</kbd>
          </button>
        </div>

        {/* Nav */}
        <div className="px-2 py-1 space-y-0.5">
          <button
            onClick={() => router.push('/workspace')}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
              pathname === '/workspace'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>All Pages</span>
          </button>
          <button
            onClick={() => router.push('/workspace/agents')}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
              pathname.startsWith('/workspace/agents')
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>Agents</span>
          </button>
          <button
            onClick={() => router.push('/workspace/settings')}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
              pathname === '/workspace/settings'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>

        <div className="px-3 py-2 mt-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Pages</p>
        </div>

        {/* Pages list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {pagesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-zinc-600" size={18} />
            </div>
          ) : pages.length === 0 ? (
            <p className="text-xs text-zinc-600 px-2 py-4 text-center">No pages yet</p>
          ) : (
            pages.map((page) => {
              const isActive = pathname === `/workspace/${page.id}`
              return (
                <div
                  key={page.id}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'
                  }`}
                  onClick={() => router.push(`/workspace/${page.id}`)}
                >
                  <FileText size={13} className="text-zinc-600 flex-shrink-0" />
                  <span className="text-sm text-zinc-300 truncate flex-1">{page.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete "${page.title}"?`)) deleteMutation.mutate(page.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
                    aria-label={`Delete ${page.title}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* New page */}
        <div className="p-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">
            <Plus size={14} className="text-zinc-500 flex-shrink-0" />
            <input
              placeholder="New page..."
              onKeyDown={handleKeyDown}
              className="bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none flex-1 w-full"
            />
            {createMutation.isPending && <Loader2 size={12} className="animate-spin text-zinc-600" />}
          </div>
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
        {children}
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}
