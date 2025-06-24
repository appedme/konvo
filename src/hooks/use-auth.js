'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@stackframe/stack'

export function useAuth() {
  const stackUser = useUser()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (stackUser !== undefined) {
      if (stackUser) {
        // Transform Stack user to our user format
        const transformedUser = {
          id: stackUser.id,
          displayName: stackUser.displayName || stackUser.primaryEmail?.split('@')[0],
          username: stackUser.primaryEmail?.split('@')[0],
          primaryEmail: stackUser.primaryEmail,
          profileImageUrl: stackUser.profileImageUrl,
          role: stackUser.serverMetadata?.role || 'USER',
          isAdmin: ['ADMIN', 'SUPER_ADMIN'].includes(stackUser.serverMetadata?.role),
          isVerified: stackUser.serverMetadata?.isVerified || false,
          level: stackUser.serverMetadata?.level || 1,
          totalUpvotes: stackUser.serverMetadata?.totalUpvotes || 0,
          spacesJoined: stackUser.serverMetadata?.spacesJoined || 0,
        }
        setUser(transformedUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  }, [stackUser])

  return {
    user,
    isLoading: stackUser === undefined || isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  }
}

// Hook specifically for admin authentication
export function useAdminAuth() {
  const { user, isLoading, isAdmin, isAuthenticated } = useAuth()
  
  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated: isAuthenticated && isAdmin,
    canManageUsers: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN',
    canManageSpaces: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN',
    canDeleteUsers: user?.role === 'SUPER_ADMIN',
    canPromoteUsers: user?.role === 'SUPER_ADMIN'
  }
}
