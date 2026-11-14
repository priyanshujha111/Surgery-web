import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'
import { EMAIL, MAIN_SITE_URL } from '../data/siteLinks.js'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: (
      <p>
        Welcome to Medical Global Academy. These terms and conditions outline the rules and regulations for the
        use of our website and services. By accessing this website, we assume you accept these terms and
        conditions. Do not continue to use Medical Global Academy if you do not agree to all the terms and
        conditions stated on this page.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    content: (
      <p>
        Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical
        field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.)
        from a recognized institution.
      </p>
    ),
  },
  {
    id: 'services',
    title: 'Services Offered',
    content: (
      <p>
        Medical Global Academy offers professional training programs aimed at enhancing the skills and knowledge
        of medical professionals. Our training programs are developed by experts in the field, but they do not
        substitute for any medical board certification or licensing requirements.
      </p>
    ),
  },
  {
    id: 'responsibilities',
    title: 'User Responsibilities',
    content: (
      <>
        <p>By using our website and enrolling in our courses, you agree to:</p>
        <ul>
          <li>Provide accurate information during registration.</li>
          <li>Use the website and training materials solely for your personal, professional development.</li>
          <li>Comply with all applicable laws and regulations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment and Fees',
    content: (
      <p>
        All courses offered by Medical Global Academy are subject to fees, which are listed on the website.
        Payments must be made in full at the time of registration. No refunds will be issued once access to the
        course materials has been granted.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <>
        <p>
          All content on the Medical Global Academy website, including course materials, videos, and resources,
          is the property of Medical Global Academy.
        </p>
        <p>
          Users may not reproduce, distribute, or use the content for any purpose other than personal education
          without prior written consent.
        </p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: (
      <p>
        Your privacy is important to us. We collect and use personal information according to our{' '}
        <Link to="/privacy">Privacy Policy</Link>, which is available on our website.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <p>
        Medical Global Academy is not responsible for any errors or omissions in the content provided or any
        adverse outcomes that arise from applying the skills learned in our courses. Use of the information
        provided is at your own risk.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Termination of Access',
    content: (
      <p>
        Medical Global Academy reserves the right to terminate your access to the website and its services if you
        breach any of these terms.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to the Terms',
    content: (
      <p>
        Medical Global Academy may update these terms and conditions from time to time. Any changes will be
        posted on this page, and continued use of the website implies acceptance of the updated terms.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <p>
        These terms and conditions are governed by and construed in accordance with the laws of India. Any
        disputes related to these terms will be subject to the exclusive jurisdiction of the courts in India.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>If you have any questions or need further clarification on these terms, please contact us at:</p>
        <address className="not-italic">
          <strong className="font-semibold text-ink">Medical Global Academy</strong>
          <br />
          Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <br />
          Website:{' '}
          <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer">
            medicalglobalacademy.com
          </a>
        </address>
      </>
    ),
  },
]

function Terms() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="September 25, 2026"
      intro="Please read these Terms & Conditions carefully before using the Medical Global Academy website or enrolling in any of our courses. By accessing our website, you accept these terms in full."
      sections={sections}
    />
  )
}

export default Terms
