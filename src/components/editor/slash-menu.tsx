import type { Editor } from '@tiptap/react'
import type { IconName } from '../icon'
import { Icon } from '../icon'

export type SlashItem = {
  title: string
  desc: string
  icon: IconName
  kbd?: string
  keywords: string[]
  run: (editor: Editor, range: { from: number; to: number }) => void
}

const del = (editor: Editor, range: { from: number; to: number }) =>
  editor.chain().focus().deleteRange(range)

export const SLASH_GROUPS: { group: string; items: SlashItem[] }[] = [
  {
    group: 'Basic',
    items: [
      {
        title: 'Heading',
        desc: 'Big section title',
        icon: 'h1',
        kbd: '#',
        keywords: ['h1', 'heading', 'title'],
        run: (e, r) => del(e, r).setNode('heading', { level: 1 }).run(),
      },
      {
        title: 'Subheading',
        desc: 'Medium section title',
        icon: 'h1',
        kbd: '##',
        keywords: ['h2', 'subheading'],
        run: (e, r) => del(e, r).setNode('heading', { level: 2 }).run(),
      },
      {
        title: 'Text',
        desc: 'Plain paragraph',
        icon: 'text',
        keywords: ['text', 'paragraph', 'body'],
        run: (e, r) => del(e, r).setParagraph().run(),
      },
      {
        title: 'To-do list',
        desc: 'Track tasks with checkboxes',
        icon: 'todo',
        kbd: '[]',
        keywords: ['todo', 'task', 'checkbox', 'check'],
        run: (e, r) => del(e, r).toggleTaskList().run(),
      },
      {
        title: 'Bulleted list',
        desc: 'A simple list',
        icon: 'list',
        kbd: '-',
        keywords: ['bullet', 'list', 'unordered'],
        run: (e, r) => del(e, r).toggleBulletList().run(),
      },
    ],
  },
  {
    group: 'Blocks',
    items: [
      {
        title: 'Code',
        desc: 'Syntax-highlighted block',
        icon: 'code',
        kbd: '```',
        keywords: ['code', 'snippet', 'pre'],
        run: (e, r) => del(e, r).toggleCodeBlock().run(),
      },
      {
        title: 'Quote',
        desc: 'Set a passage apart',
        icon: 'quote',
        kbd: '>',
        keywords: ['quote', 'blockquote', 'cite'],
        run: (e, r) => del(e, r).toggleBlockquote().run(),
      },
      {
        title: 'Callout',
        desc: 'Draw the eye',
        icon: 'bulb',
        keywords: ['callout', 'note', 'tip', 'info'],
        run: (e, r) => del(e, r).setCallout().run(),
      },
      {
        title: 'Divider',
        desc: 'A horizontal rule',
        icon: 'divider',
        kbd: '---',
        keywords: ['divider', 'hr', 'rule', 'separator'],
        run: (e, r) => del(e, r).setHorizontalRule().run(),
      },
    ],
  },
]

export function filterSlash(query: string): SlashItem[] {
  const all = SLASH_GROUPS.flatMap((g) => g.items)
  if (!query) return all
  const q = query.toLowerCase()
  return all.filter(
    (it) =>
      it.title.toLowerCase().includes(q) ||
      it.keywords.some((k) => k.includes(q)),
  )
}

export function SlashMenu({
  items,
  active,
  onPick,
  position,
}: {
  items: SlashItem[]
  active: number
  onPick: (item: SlashItem) => void
  position: { top: number; left: number }
}) {
  return (
    <div
      className="slash"
      style={{ position: 'fixed', top: position.top, left: position.left }}
    >
      {items.length === 0 && (
        <div className="slash-grp" style={{ padding: 12 }}>
          No matches
        </div>
      )}
      {items.map((it, i) => (
        <button
          key={it.title}
          className={'slash-item' + (i === active ? ' on' : '')}
          onMouseDown={(e) => {
            e.preventDefault()
            onPick(it)
          }}
        >
          <span className="sic">
            <Icon name={it.icon} size={16} />
          </span>
          <div>
            <div className="st">{it.title}</div>
            <div className="sd">{it.desc}</div>
          </div>
          {it.kbd && <span className="skbd">{it.kbd}</span>}
        </button>
      ))}
    </div>
  )
}
