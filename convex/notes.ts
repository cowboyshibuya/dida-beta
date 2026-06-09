import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { noteType } from "./schema";
import { getUserId } from "./auth";


const EMPTY_DOC = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }]
});

export const listNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("trashed", false)
      )
      .collect()
    return notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }
})

export const getNote = query({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx)
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) return null
    return note
  }
})

export const listTrashed = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return ctx.db
      .query("notes")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("trashed", true)
      )
      .order("desc")
      .collect()
  }
})

export const searchNotes = query({
  args: { query: v.string() },
  handler: async (ctx, { query: q }) => {
    const userId = await getUserId(ctx);
    const term = q.trim()
    if (!term) return []

    const byTitle = await ctx.db
      .query("notes")
      .withSearchIndex("search_title", (s) =>
        s.search("title", term)
          .eq("userId", userId)
          .eq("trashed", false) // search only not trashed
      )
      .take(8) // only return 8 for performances

    const bySnippet = await ctx.db
      .query("notes")
      .withSearchIndex("search_snippet", (s) =>
        s.search("snippet", term)
          .eq("userId", userId)
          .eq("trashed", false)
      )
      .take(8)

    // merge, de-dupe by id, preserve title-match priority
    const seen = new Set<string>()
    const merged = [...byTitle, ...bySnippet].filter((n) => {
      if (seen.has(n._id)) return false
      seen.add(n._id)
      return true
    })
    return merged.slice(0, 10)
  }
})


export const createNote = mutation({
  args: {
    title: v.optional(v.string()),
    type: v.optional(noteType)
  },
  handler: async (ctx, { title, type }) => {
    const userId = await getUserId(ctx)
    const now = Date.now()
    return ctx.db.insert("notes", {
      userId,
      title: title ?? "",
      contentJson: EMPTY_DOC,
      markdown: "",
      snippet: "",
      tags: [],
      type: type ?? "doc",
      pinned: false,
      trashed: false,
      createdAt: now,
      updatedAt: now
    })
  }
})

export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    contentJson: v.optional(v.string()),
    markdown: v.optional(v.string()),
    snippet: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    type: v.optional(noteType)
  },
  handler: async (ctx, { id, ...patch }) => {
    const userId = await getUserId(ctx)
    const note = await ctx.db.get(id)
    if(!note || note.userId !== userId) throw new Error("Note not found")
    const clean = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
     )
    await ctx.db.patch(id, {...clean, updatedAt: Date.now()})
  }
})

export const togglePin = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Note not found");
    await ctx.db.patch(id, { pinned: !note.pinned });
  }
})
export const trashNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { trashed: true, pinned: false});
  }
})
export const restore = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { trashed: false });
  }
})

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  }
})
