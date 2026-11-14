import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MAIN_SITE_URL, coursesOfType, legalPolicies, mainPages } from '../data/siteLinks.js'
import { typeLabel, useSurgeryCourses } from '../data/surgeryCourseApi.js'

const focusRing =
  'rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

// Same order as the Courses page filter
const TYPE_ORDER = ['Fellowship', 'Pg Diploma', 'Certificate']
const rank = (type) => {
  const i = TYPE_ORDER.indexOf(type)
  return i === -1 ? TYPE_ORDER.length : i
}

// Every legal page now has a route in App.jsx
const legalLive = legalPolicies

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const icons = {
  home: 'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6',
  doctor: 'M12 12a4 4 0 100-8 4 4 0 000 8z M4 21a8 8 0 0116 0',
  building: 'M4 21V5l8-3 8 3v16 M9 21v-4h6v4 M9 9h.01 M15 9h.01 M9 13h.01 M15 13h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z M9 12l2 2 4-4',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  external: 'M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6',
}

function Icon({ path, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}

// Each card gets its own colour: top bar, icon tile and link hover. Full class strings so Tailwind finds them.
const staticGroups = [
  {
    heading: 'Main pages',
    icon: icons.home,
    bar: 'from-brand to-glow',
    tile: 'bg-brand/15 text-brand-ink',
    hover: 'group-hover/link:text-brand-ink',
    links: mainPages,
  },
  {
    heading: 'Doctors',
    icon: icons.doctor,
    bar: 'from-accent to-accent-soft',
    tile: 'bg-accent/10 text-accent',
    hover: 'group-hover/link:text-accent',
    links: [{ to: '/doctor', label: 'Our doctors' }],
  },
  {
    heading: 'Company',
    icon: icons.building,
    bar: 'from-deep to-brand',
    tile: 'bg-deep/10 text-deep',
    hover: 'group-hover/link:text-deep',
    links: [
      { to: '/about', label: 'About us' },
      { href: MAIN_SITE_URL, label: 'Main website' },
    ],
  },
  {
    heading: 'Legal',
    icon: icons.shield,
    bar: 'from-brand-ink to-accent',
    tile: 'bg-brand-ink/10 text-brand-ink',
    hover: 'group-hover/link:text-brand-ink',
    links: legalLive,
  },
]

// Colours per course type, matching the type badges on the course cards
const typeStyles = {
  Fellowship: { card: 'from-deep to-ink', chip: 'bg-brand text-ink', dot: 'bg-brand' },
  'Pg Diploma': { card: 'from-accent to-[#b8392a]', chip: 'bg-white text-accent', dot: 'bg-accent' },
  Certificate: { card: 'from-brand-ink to-deep', chip: 'bg-glow text-deep', dot: 'bg-glow' },
}
const fallbackStyle = { card: 'from-slate-600 to-slate-800', chip: 'bg-white text-slate-700', dot: 'bg-slate-400' }

function LinkList({ links, hover = 'group-hover/link:text-brand-ink' }) {
  return (
    <ul className="grid gap-1">
      {links.map((l) => {
        const inner = (
          <>
            <span className={`transition-colors ${hover}`}>{l.label}</span>
            <Icon
              path={l.href ? icons.external : icons.arrow}
              className={`h-4 w-4 shrink-0 text-slate-300 transition duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none ${hover}`}
            />
          </>
        )
        const cls = `group/link -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-[15px] font-medium text-slate-700 transition-colors hover:bg-page ${focusRing}`
        return (
          <li key={l.label}>
            {l.href ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link to={l.to} className={cls}>
                {inner}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Sitemap() {
  const { status, courses, retry } = useSurgeryCourses()

  useEffect(() => {
    document.title = 'Sitemap | Medical Global Academy'
    window.scrollTo(0, 0)
  }, [])

  // Every surgery course from the live API, grouped by type
  const groups = useMemo(() => {
    const byType = {}
    for (const c of courses) (byType[c.type || 'Other'] ||= []).push(c)
    return Object.entries(byType)
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([type, list]) => [type, [...list].sort((a, b) => a.title.localeCompare(b.title))])
  }, [courses])

  const countOf = (type) => groups.find(([t]) => t === type)?.[1].length
  const ready = status === 'ready'

  const stats = [
    { value: mainPages.length + legalLive.length + 1, label: 'Site pages' },
    { value: ready ? courses.length : '…', label: 'Surgery courses' },
    { value: TYPE_ORDER.length, label: 'Course types' },
  ]

  return (
    <div className="font-body text-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-6 pb-24 sm:px-6 md:pt-10 md:pb-28">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <li>
                <Link to="/" className={`hover:text-glow ${focusRing} focus-visible:ring-offset-ink`}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">
                Sitemap
              </li>
            </ol>
          </nav>

          <div className="mt-10 flex items-center gap-3 motion-safe:animate-fade-up">
            <span className="h-px w-8 shrink-0 bg-brand sm:w-12" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Sitemap</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl motion-safe:animate-fade-up [animation-delay:100ms]">
            Find your way{' '}
            <span className="bg-linear-to-r from-brand via-glow to-accent-soft bg-clip-text text-transparent">
              around the site
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
            Every page and every surgery course from Medical Global Academy, in one place.
          </p>

          <dl className="mt-9 flex flex-wrap gap-3 motion-safe:animate-fade-up [animation-delay:300ms]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 backdrop-blur-sm"
              >
                <dd className="font-display text-xl font-bold text-glow tabular-nums">{s.value}</dd>
                <dt className="text-sm text-slate-300">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Page groups: cards pulled up over the hero */}
      <section className="relative bg-page pb-14 md:pb-20">
        <div className="relative mx-auto -mt-14 grid max-w-[1160px] gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {staticGroups.map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div aria-hidden="true" className={`h-1.5 bg-linear-to-r ${group.bar}`} />
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.tile}`}>
                    <Icon path={group.icon} className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-lg font-semibold text-ink">{group.heading}</h2>
                </div>
                <LinkList links={group.links} hover={group.hover} />
              </div>
            </nav>
          ))}
        </div>

        {/* Courses */}
        <nav aria-labelledby="sitemap-courses" className="mx-auto mt-16 max-w-[1160px] px-4 sm:px-6 md:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
                <span aria-hidden="true" className="h-px w-8 bg-brand-ink" />
                Programs
              </span>
              <h2 id="sitemap-courses" className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
                Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className={`group/all inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deep ${focusRing}`}
            >
              All courses
              <Icon path={icons.arrow} className="h-4 w-4 text-brand transition-transform group-hover/all:translate-x-0.5" />
            </Link>
          </div>

          {/* One colourful tile per course type */}
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {TYPE_ORDER.map((t) => {
              const s = typeStyles[t]
              const n = countOf(t)
              return (
                <li key={t}>
                  <Link
                    to={coursesOfType(t)}
                    className={`group/type relative flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br ${s.card} p-6 text-white transition duration-300 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                  >
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
                    <span className={`relative inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}>
                      {ready && n ? `${n} courses` : 'Courses'}
                    </span>
                    <span className="relative mt-6 font-display text-2xl font-bold">{typeLabel(t)}</span>
                    <span className="relative mt-1 inline-flex items-center gap-2 text-sm text-white/80">
                      Browse {typeLabel(t)} courses
                      <Icon path={icons.arrow} className="h-4 w-4 transition-transform group-hover/type:translate-x-1" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Every course, by type */}
          <div className="mt-10">
            {status === 'loading' && (
              <div aria-busy="true" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200/70 motion-reduce:animate-none" />
                ))}
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-6 text-sm text-slate-700">
                We couldn&apos;t load the course list.{' '}
                <button type="button" onClick={retry} className={`font-semibold text-brand-ink hover:underline ${focusRing}`}>
                  Try again
                </button>
              </div>
            )}

            {ready && courses.length === 0 && (
              <p className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-card">
                No surgery courses are listed right now.
              </p>
            )}

            {ready && courses.length > 0 && (
              <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
                {groups.map(([type, list]) => {
                  const s = typeStyles[type] ?? fallbackStyle
                  return (
                    <section
                      key={type}
                      aria-labelledby={`sitemap-type-${type}`}
                      className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card"
                    >
                      <h3
                        id={`sitemap-type-${type}`}
                        className="mb-3 flex items-center gap-2.5 font-display text-base font-semibold text-ink"
                      >
                        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                        {typeLabel(type)}
                        <span className="ml-auto rounded-full bg-page px-2.5 py-0.5 text-xs font-semibold text-slate-500 tabular-nums">
                          {list.length}
                        </span>
                      </h3>
                      <LinkList links={list.map((c) => ({ to: `/courses/${c.slug}`, label: c.title }))} />
                    </section>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </section>
    </div>
  )
}

export default Sitemap



