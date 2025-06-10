'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { SpaceCard } from '@/components/spaces/space-card'
import { CreateSpaceDialog } from '@/components/spaces/create-space-dialog'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, TrendingUp, Clock, Plus } from 'lucide-react'
import Loading from '@/components/ui/loading'

function ExplorePageContent({ user }) {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const fetchSpaces = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: sortBy,
        limit: '50'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/spaces?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSpaces(data.spaces)
      }
    } catch (error) {
      console.error('Error fetching spaces:', error)
    } finally {
      setLoading(false)
    }
  }, [sortBy, searchTerm])

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchSpaces()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Explore Spaces</h1>
              <p className="text-muted-foreground">
                Discover communities and join the conversation
              </p>
            </div>
            <CreateSpaceDialog
              user={user}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Space
                </Button>
              }
            />
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={sortBy === 'popular' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('popular')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Popular
                  </Button>
                  <Button
                    type="button"
                    variant={sortBy === 'recent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('recent')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Recent
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Spaces Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : spaces.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No spaces found matching your search.' : 'No spaces available yet.'}
                  </p>
                  {!searchTerm && (
                    <CreateSpaceDialog
                      trigger={
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create the First Space
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {spaces.map((space) => (
                  <SpaceCard key={space.id} space={space} showJoinButton={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <ExplorePageContent user={user} />}
    </AuthWrapper>
  )
}
