'use client'

import { useUser } from '@stackframe/stack'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { CreatePost } from '@/components/posts/create-post'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const user = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Find Your People.
                <br />
                Start Your Space.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join Konvo, the modern community platform where you can create, join, and grow Spaces — 
                safe environments for open, unrestricted conversation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Explore Spaces</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card>
                <CardHeader className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-blue-500" />
                  <CardTitle>Open Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Engage in meaningful discussions without restrictions or heavy-handed moderation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-green-500" />
                  <CardTitle>Grow Your Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create public, private, or unlisted spaces tailored to your community's needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Clock className="h-12 w-12 mx-auto text-purple-500" />
                  <CardTitle>Modern & Clean</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enjoy a beautiful, fast, and intuitive interface designed for great conversations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
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
