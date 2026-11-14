// FAQs for a surgery course that has no file of its own in ./courses/.
// The general list without "Which surgery courses can I join?", which does not belong on a
// course page.
import surgeryGeneralFaqs, { whichCoursesFaq } from './general.js'

const fallbackFaqs = surgeryGeneralFaqs.filter((faq) => faq !== whichCoursesFaq)

export default fallbackFaqs
