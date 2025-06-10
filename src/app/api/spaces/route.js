import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.space.findUnique({
      where: { slug }
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function POST(request) {
  try {
    const user = await stackServerApp.getUser({ request })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, type = 'PUBLIC', rules } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Space name is required' }, { status: 400 })
    }

    if (!['PUBLIC', 'PRIVATE', 'UNLISTED'].includes(type)) {
      return NextResponse.json({ error: 'Invalid space type' }, { status: 400 })
    }

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

    // Generate unique slug
    const baseSlug = generateSlug(name.trim())
    const slug = await ensureUniqueSlug(baseSlug)

    // Create space
    const space = await prisma.space.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim(),
        type,
        rules: rules?.trim(),
        ownerId: dbUser.id,
        memberCount: 1
      }
    })

    // Add creator as owner member
    await prisma.spaceMember.create({
      data: {
        userId: dbUser.id,
        spaceId: space.id,
        role: 'OWNER'
      }
    })

    return NextResponse.json(space)
  } catch (error) {
    console.error('Error creating space:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const type = searchParams.get('type') // 'popular', 'recent', 'joined'

    const skip = (page - 1) * limit

    let where = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Only show public and unlisted spaces for general listing
    if (type !== 'joined') {
      where.type = { in: ['PUBLIC', 'UNLISTED'] }
    }

    let orderBy = { createdAt: 'desc' }

    if (type === 'popular') {
      orderBy = { memberCount: 'desc' }
    }

    const spaces = await prisma.space.findMany({
      where,
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
      },
      orderBy,
      skip,
      take: limit,
    })

    const total = await prisma.space.count({ where })

    return NextResponse.json({
      spaces,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
