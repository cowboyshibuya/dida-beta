import type { ReactNode } from 'react'
import { Icon } from './icon'
import { useUi } from '../../lib/ui'

export function Toolbar({
  crumbs = [],
  actions,
}: {
  crumbs?: string[]
  actions?: ReactNode
}) {
  const { sidebarOpen, toggleSidebar } = useUi()
  return (
    <div className="toolbar drag">
      {!sidebarOpen && (
        <button
          className="tb-btn no-drag"
          aria-label="Show sidebar"
          onClick={toggleSidebar}
        >
          <Icon name="sidebar" size={16} />
        </button>
      )}
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {i > 0 && (
              <span className="sep">
                <Icon name="chevR" size={13} />
              </span>
            )}
            <span className={i === crumbs.length - 1 ? 'cur' : undefined}>
              {c}
            </span>
          </span>
        ))}
      </div>
      <div className="tb-spacer" />
      <div className="no-drag" style={{ display: 'flex', gap: 4 }}>
        {actions}
      </div>
    </div>
  )
}
