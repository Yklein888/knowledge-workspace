import { NextRequest, NextResponse } from 'next/server'
import { CreatePageSchema } from '@/types/api'
import { getPagesByUser, createPage } from '@/lib/db-utils'

// GET /api/pages - List user's pages
export async function GET(req: NextRequest) {
  try {
    // TODO: Get user ID from auth session
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userPages = await getPagesByUser(userId)

    return NextResponse.json({
      success: true,
      data: userPages,
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 },
    )
  }
}

// POST /api/pages - Create new page
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await req.json()
    const validated = CreatePageSchema.parse(body)

    // Generate slug if not provided
    const slug = validated.slug || validated.title.toLowerCase().replace(/\s+/g, '-')

    const page = await createPage({
      userId,
      title: validated.title,
      slug,
      icon: validated.icon,
      cover: validated.cover,
      parentId: validated.parentId,
    })

    return NextResponse.json(
      { success: true, data: page },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Error creating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 },
    )
  }
}
