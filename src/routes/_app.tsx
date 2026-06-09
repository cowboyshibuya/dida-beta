import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useConvexAuth } from '@convex-dev/auth/react'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { CommandPalette } from '@/components/command-palette'
import { ThemeProvider, appClassName, useTheme } from '../../lib/theme'
import { UiProvider, useUi } from '../../lib/ui'

export const Route = createFileRoute('/_app')({
  component: ProtectedApp,
})

function ProtectedApp() {
  const auth = useConvexAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isProtected = isProtectedPath(location.pathname)

  useEffect(() => {
    if (!isProtected || auth.isLoading || auth.isAuthenticated) return
    const redirect = `${location.pathname}${location.searchStr}`
    navigate({
      to: '/login',
      search: { redirect },
      replace: true,
    })
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    isProtected,
    location.pathname,
    location.searchStr,
    navigate,
  ])

  if (!isProtected) return null

  if (auth.isLoading || !auth.isAuthenticated) {
    return (
      <div className="app">
        <div className="auth-loading">
          <span className="mark" />
          <p>Opening your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <UiProvider>
        <AppFrame />
      </UiProvider>
    </ThemeProvider>
  )
}

function isProtectedPath(pathname: string) {
  return (
    pathname === '/notes' ||
    pathname.startsWith('/notes/') ||
    pathname === '/all' ||
    pathname === '/tags'
  )
}

function AppFrame() {
  const theme = useTheme()
  const { sidebarOpen } = useUi()

  return (
    <div className={appClassName(theme)}>
      <div className="win">
        {sidebarOpen && <Sidebar />}
        <main className="main">
          <Outlet />
        </main>
        <CommandPalette />
        <Toaster position="bottom-center" richColors />
      </div>
    </div>
  )
}
