'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { CreatePost } from '@/components/posts/create-post'
import { PostCard } from '@/components/posts/post-card'
import { LandingPage } from '@/components/landing-page'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import {
  TrendingUp,
  Clock,
  Zap,
  Users,
  MessageSquare,
  Heart,
  Flame,
  Star,
  Activity,
  Globe,
  Sparkles,
  ArrowUp,
  Calendar,
  UserPlus,
  Award,
  Bookmark,
  Search,
  Filter,
  ChevronRight,
  PlusCircle,
  Crown,
  Shield,
  BarChart3,
  Verified
} from 'lucide-react'
import { usePosts } from '@/hooks/use-posts'
import { useSpaces } from '@/hooks/use-spaces'
import Loading from '@/components/ui/loading'
import Link from 'next/link'

function HomeContent({ user }) {
  const [sortBy, setSortBy] = useState('trending')
  const [welcomeStats, setWelcomeStats] = useState(null)
  const [featuredContent, setFeaturedContent] = useState(null)
  const { posts, isLoading, refresh } = usePosts()
  const { spaces } = useSpaces()

  const handlePostCreated = () => {
    refresh()
  }

  // Fetch dynamic homepage data
  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const mockStats = {
            todayPosts: Math.floor(Math.random() * 50) + 10,
            trendingSpaces: 5,
            activeUsers: Math.floor(Math.random() * 200) + 100,
            weeklyGrowth: '+12%',
            userLevel: Math.floor(Math.random() * 10) + 1,
            joinedSpaces: Math.floor(Math.random() * 8) + 3,
            totalUpvotes: Math.floor(Math.random() * 500) + 50
          }
          setWelcomeStats(mockStats)

          // Featured content
          setFeaturedContent({
            postOfTheDay: posts?.[0],
            spaceOfTheWeek: spaces?.[0],
            trendingTopics: ['Tech Talk', 'Startup Life', 'Design', 'Gaming', 'Music'],
          })
        } catch (error) {
          console.error('Error fetching stats:', error)
        }
      }
      fetchStats()
    }
  }, [user, posts, spaces])

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-orange-500' },
    { value: 'recent', label: 'Recent', icon: Clock, color: 'text-blue-500' },
    { value: 'hot', label: 'Hot', icon: Flame, color: 'text-red-500' },
    { value: 'top', label: 'Top', icon: Star, color: 'text-yellow-500' }
  ]

  if (isLoading) {
    return <Loading size="lg" text="Loading your personalized feed..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">

            {/* Welcome Hero Section */}
            {user && welcomeStats && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={user.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Welcome back, {user.displayName || 'Friend'}!
                        </h2>
                        <p className="text-muted-foreground">
                          Ready to share something amazing today?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                        <Crown className="h-3 w-3 mr-1" />
                        Level {welcomeStats.userLevel}
                      </Badge>
                      {user.isAdmin && (
                        <Badge variant="destructive" className="bg-gradient-to-r from-red-500/10 to-pink-500/10">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="text-2xl font-bold text-orange-500">{welcomeStats.todayPosts}</div>
                      <div className="text-xs text-muted-foreground">Posts Today</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="text-2xl font-bold text-blue-500">{welcomeStats.joinedSpaces}</div>
                      <div className="text-xs text-muted-foreground">Your Spaces</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="text-2xl font-bold text-green-500">{welcomeStats.totalUpvotes}</div>
                      <div className="text-xs text-muted-foreground">Total Upvotes</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="text-2xl font-bold text-purple-500">{welcomeStats.weeklyGrowth}</div>
                      <div className="text-xs text-muted-foreground">This Week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Post */}
            {user && (
              <CreatePost user={user} onPostCreated={handlePostCreated} />
            )}

            {/* Feed Controls */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {sortOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? 'default' : 'ghost'}
                          size="sm"
                          className={`transition-all duration-200 ${sortBy === option.value
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'hover:bg-muted/50'
                            }`}
                          onClick={() => setSortBy(option.value)}
                        >
                          <Icon className={`h-4 w-4 mr-2 ${sortBy === option.value ? 'text-white' : option.color}`} />
                          {option.label}
                        </Button>
                      )
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} user={user} />
                ))
              ) : (
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="text-center py-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to share something amazing with the community!
                    </p>
                    {user && (
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Your First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">

            {/* Featured Content */}
            {featuredContent && (
              <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Award className="h-5 w-5 mr-2 text-amber-500" />
                    Featured Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredContent.postOfTheDay && (
                    <div className="p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Post of the Day</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {featuredContent.postOfTheDay.content}
                      </p>
                    </div>
                  )}

                  {featuredContent.spaceOfTheWeek && (
                    <div className="p-3 rounded-lg bg-background/50 backdrop-blur">
                      <div className="flex items-center space-x-2 mb-2">
                        <Crown className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Space of the Week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {featuredContent.spaceOfTheWeek.name[0]}
                          </span>
                        </div>
                        <span className="text-sm">{featuredContent.spaceOfTheWeek.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Trending Topics */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {featuredContent?.trendingTopics?.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-primary">#{topic.replace(' ', '')}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/create-space">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/5">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Space
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/5">
                    <Search className="h-4 w-4 mr-2" />
                    Explore Communities
                  </Button>
                </Link>
                <Link href="/notifications">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/5">
                    <Activity className="h-4 w-4 mr-2" />
                    View Activity
                  </Button>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start hover:bg-destructive/5 text-red-600 border-red-200">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-bold text-green-500">
                    {welcomeStats?.activeUsers || '150+'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spaces</span>
                  <span className="font-bold text-blue-500">
                    {spaces?.length || 25}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts Today</span>
                  <span className="font-bold text-purple-500">
                    {welcomeStats?.todayPosts || 42}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Growth</span>
                    <span className="font-bold text-green-500 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {welcomeStats?.weeklyGrowth || '+15%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthWrapper fallback={<LandingPage />}>
      {({ user }) => <HomeContent user={user} />}
    </AuthWrapper>
  )
}
