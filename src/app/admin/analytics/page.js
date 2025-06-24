'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  MessageSquare,
  Activity,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Share,
  Download,
  Filter
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockData = {
          overview: {
            totalUsers: 1247,
            totalSpaces: 156,
            totalPosts: 8451,
            totalComments: 12678,
            activeUsers: 892,
            newUsers: 67,
            newSpaces: 8,
            newPosts: 127
          },
          userGrowth: {
            current: 1247,
            previous: 1156,
            percentChange: 7.9,
            trend: 'up'
          },
          engagement: {
            dailyActiveUsers: 523,
            weeklyActiveUsers: 892,
            monthlyActiveUsers: 1156,
            averageSessionDuration: '8m 32s',
            postsPerUser: 6.8,
            commentsPerPost: 1.5
          },
          topSpaces: [
            { id: 1, name: 'Tech Talk', members: 1247, posts: 89, growth: '+15%' },
            { id: 2, name: 'Design Hub', members: 423, posts: 67, growth: '+8%' },
            { id: 3, name: 'Startup Founders', members: 356, posts: 45, growth: '+22%' },
            { id: 4, name: 'AI Research', members: 289, posts: 78, growth: '+12%' },
            { id: 5, name: 'Dev Community', members: 234, posts: 56, growth: '+5%' }
          ],
          topPosts: [
            { id: 1, title: 'The Future of AI Development', views: 2341, likes: 187, comments: 45 },
            { id: 2, title: 'Best Design Practices for 2024', views: 1892, likes: 156, comments: 38 },
            { id: 3, title: 'Startup Funding Strategies', views: 1567, likes: 134, comments: 29 },
            { id: 4, title: 'React vs Vue in 2024', views: 1234, likes: 98, comments: 67 },
            { id: 5, title: 'Remote Work Best Practices', views: 1098, likes: 87, comments: 34 }
          ],
          activityTimeline: [
            { time: '00:00', users: 45, posts: 2 },
            { time: '04:00', users: 23, posts: 1 },
            { time: '08:00', users: 234, posts: 12 },
            { time: '12:00', users: 456, posts: 28 },
            { time: '16:00', users: 398, posts: 22 },
            { time: '20:00', users: 312, posts: 18 }
          ],
          contentMetrics: {
            totalViews: 45623,
            totalLikes: 8934,
            totalShares: 1234,
            averageEngagementRate: '6.8%',
            popularCategories: [
              { name: 'Technology', posts: 234, engagement: '8.2%' },
              { name: 'Design', posts: 189, engagement: '7.1%' },
              { name: 'Business', posts: 156, engagement: '6.8%' },
              { name: 'Education', posts: 134, engagement: '5.9%' },
              { name: 'Entertainment', posts: 98, engagement: '7.5%' }
            ]
          }
        }
        setAnalyticsData(mockData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your community's performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.overview.newUsers} this week
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-purple-600">{analyticsData.overview.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100).toFixed(1)}% engagement rate
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spaces</p>
                <p className="text-3xl font-bold text-green-600">{analyticsData.overview.totalSpaces}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.overview.newSpaces} this week
                </p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posts Today</p>
                <p className="text-3xl font-bold text-orange-600">{analyticsData.overview.newPosts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analyticsData.overview.totalPosts.toLocaleString()} total posts
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsData.userGrowth.current.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold flex items-center ${analyticsData.userGrowth.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {analyticsData.userGrowth.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {analyticsData.userGrowth.percentChange}%
                  </p>
                  <p className="text-sm text-muted-foreground">vs last period</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{analyticsData.engagement.dailyActiveUsers}</p>
                  <p className="text-xs text-muted-foreground">Daily Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{analyticsData.engagement.weeklyActiveUsers}</p>
                  <p className="text-xs text-muted-foreground">Weekly Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{analyticsData.engagement.monthlyActiveUsers}</p>
                  <p className="text-xs text-muted-foreground">Monthly Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Session Duration</span>
                <span className="font-bold">{analyticsData.engagement.averageSessionDuration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Posts per User</span>
                <span className="font-bold">{analyticsData.engagement.postsPerUser}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Comments per Post</span>
                <span className="font-bold">{analyticsData.engagement.commentsPerPost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engagement Rate</span>
                <span className="font-bold text-green-600">{analyticsData.contentMetrics.averageEngagementRate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Top Performing Spaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topSpaces.map((space, index) => (
                <div key={space.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{space.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {space.members} members • {space.posts} posts
                      </p>
                    </div>
                  </div>
                  <Badge className={`${space.growth.startsWith('+') ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {space.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              Top Posts by Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPosts.map((post, index) => (
                <div key={post.id} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-2 flex-1">{post.title}</h4>
                    <Badge variant="outline" className="ml-2 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Categories */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Content Performance by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analyticsData.contentMetrics.popularCategories.map((category, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-primary">{category.posts}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">{category.engagement}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Activity Timeline (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.activityTimeline.map((timeSlot, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium">{timeSlot.time}</div>
                <div className="flex-1 flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Active Users</span>
                      <span className="text-sm font-bold">{timeSlot.users}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(timeSlot.users / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">New Posts</span>
                      <span className="text-sm font-bold">{timeSlot.posts}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(timeSlot.posts / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
