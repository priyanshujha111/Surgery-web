// General surgery FAQs, shown on the Home and Courses pages and used as the base for the
// course fallback list. Each item is { question, answer }; questions must stay unique because
// FaqSection uses them as React keys.
// TODO: have the academic team review every answer below before launch.

export const eligibilityAnswer =
  'Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.) from a recognized institution.'

// Exported on its own so fallback.js can leave it out: on a course page it would send the
// visitor away from the course they are reading about. Course names are not listed here
// because they come from the live API and change.
export const whichCoursesFaq = {
  question: 'Which surgery courses can I join?',
  answer:
    'All of our current surgery programs are listed on the Courses page, with the details and fees for each one. The list is updated as programs open, so please check there for the latest options.',
}

const surgeryGeneralFaqs = [
  {
    question: 'What is the eligibility criteria for the surgery programs?',
    answer: eligibilityAnswer,
  },
  {
    question: 'How are the surgery programs delivered?',
    // TODO: confirm with the academic team what each surgery course really includes. Do not
    // mention live operating, hands-on or clinical training unless a course offers it.
    answer:
      'Our programs combine case discussions, procedure walkthroughs and learning material, so the focus is on surgical decision making, not just theory. Each course page explains how that program is delivered.',
  },
  {
    question: 'How do I enrol in a surgery program?',
    answer:
      'Click the "Talk to Counsellor" button or call us on +91 9310027474. Our counsellors will check your eligibility, explain the program options and help you complete your enrolment.',
  },
  {
    question: 'Is the certification recognised?',
    // TODO: confirm CPD accreditation and ACTD alignment for the surgery programs. The course
    // API currently returns "actd": 0 for every surgery course.
    answer:
      'Yes. Our programs are CPD accredited and aligned with the American Council of Training & Development (ACTD). You receive a certificate when you complete your program.',
  },
  whichCoursesFaq,
  {
    question: 'Can I study online while I keep working?',
    // TODO: confirm that the surgery programs are online and flexible enough to fit around
    // clinical work.
    answer:
      'Yes. Learning is online and flexible, so you can fit it around your clinical work. Each course page explains how that program is delivered, and our counsellors can confirm the details.',
  },
]

export default surgeryGeneralFaqs
