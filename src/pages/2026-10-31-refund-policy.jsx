import LegalLayout from '../components/LegalLayout.jsx'
import { EMAIL } from '../data/siteLinks.js'

const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <p>
        At Medical Global Academy, we strive to provide high-quality training and educational content for MBBS,
        MD, and other degree holders in the medical field. However, we understand that there may be circumstances
        where you may request a refund. Please read our refund policy carefully before enrolling in any course.
      </p>
    ),
  },
  {
    id: 'no-refunds',
    title: 'No Refunds',
    content: (
      <p>
        Due to the nature of digital educational content, once access to the course materials has been granted,
        no refunds will be issued. By completing the registration and payment process, you agree that all sales
        are final.
      </p>
    ),
  },
  {
    id: 'course-cancellation',
    title: 'Course Cancellation',
    content: (
      <p>
        In the event that Medical Global Academy cancels a course due to unforeseen circumstances or technical
        issues, we will provide a full refund to all registered participants. The refund will be processed within
        10 business days from the date of cancellation.
      </p>
    ),
  },
  {
    id: 'duplicate-payment',
    title: 'Duplicate Payment',
    content: (
      <>
        <p>
          If you mistakenly make multiple payments for the same course, please notify us immediately at {mail}. We
          will process a refund for the duplicate payment after verifying the details, typically within 7 business
          days.
        </p>
        <p>Email: {mail}</p>
      </>
    ),
  },
  {
    id: 'technical-issues',
    title: 'Technical Issues',
    content: (
      <p>
        If you experience any technical issues that prevent you from accessing course content, please contact our
        support team. While we do not offer refunds for technical problems, we will make every effort to resolve
        the issue and ensure you have access to the course material.
      </p>
    ),
  },
  {
    id: 'exceptions',
    title: 'Exceptions',
    content: (
      <>
        <p>Refunds will only be considered under exceptional circumstances, such as:</p>
        <ul>
          <li>Incorrect payment made due to system error.</li>
          <li>Special cases with documented medical emergencies.</li>
        </ul>
        <p>
          All exceptions will be considered on a case-by-case basis, and the decision of Medical Global Academy
          will be final.
        </p>
      </>
    ),
  },
  {
    id: 'refund-processing',
    title: 'Refund Processing',
    content: (
      <p>
        Approved refunds will be processed back to the original payment method. Depending on the payment provider,
        it may take up to 7–10 business days for the refund to reflect in your account.
      </p>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: (
      <>
        <p>For any inquiries related to refunds or payments, please contact us at:</p>
        <p>
          Medical Global Academy — Support
          <br />
          Email: {mail}
          <br />
          Phone: +91 9289994218
        </p>
      </>
    ),
  },
]

function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="October 31, 2026"
      intro="Please read our refund policy carefully before enrolling in any course. By enrolling in any of our courses, you acknowledge that you have read, understood, and agreed to this refund policy."
      sections={sections}
    />
  )
}

export default RefundPolicy
