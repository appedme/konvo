'use client'

import { useUser } from '@stackframe/stack'
import { Suspense } from 'react'
import Loading from '@/components/ui/loading'

function AuthContent({ children }) {
    const user = useUser()

    return children({ user })
}

export function AuthWrapper({ children, fallback }) {
    return (
        <Suspense fallback={fallback || <Loading />}>
            <AuthContent>
                {children}
            </AuthContent>
        </Suspense>
    )
}
