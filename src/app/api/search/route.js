import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const type = searchParams.get('type') || 'all' // all, posts, spaces, users
        const limit = parseInt(searchParams.get('limit') || '20')

        if (!query?.trim()) {
            return NextResponse.json({
                results: [],
                pagination: { total: 0 }
            })
        }

        const searchTerm = query.trim()
        const results = {}

        // Search Posts
        if (type === 'all' || type === 'posts') {
            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        {
                            content: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ],
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
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit
            })
            results.posts = posts
        }

        // Search Spaces
        if (type === 'all' || type === 'spaces') {
            const spaces = await prisma.space.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ],
                    isActive: true,
                    type: 'PUBLIC' // Only show public spaces in search
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatar: true,
                        }
                    },
                    _count: {
                        select: {
                            members: true,
                            posts: true,
                        }
                    }
                },
                orderBy: {
                    memberCount: 'desc'
                },
                take: limit
            })
            results.spaces = spaces
        }

        // Search Users
        if (type === 'all' || type === 'users') {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        {
                            username: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            displayName: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                    bio: true,
                    verified: true,
                    _count: {
                        select: {
                            posts: true,
                            followers: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit
            })
            results.users = users
        }

        const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

        return NextResponse.json({
            query: searchTerm,
            type,
            results,
            pagination: {
                total: totalResults,
                limit
            }
        })
    } catch (error) {
        console.error('Error searching:', error)
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        )
    }
}
