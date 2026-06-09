import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Toolbar } from '@/components/toolbar'
import { Icon } from '@/components/icon'
import { Editor, type NoteContentPatch } from '@/components/editor/editor'
import { TagEditor } from '@/components/editor/tag-editor'
import { useNote, useUpdateNote, useTogglePin, useTrashNote } from '../../../lib/notes'
import { timeAgo, readingTime } from '../../../lib/format'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/_app/notes/$noteId')({
  component: NoteEditor,
})

function NoteEditor() {
  const { noteId } = Route.useParams()
  const id = noteId as Id<'notes'>
  const note = useNote(id)
  const update = useUpdateNote()
  const togglePin = useTogglePin()
  const trash = useTrashNote()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // load title when the note (or selected note) changes
  useEffect(() => {
    if (note) setTitle(note.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?._id])

  const save = async (patch: Record<string, unknown>) => {
    setStatus('saving')
    try {
      await update({ id, ...patch })
      setStatus('saved')
    } catch (err) {
      setStatus('idle')
      toast.error('Could not save note')
      console.error(err)
    }
  }

  const onTitle = (value: string) => {
    setTitle(value)
    if (titleTimer.current) clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => save({ title: value }), 500)
  }

  const onContent = (patch: NoteContentPatch) => save(patch)

  if (note === undefined) {
    return (
      <>
        <Toolbar crumbs={['Notes']} />
        <div className="doc" />
      </>
    )
  }
  if (note === null) {
    return (
      <>
        <Toolbar crumbs={['Notes']} />
        <div className="empty">
          <h1>Note not found</h1>
          <p>This note may have been deleted.</p>
        </div>
      </>
    )
  }

  const crumbs = [note.tags[0] ?? 'Notes', title.trim() || 'Untitled']

  return (
    <>
      <Toolbar
        crumbs={crumbs}
        actions={
          <>
            <button
              className={'tb-btn' + (note.pinned ? ' on' : '')}
              aria-label="Pin note"
              onClick={() => togglePin({ id })}
            >
              <Icon name="star" size={16} fill={note.pinned ? 'currentColor' : 'none'} />
            </button>
            <button className="tb-btn" aria-label="Share">
              <Icon name="share" size={16} />
            </button>
            <div style={{ position: 'relative' }}>
              <button
                className="tb-btn"
                aria-label="More"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Icon name="more" size={16} sw={2} />
              </button>
              {menuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="menu"
                    style={{ position: 'absolute', top: 34, right: 0 }}
                  >
                    <button
                      className="menu-item"
                      onClick={() => togglePin({ id })}
                    >
                      <Icon name="pin" size={15} />
                      {note.pinned ? 'Unpin' : 'Pin to top'}
                    </button>
                    <button
                      className="menu-item"
                      onClick={async () => {
                        setMenuOpen(false)
                        await trash({ id })
                        toast('Note moved to Trash')
                        navigate({ to: '/notes' })
                      }}
                    >
                      <Icon name="trash" size={15} />
                      Move to Trash
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        }
      />
      <div className="doc">
        <div className="doc-inner">
          <TagEditor tags={note.tags} onChange={(tags) => save({ tags })} />
          <input
            className="doc-title doc-title-input"
            value={title}
            placeholder="Untitled"
            onChange={(e) => onTitle(e.target.value)}
          />
          <div className="doc-sub">
            <span>
              {status === 'saving'
                ? 'Saving…'
                : `Edited ${timeAgo(note.updatedAt)}`}
            </span>
            <span className="dot" />
            <span>{readingTime(note.snippet || title)}</span>
          </div>
          <Editor
            key={note._id}
            noteId={note._id}
            initialContent={note.contentJson}
            onChange={onContent}
          />
        </div>
      </div>
    </>
  )
}
