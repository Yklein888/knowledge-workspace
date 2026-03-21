'use client'

import { useState } from 'react'
import { User, Mail, Lock, Loader2, Check, Key, Plus, Trash2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

interface ApiToken {
  id: string
  name: string
  token: string
  scopes: string[]
  createdAt: string
  lastUsedAt: string | null
}

export default function SettingsPage() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [displayName, setDisplayName] = useState(
    (user?.user_metadata?.full_name as string) ?? user?.email?.split('@')[0] ?? ''
  )
  const [savingName, setSavingName] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [newTokenName, setNewTokenName] = useState('')
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(null)

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setSavingName(true)
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: displayName.trim() } })
      if (error) throw error
      toast.success('Name updated')
    } catch {
      toast.error('Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password changed')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  // API Tokens
  const { data: tokens = [], isLoading: tokensLoading } = useQuery<ApiToken[]>({
    queryKey: ['tokens', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/tokens', { headers: { 'x-user-id': user!.id } })
      if (!res.ok) throw new Error('Failed to fetch tokens')
      return res.json().then((d) => d.data ?? [])
    },
    enabled: !!user,
  })

  const createTokenMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to create token')
      return res.json().then((d) => d.data as ApiToken)
    },
    onSuccess: (token) => {
      setNewlyCreatedToken(token.token)
      setNewTokenName('')
      queryClient.invalidateQueries({ queryKey: ['tokens', user?.id] })
      toast.success('Token created — copy it now, it won\'t be shown again')
    },
    onError: () => toast.error('Failed to create token'),
  })

  const deleteTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const res = await fetch(`/api/tokens/${tokenId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.id },
      })
      if (!res.ok) throw new Error('Failed to delete token')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens', user?.id] })
      toast.success('Token revoked')
    },
    onError: () => toast.error('Failed to revoke token'),
  })

  function copyToken(value: string) {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Profile</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                {(displayName || user?.email || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{displayName || 'Set your name'}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  <User size={12} className="inline mr-1" />Display name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  <Mail size={12} className="inline mr-1" />Email
                </label>
                <input
                  value={user?.email ?? ''}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-zinc-500 text-sm cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={savingName || !displayName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50"
              >
                {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Save profile
              </button>
            </form>
          </div>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Security</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  <Lock size={12} className="inline mr-1" />New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50"
              >
                {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Change password
              </button>
            </form>
          </div>
        </section>

        {/* API Tokens */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">API Tokens</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-xs text-zinc-500">
              Use API tokens to give external systems access to your workspace via Bearer token authentication.
            </p>

            {/* Newly created token — show once */}
            {newlyCreatedToken && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-amber-400">Copy this token now — it won&apos;t be shown again</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-amber-300 bg-black/20 px-3 py-2 rounded-lg font-mono break-all">
                    {newlyCreatedToken}
                  </code>
                  <button
                    onClick={() => copyToken(newlyCreatedToken)}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition flex-shrink-0"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <button
                  onClick={() => setNewlyCreatedToken(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-400"
                >
                  I&apos;ve saved it, dismiss
                </button>
              </div>
            )}

            {/* Create new token */}
            <div className="flex items-center gap-2">
              <input
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="Token name (e.g. My App)"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTokenName.trim() && !createTokenMutation.isPending) {
                    createTokenMutation.mutate(newTokenName.trim())
                  }
                }}
              />
              <button
                onClick={() => newTokenName.trim() && createTokenMutation.mutate(newTokenName.trim())}
                disabled={!newTokenName.trim() || createTokenMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm transition disabled:opacity-50"
              >
                {createTokenMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Generate
              </button>
            </div>

            {/* Token list */}
            {tokensLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-zinc-600" size={18} />
              </div>
            ) : tokens.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-3">No tokens yet</p>
            ) : (
              <div className="space-y-2">
                {tokens.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Key size={14} className="text-zinc-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 font-medium">{t.name}</p>
                      <p className="text-xs text-zinc-600 font-mono">{t.token}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {t.lastUsedAt && (
                        <p className="text-[10px] text-zinc-600">
                          Used {new Date(t.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-700">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Revoke token "${t.name}"?`)) deleteTokenMutation.mutate(t.id)
                      }}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Account info */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Account</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Account ID</span>
              <span className="text-zinc-400 font-mono text-xs">{user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Member since</span>
              <span className="text-zinc-400">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Plan</span>
              <span className="text-violet-400 font-medium">Free</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
