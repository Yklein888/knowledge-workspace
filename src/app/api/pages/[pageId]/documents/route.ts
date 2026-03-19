import { NextRequest, NextResponse } from 'next/server'
import { CreateDocumentSchema } from '@/types/api'
import { getPageById, getDocumentsByPage, createDocument } from '@/lib/db-utils'

// GET /api/pages/[pageId]/documents - List documents in page
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const { pageId } = await params

    // Verify page exists
    const page = await getPageById(pageId)
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 },
      )
    }

    const docs = await getDocumentsByPage(pageId)

    return NextResponse.json({
      success: true,
      data: docs,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 },
    )
  }
}

// POST /api/pages/[pageId]/documents - Create document
export async function POST(
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

    // Verify page exists and user owns it
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
    const validated = CreateDocumentSchema.parse(body)

    const doc = await createDocument({
      pageId,
      title: validated.title,
      content: validated.content || '',
    })

    return NextResponse.json(
      { success: true, data: doc },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 },
    )
  }
}
