import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/tokens - List user's API tokens
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .select('id, name, token, scopes, last_used_at, created_at, expires_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Mask token value in list
    const masked = (data ?? []).map((t: Record<string, unknown>) => ({
      ...t,
      token: `${String(t.token).slice(0, 10)}...`,
    }))

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

    // Generate a secure random token using Web Crypto API (works in all runtimes)
    const bytes = new Uint8Array(32)
    globalThis.crypto.getRandomValues(bytes)
    const token = `agt_${Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')}`

    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .insert({ user_id: userId, name, token, scopes })
      .select()
      .single()

    if (error) throw error

    // Return full token ONCE on creation
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ success: false, error: 'Failed to create token' }, { status: 500 })
  }
}
