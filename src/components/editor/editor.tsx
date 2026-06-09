import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, type Editor as TipTapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight, common } from 'lowlight'
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import {
  SlashMenu,
  filterSlash,
  type SlashItem,
} from './slash-menu'

const lowlight = createLowlight(common)

export type NoteContentPatch = {
  contentJson: string
  snippet: string
  markdown: string
  type: 'doc' | 'code' | 'list'
}

function deriveType(editor: TipTapEditor): NoteContentPatch['type'] {
  const json = editor.getJSON()
  const nodes = (json.content ?? []) as { type?: string }[]
  const types = nodes.map((n) => n.type)
  if (types[0] === 'codeBlock') return 'code'
  const lists = types.filter((t) => t === 'taskList' || t === 'bulletList' || t === 'orderedList').length
  if (lists > 0 && lists >= types.filter((t) => t === 'paragraph' && t).length) return 'list'
  return 'doc'
}

type SlashState = {
  items: SlashItem[]
  active: number
  range: { from: number; to: number }
  top: number
  left: number
}

export function Editor({
  noteId,
  initialContent,
  onChange,
}: {
  noteId: string
  initialContent: string
  onChange: (patch: NoteContentPatch) => void
}) {
  const [slash, setSlash] = useState<SlashState | null>(null)
  const slashRef = useRef<SlashState | null>(null)
  slashRef.current = slash
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleSave = useCallback(
    (editor: TipTapEditor) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        const text = editor.getText()
        onChange({
          contentJson: JSON.stringify(editor.getJSON()),
          snippet: text.replace(/\s+/g, ' ').trim().slice(0, 140),
          markdown: text,
          type: deriveType(editor),
        })
      }, 600)
    },
    [onChange],
  )

  const closeSlash = () => setSlash(null)

  const detectSlash = useCallback((editor: TipTapEditor) => {
    const { state, view } = editor
    const sel = state.selection
    if (!sel.empty) return setSlash(null)
    const $from = sel.$from
    const textBefore = $from.parent.textBetween(
      0,
      $from.parentOffset,
      undefined,
      '￼',
    )
    const match = /(?:^|\s)\/([a-zA-Z]*)$/.exec(textBefore)
    if (!match) return setSlash(null)
    const query = match[1]
    const from = sel.from - (query.length + 1)
    const items = filterSlash(query)
    const coords = view.coordsAtPos(from)
    setSlash((prev) => ({
      items,
      active: prev && prev.active < items.length ? prev.active : 0,
      range: { from, to: sel.from },
      top: coords.bottom + 6,
      left: coords.left,
    }))
  }, [])

  const pickSlash = useCallback(
    (editor: TipTapEditor, item: SlashItem) => {
      const s = slashRef.current
      if (!s) return
      item.run(editor, s.range)
      setSlash(null)
    },
    [],
  )

  const editorRef = useRef<TipTapEditor | null>(null)

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          link: false,
        }),
        CodeBlock.configure({ lowlight }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight,
        Link.configure({ openOnClick: false, autolink: true }),
        Placeholder.configure({
          placeholder: "Write something, or press '/' for blocks…",
        }),
        Callout,
      ],
      content: initialContent ? JSON.parse(initialContent) : undefined,
      editorProps: {
        attributes: { class: 'editor' },
        handleKeyDown: (_view, event) => {
          const s = slashRef.current
          if (!s) return false
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setSlash({ ...s, active: (s.active + 1) % s.items.length })
            return true
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setSlash({
              ...s,
              active: (s.active - 1 + s.items.length) % s.items.length,
            })
            return true
          }
          if (event.key === 'Enter' || event.key === 'Tab') {
            if (s.items.length === 0) return false
            event.preventDefault()
            if (editorRef.current) pickSlash(editorRef.current, s.items[s.active])
            return true
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            setSlash(null)
            return true
          }
          return false
        },
      },
      onUpdate: ({ editor }) => {
        detectSlash(editor)
        scheduleSave(editor)
      },
      onSelectionUpdate: ({ editor }) => detectSlash(editor),
    },
    [noteId],
  )

  editorRef.current = editor

  // flush pending save on unmount / note switch
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [noteId])

  return (
    <>
      <EditorContent editor={editor} />
      {slash && editor && (
        <SlashMenu
          items={slash.items}
          active={slash.active}
          position={{ top: slash.top, left: slash.left }}
          onPick={(item) => pickSlash(editor, item)}
        />
      )}
    </>
  )
}
