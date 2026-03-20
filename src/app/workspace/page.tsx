'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Trash2, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
  content: string
}

export default function WorkspacePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useUser()
  const [newPageTitle, setNewPageTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ['pages', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/pages', { headers: { 'x-user-id': user!.id } })
      if (!res.ok) throw new Error('Failed to fetch pages')
      return res.json().then((d) => d.data ?? [])
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
      setNewPageTitle('')
      setSearchQuery('')
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
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: (_, pageId) => {
      queryClient.setQueryData(['pages', user?.id], (old: Page[] = []) =>
        old.filter((p) => p.id !== pageId),
      )
      setDeleteConfirm(null)
      toast.success('Page deleted')
    },
    onError: () => toast.error('Failed to delete page'),
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newPageTitle.trim() || createMutation.isPending) return
    createMutation.mutate(newPageTitle.trim())
  }

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (pages.length === 0) {
    return (
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
        <form onSubmit={handleCreate} className="flex gap-2 w-full max-w-sm">
          <input
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Page title..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newPageTitle.trim() || createMutation.isPending}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create
          </button>
        </form>
        {/* Quick start templates */}
        <div className="flex gap-2 flex-wrap justify-center">
          {['Meeting notes', 'Project plan', 'Research'].map((template) => (
            <button
              key={template}
              onClick={() => createMutation.mutate(template)}
              className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-colors"
            >
              + {template}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">All Pages</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {pages.length} page{pages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="New page title..."
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 text-sm w-48"
            />
            <button
              type="submit"
              disabled={!newPageTitle.trim() || createMutation.isPending}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {createMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              Create
            </button>
          </form>
        </div>

        {/* Search */}
        {pages.length > 5 && (
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 text-sm"
          />
        )}

        {filteredPages.length === 0 && searchQuery && (
          <div className="text-center py-8 text-zinc-500">
            <p className="text-sm">No results for &quot;{searchQuery}&quot;</p>
            <button onClick={() => setSearchQuery('')} className="text-xs text-violet-400 hover:text-violet-300 mt-2">
              Clear search
            </button>
          </div>
        )}

        <div className="grid gap-2">
          {filteredPages.map((page) => (
            <div key={page.id}>
              <div
                onClick={() => router.push(`/workspace/${page.id}`)}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{page.title}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {new Date(page.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(page.id) }}
                  className="p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Delete ${page.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Inline confirm */}
              {deleteConfirm === page.id && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg mt-1 text-sm">
                  <span className="text-red-300 flex-1">Delete &quot;{page.title}&quot;?</span>
                  <button
                    onClick={() => deleteMutation.mutate(page.id)}
                    disabled={deleteMutation.isPending}
                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
