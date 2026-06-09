import { createFileRoute } from '@tanstack/react-router'
import { Toolbar } from '@/components/toolbar'
import { useTags } from '../../../lib/notes'

export const Route = createFileRoute('/_app/tags')({
  component: TagsView,
})

function TagsView() {
  const tags = useTags() ?? []

  return (
    <>
      <Toolbar crumbs={['Tags']} />
      <div className="tagsview">
        <h1>Tags</h1>
        {tags.length === 0 ? (
          <p style={{ color: 'var(--text-3)' }}>
            Add tags to your notes and they’ll be collected here.
          </p>
        ) : (
          <div className="tag-grid">
            {tags.map((t) => (
              <div key={t.name} className="tag-card">
                <div className="tc-top">
                  <span className="tc-ic">#</span>
                  <span className="tc-name">{t.name}</span>
                  <span className="tc-cnt">{t.count}</span>
                </div>
                <div className="tc-list">
                  {t.notes.map((n, i) => (
                    <div key={i} className="tc-note">
                      {n || 'Untitled'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
