import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE_TITLE } from '../constants/site.js'
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, socials } from '../data/siteLinks.js'
import { typeLabel, useSurgeryCourses } from '../data/surgeryCourseApi.js'

// Gradient text for highlighted words (same as the About page)
const gradientDark = 'bg-linear-to-r from-brand to-glow bg-clip-text text-transparent'

// Same input look as the Login / Sign Up modals
const inputClass =
  'w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none focus:ring-2 transition'
const inputOk = 'border-slate-300 focus:border-brand focus:ring-brand/25'
const inputError = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Optional leading +, then 10–15 digits once spaces, dashes, dots and brackets are removed.
const PHONE_RE = /^\+?\d{10,15}$/
const MIN_MESSAGE = 10

const GENERAL = 'General enquiry'
// Course types in the order the Courses page uses
const TYPE_ORDER = ['Fellowship', 'Pg Diploma', 'Certificate']
const rank = (type) => {
  const i = TYPE_ORDER.indexOf(type)
  return i === -1 ? TYPE_ORDER.length : i
}

const EMPTY = { name: '', email: '', phone: '', program: GENERAL, message: '' }

function validate({ name, email, phone, message }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (!phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (!PHONE_RE.test(phone.replace(/[\s\-.()]/g, '')))
    errors.phone = 'Please enter a valid phone number (10–15 digits).'
  if (!message.trim()) errors.message = 'Please enter your message.'
  else if (message.trim().length < MIN_MESSAGE)
    errors.message = `Please add a little more detail (at least ${MIN_MESSAGE} characters).`
  return errors
}

function Icon({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) {
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
      focusable="false"
    >
      <path d={path} />
    </svg>
  )
}

const MAIL_ICON = 'M3 5h18v14H3z M3 7l9 6 9-6'
const PHONE_ICON =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'

// Contact details from data/siteLinks.js (the same ones the footer shows)
const details = [
  { label: 'Email us', value: EMAIL, href: `mailto:${EMAIL}`, icon: MAIL_ICON },
  { label: 'Call us', value: PHONE_DISPLAY, href: PHONE_HREF, icon: PHONE_ICON },
]

// Dark card: contact details + socials (social icons are designed for a dark background)
function ContactDetails() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-brand/25 bg-linear-to-br from-ink from-30% to-deep p-6 text-white shadow-glow md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_55%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />

      <div className="relative">
        <h2 className="font-display text-2xl font-semibold">Contact details</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Reach our team directly by email or phone, or send a message with the form.
        </p>

        <ul className="mt-6 space-y-3">
          {details.map((d) => (
            <li key={d.label}>
              <a
                href={d.href}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand ring-1 ring-brand/40 transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                  <Icon path={d.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    {d.label}
                  </span>
                  <span className="mt-0.5 block break-words font-display text-base font-semibold text-white">
                    {d.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Follow us
          <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-brand/40 to-transparent" />
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Medical Global Academy on ${s.label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-deep transition duration-200 hover:-translate-y-0.5 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <svg viewBox="0 0 24 24" fill={s.color} aria-hidden="true" focusable="false" className="h-[18px] w-[18px]">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ContactForm() {
  const baseId = useId()
  const { status: coursesStatus, courses } = useSurgeryCourses()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  // Live surgery courses grouped by type, for the "Program of interest" dropdown
  const groups = useMemo(() => {
    const byType = {}
    for (const c of courses) if (c.title) (byType[c.type || 'Other'] ||= []).push(c.title)
    return Object.entries(byType)
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([type, titles]) => [type, [...new Set(titles)].sort((a, b) => a.localeCompare(b))])
  }, [courses])

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((errs) => (errs[field] ? { ...errs, [field]: undefined } : errs))
    setStatus('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Wait for the error state to render, then focus the first invalid field
      requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    // TODO: connect to the real enquiry backend. No endpoint exists yet, so the message is
    // handed to the visitor's email app, addressed to the support address from the footer.
    const subject = `Enquiry: ${values.program}`
    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Program of interest: ${values.program}`,
      '',
      values.message.trim(),
    ].join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus(`Your email app should open with this message. If it doesn't, write to ${EMAIL}.`)
  }

  const fieldProps = (name) => {
    const error = errors[name]
    return {
      id: `${baseId}-${name}`,
      name,
      value: values[name],
      onChange: update(name),
      'aria-invalid': error ? 'true' : 'false',
      'aria-describedby': error ? `${baseId}-${name}-error` : undefined,
      className: `${inputClass} ${error ? inputError : inputOk}`,
    }
  }

  const label = (name, text) => (
    <label htmlFor={`${baseId}-${name}`} className={labelClass}>
      {text} <span className="text-rose-600" aria-hidden="true">*</span>
    </label>
  )

  const errorText = (name) =>
    errors[name] && (
      <p id={`${baseId}-${name}-error`} className="mt-1.5 text-xs text-rose-600">
        {errors[name]}
      </p>
    )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card md:p-8">
      <h2 className="font-display text-2xl font-semibold text-ink">Send us a message</h2>
      <p className="mt-2 text-sm text-slate-500">
        Fields marked <span className="text-rose-600">*</span> are required.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {label('name', 'Full Name')}
          <input type="text" autoComplete="name" placeholder="Dr. Jane Doe" {...fieldProps('name')} />
          {errorText('name')}
        </div>

        <div>
          {label('email', 'Email Address')}
          <input type="email" autoComplete="email" placeholder="you@example.com" {...fieldProps('email')} />
          {errorText('email')}
        </div>

        <div>
          {label('phone', 'Phone Number')}
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" {...fieldProps('phone')} />
          {errorText('phone')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${baseId}-program`} className={labelClass}>
            Program of Interest
          </label>
          <select {...fieldProps('program')} className={`${inputClass} ${inputOk} cursor-pointer`}>
            <option value={GENERAL}>{GENERAL}</option>
            {groups.map(([type, titles]) => (
              <optgroup key={type} label={typeLabel(type)}>
                {titles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {coursesStatus === 'loading' && (
            <p className="mt-1.5 text-xs text-slate-500">Loading programs…</p>
          )}
          {coursesStatus === 'error' && (
            <p className="mt-1.5 text-xs text-slate-500">
              Programs couldn&apos;t be loaded. Choose General enquiry and name the program in your message.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          {label('message', 'Message')}
          <textarea rows={5} placeholder="How can we help?" {...fieldProps('message')} className={`${fieldProps('message').className} resize-y`} />
          {errorText('message')}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-7 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Send Message
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12 M11 5l5 5-5 5" />
            </svg>
          </button>
          <p role="status" className="mt-3 min-h-5 text-sm text-slate-500">
            {status}
          </p>
        </div>
      </form>
    </div>
  )
}

function Contact() {
  useEffect(() => {
    document.title = SITE_TITLE
  }, [])

  return (
    <div className="font-body text-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-[1140px] px-4 pt-8 pb-16 sm:px-6 md:pt-10 md:pb-20 lg:pt-12">
          <div className="flex items-center gap-3 motion-safe:animate-fade-up">
            <span className="h-px w-8 shrink-0 bg-brand sm:w-12" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Contact Us</span>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] motion-safe:animate-fade-up [animation-delay:100ms]">
            Get in Touch
            <span className={`block ${gradientDark}`}>With Our Team</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
            Questions about a fellowship, PG diploma or certificate course, eligibility or
            enrolment? Send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      {/* Details + form */}
      <section className="relative overflow-hidden bg-page py-16 md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-10">
          <ContactDetails />
          <ContactForm />
        </div>

        <div className="relative mt-12 text-center">
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-ink transition-colors hover:text-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            Browse all surgery courses
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12 M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Contact
