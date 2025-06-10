import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'
import { createNotification, getPostAuthor } from '@/lib/notifications'

export async function POST(request, { params }) {
  try {
    const user = await stackServerApp.getUser({ request })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()
    const { id: postId } = await params

    if (!['UPVOTE', 'DOWNVOTE'].includes(type)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 })
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

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId: postId
        }
      }
    })

    let userVote = null
    let upvoteDiff = 0
    let downvoteDiff = 0

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if clicking the same vote
        await prisma.vote.delete({
          where: { id: existingVote.id }
        })

        if (type === 'UPVOTE') {
          upvoteDiff = -1
        } else {
          downvoteDiff = -1
        }
      } else {
        // Change vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type }
        })

        userVote = type
        if (type === 'UPVOTE') {
          upvoteDiff = 1
          downvoteDiff = -1
        } else {
          upvoteDiff = -1
          downvoteDiff = 1
        }
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          type,
          userId: dbUser.id,
          postId: postId
        }
      })

      userVote = type
      if (type === 'UPVOTE') {
        upvoteDiff = 1
      } else {
        downvoteDiff = 1
      }
    }

    // Update post vote counts
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        upvotes: { increment: upvoteDiff },
        downvotes: { increment: downvoteDiff },
        score: { increment: (type === 'UPVOTE' ? upvoteDiff : -downvoteDiff) }
      }
    })

    // Create notification for upvotes (only for new upvotes, not downgrades)
    if (type === 'UPVOTE' && upvoteDiff > 0) {
      const postAuthorId = await getPostAuthor(postId)
      if (postAuthorId && postAuthorId !== dbUser.id) {
        await createNotification({
          userId: postAuthorId,
          actorId: dbUser.id,
          type: 'VOTE',
          postId,
          data: { voteType: 'UPVOTE' }
        })
      }
    }

    return NextResponse.json({
      upvotes: updatedPost.upvotes,
      downvotes: updatedPost.downvotes,
      userVote
    })
  } catch (error) {
    console.error('Error voting on post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    const user = await stackServerApp.getUser({ request })
    if (!user) {
      return NextResponse.json({ vote: null })
    }

    const { id: postId } = await params

    // Get user from our database
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ vote: null })
    }

    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId: postId
        }
      }
    })

    return NextResponse.json({ vote: vote?.type || null })
  } catch (error) {
    console.error('Error fetching user vote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
