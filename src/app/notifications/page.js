'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  BellOff,
  MessageCircle,
  Heart,
  UserPlus,
  Users,
  CheckCheck
} from 'lucide-react'
import Loading from '@/components/ui/loading'
import { formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'

function NotificationsContent({ user }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState('all') // all, unread

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '50',
        ...(filter === 'unread' && { unread: 'true' })
      })

      const response = await fetch(`/api/notifications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, fetchNotifications])

  const markAsRead = async (notificationIds = null) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          markAsRead: true
        }),
      })

      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'COMMENT':
        return MessageCircle
      case 'VOTE':
        return Heart
      case 'FOLLOW':
        return UserPlus
      case 'SPACE_JOIN':
        return Users
      default:
        return Bell
    }
  }

  const getNotificationMessage = (notification) => {
    const actorName = notification.actor?.displayName || notification.actor?.username || 'Someone'

    switch (notification.type) {
      case 'COMMENT':
        return `${actorName} commented on your post`
      case 'VOTE':
        return `${actorName} ${notification.data?.voteType?.toLowerCase() || 'voted on'} your post`
      case 'FOLLOW':
        return `${actorName} started following you`
      case 'SPACE_JOIN':
        return `${actorName} joined your space "${notification.space?.name}"`
      default:
        return notification.message || 'New notification'
    }
  }

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'COMMENT':
      case 'VOTE':
        return notification.post?.space ? `/s/${notification.post.space.slug}` : '#'
      case 'FOLLOW':
        return notification.actor ? `/u/${notification.actor.username}` : '#'
      case 'SPACE_JOIN':
        return notification.space ? `/s/${notification.space.slug}` : '#'
      default:
        return '#'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to view notifications.
              </p>
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead()}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 p-1 bg-muted rounded-lg">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'unread'
                      ? 'You\'re all caught up!'
                      : 'When you get notifications, they\'ll appear here'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const link = getNotificationLink(notification)

                return (
                  <Card
                    key={notification.id}
                    className={`transition-colors ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                  >
                    <CardContent className="p-4">
                      <Link href={link} className="block">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.actor?.avatar} />
                            <AvatarFallback>
                              {notification.actor?.displayName?.[0] ||
                                notification.actor?.username?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm">
                                  {getNotificationMessage(notification)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 ml-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                {!notification.isRead && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <NotificationsContent user={user} />}
    </AuthWrapper>
  )
}
