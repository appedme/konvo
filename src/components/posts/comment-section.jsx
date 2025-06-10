'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, ArrowUp, ArrowDown, Reply } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'

export function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyTo?.id || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [data.comment, ...prev])
        setNewComment('')
        setReplyTo(null)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = (comment) => {
    setReplyTo(comment)
    setNewComment(`@${comment.author.username} `)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-4 w-4" />
        <span className="font-medium">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Comment Form */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmitComment}>
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback>
                    {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  {replyTo && (
                    <div className="text-sm text-muted-foreground">
                      Replying to @{replyTo.author.username}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyTo(null)}
                        className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      size="sm"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CommentItem({ comment, user, onReply }) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="flex space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>
          {comment.author.displayName?.[0] || comment.author.username?.[0] || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">
            {comment.author.displayName || comment.author.username}
          </span>
          <span className="text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <div className="text-sm whitespace-pre-wrap">{comment.content}</div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-4 w-4 mr-1" />
            <span className="text-xs">0</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowDown className="h-4 w-4 mr-1" />
            <span className="text-xs">0</span>
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <Reply className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          )}

          {comment._count.replies > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs">
                {showReplies ? 'Hide' : 'Show'} {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
