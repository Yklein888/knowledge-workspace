import { NextRequest, NextResponse } from 'next/server'
import { UpdateDocumentSchema } from '@/types/api'
import { getDb, documents as documentsTable, eq } from '@/db'
import { getPageById, updateDocument, deleteDocument } from '@/lib/db-utils'

// GET /api/pages/[pageId]/documents/[documentId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string; documentId: string }> },
) {
  try {
    const { pageId, documentId } = await params
    const db = getDb()

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .limit(1)

    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 },
      )
    }

    if (doc.pageId !== pageId) {
      return NextResponse.json(
        { success: false, error: 'Invalid page' },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data: doc,
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 },
    )
  }
}

// PATCH /api/pages/[pageId]/documents/[documentId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string; documentId: string }> },
) {
  try {
    const { pageId, documentId } = await params
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

    if (page.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const validated = UpdateDocumentSchema.parse(body)

    const updated = await updateDocument(documentId, validated)

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

    console.error('Error updating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 },
    )
  }
}

// DELETE /api/pages/[pageId]/documents/[documentId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string; documentId: string }> },
) {
  try {
    const { pageId, documentId } = await params
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

    if (page.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    await deleteDocument(documentId)

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 },
    )
  }
}
