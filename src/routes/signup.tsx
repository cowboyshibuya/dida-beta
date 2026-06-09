import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/components/auth-form'

export const Route = createFileRoute('/signup')({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: Signup,
})

function Signup() {
  return <AuthPage mode="signup" />
}
