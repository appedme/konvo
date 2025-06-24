'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { 
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share,
  MoreHorizontal,
  Send,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'

export default function PostPage() {
  const { id } = useParams()
  const router = useRouter()
  const user = useUser()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchComments()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        console.error('Failed to fetch post')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user.user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim()
        })
      })

      if (response.ok) {
        setNewComment('')
        fetchComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (type) => {
    if (!user.user) return

    try {
      const response = await fetch(`/api/posts/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        fetchPost() // Refresh post data
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {post.space && (
            <Link href={`/s/${post.space.slug}`}>
              <Badge variant="secondary" className="hover:bg-gray-200">
                {post.space.name}
              </Badge>
            </Link>
          )}
        </div>

        {/* Post Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('up')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
                <span className="font-medium text-lg">{post.score || 0}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('down')}
                  className="text-gray-600 hover:text-red-600"
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <Link href={`/u/${post.author?.username}`}>
                    <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 -m-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author?.avatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {post.author?.displayName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.author?.displayName || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{post.author?.username || 'anonymous'}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                {post.title && (
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
                )}
                
                <div className="prose max-w-none text-gray-700 mb-6">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{comments.length} comments</span>
                  </span>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment Form */}
        {user.user ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitComment}>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.user?.profileImageUrl} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                      {user.user?.displayName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3"
                      rows={3}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim() || isSubmitting}
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Sign in to join the conversation</p>
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
          
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Link href={`/u/${comment.author?.username}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {comment.author?.displayName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link 
                          href={`/u/${comment.author?.username}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {comment.author?.displayName || 'Anonymous'}
                        </Link>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          {comment.score || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
