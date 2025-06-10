'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, TrendingUp, Hash } from 'lucide-react'
import Link from 'next/link'

export function Sidebar({ user }) {

  const trendingSpaces = [
    { name: 'Tech Talk', members: 15420, slug: 'tech-talk' },
    { name: 'Startup Life', members: 8200, slug: 'startup-life' },
    { name: 'Design', members: 12500, slug: 'design' },
    { name: 'Gaming', members: 22000, slug: 'gaming' },
  ]

  const quickLinks = [
    { name: 'Popular', href: '/popular', icon: TrendingUp },
    { name: 'All Spaces', href: '/spaces', icon: Hash },
  ]

  if (!user) return null

  return (
    <aside className="w-80 shrink-0 p-4 space-y-6">
      <div className="space-y-6">
        {/* User Profile Card */}
        <Card className="modern-card hover-lift animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-14 w-14 ring-4 ring-primary/10 shadow-lg">
                <AvatarImage src={user.profileImageUrl} />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">
                  {user.displayName || 'Anonymous User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  @{user.primaryEmail?.split('@')[0]}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm" className="w-full btn-gradient font-semibold" asChild>
                <Link href="/create-space">
                  <span>Create Space</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="modern-card hover-lift animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-4 text-foreground">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-11 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium"
                  asChild
                >
                  <Link href={link.href}>
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Spaces */}
        <Card className="modern-card hover-lift animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-4 text-foreground">Trending Spaces</h3>
            <div className="space-y-3">
              {trendingSpaces.map((space) => (
                <Link
                  key={space.slug}
                  href={`/s/${space.slug}`}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 hover-lift group"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-md flex items-center justify-center text-white font-bold text-sm">
                    {space.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                      s/{space.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Users className="inline h-3 w-3 mr-1" />
                      {space.members.toLocaleString()} members
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
