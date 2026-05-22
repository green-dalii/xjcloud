import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-xj-amber">🌾 乡建协作</h1>
        <p className="text-gray-500 mt-2">加入乡建协作网络</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-gray-500">
        已有账号？<Link href="/login" className="text-xj-amber">去登录</Link>
      </p>
    </div>
  )
}
