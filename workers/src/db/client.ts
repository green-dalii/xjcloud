import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../../../lib/db/schema'

export function createClient(database: D1Database) {
  return drizzle(database, { schema })
}

export const USER_PROJECTION = {
  id: schema.users.id,
  name: schema.users.name,
  email: schema.users.email,
  role: schema.users.role,
  avatar: schema.users.avatar,
  bio: schema.users.bio,
  phone: schema.users.phone,
  location: schema.users.location,
  interests: schema.users.interests,
  website: schema.users.website,
  gender: schema.users.gender,
  age: schema.users.age,
  skills: schema.users.skills,
  riceBalance: schema.users.riceBalance,
  createdAt: schema.users.createdAt,
} as const
