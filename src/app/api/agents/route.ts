import { NextRequest, NextResponse } from 'next/server'
import { CreateAgentSchema } from '@/types/api'
import { getAgentsByUser, createAgent } from '@/lib/db-utils'
import { resolveUserId } from '@/lib/auth-middleware'

// GET /api/agents - List user's agents
export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req)
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const userAgents = await getAgentsByUser(userId)
    return NextResponse.json({ success: true, data: userAgents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// POST /api/agents - Create new agent
export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req)
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const validated = CreateAgentSchema.parse(body)

    const agent = await createAgent({
      userId,
      name: validated.name,
      description: validated.description,
      goal: validated.goal,
      tools: validated.tools || {},
      mcp: validated.mcp || {},
      config: validated.config || {},
    })

    return NextResponse.json({ success: true, data: agent }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 })
  }
}
