'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Plus, Home, Compass, Bell, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navbar({ user }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const searchRef = useRef(null)
  const router = useRouter()

  // Fetch notification count for authenticated users
  useEffect(() => {
    if (user) {
      fetchNotificationCount()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications?unread=true&limit=1')
      if (response.ok) {
        const data = await response.json()
        setNotificationCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notification count:', error)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery.trim())
      } else {
        setSearchResults(null)
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (query) => {
    setSearchLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="hidden font-bold sm:inline-block">Konvo</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search spaces, posts, users..."
                  className="pl-9 md:w-[300px] lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                />
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (searchResults || searchLoading) && (
              <Card className="absolute top-full mt-1 w-full z-50 max-h-96 overflow-y-auto">
                <CardContent className="p-2">
                  {searchLoading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Spaces */}
                      {searchResults?.spaces?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Spaces</div>
                          {searchResults.spaces.map((space) => (
                            <Link
                              key={space.id}
                              href={`/s/${space.slug}`}
                              className="block p-2 hover:bg-muted rounded-md"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {space.name[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">s/{space.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {space._count.members} members
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Posts */}
                      {searchResults?.posts?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Posts</div>
                          {searchResults.posts.map((post) => (
                            <Link
                              key={post.id}
                              href={`/s/${post.space?.slug}`}
                              className="block p-2 hover:bg-muted rounded-md"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="text-sm truncate">{post.content.slice(0, 100)}...</div>
                              <div className="text-xs text-muted-foreground">
                                in s/{post.space?.name} • {post._count.comments} comments
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Users */}
                      {searchResults?.users?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Users</div>
                          {searchResults.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {user.displayName?.[0] || user.username?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {user.displayName || user.username}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user._count.posts} posts • {user._count.followers} followers
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchQuery.trim() && (
                        <Link
                          href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                          className="block p-2 text-center text-sm text-primary hover:bg-muted rounded-md"
                          onClick={() => setShowResults(false)}
                        >
                          See all results for &quot;{searchQuery}&quot;
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <nav className="flex items-center space-x-1">
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Home</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/explore">
                    <Compass className="h-4 w-4" />
                    <span className="sr-only">Explore</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="relative">
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                    <span className="sr-only">
                      Notifications {notificationCount > 0 && `(${notificationCount})`}
                    </span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/create-space">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Create Space</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/u/${user.primaryEmail}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback>
                        {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}
