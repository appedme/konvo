'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Users,
  Shield,
  Crown,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  AlertTriangle
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', user: null })

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockUsers = [
          {
            id: 1,
            displayName: 'John Doe',
            primaryEmail: 'john.doe@example.com',
            profileImageUrl: null,
            isVerified: true,
            isAdmin: false,
            isBanned: false,
            createdAt: '2024-01-15T10:30:00Z',
            lastActive: '2024-01-20T14:45:00Z',
            postCount: 24,
            spaceCount: 3,
            reputation: 450
          },
          {
            id: 2,
            displayName: 'Jane Smith',
            primaryEmail: 'jane.smith@example.com',
            profileImageUrl: null,
            isVerified: false,
            isAdmin: false,
            isBanned: false,
            createdAt: '2024-01-10T08:15:00Z',
            lastActive: '2024-01-19T16:20:00Z',
            postCount: 12,
            spaceCount: 1,
            reputation: 180
          },
          {
            id: 3,
            displayName: 'Admin User',
            primaryEmail: 'admin@konvo.com',
            profileImageUrl: null,
            isVerified: true,
            isAdmin: true,
            isBanned: false,
            createdAt: '2024-01-01T00:00:00Z',
            lastActive: '2024-01-20T18:00:00Z',
            postCount: 5,
            spaceCount: 0,
            reputation: 1000
          },
          {
            id: 4,
            displayName: 'Suspended User',
            primaryEmail: 'suspended@example.com',
            profileImageUrl: null,
            isVerified: false,
            isAdmin: false,
            isBanned: true,
            createdAt: '2024-01-12T14:22:00Z',
            lastActive: '2024-01-18T10:10:00Z',
            postCount: 8,
            spaceCount: 0,
            reputation: 45
          }
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error)
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search and status
    let filtered = users.filter(user => {
      const matchesSearch =
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.primaryEmail?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'verified' && user.isVerified) ||
        (filterStatus === 'unverified' && !user.isVerified) ||
        (filterStatus === 'admin' && user.isAdmin) ||
        (filterStatus === 'banned' && user.isBanned) ||
        (filterStatus === 'active' && !user.isBanned)

      return matchesSearch && matchesStatus
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, filterStatus])

  const handleUserAction = async (action, user, reason = '') => {
    try {
      // Mock API call - implement actual API calls
      console.log(`${action} user:`, user.id, reason)

      // Update local state
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          switch (action) {
            case 'verify':
              return { ...u, isVerified: true }
            case 'unverify':
              return { ...u, isVerified: false }
            case 'ban':
              return { ...u, isBanned: true }
            case 'unban':
              return { ...u, isBanned: false }
            case 'promote':
              return { ...u, isAdmin: true }
            case 'demote':
              return { ...u, isAdmin: false }
            default:
              return u
          }
        }
        return u
      })

      setUsers(updatedUsers)
      setActionDialog({ open: false, type: '', user: null })
    } catch (error) {
      console.error('Error performing user action:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUserStatusColor = (user) => {
    if (user.isBanned) return 'text-red-500'
    if (user.isAdmin) return 'text-purple-500'
    if (user.isVerified) return 'text-blue-500'
    return 'text-muted-foreground'
  }

  const getUserStatusBadge = (user) => {
    if (user.isBanned) return <Badge variant="destructive">Banned</Badge>
    if (user.isAdmin) return <Badge className="bg-purple-500">Admin</Badge>
    if (user.isVerified) return <Badge className="bg-blue-500">Verified</Badge>
    return <Badge variant="secondary">Active</Badge>
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
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, permissions, and verification status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            {users.length} total users
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isVerified).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.isAdmin).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Banned</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.isBanned).length}
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
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
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
                variant={filterStatus === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('admin')}
              >
                Admin
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

      {/* Users Table */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{user.displayName || 'Unnamed User'}</h3>
                      {getUserStatusBadge(user)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.primaryEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{user.postCount}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{user.spaceCount}</div>
                      <div className="text-muted-foreground">Spaces</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{user.reputation}</div>
                      <div className="text-muted-foreground">Rep</div>
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
                    <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {!user.isVerified ? (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'verify', user })}
                        className="text-blue-600"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Verify User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'unverify', user })}
                        className="text-yellow-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove Verification
                      </DropdownMenuItem>
                    )}

                    {!user.isAdmin && (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'promote', user })}
                        className="text-purple-600"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                    )}

                    {user.isAdmin && (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'demote', user })}
                        className="text-orange-600"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Remove Admin
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {!user.isBanned ? (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'ban', user })}
                        className="text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setActionDialog({ open: true, type: 'unban', user })}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Unban User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
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
              {actionDialog.type === 'verify' && 'Verify User'}
              {actionDialog.type === 'unverify' && 'Remove Verification'}
              {actionDialog.type === 'ban' && 'Ban User'}
              {actionDialog.type === 'unban' && 'Unban User'}
              {actionDialog.type === 'promote' && 'Promote to Admin'}
              {actionDialog.type === 'demote' && 'Remove Admin Role'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'verify' && 'Grant verification badge to this user?'}
              {actionDialog.type === 'unverify' && 'Remove verification badge from this user?'}
              {actionDialog.type === 'ban' && 'Ban this user from the platform? They will not be able to post or comment.'}
              {actionDialog.type === 'unban' && 'Restore this user\'s access to the platform?'}
              {actionDialog.type === 'promote' && 'Grant administrator privileges to this user?'}
              {actionDialog.type === 'demote' && 'Remove administrator privileges from this user?'}
            </DialogDescription>
          </DialogHeader>

          {(actionDialog.type === 'ban' || actionDialog.type === 'demote') && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
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
              onClick={() => setActionDialog({ open: false, type: '', user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'ban' ? 'destructive' : 'default'}
              onClick={() => handleUserAction(actionDialog.type, actionDialog.user)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
