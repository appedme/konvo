'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { 
  Search,
  TrendingUp,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  ArrowUp,
  Activity,
  Crown,
  Settings,
  BarChart3,
  Shield,
  Flame,
  Clock,
  Star,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Clean, minimal component following guidelines
function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [spaces, setSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setIsLoading(true)
      
      const [postsRes, spacesRes] = await Promise.all([
        fetch('/api/posts').catch(() => ({ ok: false })),
        fetch('/api/spaces').catch(() => ({ ok: false }))
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        // API returns { posts: [], pagination: {} }, we need just the posts array
        const postsArray = postsData.posts || postsData || []
        setPosts(postsArray.slice(0, 3))
      } else {
        console.error('Posts API failed:', postsRes.status)
      }

      if (spacesRes.ok) {
        const spacesData = await spacesRes.json()
        // API returns { spaces: [], pagination: {} }, we need just the spaces array
        const spacesArray = spacesData.spaces || spacesData || []
        setSpaces(spacesArray.slice(0, 4))
      } else {
        console.error('Spaces API failed:', spacesRes.status)
      }

      // Mock community stats
      setStats({
        totalUsers: '1.2K',
        activeUsers: '387',
        totalSpaces: '42',
        postsToday: '156'
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const trendingTopics = [
    { name: 'Next.js', count: 234, trending: true },
    { name: 'React', count: 189, trending: true },
    { name: 'TypeScript', count: 156, trending: false },
    { name: 'AI/ML', count: 142, trending: true },
    { name: 'Web3', count: 98, trending: false }
  ]

  const quickActions = [
    { name: 'Create Space', href: '/create-space', icon: Plus, primary: true },
    { name: 'Explore', href: '/explore', icon: Globe, primary: false },
    { name: 'Activity', href: '/notifications', icon: Activity, primary: false }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <AuthWrapper>
      {({ user }) => (
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Konvo</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Explore
                  </Link>
                  <Link href="/notifications" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Activity
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                </nav>

                <div className="flex items-center space-x-3">
                  {user ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                        {user.displayName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Welcome Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your People. Start Your Space.
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join communities that matter to you. Create spaces for meaningful conversations.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search spaces, posts, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </form>

              {/* Quick Actions */}
              <div className="flex items-center justify-center space-x-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.name}
                    variant={action.primary ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href={action.href} className="flex items-center space-x-2">
                      <action.icon className="w-5 h-5" />
                      <span>{action.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </section>

            {/* Stats Grid */}
            {stats && (
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                    <div className="text-sm text-gray-600">Active Today</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalSpaces}</div>
                    <div className="text-sm text-gray-600">Spaces</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.postsToday}</div>
                    <div className="text-sm text-gray-600">Posts Today</div>
                  </CardContent>
                </Card>
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Posts */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/explore" className="flex items-center space-x-1">
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <Link key={post.id} href={`/posts/${post.id}`}>
                          <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={post.author?.avatar} />
                                  <AvatarFallback className="bg-gray-100 text-gray-600">
                                    {post.author?.displayName?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-medium text-gray-900">
                                      {post.author?.displayName || 'Anonymous'}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    {post.space && (
                                      <>
                                        <span className="text-gray-500">in</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {post.space.name}
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                  {post.title && (
                                    <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                                  )}
                                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                      <ArrowUp className="w-4 h-4" />
                                      <span>{post.score || 0}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <MessageSquare className="w-4 h-4" />
                                      <span>{post._count?.comments || 0}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <Card className="border-gray-200">
                        <CardContent className="p-8 text-center">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No posts yet. Be the first to start a conversation!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </section>

                {/* Popular Spaces */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Popular Spaces</h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/explore" className="flex items-center space-x-1">
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spaces.length > 0 ? (
                      spaces.map((space) => (
                        <Card key={space.id} className="border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{space.name}</h3>
                                <p className="text-sm text-gray-600">{space._count?.members || 0} members</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                              {space.description || 'No description available'}
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Join Space
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="border-gray-200 md:col-span-2">
                        <CardContent className="p-8 text-center">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No spaces yet. Create the first one!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Trending Topics */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Trending Topics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                          <span className="font-medium text-gray-900">{topic.name}</span>
                          {topic.trending && <Flame className="w-4 h-4 text-orange-500" />}
                        </div>
                        <span className="text-sm text-gray-500">{topic.count} posts</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Community Guidelines */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Community</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>• Be respectful and kind</p>
                      <p>• No spam or self-promotion</p>
                      <p>• Keep discussions on-topic</p>
                      <p>• Help newcomers feel welcome</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Guidelines
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </main>
        </div>
      )}
    </AuthWrapper>
  )
}

export default HomePage
