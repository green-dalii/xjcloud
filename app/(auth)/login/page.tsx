import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-xj-amber">🌾 乡建协作</h1>
        <p className="text-gray-500 mt-2">让乡建人协作起来</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-gray-500">
        还没有账号？<Link href="/register" className="text-xj-amber">去注册</Link>
      </p>
    </div>
  )
}
