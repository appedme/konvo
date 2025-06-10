'use client'

import { Navbar } from '@/components/layout/navbar'
import { CreateSpaceDialog } from '@/components/spaces/create-space-dialog'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import Loading from '@/components/ui/loading'

function CreateSpaceContent({ user }) {
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to create a space.
              </p>
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
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
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create a Space</h1>
              <p className="text-muted-foreground">
                Build your community and start meaningful conversations
              </p>
            </div>
          </div>

          {/* Quick Create */}
          <div className="text-center">
            <CreateSpaceDialog
              user={user}
              trigger={
                <Button size="lg" className="px-8">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Space
                </Button>
              }
            />
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <span>Choose Your Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Public:</strong> Anyone can view and join</li>
                  <li>• <strong>Private:</strong> Invite only, posts need approval</li>
                  <li>• <strong>Unlisted:</strong> Anyone with link can join</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <span>Set Your Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Define community guidelines</li>
                  <li>• Set posting requirements</li>
                  <li>• Create a welcoming environment</li>
                  <li>• Moderate with your own style</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <span>Grow Your Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Invite friends and colleagues</li>
                  <li>• Share engaging content</li>
                  <li>• Foster meaningful discussions</li>
                  <li>• Build lasting connections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <span>Manage & Moderate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Add admins and moderators</li>
                  <li>• Review and approve posts</li>
                  <li>• Handle member requests</li>
                  <li>• Keep conversations healthy</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateSpacePage() {
  return (
    <AuthWrapper fallback={<Loading />}>
      {({ user }) => <CreateSpaceContent user={user} />}
    </AuthWrapper>
  )
}
