'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommentSection } from './comment-section'
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  MoreHorizontal,
  Clock
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'

export function PostCard({ post, user, showSpace = true }) {
  const [votes, setVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    userVote: null
  })
  const [isVoting, setIsVoting] = useState(false)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    // Fetch user's vote for this post
    if (user && post.id) {
      fetchUserVote()
    }
  }, [user, post.id])

  const fetchUserVote = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/vote`)
      if (response.ok) {
        const data = await response.json()
        setVotes(prev => ({ ...prev, userVote: data.vote }))
      }
    } catch (error) {
      console.error('Error fetching user vote:', error)
    }
  }

  const handleVote = async (voteType) => {
    if (!user || isVoting) return

    setIsVoting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: voteType }),
      })

      if (response.ok) {
        const data = await response.json()
        setVotes({
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          userVote: data.userVote
        })
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const score = votes.upvotes - votes.downvotes

  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${votes.userVote === 'UPVOTE' ? 'text-orange-500' : ''}`}
              onClick={() => handleVote('UPVOTE')}
              disabled={isVoting}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className={`text-sm font-medium ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : ''
              }`}>
              {score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${votes.userVote === 'DOWNVOTE' ? 'text-blue-500' : ''}`}
              onClick={() => handleVote('DOWNVOTE')}
              disabled={isVoting}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {showSpace && post.space && (
                <>
                  <Link
                    href={`/s/${post.space.slug}`}
                    className="font-medium hover:underline"
                  >
                    s/{post.space.name}
                  </Link>
                  <span>•</span>
                </>
              )}
              <div className="flex items-center space-x-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="text-xs">
                    {post.isAnonymous ? 'A' : (post.author?.displayName?.[0] || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {post.isAnonymous ? 'Anonymous' : (post.author?.displayName || 'Unknown')}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>

            {post.title && (
              <h3 className="text-lg font-semibold leading-tight">
                {post.title}
              </h3>
            )}

            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 space-x-1"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post._count?.comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 ml-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t">
            <CommentSection postId={post.id} user={user} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
