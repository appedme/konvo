'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { CreatePost } from '@/components/posts/create-post'
import { PostCard } from '@/components/posts/post-card'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Users,
    MessageSquare,
    Settings,
    Crown,
    Globe,
    Lock,
    EyeOff,
    TrendingUp,
    Clock
} from 'lucide-react'
import Loading from '@/components/ui/loading'

function SpacePageContent({ user }) {
    const params = useParams()
    const slug = params.slug

    const [space, setSpace] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(true)
    const [sortBy, setSortBy] = useState('recent')
    const [isMember, setIsMember] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    // Check membership when space and user data are available
    useEffect(() => {
        if (space && user) {
            // Check if user is the owner
            const userIsOwner = space.owner && space.owner.username === user.primaryEmail.split('@')[0]
            setIsOwner(userIsOwner)
            
            // Check if user is a member (for now, owners are always members)
            // In the future, this can check the members array
            const userIsMember = userIsOwner || space.members?.some(member => 
                member.user.username === user.primaryEmail.split('@')[0]
            )
            setIsMember(userIsMember)
        }
    }, [space, user])

    const fetchSpace = useCallback(async () => {
        try {
            const response = await fetch(`/api/spaces/by-slug/${slug}`)
            if (response.ok) {
                const data = await response.json()
                setSpace(data.space)
                // Don't use server-side membership check for now
                // setIsMember(data.isMember)
            }
        } catch (error) {
            console.error('Error fetching space:', error)
        } finally {
            setLoading(false)
        }
    }, [slug])

    const fetchPosts = useCallback(async () => {
        try {
            setPostsLoading(true)
            const response = await fetch(`/api/posts?spaceId=${space?.id}&type=${sortBy}&limit=20`)
            if (response.ok) {
                const data = await response.json()
                setPosts(data.posts)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setPostsLoading(false)
        }
    }, [space?.id, sortBy])

    useEffect(() => {
        if (slug) {
            fetchSpace()
        }
    }, [slug, fetchSpace])

    useEffect(() => {
        if (space?.id) {
            fetchPosts()
        }
    }, [space?.id, sortBy, fetchPosts])

    const handleJoinSpace = async () => {
        if (!user || !space) return

        try {
            const response = await fetch(`/api/spaces/${space.id}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                setIsMember(true)
                // Refresh space data to update member count
                fetchSpace()
            }
        } catch (error) {
            console.error('Error joining space:', error)
        }
    }

    const handlePostCreated = () => {
        fetchPosts()
    }

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar user={user} />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!space) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar user={user} />
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="text-center py-8">
                            <h1 className="text-2xl font-bold mb-2">Space Not Found</h1>
                            <p className="text-muted-foreground">
                                The space you&apos;re looking for doesn&apos;t exist or may have been removed.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const SpaceIcon = getSpaceIcon(space.type)

    return (
        <div className="min-h-screen bg-background">
            <Navbar user={user} />
            <div className="container mx-auto px-4">
                <div className="flex gap-6">
                    <main className="flex-1 max-w-2xl mx-auto py-6 space-y-6">
                        {/* Space Header */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {space.name[0]?.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h1 className="text-2xl font-bold">s/{space.name}</h1>
                                            <SpaceIcon className="h-5 w-5 text-muted-foreground" />
                                            {space.owner && (
                                                <Crown className="h-4 w-4 text-yellow-500" title="Space Owner" />
                                            )}
                                        </div>

                                        {space.description && (
                                            <p className="text-muted-foreground mb-3">{space.description}</p>
                                        )}

                                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center space-x-1">
                                                <Users className="h-4 w-4" />
                                                <span>{space.memberCount?.toLocaleString() || 0} members</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{space.postCount?.toLocaleString() || 0} posts</span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {user && !isMember && (
                                                <Button onClick={handleJoinSpace}>
                                                    Join Space
                                                </Button>
                                            )}
                                            {user && isMember && (
                                                <Button variant="outline" disabled>
                                                    Joined
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sort Options */}
                        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
                            <Button
                                variant={sortBy === 'recent' ? 'default' : 'ghost'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setSortBy('recent')}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Recent
                            </Button>
                            <Button
                                variant={sortBy === 'popular' ? 'default' : 'ghost'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setSortBy('popular')}
                            >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Popular
                            </Button>
                        </div>

                        {/* Create Post */}
                        {user && isMember && (
                            <CreatePost user={user} spaceId={space.id} onPostCreated={handlePostCreated} />
                        )}

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {postsLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : posts.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            No posts in this space yet.
                                            {user && isMember && ' Be the first to share something!'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} user={user} showSpace={false} />
                                ))
                            )}
                        </div>
                    </main>

                    {/* Space Sidebar */}
                    <aside className="w-80 shrink-0 p-6 space-y-6">
                        {space.rules && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Rules</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap">{space.rules}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Created:</span>
                                    <br />
                                    {new Date(space.createdAt).toLocaleDateString()}
                                </div>

                                {space.owner && (
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Owner:</span>
                                        <br />
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={space.owner.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {space.owner.displayName?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{space.owner.displayName || space.owner.username}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default function SpacePage() {
    return (
        <AuthWrapper fallback={<Loading />}>
            {({ user }) => <SpacePageContent user={user} />}
        </AuthWrapper>
    )
}
