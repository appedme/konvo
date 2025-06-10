import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
    try {
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: spaceId } = await params

        // Get or create user in our database
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

        // Check if space exists
        const space = await prisma.space.findUnique({
            where: { id: spaceId }
        })

        if (!space) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 })
        }

        // Check if user is already a member
        const existingMembership = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId: dbUser.id,
                    spaceId: spaceId
                }
            }
        })

        if (existingMembership) {
            return NextResponse.json({ error: 'Already a member' }, { status: 400 })
        }

        // Create membership
        await prisma.spaceMember.create({
            data: {
                userId: dbUser.id,
                spaceId: spaceId,
                role: 'MEMBER'
            }
        })

        // Update space member count
        await prisma.space.update({
            where: { id: spaceId },
            data: { memberCount: { increment: 1 } }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error joining space:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
