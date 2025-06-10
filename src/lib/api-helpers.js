import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

// Helper function to get or create user
export async function getOrCreateUser() {
    const user = await stackServerApp.getUser()
    if (!user) return null

    let dbUser = await prisma.user.findUnique({
        where: { stackId: user.id }
    })

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                stackId: user.id,
                email: user.primaryEmail,
                username: user.primaryEmail.split('@')[0],
                displayName: user.displayName,
                avatar: user.profileImageUrl,
            }
        })
    }

    return dbUser
}

// Helper function for error responses
export function errorResponse(message, status = 500) {
    return NextResponse.json({ error: message }, { status })
}

// Helper function for success responses
export function successResponse(data, status = 200) {
    return NextResponse.json(data, { status })
}
