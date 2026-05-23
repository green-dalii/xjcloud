import { authMiddleware as verifyAuth } from './auth'
import type { Env } from './index'

const ALLOWED_ORIGINS = [
  'https://xjcloud-2vz.pages.dev',
  'https://xjcloud.greenerai.top',
  'http://localhost:3001',
  'http://localhost:3000',
]

export function corsHeaders(origin?: string | null): Record<string, string> {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  }
}

export function handleOptions(request: Request): Response {
  const headers = corsHeaders(request.headers.get('Origin'))
  return new Response(null, { headers })
}

export function jsonResponse(data: unknown, status = 200): Response {
  const headers = { ...corsHeaders(), 'Content-Type': 'application/json' }
  return new Response(JSON.stringify(data), { status, headers })
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status)
}

export function ensureMethod(request: Request, allowed: string[]): Response | null {
  if (!allowed.includes(request.method)) {
    return errorResponse('Method not allowed', 405)
  }
  return null
}

export async function requireAuth(request: Request, env: Env) {
  const token = await verifyAuth(request, env)
  if (!token) {
    return { response: errorResponse('Unauthorized', 401), user: null }
  }
  return { response: null, user: token }
}
