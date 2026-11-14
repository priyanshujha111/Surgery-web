import LegalLayout from '../components/LegalLayout.jsx'
import { EMAIL } from '../data/siteLinks.js'

const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

// Small heading inside a section (e.g. "Information You Provide")
const subheading = 'font-display text-base font-semibold text-ink'

const sections = [
  {
    id: 'who-we-are',
    title: 'Who We Are',
    content: (
      <>
        <p>
          Medical Global Academy ("MGA", "we", "us", "our") operates medicalglobalacademy.com and associated
          learning platforms.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store and share information when you use our
          services.
        </p>
        <p>For questions about this policy, contact us at {mail}.</p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <h3 className={subheading}>Information You Provide</h3>
        <ul>
          <li>Name, email address and phone number.</li>
          <li>
            Professional details such as medical registration number, qualification and speciality when
            required.
          </li>
          <li>Payment information processed securely by our payment partners.</li>
          <li>Support messages, feedback and other communications.</li>
        </ul>
        <h3 className={subheading}>Information Collected Automatically</h3>
        <ul>
          <li>IP address, browser and device information.</li>
          <li>Pages visited and general website usage.</li>
          <li>Cookies and similar technologies.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: (
      <ul>
        <li>To process enrolments and provide our programmes.</li>
        <li>To manage accounts, assessments and certifications.</li>
        <li>To send programme updates and relevant educational content.</li>
        <li>To improve our website and learning platform.</li>
        <li>To meet legal and regulatory requirements.</li>
      </ul>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing Your Information',
    content: (
      <>
        <p>
          We do not sell your personal data to third parties. Information may be shared when necessary with:
        </p>
        <ul>
          <li>
            <strong className="font-semibold text-ink">Service providers:</strong> Payment processors, email
            services and hosting providers.
          </li>
          <li>
            <strong className="font-semibold text-ink">Faculty or partners:</strong> Where required for programme
            coordination.
          </li>
          <li>
            <strong className="font-semibold text-ink">Legal authorities:</strong> When disclosure is required by
            law or legal process.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <>
        <p>
          We retain personal information for as long as necessary to provide our services and meet legal
          obligations.
        </p>
        <p>
          Programme records and certifications may be retained for the period required by applicable
          obligations. You may request deletion of your account data, subject to legal requirements.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <>
        <p>
          We use cookies to maintain sessions, remember preferences and understand how visitors use our
          website.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling certain cookies may affect website
          functionality.
        </p>
        {/* TODO: no Google Analytics code was found in this project (31 Oct 2026). Confirm on the live
            site before keeping or removing this line. */}
        <p>We may use analytics services such as Google Analytics to understand general website usage.</p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>You may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your information, where applicable.</li>
          <li>Opt out of marketing communications.</li>
          <li>Raise a complaint with the relevant authority.</li>
        </ul>
        <p>To exercise your rights, contact us at {mail}.</p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. Material changes may be communicated through
          email or a notice on our website.
        </p>
        <p>The date shown at the top of this page indicates when the policy was most recently updated.</p>
      </>
    ),
  },
  {
    id: 'mobile-application',
    title: 'Mobile Application',
    content: (
      <p>
        This Privacy Policy also applies to the MGA Academy mobile application and its employee attendance
        features. The information we collect depends on the features you use.
      </p>
    ),
  },
  {
    id: 'attendance-location',
    title: 'Employee Attendance and Location',
    content: (
      <>
        <p>
          The MGA Academy app uses foreground location access to verify an employee's proximity to their
          assigned workplace for check-in and check-out.
        </p>
        <p>
          Location is accessed only while the employee uses the check-in or check-out feature. Location
          coordinates are used to calculate the distance to the assigned workplace and are not stored beyond
          what is required for attendance records.
        </p>
        <p>
          Attendance records include employee identification, check-in and check-out times, attendance status
          and, where retained, location information. These records are accessible only to authorized personnel
          and service providers who require access for attendance administration.
        </p>
        <p>
          You can disable location permission through your device settings. Doing so may prevent
          location-based check-in and check-out. Unrelated app features do not require attendance location
          access.
        </p>
      </>
    ),
  },
  {
    id: 'app-permissions',
    title: 'Mobile App Permissions',
    content: (
      <>
        <p>Depending on the features you use, the app may request:</p>
        <ul>
          <li>
            <strong className="font-semibold text-ink">Location:</strong> To verify workplace proximity for
            employee check-in and check-out.
          </li>
          <li>
            <strong className="font-semibold text-ink">Camera and Photos:</strong> To capture or select images
            for supported profile, work-update or document-submission features.
          </li>
          <li>
            <strong className="font-semibold text-ink">Notifications:</strong> To deliver relevant reminders,
            account notifications and service updates.
          </li>
        </ul>
        <p>
          You can manage permissions through your device settings. Disabling a permission may limit the related
          feature.
        </p>
      </>
    ),
  },
  {
    id: 'service-providers',
    title: 'Mobile Service Providers',
    content: (
      <>
        <p>
          We use third-party service providers for authentication, hosting, storage and notifications. These
          providers process the information necessary to deliver their services and are required to provide
          appropriate protection for personal information.
        </p>
        <p>
          Where analytics or advertising services receive personal information, we disclose the information
          shared, its purpose and applicable consent choices.
        </p>
      </>
    ),
  },
  {
    id: 'retention-deletion',
    title: 'Retention and Account Deletion',
    content: (
      <>
        <p>
          We retain attendance records and stored location information for the period required to administer
          attendance and meet legal obligations.
        </p>
        <p>
          You can initiate account deletion within the app through the account settings menu. For assistance,
          contact {mail}.
        </p>
        <p>
          Requests are processed within a reasonable timeframe. Associated personal information is deleted
          unless retention is required by law. Any retained records are limited to the applicable legal purpose
          and retention period.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security and Data Processing',
    content: (
      <>
        <p>
          We use appropriate technical and organizational security measures to protect personal information
          against unauthorized access, disclosure, alteration and loss.
        </p>
        <p>
          Personal information may be stored or processed in the countries or regions where our service
          providers operate. Where international transfers occur, we apply safeguards required by applicable
          law.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments on Different Platforms',
    content: (
      <p>
        Programme payments may be available through our website and processed by our payment partners. Course
        purchases and payment checkout are not available within the MGA Academy iOS app.
      </p>
    ),
  },
]

function PrivacyPolicy() {
  return <LegalLayout title="Privacy Policy" updated="October 31, 2026" sections={sections} />
}

export default PrivacyPolicy
