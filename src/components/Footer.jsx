import { useState } from 'react'
import { Link } from 'react-router-dom'
import CoursesButton from './CoursesButton.jsx'
import { COURSE_DISCLAIMER_BODY, COURSE_DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, coursesOfType, legalLinks, mainPages, socials } from '../data/siteLinks.js'

// Same logo the Navbar uses; falls back to the "MGA" box if it fails to load
const LOGO_URL = 'https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png'

// Read once at load (not during render) for the copyright line
const YEAR = new Date().getFullYear()

// Links, contact details and socials live in data/siteLinks.js (shared with the Sitemap page)

const linkGroups = [
  {
    heading: 'Explore',
    links: mainPages,
  },
  {
    heading: 'Courses types',
    links: [
      { to: coursesOfType('Certificate'), label: 'Certificate courses' },
      { to: coursesOfType('Fellowship'), label: 'Fellowship' },
      { to: coursesOfType('Pg Diploma'), label: 'PG Diploma' },
    ],
  },
]

const focusRing =
  'rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink'

const linkClass = `${focusRing} text-sm text-slate-300 underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-brand motion-reduce:transition-none`

// Column heading with a short brand accent underneath
const headingClass =
  'relative mb-3 pb-2 font-display text-[15px] font-semibold tracking-[0.02em] text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-7 after:rounded-full after:bg-brand'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

function MailIcon() {
  return (
    <svg {...iconProps} className="mt-[3px] h-4 w-4 shrink-0 text-brand">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg {...iconProps} className="mt-[3px] h-4 w-4 shrink-0 text-brand">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg {...iconProps} className="h-[15px] w-[15px] shrink-0 text-brand">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg {...iconProps} className="h-[15px] w-[15px] shrink-0 text-brand">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  )
}

const badgeClass =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs leading-snug text-slate-300'

function Footer() {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <footer className="bg-ink font-body text-[15px] leading-normal text-slate-300">
      {/* Thin brand line at the very top of the footer */}
      <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-brand/55 to-transparent" />

      {/* Stacked on mobile, 2 columns on tablet (brand and contact full width), 4 columns from 1024px.
          Link and contact columns size to their content (so the courses button and the email never
          get squeezed); the brand column takes the remaining space. Spacing comes from grid gaps. */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-5 py-8 sm:grid-cols-2 sm:gap-x-10 sm:px-7 lg:grid-cols-[minmax(0,1fr)_max-content_max-content_max-content] lg:gap-x-10 lg:px-8 lg:py-10 xl:gap-x-14">
        {/* Left: brand */}
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            aria-label="Medical Global Academy — Home"
            className={`${focusRing} inline-flex items-center gap-3 text-white`}
          >
            {logoFailed ? (
              <span
                aria-hidden="true"
                className="inline-flex h-8 items-center justify-center rounded-[3px] bg-deep px-[7px] text-sm font-medium tracking-[0.02em] text-white"
              >
                MGA
              </span>
            ) : (
              <img
                src={LOGO_URL}
                alt=""
                width="256"
                height="256"
                loading="lazy"
                onError={() => setLogoFailed(true)}
                className="h-10 w-auto object-contain"
              />
            )}
            <span className="font-display text-[19px] leading-tight font-bold">Medical Global Academy</span>
          </Link>
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-slate-400">
            Neurology certificate and fellowship programs that let practising doctors specialise
            without stepping away from clinical work.
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            <li className={badgeClass}>
              <LayersIcon />
              <span>CPD &amp; ACTD Accredited</span>
            </li>
            {/* TODO: confirm the "Verified" badge wording (what is verified, and by whom). */}
            <li className={badgeClass}>
              <CheckCircleIcon />
              <span>Verified</span>
            </li>
          </ul>

          <ul className="mt-3 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Medical Global Academy on ${s.label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-deep transition duration-200 hover:-translate-y-0.5 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <svg viewBox="0 0 24 24" fill={s.color} aria-hidden="true" focusable="false" className="h-[14px] w-[14px]">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle: link columns (no vertical divider lines) */}
        {linkGroups.map((group) => (
          <nav
            key={group.heading}
            aria-label={group.heading}
          >
            <h2 className={headingClass}>{group.heading}</h2>
            <ul className="grid gap-2.5">
              {group.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Plain block wrapper: no fixed width or overflow clipping, so the glow and arrow move freely */}
            {group.heading === 'Explore' && (
              <div className="mt-4">
                <CoursesButton />
              </div>
            )}
          </nav>
        ))}

        {/* Right: contact details (no vertical divider line) */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className={headingClass}>Contact us</h2>
          <ul className="grid gap-2.5">
            <li className="flex min-w-0 items-start gap-3 text-sm leading-relaxed text-white">
              <MailIcon />
              <a
                href={`mailto:${EMAIL}`}
                className={`${focusRing} min-w-0 break-words text-white sm:whitespace-nowrap underline decoration-transparent underline-offset-4 transition-colors hover:decoration-brand motion-reduce:transition-none`}
              >
                {/* Break after the @ (not mid-word) when the column is narrow */}
                {EMAIL.split('@')[0]}@<wbr />
                {EMAIL.split('@')[1]}
              </a>
            </li>
            <li className="flex min-w-0 items-start gap-3 text-sm leading-relaxed text-white">
              <PhoneIcon />
              <a
                href={PHONE_HREF}
                className={`${focusRing} text-white underline decoration-transparent underline-offset-4 transition-colors hover:decoration-brand motion-reduce:transition-none`}
              >
                {PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright + legal links. Symmetric side padding: this site has no
          floating chat button, so the extra right padding the reference footer used isn't needed. */}
      {/* Course disclaimer (same text as the Courses page notice) */}
      <div className="border-t border-white/10">
        <p role="note" className="mx-auto max-w-[900px] px-5 py-3 text-center text-xs leading-normal text-slate-400 sm:px-7">
          <strong className="font-semibold text-brand">{COURSE_DISCLAIMER_LABEL}</strong> {COURSE_DISCLAIMER_BODY}
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] text-center sm:px-7 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <p className="text-sm text-slate-400">
            © {YEAR} Medical Global Academy. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 lg:justify-end">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={`${linkClass} text-slate-400`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer