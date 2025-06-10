import { prisma } from './prisma'

export async function createNotification({
  userId,
  actorId,
  type,
  postId = null,
  commentId = null,
  spaceId = null,
  message = null,
  data = {}
}) {
  try {
    // Don't create notification if user is notifying themselves
    if (userId === actorId) {
      return null
    }

    // Check if similar notification already exists (to avoid spam)
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        actorId,
        type,
        postId,
        commentId,
        spaceId,
        createdAt: {
          gte: new Date(Date.now() - 60000) // Within last minute
        }
      }
    })

    if (existingNotification) {
      return existingNotification
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        postId,
        commentId,
        spaceId,
        message,
        data,
        isRead: false
      }
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function getPostAuthor(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })
    return post?.authorId
  } catch (error) {
    console.error('Error getting post author:', error)
    return null
  }
}

export async function getCommentAuthor(commentId) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    })
    return comment?.authorId
  } catch (error) {
    console.error('Error getting comment author:', error)
    return null
  }
}
