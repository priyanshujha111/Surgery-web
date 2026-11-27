import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'

const LOGO_URL = 'https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/doctor', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
]

const SCROLL_THRESHOLD = 12

const MOBILE_MENU_ID = 'mobile-menu'

const linkBase =
  'uppercase text-sm font-medium tracking-[0.15em] pb-1 border-b-2 transition-colors duration-200 focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4'

// `solid` = white bar (scrolled, other pages, or mobile menu open); otherwise dark glass over the hero
function navLinkClass(solid) {
  return ({ isActive }) => {
    const offset = solid ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-ink'
    if (isActive) {
      return `${linkBase} ${offset} border-brand ${solid ? 'text-ink' : 'text-white'}`
    }
    return `${linkBase} ${offset} border-transparent ${
      solid ? 'text-slate-600 hover:text-ink' : 'text-white/75 hover:text-white'
    }`
  }
}

const buttonBase =
  'inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [logoFailed, setLogoFailed] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const close = () => setOpen(false)
  const closeLogin = useCallback(() => setLoginOpen(false), [])
  const [signUpOpen, setSignUpOpen] = useState(false)
  const closeSignUp = useCallback(() => setSignUpOpen(false), [])
  const switchToSignUp = () => {
    setLoginOpen(false)
    setSignUpOpen(true)
  }
  const switchToLogin = () => {
    setSignUpOpen(false)
    setLoginOpen(true)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on any route change (back/forward, links outside the menu).
  // Done during render, not in an effect, so there's no extra render with the menu still open.
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  // While the mobile menu is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // On Home the bar is fixed so the hero gradient shows through the glass
  const isHome = pathname === '/'
  const solid = !isHome || scrolled || open

  const navItems = (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={navLinkClass(solid)}
          onClick={close}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )

  const buttons = (
    <>
      <button
        type="button"
        onClick={() => {
          close()
          setLoginOpen(true)
        }}
        className={`${buttonBase} border ${
          solid
            ? 'border-slate-300 bg-white text-ink hover:border-brand hover:text-brand-ink focus-visible:ring-offset-white'
            : 'border-white/35 bg-transparent text-white hover:border-brand hover:bg-white/10 focus-visible:ring-offset-ink'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => {
          close()
          setSignUpOpen(true)
        }}
        className={`${buttonBase} border border-brand bg-brand text-ink hover:border-glow hover:bg-glow hover:shadow-glow ${
          solid ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-ink'
        }`}
      >
        Sign Up
      </button>
    </>
  )

  return (
    <>
    <header
      className={`${isHome ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 w-full border-b font-body transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? 'border-slate-200 bg-white shadow-card'
          : 'border-white/10 bg-ink/55 backdrop-blur-md'
      }`}
    >
      {/* Same max-width + padding as the hero container so left edges line up */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 xl:px-8 py-3 md:py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <Link
          to="/"
          onClick={close}
          aria-label="Medical Global Academy — Surgery — Home"
          className="flex shrink-0 items-center gap-3 justify-self-start rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {logoFailed ? (
            <span
              className={`font-display text-lg md:text-xl font-bold transition-colors duration-300 ${
                solid ? 'text-ink' : 'text-white'
              }`}
            >
              Medical Global Academy
            </span>
          ) : (
            <>
              <img
                src={LOGO_URL}
                alt="Medical Global Academy"
                loading="eager"
                width="256"
                height="256"
                onError={() => setLogoFailed(true)}
                className="h-11 w-auto object-contain md:h-[52px]"
              />
              <span className="hidden xl:block">
                <span
                  className={`block whitespace-nowrap font-display text-lg leading-tight font-bold transition-colors duration-300 ${
                    solid ? 'text-ink' : 'text-white'
                  }`}
                >
                  Medical Global Academy
                </span>
                {/* Surgery cue: xl only, sits under the name and stays within the logo height */}
                <span
                  className={`block text-[10px] font-semibold uppercase leading-tight tracking-[0.25em] transition-colors duration-300 ${
                    solid ? 'text-brand-ink' : 'text-brand'
                  }`}
                >
                  Surgery
                </span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">{navItems}</nav>

        <div className="hidden lg:flex items-center justify-end gap-3">{buttons}</div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          className={`lg:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            solid ? 'hover:bg-slate-100' : 'hover:bg-white/10'
          }`}
        >
          <span className={`h-0.5 w-6 ${solid ? 'bg-ink' : 'bg-white'}`} />
          <span className={`h-0.5 w-6 ${solid ? 'bg-ink' : 'bg-white'}`} />
          <span className={`h-0.5 w-6 ${solid ? 'bg-ink' : 'bg-white'}`} />
        </button>
      </div>

      {open && (
        <div id={MOBILE_MENU_ID} className="lg:hidden border-t border-slate-200 bg-white px-4 pb-6 pt-4">
          <nav className="flex flex-col items-start gap-4">{navItems}</nav>
          <div className="mt-6 flex flex-col gap-3">{buttons}</div>
        </div>
      )}
    </header>
    <LoginModal open={loginOpen} onClose={closeLogin} onSwitchToSignUp={switchToSignUp} />
    <SignUpModal open={signUpOpen} onClose={closeSignUp} onSwitchToLogin={switchToLogin} />
    </>
  )
}

export default Navbar















