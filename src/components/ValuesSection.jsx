// "Our Values" band on the About page.
// TODO: these four values and their wording are a generic starting point.
// Replace them with the academy's own approved values text.

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const values = [
  {
    title: 'Excellence',
    description: 'High academic standards in every program, from the curriculum to how it is taught.',
    icon: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z',
  },
  {
    title: 'Integrity',
    description: 'Clear, honest information about courses, eligibility and what to expect.',
    icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4',
  },
  {
    title: 'Innovation',
    description: 'Modern, flexible ways of learning that fit around clinical work.',
    icon: 'M9 18h6 M10 21h4 M12 3a6 6 0 00-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0012 3z',
  },
  {
    title: 'Accessibility',
    description: 'Online access so doctors can keep learning wherever they practise.',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
  },
]

function ValuesSection() {
  return (
    <section className="relative overflow-hidden bg-hero-dark py-20 text-white md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
      <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            Our Values
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-5xl">
            What We{' '}
            <span className="bg-linear-to-r from-brand to-glow bg-clip-text text-transparent">
              Stand For
            </span>
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {values.map((v, i) => (
            <li
              key={v.title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:bg-white/[0.07] hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-4 font-display text-sm font-semibold text-white/25"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15 text-brand ring-1 ring-brand/40 transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={v.icon} />
                </svg>
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-300">{v.description}</p>
              {/* Bottom accent line grows on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-brand to-accent-soft transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ValuesSection
