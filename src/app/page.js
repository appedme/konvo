'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { CreatePost } from '@/components/posts/create-post'
import { PostCard } from '@/components/posts/post-card'
import { LandingPage } from '@/components/landing-page'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Clock } from 'lucide-react'
import { usePosts } from '@/hooks/use-posts'
import Loading from '@/components/ui/loading'

function HomeContent({ user }) {
  const [sortBy, setSortBy] = useState('recent')
  const { posts, isLoading, refresh } = usePosts()

  const handlePostCreated = () => {
    refresh()
  }

  if (!user) {
    return (
      <>
        <Navbar user={user} />
        <LandingPage />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          <main className="flex-1 max-w-2xl mx-auto py-8 space-y-8">
            {/* Sort Tabs */}
            <div className="flex space-x-1 p-1 bg-muted/50 rounded-xl shadow-sm">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 h-10 font-semibold transition-all duration-200"
                onClick={() => setSortBy('recent')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 h-10 font-semibold transition-all duration-200"
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular
              </Button>
            </div>

            {/* Create Post */}
            <CreatePost user={user} onPostCreated={handlePostCreated} />

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary shadow-sm"></div>
                  <p className="mt-4 text-muted-foreground">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <Card className="modern-card">
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No posts yet. Be the first to share something amazing!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} user={user} showSpace={true} />
                ))
              )}
            </div>
          </main>

          <Sidebar user={user} />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <HomeContent user={user} />}
    </AuthWrapper>
  )
}
