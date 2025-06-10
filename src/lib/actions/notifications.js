'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const notificationSchema = z.object({
  userId: z.string(),
  limit: z.number().min(1).max(50).default(20),
  unreadOnly: z.boolean().default(false)
})

export async function getNotifications(formData) {
  try {
    const { userId, limit, unreadOnly } = notificationSchema.parse({
      userId: formData.get('userId'),
      limit: parseInt(formData.get('limit') || '20'),
      unreadOnly: formData.get('unreadOnly') === 'true'
    })

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false })
      },
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
    })

    const unreadCount = unreadOnly ? notifications.length : await prisma.notification.count({
      where: {
        userId,
        read: false
      }
    })

    return {
      success: true,
      data: {
        notifications,
        unreadCount
      }
    }
  } catch (error) {
    console.error('Get notifications error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch notifications'
    }
  }
}

export async function markNotificationAsRead(formData) {
  try {
    const notificationId = formData.get('notificationId')
    
    if (!notificationId) {
      throw new Error('Notification ID is required')
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })

    return {
      success: true,
      data: { message: 'Notification marked as read' }
    }
  } catch (error) {
    console.error('Mark notification read error:', error)
    return {
      success: false,
      error: error.message || 'Failed to mark notification as read'
    }
  }
}

export async function markAllNotificationsAsRead(formData) {
  try {
    const userId = formData.get('userId')
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    await prisma.notification.updateMany({
      where: { 
        userId,
        read: false 
      },
      data: { read: true }
    })

    return {
      success: true,
      data: { message: 'All notifications marked as read' }
    }
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return {
      success: false,
      error: error.message || 'Failed to mark all notifications as read'
    }
  }
}
