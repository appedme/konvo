'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, Link as LinkIcon, Type, Loader2, Send } from 'lucide-react'
import { createPost } from '@/lib/actions/posts'
import { showSuccess, showError } from '@/lib/toast'

export function CreatePost({ user, spaceId = null, onPostCreated }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || isPending) return

    setError('')
    const formData = new FormData()
    formData.append('content', content.trim())
    if (spaceId) formData.append('spaceId', spaceId)

    startTransition(async () => {
      try {
        const result = await createPost(formData)
        if (result.success) {
          setContent('')
          onPostCreated?.()
          showSuccess('Post created successfully!')
        } else {
          setError(result.error || 'Failed to create post')
          showError(result.error || 'Failed to create post')
        }
      } catch (error) {
        console.error('Create post error:', error)
        setError('Something went wrong. Please try again.')
        showError('Something went wrong. Please try again.')
      }
    })
  }

  if (!user) return null

  return (
    <Card className="modern-card hover-lift animate-fade-in">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 shadow-sm">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder={spaceId ? "Share something amazing with this space..." : "What's on your mind?"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none border-0 p-0 text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0 bg-transparent"
              />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!content.trim() || isPending}
                  className="btn-gradient px-8 font-semibold shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
