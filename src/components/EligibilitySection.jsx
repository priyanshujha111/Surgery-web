// "Who Can Apply" band on the About page. Dark band with glass cards, same look as StatsCounter.
import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { ELIGIBILITY_GROUPS, ELIGIBILITY_NOTE } from '../constants/eligibility.js'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function EligibilitySection() {
  const sectionRef = useRef(null)
  const [instant] = useState(prefersReducedMotion)
  const [visible, setVisible] = useState(instant)

  // Reveal once, when 20% of the section is on screen
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
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  const reveal = visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
  const delay = (i) => ({ transitionDelay: visible && !instant ? `${i * 100}ms` : '0ms' })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="eligibility-heading"
      className="relative border-t border-white/10 bg-ink py-20 text-white md:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
      <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-brand">
            ELIGIBILITY
          </span>
          <h2
            id="eligibility-heading"
            className="mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl"
          >
            Who Can{' '}
            <em className="bg-linear-to-r from-brand to-glow bg-clip-text pr-1 text-transparent italic">
              Apply
            </em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
            Our programs are designed for qualified medical, AYUSH and dental professionals.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {ELIGIBILITY_GROUPS.map(({ title, label, icon: Icon, qualifications }, i) => (
            <li
              key={title}
              style={delay(i)}
              className={`group rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition duration-500 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-glow hover:delay-0! motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7 ${reveal}`}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {label}
              </p>
              <ul aria-label={`Qualifications: ${title}`} className="mt-5 flex flex-wrap gap-2">
                {qualifications.map((q) => (
                  <li
                    key={q}
                    className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm font-medium text-white"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p
          style={delay(ELIGIBILITY_GROUPS.length)}
          className={`mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center text-sm leading-relaxed text-slate-300 transition duration-500 ease-out motion-reduce:transition-none ${reveal}`}
        >
          <Info size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
          <span>{ELIGIBILITY_NOTE}</span>
        </p>
      </div>
    </section>
  )
}

export default EligibilitySection
