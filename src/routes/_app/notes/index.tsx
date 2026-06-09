import { createFileRoute } from '@tanstack/react-router'
import { Toolbar } from '@/components/toolbar'
import { Icon } from '@/components/icon'
import { useCreateNote } from '../../../../lib/notes'

export const Route = createFileRoute('/_app/notes/')({
  component: NotesHome,
})

function NotesHome() {
  const createNote = useCreateNote()
  return (
    <>
      <Toolbar crumbs={['Notes']} />
      <div className="empty">
        <div className="ill">
          <Icon name="text" size={38} sw={1.4} />
        </div>
        <h1>A blank page, on purpose.</h1>
        <p>
          Start a note to begin writing, or bring up everything you've written.
          Markdown works as you type, with no formatting menus to hunt through.
        </p>
        <button className="cta" onClick={() => createNote()}>
          <Icon name="plus" size={16} sw={2} style={{ color: '#fff' }} /> New
          note <span className="kbd">Cmd N</span>
        </button>
        <div className="hints">
          <span className="h">
            <span className="key">Cmd K</span> Search
          </span>
          <span className="h">
            <span className="key">/</span> Insert block
          </span>
          <span className="h">
            <span className="key">Cmd \</span> Toggle sidebar
          </span>
        </div>
      </div>
    </>
  )
}
