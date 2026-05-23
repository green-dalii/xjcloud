import { handleOptions, corsHeaders } from './middleware'
import { healthRouter } from './routes/health'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'

export interface Env {
  DB: D1Database
  AUTH_SECRET: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (request.method === 'OPTIONS') {
      return handleOptions()
    }

    try {
      let response: Response

      if (pathname === '/api/health' || pathname === '/api/health/') {
        response = await healthRouter(request, env)
      } else if (pathname.startsWith('/api/auth/')) {
        response = await authRouter(request, env)
      } else if (pathname.startsWith('/api/users/')) {
        response = await usersRouter(request, env)
      } else {
        response = new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Add CORS headers to all responses
      const headers = corsHeaders()
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (err) {
      console.error('Unhandled error:', err)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        }
      )
    }
  },
}
