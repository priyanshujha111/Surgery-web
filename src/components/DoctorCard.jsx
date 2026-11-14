import { useState } from 'react'
import { Link } from 'react-router-dom'

// Shared by the Home "Meet Our Expert Doctors" section and the Doctors page.
// `doctor` is the shape made by mapFaculty (data/facultyApi.js):
//   { id, name, qualification, focus, focusAreas, photo, bio, qualifications }
// Colours and fonts come from the theme tokens in index.css (var(--color-...), var(--font-...)),
// so the card matches the rest of the site.
const styles = `
.doctor-card-root {
  --doctor-card-ink: var(--color-deep);
  --doctor-card-muted: #475569;
  --doctor-card-accent: var(--color-brand);
  --doctor-card-accent-text: var(--color-brand-ink);
  --doctor-card-accent-bg: color-mix(in srgb, var(--color-brand) 10%, white);
  --doctor-card-line: #e2e8f0;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 0;
  padding: 32px 24px 28px;
  border: 1px solid var(--doctor-card-line);
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
  font-family: var(--font-body);
  color: var(--doctor-card-ink);
  box-shadow: var(--shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.doctor-card-root:hover,
.doctor-card-selected {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--doctor-card-accent) 55%, white);
  box-shadow: var(--shadow-glow);
}

/* Optional dark green strip behind the avatar (Doctors page) */
.doctor-card-cover {
  padding-top: 0;
}

.doctor-card-cover::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 84px;
  background:
    radial-gradient(ellipse 70% 90% at 85% 0%, color-mix(in srgb, var(--color-brand) 30%, transparent), transparent 70%),
    linear-gradient(135deg, var(--color-deep), var(--color-ink));
}

/* Clickable cards (Home): brand-to-accent top bar on hover / when selected */
.doctor-card-interactive {
  cursor: pointer;
}

.doctor-card-interactive::after {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-brand), var(--color-accent));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.doctor-card-interactive:hover::after,
.doctor-card-selected::after {
  opacity: 1;
}

.doctor-card-interactive:focus {
  outline: none;
}

.doctor-card-interactive:focus-visible {
  outline: 2px solid var(--doctor-card-accent);
  outline-offset: 3px;
}

.doctor-card-selected {
  animation: doctor-card-blink 0.9s ease-in-out;
}

@keyframes doctor-card-blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.55;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 45%, transparent);
  }
}

/* Linked cards (Doctors page): the name is the link, stretched over the whole card */
.doctor-card-linked .doctor-card-info {
  position: static;
}

.doctor-card-link {
  color: inherit;
  text-decoration: none;
}

.doctor-card-link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: 12px;
}

.doctor-card-link:focus {
  outline: none;
}

.doctor-card-link:focus-visible::after {
  outline: 2px solid var(--doctor-card-accent);
  outline-offset: 3px;
}

.doctor-card-linked:hover .doctor-card-name {
  color: var(--doctor-card-accent-text);
}

/* ---------- Avatar ---------- */
.doctor-card-avatar-wrap {
  position: relative;
  z-index: 1;
  padding: 4px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--doctor-card-accent) 40%, white);
}

.doctor-card-cover .doctor-card-avatar-wrap {
  margin-top: 40px;
}

.doctor-card-avatar {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--doctor-card-accent-bg), color-mix(in srgb, var(--color-accent) 14%, white));
  color: var(--doctor-card-ink);
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
}

.doctor-card-avatar-img {
  display: block;
  object-fit: cover;
  background: var(--doctor-card-accent-bg);
}

/* ---------- Info ---------- */
.doctor-card-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 16px;
}

.doctor-card-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--doctor-card-ink);
  overflow-wrap: anywhere;
  transition: color 0.2s ease;
}

/* Long qualification lists wrap, then stop at two lines (full text in the title tooltip) */
.doctor-card-qual {
  display: -webkit-box;
  max-width: 100%;
  margin: 6px 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  color: var(--doctor-card-muted);
  font-size: 0.85rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.doctor-card-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.doctor-card-dept {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--doctor-card-accent-bg);
  color: var(--doctor-card-accent-text);
  font-size: 0.85rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.doctor-card-dept svg {
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .doctor-card-root,
  .doctor-card-interactive::after,
  .doctor-card-name {
    transition: none;
  }
  .doctor-card-root:hover,
  .doctor-card-selected {
    transform: none;
  }
  .doctor-card-selected {
    animation: none;
  }
}
`

// "Dr. Ambuj" -> "A", "Dr. Meet Jha" -> "MJ", "Neha Sharma" -> "NS"
function getInitials(name = '') {
  const parts = name
    .replace(/^dr\.?\s*/i, '')
    .split(/[\s.]+/)
    .filter(Boolean)
  if (parts.length === 0) return 'Dr'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Round photo, or the initials when there is no photo or it fails to load
export function DoctorAvatar({ doctor, size = 84, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showPhoto = Boolean(doctor.photo) && failedSrc !== doctor.photo

  if (showPhoto) {
    return (
      <img
        className={`doctor-card-avatar doctor-card-avatar-img ${className}`}
        src={doctor.photo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(doctor.photo)}
      />
    )
  }

  return (
    <div className={`doctor-card-avatar ${className}`} aria-hidden="true">
      {getInitials(doctor.name)}
    </div>
  )
}

// Small medical cross in a rounded square, next to the department name
function DepartmentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M12 8v8 M8 12h8" />
    </svg>
  )
}

// `cover` adds the dark green strip behind the avatar. `to` turns the card into a link (to the
// doctor's profile). Passing `onSelect` instead makes the card a toggle button (keyboard too);
// `selected` highlights it and plays the blink.
function DoctorCard({ doctor, cover = false, selected = false, onSelect, to }) {
  const linked = Boolean(to)
  const interactive = !linked && typeof onSelect === 'function'
  const focusAreas = doctor.focusAreas?.length ? doctor.focusAreas : doctor.focus ? [doctor.focus] : []

  const className = [
    'doctor-card-root',
    cover && 'doctor-card-cover',
    interactive && 'doctor-card-interactive',
    linked && 'doctor-card-linked',
    selected && 'doctor-card-selected',
  ]
    .filter(Boolean)
    .join(' ')

  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': selected,
        onClick: onSelect,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        },
      }
    : {}

  return (
    <article className={className} {...interactiveProps}>
      {/* href + precedence: React 19 hoists this once instead of per card */}
      <style href="doctor-card" precedence="default">
        {styles}
      </style>

      <div className="doctor-card-avatar-wrap">
        <DoctorAvatar doctor={doctor} />
      </div>

      <div className="doctor-card-info">
        <h3 className="doctor-card-name">
          {linked ? (
            <Link to={to} className="doctor-card-link">
              {doctor.name}
            </Link>
          ) : (
            doctor.name
          )}
        </h3>

        {doctor.qualification && (
          <p className="doctor-card-qual" title={doctor.qualification}>
            {doctor.qualification}
          </p>
        )}

        {focusAreas.length > 0 && (
          <ul className="doctor-card-tags" aria-label="Departments">
            {focusAreas.map((area, i) => (
              <li key={area} className="doctor-card-dept">
                {i === 0 && <DepartmentIcon />}
                <span>{area}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// Placeholder card while the faculty list loads (same size as a real card)
export function DoctorCardSkeleton({ cover = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-white px-6 pb-7 shadow-card motion-safe:animate-pulse ${
        cover ? 'pt-0' : 'pt-8'
      }`}
    >
      {cover && <div className="absolute inset-x-0 top-0 h-[84px] bg-slate-200" />}
      <div className={`relative h-[92px] w-[92px] rounded-full border-4 border-white bg-slate-100 ${cover ? 'mt-10' : ''}`} />
      <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-3.5 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 h-7 w-28 rounded-md bg-slate-100" />
    </div>
  )
}

export default DoctorCard
