import { useState } from 'react'
import { Link } from 'react-router-dom'
import { durationLabel, startLabel, typeBadgeClass, typeLabel } from '../data/surgeryCourseApi.js'
import { focusRing, icons } from './courseUi.js'

// Course cards and the shared loading / message states for the Courses and Course detail pages.

export function Icon({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

const cardClass =
  'group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0'

// Course image block shared by the Courses page cards and the Home "Trending Courses" cards.
// Renders nothing when the course has no image or the image fails to load, so the card
// simply closes up. The parent card needs the `group` class for the hover zoom.
export function CourseCardImage({ src }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (!src || imgFailed) return null

  return (
    <div className="aspect-[776/450] overflow-hidden bg-page">
      {/* The card title names the course, so the image is decorative */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setImgFailed(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  )
}

function CourseCard({ course }) {
  const duration = durationLabel(course.durationMonths)

  return (
    <article className={cardClass}>
      <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-brand to-accent" />
      <CourseCardImage key={course.image} src={course.image} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-2.5 py-1 text-xs font-bold tracking-wider uppercase ${typeBadgeClass(course.type)}`}>
            {typeLabel(course.type)}
          </span>
          {course.actd && (
            <span className="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/5 px-2 py-1 text-xs font-semibold text-ink">
              <Icon path={icons.check} className="h-3.5 w-3.5 text-brand-ink" strokeWidth={2.2} />
              ACTD
            </span>
          )}
          {course.isTop && (
            <span className="rounded-md bg-deep px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Top
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold text-ink">{course.title}</h3>

        {/* flex-1 on a wrapper, not the clamped <p>, or a 4th line peeks out below the clamp */}
        <div className="mt-2 flex-1">
          <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">{course.description}</p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm">
          {duration && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                <Icon path={icons.clock} className="h-3.5 w-3.5" />
                Duration
              </dt>
              <dd className="mt-0.5 font-semibold text-ink">{duration}</dd>
            </div>
          )}
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-slate-500">
              <Icon path={icons.calendar} className="h-3.5 w-3.5" />
              Starts
            </dt>
            <dd className="mt-0.5 font-semibold text-ink">{startLabel(course.startDate)}</dd>
          </div>
          {course.fee && (
            <div className="col-span-2 flex items-baseline justify-between gap-3 border-t border-slate-100 pt-3">
              <dt className="text-xs text-slate-500">Registration Fee</dt>
              <dd className="font-display text-base font-semibold text-ink">{course.fee}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex gap-3">
          <Link
            to={`/courses/${course.slug}`}
            className={`flex-1 rounded-lg border border-deep/30 px-4 py-2 text-center text-sm font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white ${focusRing}`}
          >
            View Details
            <span className="sr-only">: {course.title}</span>
          </Link>
          <Link
            to={`/courses/${course.slug}#enroll`}
            className={`flex-1 rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-glow ${focusRing}`}
          >
            Enroll Now
            <span className="sr-only">: {course.title}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export function CourseCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white motion-safe:animate-pulse">
      <div className="h-1.5 bg-slate-200" />
      <div className="aspect-[776/450] bg-slate-100" />
      <div className="flex flex-1 flex-col p-6">
        <div className="h-6 w-24 rounded-md bg-slate-200" />
        <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
        <div className="mt-3 space-y-2">
          <div className="h-3.5 rounded bg-slate-100" />
          <div className="h-3.5 rounded bg-slate-100" />
          <div className="h-3.5 w-2/3 rounded bg-slate-100" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="h-8 rounded bg-slate-100" />
          <div className="h-8 rounded bg-slate-100" />
        </div>
        <div className="mt-6 flex gap-3">
          <div className="h-9 flex-1 rounded-lg bg-slate-200" />
          <div className="h-9 flex-1 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

// Centred message card for error / empty / no-results / not-found states
export function StatePanel({ icon = icons.alert, title, children, actions }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand-ink ring-1 ring-brand/20">
        <Icon path={icon} className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h2>
      {children && <div className="mt-2 leading-relaxed text-slate-600">{children}</div>}
      {actions && <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>}
    </div>
  )
}

export default CourseCard
