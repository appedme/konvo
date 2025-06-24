const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@konvo.com' },
      update: {},
      create: {
        stackId: 'admin-stack-id',
        email: 'admin@konvo.com',
        username: 'admin',
        displayName: 'Admin User',
        role: 'SUPER_ADMIN',
        verified: true,
        level: 10,
        totalUpvotes: 500,
        postCount: 25,
        commentCount: 150
      }
    }),
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        stackId: 'john-stack-id',
        email: 'john@example.com',
        username: 'john_doe',
        displayName: 'John Doe',
        role: 'USER',
        verified: false,
        level: 3,
        totalUpvotes: 45,
        postCount: 12,
        commentCount: 38
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        stackId: 'jane-stack-id',
        email: 'jane@example.com',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        role: 'USER',
        verified: true,
        level: 5,
        totalUpvotes: 120,
        postCount: 18,
        commentCount: 67
      }
    }),
    prisma.user.upsert({
      where: { email: 'moderator@konvo.com' },
      update: {},
      create: {
        stackId: 'mod-stack-id',
        email: 'moderator@konvo.com',
        username: 'moderator',
        displayName: 'Moderator User',
        role: 'ADMIN',
        verified: true,
        level: 8,
        totalUpvotes: 300,
        postCount: 20,
        commentCount: 95
      }
    })
  ])

  console.log('✅ Users created:', users.length)

  // Create sample spaces
  const spaces = await Promise.all([
    prisma.space.upsert({
      where: { slug: 'tech-talk' },
      update: {},
      create: {
        name: 'Tech Talk',
        slug: 'tech-talk',
        description: 'Discuss the latest in technology and programming',
        type: 'PUBLIC',
        verified: true,
        memberCount: 1250,
        postCount: 340,
        ownerId: users[1].id
      }
    }),
    prisma.space.upsert({
      where: { slug: 'design-inspiration' },
      update: {},
      create: {
        name: 'Design Inspiration',
        slug: 'design-inspiration',
        description: 'Share and discover amazing design work',
        type: 'PUBLIC',
        verified: false,
        memberCount: 890,
        postCount: 156,
        ownerId: users[2].id
      }
    }),
    prisma.space.upsert({
      where: { slug: 'startup-founders' },
      update: {},
      create: {
        name: 'Startup Founders',
        slug: 'startup-founders',
        description: 'Connect with fellow entrepreneurs and founders',
        type: 'PRIVATE',
        verified: true,
        featured: true,
        memberCount: 450,
        postCount: 89,
        ownerId: users[1].id
      }
    })
  ])

  console.log('✅ Spaces created:', spaces.length)

  // Create sample verification requests
  await prisma.verificationRequest.create({
    data: {
      type: 'user',
      status: 'PENDING',
      requestReason: 'I am a recognized expert in web development with 10+ years of experience',
      userId: users[1].id
    }
  })

  await prisma.verificationRequest.create({
    data: {
      type: 'space',
      status: 'PENDING',
      requestReason: 'This is the official community for our open-source project with 10k+ GitHub stars',
      spaceId: spaces[1].id
    }
  })

  console.log('✅ Verification requests created')

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to Tech Talk!',
      content: 'This is our first post in the Tech Talk space. Let\'s discuss the latest in web development, AI, and emerging technologies. What are you most excited about in tech right now?',
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: users[1].id,
      spaceId: spaces[0].id,
      upvotes: 15,
      downvotes: 2,
      score: 13
    },
    {
      title: 'Best Design Tools for 2024',
      content: 'I\'ve been exploring different design tools and wanted to share my findings. Figma remains king, but Framer and Linear are catching up fast. What are your favorite design tools?',
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: users[2].id,
      spaceId: spaces[1].id,
      upvotes: 8,
      downvotes: 1,
      score: 7
    },
    {
      title: 'The Future of Startups',
      content: 'AI is changing everything. As founders, how are we adapting our business models? Share your thoughts on AI integration in early-stage startups.',
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: users[1].id,
      spaceId: spaces[2].id,
      upvotes: 12,
      downvotes: 0,
      score: 12
    },
    {
      title: 'Quick Tip: React Performance',
      content: 'Use React.memo() for components that render frequently with the same props. It can significantly improve your app\'s performance! #reactjs #webdev',
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: users[3].id,
      spaceId: spaces[0].id,
      upvotes: 20,
      downvotes: 3,
      score: 17
    },
    {
      title: 'Show HN: My New Portfolio',
      content: 'Just launched my new portfolio website built with Next.js and Framer Motion. Would love to get feedback from the community!',
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: users[2].id,
      upvotes: 6,
      downvotes: 1,
      score: 5
    }
  ]

  for (const postData of posts) {
    await prisma.post.create({
      data: postData
    })
  }

  console.log('✅ Sample posts created:', posts.length)

  // Create sample reports
  await prisma.report.create({
    data: {
      type: 'SPAM',
      reason: 'This user is posting promotional content repeatedly',
      description: 'User has posted the same promotional message in multiple spaces',
      status: 'PENDING',
      reportedById: users[2].id,
      reportedUserId: users[1].id
    }
  })

  console.log('✅ Reports created')

  // Create sample system settings
  const settings = [
    { key: 'site_name', value: 'Konvo', category: 'general', type: 'string', description: 'Site name displayed in header' },
    { key: 'max_post_length', value: '10000', category: 'content', type: 'number', description: 'Maximum characters allowed in posts' },
    { key: 'require_email_verification', value: 'true', category: 'security', type: 'boolean', description: 'Require email verification for new accounts' },
    { key: 'enable_notifications', value: 'true', category: 'notifications', type: 'boolean', description: 'Enable in-app notifications' },
    { key: 'maintenance_mode', value: 'false', category: 'general', type: 'boolean', description: 'Enable maintenance mode' }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { ...setting, updatedBy: users[0].id },
      create: { ...setting, updatedBy: users[0].id }
    })
  }

  console.log('✅ System settings created')

  // Create some activity logs
  await prisma.activityLog.create({
    data: {
      action: 'USER_VERIFIED',
      entityType: 'user',
      entityId: users[2].id,
      details: 'User verified by admin',
      userId: users[0].id
    }
  })

  console.log('✅ Activity logs created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
