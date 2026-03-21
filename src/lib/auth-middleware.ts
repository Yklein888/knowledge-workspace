import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Resolves the authenticated user ID from either:
 * 1. Authorization: Bearer agt_xxx  (API token)
 * 2. x-user-id header (internal/legacy)
 *
 * Returns userId string or null if unauthenticated.
 */
export async function resolveUserId(req: NextRequest): Promise<string | null> {
  // 1. Bearer token
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer agt_')) {
    const token = authHeader.slice(7)
    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .select('user_id, expires_at')
      .eq('token', token)
      .single()

    if (error || !data) return null

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) return null

    // Update last_used_at (fire-and-forget)
    supabaseAdmin
      .from('api_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('token', token)
      .then(() => {})

    return data.user_id as string
  }

  // 2. Legacy x-user-id header
  return req.headers.get('x-user-id')
}
