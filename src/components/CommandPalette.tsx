'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Plus, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: ['pages', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/pages', { headers: { 'x-user-id': user!.id } })
      if (!res.ok) throw new Error('Failed to fetch pages')
      return res.json().then((d) => d.data ?? [])
    },
    enabled: !!user && open,
  })

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify({ title, slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }),
      })
      if (!res.ok) throw new Error('Failed to create page')
      return res.json().then((d) => d.data)
    },
    onSuccess: (newPage) => {
      queryClient.setQueryData(['pages', user?.id], (old: Page[] = []) => [newPage, ...old])
      toast.success('Page created')
      router.push(`/workspace/${newPage.id}`)
      onClose()
    },
    onError: () => toast.error('Failed to create page'),
  })

  const filtered = query.trim()
    ? pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : pages.slice(0, 8)

  const showCreate = query.trim().length > 0

  const totalItems = filtered.length + (showCreate ? 1 : 0)

  const navigate = useCallback((page: Page) => {
    router.push(`/workspace/${page.id}`)
    onClose()
  }, [router, onClose])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, totalItems - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex < filtered.length) {
          navigate(filtered[activeIndex])
        } else if (showCreate && activeIndex === filtered.length) {
          createMutation.mutate(query.trim())
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, activeIndex, filtered, showCreate, query, navigate, createMutation, totalItems, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#1c1c1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search size={16} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 outline-none"
          />
          {createMutation.isPending && <Loader2 size={14} className="animate-spin text-zinc-500" />}
          <kbd className="text-[10px] text-zinc-600 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 && !showCreate ? (
            <p className="text-center text-zinc-600 text-sm py-6">No pages found</p>
          ) : (
            <>
              {filtered.map((page, i) => (
                <button
                  key={page.id}
                  onClick={() => navigate(page)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    activeIndex === i ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <FileText size={14} className="text-zinc-600 flex-shrink-0" />
                  <span className="text-sm text-zinc-200 truncate">{page.title}</span>
                  <span className="ml-auto text-xs text-zinc-600 flex-shrink-0">
                    {new Date(page.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}

              {showCreate && (
                <button
                  onClick={() => createMutation.mutate(query.trim())}
                  onMouseEnter={() => setActiveIndex(filtered.length)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-t border-white/5 ${
                    activeIndex === filtered.length ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <Plus size={14} className="text-violet-400 flex-shrink-0" />
                  <span className="text-sm text-violet-300">
                    Create &quot;{query.trim()}&quot;
                  </span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-3 text-[10px] text-zinc-600">
          <span><kbd className="border border-white/10 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-white/10 rounded px-1">↵</kbd> open</span>
          <span><kbd className="border border-white/10 rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
