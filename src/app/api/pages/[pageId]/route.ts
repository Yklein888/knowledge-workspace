import { NextRequest, NextResponse } from 'next/server'
import { UpdatePageSchema } from '@/types/api'
import { getPageById, updatePage, deletePage } from '@/lib/db-utils'

// GET /api/pages/[pageId] - Get single page with documents and links
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const { pageId } = await params

    const page = await getPageById(pageId)

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: page,
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 },
    )
  }
}

// PATCH /api/pages/[pageId] - Update page
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const { pageId } = await params
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const page = await getPageById(pageId)
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 },
      )
    }

    // TODO: Verify user ownership
    if (page.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const validated = UpdatePageSchema.parse(body)

    const updated = await updatePage(pageId, validated)

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

    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 },
    )
  }
}

// DELETE /api/pages/[pageId] - Archive page
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const { pageId } = await params
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const page = await getPageById(pageId)
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 },
      )
    }

    // TODO: Verify user ownership
    if (page.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    await deletePage(pageId)

    return NextResponse.json({
      success: true,
      message: 'Page archived successfully',
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 },
    )
  }
}
