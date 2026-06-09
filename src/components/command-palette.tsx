import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Icon, type IconName } from './icon'
import { useUi } from '../../lib/ui'
import { useCreateNote } from '../../lib/notes'
import { formatDate } from '../../lib/format'
import type { Doc } from '../../convex/_generated/dataModel'

function kindIcon(type: Doc<'notes'>['type']): IconName {
  if (type === 'code') return 'code'
  if (type === 'list') return 'list'
  return 'doc'
}

function highlight(text: string, q: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useUi()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const createNote = useCreateNote()

  const recent = useQuery(api.notes.listNotes) ?? []
  const results =
    useQuery(api.notes.searchNotes, query.trim() ? { query } : 'skip') ?? []

  useEffect(() => {
    if (!paletteOpen) setQuery('')
  }, [paletteOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    if (paletteOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [paletteOpen, setPaletteOpen])

  if (!paletteOpen) return null

  const open = (id: string) => {
    setPaletteOpen(false)
    navigate({ to: '/notes/$noteId', params: { noteId: id } })
  }

  const showRecent = !query.trim()
  const list = showRecent ? recent.slice(0, 6) : results

  return (
    <div className="scrim" onMouseDown={() => setPaletteOpen(false)}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <Command shouldFilter={false} loop>
          <div className="pal-input">
            <Icon name="search" size={19} style={{ color: 'var(--text-3)' }} />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search notes…"
            />
            <span className="esc">esc</span>
          </div>
          <Command.List className="pal-body">
            {!showRecent && list.length === 0 && (
              <div className="pal-empty">No results for “{query}”.</div>
            )}

            <Command.Group>
              <div className="pal-group">
                {showRecent ? 'Recent' : 'Results'}
              </div>
              {list.map((n) => (
                <Command.Item
                  key={n._id}
                  value={n._id}
                  onSelect={() => open(n._id)}
                  className="pal-item"
                >
                  <span className="pic">
                    <Icon name={kindIcon(n.type)} size={15} />
                  </span>
                  <div className="ptext">
                    <div className="pt">
                      {highlight(n.title.trim() || 'Untitled', query)}
                    </div>
                    <div className="pm">
                      <span>Note</span>
                      {n.tags[0] && (
                        <>
                          <span className="dot" />
                          <span>{n.tags[0]}</span>
                        </>
                      )}
                      <span className="dot" />
                      <span>{formatDate(n.updatedAt)}</span>
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group>
              <div className="pal-group">Actions</div>
              <Command.Item
                value="__new"
                onSelect={() => {
                  setPaletteOpen(false)
                  createNote()
                }}
                className="pal-item"
              >
                <span className="pic">
                  <Icon name="plus" size={16} />
                </span>
                <div className="ptext">
                  <div className="pt">Create a new note</div>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
          <div className="pal-foot">
            <span className="hint">
              <span className="key">↑</span>
              <span className="key">↓</span> Navigate
            </span>
            <span className="hint">
              <span className="key">↵</span> Open
            </span>
            <div className="tb-spacer" />
            <span>
              {showRecent ? recent.length : results.length}{' '}
              {showRecent ? 'notes' : 'results'}
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}
