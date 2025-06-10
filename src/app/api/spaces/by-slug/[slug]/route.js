import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
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

    // For now, return space data without auth-dependent fields
    // The client will handle membership checks using working auth context
    return NextResponse.json({
      space: {
        ...space,
        memberCount: space._count.members,
        postCount: space._count.posts
      },
      isMember: false, // Temporarily disable server-side auth check
      isOwner: false   // Client will determine this
    })

  } catch (error) {
    console.error('Error fetching space:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}