import { useMutation, useQuery } from 'convex/react'
import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { api } from '../convex/_generated/api'
import type { Id } from '../convex/_generated/dataModel'

export type NoteId = Id<'notes'>

export function useNotes() {
  return useQuery(api.notes.listNotes)
}

export function useNote(id: NoteId | undefined) {
  return useQuery(api.notes.getNote, id ? { id } : 'skip')
}

export function useTags() {
  return useQuery(api.tags.listWithCounts)
}

/** Creates a blank note and navigates to it. */
export function useCreateNote() {
  const create = useMutation(api.notes.createNote)
  const navigate = useNavigate()
  return useCallback(async () => {
    const id = await create({})
    navigate({ to: '/notes/$noteId', params: { noteId: id } })
    return id
  }, [create, navigate])
}

export function useUpdateNote() {
  return useMutation(api.notes.updateNote)
}

export function useTogglePin() {
  return useMutation(api.notes.togglePin)
}

export function useTrashNote() {
  return useMutation(api.notes.trashNote)
}
