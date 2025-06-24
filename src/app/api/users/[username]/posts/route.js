import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { username } = params

    const posts = await prisma.post.findMany({
      where: {
        author: {
          username
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          }
        },
        space: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching user posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
