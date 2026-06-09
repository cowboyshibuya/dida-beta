import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/components/auth-form'

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: Login,
})

function Login() {
  return <AuthPage mode="login" />
}
