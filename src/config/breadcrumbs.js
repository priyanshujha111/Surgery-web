// Breadcrumb trail for every route in App.jsx. Keep this in sync when a route is added.
//
// path    route pattern, exactly as in App.jsx (matched with react-router's matchPath)
// label   text for this crumb; dynamic routes use `dynamic` instead and get the real name at runtime
// parent  path of the previous crumb ("/" = Home, which is always first)
// width   container max-width class, matching that page's own content container
// theme   'dark' (default, sits above the dark hero) or 'light' (page starts on a light background)
// hidden  no breadcrumb on this route

// Absolute base for the BreadcrumbList JSON-LD
export const SITE_URL = 'https://medicalglobalacademy.com'

export const HOME_LABEL = 'Home'
export const NOT_FOUND_LABEL = 'Page Not Found'
export const DEFAULT_WIDTH = 'max-w-[1160px]'

export const breadcrumbRoutes = [
  { path: '/', label: HOME_LABEL, hidden: true },
  { path: '/about', label: 'About', parent: '/', width: 'max-w-[1140px]' },
  { path: '/courses', label: 'Courses', parent: '/', width: 'max-w-6xl' },
  { path: '/courses/:slug', dynamic: 'course', parent: '/courses', width: 'max-w-6xl' },
  { path: '/doctor', label: 'Doctors', parent: '/', theme: 'light' },
  { path: '/doctor/:id', dynamic: 'doctor', parent: '/doctor' },
  { path: '/contact', label: 'Contact', parent: '/', width: 'max-w-[1140px]' },
  { path: '/terms', label: 'Terms & Conditions', parent: '/' },
  { path: '/privacy', label: 'Privacy Policy', parent: '/' },
  { path: '/refund', label: 'Refund Policy', parent: '/' },
  { path: '/sitemap', label: 'Sitemap', parent: '/' },
]

// /courses?type=… adds one more crumb (Home > Courses > Fellowship). Keys are the API types.
export const COURSE_TYPE_LABELS = {
  Fellowship: 'Fellowship',
  Certificate: 'Certificate',
  'Pg Diploma': 'PG Diploma',
}
