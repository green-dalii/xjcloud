import { handleOptions, corsHeaders, errorResponse } from './middleware'
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
      return handleOptions(request)
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
        response = errorResponse('Not found', 404)
      }

      // Override CORS with request-specific origin
      const headers = corsHeaders(request.headers.get('Origin'))
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (err) {
      console.error('Unhandled error:', err)
      return errorResponse('Internal server error', 500)
    }
  },
}
