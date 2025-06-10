import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const postId = params.id
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const comments = await prisma.comment.findMany({
            where: { postId },
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
                        replies: true,
                        votes: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })

        const total = await prisma.comment.count({
            where: { postId }
        })

        return NextResponse.json({
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
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

        const postId = params.id
        const body = await request.json()
        const { content, parentId } = body

        if (!content?.trim()) {
            return NextResponse.json(
                { error: 'Comment content is required' },
                { status: 400 }
            )
        }

        // Verify post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
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

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId,
                authorId: dbUser.id,
                parentId: parentId || null,
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
                        replies: true,
                        votes: true,
                    }
                }
            }
        })

        return NextResponse.json({ comment }, { status: 201 })
    } catch (error) {
        console.error('Error creating comment:', error)
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        )
    }
}
