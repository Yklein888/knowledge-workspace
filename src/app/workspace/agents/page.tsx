'use client'

import { useState } from 'react'
import { Plus, Sparkles, Trash2, Settings2, Loader2, Bot, ChevronRight, Power } from 'lucide-react'
import { toast } from 'sonner'
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent, type Agent } from '@/hooks/useAgents'

export default function AgentsPage() {
  const { data: agents = [], isLoading } = useAgents()
  const createMutation = useCreateAgent()
  const updateMutation = useUpdateAgent()
  const deleteMutation = useDeleteAgent()

  const [selected, setSelected] = useState<Agent | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editForm, setEditForm] = useState({ name: '', description: '', goal: '' })

  function selectAgent(agent: Agent) {
    setSelected(agent)
    setCreating(false)
    setEditForm({
      name: agent.name,
      description: agent.description ?? '',
      goal: agent.goal ?? '',
    })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const agent = await createMutation.mutateAsync({ name: newName.trim() })
      setNewName('')
      setCreating(false)
      selectAgent(agent)
      toast.success('Agent created')
    } catch {
      toast.error('Failed to create agent')
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    try {
      await updateMutation.mutateAsync({
        agentId: selected.id,
        input: { name: editForm.name, description: editForm.description, goal: editForm.goal },
      })
      toast.success('Agent updated')
    } catch {
      toast.error('Failed to update agent')
    }
  }

  async function handleToggleActive(agent: Agent) {
    try {
      await updateMutation.mutateAsync({ agentId: agent.id, input: { isActive: !agent.isActive } })
      toast.success(agent.isActive ? 'Agent deactivated' : 'Agent activated')
    } catch {
      toast.error('Failed to update agent')
    }
  }

  async function handleDelete(agentId: string) {
    try {
      await deleteMutation.mutateAsync(agentId)
      if (selected?.id === agentId) setSelected(null)
      toast.success('Agent deleted')
    } catch {
      toast.error('Failed to delete agent')
    }
  }

  return (
    <div className="flex h-full">
      {/* Left: Agent list */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-zinc-200">Agents</h2>
            <button
              onClick={() => { setCreating(true); setSelected(null) }}
              className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
              title="New agent"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-xs text-zinc-600">{agents.length} agent{agents.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-zinc-600" size={18} />
            </div>
          ) : agents.length === 0 && !creating ? (
            <div className="text-center py-8">
              <Bot size={24} className="text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">No agents yet</p>
            </div>
          ) : (
            agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => selectAgent(agent)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                  selected?.id === agent.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.isActive ? 'bg-green-500' : 'bg-zinc-600'}`} />
                <span className="text-sm truncate flex-1">{agent.name}</span>
                <ChevronRight size={12} className="text-zinc-600 flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* New agent form */}
        {creating && (
          <div className="p-3 border-t border-white/5">
            <form onSubmit={handleCreate}>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Agent name..."
                className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-violet-500/50 mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newName.trim() || createMutation.isPending}
                  className="flex-1 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition disabled:opacity-50"
                >
                  {createMutation.isPending ? <Loader2 size={12} className="animate-spin mx-auto" /> : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setNewName('') }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-xs transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right: Editor */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Bot size={20} className="text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{selected.name}</h1>
                <p className="text-xs text-zinc-500">
                  Created {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(selected)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selected.isActive
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                  }`}
                >
                  <Power size={12} />
                  {selected.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete agent"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What does this agent do?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition resize-none placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Goal / Instructions</label>
                <textarea
                  value={editForm.goal}
                  onChange={(e) => setEditForm((f) => ({ ...f, goal: e.target.value }))}
                  placeholder="Describe the agent's goal, role, and how it should behave..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition resize-none placeholder-zinc-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Settings2 size={14} />}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm">Select an agent or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
