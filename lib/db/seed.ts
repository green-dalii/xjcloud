import { db } from './client'
import { users, posts, activities } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  const password = await bcrypt.hash('123456', 10)

  await db.insert(users).values({
    name: '新农人小王',
    email: 'wang@test.com',
    passwordHash: password,
    role: 'organizer',
    riceBalance: 128,
  })

  await db.insert(users).values({
    name: '张木匠',
    email: 'zhang@test.com',
    passwordHash: password,
    role: 'provider',
    riceBalance: 256,
  })

  console.log('Seeded 2 users')
}

seed().catch(console.error)
