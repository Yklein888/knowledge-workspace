'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/hooks/useUser'

export interface Agent {
  id: string
  name: string
  description: string | null
  goal: string | null
  tools: unknown[]
  config: Record<string, unknown>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAgentInput {
  name: string
  description?: string
  goal?: string
  config?: Record<string, unknown>
}

export interface UpdateAgentInput {
  name?: string
  description?: string
  goal?: string
  isActive?: boolean
  config?: Record<string, unknown>
}

export function useAgents() {
  const { user } = useUser()

  return useQuery<Agent[]>({
    queryKey: ['agents', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/agents', { headers: { 'x-user-id': user!.id } })
      if (!res.ok) throw new Error('Failed to fetch agents')
      return res.json().then((d) => d.data ?? [])
    },
    enabled: !!user,
  })
}

export function useCreateAgent() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateAgentInput) => {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create agent')
      return res.json().then((d) => d.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] })
    },
  })
}

export function useUpdateAgent() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ agentId, input }: { agentId: string; input: UpdateAgentInput }) => {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to update agent')
      return res.json().then((d) => d.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] })
    },
  })
}

export function useDeleteAgent() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (agentId: string) => {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.id },
      })
      if (!res.ok) throw new Error('Failed to delete agent')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] })
    },
  })
}
