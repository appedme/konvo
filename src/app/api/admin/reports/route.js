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
      where.reason = type
    }

    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reportedBy: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          },
          reportedUser: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              verified: true
            }
          },
          reportedSpace: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true
            }
          },
          reportedPost: {
            select: {
              id: true,
              title: true,
              content: true,
              author: {
                select: {
                  username: true,
                  displayName: true
                }
              }
            }
          },
          reportedComment: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  username: true,
                  displayName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.report.count({ where })
    ])

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Admin reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, reportId, reason } = await request.json()

    const report = await prisma.report.findUnique({
      where: { id: reportId }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    let status, moderationAction
    
    switch (action) {
      case 'resolve':
        status = 'RESOLVED'
        moderationAction = 'RESOLVE'
        break
      case 'dismiss':
        status = 'DISMISSED'
        moderationAction = 'DISMISS'
        break
      case 'delete_content':
        status = 'RESOLVED'
        moderationAction = 'DELETE'
        break
      case 'ban_user':
        status = 'RESOLVED'
        moderationAction = 'BAN'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const transactions = [
      prisma.report.update({
        where: { id: reportId },
        data: {
          status,
          adminNotes: reason,
          resolvedAt: new Date(),
          resolvedBy: user.id
        }
      })
    ]

    // Handle content deletion
    if (action === 'delete_content') {
      if (report.reportedPostId) {
        transactions.push(
          prisma.post.update({
            where: { id: report.reportedPostId },
            data: { status: 'REJECTED' }
          })
        )
      } else if (report.reportedCommentId) {
        transactions.push(
          prisma.comment.delete({
            where: { id: report.reportedCommentId }
          })
        )
      }
    }

    // Handle user banning
    if (action === 'ban_user' && report.reportedUserId) {
      transactions.push(
        prisma.user.update({
          where: { id: report.reportedUserId },
          data: {
            isBanned: true,
            bannedReason: reason,
            bannedAt: new Date(),
            bannedBy: user.id
          }
        })
      )
    }

    // Create moderation action record
    transactions.push(
      prisma.moderationAction.create({
        data: {
          type: moderationAction,
          reason,
          moderatorId: user.id,
          targetUserId: report.reportedUserId,
          targetSpaceId: report.reportedSpaceId,
          targetPostId: report.reportedPostId,
          targetCommentId: report.reportedCommentId
        }
      })
    )

    // Log the activity
    transactions.push(
      prisma.activityLog.create({
        data: {
          action: `REPORT_${action.toUpperCase()}`,
          entityType: 'report',
          entityId: reportId,
          details: { reason, action },
          userId: user.id
        }
      })
    )

    await prisma.$transaction(transactions)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin report action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
