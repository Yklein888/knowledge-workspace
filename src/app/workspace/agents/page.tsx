'use client'

import { useState } from 'react'
import {
  Plus, Sparkles, Trash2, Bot, Power, X, ChevronRight,
  Server, Plug, Settings2, Loader2, Copy, Check
} from 'lucide-react'
import { toast } from 'sonner'
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent, type Agent } from '@/hooks/useAgents'

const AGENT_COLORS = [
  '#1e3a5f', '#4a1d96', '#14532d', '#7f1d1d', '#7c2d12',
  '#134e4a', '#713f12', '#831843', '#3b0764',
]

const AGENT_TEMPLATES = [
  { name: 'QA Engineer', role: 'Quality Assurance Engineer', goal: 'You are a QA engineer. You write test cases, find bugs, and ensure software quality through systematic testing and automation.', expertise: 'testing, automation, CI/CD' },
  { name: 'DevOps Engineer', role: 'DevOps & Infrastructure Engineer', goal: 'You are a DevOps engineer. You manage CI/CD pipelines, infrastructure as code, deployments, and cloud resources.', expertise: 'docker, kubernetes, terraform, AWS' },
  { name: 'Data Engineer', role: 'Data Engineer', goal: 'You are a data engineer. You build data pipelines, ETL processes, and analytics infrastructure.', expertise: 'SQL, Python, dbt, Spark' },
  { name: 'Security Auditor', role: 'Security Engineer', goal: 'You are a security auditor. You review code for vulnerabilities, run security assessments, and suggest hardening measures.', expertise: 'OWASP, penetration testing, code review' },
  { name: 'Docs Writer', role: 'Technical Writer', goal: 'You are a technical writer. You create clear, accurate API documentation, guides, and tutorials.', expertise: 'documentation, OpenAPI, markdown' },
  { name: 'Data Analyst', role: 'Data Analyst', goal: 'You are a data analyst. You analyze datasets, create reports, and provide actionable insights.', expertise: 'SQL, Python, visualization, statistics' },
]

interface McpServer {
  id: string
  name: string
  icon: string
  description: string
  type: 'stdio' | 'http' | 'sse'
  command: string
  args: string
  env: { key: string; value: string }[]
  active: boolean
}

interface AddAgentModalProps {
  onClose: () => void
  onCreated: (agent: Agent) => void
}

function AddAgentModal({ onClose, onCreated }: AddAgentModalProps) {
  const createMutation = useCreateAgent()
  const [tab, setTab] = useState<'templates' | 'custom'>('templates')
  const [form, setForm] = useState({ name: '', role: '', goal: '', expertise: '', color: AGENT_COLORS[0] })

  function applyTemplate(t: typeof AGENT_TEMPLATES[0]) {
    setForm({ name: t.name, role: t.role, goal: t.goal, expertise: t.expertise, color: AGENT_COLORS[Math.floor(Math.random() * AGENT_COLORS.length)] })
    setTab('custom')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      const agent = await createMutation.mutateAsync({
        name: form.name.trim(),
        description: form.role.trim(),
        goal: form.goal.trim(),
        config: { color: form.color, expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean) } as Record<string, unknown>,
      })
      toast.success('Agent created')
      onCreated(agent)
    } catch {
      toast.error('Failed to create agent')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Add Agent</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(['templates', 'custom'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                tab === t ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'templates' ? 'Templates' : 'Custom Agent'}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {tab === 'templates' ? (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 mb-3">Pick a template to get started quickly</p>
              {AGENT_TEMPLATES.map(t => (
                <button
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{t.role}</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-violet-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form id="agent-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. QA, DevOps, Data Engineer"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Role</label>
                <input
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Quality Assurance Engineer"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {AGENT_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`w-9 h-9 rounded-xl transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Personality / System Prompt</label>
                <textarea
                  value={form.goal}
                  onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                  placeholder="Describe how this agent should behave..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Expertise (comma-separated)</label>
                <input
                  value={form.expertise}
                  onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
                  placeholder="e.g. testing, automation, CI/CD"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600"
                />
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm transition">Cancel</button>
          {tab === 'custom' && (
            <button
              form="agent-form"
              type="submit"
              disabled={!form.name.trim() || createMutation.isPending}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              Add Agent
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface AddMcpModalProps {
  onClose: () => void
  onAdd: (server: Omit<McpServer, 'id' | 'active'>) => void
}

function AddMcpModal({ onClose, onAdd }: AddMcpModalProps) {
  const [form, setForm] = useState({ name: '', icon: 'lucide:plug', description: '', type: 'stdio' as McpServer['type'], command: 'npx', args: '-y, @some/package', env: [] as { key: string; value: string }[] })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ name: form.name, icon: form.icon, description: form.description, type: form.type, command: form.command, args: form.args, env: form.env })
    onClose()
  }

  function addEnvVar() {
    setForm(f => ({ ...f, env: [...f.env, { key: '', value: '' }] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Add MCP Server</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        <form id="mcp-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
              <input autoFocus value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Server" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Icon</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="lucide:plug" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600 font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this server do?" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {(['stdio', 'http', 'sse'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 text-sm font-medium uppercase transition-colors ${form.type === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-zinc-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {form.type === 'stdio' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Command</label>
                <input value={form.command} onChange={e => setForm(f => ({ ...f, command: e.target.value }))} placeholder="npx" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Args (comma-separated)</label>
                <input value={form.args} onChange={e => setForm(f => ({ ...f, args: e.target.value }))} placeholder="-y, @some/package" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition font-mono" />
              </div>
            </>
          )}
          {(form.type === 'http' || form.type === 'sse') && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">URL</label>
              <input placeholder="https://your-mcp-server.com/mcp" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Environment Variables</label>
            {form.env.map((e, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={e.key} onChange={ev => setForm(f => { const env = [...f.env]; env[i] = { ...env[i], key: ev.target.value }; return { ...f, env } })} placeholder="KEY" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 transition font-mono" />
                <input value={e.value} onChange={ev => setForm(f => { const env = [...f.env]; env[i] = { ...env[i], value: ev.target.value }; return { ...f, env } })} placeholder="value" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 transition font-mono" />
                <button type="button" onClick={() => setForm(f => ({ ...f, env: f.env.filter((_, j) => j !== i) }))} className="p-2 text-zinc-600 hover:text-red-400 transition-colors"><X size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={addEnvVar} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors mt-1">
              <Plus size={12} /> Add variable
            </button>
          </div>
          <p className="text-xs text-zinc-600">Pick from templates (GitHub, Supabase, Filesystem) or add a custom stdio/http server</p>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm transition">Cancel</button>
          <button form="mcp-form" type="submit" disabled={!form.name.trim()} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50">Add</button>
        </div>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const { data: agents = [], isLoading } = useAgents()
  const updateMutation = useUpdateAgent()
  const deleteMutation = useDeleteAgent()

  const [selected, setSelected] = useState<Agent | null>(null)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [showAddMcp, setShowAddMcp] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', role: '', goal: '', expertise: '' })

  const totalMcp = agents.reduce((acc, a) => acc + ((a.config as Record<string, unknown>)?.mcpServers as unknown[] || []).length, 0)
  const activeAgents = agents.filter(a => a.isActive).length

  function selectAgent(agent: Agent) {
    setSelected(agent)
    const cfg = (agent.config as Record<string, unknown>) || {}
    setEditForm({
      name: agent.name,
      role: agent.description ?? '',
      goal: agent.goal ?? '',
      expertise: ((cfg.expertise as string[]) || []).join(', '),
    })
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    try {
      const cfg = (selected.config as Record<string, unknown>) || {}
      await updateMutation.mutateAsync({
        agentId: selected.id,
        input: {
          name: editForm.name,
          description: editForm.role,
          goal: editForm.goal,
          config: { ...cfg, expertise: editForm.expertise.split(',').map(s => s.trim()).filter(Boolean) },
        },
      })
      toast.success('Agent saved')
    } catch {
      toast.error('Failed to save agent')
    }
  }

  async function handleToggle(agent: Agent) {
    try {
      await updateMutation.mutateAsync({ agentId: agent.id, input: { isActive: !agent.isActive } })
      if (selected?.id === agent.id) setSelected({ ...selected, isActive: !agent.isActive })
    } catch {
      toast.error('Failed to update agent')
    }
  }

  async function handleDelete(agentId: string) {
    if (!confirm('Delete this agent?')) return
    try {
      await deleteMutation.mutateAsync(agentId)
      if (selected?.id === agentId) setSelected(null)
      toast.success('Agent deleted')
    } catch {
      toast.error('Failed to delete agent')
    }
  }

  function handleAddMcp(server: Omit<McpServer, 'id' | 'active'>) {
    if (!selected) return
    const cfg = (selected.config as Record<string, unknown>) || {}
    const existing = (cfg.mcpServers as McpServer[]) || []
    const newServer = { ...server, id: crypto.randomUUID(), active: true }
    updateMutation.mutateAsync({
      agentId: selected.id,
      input: { config: { ...cfg, mcpServers: [...existing, newServer] } },
    }).then(() => toast.success('MCP server added')).catch(() => toast.error('Failed to add server'))
  }

  function removeMcp(serverId: string) {
    if (!selected) return
    const cfg = (selected.config as Record<string, unknown>) || {}
    const existing = (cfg.mcpServers as McpServer[]) || []
    updateMutation.mutateAsync({
      agentId: selected.id,
      input: { config: { ...cfg, mcpServers: existing.filter(s => s.id !== serverId) } },
    }).then(() => toast.success('Server removed')).catch(() => toast.error('Failed to remove server'))
  }

  function copyAgentToken(agentId: string) {
    navigator.clipboard.writeText(`agent_${agentId}`)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
    toast.success('Token copied')
  }

  const selectedCfg = (selected?.config as Record<string, unknown>) || {}
  const mcpServers = (selectedCfg.mcpServers as McpServer[]) || []
  const agentColor = (selectedCfg.color as string) || '#1e3a5f'
  const expertise = (selectedCfg.expertise as string[]) || []

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col overflow-hidden">
        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-white/5">
          {[
            { label: 'TOTAL AGENTS', value: agents.length },
            { label: 'ACTIVE', value: activeAgents },
            { label: 'MCP SERVERS', value: totalMcp },
          ].map(s => (
            <div key={s.label} className="p-4 border-r border-white/5 last:border-r-0">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.value > 0 ? 'text-violet-400' : 'text-zinc-600'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="p-3 border-b border-white/5">
          <button
            onClick={() => setShowAddAgent(true)}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            <Plus size={14} /> New Agent
          </button>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-zinc-600" size={18} /></div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <Bot size={28} className="text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">No agents yet</p>
              <button onClick={() => setShowAddAgent(true)} className="text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors">Create your first agent →</button>
            </div>
          ) : (
            agents.map(agent => {
              const cfg = (agent.config as Record<string, unknown>) || {}
              const color = (cfg.color as string) || '#1e3a5f'
              return (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(agent)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    selected?.id === agent.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{agent.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{agent.description || 'No role set'}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.isActive ? 'bg-green-500' : 'bg-zinc-600'}`} />
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: agentColor }}>
                <Bot size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">{selected.name}</h1>
                <p className="text-sm text-zinc-500">{selected.description || 'Agent'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(selected)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selected.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                  }`}
                >
                  <Power size={11} /> {selected.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDelete(selected.id)} className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Edit form */}
            <form onSubmit={handleUpdate} className="space-y-5 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Role</label>
                  <input value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. QA Engineer"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Personality / System Prompt</label>
                <textarea value={editForm.goal} onChange={e => setEditForm(f => ({ ...f, goal: e.target.value }))} rows={5} placeholder="Describe how this agent should behave..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition resize-none placeholder-zinc-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Expertise (comma-separated)</label>
                <input value={editForm.expertise} onChange={e => setEditForm(f => ({ ...f, expertise: e.target.value }))} placeholder="e.g. testing, automation, CI/CD"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition placeholder-zinc-600" />
              </div>
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {expertise.map(e => <span key={e} className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">{e}</span>)}
                </div>
              )}
              <button type="submit" disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50">
                {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Settings2 size={14} />}
                Save changes
              </button>
            </form>

            {/* API Token */}
            <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">API Token</p>
                <button onClick={() => copyAgentToken(selected.id)} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors">
                  {copiedToken ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copiedToken ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="text-xs text-zinc-400 font-mono break-all">agent_{selected.id}</code>
              <p className="text-xs text-zinc-600 mt-2">Use this token to control this agent via external systems</p>
            </div>

            {/* MCP Servers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">MCP Servers</p>
                  <p className="text-xs text-zinc-500">{mcpServers.length} server{mcpServers.length !== 1 ? 's' : ''} connected</p>
                </div>
                <button onClick={() => setShowAddMcp(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs transition-colors">
                  <Plus size={12} /> Add Server
                </button>
              </div>

              {mcpServers.length === 0 ? (
                <button onClick={() => setShowAddMcp(true)}
                  className="w-full py-8 rounded-2xl border border-dashed border-white/10 hover:border-violet-500/30 transition-colors text-center">
                  <Server size={24} className="text-zinc-700 mx-auto mb-2" />
                  <p className="text-sm text-zinc-600">No MCP servers connected</p>
                  <p className="text-xs text-zinc-700 mt-1">Add a server to extend agent capabilities</p>
                </button>
              ) : (
                <div className="space-y-2">
                  {mcpServers.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Plug size={14} className="text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200">{s.name}</p>
                        <p className="text-xs text-zinc-500 font-mono">{s.type.toUpperCase()} · {s.command} {s.args}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">active</span>
                      <button onClick={() => removeMcp(s.id)} className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm">Select an agent or create a new one</p>
              <button onClick={() => setShowAddAgent(true)} className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">+ New Agent</button>
            </div>
          </div>
        )}
      </div>

      {showAddAgent && <AddAgentModal onClose={() => setShowAddAgent(false)} onCreated={a => { setShowAddAgent(false); selectAgent(a) }} />}
      {showAddMcp && selected && <AddMcpModal onClose={() => setShowAddMcp(false)} onAdd={handleAddMcp} />}
    </div>
  )
}
