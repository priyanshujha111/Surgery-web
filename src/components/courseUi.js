// Shared constants for the course pages (kept out of CourseCard.jsx so that file only exports
// components, which Vite fast refresh needs).

export const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
export const icons = {
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4',
  alert: 'M12 9v4 M12 17h.01 M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
}

export const buttonPrimary = `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-ink transition-colors hover:bg-glow ${focusRing}`
export const buttonOutline = `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-deep/30 px-6 text-sm font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white ${focusRing}`

export const COUNSELLOR_TEL = 'tel:+919310027474'
