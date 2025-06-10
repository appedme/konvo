import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const user = await stackServerApp.getUser({ request })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, type = 'TEXT', spaceId, title, isAnonymous = false } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { stackId: user.id }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          stackId: user.id,
          email: user.primaryEmail,
          username: user.primaryEmail.split('@')[0],
          displayName: user.displayName,
          avatar: user.profileImageUrl,
        }
      })
    }

    // If posting to a space, check if user is a member
    if (spaceId) {
      const membership = await prisma.spaceMember.findUnique({
        where: {
          userId_spaceId: {
            userId: dbUser.id,
            spaceId: spaceId
          }
        },
        include: {
          space: true
        }
      })

      if (!membership) {
        return NextResponse.json({ error: 'Not a member of this space' }, { status: 403 })
      }

      // For private spaces, posts start as pending
      const status = membership.space.type === 'PRIVATE' ? 'PENDING' : 'PUBLISHED'

      const post = await prisma.post.create({
        data: {
          title,
          content,
          type,
          status,
          isAnonymous,
          authorId: isAnonymous ? null : dbUser.id,
          spaceId,
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
        }
      })

      // Update space post count if published
      if (status === 'PUBLISHED') {
        await prisma.space.update({
          where: { id: spaceId },
          data: { postCount: { increment: 1 } }
        })
      }

      return NextResponse.json(post)
    } else {
      // Profile post
      const post = await prisma.post.create({
        data: {
          title,
          content,
          type,
          status: 'PUBLISHED',
          isAnonymous,
          authorId: isAnonymous ? null : dbUser.id,
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
          _count: {
            select: {
              comments: true,
            }
          }
        }
      })

      return NextResponse.json(post)
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const spaceId = searchParams.get('spaceId')
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'feed', 'popular', 'recent'

    const skip = (page - 1) * limit

    let where = {
      status: 'PUBLISHED'
    }

    if (spaceId) {
      where.spaceId = spaceId
    }

    if (userId) {
      where.authorId = userId
    }

    let orderBy = { createdAt: 'desc' }

    if (type === 'popular') {
      orderBy = { score: 'desc' }
    }

    const posts = await prisma.post.findMany({
      where,
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
      orderBy,
      skip,
      take: limit,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
