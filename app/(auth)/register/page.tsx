import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <p className="auth-switch">
        已有账号？<Link href="/login">去登录</Link>
      </p>
    </>
  )
}
