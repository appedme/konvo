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
    const status = searchParams.get('status') || 'pending'
    const type = searchParams.get('type') || 'all'
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    
    const skip = (page - 1) * limit

    // Build where clause
    let where = {}
    
    if (status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (type !== 'all') {
      where.type = type
    }

    const [requests, totalCount] = await Promise.all([
      prisma.verificationRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              verified: true,
              role: true
            }
          },
          space: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              verified: true,
              memberCount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.verificationRequest.count({ where })
    ])

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Admin verification API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, requestId, reason } = await request.json()

    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { user: true, space: true }
    })

    if (!verificationRequest) {
      return NextResponse.json({ error: 'Verification request not found' }, { status: 404 })
    }

    const isApproved = action === 'approve'
    const status = isApproved ? 'APPROVED' : 'REJECTED'

    // Execute updates in transaction
    const transactions = [
      prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
          status,
          adminNotes: reason,
          reviewedAt: new Date(),
          reviewedBy: user.id
        }
      })
    ]

    // If approved, update the target entity
    if (isApproved) {
      if (verificationRequest.type === 'user' && verificationRequest.userId) {
        transactions.push(
          prisma.user.update({
            where: { id: verificationRequest.userId },
            data: { verified: true }
          })
        )
      } else if (verificationRequest.type === 'space' && verificationRequest.spaceId) {
        transactions.push(
          prisma.space.update({
            where: { id: verificationRequest.spaceId },
            data: { verified: true }
          })
        )
      }
    }

    // Log the activity
    transactions.push(
      prisma.activityLog.create({
        data: {
          action: `VERIFICATION_${action.toUpperCase()}`,
          entityType: verificationRequest.type,
          entityId: verificationRequest.userId || verificationRequest.spaceId,
          details: { reason, requestId },
          userId: user.id
        }
      })
    )

    await prisma.$transaction(transactions)

    // TODO: Send notification to the requester
    // You would implement this based on your notification system

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin verification action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
