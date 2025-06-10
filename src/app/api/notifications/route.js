import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    try {
        const user = await stackServerApp.getUser({ request })
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const unreadOnly = searchParams.get('unread') === 'true'
        const skip = (page - 1) * limit

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { stackId: user.id }
        })

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            )
        }

        const whereCondition = {
            userId: dbUser.id,
            ...(unreadOnly && { isRead: false })
        }

        const notifications = await prisma.notification.findMany({
            where: whereCondition,
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatar: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true,
                        space: {
                            select: {
                                name: true,
                                slug: true,
                            }
                        }
                    }
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        post: {
                            select: {
                                id: true,
                                content: true,
                            }
                        }
                    }
                },
                space: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })

        const total = await prisma.notification.count({
            where: whereCondition
        })

        const unreadCount = await prisma.notification.count({
            where: {
                userId: dbUser.id,
                isRead: false
            }
        })

        return NextResponse.json({
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

export async function PATCH(request) {
    try {
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { notificationIds, markAsRead = true } = body

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { stackId: user.id }
        })

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            )
        }

        if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications
            await prisma.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    userId: dbUser.id
                },
                data: {
                    isRead: markAsRead
                }
            })
        } else {
            // Mark all notifications for user
            await prisma.notification.updateMany({
                where: {
                    userId: dbUser.id
                },
                data: {
                    isRead: markAsRead
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating notifications:', error)
        return NextResponse.json(
            { error: 'Failed to update notifications' },
            { status: 500 }
        )
    }
}
