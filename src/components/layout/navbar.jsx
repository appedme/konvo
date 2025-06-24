'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Search, Plus, Home, Compass, Bell, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { quickSearch } from '@/lib/actions/search'

export function Navbar({ user }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isPending, startTransition] = useTransition()
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
    if (!query.trim()) return

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('query', query)

        const result = await quickSearch(formData)
        if (result.success) {
          setSearchResults(result.data.results)
          setShowResults(true)
        } else {
          console.error('Search error:', result.error)
        }
      } catch (error) {
        console.error('Search error:', error)
      }
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2 transition-all duration-200 hover:opacity-80" href="/">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg animate-pulse" />
            <span className="hidden font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:inline-block">
              Konvo
            </span>
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
            {showResults && (searchResults || isPending) && (
              <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-lg border-border/50 bg-background/95 backdrop-blur">
                <CardContent className="p-3">
                  {isPending ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Spaces */}
                      {searchResults?.spaces?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Spaces</div>
                          {searchResults.spaces.map((space) => (
                            <Link
                              key={space.id}
                              href={`/s/${space.slug}`}
                              className="block p-3 hover:bg-muted/80 rounded-lg transition-all duration-200 hover:shadow-sm"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                                  <span className="text-white text-sm font-bold">
                                    {space.name[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{space.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {space.memberCount || 0} members
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
                          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Posts</div>
                          {searchResults.posts.map((post) => (
                            <Link
                              key={post.id}
                              href={`/s/${post.space?.slug}`}
                              className="block p-3 hover:bg-muted/80 rounded-lg transition-all duration-200 hover:shadow-sm"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="text-sm font-medium line-clamp-2 mb-1">
                                {post.content.slice(0, 100)}...
                              </div>
                              <div className="text-xs text-muted-foreground">
                                in s/{post.space?.name} • {post._count.comments} comments • {post._count.votes} votes
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Users */}
                      {searchResults?.users?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Users</div>
                          {searchResults.users.map((user) => (
                            <Link
                              key={user.id}
                              href={`/u/${user.username}`}
                              className="flex items-center space-x-3 p-3 hover:bg-muted/80 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
                              onClick={() => setShowResults(false)}
                            >
                              <Avatar className="h-8 w-8 ring-2 ring-border">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-sm font-medium">
                                  {user.displayName?.[0] || user.username?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="text-sm font-medium flex items-center gap-1">
                                  {user.displayName || user.username}
                                  {user.verified && <span className="text-blue-500">✓</span>}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  @{user.username} • {user._count?.posts || 0} posts
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Empty state */}
                      {searchResults && Object.values(searchResults).every(arr => arr.length === 0) && (
                        <div className="text-center py-6">
                          <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No results found</p>
                          <p className="text-xs text-muted-foreground/80">Try different keywords</p>
                        </div>
                      )}

                      {searchQuery.trim() && (
                        <div className="border-t pt-3 mt-3">
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                            className="block p-2 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 font-medium"
                            onClick={() => setShowResults(false)}
                          >
                            See all results for &quot;{searchQuery}&quot; →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Home</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href="/explore">
                    <Compass className="h-5 w-5" />
                    <span className="sr-only">Explore</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                    <span className="sr-only">
                      Notifications {notificationCount > 0 && `(${notificationCount})`}
                    </span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href="/create-space">
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Create Space</span>
                  </Link>
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href={`/u/${user.primaryEmail}`}>
                    <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                        {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-200" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl" asChild>
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
