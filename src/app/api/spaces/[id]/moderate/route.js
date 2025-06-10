import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { id: spaceId } = await params
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'PENDING' // PENDING, APPROVED, REJECTED
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
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

        // Check if user is owner or admin of the space
        const space = await prisma.space.findUnique({
            where: { id: spaceId },
            include: {
                members: {
                    where: {
                        userId: dbUser.id,
                        role: { in: ['OWNER', 'ADMIN'] }
                    }
                }
            }
        })

        if (!space || space.members.length === 0) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            )
        }

        // Get posts requiring moderation
        const posts = await prisma.post.findMany({
            where: {
                spaceId,
                moderationStatus: status
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
                        votes: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })

        const total = await prisma.post.count({
            where: {
                spaceId,
                moderationStatus: status
            }
        })

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
        console.error('Error fetching posts for moderation:', error)
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        )
    }
}

export async function POST(request, { params }) {
    try {
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const spaceId = params.id
        const body = await request.json()
        const { postId, action, reason } = body // action: 'approve' or 'reject'

        if (!postId || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            )
        }

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

        // Check if user is owner or admin of the space
        const space = await prisma.space.findUnique({
            where: { id: spaceId },
            include: {
                members: {
                    where: {
                        userId: dbUser.id,
                        role: { in: ['OWNER', 'ADMIN'] }
                    }
                }
            }
        })

        if (!space || space.members.length === 0) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            )
        }

        // Update post moderation status
        const updatedPost = await prisma.post.update({
            where: {
                id: postId,
                spaceId // Ensure post belongs to this space
            },
            data: {
                moderationStatus: action === 'approve' ? 'APPROVED' : 'REJECTED',
                moderatedBy: dbUser.id,
                moderatedAt: new Date(),
                isActive: action === 'approve',
                ...(reason && { moderationReason: reason })
            }
        })

        // Create notification for post author
        await prisma.notification.create({
            data: {
                userId: updatedPost.authorId,
                actorId: dbUser.id,
                type: 'MODERATION',
                postId: updatedPost.id,
                spaceId,
                message: `Your post was ${action}d in ${space.name}`,
                data: { action, reason }
            }
        })

        return NextResponse.json({
            message: `Post ${action}d successfully`,
            post: updatedPost
        })
    } catch (error) {
        console.error('Error moderating post:', error)
        return NextResponse.json(
            { error: 'Failed to moderate post' },
            { status: 500 }
        )
    }
}
