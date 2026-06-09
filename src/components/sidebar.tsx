import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './icon'
import { SettingsMenu } from './settings-menu'
import { useNotes, useCreateNote } from '../../lib/notes'
import { useUi } from '../../lib/ui'
import { formatDate } from '../../lib/format'
import type { Doc } from '../../convex/_generated/dataModel'

function BrandMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const go = (to: '/notes' | '/all' | '/tags') => {
    setOpen(false)
    navigate({ to })
  }

  return (
    <div ref={ref} style={{ position: 'relative' }} className="no-drag">
      <button className="sb-brand" onClick={() => setOpen((v) => !v)}>
        <span className="mark" />
        Dida
        <Icon name="chevD" size={13} style={{ opacity: 0.5 }} />
      </button>
      {open && (
        <div
          className="menu"
          style={{ position: 'absolute', top: 30, left: 0 }}
        >
          <button className="menu-item" onClick={() => go('/notes')}>
            <Icon name="doc" size={15} /> Notes
          </button>
          <button className="menu-item" onClick={() => go('/all')}>
            <Icon name="rows" size={15} /> All Notes
          </button>
          <button className="menu-item" onClick={() => go('/tags')}>
            <Icon name="hash" size={15} /> Tags
          </button>
        </div>
      )}
    </div>
  )
}

function NoteRow({ note, active }: { note: Doc<'notes'>; active: boolean }) {
  return (
    <Link
      to="/notes/$noteId"
      params={{ noteId: note._id }}
      className={'note-row' + (active ? ' sel accent' : '')}
    >
      <div className="nr-title">
        {note.pinned && (
          <span className="pin">
            <Icon name="pin" size={11} sw={2} />
          </span>
        )}
        {note.title.trim() || 'Untitled'}
      </div>
      {note.snippet && <div className="nr-snip">{note.snippet}</div>}
      <div className="nr-meta">
        <span>{formatDate(note.updatedAt)}</span>
        {note.tags[0] && (
          <>
            <span className="dot" />
            <span>{note.tags[0]}</span>
          </>
        )}
      </div>
    </Link>
  )
}

export function Sidebar() {
  const notes = useNotes()
  const createNote = useCreateNote()
  const { toggleSidebar, setPaletteOpen } = useUi()
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { noteId?: string }
  const activeId = params.noteId

  const pinned = (notes ?? []).filter((n) => n.pinned)
  const rest = (notes ?? []).filter((n) => !n.pinned)

  return (
    <div className="sidebar">
      <div className="sb-top drag">
        <div className="lights">
          <i />
          <i />
          <i />
        </div>
        <div className="tb-spacer" />
        <button
          className="tb-btn no-drag"
          aria-label="New note"
          onClick={() => createNote()}
        >
          <Icon name="plus" size={17} />
        </button>
        <button
          className="tb-btn no-drag"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <Icon name="sidebar" size={16} />
        </button>
      </div>

      <div className="sb-top" style={{ height: 36, paddingTop: 0 }}>
        <BrandMenu />
      </div>

      <button className="sb-search" onClick={() => setPaletteOpen(true)}>
        <Icon name="search" size={14} />
        <span>Search</span>
        <span className="kbd">⌘K</span>
      </button>

      {pinned.length > 0 && (
        <>
          <div className="sb-section">Pinned</div>
          <div className="sb-list" style={{ flex: 'none' }}>
            {pinned.map((n) => (
              <NoteRow key={n._id} note={n} active={n._id === activeId} />
            ))}
          </div>
        </>
      )}

      <div className="sb-section">
        All Notes
        <button
          className="add"
          aria-label="New note"
          onClick={() => createNote()}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
      <div className="sb-list">
        {notes === undefined ? null : rest.length === 0 &&
          pinned.length === 0 ? (
          <div
            style={{
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--text-3)',
            }}
          >
            No notes yet
          </div>
        ) : (
          rest.map((n) => (
            <NoteRow key={n._id} note={n} active={n._id === activeId} />
          ))
        )}
      </div>

      <div className="sb-foot">
        <button
          className="note-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: 0,
            margin: 0,
            flex: 1,
          }}
          onClick={() => navigate({ to: '/notes' })}
        >
          <div className="ava">D</div>
          <span>My Vault</span>
        </button>
        <SettingsMenu />
      </div>
    </div>
  )
}
