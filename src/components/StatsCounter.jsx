import { useEffect, useRef, useState } from 'react'
import { Award, BookOpen, GraduationCap, ScrollText } from 'lucide-react'
import { useCourseStats } from '../hooks/useCourseStats.js'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Counts from 0 to `end` (easeOutCubic, requestAnimationFrame) once `start` is true.
// With `instant` (or reduced motion) it shows the final number straight away.
// Shared with the Home page stats bar.
export function CountUp({ end, suffix = '', start, instant = false, duration = 2000 }) {
  const skip = instant || prefersReducedMotion()
  const [count, setCount] = useState(skip ? end : 0)

  useEffect(() => {
    if (!start || skip) return
    let startTime = null
    let frame

    const tick = (time) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, end, skip, duration])

  return (
    <>
      {(skip ? end : count).toLocaleString('en-US')}
      {suffix}
    </>
  )
}

const cards = [
  { key: 'total', label: 'Active Programs', Icon: BookOpen },
  { key: 'fellowships', label: 'Fellowships', Icon: GraduationCap },
  { key: 'certificates', label: 'Certificates', Icon: Award },
  { key: 'pgDiplomas', label: 'PG Diplomas', Icon: ScrollText },
]

// The count-up runs once per visit; coming back to the page shows the final numbers
let hasAnimated = false

const cardClass =
  'rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur md:p-6'

function SkeletonCard() {
  return (
    <div aria-hidden="true" className={`${cardClass} animate-pulse motion-reduce:animate-none`}>
      <div className="h-10 w-10 rounded-lg bg-white/10" />
      <div className="mt-6 h-10 w-24 rounded-md bg-white/10 md:h-12" />
      <div className="mt-3 h-3 w-28 rounded bg-white/10" />
    </div>
  )
}

// `footnote`: optional small accent line shown under the stat cards
function StatsCounter({ footnote }) {
  const { stats, loading } = useCourseStats()
  const sectionRef = useRef(null)
  const [instant] = useState(() => hasAnimated || prefersReducedMotion())
  const [visible, setVisible] = useState(instant)

  // Start when 30% of the section is on screen
  useEffect(() => {
    if (visible) return
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  const running = visible && !loading
  useEffect(() => {
    if (running) hasAnimated = true
  }, [running])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="relative border-t border-white/10 bg-ink py-16 text-white md:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
      <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-brand">
            BY THE NUMBERS
          </span>
          <h2
            id="stats-heading"
            className="mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl"
          >
            MGA All{' '}
            <em className="bg-linear-to-r from-brand to-glow bg-clip-text pr-1 text-transparent italic">
              Programs
            </em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
            Live figures from our course catalogue, across every specialty we teach.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:gap-5 lg:grid-cols-4" aria-busy={loading}>
          {loading
            ? cards.map((c) => <SkeletonCard key={c.key} />)
            : cards.map(({ key, label, Icon }, i) => (
                <div
                  key={key}
                  style={{ transitionDelay: running && !instant ? `${i * 100}ms` : '0ms' }}
                  className={`${cardClass} group transition duration-500 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-glow hover:delay-0! motion-reduce:transition-none ${
                    running ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-display text-4xl font-bold leading-none tracking-tight text-white tabular-nums md:text-5xl">
                    <CountUp end={stats[key]} suffix="+" start={running} instant={instant} />
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {label}
                  </p>
                </div>
              ))}
        </div>

        {footnote && (
          <p className="mt-8 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand/50" />
            {footnote}
            <span aria-hidden="true" className="h-px w-8 bg-brand/50" />
          </p>
        )}
      </div>
    </section>
  )
}

export default StatsCounter
