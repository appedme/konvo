'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, MessageSquare, Globe, Lock, EyeOff } from 'lucide-react'
import Link from 'next/link'

export function SpaceCard({ space, showJoinButton = true }) {
  const getSpaceIcon = (type) => {
    switch (type) {
      case 'PRIVATE':
        return Lock
      case 'UNLISTED':
        return EyeOff
      default:
        return Globe
    }
  }

  const SpaceIcon = getSpaceIcon(space.type)

  return (
    <Card className="modern-card hover-lift animate-fade-in transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
            <span className="text-white font-bold text-xl">
              {space.name[0]?.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Link
                href={`/s/${space.slug}`}
                className="font-bold text-lg hover:text-primary transition-colors duration-200 truncate group-hover:underline decoration-2 underline-offset-4"
              >
                s/{space.name}
              </Link>
              <SpaceIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>

            {space.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {space.description}
              </p>
            )}

            <div className="flex items-center space-x-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-full">
                <Users className="h-3 w-3" />
                <span className="font-medium">{space.memberCount?.toLocaleString() || 0} members</span>
              </div>
              <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-full">
                <MessageSquare className="h-3 w-3" />
                <span className="font-medium">{space.postCount?.toLocaleString() || 0} posts</span>
              </div>
            </div>
          </div>

          {showJoinButton && (
            <Button 
              size="sm" 
              variant="outline" 
              className="btn-gradient border-0 text-white font-semibold px-6 hover:scale-105 transition-all duration-200 shadow-md"
            >
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
