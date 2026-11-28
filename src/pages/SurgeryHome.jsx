import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageLightbox from '../components/ImageLightbox.jsx'
import ProtectedImage from '../components/ProtectedImage.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { CountUp } from '../components/StatsCounter.jsx'
import { surgeryFaqs } from '../data/surgeryFaqs.js'
import DoctorCard, { DoctorCardSkeleton } from '../components/DoctorCard.jsx'
import { FACULTY_CONFIRMED, useFaculty } from '../data/facultyApi.js'
import { trendingSurgeryCourses } from '../data/surgeryCourses.js'
import { loadSurgeryCourses } from '../data/surgeryCourseApi.js'
import { CourseCardImage } from '../components/CourseCard.jsx'

// Gradient text for highlighted words: brand-ink to accent on light backgrounds, brand to glow on dark
const gradientLight = 'bg-linear-to-r from-brand-ink to-accent bg-clip-text text-transparent'
const gradientDark = 'bg-linear-to-r from-brand to-glow bg-clip-text text-transparent'

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

// Stats bar numbers (shown publicly, so keep them accurate and update here when they change).
const stats = [
  { value: 12500, suffix: '+', label: 'Happy Students' },
  { value: 25, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Expert Doctors' },
  { value: 98, suffix: '%', label: 'Success Rate' },
]

// Doctors come from the faculty API (data/facultyApi.js), shared with the Doctors page.
// TODO: replace with confirmed surgery faculty (name, specialty, faculty ID) before publishing.

// TODO: confirm these hospitals are partners for the surgery programmes before launch.
const hospitals = [
  'Medanta',
  'Fortis',
  'Manipal Hospitals',
  'Jeeban Suraksha Hospital',
  'Max Hospital',
  'Adarsh Hospital',
  'Arias Hospital (Maternity Hospital)',
  'Criticare Hospital',
  'Curasia Hospital',
  'Dhanashree Hospital',
  'Divine Heart Hospital',
  'EMM Hospital & Research Centre',
  'Fauziya Hospital',
  'IK Hospital',
  'Kurla Nursing Home',
  'Lunge Multi Speciality Hospital',
  'Mathan Hospital',
  'Matoshree Hospital',
  'Medinity Hospital',
  'Meitra Hospital',
  'Noida International Institute of Medical Sciences',
  'Palm View Elite Health',
  'Pushpagiri Institute of Medical Sciences & Research Centre',
  'Radha Krishna Hospital',
  'Shivam Hospital',
  'Silver Streak Super Speciality Hospital',
  'Sparsh Hospital',
  'TSS Shripad Hegde Kadave Institute of Medical Science',
  'Under the Layers Clinic',
  'Vennela Hospital',
  'Vijaya Diagnostics',
]

// TODO: confirm with the academic team what each surgery course really includes. Do not
// mention live operating, hands-on or clinical training unless a course offers it.
const pathwaySteps = [
  {
    num: '01',
    badge: 'STEP 1 · FOUNDATION',
    icon: '🎓',
    title: 'Enroll in Program',
    description:
      'Choose from our surgery fellowship and PG Diploma programs, designed for working medical professionals.',
  },
  {
    num: '02',
    badge: 'STEP 2 · KNOWLEDGE',
    icon: '👨‍⚕️',
    title: 'Learn From Experts',
    description:
      'Learn through case discussions, procedure walkthroughs and learning material across general, laparoscopic and specialty surgery.',
  },
  {
    num: '03',
    badge: 'STEP 3 · APPLY',
    icon: '🩺',
    title: 'Case-based Learning',
    description:
      'Work through surgical case scenarios covering preoperative assessment, operative decision-making, postoperative care and the management of complications.',
  },
  {
    num: '04',
    badge: 'STEP 4 · ACHIEVE',
    icon: '📜',
    title: 'Get Certified',
    description:
      'Receive a certificate on completion, backed by our CPD accreditation and ACTD alignment, to support your surgical career.',
    badges: ['CPD', 'ACTD'],
  },
]

// TODO: add a real outcome figure here (e.g. graduates placed) only once you have surgery data.
// TODO: confirm "Expert faculty" and "Flexible learning" for the surgery programs.
const pathwayHighlights = [
  'Case-based learning',
  'Globally recognised',
  'Flexible learning',
  'Expert faculty',
]

// Testimonials are shown in production. Set to false to hide the section.
const SHOW_TESTIMONIALS = true

// Reviews confirmed by the business owner (2026-11-28) as genuine, consented and approved for
// publishing as-is. Only add new entries that are real, consented reviews.
// name is also the React key, so keep names unique.
const testimonials = [
  {
    quote: ' The case discussions were well structured and easy to follow alongside my hospital duties. The faculty explained each step clearly and answered our questions in detail.',
    name: 'Dr. Ananya Iyer',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: ' The procedure walkthroughs helped me revise concepts I had not looked at since residency. The learning material was organised module by module, which made planning my study time simple.',
    name: 'Dr. Rahul Verma',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: ' I liked that the program was designed for working doctors. Recorded sessions meant I never missed a topic, even during night shifts.',
    name: 'Dr. Sneha Kapoor',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: ' The laparoscopic modules covered instruments, port placement and common complications in a clear order. The support team was quick to respond whenever I needed help.',
    name: 'Dr. Arjun Nair',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: ' The faculty shared practical tips from their own surgical work, which made the theory easier to connect to the operating room. The assessments kept me consistent.',
    name: 'Dr. Priya Desai',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: ' Enrolment was smooth and the course portal was easy to use. The specialist-led sessions gave me a much clearer picture of where I want to take my surgical career.',
    name: 'Dr. Siddharth Rao',
    role: 'Medical Professional',
    rating: 5,
  },
]

// "Why choose us" cards. icon = SVG path(s) drawn on a 24x24 grid (stroke icons).
// TODO: confirm the faculty, curriculum and guideline claims below with the academic team.
// No statistics or awards are used here on purpose. Add numbers only once they are verified.
const features = [
  {
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
    title: 'Specialist-Led Faculty',
    description:
      'Learn from experienced surgeons who teach directly from their own surgical practice, bringing real cases and practical judgement into every session.',
  },
  {
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    title: 'Case-Based Training',
    description:
      'Go beyond theory with case discussions and procedure walkthroughs that sharpen your surgical decision-making, from preoperative assessment to postoperative care.',
  },
  {
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
    title: 'Recognised Certification',
    description:
      'Receive a certificate on completion, backed by CPD accreditation and ACTD alignment, to strengthen your professional profile and credentials.',
  },
  {
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
    title: 'Global Relevance',
    description:
      'Build knowledge that applies to surgical practice worldwide, so your skills stay relevant wherever your career takes you.',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    title: 'Current Curriculum',
    description:
      'Study content that is regularly updated and aligned with current surgical guidelines and techniques, so you learn what today’s practice demands.',
  },
  {
    icon: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    title: 'Career Advancement',
    description:
      'Deepen your surgical knowledge with confidence and take the next step in your medical career, backed by structured, specialist-led learning.',
  },
]

// Accreditation badges shown in the "Why choose us" intro. Keep the wording as is.
const whyBadges = ['CPD', 'ACTD']

const uploads = 'https://medicalglobalacademy.com/wp-content/uploads'

// All four share one card size (see AccreditationCard); kind picks how the image is fitted.
// width/height are given only for the certificates: the lightbox uses them to scale a
// certificate up to fill the screen, while the logos open at their natural size. To serve a
// sharper certificate in the lightbox, drop it into public/certificates/ and add one line,
// e.g. fullSrc: '/certificates/cpd-certificate.png'.
const accreditations = [
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-25-at-4.27.09-PM.jpeg`,
    kind: 'logo',
    title: 'CPD Accredited Badge',
    href: 'https://directory.cpdstandards.com/providers/medical-global-academy/',
    alt: 'Accredited CPD & Training Excellence badge, PDCD1106 Dual Training & CPD Accreditation',
  },
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg`,
    kind: 'logo',
    title: 'ACTD Member Seal',
    href: 'https://www.actd.us/medicalglobalacademy/',
    alt: 'ACTD — American Council of Training and Development eagle seal',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg`,
    kind: 'certificate',
    width: 1024,
    height: 726,
    title: 'CPD Accreditation Certificate',
    alt: 'Official Certificate of CPD Accreditation certifying that Medical Global Academy has achieved Dual CPD & Provider of Training Excellence status with The CPD Standards Office, provider number PDCD1106, valid 2026–2028',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg`,
    kind: 'certificate',
    width: 1600,
    height: 1236,
    title: 'ACTD Certificate of Accreditation',
    alt: 'American Council of Training and Development Certificate of Accreditation certifying Medical Global Academy as an accredited professional training institution, accreditation number GNA452N, valid until September 12, 2027',
  },
]

// Left-side details of the Accreditation section. The wording comes from the certificates
// above (provider/accreditation numbers and validity dates). Keep them in sync if a certificate is renewed.
const accreditationDetails = [
  {
    name: 'CPD Accreditation',
    body: 'Dual CPD & Provider of Training Excellence, awarded by The CPD Standards Office.',
    meta: 'Provider no. PDCD1106 · Valid 2026–2028',
  },
  {
    name: 'ACTD Accreditation',
    body: 'Accredited professional training institution, certified by the American Council of Training and Development.',
    meta: 'Accreditation no. GNA452N · Valid until 12 September 2027',
  },
]

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
    >
      <path d={path} />
    </svg>
  )
}

const checkPath = 'M3 8.5l3.5 3.5 6.5-7'
const shieldCheckPath = 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4'

// Thin brand line + small caps label, used above section headings
function Eyebrow({ children, light = false, center = false }) {
  const tone = light ? 'text-brand' : 'text-brand-ink'
  const line = light ? 'bg-brand' : 'bg-brand-ink'
  return (
    <span className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${tone}`}>
      <span aria-hidden="true" className={`h-px w-8 ${line}`} />
      {children}
      {center && <span aria-hidden="true" className={`h-px w-8 ${line}`} />}
    </span>
  )
}

function AccentRule({ center = false }) {
  return (
    <div
      aria-hidden="true"
      className={`mt-4 h-1 w-14 rounded-full bg-linear-to-r from-brand to-accent ${center ? 'mx-auto' : ''}`}
    />
  )
}

// Scroll-reveal helper: returns [ref, shown]. `shown` flips to true once, when the element
// first scrolls into view. Falls back to "shown" if IntersectionObserver is unavailable.
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, shown]
}

function AccreditationCard({ item, onOpen, onError }) {
  const isLogo = item.kind === 'logo'
  const isLink = Boolean(item.href)

  const imageEl = (
    <span className={isLogo ? 'absolute inset-0 flex items-center justify-center' : 'absolute inset-2'}>
      <ProtectedImage
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        onError={() => onError(item.src)}
        className={isLogo ? 'h-auto max-h-[75%] w-auto max-w-[85%] object-contain' : 'h-full w-full object-contain'}
      />
    </span>
  )

  const cardClass = `group relative block aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 border-t-2 border-t-brand bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${focusRing}`

  const cue = (
    <span
      aria-hidden="true"
      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-ink/85 text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-2 sm:top-2 sm:h-8 sm:w-8 [@media(hover:none)]:opacity-100"
    >
      {isLink ? (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 6H6.75A2.25 2.25 0 004.5 8.25v10.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V13.5M15 4.5h4.5V9M19.5 4.5L10.5 13.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4 M11 8v6 M8 11h6" />
        </svg>
      )}
    </span>
  )

  if (isLink) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${item.title} verification page (opens in a new tab)`}
        className={cardClass}
      >
        {imageEl}
        {cue}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View ${item.title} in full size`}
      className={cardClass}
    >
      {imageEl}
      {cue}
    </button>
  )
}

// Accreditation: content on the LEFT, all certificates and badges on the RIGHT (2x2 grid).
// On mobile the content comes first and the certificates stack below it.
function AccreditationSection() {
  const [openItem, setOpenItem] = useState(null)
  const [failed, setFailed] = useState(() => new Set())
  const closeLightbox = useCallback(() => setOpenItem(null), [])
  const [leftRef, leftShown] = useReveal(0.15)
  const [rightRef, rightShown] = useReveal(0.1)

  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))
  const items = accreditations.filter((a) => !failed.has(a.src))

  if (items.length === 0) return null

  return (
    <section id="accreditation" className="bg-page pt-12 pb-20 md:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* LEFT: content */}
          <div
            ref={leftRef}
            className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              leftShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <Eyebrow>Accreditation</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              Globally recognised &amp; <span className={gradientLight}>CPD/ACTD</span> aligned
              certification
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              Our programmes are backed by CPD accreditation and ACTD alignment. Open any badge or
              certificate to view the official document in full size.
            </p>

            <ul className="mt-8 space-y-4">
              {accreditationDetails.map((detail) => (
                <li
                  key={detail.name}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-glow"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand to-glow text-ink">
                    <Icon path={shieldCheckPath} className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-ink">{detail.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{detail.body}</p>
                    <p className="mt-2 text-xs font-semibold tracking-wide text-brand-ink">{detail.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: all badges and certificates */}
          <div
            ref={rightRef}
            className="grid grid-cols-2 gap-4 sm:gap-5"
          >
            {items.map((item, i) => (
              <div
                key={item.src}
                style={{ transitionDelay: rightShown ? `${i * 100}ms` : '0ms' }}
                className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  rightShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <AccreditationCard item={item} onOpen={setOpenItem} onError={markFailed} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImageLightbox item={openItem} onClose={closeLightbox} />
    </section>
  )
}

// Positions suit the illustration sitting in the LEFT column on desktop:
// both badges stay inside the hero's padding so nothing is clipped at the page edge.
const heroBadges = [
  {
    title: 'CPD Accredited',
    subtitle: 'The CPD Standards Office',
    position: '-left-3 top-8 sm:-left-8 lg:-left-4 xl:-left-8',
    delay: '',
  },
  {
    title: 'ACTD Aligned',
    subtitle: 'American Council of Training & Development',
    position: '-right-3 bottom-10 sm:-right-8',
    delay: '[animation-delay:1.5s]',
  },
]

const heroTrust = [
  { label: 'CPD Accredited', icon: shieldCheckPath },
  {
    label: 'Specialist-led Faculty',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  { label: 'Online & Flexible', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { label: 'Case-based Learning', icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4' },
]

// Hero illustration, drawn on a 400x500 grid (same 4:5 ratio as the card).
// Everything sits in the band the floating badges leave free, checked at the smallest card
// (340px wide, where the badges cover the most): "CPD Accredited" covers roughly x < 235,
// y < 130 and "ACTD Aligned" x > 165, y > 360; the caption pill sits below y 455 on the left.
const LAMP = { x: 284, y: 172, r: 52 }

// Concentric rings of small LEDs in the lamp head: [radius, number of dots, dot radius]
const lampRings = [
  [37, 15, 2.5],
  [25, 10, 2.3],
  [14, 6, 2.1],
]

const lampDots = lampRings.flatMap(([ring, count, r], ringIndex) =>
  Array.from({ length: count }, (_, i) => {
    // Offset every other ring by half a step so the dots don't line up
    const angle = ((i + (ringIndex % 2) * 0.5) / count) * Math.PI * 2
    return {
      key: `${ring}-${i}`,
      cx: +(LAMP.x + Math.cos(angle) * ring).toFixed(2),
      cy: +(LAMP.y + Math.sin(angle) * ring).toFixed(2),
      r,
    }
  })
)

// Small "+" marks scattered in the free space: [x, y, size, colour class]
const plusMarks = [
  [36, 248, 5, 'stroke-white'],
  [376, 132, 4, 'stroke-accent-soft'],
  [372, 328, 5, 'stroke-white'],
  [140, 420, 4, 'stroke-accent-soft'],
  [190, 222, 3, 'stroke-white'],
]

// Suture thread trailing from the needle's swaged end, drawn with pathLength="100"
const threadPath =
  'M129 182 C142 214 108 238 80 230 S36 252 50 286 S112 318 96 356 S56 408 112 432'

// All motion is opt-in (no-preference), so prefers-reduced-motion users get a still image
// with the thread fully drawn. No SMIL is used, so CSS alone controls every animation.
const surgStyles = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes mga-surg-pulse {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }
  @keyframes mga-surg-draw {
    0% { stroke-dashoffset: 100; opacity: 1; }
    55% { stroke-dashoffset: 0; opacity: 1; }
    85% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes mga-surg-shine {
    0%, 15% { transform: translate(0, 0); opacity: 0; }
    25% { opacity: 1; }
    55% { transform: translate(38px, 1px); opacity: 1; }
    65%, 100% { transform: translate(44px, 1px); opacity: 0; }
  }
  .mga-surg-glow { animation: mga-surg-pulse 5s ease-in-out infinite; }
  .mga-surg-thread {
    stroke-dasharray: 100;
    animation: mga-surg-draw 7s ease-in-out infinite;
  }
  .mga-surg-gleam {
    opacity: 0;
    animation: mga-surg-shine 4.5s ease-in-out infinite;
  }
}
`

// Gradient stops take the theme colours through CSS variables
const stop = (color, opacity = 1) => ({ stopColor: `var(--color-${color})`, stopOpacity: opacity })

function SurgeryIllustration() {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of surgical instruments under an operating lamp"
      className="absolute inset-0 h-full w-full"
    >
      <style>{surgStyles}</style>
      <defs>
        <pattern id="mga-surg-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className="fill-white" fillOpacity="0.07" />
        </pattern>
        <radialGradient id="mga-surg-fade" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id="mga-surg-dots-mask">
          <rect width="400" height="500" fill="url(#mga-surg-fade)" />
        </mask>
        {/* Mint glow around the lamp head */}
        <radialGradient id="mga-surg-lamp-glow">
          <stop offset="0%" style={stop('glow', 0.55)} />
          <stop offset="50%" style={stop('brand', 0.18)} />
          <stop offset="100%" style={stop('brand', 0)} />
        </radialGradient>
        {/* Light falling from the lamp onto the instruments */}
        <linearGradient id="mga-surg-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={stop('glow', 0.2)} />
          <stop offset="100%" style={stop('glow', 0)} />
        </linearGradient>
        <radialGradient id="mga-surg-backlight" cx="62%" cy="32%" r="60%">
          <stop offset="0%" style={stop('brand', 0.22)} />
          <stop offset="100%" style={stop('brand', 0)} />
        </radialGradient>
        <filter id="mga-surg-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <radialGradient id="mga-surg-gleam-fill">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background: soft green backlight + dot grid faded towards the edges */}
      <g aria-hidden="true">
        <rect width="400" height="500" fill="url(#mga-surg-backlight)" />
        <rect width="400" height="500" fill="url(#mga-surg-dots)" mask="url(#mga-surg-dots-mask)" />
      </g>

      {/* Small "+" marks */}
      <g aria-hidden="true" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35">
        {plusMarks.map(([x, y, s, tone]) => (
          <path key={`${x}-${y}`} className={tone} d={`M${x - s} ${y}h${s * 2} M${x} ${y - s}v${s * 2}`} />
        ))}
      </g>

      {/* Overhead operating lamp: ceiling arm, glow, light beam, head with rings of LEDs */}
      <g aria-hidden="true">
        <path
          d={`M${LAMP.x - 46} ${LAMP.y + 24} L${LAMP.x + 46} ${LAMP.y + 24} L410 352 L138 352 Z`}
          fill="url(#mga-surg-beam)"
          filter="url(#mga-surg-soft)"
          className="mga-surg-glow"
        />
        <circle cx={LAMP.x} cy={LAMP.y} r="92" fill="url(#mga-surg-lamp-glow)" className="mga-surg-glow" />

        <g fill="none" className="stroke-glow" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${LAMP.x} ${LAMP.y - LAMP.r} V84 Q${LAMP.x} 62 308 56 L346 48 V0`} />
          <circle cx={LAMP.x} cy="84" r="4.5" className="fill-ink" />
          <circle cx="346" cy="48" r="4.5" className="fill-ink" />
        </g>

        <circle cx={LAMP.x} cy={LAMP.y} r={LAMP.r} className="fill-ink stroke-glow" fillOpacity="0.85" strokeOpacity="0.8" strokeWidth="2" />
        <circle cx={LAMP.x} cy={LAMP.y} r={LAMP.r - 7} fill="none" className="stroke-brand" strokeOpacity="0.4" strokeWidth="1" />
        <g className="mga-surg-glow">
          {lampDots.map((d) => (
            <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} className="fill-glow" fillOpacity="0.9" />
          ))}
        </g>
        {/* Sterile centre handle */}
        <circle cx={LAMP.x} cy={LAMP.y} r="6" className="fill-ink stroke-glow" strokeOpacity="0.8" strokeWidth="1.5" />
      </g>

      {/* Curved suture needle with its thread */}
      <g aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
        <path
          className="mga-surg-thread stroke-brand"
          d={threadPath}
          pathLength="100"
          fill="none"
          strokeWidth="1.8"
          strokeOpacity="0.85"
        />
        {/* Crescent needle: sharp point on the left, swaged end on the right */}
        <path
          d="M60 183 A35 35 0 0 1 130 182 L126 182 A31 31 0 0 0 64 184 Z"
          className="fill-glow stroke-glow"
          fillOpacity="0.85"
          strokeOpacity="0.9"
          strokeWidth="1"
        />
        <rect x="124" y="179" width="8" height="5" rx="1.5" className="fill-white" fillOpacity="0.85" />
      </g>

      {/* Scalpel: #10-style blade pointing left, flat handle with grip lines */}
      <g aria-hidden="true" transform="translate(0 10) rotate(-14 250 255)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M148 252 C160 266 186 267 207 263 L207 248 L148 252 Z"
          className="fill-white stroke-glow"
          fillOpacity="0.14"
          strokeOpacity="0.9"
          strokeWidth="1.6"
        />
        <path d="M207 251 H218 V260 H207" fill="none" className="stroke-glow" strokeOpacity="0.7" strokeWidth="1.4" />
        <rect x="218" y="247" width="142" height="15" rx="5" className="fill-ink stroke-glow" fillOpacity="0.6" strokeOpacity="0.85" strokeWidth="1.8" />
        <g className="stroke-glow" strokeOpacity="0.45" strokeWidth="1.2">
          {[300, 308, 316, 324, 332, 340].map((x) => (
            <path key={x} d={`M${x} 251 v7`} />
          ))}
        </g>
        {/* Gleam that runs along the cutting edge */}
        <ellipse className="mga-surg-gleam" cx="162" cy="262" rx="7" ry="2" fill="url(#mga-surg-gleam-fill)" />
      </g>

      {/* Curved forceps (ring handles on the right, curved jaws pointing left) */}
      <g
        aria-hidden="true"
        transform="translate(0 10) rotate(-14 250 320)"
        fill="none"
        className="stroke-glow"
        strokeOpacity="0.85"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="338" cy="309" r="10" />
        <circle cx="338" cy="331" r="10" />
        <path d="M328 311 L262 318.5" />
        <path d="M328 329 L262 321.5" />
        {/* Ratchet near the rings */}
        <path d="M314 316 l4 -1.5 M314 324 l4 1.5" strokeOpacity="0.5" strokeWidth="1.2" />
        <rect x="250" y="315" width="14" height="10" rx="2.5" className="fill-ink" fillOpacity="0.7" />
        <path d="M250 318 Q205 314 170 299" />
        <path d="M250 322 Q207 320 172 303" />
      </g>
    </svg>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] motion-safe:animate-fade-in [animation-delay:300ms]">
      {/* Brand glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-brand)_28%,transparent),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-brand/30 bg-linear-to-br from-deep via-ink to-accent/25 shadow-glow">
        <SurgeryIllustration />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent"
        />
        {/* Bottom-left and below the "ACTD Aligned" badge's lowest point, so the two never meet */}
        <span className="absolute bottom-2 left-4 rounded-md border border-brand/40 bg-ink/75 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-glow backdrop-blur sm:bottom-2.5">
          Skill · Precision · Practice
        </span>
      </div>

      {heroBadges.map((badge) => (
        <div
          key={badge.title}
          className={`absolute ${badge.position} flex max-w-[210px] items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-card backdrop-blur motion-safe:animate-float ${badge.delay}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-semibold text-ink">{badge.title}</span>
            <span className="block text-[11px] leading-snug text-slate-600">{badge.subtitle}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function SectionHeading({ children, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        {children}
      </h2>
      <AccentRule center />
    </div>
  )
}

const starPath = 'M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z'

// Supports decimal ratings (e.g. 4.5) by clipping a brand row over a grey row.
function Stars({ rating }) {
  const pct = Math.max(0, Math.min(5, rating)) * 20
  const row = (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((s) => (
        <svg key={s} viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
          <path d={starPath} />
        </svg>
      ))}
    </div>
  )
  return (
    <div className="relative" role="img" aria-label={`${rating} out of 5 stars`}>
      <div className="text-slate-200">{row}</div>
      <div className="absolute inset-y-0 left-0 overflow-hidden text-brand" style={{ width: `${pct}%` }}>
        {row}
      </div>
    </div>
  )
}

function TestimonialCard({ t }) {
  return (
    <article className="mx-3 flex w-[300px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow sm:w-[340px]">
      {/* Quote mark + rating */}
      <div className="flex items-center justify-between gap-3">
        <svg viewBox="0 0 32 24" className="h-6 w-8 text-accent" fill="currentColor" aria-hidden="true">
          <path d="M0 24V14C0 6.3 4.1 1.6 12.3 0l1.3 3.1C9.3 4.4 7.1 6.9 6.8 10.6H13V24H0zm18 0V14c0-7.7 4.1-12.4 12.3-14l1.3 3.1c-4.3 1.3-6.5 3.8-6.8 7.5H31V24H18z" />
        </svg>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">{t.rating}</span>
          <Stars rating={t.rating} />
        </div>
      </div>

      {/* Review */}
      <p className="mt-4 line-clamp-4 flex-1 text-[15px] leading-relaxed text-body">{t.quote}</p>

      <div className="my-5 h-px bg-slate-200" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/25">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
            <path d="M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold text-ink">{t.name}</p>
          <p className="truncate text-sm text-slate-500">{t.role}</p>
        </div>
      </div>
    </article>
  )
}

// Endless right-to-left scroll. The list is rendered twice and the track moves by exactly half,
// so the loop is seamless. Pauses on hover. Reduced-motion users get a normal swipeable row.
function TestimonialsMarquee() {
  return (
    <div className="relative">
      <style>{`
        @keyframes mga-testimonials-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .mga-testimonials-track { animation: mga-testimonials-scroll 45s linear infinite; }
        .mga-testimonials-viewport:hover .mga-testimonials-track,
        .mga-testimonials-viewport:focus-within .mga-testimonials-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .mga-testimonials-track { animation: none; }
          .mga-testimonials-viewport { overflow-x: auto; }
        }
      `}</style>

      <div className="mga-testimonials-viewport overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="mga-testimonials-track flex w-max">
          {testimonials.map((t) => (
            <TestimonialCard key={`a-${t.name}`} t={t} />
          ))}
          {testimonials.map((t) => (
            <div key={`b-${t.name}`} aria-hidden="true" className="flex">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const cardClass =
  'group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow'

// Course badge colours on this site. The data file's badgeClass is the fallback for any new label.
const badgeTone = {
  TRENDING: 'bg-accent/10 text-deep ring-1 ring-accent/25',
  TOP: 'bg-brand/10 text-brand-ink ring-1 ring-brand/30',
  NEW: 'bg-glow/25 text-deep ring-1 ring-glow/60',
}

// Live API data picked by slug; badges and fallback descriptions come from surgeryCourses.js.
// Courses that fail to load or aren't found are skipped, and the section hides if none load.
function TrendingCourses() {
  const [cards, setCards] = useState(null) // null while loading

  useEffect(() => {
    let active = true

    loadSurgeryCourses()
      .then((list) => {
        if (!active) return
        setCards(
          trendingSurgeryCourses.flatMap((item) => {
            const course = list.find((c) => c.slug === item.slug)
            if (!course) return []
            return [
              {
                ...item,
                title: course.title,
                fee: course.fee,
                image: course.image,
                description: course.description || item.description || '',
              },
            ]
          }),
        )
      })
      .catch((err) => {
        if (!active) return
        console.error('Could not load trending courses:', err)
        setCards([])
      })

    return () => {
      active = false
    }
  }, [])

  if (cards && cards.length === 0) return null

  return (
    <section id="courses" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading>Trending Courses</SectionHeading>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy={cards === null}
        >
          {cards === null
            ? trendingSurgeryCourses.map((item) => (
                <div key={item.slug} aria-hidden="true" className={`${cardClass} animate-pulse`}>
                  <div className="h-1.5 bg-slate-200" />
                  <div className="aspect-[776/450] bg-slate-100" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="h-6 w-20 rounded-md bg-slate-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                    </div>
                    <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                      <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))
            : cards.map((course) => (
                <div key={course.slug} className={cardClass}>
                  <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-brand to-accent" />
                  <CourseCardImage key={course.image} src={course.image} />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={`self-start rounded-md px-2.5 py-1 text-xs font-bold tracking-wider ${badgeTone[course.badge] ?? course.badgeClass}`}
                    >
                      {course.badge}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                      {course.title}
                    </h3>
                    {/* flex-1 on a wrapper, not the clamped <p>, or a 4th line peeks out below the clamp */}
                    <div className="mt-2 flex-1">
                      <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
                    </div>
                    <dl className="mt-5 flex items-baseline justify-between gap-3 border-t border-slate-100 pt-4">
                      <dt className="text-xs text-slate-500">Registration Fee</dt>
                      <dd className="font-display text-base font-semibold text-ink">{course.fee}</dd>
                    </dl>
                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/courses/${course.slug}`}
                        className={`flex-1 rounded-lg border border-deep/30 px-4 py-2 text-center text-sm font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white ${focusRing}`}
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/courses/${course.slug}#enroll`}
                        className={`flex-1 rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-glow ${focusRing}`}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

// One "Why choose us" card. The outer wrapper handles the staggered fade-up reveal (with its
// delay); the inner card handles hover, so the reveal delay never slows the hover effects.
function FeatureCard({ feature, index, shown }) {
  return (
    <div
      style={{ transitionDelay: shown ? `${index * 90}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-glow">
        {/* Soft teal wash that fades in on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand/0 via-brand/0 to-brand/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Large number watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-8xl font-bold leading-none text-brand/10 transition-colors duration-300 group-hover:text-brand/20"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon in a teal gradient container */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-brand to-glow text-ink shadow-card transition-transform duration-300 group-hover:scale-110">
          <Icon path={feature.icon} className="h-7 w-7" />
        </div>

        <h3 className="relative mt-6 font-display text-xl font-semibold text-ink">{feature.title}</h3>
        <p className="relative mt-3 text-sm leading-relaxed text-slate-600 md:text-[15px]">
          {feature.description}
        </p>

        {/* Bottom accent line grows on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-brand to-accent transition-transform duration-500 group-hover:scale-x-100"
        />
      </article>
    </div>
  )
}

// Why choose us: intro block (eyebrow, heading, subtext, trust badges, CTA) + 6 feature cards.
// Grid: 1 column on mobile, 2 on tablet, 3 on desktop.
function WhyChooseUs() {
  const [introRef, introShown] = useReveal(0.2)
  const [gridRef, gridShown] = useReveal(0.1)

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden bg-white py-20 md:py-24"
    >
      {/* Soft teal glows in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Intro block */}
        <div
          ref={introRef}
          className={`grid grid-cols-1 gap-8 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:grid-cols-[1.3fr_1fr] lg:items-end ${
            introShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div>
            <Eyebrow>Why Choose Us</Eyebrow>
            <h2
              id="why-choose-heading"
              className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-5xl"
            >
              Learn Surgery the Way <span className={gradientLight}>Specialists Teach It</span>
            </h2>
            {/* TODO: confirm "specialist-led" for the surgery programs. */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Medical Global Academy offers specialist-led surgery education, designed to help
              healthcare professionals advance their careers with confidence.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            {/* Trust badges */}
            <ul className="flex flex-wrap items-center gap-3 lg:justify-end" aria-label="Accreditations">
              {whyBadges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3.5 py-2 text-sm font-semibold text-ink"
                >
                  <Icon path={shieldCheckPath} className="h-4 w-4 text-brand-ink" strokeWidth={2} />
                  {badge} Accredited
                </li>
              ))}
            </ul>

            <Link
              to="/courses"
              className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-glow hover:shadow-glow ${focusRing}`}
            >
              Explore Courses
              <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} shown={gridShown} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SurgeryHome() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const { status: facultyStatus, doctors, retry: retryFaculty } = useFaculty()
  const previewDoctors = doctors.slice(0, 4)
  const [activeDoctor, setActiveDoctor] = useState(null)
  const [blinkCount, setBlinkCount] = useState(0)
  const [activeStep, setActiveStep] = useState(null)

  const selectDoctor = (i) => {
    setActiveDoctor(i)
    setBlinkCount((c) => c + 1)
  }

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-body text-body">
      {/* 1. Hero */}
      {/* Top padding = fixed navbar height (Navbar is fixed on Home: py-3 + 44px logo + 1px border,
          md: py-4 + 52px logo + 1px border). Change both together. */}
      <section className="relative overflow-hidden bg-hero-dark pt-17.25 text-white md:pt-21.25">
        {/* Dot grid, faded towards the edges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        {/* Running suture stitch along the bottom edge */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-brand opacity-[0.15]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M0 64 Q150 34 300 64 T600 64 T900 64 T1200 64" strokeDasharray="16 12" />
        </svg>

        {/* Text first in the DOM (and on mobile); on desktop the illustration moves to the left column.
            Extra bottom padding leaves room for the stats strip that overlaps the hero's lower edge. */}
        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-14 px-4 pt-6 pb-28 sm:px-6 md:pt-10 md:pb-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pt-12 xl:gap-20 xl:px-8">
          <div className="text-left lg:order-2">
            <div className="mb-6 flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-8 shrink-0 bg-brand sm:w-12" />
              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-brand sm:text-xs sm:tracking-[0.25em]">
                Welcome to Medical Global Academy
              </span>
            </div>
            <h1
              className="mb-6 font-display text-[clamp(1.75rem,6vw,3.75rem)] lg:text-[clamp(2.5rem,4.2vw,3.6rem)] font-bold leading-[1.08] tracking-tight motion-safe:animate-fade-up [animation-delay:100ms]"
            >
              {/* One phrase per line; sizes are capped so neither line wraps at any breakpoint */}
              <span className="block">
                Master <span className={gradientDark}>Surgery.</span>
              </span>
              <span className="block">
                Lead with <span className={gradientDark}>Confidence.</span>
              </span>
            </h1>
            {/* Topics taken from the live API's surgery course names and descriptions (29 Oct 2026). */}
            <p className="mb-10 max-w-[540px] text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
              Fellowship programs in general, laparoscopic, minimal access, robotic and oncological
              surgery, covering preoperative assessment, operative decision-making, postoperative
              care and the management of surgical complications. Grow your career with expert guidance.
            </p>
            <div className="flex flex-col justify-start gap-4 sm:flex-row motion-safe:animate-fade-up [animation-delay:300ms]">
              <Link
                to="/courses"
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
              >
                Our Courses
              </Link>
              <a
                href="tel:+919310027474"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
              >
                Talk to Counsellor
              </a>
            </div>

            <ul className="mt-10 grid max-w-135 grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-6 motion-safe:animate-fade-up [animation-delay:400ms]">
              {heroTrust.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm even:border-l even:border-white/15 even:pl-4"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:order-1">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2. Stats bar: a glass strip that overlaps the bottom of the hero.
          The section's own background is transparent where it overlaps, then page grey below. */}
      <section
        ref={statsRef}
        className="relative z-10 -mt-16 bg-[linear-gradient(to_bottom,transparent_4rem,var(--color-page)_4rem)] px-4 sm:px-6"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-xl border border-brand/25 bg-deep/80 shadow-glow backdrop-blur-xl md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 py-6 text-center md:py-8 ${i % 2 === 0 ? 'border-r border-white/10' : ''} ${
                i < 2 ? 'border-b border-white/10 md:border-b-0' : ''
              } ${i === 1 ? 'md:border-r' : ''}`}
            >
              <div className="font-display text-3xl font-bold text-brand md:text-4xl">
                <CountUp end={stat.value} suffix={stat.suffix} start={statsVisible} />
              </div>
              <div className="mt-2 text-sm text-slate-300 md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Accreditation: content left, certificates right */}
      <AccreditationSection />

      {/* 4. Doctors preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Eyebrow center>Our Medical Experts</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
              Meet Our <span className={gradientLight}>Expert Doctors</span>
            </h2>
            {/* TODO: confirm this description once the surgery faculty is confirmed. */}
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              Our team of experienced surgeons and medical specialists provides advanced
              training and academic excellence.
            </p>
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {facultyStatus === 'loading' && 'Loading doctors…'}
          </p>

          {facultyStatus === 'loading' && (
            <div aria-busy="true" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {facultyStatus === 'error' && (
            <div role="alert" className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-page p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">We couldn&apos;t load our doctors</p>
              <p className="mt-1 text-sm text-slate-600">Please check your connection and try again.</p>
              <button
                type="button"
                onClick={retryFaculty}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-ink transition-colors hover:bg-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Try again
              </button>
            </div>
          )}

          {facultyStatus === 'ready' && previewDoctors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewDoctors.map((doctor, i) => (
                <DoctorCard
                  key={activeDoctor === i ? `${doctor.id}-${blinkCount}` : doctor.id}
                  doctor={doctor}
                  selected={activeDoctor === i}
                  onSelect={() => selectDoctor(i)}
                />
              ))}
            </div>
          )}

          {facultyStatus !== 'error' && (
            <div className="mt-10 text-center">
              <Link
                to="/doctor"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-deep/30 px-6 text-sm font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                View all faculty
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}

          {/* TODO: confirm each doctor's credentials before describing the team as verified.
              Shown only once FACULTY_CONFIRMED is true (data/facultyApi.js). */}
          {FACULTY_CONFIRMED && facultyStatus === 'ready' && (
            <p className="mt-6 text-center text-sm text-slate-600">
              All doctors are verified · CPD &amp; ACTD accredited
            </p>
          )}
        </div>
      </section>

      {/* 5. Hospital partners */}
      <section className="bg-page py-14 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-600 font-semibold mb-8">
            Our Hospital Partners
          </p>
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ animationDuration: `${hospitals.length * 10}s` }}
          >
            {[...hospitals, ...hospitals, ...hospitals, ...hospitals].map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= hospitals.length}
                className="shrink-0 whitespace-nowrap px-8 font-display text-lg font-semibold text-slate-500 transition-colors hover:text-deep md:px-12 md:text-xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trending courses */}
      <TrendingCourses />

      {/* 7. Career Pathway — vertical timeline (alternating on desktop, stacked on mobile) */}
      <section className="relative overflow-hidden bg-page py-20 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center">
            <Eyebrow center>Career Pathway</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
              Your Path to <span className={gradientLight}>Medical Excellence</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              A structured, four-stage learning journey designed to take medical professionals from
              enrolment to globally recognised certification.
            </p>
          </div>

          <ol className="relative mt-14">
            {/* Timeline line: left on mobile, centred on desktop */}
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-5 w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b from-brand via-glow to-accent lg:left-1/2"
            />

            {pathwaySteps.map((step, i) => {
              const isActive = activeStep === i
              const isLast = i === pathwaySteps.length - 1
              const onLeft = i % 2 === 0
              return (
                <li
                  key={step.title}
                  className="relative pb-8 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pb-12 lg:pl-0"
                >
                  {/* Numbered dot on the line */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 left-5 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-brand font-display text-sm font-bold transition-colors duration-300 lg:left-1/2 ${
                      isActive ? 'bg-brand text-ink shadow-glow' : 'bg-white text-brand-ink'
                    }`}
                  >
                    {step.num}
                  </span>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveStep(i)
                      }
                    }}
                    className={`group relative flex cursor-pointer flex-col rounded-xl border bg-white p-6 transition-all duration-300 ${focusRing} lg:w-full lg:max-w-md ${
                      onLeft ? 'lg:col-start-1 lg:justify-self-end' : 'lg:col-start-2'
                    } ${
                      isActive
                        ? '-translate-y-1 border-brand shadow-glow'
                        : isLast
                          ? 'border-accent/40 shadow-card hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-glow'
                          : 'border-slate-200 shadow-card hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-glow'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl transition-colors duration-300 ${
                          isActive ? 'bg-brand/15' : 'bg-page'
                        }`}
                      >
                        {step.icon}
                      </span>
                      {/* Step badge */}
                      <span className="rounded-md bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink">
                        {step.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>

                    {/* Certification badges on last card */}
                    {step.badges && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.badges.map((badge) => (
                          <span
                            key={badge}
                            className="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-ink"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3.5 w-3.5 text-brand-ink"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d={checkPath} />
                            </svg>
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Bottom highlights bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {pathwayHighlights.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why choose us */}
      <WhyChooseUs />

      {/* 9. Testimonials */}
      {SHOW_TESTIMONIALS && (
        <section className="overflow-hidden bg-page py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
                What Our <span className={gradientLight}>Doctors Say</span>
              </h2>
              <AccentRule center />
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
                Hear from healthcare professionals who advanced their careers with our
                specialist-led programs.
              </p>
            </div>
          </div>
          <TestimonialsMarquee />
        </section>
      )}

      {/* 10. FAQ */}
      <FaqSection
        variant="dark"
        defaultOpen={0}
        title="Frequently asked questions from our students"
        items={surgeryFaqs}
      />
    </div>
  )
}

export default SurgeryHome