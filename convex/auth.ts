import { convexAuth, getAuthUserId } from '@convex-dev/auth/server'
import { Password } from '@convex-dev/auth/providers/Password'
import type { DataModel } from './_generated/dataModel'
import type { ActionCtx, MutationCtx, QueryCtx } from './_generated/server'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        const email = String(params.email ?? '')
          .trim()
          .toLowerCase()
        const name = String(params.name ?? '').trim()
        const username = String(params.username ?? '')
          .trim()
          .toLowerCase()

        return {
          email,
          name: name || undefined,
          username: username || undefined,
        }
      },
    }),
  ],
})

export async function getUserId(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error('Unauthorized')

  return userId
}
