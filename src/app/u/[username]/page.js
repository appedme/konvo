'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Users,
  MessageSquare,
  ArrowUp,
  Trophy,
  Star,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Loading from '@/components/ui/loading'

function UserProfileContent({ user: currentUser }) {
  const params = useParams()
  const username = params.username

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${username}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    if (username) {
      fetchProfile()
    }
  }, [username, fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={currentUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={currentUser} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
              <p className="text-muted-foreground">
                The user you&apos;re looking for doesn&apos;t exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { user, posts, spaces } = profileData

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FileText, count: user._count.posts },
    { id: 'spaces', label: 'Spaces', icon: Users, count: user._count.spaces },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                <Avatar className="h-24 w-24 mx-auto md:mx-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.[0] || user.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">
                      {user.displayName || user.username}
                    </h1>
                    {user.verified && (
                      <Shield className="h-5 w-5 text-blue-500" title="Verified" />
                    )}
                  </div>

                  <p className="text-muted-foreground mb-3">@{user.username}</p>

                  {user.bio && (
                    <p className="mb-4">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-start space-x-6 text-sm">
                    <div>
                      <span className="font-semibold">{user._count.posts}</span>
                      <span className="text-muted-foreground ml-1">Posts</span>
                    </div>
                    <div>
                      <span className="font-semibold">{user._count.followers}</span>
                      <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{user._count.following}</span>
                      <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  {currentUser?.primaryEmail && currentUser.primaryEmail.split('@')[0] !== user.username ? (
                    <Button>Follow</Button>
                  ) : (
                    <Button variant="outline">Edit Profile</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
                  {tab.label} ({tab.count})
                </Button>
              )
            })}
          </div>

          {/* Content */}
          <div>
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {user.username === currentUser?.primaryEmail?.split('@')[0]
                          ? "You haven't posted anything yet"
                          : `${user.displayName || user.username} hasn't posted anything yet`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} user={currentUser} showSpace={true} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'spaces' && (
              <div className="grid gap-4 md:grid-cols-2">
                {spaces.length === 0 ? (
                  <Card className="md:col-span-2">
                    <CardContent className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {user.username === currentUser?.primaryEmail?.split('@')[0]
                          ? "You haven't joined any spaces yet"
                          : `${user.displayName || user.username} hasn't joined any spaces yet`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  spaces.map((space) => (
                    <SpaceCard key={space.id} space={space} showJoinButton={false} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <UserProfileContent user={user} />}
    </AuthWrapper>
  )
}
