'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Trash2, LogOut } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/lib/auth'

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
  content: string
}

export default function WorkspacePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPageTitle, setNewPageTitle] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  // Fetch pages on mount (only if user exists)
  useEffect(() => {
    if (user) {
      fetchPages()
    }
  }, [user])

  async function fetchPages() {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/pages', {
        headers: {
          'x-user-id': user.id,
        },
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

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
        }),
      })

      if (!response.ok) throw new Error('Failed to create page')

      const { data } = await response.json()
      setPages([...pages, data])
      setNewPageTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page')
    }
  }

  async function deletePage(pageId: string) {
    if (!user) return

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      })

      if (!response.ok) throw new Error('Failed to delete page')

      setPages(pages.filter((p) => p.id !== pageId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page')
    }
  }

  async function handleLogout() {
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout')
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
            My Workspace
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Create and manage your knowledge pages
          </p>
          {user && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
              Welcome, {user.email}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={createPage} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="New page title..."
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">Loading pages...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <FileText className="mx-auto mb-4 text-zinc-400" size={48} />
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">No pages yet</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Create your first page to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                    {page.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    /{page.slug}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                    Created {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deletePage(page.id)}
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition"
                  title="Delete page"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
