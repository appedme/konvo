'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { PostCard } from '@/components/posts/post-card'
import { SpaceCard } from '@/components/spaces/space-card'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Users, FileText, User, Loader2 } from 'lucide-react'
import { searchContent } from '@/lib/actions/search'
import Loading from '@/components/ui/loading'

function SearchPageContent({ user }) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (query) {
      performSearch(query, activeTab)
    }
  }, [query, activeTab])

  const performSearch = async (searchQuery, type = 'all') => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('query', searchQuery)
        formData.append('type', type)
        formData.append('limit', '50')

        const result = await searchContent(formData)
        if (result.success) {
          setResults(result.data.results)
        } else {
          console.error('Search error:', result.error)
          setResults({})
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults({})
      }
    })
  }

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'spaces', label: 'Spaces', icon: Users },
    { id: 'users', label: 'Users', icon: User },
  ]

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto shadow-xl border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="text-center py-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Search Konvo
              </h1>
              <p className="text-muted-foreground text-lg">
                Find spaces, posts, and users across the platform
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Search Results
            </h1>
            <p className="text-muted-foreground text-lg">
              Results for &quot;{query}&quot;
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 p-1 bg-muted/50 rounded-xl backdrop-blur border border-border/50">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex-1 transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-background/50'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={isPending}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isPending ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Searching...</h3>
                <p className="text-muted-foreground">Finding the best results for you</p>
              </div>
            ) : (
              <>
                {/* Posts */}
                {(activeTab === 'all' || activeTab === 'posts') && results?.posts?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Posts
                      <span className="ml-2 text-sm text-muted-foreground">({results.posts.length})</span>
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
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Spaces
                      <span className="ml-2 text-sm text-muted-foreground">({results.spaces.length})</span>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.spaces.map((space) => (
                        <SpaceCard key={space.id} space={space} user={user} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Users */}
                {(activeTab === 'all' || activeTab === 'users') && results?.users?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Users
                      <span className="ml-2 text-sm text-muted-foreground">({results.users.length})</span>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.users.map((searchUser) => (
                        <Card key={searchUser.id} className="hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12 ring-2 ring-border">
                                <AvatarImage src={searchUser.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium text-lg">
                                  {searchUser.displayName?.[0] || searchUser.username?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {searchUser.displayName || searchUser.username}
                                  {searchUser.verified && <span className="text-blue-500 text-sm">✓</span>}
                                </h3>
                                <p className="text-muted-foreground">@{searchUser.username}</p>
                                {searchUser.bio && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{searchUser.bio}</p>
                                )}
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span>{searchUser._count?.posts || 0} posts</span>
                                  <span>{searchUser._count?.followers || 0} followers</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {results && Object.values(results).every(arr => arr.length === 0) && (
                  <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur">
                    <CardContent className="text-center py-12">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground mb-6">
                        We couldn&apos;t find anything matching &quot;{query}&quot;
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Try:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Different keywords</li>
                          <li>More general terms</li>
                          <li>Checking your spelling</li>
                        </ul>
                      </div>
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
