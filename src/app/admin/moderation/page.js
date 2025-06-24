'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Flag,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Calendar,
  MoreHorizontal,
  Trash2,
  Ban,
  Clock
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

export default function ContentModeration() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', report: null })
  const [actionReason, setActionReason] = useState('')

  useEffect(() => {
    // Fetch moderation reports
    const fetchReports = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockReports = [
          {
            id: 1,
            type: 'post',
            status: 'pending',
            reportedAt: '2024-01-20T14:30:00Z',
            reporter: {
              id: 1,
              displayName: 'John Doe',
              primaryEmail: 'john@example.com'
            },
            reportedContent: {
              id: 101,
              type: 'post',
              content: 'This is spam content promoting fake products and services. Click here to buy fake stuff!',
              author: {
                id: 2,
                displayName: 'Spammer User',
                primaryEmail: 'spam@fake.com'
              },
              createdAt: '2024-01-20T12:00:00Z'
            },
            reason: 'spam',
            description: 'This post is clearly spam promoting fake products',
            priority: 'high'
          },
          {
            id: 2,
            type: 'comment',
            status: 'pending',
            reportedAt: '2024-01-20T13:15:00Z',
            reporter: {
              id: 3,
              displayName: 'Jane Smith',
              primaryEmail: 'jane@example.com'
            },
            reportedContent: {
              id: 102,
              type: 'comment',
              content: 'You are an idiot! This platform sucks and everyone here is stupid!',
              author: {
                id: 4,
                displayName: 'Angry User',
                primaryEmail: 'angry@user.com'
              },
              createdAt: '2024-01-20T11:30:00Z'
            },
            reason: 'harassment',
            description: 'Inappropriate language and harassment',
            priority: 'medium'
          },
          {
            id: 3,
            type: 'user',
            status: 'pending',
            reportedAt: '2024-01-19T16:45:00Z',
            reporter: {
              id: 5,
              displayName: 'Community Moderator',
              primaryEmail: 'mod@example.com'
            },
            reportedContent: {
              id: 103,
              type: 'user',
              displayName: 'Inappropriate Username',
              primaryEmail: 'inappropriate@user.com',
              profileDescription: 'Promoting hate speech and inappropriate content'
            },
            reason: 'inappropriate_profile',
            description: 'Username and profile contain inappropriate content',
            priority: 'high'
          },
          {
            id: 4,
            type: 'post',
            status: 'resolved',
            reportedAt: '2024-01-18T10:20:00Z',
            resolvedAt: '2024-01-18T15:30:00Z',
            resolution: 'content_removed',
            reporter: {
              id: 6,
              displayName: 'Alert User',
              primaryEmail: 'alert@example.com'
            },
            reportedContent: {
              id: 104,
              type: 'post',
              content: '[REMOVED]',
              author: {
                id: 7,
                displayName: 'Former User',
                primaryEmail: 'former@user.com'
              },
              createdAt: '2024-01-18T09:00:00Z'
            },
            reason: 'hate_speech',
            description: 'Content contained hate speech',
            priority: 'high'
          }
        ]
        setReports(mockReports)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching reports:', error)
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleModerationAction = async (action, report, reason = '') => {
    try {
      // Mock API call - implement actual moderation actions
      console.log(`${action} report:`, report.id, reason)

      // Update local state
      const updatedReports = reports.map(r => {
        if (r.id === report.id) {
          return {
            ...r,
            status: action === 'approve' ? 'resolved' : 'dismissed',
            resolvedAt: new Date().toISOString(),
            resolution: action,
            resolutionReason: reason
          }
        }
        return r
      })

      setReports(updatedReports)
      setActionDialog({ open: false, type: '', report: null })
      setActionReason('')
    } catch (error) {
      console.error('Error performing moderation action:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReasonBadge = (reason) => {
    const reasonColors = {
      spam: 'bg-red-500',
      harassment: 'bg-orange-500',
      inappropriate_content: 'bg-yellow-500',
      hate_speech: 'bg-red-600',
      inappropriate_profile: 'bg-purple-500',
      copyright: 'bg-blue-500',
      other: 'bg-gray-500'
    }

    return (
      <Badge className={reasonColors[reason] || reasonColors.other}>
        {reason.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Priority</Badge>
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'all') return true
    return report.status === filterStatus
  })

  const pendingReports = reports.filter(r => r.status === 'pending')
  const resolvedReports = reports.filter(r => r.status === 'resolved')
  const dismissedReports = reports.filter(r => r.status === 'dismissed')

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
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and moderate reported content
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-2">
            <Flag className="h-4 w-4" />
            {pendingReports.length} pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReports.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedReports.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dismissed</p>
                <p className="text-2xl font-bold text-blue-600">{dismissedReports.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-red-600">{reports.length}</p>
              </div>
              <Flag className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All Reports
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingReports.length})
            </Button>
            <Button
              variant={filterStatus === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('resolved')}
            >
              Resolved
            </Button>
            <Button
              variant={filterStatus === 'dismissed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('dismissed')}
            >
              Dismissed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-6 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20">
                      <Flag className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                        </h3>
                        {getReasonBadge(report.reason)}
                        {getPriorityBadge(report.priority)}
                        <Badge variant={report.status === 'pending' ? 'secondary' :
                          report.status === 'resolved' ? 'default' : 'outline'}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Reported by {report.reporter.displayName} • {formatDate(report.reportedAt)}
                      </p>
                      <p className="text-sm">{report.description}</p>
                    </div>
                  </div>
                  {report.status === 'pending' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: 'approve', report })}>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Take Action
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: 'dismiss', report })}>
                          <XCircle className="h-4 w-4 mr-2 text-blue-600" />
                          Dismiss Report
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="h-4 w-4 mr-2" />
                          Ban Reporter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Reported Content */}
                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Reported Content</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {report.reportedContent.type === 'user' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                      <span>by {report.reportedContent.author?.displayName || report.reportedContent.displayName}</span>
                      {report.reportedContent.createdAt && (
                        <span>• {formatDate(report.reportedContent.createdAt)}</span>
                      )}
                    </div>
                  </div>

                  {report.reportedContent.type === 'user' ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {report.reportedContent.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{report.reportedContent.displayName}</p>
                        <p className="text-sm text-muted-foreground">{report.reportedContent.primaryEmail}</p>
                        {report.reportedContent.profileDescription && (
                          <p className="text-sm mt-1">{report.reportedContent.profileDescription}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {report.reportedContent.author.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{report.reportedContent.author.displayName}</span>
                      </div>
                      <p className="text-sm bg-background/50 p-3 rounded">
                        {report.reportedContent.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resolution Info */}
                {report.status !== 'pending' && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {report.status === 'resolved' ? 'Resolved' : 'Dismissed'} on {formatDate(report.resolvedAt)}
                      </span>
                      {report.resolution && (
                        <Badge variant="outline">{report.resolution.replace('_', ' ')}</Badge>
                      )}
                    </div>
                    {report.resolutionReason && (
                      <p className="text-sm text-muted-foreground mt-2">{report.resolutionReason}</p>
                    )}
                  </div>
                )}

                {/* Pending Actions */}
                {report.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionDialog({ open: true, type: 'dismiss', report })}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActionDialog({ open: true, type: 'approve', report })}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <Flag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {filterStatus === 'pending'
                    ? 'All reports have been reviewed.'
                    : 'No reports match the selected filter.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' ? 'Take Moderation Action' : 'Dismiss Report'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'approve'
                ? 'Choose an action to take on the reported content.'
                : 'This report will be marked as dismissed.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="actionReason">
              {actionDialog.type === 'approve' ? 'Action Details' : 'Dismissal Reason'}
            </Label>
            <Textarea
              id="actionReason"
              placeholder={
                actionDialog.type === 'approve'
                  ? 'Describe the action taken...'
                  : 'Explain why this report was dismissed...'
              }
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, type: '', report: null })
                setActionReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'approve' ? 'destructive' : 'default'}
              onClick={() => handleModerationAction(actionDialog.type, actionDialog.report, actionReason)}
            >
              {actionDialog.type === 'approve' ? 'Take Action' : 'Dismiss'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
