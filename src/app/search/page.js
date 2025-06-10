'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { PostCard } from '@/components/posts/post-card'
import { SpaceCard } from '@/components/spaces/space-card'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Users, FileText, User } from 'lucide-react'
import Loading from '@/components/ui/loading'

function SearchPageContent({ user }) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (query) {
      performSearch(query, activeTab)
    }
  }, [query, activeTab])

  const performSearch = async (searchQuery, type = 'all') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'spaces', label: 'Spaces', icon: Users },
    { id: 'users', label: 'Users', icon: User },
  ]

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Search Konvo</h1>
              <p className="text-muted-foreground">
                Find spaces, posts, and users across the platform
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              Results for &quot;{query}&quot;
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 p-1 bg-muted rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Posts */}
                {(activeTab === 'all' || activeTab === 'posts') && results?.posts?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Posts
                    </h2>
                    <div className="space-y-4">
                      {results.posts.map((post) => (
                        <PostCard key={post.id} post={post} user={user} showSpace={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Spaces */}
                {(activeTab === 'all' || activeTab === 'spaces') && results?.spaces?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Spaces
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.spaces.map((space) => (
                        <SpaceCard key={space.id} space={space} showJoinButton={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Users */}
                {(activeTab === 'all' || activeTab === 'users') && results?.users?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Users
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.users.map((userResult) => (
                        <Card key={userResult.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={userResult.avatar} />
                                <AvatarFallback>
                                  {userResult.displayName?.[0] || userResult.username?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {userResult.displayName || userResult.username}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  @{userResult.username}
                                </p>
                                {userResult.bio && (
                                  <p className="text-sm mt-1">{userResult.bio}</p>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                                  <span>{userResult._count.posts} posts</span>
                                  <span>{userResult._count.followers} followers</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {results && 
                 Object.values(results).every(arr => arr.length === 0) && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or check the spelling
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <SearchPageContent user={user} />}
    </AuthWrapper>
  )
}
