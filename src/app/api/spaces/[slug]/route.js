import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
    try {
        const slug = params.slug

        const space = await prisma.space.findUnique({
            where: { slug },
            include: {
                owner: {
                    select: {
                        username: true,
                        displayName: true,
                        avatar: true,
                    }
                },
                _count: {
                    select: {
                        members: true,
                        posts: true,
                    }
                }
            }
        })

        if (!space) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 })
        }

        // Check if current user is a member
        let isMember = false
        const user = await stackServerApp.getUser()

        if (user) {
            const dbUser = await prisma.user.findUnique({
                where: { stackId: user.id }
            })

            if (dbUser) {
                const membership = await prisma.spaceMember.findUnique({
                    where: {
                        userId_spaceId: {
                            userId: dbUser.id,
                            spaceId: space.id
                        }
                    }
                })
                isMember = !!membership
            }
        }

        // Don't show private spaces to non-members
        if (space.type === 'PRIVATE' && !isMember) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 })
        }

        return NextResponse.json({
            space: {
                ...space,
                memberCount: space._count.members,
                postCount: space._count.posts
            },
            isMember
        })
    } catch (error) {
        console.error('Error fetching space:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
