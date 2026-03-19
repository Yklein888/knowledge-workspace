import { NextRequest, NextResponse } from 'next/server'
import { getAgentById } from '@/lib/db-utils'
import { AgentExportSchema } from '@/types/api'

// GET /api/agents/[agentId]/export - Export agent configuration
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

    // Format export for external use
    const exportData = {
      id: agent.id,
      name: agent.name,
      version: 1,
      goal: agent.goal,
      tools: Array.isArray(agent.tools) ? agent.tools : [],
      mcp: Array.isArray(agent.mcp) ? agent.mcp : [],
      config: agent.config || {},
      exportedAt: new Date(),
    }

    // Validate export format
    const validated = AgentExportSchema.parse(exportData)

    // Return as JSON file download
    return new NextResponse(JSON.stringify(validated, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${agent.name}-${agent.id}.json"`,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Error exporting agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export agent' },
      { status: 500 },
    )
  }
}

// POST /api/agents/[agentId]/export - Create versioned export
export async function POST(
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

    // TODO: Create versioned export in database
    // For now, default to version 1
    const version = 1

    const exportData = {
      id: agent.id,
      name: agent.name,
      version,
      goal: agent.goal,
      tools: Array.isArray(agent.tools) ? agent.tools : [],
      mcp: Array.isArray(agent.mcp) ? agent.mcp : [],
      config: agent.config || {},
      exportedAt: new Date(),
    }

    return NextResponse.json(
      { success: true, data: exportData },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Error creating agent export:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create export' },
      { status: 500 },
    )
  }
}
