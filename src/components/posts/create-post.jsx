'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, Link as LinkIcon, Type } from 'lucide-react'

export function CreatePost({ user, spaceId = null, onPostCreated }) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [postType, setPostType] = useState('TEXT')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          type: postType,
          spaceId,
        }),
      })

      if (response.ok) {
        setContent('')
        onPostCreated?.()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback>
                {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder={spaceId ? "What's happening in this space?" : "What's on your mind?"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
              />

              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    variant={postType === 'TEXT' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPostType('TEXT')}
                  >
                    <Type className="h-4 w-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    type="button"
                    variant={postType === 'IMAGE' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPostType('IMAGE')}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    type="button"
                    variant={postType === 'LINK' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPostType('LINK')}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!content.trim() || isLoading}
                  className="px-6"
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
