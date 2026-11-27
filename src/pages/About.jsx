import { Link } from 'react-router-dom'
import ValuesSection from '../components/ValuesSection.jsx'
import StatsCounter from '../components/StatsCounter.jsx'
import EligibilitySection from '../components/EligibilitySection.jsx'
import { FOUNDED_YEAR } from '../constants/site.js'

// Gradient text for highlighted words: brand-ink to accent on light backgrounds, brand to glow on dark
const gradientLight = 'bg-linear-to-r from-brand-ink to-accent bg-clip-text text-transparent'
const gradientDark = 'bg-linear-to-r from-brand to-glow bg-clip-text text-transparent'

// Company-wide specialties (Medical Global Academy teaches all of these); Surgery is listed first on this site.
const specialties = [
  'Surgery',
  'Neurology',
  'Cardiology',
  'Medicine',
  'Oncology',
  'Nephrology',
  'Orthopedics',
  'Obstetrics & Gynecology',
]

// Hero "What we offer" tiles. Each line restates the hero copy; no new claims.
const offerings = [
  {
    title: 'PG Diplomas',
    line: 'Built for the professional development of healthcare practitioners.',
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    delay: '[animation-delay:350ms]',
  },
  {
    title: 'Fellowships',
    line: 'Flexible learning with attending and non-attending classes.',
    icon: 'M12 15a4 4 0 100-8 4 4 0 000 8z M9 14.5L8 21l4-2 4 2-1-6.5',
    delay: '[animation-delay:425ms]',
  },
  {
    title: 'Certificates',
    line: 'Pursue your education at your convenience, without compromising on quality.',
    icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5',
    delay: '[animation-delay:500ms]',
  },
]

const recognitions = ['CPD Accredited', 'ACTD Accredited', 'Global Recognition']

// Teaching approach steps. Describes how the programs are delivered; no outcome claims.
// TODO: confirm the faculty claim ("experienced specialists") with the academic team.
const approach = [
  {
    title: 'Case-Based Learning',
    line: 'Topics are taught through clinical cases, from presentation to management.',
    icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4',
  },
  {
    title: 'Specialist-Led Faculty',
    line: 'Sessions are led by experienced specialists in the field.',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  {
    title: 'Flexible Online Access',
    line: 'Live and recorded sessions you can fit around clinical work.',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4',
  },
  {
    title: 'Certification',
    line: 'A certificate on completion, from a CPD and ACTD accredited provider.',
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
  },
]

// Grouped from the live course API (name/slug filter, checked 29 Oct 2026). `courses` lists the
// slugs behind each card; `line` only repeats topics named in those course descriptions.
// Not grouped here: paediatric, gynaecology, ENT, eye, dental, urology and GI endoscopy courses,
// and the courses that are also listed on another MGA specialty site (see surgeryCourseApi.js).
// TODO: confirm the six groups and their wording with the academic team.
const specializations = [
  {
    title: 'General & GI Surgery',
    line: 'Gastrointestinal, hepatobiliary, colorectal and bariatric surgery, with perioperative care.',
    courses: [
      'fellowship-in-general-surgery',
      'fellowship-in-gastrointestinal-gi-surgery',
      'fellowship-in-colorectal-surgery',
      'fellowship-in-bariatric-surgery',
      'fellowship-in-trauma-surgery',
    ],
    // Scalpel: handle and blade
    icon: 'M2.5 21.5l8-8 M10.5 13.5L17 7c1.6-1.6 3.6-2.6 4.5-2.5.1.9-.9 2.9-2.5 4.5l-6.5 6.5z',
  },
  {
    title: 'Laparoscopic & Robotic Surgery',
    line: 'Laparoscopic principles, safe access, suturing and knot-tying, hernia repair and robotic-assisted techniques.',
    courses: [
      'fellowship-in-laparoscopic-surgery',
      'fellowship-in-laparoscopy',
      'fellowship-in-laparoscopic-hernia-surgery',
      'fellowship-in-minimal-access-surgery',
      'fellowship-in-minimally-invasive-surgery',
      'fellowship-in-robotic-surgery',
    ],
    // Grasper: long shaft, open jaws and two ring handles
    icon: 'M8.5 15.5L17 7 M17 7l.5-4.5 M17 7l4.5-.5 M8.5 15.5l-2 2 M8.5 15.5l2 2 M5 21a2 2 0 100-4 2 2 0 000 4z M12 22a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    title: 'Surgical Oncology',
    line: 'Tumour staging, oncologic surgical planning and lymph-node management, including breast and head & neck cancers.',
    courses: [
      'fellowship-in-surgical-oncology',
      'fellowship-in-oncosurgery',
      'fellowship-in-breast-onco-surgery',
      'fellowship-in-breast-surgery',
      'fellowship-in-head-and-neck-oncosurgery',
      'fellowship-in-head-neck-surgery',
    ],
    // Surgical scissors
    icon: 'M6 9a3 3 0 100-6 3 3 0 000 6z M6 21a3 3 0 100-6 3 3 0 000 6z M8.2 8.2L20 19 M8.2 15.8L20 5',
  },
  {
    title: 'Plastic & Reconstructive Surgery',
    line: 'Wound healing, skin grafts and flaps, burn reconstruction, hand surgery and aesthetic procedures.',
    courses: [
      'fellowship-in-plastic-surgery',
      'fellowship-in-cosmetic-surgery',
      'fellowship-in-burn-reconstructive-surgery',
      'fellowship-in-hand-surgery',
    ],
    // Curved needle with a trailing thread
    icon: 'M4 11a8 8 0 0116 0 M4 11l1.6.9 M20 11c0 3.5-2.5 4-4.5 5.5S14 20 17 21',
  },
  {
    title: 'Orthopedic & Arthroscopic Surgery',
    line: 'Fracture management, joint reconstruction, knee and shoulder arthroscopy, sports injuries and spine disorders.',
    courses: [
      'fellowship-in-orthopedic-surgery',
      'fellowship-in-arthroscopy',
      'fellowship-in-arthroscopy-and-sports-medicine',
      // TODO: spine overlap. These two are not caught by the other specialty site's filter but
      // may belong there too (see surgeryCourseApi.js); decide where they belong.
      'fellowship-in-spine-surgery',
      'fellowship-in-endoscopic-spine-surgery',
    ],
    // Bone: shaft with a rounded knuckle at each end
    icon: 'M7 14.5L14.5 7 M9.5 17L17 9.5 M14.5 7a2.2 2.2 0 113.1-3.1A2.2 2.2 0 1120.1 7 2.2 2.2 0 0117 9.5 M7 14.5a2.2 2.2 0 10-3.1 3.1A2.2 2.2 0 103.9 20.1 2.2 2.2 0 009.5 17',
  },
  {
    title: 'Cardiothoracic & Vascular Surgery',
    line: 'Lung resection and VATS, coronary and valve surgery, and open and endovascular vascular repair.',
    courses: [
      'fellowship-in-thoracic-surgery',
      'fellowship-in-vascular-surgery',
      // TODO: cardiology overlap. These four are also shown on the cardiology site; decide where they belong.
      'fellowship-in-cardiothoracic-surgery',
      'fellowship-in-cardiac-surgery',
      'fellowship-in-minimally-invasive-cardiac-surgery',
      'fellowship-in-pediatric-cardiac-surgery',
    ],
    // Heart outline with a stitched line down the middle
    icon: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z M12 9.5v7 M10.5 11.5h3 M10.5 14.5h3',
  },
]

// TODO: confirm "Clinical Mentorship" is part of the surgery programs (company-level label kept as is).
const learningModes = [
  {
    label: 'Live Online Classes',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4 M10 8.5v4l3.5-2-3.5-2z',
  },
  {
    label: 'Self-Paced Learning',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  },
  {
    label: 'Clinical Mentorship',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
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
      className={`mt-5 h-1 w-14 rounded-full bg-linear-to-r from-brand to-accent ${center ? 'mx-auto' : ''}`}
    />
  )
}

// Suture line on a 1200x120 grid: short stitches following a gentle wave, with a small
// cross-stitch every fifth gap. Built once at load; the shapes never change.
const sutureY = (x) => 60 + 16 * Math.sin((x / 300) * Math.PI * 2)
const pt = (x) => `${x} ${sutureY(x).toFixed(1)}`
let stitchPath = ''
let crossPath = ''
for (let x = 0; x < 1200; x += 20) {
  stitchPath += `M${pt(x + 4)} L${pt(x + 16)} `
  if (x > 0 && x % 100 === 0) {
    const y = sutureY(x)
    crossPath += `M${x - 4} ${(y - 4).toFixed(1)} L${x + 4} ${(y + 4).toFixed(1)} M${x - 4} ${(y + 4).toFixed(1)} L${x + 4} ${(y - 4).toFixed(1)} `
  }
}

// slice (not none) keeps the stitches and crosses undistorted; narrow screens show the middle part
function SutureTrace({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-brand ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d={stitchPath} strokeWidth="2.5" />
      <path d={crossPath} strokeWidth="1.5" />
    </svg>
  )
}

// Faint surgical line-art behind the "Credibility & Recognition" card:
// operating-lamp rings, two stitched curves and a few "+" marks
function SurgicalPattern() {
  const plusMarks = [[60, 50], [170, 110], [250, 40], [90, 190], [300, 200], [370, 270], [200, 260]]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <g className="stroke-white" strokeOpacity="0.08" strokeWidth="1">
        {[16, 32, 50, 70].map((r) => (
          <circle key={r} cx="340" cy="64" r={r} />
        ))}
      </g>
      <circle cx="340" cy="64" r="5" className="fill-glow" fillOpacity="0.2" />
      <g className="stroke-white" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="8 7" strokeLinecap="round">
        <path d="M-10 250C70 205 150 290 240 240S360 200 410 225" />
        <path d="M-10 140C40 120 90 160 150 135" />
      </g>
      <g className="stroke-glow" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round">
        {plusMarks.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 4} ${y}h8 M${x} ${y - 4}v8`} />
        ))}
      </g>
    </svg>
  )
}

function OfferingsBlock() {
  return (
    <div className="mt-10">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand motion-safe:animate-fade-up [animation-delay:300ms]">
        What we offer
        <span className="h-px flex-1 bg-linear-to-r from-brand/40 to-transparent" />
      </p>

      <ul className="mt-5 space-y-3">
        {offerings.map((item) => (
          <li key={item.title} className={`motion-safe:animate-fade-up ${item.delay}`}>
            <Link
              to="/courses"
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-white/[0.07] hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Brand edge appears on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-linear-to-b from-brand to-glow transition-transform duration-300 group-hover:scale-y-100"
              />
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand ring-1 ring-brand/40 transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                <Icon path={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold text-white">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-300">{item.line}</span>
              </span>
              <span className="shrink-0 text-brand/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand">
                <Icon path="M9 6l6 6-6 6" className="h-4 w-4" strokeWidth={2} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/courses"
        className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-7 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto motion-safe:animate-fade-up [animation-delay:575ms] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        Explore Courses
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10h12 M11 5l5 5-5 5" />
        </svg>
      </Link>
    </div>
  )
}

// Horizontal 4-step strip on desktop, vertical timeline below lg.
// A thin line runs through the number circles in both layouts.
function ApproachSteps() {
  return (
    <ol className="relative mx-auto grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4 lg:gap-6">
      <li
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px bg-linear-to-b from-brand to-accent lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto lg:bg-linear-to-r"
      />
      {approach.map((step, i) => (
        <li key={step.title} className="group relative flex items-start gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
          <span
            aria-hidden="true"
            className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand/60 bg-white font-display text-sm font-bold text-brand-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-ink"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 pt-1 lg:mt-5 lg:pt-0">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink lg:justify-center">
              <span className="text-brand-ink">
                <Icon path={step.icon} className="h-5 w-5" />
              </span>
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.line}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function About() {
  return (
    <div className="font-body text-body">
      {/* 1. Hero */}
      {/* overflow-clip, not overflow-hidden: hidden would make this section the sticky
          column's scroll container, so the column would never stick to the viewport */}
      <section className="relative overflow-clip bg-hero-dark text-white">
        {/* Dot grid, faded towards the edges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <SutureTrace className="opacity-[0.12]" />

        {/* Navbar is sticky (in flow) here, so the top padding is just the gap below it */}
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:pt-10">
          {/* Left: label, heading, offerings + CTA (sticky on desktop).
              top = 85px navbar + the same 40px gap it starts with, so it doesn't jump when it sticks */}
          <div className="lg:sticky lg:top-31 lg:self-start">
            <div className="flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-8 shrink-0 bg-brand sm:w-12" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                About Us
              </span>
            </div>
            <h1
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] motion-safe:animate-fade-up [animation-delay:100ms]"
            >
              About Medical
              <span className={`block ${gradientDark}`}>Global Academy</span>
            </h1>

            <div className="mt-6 flex items-center gap-4 text-brand motion-safe:animate-fade-up [animation-delay:200ms]">
              <span className="h-px w-8 shrink-0 bg-brand/50" />
              <span className="text-[11px] font-semibold tracking-[0.2em] sm:text-xs">
                TRUSTED · ACCREDITED · CAREER FOCUSED
              </span>
            </div>
            <span className="mt-4 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand motion-safe:animate-fade-up [animation-delay:250ms]">
              Since {FOUNDED_YEAR}
            </span>

            <OfferingsBlock />
          </div>

          {/* Right: story */}
          {/* TODO: verify the "200 doctors" and "150 programs" figures in this story (same as the stat cards). */}
          <div className="space-y-6 text-left text-base leading-relaxed text-slate-300 md:text-lg">
            <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur motion-safe:animate-fade-up [animation-delay:200ms] md:p-8">
              {/* Brand quote mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-5 left-6 select-none font-display text-7xl leading-none text-brand/50"
              >
                &ldquo;
              </span>
              <p className="text-lg text-white md:text-xl">
                Since {FOUNDED_YEAR}, Medical Global Academy has been helping doctors across India
                grow their careers by providing high-quality, flexible medical courses. We are a
                leading platform for medical education, trusted by more than 200 doctors and
                recognized for our commitment to excellence in healthcare training. Our courses
                are{' '}
                <strong className="font-semibold text-glow">CPD &amp; ACTD accredited</strong>,
                ensuring high standards and credibility.
              </p>
            </div>
            <p className="motion-safe:animate-fade-up [animation-delay:300ms]">
              We offer a diverse range of programs, including{' '}
              <strong className="font-medium text-white">PG Diplomas</strong>,{' '}
              <strong className="font-medium text-white">Fellowships</strong>, and{' '}
              <strong className="font-medium text-white">Certificates</strong>, designed to meet the
              professional development needs of healthcare practitioners. Our extensive course
              catalog spans over 150 programs covering specialties such as Surgery, Neurology,
              Cardiology, Medicine, Oncology, Nephrology, Orthopedics, Obstetrics &amp; Gynecology,
              and many more. Whether you are seeking to enhance your expertise in a specific field or
              broaden your medical knowledge, Medical Global Academy has a course tailored to your goals.
            </p>
            <ul
              aria-label="Specialties"
              className="flex flex-wrap gap-2 motion-safe:animate-fade-up [animation-delay:350ms]"
            >
              {specialties.map((name) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/90 transition-colors duration-300 hover:border-brand/60 hover:text-white sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
            <p className="motion-safe:animate-fade-up [animation-delay:400ms]">
              Understanding the demanding schedules of medical professionals, we provide{' '}
              <strong className="font-medium text-white">flexible learning</strong> options with both
              attending and non-attending classes. This ensures that you can pursue your education
              at your convenience without compromising on quality.
            </p>
            <p className="border-l-2 border-brand/60 pl-5 motion-safe:animate-fade-up [animation-delay:500ms]">
              At Medical Global Academy, we are committed to empowering healthcare professionals
              with the knowledge and skills needed to excel in their careers and contribute to
              improved patient outcomes. Join us to advance your medical journey with courses
              designed to inspire growth, innovation, and excellence in healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Live programme counts from the course API */}
      <StatsCounter footnote={`Serving doctors since ${FOUNDED_YEAR}`} />

      {/* 3. Who we are: visual card on the left (desktop), text on the right */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              Advancing Surgical Education for{' '}
              <span className={gradientLight}>Modern Healthcare</span>
            </h2>
            <AccentRule />
            {/* TODO: confirm the faculty claim ("experienced specialists") with the academic team. */}
            <p className="mt-6 leading-relaxed text-slate-600">
              Founded in {FOUNDED_YEAR}, we have spent every year since then supporting doctors
              with structured, accredited courses that fit around their clinical work, so they can
              learn, upskill and advance without stepping away from patient care.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Medical Global Academy was founded on a commitment to clinical excellence. Our
              surgery programs are shaped around what doctors meet in practice, from general and
              gastrointestinal surgery to laparoscopic, orthopedic and plastic surgery and surgical
              oncology, with teaching from experienced specialists.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We aim to bridge the gap between general medical training and surgical
              specialisation, giving doctors a structured, case-based path to deepen their
              understanding of surgical anatomy, perioperative care and surgical decision-making,
              through fellowships such as General Surgery, Laparoscopic Surgery and Surgical Oncology.
            </p>
          </div>

          <div className="relative lg:order-1">
            {/* Brand glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_40%_40%,color-mix(in_srgb,var(--color-brand)_22%,transparent),transparent_70%)] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-xl border border-brand/25 bg-linear-to-br from-ink from-30% to-deep p-8 text-white shadow-glow md:p-10">
              {/* Soft coral light in the top corner */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_55%)]"
              />
              <SurgicalPattern />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand text-ink">
                  <Icon
                    path="M3 21h18 M5 21V10 M19 21V10 M9 21V10 M15 21V10 M2 10l10-6 10 6"
                    className="h-7 w-7"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">Credibility &amp; Recognition</h3>
                <p className="mt-4 leading-relaxed text-white">
                  Our programs carry CPD and ACTD accreditation, so the qualifications you earn are
                  recognised and support your continuing professional development wherever you practise.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {recognitions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-glow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 8.5l3.5 3.5 6.5-7" />
                      </svg>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Teaching approach: numbered 4-step strip */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="mb-12 text-center md:mb-14">
            <Eyebrow center>Our Teaching Approach</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              How Our <span className={gradientLight}>Programs Work</span>
            </h2>
            <AccentRule center />
          </div>
          <ApproachSteps />
        </div>
      </section>

      {/* Eligibility: who can apply */}
      <EligibilitySection />

      {/* 4. Specializations: centred header + card grid */}
      <section className="relative overflow-hidden bg-page py-20 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow center>Programs</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              High-Demand <span className={gradientLight}>Surgical Specializations</span>
            </h2>
            <AccentRule center />
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
            {specializations.map((s, i) => (
              <li
                key={s.title}
                className="group relative overflow-hidden rounded-xl border border-slate-200 border-t-[3px] border-t-brand bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-3 select-none font-display text-6xl font-bold leading-none text-slate-100 transition-colors duration-300 group-hover:text-brand/15"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand-ink ring-1 ring-brand/25 transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                  <Icon path={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{s.line}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
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
        </div>
      </section>

      {/* 5. Flexible learning */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Designed for <span className={gradientLight}>Working Medical Professionals</span>
          </h2>
          <AccentRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-600 md:text-lg">
            We know doctors don&apos;t have time to step away from practice. Our programs combine
            live sessions, recorded lectures and mentorship so you can build surgical expertise
            on a schedule that works around your shifts.
          </p>

          {/* Connected row: a thin brand line runs through the icons (vertical on mobile) */}
          <ul className="relative mx-auto mt-14 flex max-w-xs flex-col gap-8 text-left sm:max-w-none sm:flex-row sm:justify-between sm:gap-4 sm:text-center">
            <li
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-6 w-px bg-linear-to-b from-brand to-accent sm:top-6 sm:right-[16.66%] sm:bottom-auto sm:left-[16.66%] sm:h-px sm:w-auto sm:bg-linear-to-r"
            />
            {learningModes.map((m) => (
              <li key={m.label} className="group relative flex items-center gap-4 sm:flex-1 sm:flex-col sm:gap-4">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand/50 bg-white text-brand-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-ink group-hover:shadow-glow">
                  <Icon path={m.icon} className="h-6 w-6" />
                </span>
                <span className="font-display font-semibold text-ink">{m.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Mission banner */}
      <section className="relative overflow-hidden bg-hero-dark py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,color-mix(in_srgb,var(--color-brand)_20%,transparent),transparent_70%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <SutureTrace className="opacity-[0.15]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Eyebrow light center>Our Mission</Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            Empowering <span className={gradientDark}>Surgical Excellence</span>
          </h2>
          <AccentRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-300 md:text-lg">
            Since {FOUNDED_YEAR}, our mission has been to equip healthcare professionals with the surgical knowledge,
            clinical judgement and confidence they need to deliver better care for every patient
            they treat.
          </p>
          <Link
            to="/courses"
            className="group mt-10 inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-brand px-9 py-3.5 font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Enroll Today
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12 M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
