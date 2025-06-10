'use client'

import { useState } from 'react'
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
  Clock,
  Loader2
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { usePostVote } from '@/hooks/use-posts'
import { showSuccess, showError } from '@/lib/toast'
import Link from 'next/link'

export function PostCard({ post, user, showSpace = true }) {
  const [showComments, setShowComments] = useState(false)
  const { userVote, vote, isLoading: isVoting } = usePostVote(post.id)

  // Calculate score from post data
  const score = (post.upvotes || 0) - (post.downvotes || 0)

  const handleVote = async (voteType) => {
    if (!user || isVoting) return

    try {
      await vote(voteType)
      showSuccess(voteType === 'UPVOTE' ? 'Post upvoted!' : 'Post downvoted!')
    } catch (error) {
      showError('Failed to vote. Please try again.')
      console.error('Vote error:', error)
    }
  }

  return (
    <Card className="hover-lift modern-card animate-fade-in transition-all duration-300 hover:shadow-elevated">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-110 ${
                userVote === 'UPVOTE' 
                  ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20' 
                  : 'hover:bg-orange-500/10 hover:text-orange-500'
              }`}
              onClick={() => handleVote('UPVOTE')}
              disabled={isVoting}
            >
              {isVoting && userVote === 'UPVOTE' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </Button>
            <span className={`text-sm font-bold px-2 py-1 rounded-full transition-colors duration-200 ${
              score > 0 
                ? 'text-orange-500 bg-orange-500/10' 
                : score < 0 
                ? 'text-blue-500 bg-blue-500/10' 
                : 'text-muted-foreground bg-muted/50'
            }`}>
              {score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-110 ${
                userVote === 'DOWNVOTE' 
                  ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20' 
                  : 'hover:bg-blue-500/10 hover:text-blue-500'
              }`}
              onClick={() => handleVote('DOWNVOTE')}
              disabled={isVoting}
            >
              {isVoting && userVote === 'DOWNVOTE' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDown className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {showSpace && post.space && (
                <>
                  <Link
                    href={`/s/${post.space.slug}`}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
                  >
                    s/{post.space.name}
                  </Link>
                  <span className="text-muted-foreground/60">•</span>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5 ring-2 ring-background shadow-sm">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {post.isAnonymous ? 'A' : (post.author?.displayName?.[0] || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground/80">
                  {post.isAnonymous ? 'Anonymous' : (post.author?.displayName || 'Unknown')}
                </span>
              </div>
              <span className="text-muted-foreground/60">•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>

            {post.title && (
              <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {post.title}
              </h3>
            )}

            <div className="prose prose-sm max-w-none text-foreground/90">
              <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>

            <div className="flex items-center space-x-6 pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full px-4"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{post._count?.comments || 0}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full px-4"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 ml-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full px-3"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-slide-up">
            <CommentSection postId={post.id} user={user} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
