'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
    query: z.string().min(1).max(100),
    type: z.enum(['all', 'posts', 'spaces', 'users']).default('all'),
    limit: z.number().min(1).max(50).default(20)
})

export async function searchContent(formData) {
    try {
        const { query, type, limit } = searchSchema.parse({
            query: formData.get('query'),
            type: formData.get('type') || 'all',
            limit: parseInt(formData.get('limit') || '20')
        })

        const searchTerm = query.trim()
        const results = {}

        // Search Posts
        if (type === 'all' || type === 'posts') {
            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        { content: { contains: searchTerm, mode: 'insensitive' } },
                        { title: { contains: searchTerm, mode: 'insensitive' } }
                    ],
                    status: 'PUBLISHED'
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
                take: limit
            })
            results.posts = posts
        }

        // Search Spaces
        if (type === 'all' || type === 'spaces') {
            const spaces = await prisma.space.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
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
                orderBy: { memberCount: 'desc' },
                take: limit
            })
            results.spaces = spaces
        }

        // Search Users
        if (type === 'all' || type === 'users') {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: searchTerm, mode: 'insensitive' } },
                        { displayName: { contains: searchTerm, mode: 'insensitive' } }
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
                orderBy: { createdAt: 'desc' },
                take: limit
            })
            results.users = users
        }

        const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

        return {
            success: true,
            data: {
                query: searchTerm,
                type,
                results,
                pagination: {
                    total: totalResults,
                    limit
                }
            }
        }
    } catch (error) {
        console.error('Search error:', error)
        return {
            success: false,
            error: error.message || 'Search failed'
        }
    }
}

export async function quickSearch(formData) {
    try {
        const query = formData.get('query')
        if (!query?.trim()) {
            return { success: true, data: { results: [] } }
        }

        const searchTerm = query.trim()
        const limit = 5

        // Quick search across all content types
        const [posts, spaces, users] = await Promise.all([
            prisma.post.findMany({
                where: {
                    OR: [
                        { content: { contains: searchTerm, mode: 'insensitive' } },
                        { title: { contains: searchTerm, mode: 'insensitive' } }
                    ],
                    status: 'PUBLISHED'
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
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limit
            }),
            prisma.space.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
                    ],
                    isActive: true,
                    type: 'PUBLIC'
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    memberCount: true,
                },
                orderBy: { memberCount: 'desc' },
                take: limit
            }),
            prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: searchTerm, mode: 'insensitive' } },
                        { displayName: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                    verified: true,
                },
                orderBy: { createdAt: 'desc' },
                take: limit
            })
        ])

        return {
            success: true,
            data: {
                results: {
                    posts: posts.slice(0, 2),
                    spaces: spaces.slice(0, 2),
                    users: users.slice(0, 2)
                }
            }
        }
    } catch (error) {
        console.error('Quick search error:', error)
        return {
            success: false,
            error: error.message || 'Quick search failed'
        }
    }
}
