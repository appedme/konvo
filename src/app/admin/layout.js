'use client'

import { useAuth } from '@/hooks/use-auth'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Users,
  Globe,
  BarChart3,
  Settings,
  MessageSquare,
  Flag,
  Crown,
  Eye,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and analytics'
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users and permissions'
  },
  {
    title: 'Space Management',
    href: '/admin/spaces',
    icon: Globe,
    description: 'Manage communities and verification'
  },
  {
    title: 'Content Moderation',
    href: '/admin/moderation',
    icon: Flag,
    description: 'Review reported content'
  },
  {
    title: 'Verification',
    href: '/admin/verification',
    icon: Crown,
    description: 'Manage verification badges'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: Eye,
    description: 'Detailed site analytics'
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Site configuration'
  }
]

export default function AdminLayout({ children }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You need administrator privileges to access this area.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Admin Sidebar */}
          <div className="lg:col-span-3">
            <Card className="bg-card/50 backdrop-blur border-border/50 sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground">Site Administration</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                            isActive
                              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600"
                              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-muted-foreground")} />
                          <div className="flex-1 min-w-0">
                            <p className={cn("font-medium text-sm", isActive && "text-blue-600")}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
