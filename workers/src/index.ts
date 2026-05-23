import { authMiddleware } from './auth'
import { healthRouter } from './routes/health'

export interface Env {
  DB: D1Database
  AUTH_SECRET: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      let response: Response

      // Route matching
      if (pathname === '/api/health' || pathname === '/api/health/') {
        response = await healthRouter(request, env)
      } else if (pathname.startsWith('/api/auth/')) {
        // TODO: auth router
        response = new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 })
      } else if (pathname.startsWith('/api/users/')) {
        // TODO: users router
        response = new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 })
      } else if (pathname.startsWith('/api/activities/')) {
        // TODO: activities router
        response = new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 })
      } else if (pathname.startsWith('/api/posts/')) {
        // TODO: posts router
        response = new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 })
      } else {
        response = new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
      }

      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (err) {
      console.error('Unhandled error:', err)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
  },
}
