// Dida — minimal line icons (1.6px stroke, 24px grid), ported from the design.
import type { CSSProperties } from 'react'

const ICN = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  sidebar: ['M4 5.5h16v13H4zM9.5 5.5v13'],
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  share: [
    'M12 3v13',
    'M8 7l4-4 4 4',
    'M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6',
  ],
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  hash: 'M9 4 7 20M17 4l-2 16M5 9h14M4 15h14',
  tag: ['M4 4h7l9 9-7 7-9-9V4Z', 'M8 8h.01'],
  doc: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6M10 17h6'],
  code: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  film: ['M4 5h16v14H4z', 'M4 9h16M4 15h16M9 5v14M15 5v14'],
  pin: 'M9 4h6l-1 6 3 3H7l3-3-1-6Z M12 13v7',
  check: 'M5 12l5 5 9-11',
  sun: [
    'M12 4v2M12 18v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  ],
  moon: 'M20 14a8 8 0 1 1-9-11 6.5 6.5 0 0 0 9 11Z',
  settings: [
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    'M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5c.06-.3.1-.66.1-1Z',
  ],
  clock: ['M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z', 'M12 8v4l3 2'],
  sort: 'M7 5v14M7 19l-3-3M7 5l3 3M14 7h7M14 12h5M14 17h3',
  enter: 'M20 6v5a2 2 0 0 1-2 2H5M9 9l-4 4 4 4',
  arrU: 'M12 19V5M6 11l6-6 6 6',
  arrD: 'M12 5v14M18 13l-6 6-6-6',
  cmd: 'M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z',
  link: [
    'M10 14a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-6-6l-1.5 1.5',
    'M14 10a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 6 6l1.5-1.5',
  ],
  pdf: ['M7 3h7l5 5v13H7z', 'M14 3v5h5'],
  rows: 'M4 7h16M4 12h16M4 17h16',
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  quote: 'M9 7H6a2 2 0 0 0-2 2v3h5V7ZM20 7h-3a2 2 0 0 0-2 2v3h5V7Z',
  bulb: [
    'M9 18h6',
    'M10 21h4',
    'M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z',
  ],
  h1: 'M4 6v12M12 6v12M4 12h8',
  todo: ['M4 6h.01M4 12h.01M4 18h.01', 'M9 6h11M9 12h11M9 18h11'],
  copy: ['M9 9h10v10H9z', 'M5 15V5h10'],
  play: 'M8 5l11 7-11 7V5Z',
  star: 'M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16l-5 3 1.2-5.6L4 9.6 9.6 9 12 4Z',
  inbox: ['M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5'],
  text: 'M6 6h12M6 6v12M10 6v12M14 18h-4',
  image: ['M4 5h16v14H4z', 'M4 16l4-4 3 3 4-5 5 6'],
  divider: 'M4 12h16',
  cornerDown: 'M4 5v6a3 3 0 0 0 3 3h13M16 10l4 4-4 4',
  trash: [
    'M5 7h14',
    'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
    'M6 7l1 13h10l1-13',
  ],
} as const

export type IconName = keyof typeof ICN

export function Icon({
  name,
  size = 16,
  sw = 1.6,
  fill = 'none',
  style,
}: {
  name: IconName
  size?: number
  sw?: number
  fill?: string
  style?: CSSProperties
}) {
  const raw = ICN[name]
  const paths: readonly string[] = Array.isArray(raw) ? raw : [raw as string]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  )
}
