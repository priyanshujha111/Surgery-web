import { Routes, Route, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Breadcrumbs from './components/Breadcrumbs'
import SurgeryHome from './pages/SurgeryHome'
import About from './pages/About'
import Contact from './pages/Contact'
import Course from './pages/Course'
import CourseDetail from './pages/CourseDetail'
import Doctor from './pages/Doctor'
import DoctorProfile from './pages/DoctorProfile'
import Terms from './pages/Terms'
import Sitemap from './pages/2026-10-31-sitemap'
import PrivacyPolicy from './pages/2026-10-31-privacy-policy'
import RefundPolicy from './pages/2026-10-31-refund-policy'
import NotFound from './pages/NotFound'
import { typeFromSlug } from './data/siteLinks.js'

// Everything under /courses. /courses and the course-type filters (/courses/fellowship,
// /courses/pg-diploma, /courses/certificate) all render the Courses list from Course; any
// other /courses/:slug is a course detail page. Those three slugs are reserved (siteLinks.js).
function CoursesRoutes() {
  const rest = useParams()['*'] || ''
  if (!rest || typeFromSlug(rest)) return <Course />
  return (
    <Routes>
      <Route path=":slug" element={<CourseDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />
      {/* One breadcrumb for every page (hidden on Home); routes live in config/breadcrumbs.js */}
      <Breadcrumbs />
      {/* flex-1 pushes the footer to the bottom on short pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<SurgeryHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/courses/*" element={<CoursesRoutes />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
