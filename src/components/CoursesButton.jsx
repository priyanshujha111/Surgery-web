import { ArrowUpRight } from 'lucide-react'

// Main MGA site listing every course (all specialties)
export const COURSES_URL = 'https://medicalglobalacademy.com/courses'

// "MGA All Courses" outbound button, styled for dark (ink) backgrounds
function CoursesButton({ className = '' }) {
  return (
    <a
      href={COURSES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group box-border inline-flex min-h-11 w-fit max-w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-brand/60 bg-brand/10 px-4 py-2 text-sm leading-5 lg:min-h-0 font-semibold whitespace-nowrap text-white transition duration-200 hover:border-brand hover:bg-brand/20 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none ${className}`}
    >
      MGA All Courses
      <ArrowUpRight
        size={16}
        strokeWidth={2.5}
        aria-hidden="true"
        className="shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-0"
      />
    </a>
  )
}

export default CoursesButton
