import { authMiddleware as verifyAuth } from './auth'
import type { Env } from './index'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function corsHeaders(): Record<string, string> {
  return { ...CORS_HEADERS }
}

export function handleOptions(): Response {
  return new Response(null, { headers: CORS_HEADERS })
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
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
