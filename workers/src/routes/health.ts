import type { Env } from '../index'

export async function healthRouter(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  // Test D1 connection
  let dbStatus = 'unknown'
  try {
    const result = await env.DB.prepare('SELECT 1 as test').first()
    dbStatus = result ? 'connected' : 'error'
  } catch {
    dbStatus = 'error'
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'xjcloud-api',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
