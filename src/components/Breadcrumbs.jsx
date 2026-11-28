import { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import {
  COURSE_TYPE_LABELS,
  DEFAULT_WIDTH,
  HOME_LABEL,
  NOT_FOUND_LABEL,
  SITE_URL,
  breadcrumbRoutes,
} from '../config/breadcrumbs.js'
import { loadAllCourses } from '../data/surgeryCourseApi.js'
import { loadFaculty } from '../data/facultyApi.js'
import { typeFromSlug } from '../data/siteLinks.js'

// "fellowship-in-laparoscopic-surgery" -> "Fellowship In Laparoscopic Surgery"
const titleCase = (slug) =>
  decodeURIComponent(slug || '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())

// Real names for dynamic crumbs. Each list is fetched once and shared with the pages
// (loadAllCourses / loadFaculty cache their request); the lookup maps are built once here.
let courseNames = null
let doctorNames = null

const resolvers = {
  course: {
    fallback: titleCase,
    peek: (slug) => courseNames?.get(slug),
    load: () =>
      loadAllCourses().then((list) => {
        courseNames ??= new Map(list.map((c) => [c.slug, String(c.name ?? '').trim()]))
        return courseNames
      }),
  },
  doctor: {
    fallback: () => 'Doctor Profile',
    peek: (id) => doctorNames?.get(id),
    load: () =>
      loadFaculty().then((doctors) => {
        doctorNames ??= new Map(doctors.map((d) => [d.id, d.name]))
        return doctorNames
      }),
  },
}

function useDynamicLabel(kind, param) {
  const key = kind ? `${kind}:${param}` : ''
  const [loaded, setLoaded] = useState({ key: '', label: '' })

  useEffect(() => {
    if (!kind) return
    const resolver = resolvers[kind]
    if (resolver.peek(param)) return
    let active = true
    resolver
      .load()
      .then((names) => {
        const name = names.get(param)
        if (active && name) setLoaded({ key, label: name })
      })
      .catch(() => {}) // keep the fallback label; the page itself reports the error
    return () => {
      active = false
    }
  }, [kind, param, key])

  if (!kind) return ''
  const resolver = resolvers[kind]
  return resolver.peek(param) || (loaded.key === key && loaded.label) || resolver.fallback(param)
}

const findRoute = (pathname) => {
  for (const route of breadcrumbRoutes) {
    const match = matchPath({ path: route.path, end: true }, pathname)
    if (match) return { route, params: match.params }
  }
  return null
}

const byPath = (path) => breadcrumbRoutes.find((r) => r.path === path)

// Builds [{ label, to }] from Home to the current page
function useTrail(currentLabel) {
  const { pathname } = useLocation()
  const found = findRoute(pathname)
  const route = found?.route
  const param = found ? Object.values(found.params)[0] : undefined
  // /courses/<type slug> (fellowship, pg-diploma, certificate) is a filter tab on the Courses
  // list, not a real course page — label it from COURSE_TYPE_LABELS instead of looking up a
  // course name. Those three slugs are reserved (see siteLinks.js), so no real course page
  // uses them.
  const courseType = route?.dynamic === 'course' ? typeFromSlug(param) : undefined
  const dynamicLabel = useDynamicLabel(courseType ? undefined : route?.dynamic, param)

  if (route?.hidden) return { route, trail: null }

  const home = { label: HOME_LABEL, to: '/' }
  if (!route) {
    return { route: null, trail: [home, { label: currentLabel || NOT_FOUND_LABEL, to: pathname }] }
  }

  // Walk up the parents (skipping Home, which is always first)
  const chain = []
  for (let r = route; r && r.path !== '/'; r = byPath(r.parent)) chain.unshift(r)
  const trail = [
    home,
    ...chain.map((r) => ({
      label: r === route && r.dynamic ? (courseType ? COURSE_TYPE_LABELS[courseType] : dynamicLabel) : r.label,
      to: r === route ? pathname : r.path,
    })),
  ]

  if (currentLabel) trail[trail.length - 1].label = currentLabel
  return { route, trail }
}

// schema.org BreadcrumbList, added to <head> while the page is shown
function useBreadcrumbJsonLd(trail, enabled) {
  const json = enabled && trail
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.label,
          item: new URL(crumb.to, SITE_URL).href,
        })),
      })
    : ''

  useEffect(() => {
    if (!json) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.breadcrumbs = ''
    script.textContent = json
    document.head.appendChild(script)
    return () => script.remove()
  }, [json])
}

const themes = {
  dark: {
    bar: 'border-white/10 bg-ink',
    link: 'text-slate-300 hover:text-glow focus-visible:ring-offset-ink',
    sep: 'text-slate-500',
    current: 'text-white',
  },
  light: {
    bar: 'border-slate-200 bg-page',
    link: 'text-slate-600 hover:text-brand-ink focus-visible:ring-offset-page',
    sep: 'text-slate-400',
    current: 'text-ink',
  },
}

const linkBase =
  'inline-flex items-center gap-1.5 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none'

// Mounted once in App.jsx, between the Navbar and the page. Hidden on Home.
// `currentLabel` overrides the last crumb's text.
function Breadcrumbs({ currentLabel }) {
  const { route, trail } = useTrail(currentLabel)
  // The 404 page is noindex, so it gets no structured data
  useBreadcrumbJsonLd(trail, Boolean(route))

  if (!trail) return null
  const theme = themes[route?.theme ?? 'dark']
  const width = route?.width ?? DEFAULT_WIDTH

  return (
    <div className={`border-b font-body ${theme.bar}`}>
      <nav aria-label="Breadcrumb" className={`mx-auto ${width} px-4 py-3 sm:px-6`}>
        {/* One line: earlier crumbs keep their width, the current page truncates with an ellipsis */}
        <ol className="flex min-w-0 items-center gap-1.5 text-sm leading-5 whitespace-nowrap">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1
            return (
              <li key={`${i}-${crumb.to}`} className={`flex items-center gap-1.5 ${last ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && <ChevronRight size={14} aria-hidden="true" className={`shrink-0 ${theme.sep}`} />}
                {last ? (
                  <span aria-current="page" title={crumb.label} className={`truncate font-medium ${theme.current}`}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.to} className={`${linkBase} ${theme.link}`}>
                    {i === 0 && <Home size={14} aria-hidden="true" className="shrink-0" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default Breadcrumbs
