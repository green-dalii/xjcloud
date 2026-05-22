import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="auth-switch">
        还没有账号？<Link href="/register">去注册</Link>
      </p>
    </>
  )
}
