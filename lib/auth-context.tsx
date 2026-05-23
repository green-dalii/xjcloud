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

  useEffect(() => {
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
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, loading: false })
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await apiRequest<{ user: User }>('/api/auth/me')
      setState(prev => ({ ...prev, user }))
    } catch {
      // Token expired
      localStorage.removeItem(TOKEN_KEY)
      setState({ user: null, token: null, loading: false })
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
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
