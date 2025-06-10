import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { slug } = await params

    const space = await prisma.space.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            verified: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                verified: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    })

    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      space: {
        ...space,
        memberCount: space._count.members,
        postCount: space._count.posts
      }
    })

  } catch (error) {
    console.error('Error fetching space:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}