import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/stack'

export async function GET(request) {
  try {
    const user = await getUser(request)
    
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get current date for time-based calculations
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get dashboard overview stats
    const [
      totalUsers,
      activeUsers,
      totalSpaces,
      verifiedSpaces,
      totalPosts,
      totalComments,
      pendingReports,
      pendingVerifications,
      bannedUsers,
      recentUsers,
      recentSpaces,
      topPosts,
      systemStats
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      prisma.user.count({ where: { lastActiveAt: { gte: sevenDaysAgo } } }),
      
      // Space stats
      prisma.space.count({ where: { isActive: true } }),
      prisma.space.count({ where: { verified: true, isActive: true } }),
      
      // Content stats
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.comment.count(),
      
      // Moderation stats
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { isBanned: true } }),
      
      // Recent activity
      prisma.user.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { id: true, username: true, displayName: true, avatar: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      prisma.space.findMany({
        where: { createdAt: { gte: sevenDaysAgo }, isActive: true },
        select: { id: true, name: true, slug: true, avatar: true, memberCount: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Top performing content
      prisma.post.findMany({
        where: { 
          createdAt: { gte: sevenDaysAgo },
          status: 'PUBLISHED'
        },
        select: { 
          id: true, 
          title: true, 
          upvotes: true, 
          downvotes: true, 
          score: true,
          author: { select: { username: true, displayName: true } },
          space: { select: { name: true, slug: true } }
        },
        orderBy: { score: 'desc' },
        take: 5
      }),
      
      // System health metrics
      Promise.resolve({
        dbConnected: true,
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000), // Mock last backup
        uptime: '99.9%',
        responseTime: '45ms'
      })
    ])

    // Calculate growth percentages
    const [
      newUsersLast30,
      newUsersLast60,
      newPostsLast30,
      newPostsLast60
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.post.count({
        where: { 
          createdAt: { gte: thirtyDaysAgo },
          status: 'PUBLISHED'
        }
      }),
      prisma.post.count({
        where: { 
          createdAt: { 
            gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
            lt: thirtyDaysAgo
          },
          status: 'PUBLISHED'
        }
      })
    ])

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const userGrowth = calculateGrowth(newUsersLast30, newUsersLast60)
    const postGrowth = calculateGrowth(newPostsLast30, newPostsLast60)

    // Pending actions that need admin attention
    const pendingActions = []
    
    if (pendingReports > 0) {
      pendingActions.push({
        type: 'reports',
        count: pendingReports,
        message: `${pendingReports} report${pendingReports > 1 ? 's' : ''} pending review`,
        priority: pendingReports > 10 ? 'high' : 'medium',
        href: '/admin/moderation'
      })
    }
    
    if (pendingVerifications > 0) {
      pendingActions.push({
        type: 'verifications',
        count: pendingVerifications,
        message: `${pendingVerifications} verification request${pendingVerifications > 1 ? 's' : ''} pending`,
        priority: 'medium',
        href: '/admin/verification'
      })
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalSpaces,
        verifiedSpaces,
        totalPosts,
        totalComments,
        pendingReports,
        pendingVerifications,
        bannedUsers,
        userGrowth: Math.round(userGrowth * 100) / 100,
        postGrowth: Math.round(postGrowth * 100) / 100
      },
      recentActivity: {
        users: recentUsers,
        spaces: recentSpaces,
        topPosts
      },
      pendingActions,
      systemHealth: systemStats
    })

  } catch (error) {
    console.error('Admin dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' }, 
      { status: 500 }
    )
  }
}