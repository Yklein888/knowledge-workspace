import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// DELETE /api/tokens/[tokenId] - Revoke an API token
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { tokenId } = await params

    const { error } = await supabaseAdmin
      .from('api_tokens')
      .delete()
      .eq('id', tokenId)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting token:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete token' }, { status: 500 })
  }
}
