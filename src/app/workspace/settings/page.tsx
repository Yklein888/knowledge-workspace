'use client'

import { useState } from 'react'
import { User, Mail, Lock, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const { user } = useUser()
  const [displayName, setDisplayName] = useState(
    (user?.user_metadata?.full_name as string) ?? user?.email?.split('@')[0] ?? ''
  )
  const [savingName, setSavingName] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

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

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Profile</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-5">
            {/* Avatar */}
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
