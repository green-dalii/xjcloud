import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { createClient } from '../db/client'
import { createToken } from '../auth'
import { users } from '../../../lib/db/schema'
import { ensureMethod, jsonResponse, errorResponse, requireAuth } from '../middleware'
import type { Env } from '../index'

export async function authRouter(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth', '')

  // POST /api/auth/register
  if (path === '/register' || path === '/register/') {
    const methodCheck = ensureMethod(request, ['POST'])
    if (methodCheck) return methodCheck

    const { name, email, password, role } = await request.json() as {
      name?: string; email?: string; password?: string; role?: string
    }

    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required', 422)
    }

    const db = createClient(env.DB)

    // Check email uniqueness
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get()
    if (existing) {
      return errorResponse('Email already registered', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()
    const now = new Date()

    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
      role: (role as 'participant' | 'organizer' | 'provider') || 'participant',
      createdAt: now,
    })

    const token = await createToken({ id, email, name, role: role || 'participant' }, env.AUTH_SECRET)

    return jsonResponse({
      token,
      user: { id, name, email, role: role || 'participant', avatar: null },
    }, 201)
  }

  // POST /api/auth/login
  if (path === '/login' || path === '/login/') {
    const methodCheck = ensureMethod(request, ['POST'])
    if (methodCheck) return methodCheck

    const { email, password } = await request.json() as { email?: string; password?: string }

    if (!email || !password) {
      return errorResponse('Email and password are required', 422)
    }

    const db = createClient(env.DB)

    const user = await db.select().from(users).where(eq(users.email, email)).get()
    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return errorResponse('Invalid email or password', 401)
    }

    const token = await createToken(
      { id: user.id, email: user.email, name: user.name, role: user.role || 'participant' },
      env.AUTH_SECRET
    )

    return jsonResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'participant',
        avatar: user.avatar,
      },
    })
  }

  // GET /api/auth/me
  if (path === '/me' || path === '/me/') {
    const methodCheck = ensureMethod(request, ['GET'])
    if (methodCheck) return methodCheck

    const { response, user: authUser } = await requireAuth(request, env)
    if (response) return response
    if (!authUser) return errorResponse('Unauthorized', 401)

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

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return jsonResponse({ user })
  }

  return errorResponse('Not found', 404)
}
