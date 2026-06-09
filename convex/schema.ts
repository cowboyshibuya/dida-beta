import { defineSchema } from 'convex/server'
import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export const noteType = v.union(
  v.literal('doc'),
  v.literal('code'),
  v.literal('list'),
)
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    username: v.optional(v.string()),
  })
    .index('email', ['email'])
    .index('username', ['username']),

  notes: defineTable({
    userId: v.id('users'),
    title: v.string(),
    // Canonical content is TipTap JSON (stringified). `markdown` is a derived
    // export and `snippet` is derived plaintext used for lists + search.
    contentJson: v.string(),
    markdown: v.string(),
    snippet: v.string(),
    tags: v.array(v.string()),
    type: noteType,
    pinned: v.boolean(),
    trashed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_trashed', ['userId', 'trashed'])
    .index('by_user_pinned', ['userId', 'pinned'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['userId', 'trashed'],
    })
    .searchIndex('search_snippet', {
      searchField: 'snippet',
      filterFields: ['userId', 'trashed'],
    }),
})
