'use client'

import { SignUp } from "@stackframe/stack";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                        <span className="text-2xl font-bold">Konvo</span>
                    </Link>
                    <p className="text-muted-foreground">Join the conversation</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SignUp />
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
