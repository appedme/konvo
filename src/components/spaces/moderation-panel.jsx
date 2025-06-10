'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'

export function ModerationPanel({ spaceId, user, isAdmin }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [moderationAction, setModerationAction] = useState(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isAdmin) {
      fetchPosts()
    }
  }, [spaceId, activeTab, isAdmin])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const status = activeTab.toUpperCase()
      const response = await fetch(`/api/spaces/${spaceId}/moderate?status=${status}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts for moderation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async (postId, action) => {
    try {
      const response = await fetch(`/api/spaces/${spaceId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action,
          reason: reason.trim() || undefined
        }),
      })

      if (response.ok) {
        // Remove the post from the current list
        setPosts(prev => prev.filter(p => p.id !== postId))
        setModerationAction(null)
        setReason('')
      }
    } catch (error) {
      console.error('Error moderating post:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  const tabs = [
    { id: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
    { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-500' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Moderation Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={`h-4 w-4 mr-2 ${tab.color}`} />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>No {activeTab} posts</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author?.avatar} />
                        <AvatarFallback>
                          {post.author?.displayName?.[0] || post.author?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">
                            {post.author?.displayName || post.author?.username}
                          </span>
                          <span className="text-muted-foreground">
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none mt-2">
                          <p className="whitespace-pre-wrap">{post.content}</p>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'pending' && (
                      <div className="flex flex-col space-y-2 pt-2 border-t">
                        {moderationAction === post.id ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Reason for action (optional)..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleModeration(post.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModeration(post.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setModerationAction(null)
                                  setReason('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModerationAction(post.id)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Moderate
                          </Button>
                        )}
                      </div>
                    )}

                    {post.moderationReason && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Reason:</strong> {post.moderationReason}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
