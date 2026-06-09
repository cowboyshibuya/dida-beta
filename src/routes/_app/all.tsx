import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Toolbar } from '@/components/toolbar'
import { Icon } from '@/components/icon'
import { useNotes } from '../../../lib/notes'
import { formatDate } from '../../../lib/format'
import type { Doc } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/_app/all')({
  component: AllNotes,
})

function Thumb({ note }: { note: Doc<'notes'> }) {
  if (note.type === 'code')
    return (
      <div className="lv-thumb code">
        <div
          className="ln"
          style={{ width: '60%', background: 'var(--syn-fn)' }}
        />
        <div className="ln" style={{ width: '85%' }} />
        <div
          className="ln"
          style={{ width: '45%', background: 'var(--syn-num)' }}
        />
        <div className="ln" style={{ width: '70%' }} />
      </div>
    )
  if (note.type === 'list')
    return (
      <div className="lv-thumb">
        <div className="ln" style={{ width: '70%' }} />
        <div className="ln" style={{ width: '90%' }} />
        <div className="ln" style={{ width: '55%' }} />
      </div>
    )
  return (
    <div className="lv-thumb">
      <div className="ln" style={{ width: '50%', height: 3 }} />
      <div className="ln" style={{ width: '90%' }} />
      <div className="ln" style={{ width: '82%' }} />
    </div>
  )
}

function AllNotes() {
  const notes = useNotes() ?? []
  const navigate = useNavigate()
  const [view, setView] = useState<'rows' | 'grid'>('rows')

  const open = (id: string) =>
    navigate({ to: '/notes/$noteId', params: { noteId: id } })

  return (
    <>
      <Toolbar crumbs={['All Notes']} />
      <div className="listview">
        <div className="lv-head">
          <h1>All Notes</h1>
          <span className="cnt">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
          <div className="seg">
            <button
              className={'s' + (view === 'rows' ? ' on' : '')}
              onClick={() => setView('rows')}
              aria-label="List view"
            >
              <Icon name="rows" size={15} />
            </button>
            <button
              className={'s' + (view === 'grid' ? ' on' : '')}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <Icon name="grid" size={14} />
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div style={{ padding: '40px 44px', color: 'var(--text-3)' }}>
            No notes yet — press ⌘N to create one.
          </div>
        ) : view === 'rows' ? (
          <div className="lv-rows">
            {notes.map((n, i) => (
              <div key={n._id}>
                <button className="lv-row" onClick={() => open(n._id)}>
                  <Thumb note={n} />
                  <div className="lv-tx">
                    <div className="t">{n.title.trim() || 'Untitled'}</div>
                    <div className="m">
                      <span>My Vault</span>
                      {n.tags[0] && (
                        <>
                          <span className="dot" />
                          <span className="ttag">#{n.tags[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="lv-date">{formatDate(n.updatedAt)}</div>
                </button>
                {i < notes.length - 1 && <div className="lv-div" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="lv-grid">
            {notes.map((n) => (
              <button
                key={n._id}
                className="lv-card"
                onClick={() => open(n._id)}
              >
                <div className="t">{n.title.trim() || 'Untitled'}</div>
                <div className="s">{n.snippet || 'No additional text'}</div>
                <div className="m">
                  {n.tags[0] && <span className="ttag">#{n.tags[0]}</span>}
                  <span className="dot" />
                  <span>{formatDate(n.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
