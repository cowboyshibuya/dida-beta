import { query } from "./_generated/server";
import { getUserId } from "./auth";


// Tags are derived from notes (no separate table). Returns each tag with its
// note count and a few sample note titles for the Tags view cards.
export const listWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const notes = await ctx.db
      .query('notes')
      .withIndex('by_user_trashed', (q) =>
        q.eq('userId', userId).eq('trashed', false),
      )
      .collect()

    const byTag = new Map<string, { count: number; notes: string[] }>()
    for (const note of notes) {
      for (const tag of note.tags) {
        const entry = byTag.get(tag) ?? { count: 0, notes: [] }
        entry.count += 1
        if (entry.notes.length < 3 && note.title) entry.notes.push(note.title)
        byTag.set(tag, entry)
      }
    }

    return [...byTag.entries()]
      .map(([name, { count, notes }]) => ({ name, count, notes }))
      .sort((a, b) => b.count - a.count)
  },
})
