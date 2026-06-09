import { useState } from 'react'
import { Icon } from '../icon'

export function TagEditor({
  tags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [value, setValue] = useState('')

  const commit = () => {
    const t = value.trim().replace(/^#/, '')
    if (t && !tags.includes(t)) onChange([...tags, t])
    setValue('')
    setAdding(false)
  }

  return (
    <div className="doc-tags">
      {tags.map((t, i) => (
        <button
          key={t}
          className={'chip' + (i === 0 ? ' accent' : '')}
          title="Remove tag"
          onClick={() => onChange(tags.filter((x) => x !== t))}
        >
          <span className="h">#</span>
          {t}
        </button>
      ))}
      {adding ? (
        <input
          autoFocus
          className="chip"
          style={{ width: 90, outline: 'none' }}
          value={value}
          placeholder="tag…"
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setValue('')
              setAdding(false)
            }
          }}
        />
      ) : (
        <button className="chip add" onClick={() => setAdding(true)}>
          <Icon name="plus" size={12} sw={2} /> Tag
        </button>
      )}
    </div>
  )
}
