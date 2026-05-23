import { jwtVerify, SignJWT } from 'jose'
import type { Env } from './index'

export interface AuthToken {
  id: string
  email: string
  name: string
  role?: string
}

export async function createToken(payload: AuthToken, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(secret))
}

export async function verifyToken(token: string, secret: string): Promise<AuthToken | null> {
  try {
    const encoder = new TextEncoder()
    const { payload } = await jwtVerify(token, encoder.encode(secret), { clockTolerance: 60 })
    return payload as unknown as AuthToken
  } catch {
    return null
  }
}

export async function authMiddleware(request: Request, env: Env): Promise<AuthToken | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  return verifyToken(token, env.AUTH_SECRET)
}
