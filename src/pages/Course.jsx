import { useEffect, useId, useMemo, useState } from 'react'
import { SITE_TITLE } from '../constants/site.js'
import { useSearchParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { COURSE_DISCLAIMER_BODY, COURSE_DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import CourseCard, { CourseCardSkeleton, Icon, StatePanel } from '../components/CourseCard.jsx'
import { COUNSELLOR_TEL, buttonOutline, buttonPrimary, icons } from '../components/courseUi.js'
import FaqSection from '../components/FaqSection.jsx'
import { typeLabel, useSurgeryCourses } from '../data/surgeryCourseApi.js'
import { surgeryFaqs } from '../data/surgeryFaqs.js'

// Filter buttons follow this order; any other type from the API is added after these.
const TYPE_ORDER = ['Fellowship', 'Pg Diploma', 'Certificate']
const rank = (type) => {
  const i = TYPE_ORDER.indexOf(type)
  return i === -1 ? TYPE_ORDER.length : i
}

const ALL = 'All'

function Course() {
  const { status, courses, retry } = useSurgeryCourses()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const searchId = useId()

  useEffect(() => {
    document.title = SITE_TITLE
  }, [])

  const types = useMemo(
    () => [...new Set(courses.map((c) => c.type).filter(Boolean))].sort((a, b) => rank(a) - rank(b)),
    [courses]
  )

  // The type filter lives in the URL (?type=Fellowship), so footer links, the back button and
  // shared links all work. Matched case-insensitively against the types in the loaded data;
  // a type that isn't there falls back to All (with a note once the data has loaded).
  const typeParam = (searchParams.get('type') || '').trim()
  const matchedType = typeParam
    ? types.find((t) => t.toLowerCase() === typeParam.toLowerCase())
    : undefined
  const type = matchedType ?? ALL
  const unknownType = status === 'ready' && typeParam && !matchedType ? typeParam : ''

  const selectType = (t) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (t === ALL) next.delete('type')
        else next.set('type', t)
        return next
      },
      { replace: true }
    )
  }

  const countByType = useMemo(() => {
    const counts = { [ALL]: courses.length }
    for (const c of courses) counts[c.type] = (counts[c.type] || 0) + 1
    return counts
  }, [courses])

  const q = query.trim().toLowerCase()
  const filtered = courses.filter(
    (c) => (type === ALL || c.type === type) && (!q || c.title.toLowerCase().includes(q))
  )
  const clearFilters = () => {
    selectType(ALL)
    setQuery('')
  }

  const ready = status === 'ready'
  // Filters only make sense while loading (shown disabled) or when there are courses to filter
  const showFilters = status === 'loading' || (ready && courses.length > 0)

  return (
    <div className="font-body text-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 md:pt-14 md:pb-20">
          <div className="flex items-center gap-3 motion-safe:animate-fade-up">
            <span className="h-px w-8 shrink-0 bg-brand sm:w-12" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Courses</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl motion-safe:animate-fade-up [animation-delay:100ms]">
            Surgery{' '}
            <span className="bg-linear-to-r from-brand to-glow bg-clip-text text-transparent">Courses</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
            Fellowships, PG Diplomas and Certificates in surgery from Medical Global Academy.
            Choose a program to see its details and fees, or talk to a counsellor for guidance.
          </p>
        </div>
      </section>

      {/* Filters + list */}
      <section className="bg-page py-12 md:py-16" aria-labelledby={`${searchId}-heading`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id={`${searchId}-heading`} className="sr-only">
            Browse surgery courses
          </h2>

          {/* Course disclaimer (same text as the Footer note), shown once above the list */}
          <p
            role="note"
            className="mb-8 flex items-start gap-2.5 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm leading-relaxed text-slate-700"
          >
            <Info size={16} strokeWidth={2.25} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-ink" />
            <span className="min-w-0">
              <strong className="font-semibold text-brand-ink">{COURSE_DISCLAIMER_LABEL}</strong>{' '}
              {COURSE_DISCLAIMER_BODY}
            </span>
          </p>

          {showFilters && (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div role="group" aria-label="Filter by course type" className="flex flex-wrap gap-2">
                {[ALL, ...types].map((t) => {
                  const active = type === t
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={active}
                      disabled={!ready}
                      onClick={() => selectType(t)}
                      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? 'border-deep bg-deep text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand-ink'
                      }`}
                    >
                      {t === ALL ? 'All' : typeLabel(t)}
                      {ready && (
                        <span className={`text-xs font-medium ${active ? 'text-white/80' : 'text-slate-500'}`}>
                          {countByType[t] || 0}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full lg:max-w-xs">
                <label htmlFor={searchId} className="sr-only">
                  Search courses by title
                </label>
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <Icon path={icons.search} className="h-4 w-4" />
                </span>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={!ready}
                  placeholder="Search by course title"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm text-ink placeholder:text-slate-500 transition focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none disabled:opacity-60"
                />
              </div>
            </div>
          )}

          {/* Live count for screen readers and sighted users */}
          <p role="status" aria-live="polite" className="mt-5 min-h-5 text-sm text-slate-600">
            {status === 'loading' && 'Loading courses…'}
            {ready && courses.length > 0 && `Showing ${filtered.length} of ${courses.length} courses`}
          </p>

          {unknownType && courses.length > 0 && (
            <p className="mt-3 rounded-lg border border-glow/60 bg-glow/15 px-4 py-3 text-sm text-deep">
              No {typeLabel(unknownType)} courses are listed right now. Showing all courses.
            </p>
          )}

          <div className="mt-6">
            {status === 'loading' && (
              <div aria-busy="true" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            )}

            {status === 'error' && (
              <StatePanel
                title="We couldn't load the courses"
                actions={
                  <>
                    <button type="button" onClick={retry} className={buttonPrimary}>
                      Try again
                    </button>
                    <a href={COUNSELLOR_TEL} className={buttonOutline}>
                      <Icon path={icons.phone} className="h-4 w-4" />
                      Call a counsellor
                    </a>
                  </>
                }
              >
                Please check your connection and try again, or call us on +91 9310027474.
              </StatePanel>
            )}

            {ready && courses.length === 0 && (
              <StatePanel
                icon={icons.book}
                title="No surgery courses right now"
                actions={
                  <a href={COUNSELLOR_TEL} className={buttonPrimary}>
                    <Icon path={icons.phone} className="h-4 w-4" />
                    Talk to Counsellor
                  </a>
                }
              >
                Please check back soon, or talk to a counsellor about upcoming programs.
              </StatePanel>
            )}

            {ready && courses.length > 0 && filtered.length === 0 && (
              <StatePanel
                icon={icons.search}
                title="No courses match your filters"
                actions={
                  <button type="button" onClick={clearFilters} className={buttonPrimary}>
                    Clear filters
                  </button>
                }
              >
                Try another course type or a shorter search term.
              </StatePanel>
            )}

            {ready && filtered.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <FaqSection
        variant="dark"
        defaultOpen={0}
        title="Frequently asked questions from our students"
        items={surgeryFaqs}
      />
    </div>
  )
}

export default Course
