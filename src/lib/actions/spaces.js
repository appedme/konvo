'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@stackframe/stack'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createSpaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().max(500, 'Description too long').optional(),
  type: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
  welcomeMessage: z.string().max(1000, 'Welcome message too long').optional(),
})

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const user = await auth.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// Create a new space
export async function createSpace(formData) {
  try {
    const user = await getAuthenticatedUser()
    
    const validatedData = createSpaceSchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description') || undefined,
      type: formData.get('type') || 'PUBLIC',
      welcomeMessage: formData.get('welcomeMessage') || undefined,
    })

    // Check if slug is already taken
    const existingSpace = await prisma.space.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingSpace) {
      return { success: false, error: 'This space name is already taken' }
    }

    // Create space and add creator as admin
    const space = await prisma.$transaction(async (tx) => {
      const newSpace = await tx.space.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          type: validatedData.type,
          welcomeMessage: validatedData.welcomeMessage,
          creatorId: user.id,
        },
      })

      // Add creator as admin member
      await tx.spaceMembership.create({
        data: {
          spaceId: newSpace.id,
          userId: user.id,
          role: 'ADMIN',
        },
      })

      return newSpace
    })

    revalidatePath('/spaces')
    revalidatePath('/')
    
    return { success: true, space }
  } catch (error) {
    console.error('Error creating space:', error)
    return { success: false, error: error.message }
  }
}

// Join a space
export async function joinSpace(spaceId) {
  try {
    const user = await getAuthenticatedUser()

    // Check if space exists and is joinable
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    })

    if (!space) {
      return { success: false, error: 'Space not found' }
    }

    if (space.type === 'PRIVATE') {
      return { success: false, error: 'This space is private and requires an invitation' }
    }

    // Check if already a member
    const existingMembership = await prisma.spaceMembership.findFirst({
      where: {
        spaceId,
        userId: user.id,
      },
    })

    if (existingMembership) {
      return { success: false, error: 'You are already a member of this space' }
    }

    // Create membership
    await prisma.spaceMembership.create({
      data: {
        spaceId,
        userId: user.id,
        role: 'MEMBER',
      },
    })

    revalidatePath('/s/[slug]', 'page')
    revalidatePath('/spaces')

    return { success: true }
  } catch (error) {
    console.error('Error joining space:', error)
    return { success: false, error: error.message }
  }
}

// Leave a space
export async function leaveSpace(spaceId) {
  try {
    const user = await getAuthenticatedUser()

    // Check if user is a member
    const membership = await prisma.spaceMembership.findFirst({
      where: {
        spaceId,
        userId: user.id,
      },
    })

    if (!membership) {
      return { success: false, error: 'You are not a member of this space' }
    }

    // Don't allow creator to leave (they need to transfer ownership first)
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    })

    if (space?.creatorId === user.id) {
      return { success: false, error: 'Space creators cannot leave. Transfer ownership first.' }
    }

    // Remove membership
    await prisma.spaceMembership.delete({
      where: { id: membership.id },
    })

    revalidatePath('/s/[slug]', 'page')
    revalidatePath('/spaces')

    return { success: true }
  } catch (error) {
    console.error('Error leaving space:', error)
    return { success: false, error: error.message }
  }
}

// Get spaces with filtering and pagination
export async function getSpaces(options = {}) {
  try {
    const { 
      type = 'all', 
      search, 
      limit = 20, 
      cursor,
      userId // Get spaces user is member of
    } = options

    const where = {}
    
    // Filter by type
    if (type !== 'all') {
      where.type = type.toUpperCase()
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // User membership filter
    if (userId) {
      where.members = {
        some: {
          userId,
        },
      }
    }

    const spaces = await prisma.space.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    })

    const spacesWithCounts = spaces.map(space => ({
      ...space,
      memberCount: space._count.members,
      postCount: space._count.posts,
      _count: undefined,
    }))

    return { success: true, spaces: spacesWithCounts }
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return { success: false, error: error.message }
  }
}

// Get space by slug
export async function getSpaceBySlug(slug) {
  try {
    const space = await prisma.space.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    })

    if (!space) {
      return { success: false, error: 'Space not found' }
    }

    const spaceWithCounts = {
      ...space,
      memberCount: space._count.members,
      postCount: space._count.posts,
      _count: undefined,
    }

    return { success: true, space: spaceWithCounts }
  } catch (error) {
    console.error('Error fetching space:', error)
    return { success: false, error: error.message }
  }
}
