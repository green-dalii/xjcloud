import { eq } from 'drizzle-orm'
import { createClient } from '../db/client'
import { users } from '../../../lib/db/schema'
import { ensureMethod, jsonResponse, errorResponse, requireAuth } from '../middleware'
import type { Env } from '../index'

export async function usersRouter(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/users', '')

  // PUT /api/users/me
  if (path === '/me' || path === '/me/') {
    const methodCheck = ensureMethod(request, ['PUT', 'GET'])
    if (methodCheck) return methodCheck

    const { response, user: authUser } = await requireAuth(request, env)
    if (response) return response
    if (!authUser) return errorResponse('Unauthorized', 401)

    if (request.method === 'GET') {
      const db = createClient(env.DB)
      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        bio: users.bio,
        phone: users.phone,
        location: users.location,
        interests: users.interests,
        website: users.website,
        riceBalance: users.riceBalance,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.id, authUser.id)).get()

      if (!user) return errorResponse('User not found', 404)
      return jsonResponse({ user })
    }

    // PUT - update profile
    const body = await request.json() as {
      name?: string; bio?: string; phone?: string; location?: string
      avatar?: string; website?: string; interests?: string[]
    }

    const db = createClient(env.DB)
    const updates: Record<string, unknown> = {}

    if (body.name !== undefined) updates.name = body.name
    if (body.bio !== undefined) updates.bio = body.bio
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.location !== undefined) updates.location = body.location
    if (body.avatar !== undefined) updates.avatar = body.avatar
    if (body.website !== undefined) updates.website = body.website
    if (body.interests !== undefined) updates.interests = body.interests

    if (Object.keys(updates).length === 0) {
      return errorResponse('No fields to update', 422)
    }

    await db.update(users).set(updates).where(eq(users.id, authUser.id))

    // Return updated user
    const updated = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      avatar: users.avatar,
      bio: users.bio,
      phone: users.phone,
      location: users.location,
      interests: users.interests,
      website: users.website,
      riceBalance: users.riceBalance,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, authUser.id)).get()

    return jsonResponse({ user: updated })
  }

  return errorResponse('Not found', 404)
}
