import { Link, createFileRoute } from '@tanstack/react-router'
import { useConvexAuth } from '@convex-dev/auth/react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const primaryTo = isAuthenticated ? '/notes' : '/signup'

  return (
    <div className="app public-home">
      <header className="home-nav">
        <Link to="/" className="home-brand inline-flex " aria-label="Dida home">
          <span className="mark" />
          <span>Dida</span>
          <span className='px-2 py-1 border border-black/20 rounded-full bg-secondary text-primary text-xs font-light'>Beta</span>

        </Link>
        <nav>
          <Link to="/login">Sign in</Link>
          <Link to={primaryTo} className="home-nav-cta">
            {isAuthenticated ? 'Open notes' : 'Start writing'}
          </Link>
        </nav>
      </header>

      <main className="home-hero">
        <section className="home-copy">
          <p className="eyebrow">Private notes for careful thinking</p>
          <h1>Dida</h1>
          <p>
            A quiet writing space for personal notes, code fragments, and the
            ideas you want close at hand.
          </p>
          <div className="home-actions">
            <Link to={primaryTo} className="home-primary">
              {isLoading
                ? 'Checking session'
                : isAuthenticated
                  ? 'Open your notes'
                  : 'Create your vault'}
            </Link>
            {!isAuthenticated && <Link to="/login">Sign in</Link>}
          </div>
        </section>

        <section className="home-preview" aria-label="Dida writing preview">
          <div className="preview-sidebar">
            <div className="preview-dot-row">
              <i />
              <i />
              <i />
            </div>
            <div className="preview-brand">
              <span className="mark" />
              Dida
            </div>
            <div className="preview-search" />
            <div className="preview-section" />
            <div className="preview-note active">
              <b>Field notes</b>
              <span>Quiet observations from today...</span>
            </div>
            <div className="preview-note">
              <b>Reading list</b>
              <span>Essays, papers, and references</span>
            </div>
            <div className="preview-note">
              <b>Draft ideas</b>
              <span>Three threads to revisit</span>
            </div>
          </div>
          <div className="preview-doc">
            <div className="preview-toolbar" />
            <article>
              <p className="preview-tag">#journal</p>
              <h2>Field notes</h2>
              <p className="lead">
                Keep the thought small enough to hold, then come back with a
                clearer mind.
              </p>
              <div className="preview-line long" />
              <div className="preview-line" />
              <div className="preview-callout">
                <span />
                <p>Save the quote. Follow the question tomorrow.</p>
              </div>
              <div className="preview-line mid" />
              <div className="preview-line short" />
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
