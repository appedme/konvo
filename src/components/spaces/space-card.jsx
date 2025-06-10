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
    <Card className="hover:bg-accent/5 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {space.name[0]?.toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link 
                href={`/s/${space.slug}`}
                className="font-semibold hover:underline truncate"
              >
                s/{space.name}
              </Link>
              <SpaceIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            
            {space.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {space.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{space.memberCount?.toLocaleString() || 0} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{space.postCount?.toLocaleString() || 0} posts</span>
              </div>
            </div>
          </div>
          
          {showJoinButton && (
            <Button size="sm" variant="outline">
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
