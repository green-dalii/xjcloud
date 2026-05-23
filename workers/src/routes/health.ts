import { ensureMethod, jsonResponse } from '../middleware'
import type { Env } from '../index'

export async function healthRouter(request: Request, env: Env): Promise<Response> {
  const methodCheck = ensureMethod(request, ['GET'])
  if (methodCheck) return methodCheck

  let dbStatus = 'unknown'
  try {
    const result = await env.DB.prepare('SELECT 1 as test').first()
    dbStatus = result ? 'connected' : 'error'
  } catch {
    dbStatus = 'error'
  }

  return jsonResponse({
    status: 'ok',
    service: 'xjcloud-api',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  })
}
