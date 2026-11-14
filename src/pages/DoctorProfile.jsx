import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DoctorAvatar } from '../components/DoctorCard.jsx'
import { Icon, StatePanel } from '../components/CourseCard.jsx'
import { COUNSELLOR_TEL, buttonOutline, buttonPrimary, focusRing, icons } from '../components/courseUi.js'
import { useFaculty } from '../data/facultyApi.js'
import NotFound from './NotFound.jsx'

const backIcon = 'M19 12H5 M11 18l-6-6 6-6'

// Larger avatar for the profile header. The base avatar styles come from DoctorCard's
// stylesheet, which is only loaded with a card, so the few rules needed are repeated here.
const avatarStyles = `
.doctor-profile-avatar.doctor-card-avatar {
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(145deg, color-mix(in srgb, var(--color-brand) 18%, white), color-mix(in srgb, var(--color-accent) 14%, white));
  color: var(--color-deep);
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
}
`

function BackLink({ light = false }) {
  return (
    <Link
      to="/doctor"
      className={`inline-flex items-center gap-2 rounded text-sm font-semibold transition-colors motion-reduce:transition-none ${focusRing} ${
        light ? 'text-glow hover:text-white focus-visible:ring-offset-ink' : 'text-brand-ink hover:text-deep'
      }`}
    >
      <Icon path={backIcon} className="h-4 w-4" />
      All doctors
    </Link>
  )
}

function ProfileSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="bg-hero-dark">
        <div className="mx-auto max-w-[1160px] px-4 pt-10 pb-14 sm:px-6 md:pt-14 motion-safe:animate-pulse">
          <div className="h-4 w-24 rounded bg-white/15" />
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="h-[136px] w-[136px] shrink-0 rounded-full bg-white/15" />
            <div className="w-full max-w-md space-y-3">
              <div className="mx-auto h-9 w-3/4 rounded bg-white/20 sm:mx-0" />
              <div className="mx-auto h-4 w-1/2 rounded bg-white/10 sm:mx-0" />
              <div className="mx-auto h-7 w-32 rounded-md bg-white/10 sm:mx-0" />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-page py-12">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 motion-safe:animate-pulse">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-8">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      </section>
    </div>
  )
}

function DoctorProfile() {
  const { id } = useParams()
  const { status, doctors, retry } = useFaculty()
  const originalTitle = useRef(document.title)

  const doctor = status === 'ready' ? doctors.find((d) => d.id === id) : undefined

  // Page title; restored when leaving the page
  useEffect(() => {
    const previous = originalTitle.current
    return () => {
      document.title = previous
    }
  }, [])
  useEffect(() => {
    if (doctor) document.title = `${doctor.name} | Medical Global Academy`
  }, [doctor])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (status === 'loading') {
    return (
      <div className="font-body text-body">
        <p role="status" aria-live="polite" className="sr-only">
          Loading doctor profile…
        </p>
        <ProfileSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div role="alert" className="bg-page px-4 py-20 font-body text-body sm:px-6">
        <StatePanel
          title="We couldn't load this profile"
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
    )
  }

  if (!doctor) return <NotFound />

  const hasQualifications = doctor.qualifications.length > 0
  const hasBio = doctor.bio.length > 0

  return (
    <div className="font-body text-body">
      <style href="doctor-profile" precedence="default">
        {avatarStyles}
      </style>

      {/* Header */}
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-10 pb-14 sm:px-6 md:pt-14 md:pb-16">
          <BackLink light />

          <div className="mt-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left motion-safe:animate-fade-up">
            <div className="shrink-0 rounded-full bg-white p-1 ring-1 ring-brand/40">
              <DoctorAvatar doctor={doctor} size={128} className="doctor-profile-avatar" />
            </div>

            <div className="min-w-0">
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight break-words sm:text-4xl">
                {doctor.name}
              </h1>
              {doctor.qualification && (
                <p className="mt-2 text-base leading-relaxed break-words text-slate-300">{doctor.qualification}</p>
              )}
              {doctor.focusAreas.length > 0 && (
                <ul aria-label="Departments" className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {doctor.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-md bg-brand/15 px-3 py-1.5 text-sm font-semibold text-glow ring-1 ring-brand/30"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-page py-12 md:py-16">
        <div className="mx-auto grid max-w-[1160px] gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {hasQualifications && (
              <section
                aria-labelledby="doctor-qualifications"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-card md:p-8"
              >
                <h2 id="doctor-qualifications" className="font-display text-xl font-semibold text-ink">
                  Qualifications
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {doctor.qualifications.map((q, i) => (
                    <li key={`${q}-${i}`} className="flex items-start gap-3 leading-relaxed">
                      <Icon path={icons.check} className="mt-0.5 h-5 w-5 shrink-0 text-brand-ink" />
                      <span className="min-w-0 break-words">{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasBio && (
              <section
                aria-labelledby="doctor-about"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-card md:p-8"
              >
                <h2 id="doctor-about" className="font-display text-xl font-semibold text-ink">
                  About
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed">
                  {doctor.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {!hasQualifications && !hasBio && (
              <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-card md:p-8">
                A full profile for {doctor.name} is coming soon.
              </p>
            )}
          </div>

          <aside
            aria-labelledby="doctor-cta"
            className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-card md:p-8"
          >
            <h2 id="doctor-cta" className="font-display text-lg font-semibold text-ink">
              Learn from our faculty
            </h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Explore our programs or talk to a counsellor about the right course for you.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link to="/courses" className={buttonPrimary}>
                View courses
              </Link>
              <a href={COUNSELLOR_TEL} className={buttonOutline}>
                <Icon path={icons.phone} className="h-4 w-4" />
                Talk to Counsellor
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default DoctorProfile
