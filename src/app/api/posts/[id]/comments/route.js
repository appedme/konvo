import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const { id: postId } = await params
        
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
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({ comments })
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request, { params }) {
    try {
        const user = await stackServerApp.getUser({ request })
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: postId } = await params
        const { content } = await request.json()

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

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                authorId: dbUser.id,
                postId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatar: true,
                    }
                }
            }
        })

        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error('Error creating comment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
