'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Globe,
  Crown,
  Users,
  MessageSquare,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  Star,
  AlertTriangle,
  Ban,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default function SpaceManagement() {
  const [spaces, setSpaces] = useState([])
  const [filteredSpaces, setFilteredSpaces] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', space: null })

  useEffect(() => {
    // Fetch spaces data
    const fetchSpaces = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockSpaces = [
          {
            id: 1,
            name: 'Tech Talk',
            slug: 'tech-talk',
            description: 'Discussion about the latest in technology and programming',
            isVerified: true,
            isFeatured: true,
            isPrivate: false,
            isBanned: false,
            createdAt: '2024-01-10T10:00:00Z',
            memberCount: 1247,
            postCount: 89,
            owner: {
              id: 1,
              displayName: 'John Doe',
              primaryEmail: 'john.doe@example.com'
            },
            moderatorCount: 3,
            category: 'Technology',
            growthRate: '+15%'
          },
          {
            id: 2,
            name: 'Design Hub',
            slug: 'design-hub',
            description: 'A place for designers to share ideas and get feedback',
            isVerified: false,
            isFeatured: false,
            isPrivate: false,
            isBanned: false,
            createdAt: '2024-01-12T14:30:00Z',
            memberCount: 423,
            postCount: 67,
            owner: {
              id: 2,
              displayName: 'Jane Smith',
              primaryEmail: 'jane.smith@example.com'
            },
            moderatorCount: 1,
            category: 'Creative',
            growthRate: '+8%'
          },
          {
            id: 3,
            name: 'Startup Founders',
            slug: 'startup-founders',
            description: 'Network for startup founders and entrepreneurs',
            isVerified: true,
            isFeatured: false,
            isPrivate: true,
            isBanned: false,
            createdAt: '2024-01-08T09:15:00Z',
            memberCount: 156,
            postCount: 34,
            owner: {
              id: 3,
              displayName: 'Mike Johnson',
              primaryEmail: 'mike@startup.com'
            },
            moderatorCount: 2,
            category: 'Business',
            growthRate: '+22%'
          },
          {
            id: 4,
            name: 'Spam Space',
            slug: 'spam-space',
            description: 'This space was used for spam and inappropriate content',
            isVerified: false,
            isFeatured: false,
            isPrivate: false,
            isBanned: true,
            createdAt: '2024-01-15T16:45:00Z',
            memberCount: 23,
            postCount: 12,
            owner: {
              id: 4,
              displayName: 'Spammer User',
              primaryEmail: 'spam@example.com'
            },
            moderatorCount: 0,
            category: 'Other',
            growthRate: '-50%'
          }
        ]
        setSpaces(mockSpaces)
        setFilteredSpaces(mockSpaces)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching spaces:', error)
        setIsLoading(false)
      }
    }

    fetchSpaces()
  }, [])

  useEffect(() => {
    // Filter spaces based on search and status
    let filtered = spaces.filter(space => {
      const matchesSearch =
        space.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.category?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'verified' && space.isVerified) ||
        (filterStatus === 'unverified' && !space.isVerified) ||
        (filterStatus === 'featured' && space.isFeatured) ||
        (filterStatus === 'private' && space.isPrivate) ||
        (filterStatus === 'banned' && space.isBanned) ||
        (filterStatus === 'active' && !space.isBanned)

      return matchesSearch && matchesStatus
    })

    setFilteredSpaces(filtered)
  }, [spaces, searchQuery, filterStatus])

  const handleSpaceAction = async (action, space, reason = '') => {
    try {
      // Mock API call - implement actual API calls
      console.log(`${action} space:`, space.id, reason)

      // Update local state
      const updatedSpaces = spaces.map(s => {
        if (s.id === space.id) {
          switch (action) {
            case 'verify':
              return { ...s, isVerified: true }
            case 'unverify':
              return { ...s, isVerified: false }
            case 'feature':
              return { ...s, isFeatured: true }
            case 'unfeature':
              return { ...s, isFeatured: false }
            case 'ban':
              return { ...s, isBanned: true }
            case 'unban':
              return { ...s, isBanned: false }
            default:
              return s
          }
        }
        return s
      })

      setSpaces(updatedSpaces)
      setActionDialog({ open: false, type: '', space: null })
    } catch (error) {
      console.error('Error performing space action:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Space Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage communities, verification, and moderation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            {spaces.length} total spaces
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spaces</p>
                <p className="text-2xl font-bold text-blue-600">{spaces.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {spaces.filter(s => s.isVerified).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {spaces.filter(s => s.isFeatured).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Banned</p>
                <p className="text-2xl font-bold text-red-600">
                  {spaces.filter(s => s.isBanned).length}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search spaces by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('verified')}
              >
                Verified
              </Button>
              <Button
                variant={filterStatus === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('featured')}
              >
                Featured
              </Button>
              <Button
                variant={filterStatus === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('private')}
              >
                Private
              </Button>
              <Button
                variant={filterStatus === 'banned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('banned')}
              >
                Banned
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spaces Table */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Spaces ({filteredSpaces.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSpaces.map((space) => (
              <div key={space.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {space.name[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Link href={`/s/${space.slug}`} className="hover:underline">
                        <h3 className="font-medium truncate">{space.name}</h3>
                      </Link>
                      <div className="flex items-center space-x-1">
                        {space.isVerified && (
                          <Badge className="bg-blue-500 text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {space.isFeatured && (
                          <Badge className="bg-yellow-500 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {space.isPrivate && (
                          <Badge variant="secondary" className="text-xs">Private</Badge>
                        )}
                        {space.isBanned && (
                          <Badge variant="destructive" className="text-xs">Banned</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {space.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Owner: {space.owner.displayName}</span>
                      <span>Category: {space.category}</span>
                      <span>Created: {formatDate(space.createdAt)}</span>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {space.memberCount.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground text-xs">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {space.postCount}
                      </div>
                      <div className="text-muted-foreground text-xs">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium flex items-center ${space.growthRate.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {space.growthRate}
                      </div>
                      <div className="text-muted-foreground text-xs">Growth</div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/s/${space.slug}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Space
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {!space.isVerified ? (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'verify', space })}
                        className="text-blue-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Space
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'unverify', space })}
                        className="text-yellow-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove Verification
                      </DropdownMenuItem>
                    )}

                    {!space.isFeatured ? (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'feature', space })}
                        className="text-yellow-600"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Feature Space
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'unfeature', space })}
                        className="text-orange-600"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Remove Featured
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {!space.isBanned ? (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'ban', space })}
                        className="text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Ban Space
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'unban', space })}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Unban Space
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => setActionDialog({ open: true, type: 'delete', space })}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Space
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {filteredSpaces.length === 0 && (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No spaces found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'verify' && 'Verify Space'}
              {actionDialog.type === 'unverify' && 'Remove Verification'}
              {actionDialog.type === 'feature' && 'Feature Space'}
              {actionDialog.type === 'unfeature' && 'Remove Featured Status'}
              {actionDialog.type === 'ban' && 'Ban Space'}
              {actionDialog.type === 'unban' && 'Unban Space'}
              {actionDialog.type === 'delete' && 'Delete Space'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'verify' && 'Grant verification badge to this space?'}
              {actionDialog.type === 'unverify' && 'Remove verification badge from this space?'}
              {actionDialog.type === 'feature' && 'Add this space to the featured list?'}
              {actionDialog.type === 'unfeature' && 'Remove this space from the featured list?'}
              {actionDialog.type === 'ban' && 'Ban this space? Users will not be able to post or access it.'}
              {actionDialog.type === 'unban' && 'Restore access to this space?'}
              {actionDialog.type === 'delete' && 'Permanently delete this space? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          {(actionDialog.type === 'ban' || actionDialog.type === 'delete') && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason {actionDialog.type === 'delete' ? '(required)' : '(optional)'}</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: '', space: null })}
            >
              Cancel
            </Button>
            <Button
              variant={['ban', 'delete'].includes(actionDialog.type) ? 'destructive' : 'default'}
              onClick={() => handleSpaceAction(actionDialog.type, actionDialog.space)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
