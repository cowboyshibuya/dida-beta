import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { Icon } from './icon'
import { useTheme } from '../../lib/theme'

export function SettingsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const navigate = useNavigate()
  const { signOut } = useAuthActions()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }} className="no-drag">
      <button
        className="tb-btn"
        style={{ width: 26, height: 26 }}
        aria-label="Settings"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="settings" size={15} style={{ opacity: 0.7 }} />
      </button>

      {open && (
        <div
          className="menu"
          style={{ position: 'absolute', bottom: 32, right: 0 }}
        >
          <div className="menu-label">Appearance</div>
          <button
            className="menu-item"
            onClick={() => theme.setMode('light')}
          >
            <Icon name="sun" size={15} /> Light
            {theme.mode === 'light' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>
          <button className="menu-item" onClick={() => theme.setMode('dark')}>
            <Icon name="moon" size={15} /> Dark
            {theme.mode === 'dark' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>

          <div className="menu-sep" />
          <div className="menu-label">Density</div>
          <button
            className="menu-item"
            onClick={() => theme.setDensity('comfortable')}
          >
            <Icon name="rows" size={15} /> Comfortable
            {theme.density === 'comfortable' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>
          <button
            className="menu-item"
            onClick={() => theme.setDensity('compact')}
          >
            <Icon name="list" size={15} /> Compact
            {theme.density === 'compact' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>

          <div className="menu-sep" />
          <div className="menu-label">Editor font</div>
          <button className="menu-item" onClick={() => theme.setFont('sans')}>
            <Icon name="text" size={15} /> Sans
            {theme.font === 'sans' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>
          <button className="menu-item" onClick={() => theme.setFont('serif')}>
            <Icon name="quote" size={15} /> Serif
            {theme.font === 'serif' && (
              <span className="chk">
                <Icon name="check" size={14} sw={2.4} />
              </span>
            )}
          </button>
          <div className="menu-sep" />
          <button
            className="menu-item"
            onClick={async () => {
              setOpen(false)
              await signOut()
              navigate({ to: '/login', replace: true })
            }}
          >
            <Icon name="enter" size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
