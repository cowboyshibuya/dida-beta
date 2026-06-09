/** Relative-ish date label matching the design ("Today", "Yesterday", "Mon", "Sep 24"). */
export function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOf(now) - startOf(d)) / 86_400_000)

  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)
    return d.toLocaleDateString(undefined, { weekday: 'short' })
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
}

/** "Edited 2h ago" style label. */
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/** Rough reading-time from a plaintext snippet/body. */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

export function noteTitle(title: string): string {
  return title.trim() || 'Untitled'
}
