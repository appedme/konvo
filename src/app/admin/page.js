'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Globe,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Eye,
  UserPlus,
  Activity,
  Crown,
  Flag,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Shield,
  Database,
  Server,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [pendingActions, setPendingActions] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - in production, fetch from your API
        const stats = {
          totalUsers: 1247,
          activeUsers: 892,
          totalSpaces: 156,
          verifiedSpaces: 23,
          totalPosts: 8451,
          todayPosts: 127,
          reportedContent: 12,
          pendingVerifications: 8,
          serverHealth: 'good',
          uptime: '99.9%',
          responseTime: '145ms',
          storageUsed: '67%'
        }
        setDashboardStats(stats)

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            type: 'user_joined',
            description: 'New user registered: john_doe@example.com',
            timestamp: '2 minutes ago',
            icon: UserPlus,
            color: 'text-green-500'
          },
          {
            id: 2,
            type: 'space_created',
            description: 'New space created: "Web3 Developers"',
            timestamp: '15 minutes ago',
            icon: Globe,
            color: 'text-blue-500'
          },
          {
            id: 3,
            type: 'content_reported',
            description: 'Post reported for inappropriate content',
            timestamp: '1 hour ago',
            icon: Flag,
            color: 'text-red-500'
          },
          {
            id: 4,
            type: 'verification_request',
            description: 'Space verification requested: "AI Research Hub"',
            timestamp: '2 hours ago',
            icon: Crown,
            color: 'text-yellow-500'
          }
        ])

        // Mock pending actions
        setPendingActions([
          {
            id: 1,
            title: 'Review verification requests',
            description: '8 spaces pending verification',
            href: '/admin/verification',
            priority: 'high',
            count: 8
          },
          {
            id: 2,
            title: 'Moderate reported content',
            description: '12 reports require review',
            href: '/admin/moderation',
            priority: 'high',
            count: 12
          },
          {
            id: 3,
            title: 'User account reviews',
            description: '3 accounts flagged for review',
            href: '/admin/users',
            priority: 'medium',
            count: 3
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  if (!dashboardStats) {
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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your Konvo community
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={dashboardStats.serverHealth === 'good' ? 'default' : 'destructive'}
            className="gap-2"
          >
            <div className={`h-2 w-2 rounded-full ${dashboardStats.serverHealth === 'good' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`} />
            Server {dashboardStats.serverHealth}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +12% this week
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +8% this week
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spaces</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardStats.totalSpaces}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500 inline-flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    {dashboardStats.verifiedSpaces} verified
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posts Today</p>
                <p className="text-3xl font-bold text-orange-600">{dashboardStats.todayPosts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +15% vs yesterday
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <MessageSquare className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={action.priority === 'high' ? 'destructive' : 'secondary'}
                      className="px-2 py-1"
                    >
                      {action.priority}
                    </Badge>
                    <h3 className="font-medium">{action.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{action.count}</div>
                    <div className="text-xs text-muted-foreground">items</div>
                  </div>
                  <Link href={action.href}>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-muted/30">
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/admin/analytics">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <span className="text-sm font-bold text-green-600">{dashboardStats.uptime}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{dashboardStats.responseTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Storage Used</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">{dashboardStats.storageUsed}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="text-sm font-bold text-purple-600">Healthy</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link href="/admin/settings">
                <Button variant="outline" size="sm" className="w-full">
                  System Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Manage Users</span>
                <span className="text-xs text-muted-foreground">View and manage all users</span>
              </Button>
            </Link>

            <Link href="/admin/spaces">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <Globe className="h-6 w-6 text-green-500" />
                <span className="font-medium">Manage Spaces</span>
                <span className="text-xs text-muted-foreground">Community management</span>
              </Button>
            </Link>

            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground">Detailed insights</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
