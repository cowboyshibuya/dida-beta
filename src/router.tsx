import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

export function getRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    console.error('missing envar VITE_CONVEX_URL')
  }
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => (
      <ConvexAuthProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexAuthProvider>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
