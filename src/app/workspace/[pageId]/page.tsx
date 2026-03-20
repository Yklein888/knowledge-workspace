'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

interface Page {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function PageEditor({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useUser()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const { data: page, isLoading } = useQuery<Page>({
    queryKey: ['page', pageId],
    queryFn: async () => {
      const res = await fetch(`/api/pages/${pageId}`, {
        headers: { 'x-user-id': user!.id },
      })
      if (!res.ok) throw new Error('Page not found')
      return res.json().then((d) => d.data)
    },
    enabled: !!user && !!pageId,
  })

  useEffect(() => {
    if (page) {
      setTitle(page.title)
      setContent(page.content ?? '')
    }
  }, [page])

  const saveMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) throw new Error('Failed to save')
      return res.json().then((d) => d.data)
    },
    onSuccess: (updated) => {
      setSaveStatus('saved')
      queryClient.setQueryData(['page', pageId], updated)
      queryClient.invalidateQueries({ queryKey: ['pages', user?.id] })
    },
    onError: () => {
      setSaveStatus('unsaved')
      toast.error('Failed to save')
    },
  })

  // Debounced auto-save
  const autoSave = useCallback(
    (t: string, c: string) => {
      setSaveStatus('saving')
      const timer = setTimeout(() => {
        saveMutation.mutate({ title: t, content: c })
      }, 1000)
      return timer
    },
    [saveMutation],
  )

  useEffect(() => {
    if (!page || (title === page.title && content === (page.content ?? ''))) return
    const timer = autoSave(title, content)
    return () => clearTimeout(timer)
  }, [title, content])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
      </div>
    )
  }

  if (!page && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <p>Page not found</p>
        <button onClick={() => router.push('/workspace')} className="text-sm text-violet-400 hover:text-violet-300">
          Back to workspace
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-white/5">
        <button
          onClick={() => router.push('/workspace')}
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={12} />
          Back
        </button>
        <span className="text-xs text-zinc-600">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'All changes saved'}
          {saveStatus === 'unsaved' && 'Unsaved changes'}
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-10 max-w-3xl mx-auto w-full">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaveStatus('unsaved') }}
          placeholder="Untitled"
          className="w-full text-4xl font-bold text-white bg-transparent outline-none placeholder-zinc-700 mb-8"
        />
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setSaveStatus('unsaved') }}
          placeholder="Start writing..."
          className="w-full flex-1 text-base text-zinc-300 bg-transparent outline-none placeholder-zinc-700 resize-none leading-relaxed"
          style={{ minHeight: '60vh' }}
        />
      </div>
    </div>
  )
}
