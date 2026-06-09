import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthActions, useConvexAuth } from '@convex-dev/auth/react'
import type { FormEvent} from 'react';
import { useEffect, useMemo, useState } from 'react'
import { Icon } from './icon'

type AuthMode = 'login' | 'signup'

type AuthSearch = {
  redirect?: string
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const { signIn } = useAuthActions()
  const auth = useConvexAuth()
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const redirectTo = safeRedirect(search.redirect)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'
  const title = isSignup ? 'Create your vault' : 'Welcome back'
  const buttonLabel = isSignup ? 'Create account' : 'Sign in'
  const alternate = isSignup ? '/login' : '/signup'
  const alternateText = isSignup
    ? 'Already have an account?'
    : 'Need a new account?'
  const alternateAction = isSignup ? 'Sign in' : 'Create one'

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate({ to: redirectTo, replace: true })
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate, redirectTo])

  const canSubmit = useMemo(() => {
    if (!email.trim() || password.length < 8) return false
    return true
  }, [email, password])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setError('')
    try {
      const params = isSignup
        ? {
            flow: 'signUp',
            email: email.trim().toLowerCase(),
            password,
            name: name.trim(),
            username: username.trim().toLowerCase(),
          }
        : {
            flow: 'signIn',
            email: email.trim().toLowerCase(),
            password,
          }

      await signIn('password', params)
    } catch (err) {
      setError(authErrorMessage(err, isSignup))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app auth-shell">
      <div className="auth-scene">
        <Link to="/" className="auth-brand" aria-label="Dida home">
          <span className="mark" />
          <span>Dida</span>
          <span className='px-2 py-1 border border-black/20 rounded-full bg-secondary text-primary text-xs font-light'>Beta</span>
        </Link>

        <section className="auth-copy" aria-label="Dida">
          <p className="eyebrow">Personal notes, quietly organized</p>
          <h1>Write what matters without losing the thread.</h1>
          <p>
            A calm private workspace for notes, code fragments, lists, and the
            small details worth keeping.
          </p>
        </section>

        <section className="auth-panel" aria-label={title}>
          <div className="auth-panel-head">
            <span className="auth-icon">
              <Icon name={isSignup ? 'plus' : 'enter'} size={17} />
            </span>
            <div>
              <h2>{title}</h2>
              <p>
                {isSignup
                  ? 'Start with email and password.'
                  : 'Continue to your notes.'}
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {isSignup && (
              <div className="auth-grid">
                <label>
                  <span>Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                  />
                </label>
                <label>
                  <span>Username</span>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="ada"
                  />
                </label>
              </div>
            )}

            <label>
              <span>Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                type="email"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <div className="password-field">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              className="auth-submit"
              type="submit"
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Working...' : buttonLabel}
              <Icon name="chevR" size={16} />
            </button>
          </form>

          <p className="auth-switch">
            {alternateText}{' '}
            <Link to={alternate} search={{ redirect: redirectTo }}>
              {alternateAction}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//'))
    return '/notes'
  if (value === '/login' || value.startsWith('/login?')) return '/notes'
  if (value === '/signup' || value.startsWith('/signup?')) return '/notes'
  return value
}

function authErrorMessage(error: unknown, isSignup: boolean) {
  const message = error instanceof Error ? error.message : String(error)
  if (/invalid credentials/i.test(message))
    return 'The email or password is incorrect.'
  if (/invalid password/i.test(message))
    return 'Use a password with at least 8 characters.'
  if (/already|exists/i.test(message))
    return 'An account already exists for this email.'
  return isSignup
    ? 'Could not create that account. Check the details and try again.'
    : 'Could not sign in. Check the details and try again.'
}
