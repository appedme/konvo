'use client'

import { useUser } from '@stackframe/stack'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { CreatePost } from '@/components/posts/create-post'
import { PostCard } from '@/components/posts/post-card'
import { LandingPage } from '@/components/landing-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Clock } from 'lucide-react'

export default function Home() {
  const user = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [sortBy, user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?type=${sortBy}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    fetchPosts()
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <LandingPage />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          <main className="flex-1 max-w-2xl mx-auto py-6 space-y-6">
            {/* Sort Tabs */}
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setSortBy('recent')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular
              </Button>
            </div>

            {/* Create Post */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No posts yet. Be the first to share something!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} showSpace={true} />
                ))
              )}
            </div>
          </main>

          <Sidebar />
        </div>
      </div>
    </div>
  )
}
