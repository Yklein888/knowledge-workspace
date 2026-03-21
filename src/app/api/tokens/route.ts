import { NextRequest, NextResponse } from 'next/server'
import { getTokensByUser, createApiToken } from '@/lib/db-utils'

// GET /api/tokens - List user's API tokens
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const tokens = await getTokensByUser(userId)
    // Never return the raw token value in list — mask it
    const masked = tokens.map((t) => ({ ...t, token: `${t.token.slice(0, 10)}...` }))

    return NextResponse.json({ success: true, data: masked })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tokens' }, { status: 500 })
  }
}

// POST /api/tokens - Create new API token
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'API Token'
    const scopes: string[] = Array.isArray(body.scopes) ? body.scopes : ['read', 'write']

    const token = await createApiToken({ userId, name, scopes })

    // Return the full token value ONCE on creation
    return NextResponse.json({ success: true, data: token }, { status: 201 })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ success: false, error: 'Failed to create token' }, { status: 500 })
  }
}
