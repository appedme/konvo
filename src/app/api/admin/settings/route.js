import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/stack'

export async function GET(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get all system settings grouped by category
    const settings = await prisma.systemSetting.findMany({
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    })

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push({
        key: setting.key,
        value: setting.value,
        type: setting.type,
        description: setting.description
      })
      return acc
    }, {})

    return NextResponse.json({ settings: groupedSettings })

  } catch (error) {
    console.error('Admin settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await getUser(request)
    
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { settings } = await request.json()

    // Update settings in transaction
    const updateOperations = Object.entries(settings).map(([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: {
          value: String(value),
          updatedBy: user.id
        },
        create: {
          key,
          value: String(value),
          category: inferCategory(key),
          type: inferType(value),
          updatedBy: user.id
        }
      })
    })

    await prisma.$transaction([
      ...updateOperations,
      prisma.activityLog.create({
        data: {
          action: 'SETTINGS_UPDATE',
          entityType: 'system',
          details: { updatedKeys: Object.keys(settings) },
          userId: user.id
        }
      })
    ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function inferCategory(key) {
  if (key.includes('security') || key.includes('auth') || key.includes('password')) {
    return 'security'
  }
  if (key.includes('content') || key.includes('post') || key.includes('comment')) {
    return 'content'
  }
  if (key.includes('notification') || key.includes('email')) {
    return 'notifications'
  }
  return 'general'
}

function inferType(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'object') return 'json'
  return 'string'
}
