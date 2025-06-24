import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/stack'

export async function GET(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    
    const skip = (page - 1) * limit

    // Build where clause
    let where = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      switch (status) {
        case 'verified':
          where.verified = true
          break
        case 'featured':
          where.featured = true
          break
        case 'banned':
          where.isBanned = true
          break
        case 'private':
          where.type = 'PRIVATE'
          break
      }
    }

    const [spaces, totalCount] = await Promise.all([
      prisma.space.findMany({
        where,
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
          _count: {
            select: {
              members: true,
              posts: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.space.count({ where })
    ])

    return NextResponse.json({
      spaces,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Admin spaces API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, spaceId, reason } = await request.json()

    const targetSpace = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { owner: true }
    })

    if (!targetSpace) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    let updateData = {}
    let moderationAction = {
      type: action.toUpperCase(),
      reason,
      moderatorId: user.id
    }

    switch (action) {
      case 'verify':
        updateData.verified = true
        break
      case 'unverify':
        updateData.verified = false
        break
      case 'feature':
        updateData.featured = true
        break
      case 'unfeature':
        updateData.featured = false
        break
      case 'ban':
        updateData.isBanned = true
        updateData.bannedReason = reason
        updateData.bannedAt = new Date()
        updateData.bannedBy = user.id
        break
      case 'unban':
        updateData.isBanned = false
        updateData.bannedReason = null
        updateData.bannedAt = null
        updateData.bannedBy = null
        break
      case 'delete':
        // Soft delete by setting isActive to false
        updateData.isActive = false
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Execute updates in transaction
    await prisma.$transaction([
      prisma.space.update({
        where: { id: spaceId },
        data: updateData
      }),
      prisma.moderationAction.create({
        data: {
          ...moderationAction,
          targetSpaceId: spaceId
        }
      }),
      prisma.activityLog.create({
        data: {
          action: `SPACE_${action.toUpperCase()}`,
          entityType: 'space',
          entityId: spaceId,
          details: { reason },
          userId: user.id
        }
      })
    ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin space action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
