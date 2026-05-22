import { auth } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '请先登录' } },
      { status: 401 }
    )
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user) {
    return Response.json(
      { success: false, error: { code: 'NOT_FOUND', message: '用户不存在' } },
      { status: 404 }
    )
  }

  return Response.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      riceBalance: user.riceBalance,
      createdAt: user.createdAt,
    },
  })
}
