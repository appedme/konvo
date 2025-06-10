import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const username = params.username
        
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                bio: true,
                verified: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                        spaces: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Get recent posts
        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id,
                isActive: true
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
                space: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
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
            take: 20
        })

        // Get spaces where user is a member
        const spaces = await prisma.spaceMember.findMany({
            where: {
                userId: user.id
            },
            include: {
                space: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        type: true,
                        memberCount: true,
                        _count: {
                            select: {
                                posts: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            },
            take: 10
        })

        return NextResponse.json({
            user,
            posts,
            spaces: spaces.map(sm => sm.space)
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        )
    }
}
