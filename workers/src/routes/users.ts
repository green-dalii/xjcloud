import { eq } from 'drizzle-orm'
import { createClient, USER_PROJECTION } from '../db/client'
import { users } from '../../../lib/db/schema'
import { ensureMethod, jsonResponse, errorResponse, requireAuth } from '../middleware'
import type { Env } from '../index'

const ALLOWED_PROFILE_FIELDS = ['name', 'bio', 'phone', 'location', 'avatar', 'website', 'interests', 'gender', 'age', 'skills'] as const

export async function usersRouter(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/users', '')

  if (path === '/me' || path === '/me/') {
    const methodCheck = ensureMethod(request, ['PUT'])
    if (methodCheck) return methodCheck

    const { response, user: authUser } = await requireAuth(request, env)
    if (response) return response
    if (!authUser) return errorResponse('Unauthorized', 401)

    const body = await request.json() as Record<string, unknown>
    const updates: Record<string, unknown> = {}

    for (const key of ALLOWED_PROFILE_FIELDS) {
      if (body[key] !== undefined) {
        updates[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse('No fields to update', 422)
    }

    const db = createClient(env.DB)
    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.id, authUser.id))
      .returning(USER_PROJECTION)
      .get()

    if (!updated) return errorResponse('User not found', 404)

    return jsonResponse({ user: updated })
  }

  return errorResponse('Not found', 404)
}
