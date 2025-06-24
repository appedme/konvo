'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/stack'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createPostSchema = z.object({
    title: z.string().optional(),
    content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
    spaceId: z.string().optional(),
    isAnonymous: z.boolean().default(false),
})

const voteSchema = z.object({
    postId: z.string(),
    type: z.enum(['UPVOTE', 'DOWNVOTE']),
})

const commentSchema = z.object({
    postId: z.string(),
    content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
    parentId: z.string().optional(),
})

// Helper function to get authenticated user
async function getAuthenticatedUser() {
    const user = await auth.getUser()
    if (!user) {
        throw new Error('Authentication required')
    }
    return user
}

// Create a new post
export async function createPost(formData) {
    try {
        const user = await getAuthenticatedUser()

        const validatedData = createPostSchema.parse({
            title: formData.get('title') || undefined,
            content: formData.get('content'),
            spaceId: formData.get('spaceId') || undefined,
            isAnonymous: formData.get('isAnonymous') === 'true',
        })

        // Verify space membership if posting to a space
        if (validatedData.spaceId) {
            const membership = await prisma.spaceMembership.findFirst({
                where: {
                    spaceId: validatedData.spaceId,
                    userId: user.id,
                },
            })

            if (!membership) {
                throw new Error('You must be a member of this space to post')
            }
        }

        const post = await prisma.post.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                authorId: user.id,
                spaceId: validatedData.spaceId,
                isAnonymous: validatedData.isAnonymous,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        profileImageUrl: true,
                    },
                },
                space: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        votes: true,
                    },
                },
            },
        })

        revalidatePath('/')
        revalidatePath('/s/[slug]', 'page')

        return { success: true, post }
    } catch (error) {
        console.error('Error creating post:', error)
        return { success: false, error: error.message }
    }
}

// Vote on a post
export async function voteOnPost(postId, voteType) {
    try {
        const user = await getAuthenticatedUser()

        const validatedData = voteSchema.parse({ postId, type: voteType })

        // Check if user already voted
        const existingVote = await prisma.vote.findFirst({
            where: {
                postId: validatedData.postId,
                userId: user.id,
            },
        })

        let vote
        if (existingVote) {
            if (existingVote.type === validatedData.type) {
                // Remove vote if clicking same button
                await prisma.vote.delete({
                    where: { id: existingVote.id },
                })
                vote = null
            } else {
                // Update vote type
                vote = await prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { type: validatedData.type },
                })
            }
        } else {
            // Create new vote
            vote = await prisma.vote.create({
                data: {
                    type: validatedData.type,
                    postId: validatedData.postId,
                    userId: user.id,
                },
            })
        }

        // Get updated vote counts
        const [upvotes, downvotes] = await Promise.all([
            prisma.vote.count({
                where: { postId: validatedData.postId, type: 'UPVOTE' },
            }),
            prisma.vote.count({
                where: { postId: validatedData.postId, type: 'DOWNVOTE' },
            }),
        ])

        revalidatePath('/')
        revalidatePath('/s/[slug]', 'page')

        return {
            success: true,
            vote: vote?.type || null,
            upvotes,
            downvotes
        }
    } catch (error) {
        console.error('Error voting on post:', error)
        return { success: false, error: error.message }
    }
}

// Add a comment
export async function addComment(postId, content, parentId = null) {
    try {
        const user = await getAuthenticatedUser()

        const validatedData = commentSchema.parse({ postId, content, parentId })

        const comment = await prisma.comment.create({
            data: {
                content: validatedData.content,
                postId: validatedData.postId,
                authorId: user.id,
                parentId: validatedData.parentId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        profileImageUrl: true,
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
        })

        revalidatePath('/')
        revalidatePath('/s/[slug]', 'page')

        return { success: true, comment }
    } catch (error) {
        console.error('Error adding comment:', error)
        return { success: false, error: error.message }
    }
}

// Get posts with pagination and filtering
export async function getPosts(options = {}) {
    try {
        const {
            spaceId,
            userId,
            sortBy = 'recent',
            limit = 20,
            cursor
        } = options

        let orderBy
        switch (sortBy) {
            case 'popular':
                orderBy = [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }]
                break
            case 'recent':
            default:
                orderBy = { createdAt: 'desc' }
                break
        }

        const where = {}
        if (spaceId) where.spaceId = spaceId
        if (userId) where.authorId = userId

        const posts = await prisma.post.findMany({
            where,
            orderBy,
            take: limit,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        profileImageUrl: true,
                    },
                },
                space: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        votes: true,
                    },
                },
                votes: {
                    select: {
                        type: true,
                    },
                },
            },
        })

        // Calculate vote scores
        const postsWithScores = posts.map(post => ({
            ...post,
            upvotes: post.votes.filter(v => v.type === 'UPVOTE').length,
            downvotes: post.votes.filter(v => v.type === 'DOWNVOTE').length,
            votes: undefined, // Remove votes array for cleaner response
        }))

        return { success: true, posts: postsWithScores }
    } catch (error) {
        console.error('Error fetching posts:', error)
        return { success: false, error: error.message }
    }
}
