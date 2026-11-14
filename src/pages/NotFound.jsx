import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../components/CourseCard.jsx'
import { buttonPrimary, focusRing, icons } from '../components/courseUi.js'
import { PHONE_DISPLAY, PHONE_HREF } from '../data/siteLinks.js'

const arrowIcon = 'M5 12h14 M13 6l6 6-6 6'

const nextSteps = [
  {
    to: '/courses',
    label: 'Surgery courses',
    text: 'Browse our Fellowship, PG Diploma and Certificate programs.',
    icon: icons.book,
  },
  {
    to: '/about',
    label: 'About us',
    text: 'Learn more about Medical Global Academy.',
    icon: 'M4 21V5l8-3 8 3v16 M9 21v-4h6v4 M9 9h.01 M15 9h.01 M9 13h.01 M15 13h.01',
  },
  {
    to: '/sitemap',
    label: 'Sitemap',
    text: 'See every page and course in one place.',
    icon: icons.search,
  },
]

function NotFound() {
  const { pathname } = useLocation()
  const originalTitle = useRef(document.title)

  // Page title; restored when leaving the page
  useEffect(() => {
    const previous = originalTitle.current
    document.title = 'Page not found | Medical Global Academy'
    window.scrollTo(0, 0)
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="font-body text-body">
      {/* The app is client-rendered, so this tells search engines not to index the URL */}
      <meta name="robots" content="noindex" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-14 pb-28 sm:px-6 md:pt-20 md:pb-32">
          <p
            aria-hidden="true"
            className="bg-linear-to-r from-brand via-glow to-accent-soft bg-clip-text font-display text-7xl font-bold leading-none tracking-tight text-transparent sm:text-8xl motion-safe:animate-fade-up"
          >
            404
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl motion-safe:animate-fade-up [animation-delay:100ms]">
            Page not found
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
            We couldn&apos;t find <span className="font-semibold break-all text-white">{pathname}</span>. The link may be
            out of date, or the address may have a typo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row motion-safe:animate-fade-up [animation-delay:300ms]">
            <Link to="/" className={`${buttonPrimary} focus-visible:ring-offset-ink`}>
              Back to home
            </Link>
            <a
              href={PHONE_HREF}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 ${focusRing} focus-visible:ring-offset-ink`}
            >
              <Icon path={icons.phone} className="h-4 w-4" />
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Where to go next: cards pulled up over the hero */}
      {/* flow-root stops the cards' negative margin collapsing through this section */}
      <section className="relative flow-root bg-page pb-14 md:pb-20">
        <nav aria-label="Popular pages" className="relative mx-auto -mt-14 max-w-[1160px] px-4 sm:px-6">
          <ul className="grid gap-5 md:grid-cols-3">
            {nextSteps.map((step) => (
              <li key={step.to}>
                <Link
                  to={step.to}
                  className={`group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-ink">
                    <Icon path={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="mt-4 flex items-center justify-between gap-3 font-display text-lg font-semibold text-ink">
                    {step.label}
                    <Icon
                      path={arrowIcon}
                      className="h-4 w-4 shrink-0 text-brand-ink transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                  <span className="mt-1 text-sm leading-relaxed text-slate-600">{step.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  )
}

export default NotFound
