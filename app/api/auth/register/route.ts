import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: '请填写所有必填项' } },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: { code: 'WEAK_PASSWORD', message: '密码至少6位' } },
        { status: 400 }
      )
    }

    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return Response.json(
        { success: false, error: { code: 'EMAIL_EXISTS', message: '该邮箱已注册' } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: role || 'participant',
    })

    return Response.json({ success: true, message: '注册成功' })
  } catch {
    return Response.json(
      { success: false, error: { code: 'SERVER_ERROR', message: '注册失败，请重试' } },
      { status: 500 }
    )
  }
}
