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
    <aside className="w-80 shrink-0 p-4">
      <div className="space-y-4">
        {/* User Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl} />
                <AvatarFallback>
                  {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.displayName || 'Anonymous User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user.primaryEmail?.split('@')[0]}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button size="sm" className="flex-1" asChild>
                <Link href="/create-space">Create Space</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={link.href}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Spaces */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Trending Spaces</h3>
            <div className="space-y-3">
              {trendingSpaces.map((space) => (
                <Link
                  key={space.slug}
                  href={`/s/${space.slug}`}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">s/{space.name}</p>
                    <p className="text-xs text-muted-foreground">
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
