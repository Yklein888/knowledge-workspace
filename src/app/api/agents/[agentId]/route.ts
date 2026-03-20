import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, updateAgent, deleteAgent } from '@/lib/db-utils'

// GET /api/agents/[agentId] - Get single agent
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params

    const agent = await getAgentById(agentId)

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: agent,
    })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent' },
      { status: 500 },
    )
  }
}

// PATCH /api/agents/[agentId] - Update agent
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const agent = await getAgentById(agentId)
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 },
      )
    }

    if (agent.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const updated = await updateAgent(agentId, body)

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Error updating agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update agent' },
      { status: 500 },
    )
  }
}

// DELETE /api/agents/[agentId] - Delete agent
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const agent = await getAgentById(agentId)
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 },
      )
    }

    if (agent.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    await deleteAgent(agentId)

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete agent' },
      { status: 500 },
    )
  }
}
