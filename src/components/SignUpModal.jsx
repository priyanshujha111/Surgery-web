import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const inputClass =
  'w-full rounded-lg border px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none focus:ring-2 transition'
const inputOk = 'border-slate-300 focus:border-brand focus:ring-brand/25'
const inputError = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Optional leading +, then 10–15 digits once spaces, dashes, dots and brackets are removed.
const PHONE_RE = /^\+?\d{10,15}$/
// TODO: align these rules with the backend's real requirements once it exists.
const MIN_PASSWORD = 8

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function validate({ name, email, phone, password }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (!phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (!PHONE_RE.test(phone.replace(/[\s\-.()]/g, '')))
    errors.phone = 'Please enter a valid phone number (10–15 digits).'
  if (!password) errors.password = 'Please choose a password.'
  else if (password.length < MIN_PASSWORD)
    errors.password = `Password must be at least ${MIN_PASSWORD} characters.`
  return errors
}

// Only mounted while open, so the form starts empty every time the modal opens.
function SignUpDialog({ onClose, onSwitchToLogin }) {
  const dialogRef = useRef(null)
  const baseId = useId()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  // Esc closes, Tab stays inside the dialog, page scroll is locked,
  // and focus goes back to whatever opened the modal.
  useEffect(() => {
    const dialog = dialogRef.current
    const prevFocus = document.activeElement

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const items = dialog.querySelectorAll(FOCUSABLE)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!dialog.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    // Focus here rather than with autoFocus: when switching from Login, its cleanup restores
    // focus first, and this runs after it.
    dialog?.querySelector('input')?.focus()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (prevFocus instanceof HTMLElement && document.contains(prevFocus)) prevFocus.focus()
    }
  }, [onClose])

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((errs) => (errs[field] ? { ...errs, [field]: undefined } : errs))
    setStatus('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      dialogRef.current?.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    // TODO: connect to the real registration backend. No endpoint is called yet.
    // Send { name, email, phone, password } over HTTPS, show the server's error on failure,
    // and close the modal (or switch to Login) on success. Never log the password.
    setStatus('Sign up is not connected yet.')
  }

  const field = (name, props) => {
    const errorId = `${baseId}-${name}-error`
    const error = errors[name]
    return (
      <div>
        <label htmlFor={`${baseId}-${name}`} className="sr-only">
          {props.placeholder}
        </label>
        <input
          id={`${baseId}-${name}`}
          name={name}
          value={values[name]}
          onChange={update(name)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} ${error ? inputError : inputOk}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 px-4 text-xs text-rose-600">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
      // mousedown, not click, so a text selection dragged out of the dialog doesn't close it
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-8 shadow-card font-body"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          ✕
        </button>

        <h2
          id={`${baseId}-title`}
          className="text-center font-display text-3xl font-bold text-ink"
        >
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {field('name', {
            type: 'text',
            placeholder: 'Full Name',
            autoComplete: 'name',
          })}
          {field('email', {
            type: 'email',
            placeholder: 'Email Address',
            autoComplete: 'email',
          })}
          {field('phone', {
            type: 'tel',
            placeholder: 'Phone Number',
            autoComplete: 'tel',
            inputMode: 'tel',
          })}
          {field('password', {
            type: 'password',
            placeholder: 'Password',
            autoComplete: 'new-password',
          })}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-ink transition-colors hover:bg-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Sign Up
          </button>
          <p role="status" className="min-h-5 text-center text-sm text-slate-500">
            {status}
          </p>
        </form>

        <p className="mt-1 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="rounded-sm font-semibold text-brand-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}

function SignUpModal({ open, onClose, onSwitchToLogin }) {
  if (!open) return null
  return createPortal(
    <SignUpDialog onClose={onClose} onSwitchToLogin={onSwitchToLogin} />,
    document.body
  )
}

export default SignUpModal
