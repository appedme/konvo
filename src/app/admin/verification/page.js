'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  Eye,
  FileText,
  Calendar,
  AlertTriangle,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
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

export default function VerificationManagement() {
  const [verificationRequests, setVerificationRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', request: null })
  const [reviewReason, setReviewReason] = useState('')

  useEffect(() => {
    // Fetch verification requests
    const fetchRequests = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockRequests = [
          {
            id: 1,
            type: 'space',
            entityId: 1,
            entity: {
              name: 'AI Research Hub',
              slug: 'ai-research-hub',
              description: 'Advanced AI research and development community',
              memberCount: 567,
              postCount: 123,
              owner: {
                displayName: 'Dr. Sarah Chen',
                primaryEmail: 'sarah@airesearch.com',
                profileImageUrl: null
              }
            },
            requestedBy: {
              id: 1,
              displayName: 'Dr. Sarah Chen',
              primaryEmail: 'sarah@airesearch.com',
              profileImageUrl: null
            },
            requestedAt: '2024-01-18T10:30:00Z',
            status: 'pending',
            reason: 'We are a legitimate AI research community with verified researchers and published papers. Our community focuses on sharing cutting-edge research and fostering collaboration between academia and industry.',
            documents: [
              { name: 'University Affiliation Letter.pdf', url: '#' },
              { name: 'Research Publications.pdf', url: '#' },
              { name: 'Community Guidelines.pdf', url: '#' }
            ],
            priority: 'high'
          },
          {
            id: 2,
            type: 'user',
            entityId: 2,
            entity: {
              displayName: 'Mark Thompson',
              primaryEmail: 'mark@techcorp.com',
              profileImageUrl: null,
              bio: 'CEO of TechCorp, 15+ years in technology leadership',
              followerCount: 1245,
              postCount: 89
            },
            requestedBy: {
              id: 2,
              displayName: 'Mark Thompson',
              primaryEmail: 'mark@techcorp.com',
              profileImageUrl: null
            },
            requestedAt: '2024-01-19T14:15:00Z',
            status: 'pending',
            reason: 'I am the CEO of TechCorp, a publicly traded technology company. I have been featured in multiple tech publications and speak at industry conferences. I would like verification to establish credibility in tech discussions.',
            documents: [
              { name: 'LinkedIn Profile Verification.pdf', url: '#' },
              { name: 'Company Executive Bio.pdf', url: '#' },
              { name: 'Media Mentions.pdf', url: '#' }
            ],
            priority: 'medium'
          },
          {
            id: 3,
            type: 'space',
            entityId: 3,
            entity: {
              name: 'Crypto Trading Tips',
              slug: 'crypto-trading-tips',
              description: 'Daily crypto trading signals and market analysis',
              memberCount: 234,
              postCount: 56,
              owner: {
                displayName: 'CryptoGuru2024',
                primaryEmail: 'guru@cryptosignals.com',
                profileImageUrl: null
              }
            },
            requestedBy: {
              id: 5,
              displayName: 'CryptoGuru2024',
              primaryEmail: 'guru@cryptosignals.com',
              profileImageUrl: null
            },
            requestedAt: '2024-01-17T09:45:00Z',
            status: 'pending',
            reason: 'We provide the best crypto trading signals with 90%+ accuracy. Our premium members make thousands of dollars following our advice. We deserve verification for our proven track record.',
            documents: [
              { name: 'Trading Results.pdf', url: '#' }
            ],
            priority: 'low'
          },
          {
            id: 4,
            type: 'user',
            entityId: 6,
            entity: {
              displayName: 'Dr. Emily Watson',
              primaryEmail: 'emily@medschool.edu',
              profileImageUrl: null,
              bio: 'Professor of Medicine at Harvard Medical School',
              followerCount: 892,
              postCount: 67
            },
            requestedBy: {
              id: 6,
              displayName: 'Dr. Emily Watson',
              primaryEmail: 'emily@medschool.edu',
              profileImageUrl: null
            },
            requestedAt: '2024-01-20T11:20:00Z',
            status: 'pending',
            reason: 'I am a Professor of Medicine at Harvard Medical School with 20+ years of experience. I publish medical research and want to share verified medical information on this platform.',
            documents: [
              { name: 'University Faculty Page.pdf', url: '#' },
              { name: 'Medical License.pdf', url: '#' },
              { name: 'Published Research Papers.pdf', url: '#' }
            ],
            priority: 'high'
          }
        ]
        setVerificationRequests(mockRequests)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching verification requests:', error)
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleVerificationAction = async (action, request, reason = '') => {
    try {
      // Mock API call - implement actual API calls
      console.log(`${action} verification request:`, request.id, reason)

      // Update local state
      const updatedRequests = verificationRequests.map(r => {
        if (r.id === request.id) {
          return {
            ...r,
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewReason: reason
          }
        }
        return r
      })

      setVerificationRequests(updatedRequests)
      setActionDialog({ open: false, type: '', request: null })
      setReviewReason('')
    } catch (error) {
      console.error('Error processing verification request:', error)
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

  const pendingRequests = verificationRequests.filter(r => r.status === 'pending')
  const approvedRequests = verificationRequests.filter(r => r.status === 'approved')
  const rejectedRequests = verificationRequests.filter(r => r.status === 'rejected')

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
            Verification Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage verification requests for users and spaces
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-2">
            <Crown className="h-4 w-4" />
            {pendingRequests.length} pending
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
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{verificationRequests.length}</p>
              </div>
              <Crown className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Pending Verification Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-6 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      {request.type === 'user' ? (
                        <Users className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Globe className="h-6 w-6 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {request.type === 'user'
                            ? request.entity.displayName
                            : request.entity.name
                          }
                        </h3>
                        <Badge variant="outline">
                          {request.type === 'user' ? 'User' : 'Space'} Verification
                        </Badge>
                        {getPriorityBadge(request.priority)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Requested by {request.requestedBy.displayName} • {formatDate(request.requestedAt)}
                      </p>
                      {request.type === 'space' && (
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {request.entity.memberCount} members
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {request.entity.postCount} posts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Verification Reason:</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {request.reason}
                  </p>
                </div>

                {request.documents && request.documents.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Supporting Documents:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.documents.map((doc, index) => (
                        <Button key={index} variant="outline" size="sm" className="gap-2">
                          <FileText className="h-3 w-3" />
                          {doc.name}
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {request.type === 'space' ? (
                      <Link href={`/s/${request.entity.slug}`} className="hover:underline">
                        View Space →
                      </Link>
                    ) : (
                      <span>View User Profile →</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionDialog({ open: true, type: 'reject', request })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActionDialog({ open: true, type: 'approve', request })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                <p className="text-muted-foreground">
                  All verification requests have been processed.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      {(approvedRequests.length > 0 || rejectedRequests.length > 0) && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...approvedRequests, ...rejectedRequests]
                .sort((a, b) => new Date(b.reviewedAt || 0) - new Date(a.reviewedAt || 0))
                .slice(0, 5)
                .map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${request.status === 'approved'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        }`}>
                        {request.status === 'approved' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {request.type === 'user'
                            ? request.entity.displayName
                            : request.entity.name
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.type} verification {request.status}
                        </p>
                      </div>
                    </div>
                    <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' ? 'Approve Verification' : 'Reject Verification'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'approve'
                ? 'This will grant verification badge to the requester.'
                : 'This will reject the verification request.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reviewReason">
              {actionDialog.type === 'approve' ? 'Approval Notes (optional)' : 'Rejection Reason (required)'}
            </Label>
            <Textarea
              id="reviewReason"
              placeholder={
                actionDialog.type === 'approve'
                  ? 'Add any notes about this approval...'
                  : 'Explain why this request was rejected...'
              }
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, type: '', request: null })
                setReviewReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
              onClick={() => handleVerificationAction(actionDialog.type, actionDialog.request, reviewReason)}
              disabled={actionDialog.type === 'reject' && !reviewReason.trim()}
            >
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedRequest.type === 'user' ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <Globe className="h-5 w-5" />
                  )}
                  Verification Request Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedRequest.requestedBy.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {selectedRequest.requestedBy.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {selectedRequest.type === 'user'
                        ? selectedRequest.entity.displayName
                        : selectedRequest.entity.name
                      }
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {selectedRequest.type === 'user'
                        ? selectedRequest.entity.primaryEmail
                        : selectedRequest.entity.description
                      }
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline">
                        {selectedRequest.type === 'user' ? 'User' : 'Space'} Verification
                      </Badge>
                      {getPriorityBadge(selectedRequest.priority)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Request Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requested By:</span>
                      <p className="font-medium">{selectedRequest.requestedBy.displayName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Request Date:</span>
                      <p className="font-medium">{formatDate(selectedRequest.requestedAt)}</p>
                    </div>
                    {selectedRequest.type === 'space' && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Members:</span>
                          <p className="font-medium">{selectedRequest.entity.memberCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Posts:</span>
                          <p className="font-medium">{selectedRequest.entity.postCount}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Verification Reason</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                </div>

                {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Supporting Documents</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">{doc.name}</span>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(null)
                      setActionDialog({ open: true, type: 'reject', request: selectedRequest })
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedRequest(null)
                      setActionDialog({ open: true, type: 'approve', request: selectedRequest })
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
