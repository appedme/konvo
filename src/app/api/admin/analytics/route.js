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
    const timeRange = searchParams.get('range') || '7d'
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get analytics data
    const [
      totalUsers,
      totalSpaces,
      totalPosts,
      totalComments,
      newUsers,
      newSpaces,
      newPosts,
      newComments,
      activeUsers,
      verifiedUsers,
      bannedUsers,
      pendingReports,
      pendingVerifications,
      userGrowth,
      postActivity,
      topSpaces,
      topUsers
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.space.count({ where: { isActive: true } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.comment.count(),
      
      // New in time range
      prisma.user.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.space.count({
        where: { 
          createdAt: { gte: startDate },
          isActive: true
        }
      }),
      prisma.post.count({
        where: { 
          createdAt: { gte: startDate },
          status: 'PUBLISHED'
        }
      }),
      prisma.comment.count({
        where: { createdAt: { gte: startDate } }
      }),
      
      // Active users (users who posted, commented, or voted in the time range)
      prisma.user.count({
        where: {
          OR: [
            { posts: { some: { createdAt: { gte: startDate } } } },
            { comments: { some: { createdAt: { gte: startDate } } } },
            { votes: { some: { createdAt: { gte: startDate } } } }
          ]
        }
      }),
      
      // Status counts
      prisma.user.count({ where: { verified: true } }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      
      // User growth over time (daily for last 30 days)
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      
      // Post activity over time
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM posts 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'PUBLISHED'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      
      // Top spaces by activity
      prisma.space.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              posts: {
                where: { createdAt: { gte: startDate } }
              },
              members: true
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      }),
      
      // Top users by activity
      prisma.user.findMany({
        where: { isBanned: false },
        include: {
          _count: {
            select: {
              posts: {
                where: { createdAt: { gte: startDate } }
              },
              comments: {
                where: { createdAt: { gte: startDate } }
              }
            }
          }
        },
        orderBy: {
          totalUpvotes: 'desc'
        },
        take: 10
      })
    ])

    // Calculate growth percentages
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (now.getTime() - startDate.getTime()))

    const [prevUsers, prevSpaces, prevPosts, prevComments] = await Promise.all([
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      }),
      prisma.space.count({
        where: { 
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          },
          isActive: true
        }
      }),
      prisma.post.count({
        where: { 
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          },
          status: 'PUBLISHED'
        }
      }),
      prisma.comment.count({
        where: { 
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      })
    ])

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        totalSpaces,
        totalPosts,
        totalComments,
        activeUsers,
        verifiedUsers,
        bannedUsers,
        pendingReports,
        pendingVerifications
      },
      growth: {
        users: {
          current: newUsers,
          previous: prevUsers,
          percentage: calculateGrowth(newUsers, prevUsers)
        },
        spaces: {
          current: newSpaces,
          previous: prevSpaces,
          percentage: calculateGrowth(newSpaces, prevSpaces)
        },
        posts: {
          current: newPosts,
          previous: prevPosts,
          percentage: calculateGrowth(newPosts, prevPosts)
        },
        comments: {
          current: newComments,
          previous: prevComments,
          percentage: calculateGrowth(newComments, prevComments)
        }
      },
      charts: {
        userGrowth: userGrowth.map(row => ({
          date: row.date,
          count: Number(row.count)
        })),
        postActivity: postActivity.map(row => ({
          date: row.date,
          count: Number(row.count)
        }))
      },
      leaderboards: {
        topSpaces: topSpaces.map(space => ({
          id: space.id,
          name: space.name,
          slug: space.slug,
          avatar: space.avatar,
          memberCount: space._count.members,
          recentPosts: space._count.posts,
          verified: space.verified
        })),
        topUsers: topUsers.map(user => ({
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          totalUpvotes: user.totalUpvotes,
          recentPosts: user._count.posts,
          recentComments: user._count.comments,
          verified: user.verified
        }))
      }
    })

  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
