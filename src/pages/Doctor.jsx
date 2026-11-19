import { useEffect } from 'react'
import { SITE_TITLE } from '../constants/site.js'
import { Link } from 'react-router-dom'
import DoctorCard, { DoctorCardSkeleton } from '../components/DoctorCard.jsx'
import { Icon, StatePanel } from '../components/CourseCard.jsx'
import { COUNSELLOR_TEL, buttonOutline, buttonPrimary, icons } from '../components/courseUi.js'
import { FACULTY_CONFIRMED, useFaculty } from '../data/facultyApi.js'

const SKELETON_COUNT = 4

const userIcon = 'M12 12a4 4 0 100-8 4 4 0 000 8z M4 21a8 8 0 0116 0'

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0 text-brand-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

// Faint operating-lamp rings + a running suture stitch behind the header (decorative)
function HeaderArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 260"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-64 w-full opacity-60 md:h-72"
    >
      <g className="stroke-brand" strokeOpacity="0.18" strokeWidth="1" fill="none">
        <circle cx="140" cy="90" r="34" />
        <circle cx="140" cy="90" r="58" />
        <circle cx="860" cy="120" r="40" />
        <circle cx="860" cy="120" r="70" />
        <circle cx="860" cy="120" r="100" strokeDasharray="2 6" />
      </g>
      {[[140, 90], [860, 120]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" className="fill-brand" fillOpacity="0.22" />
      ))}

      {/* Decorative suture line */}
      <path
        d="M0 240 C120 226 220 252 340 238 S580 224 700 240 S900 252 1000 236"
        fill="none"
        className="stroke-accent"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        strokeDasharray="14 10"
      />
    </svg>
  )
}

const gridClass =
  'grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-2 min-[641px]:gap-6 min-[1001px]:grid-cols-4'

function Doctor() {
  const { status, doctors, retry } = useFaculty()

  useEffect(() => {
    document.title = SITE_TITLE
  }, [])

  const ready = status === 'ready'

  return (
    <div className="font-body text-body">
      <section className="relative overflow-hidden bg-page">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />

        <HeaderArt />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:pt-10">
          <header className="mx-auto max-w-2xl pt-6 text-center md:pt-10">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
              <span aria-hidden="true" className="h-px w-8 bg-brand-ink" />
              Our Medical Experts
              <span aria-hidden="true" className="h-px w-8 bg-brand-ink" />
            </span>

            <h1 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.15] tracking-tight text-ink">
              Meet Our{' '}
              <span className="bg-linear-to-r from-brand-ink to-accent bg-clip-text italic text-transparent">
                Expert Faculty
              </span>
            </h1>

            <p className="mx-auto mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Browse our faculty by department and open a profile to see each doctor&apos;s
              qualifications.
            </p>
          </header>

          {/* Loading message for screen readers (the skeleton cards are hidden from them) */}
          <p role="status" aria-live="polite" className="sr-only">
            {status === 'loading' && 'Loading doctors…'}
          </p>

          {status === 'loading' && (
            <div aria-busy="true" className={`mt-10 md:mt-12 ${gridClass}`}>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <DoctorCardSkeleton key={i} cover />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div role="alert" className="mt-10 md:mt-12">
              <StatePanel
                title="We couldn't load our doctors"
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
            </div>
          )}

          {ready && doctors.length === 0 && (
            <div className="mt-10 md:mt-12">
              <StatePanel
                icon={userIcon}
                title="Our faculty list is being updated"
                actions={
                  <Link to="/courses" className={buttonPrimary}>
                    View courses
                  </Link>
                }
              >
                Please check back soon.
              </StatePanel>
            </div>
          )}

          {ready && doctors.length > 0 && (
            <ul className={`mt-10 md:mt-12 ${gridClass}`}>
              {doctors.map((doctor) => (
                <li key={doctor.id} className="min-w-0">
                  <DoctorCard doctor={doctor} cover to={`/doctor/${doctor.id}`} />
                </li>
              ))}
            </ul>
          )}

          {/* Only shown once the faculty and their credentials are confirmed. */}
          {FACULTY_CONFIRMED && ready && doctors.length > 0 && (
            <div className="mt-12 flex justify-center md:mt-14">
              <div className="inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[0.82rem] text-slate-600 shadow-card sm:px-5 sm:text-sm">
                <ShieldIcon />
                <span>All doctors are verified · CPD &amp; ACTD accredited</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-hero-dark py-14 text-white md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />

        <div className="relative mx-auto flex max-w-[1160px] flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Want to learn from{' '}
            <span className="bg-linear-to-r from-brand to-glow bg-clip-text text-transparent">our faculty?</span>
          </h2>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-brand px-7 text-sm font-semibold text-ink transition-colors hover:bg-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              View Courses
            </Link>

            <a
              href={COUNSELLOR_TEL}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Talk to Counsellor
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Doctor
