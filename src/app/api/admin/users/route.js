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
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      switch (status) {
        case 'verified':
          where.verified = true
          break
        case 'banned':
          where.isBanned = true
          break
        case 'admin':
          where.role = { in: ['ADMIN', 'SUPER_ADMIN'] }
          break
      }
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              posts: true,
              comments: true,
              followers: true,
              following: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, userId, reason, duration } = await request.json()

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent actions on super admins (unless done by another super admin)
    if (targetUser.role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot perform actions on super admins' }, { status: 403 })
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
      case 'ban':
        updateData.isBanned = true
        updateData.bannedReason = reason
        updateData.bannedAt = new Date()
        updateData.bannedBy = user.id
        if (duration) {
          moderationAction.duration = duration
          moderationAction.expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000)
        }
        break
      case 'unban':
        updateData.isBanned = false
        updateData.bannedReason = null
        updateData.bannedAt = null
        updateData.bannedBy = null
        break
      case 'promote':
        updateData.role = 'ADMIN'
        break
      case 'demote':
        updateData.role = 'USER'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Execute updates in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: updateData
      }),
      prisma.moderationAction.create({
        data: {
          ...moderationAction,
          targetUserId: userId
        }
      }),
      prisma.activityLog.create({
        data: {
          action: `USER_${action.toUpperCase()}`,
          entityType: 'user',
          entityId: userId,
          details: { reason, duration },
          userId: user.id
        }
      })
    ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin user action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
