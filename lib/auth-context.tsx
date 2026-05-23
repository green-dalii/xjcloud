'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'participant' | 'organizer' | 'provider'
  avatar: string | null
  bio: string | null
  phone: string | null
  location: string | null
  interests: string[] | null
  website: string | null
  gender: 'male' | 'female' | 'unspecified' | null
  age: number | null
  skills: string[] | null
  riceBalance: number
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    role: string
  }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function getUserInitial(user: { name?: string | null; email?: string | null }): string {
  return user.name?.[0] || user.email?.[0] || 'U'
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
const TOKEN_KEY = 'xjcloud_token'
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
const DEMO_USER_KEY = 'xjcloud_demo_user'

function createDemoUser(email?: string, name?: string): User {
  return {
    id: `demo_${Date.now()}`,
    name: name || email?.split('@')[0] || '演示用户',
    email: email || 'demo@xjcloud.com',
    role: 'organizer',
    avatar: null,
    bio: '在乡野间找寻生活的另一种可能',
    phone: '138****8888',
    location: '浙江 · 杭州',
    interests: ['weekend', 'craft', 'food'],
    website: null,
    gender: 'unspecified',
    age: null,
    skills: ['摄影', '写作'],
    riceBalance: 100,
    createdAt: new Date().toISOString(),
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('网络连接失败，请检查网络后重试')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || '请求失败，请稍后重试')
  }

  return data as T
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  })

  // ── Init: restore from storage ──
  useEffect(() => {
    if (DEMO_MODE) {
      const stored = sessionStorage.getItem(DEMO_USER_KEY)
      if (stored) {
        try {
          const user: User = JSON.parse(stored)
          setState({ user, token: 'demo', loading: false })
        } catch {
          sessionStorage.removeItem(DEMO_USER_KEY)
          setState({ user: null, token: null, loading: false })
        }
      } else {
        setState({ user: null, token: null, loading: false })
      }
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState({ user: null, token: null, loading: false })
      return
    }

    setState(prev => ({ ...prev, token, loading: true }))

    apiRequest<{ user: User }>('/api/auth/me')
      .then(({ user }) => {
        setState({ user, token, loading: false })
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setState({ user: null, token: null, loading: false })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (DEMO_MODE) {
      const user = createDemoUser(email)
      sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
      setState({ user, token: 'demo', loading: false })
      return
    }

    const { token, user } = await apiRequest<{ token: string; user: User }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    )

    localStorage.setItem(TOKEN_KEY, token)
    setState({ user, token, loading: false })
  }, [])

  const register = useCallback(async (data: {
    name: string
    email: string
    password: string
    role: string
  }) => {
    if (DEMO_MODE) {
      const user = createDemoUser(data.email, data.name)
      sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
      setState({ user, token: 'demo', loading: false })
      return
    }

    const { token, user } = await apiRequest<{ token: string; user: User }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )

    localStorage.setItem(TOKEN_KEY, token)
    setState({ user, token, loading: false })
  }, [])

  const logout = useCallback(() => {
    if (DEMO_MODE) {
      sessionStorage.removeItem(DEMO_USER_KEY)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    setState({ user: null, token: null, loading: false })
  }, [])

  const refreshUser = useCallback(async () => {
    if (DEMO_MODE) {
      const stored = sessionStorage.getItem(DEMO_USER_KEY)
      if (stored) {
        try {
          const user: User = JSON.parse(stored)
          setState(prev => ({ ...prev, user }))
        } catch {
          sessionStorage.removeItem(DEMO_USER_KEY)
          setState({ user: null, token: null, loading: false })
        }
      }
      return
    }

    try {
      const { user } = await apiRequest<{ user: User }>('/api/auth/me')
      setState(prev => ({ ...prev, user }))
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setState({ user: null, token: null, loading: false })
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (DEMO_MODE) {
      setState(prev => {
        if (!prev.user) return prev
        const updated = { ...prev.user, ...data }
        sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated))
        return { ...prev, user: updated }
      })
      return
    }

    const { user } = await apiRequest<{ user: User }>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setState(prev => ({ ...prev, user }))
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return ctx
}
