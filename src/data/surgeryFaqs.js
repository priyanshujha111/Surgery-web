// Surgery FAQs. Each item is { question, answer }.
//   surgeryFaqs                general FAQs (Home and Courses pages, FaqSection default)
//   surgeryCourseFallbackFaqs  for a course without its own file
//   surgeryCourseFaqs          { [slug]: items }, one file per course in faqs/surgery/courses/
// To add FAQs for a course, create faqs/surgery/courses/<exact API slug>.js with a default
// export array. It is picked up automatically, nothing else needs to change.
import surgeryGeneralFaqs from './faqs/surgery/general.js'
import fallbackFaqs from './faqs/surgery/fallback.js'

export { eligibilityAnswer } from './faqs/surgery/general.js'

export const surgeryFaqs = surgeryGeneralFaqs

export const surgeryCourseFallbackFaqs = fallbackFaqs

// The folder is empty for now, so this is {} and every course uses the fallback list
const courseModules = import.meta.glob('./faqs/surgery/courses/*.js', { eager: true })

// './faqs/surgery/courses/fellowship-in-general-surgery.js' -> 'fellowship-in-general-surgery'
export const surgeryCourseFaqs = Object.fromEntries(
  Object.entries(courseModules).map(([path, mod]) => [path.split('/').pop().replace(/\.js$/, ''), mod.default]),
)
