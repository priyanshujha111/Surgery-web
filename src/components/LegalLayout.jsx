import { useEffect, useRef, useState } from 'react'
import { SITE_TITLE } from '../constants/site.js'
import { Link, useLocation } from 'react-router-dom'
import { legalPolicies } from '../data/siteLinks.js'

const focusRing =
  'rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const icons = {
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  list: 'M9 6h11 M9 12h11 M9 18h11 M4 6h.01 M4 12h.01 M4 18h.01',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  up: 'M12 19V5 M6 11l6-6 6 6',
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

// Shared shell for the legal pages (Terms, Privacy, Refund).
// `sections` = [{ id, title, content }]; ids become the "On this page" anchors.
function LegalLayout({ title, updated, intro, sections, children }) {
  const { pathname, hash } = useLocation()
  const articleRef = useRef(null)
  const [readMinutes, setReadMinutes] = useState(null)

  useEffect(() => {
    document.title = SITE_TITLE
  }, [title])

  // Start at the top unless the link points at a section
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  // Reading time from the rendered text (~200 words a minute)
  useEffect(() => {
    const words = articleRef.current?.textContent.trim().split(/\s+/).length ?? 0
    setReadMinutes(Math.max(1, Math.round(words / 200)))
  }, [sections])

  const related = legalPolicies.filter((p) => p.to !== pathname)

  // Last word of the title in the brand gradient
  const split = title.lastIndexOf(' ')
  const titleStart = split === -1 ? '' : title.slice(0, split + 1)
  const titleEnd = split === -1 ? title : title.slice(split + 1)

  const chips = [
    { icon: icons.calendar, label: `Last updated: ${updated}` },
    { icon: icons.list, label: `${sections.length} sections` },
    readMinutes && { icon: icons.clock, label: `${readMinutes} min read` },
  ].filter(Boolean)

  return (
    <div id="top" className="font-body text-body">
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-6 pb-14 sm:px-6 md:pt-10 md:pb-20">
          <header className="mt-4 max-w-3xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand motion-safe:animate-fade-up">
              <span aria-hidden="true" className="h-px w-8 bg-brand sm:w-12" />
              Legal
            </span>
            <h1 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.15] tracking-tight motion-safe:animate-fade-up [animation-delay:100ms]">
              {titleStart}
              <span className="bg-linear-to-r from-brand via-glow to-accent-soft bg-clip-text text-transparent">
                {titleEnd}
              </span>
            </h1>
            {intro && (
              <p className="mt-5 text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
                {intro}
              </p>
            )}

            <ul className="mt-8 flex flex-wrap gap-3 motion-safe:animate-fade-up [animation-delay:300ms]">
              {chips.map((c) => (
                <li
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200 backdrop-blur-sm"
                >
                  <Icon path={c.icon} className="h-4 w-4 text-glow" />
                  {c.label}
                </li>
              ))}
            </ul>
          </header>
        </div>
      </section>

      <div className="bg-page">
        <div className="mx-auto grid max-w-[1160px] gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Table of contents; sticks beside the text on wide screens */}
          <nav
            aria-labelledby="toc-heading"
            className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card lg:sticky lg:top-28 lg:self-start"
          >
            <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-brand via-glow to-accent" />
            <div className="p-5">
              <h2 id="toc-heading" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                On this page
              </h2>
              <ol className="mt-4 space-y-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`group/toc flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-page hover:text-brand-ink ${focusRing}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[11px] font-bold text-brand-ink tabular-nums transition-colors group-hover/toc:bg-brand group-hover/toc:text-ink">
                        {i + 1}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article ref={articleRef} className="min-w-0 max-w-3xl space-y-5">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-heading`}
                className="scroll-mt-28 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-glow motion-reduce:transition-none md:p-8"
              >
                <h2 id={`${s.id}-heading`} className="flex items-center gap-3 font-display text-xl font-semibold text-ink md:text-2xl">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand to-brand-ink text-sm font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {s.content}
                </div>
              </section>
            ))}

            {children}

            <div className="relative mt-10 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-2xl bg-hero-dark p-6 text-white md:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
              <div className="relative">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Related policies</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {related.map((p) => (
                    <li key={p.to}>
                      <Link
                        to={p.to}
                        className={`group/rel inline-flex items-center gap-1.5 font-medium text-glow hover:text-white ${focusRing} focus-visible:ring-offset-ink`}
                      >
                        {p.label}
                        <Icon path={icons.arrow} className="h-4 w-4 transition-transform group-hover/rel:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#top"
                className={`relative inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-glow ${focusRing} focus-visible:ring-offset-ink`}
              >
                <Icon path={icons.up} className="h-4 w-4" />
                Back to top
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default LegalLayout
