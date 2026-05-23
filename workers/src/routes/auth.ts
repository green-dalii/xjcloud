import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { createClient, USER_PROJECTION } from '../db/client'
import { createToken } from '../auth'
import { users } from '../../../lib/db/schema'
import { ensureMethod, jsonResponse, errorResponse, requireAuth } from '../middleware'
import type { Env } from '../index'

type UserRole = 'participant' | 'organizer' | 'provider'
const safeRole = (role: string | null | undefined): UserRole =>
  (role as UserRole) || 'participant'

export async function authRouter(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth', '')

  if (path === '/register' || path === '/register/') {
    const methodCheck = ensureMethod(request, ['POST'])
    if (methodCheck) return methodCheck

    const { name, email, password, role } = await request.json() as {
      name?: string; email?: string; password?: string; role?: string
    }

    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required', 422)
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 422)
    }

    const db = createClient(env.DB)

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get()
    if (existing) {
      return errorResponse('Email already registered', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()
    const now = new Date()
    const finalRole = safeRole(role)

    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
      role: finalRole,
      createdAt: now,
    })

    const token = await createToken({ id, email, name, role: finalRole }, env.AUTH_SECRET)

    return jsonResponse({
      token,
      user: { id, name, email, role: finalRole, avatar: null },
    }, 201)
  }

  if (path === '/login' || path === '/login/') {
    const methodCheck = ensureMethod(request, ['POST'])
    if (methodCheck) return methodCheck

    const { email, password } = await request.json() as { email?: string; password?: string }

    if (!email || !password) {
      return errorResponse('Email and password are required', 422)
    }

    const db = createClient(env.DB)

    const user = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      passwordHash: users.passwordHash,
      avatar: users.avatar,
    }).from(users).where(eq(users.email, email)).get()

    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return errorResponse('Invalid email or password', 401)
    }

    const finalRole = safeRole(user.role)
    const token = await createToken(
      { id: user.id, email: user.email, name: user.name, role: finalRole },
      env.AUTH_SECRET
    )

    return jsonResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: finalRole,
        avatar: user.avatar,
      },
    })
  }

  if (path === '/me' || path === '/me/') {
    const methodCheck = ensureMethod(request, ['GET'])
    if (methodCheck) return methodCheck

    const { response, user: authUser } = await requireAuth(request, env)
    if (response) return response
    if (!authUser) return errorResponse('Unauthorized', 401)

    const db = createClient(env.DB)
    const user = await db.select(USER_PROJECTION)
      .from(users)
      .where(eq(users.id, authUser.id))
      .get()

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return jsonResponse({ user })
  }

  return errorResponse('Not found', 404)
}
