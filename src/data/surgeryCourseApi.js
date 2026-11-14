import { useEffect, useState } from 'react'

export const API_URL = 'https://24x7.medicalglobalacademy.com/api/course-list'
// Per-course details (highlights, what you'll learn, workshops, modules): DETAILS_URL + slug
export const DETAILS_URL = 'https://24x7.medicalglobalacademy.com/api/course-details/'
// Checked: e.g. .../storage/uploads/course/1791019302_1.jpg returns the course image (200, image/jpeg).
export const IMAGE_BASE = 'https://24x7.medicalglobalacademy.com/storage/uploads/course/'

// Matched against the course NAME and SLUG only. The API's category is unreliable (e.g.
// "Fellowship in Laparoscopic Surgery" has no category and "Fellowship in Spine Surgery" is
// tagged Orthopedic) and many descriptions mention surgery in passing, so neither is used.
// Checked 29 Oct 2026: 54 of the 322 courses match.
const SURGERY_RE = /surg|laparoscop|arthroscop|endoscop|operative/i

// Force a course in, whatever the keywords say (slugs).
const INCLUDE_SLUGS = []

// Force a course out (slugs). Everything that matches is shown by default; uncomment a slug
// to hide that course from the surgery site.
// TODO: decide which of these belong on the surgery site and uncomment them to hide them.
const EXCLUDE_SLUGS = [
  // Also shown on the cardiology site:
  // 'fellowship-in-cardiac-surgery',
  // 'fellowship-in-cardiothoracic-surgery',
  // 'fellowship-in-pediatric-cardiac-surgery',
  // 'fellowship-in-minimally-invasive-cardiac-surgery',
  // Also shown on the neurology site:
  // 'fellowship-in-neurosurgery',
  // 'fellowship-in-pediatric-neurosurgery',
  // 'fellowship-in-neuroendoscopy',
  // Spine overlap (not caught by the neurology site's filter):
  // 'fellowship-in-spine-surgery',
  // 'fellowship-in-endoscopic-spine-surgery',
  // Other specialities that match the keywords (dental, eye, gynaecology, GI endoscopy):
  // 'fellowship-in-aesthetic-dentistry-surgery',
  // 'fellowship-in-oral-surgery',
  // 'pg-diploma-in-oral-surgery',
  // 'fellowship-in-refractive-surgeries',
  // 'fellowship-in-gynae-endoscopy',
  // 'fellowship-in-gastrointestinal-endoscopy',
  // 'fellowship-in-gi-endoscopy',
]

function isSurgery(course) {
  const slug = course.slug || ''
  if (EXCLUDE_SLUGS.includes(slug)) return false
  if (INCLUDE_SLUGS.includes(slug)) return true
  return SURGERY_RE.test(`${course.name || ''} ${slug}`)
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// "₹50,000"; empty string for missing values and 0 (0 means "not offered" in the API)
export function formatFee(value) {
  const n = Number(value)
  if (value === null || value === undefined || value === '' || !Number.isFinite(n) || n <= 0) return ''
  return inr.format(n)
}

const TYPE_LABELS = { 'Pg Diploma': 'PG Diploma' }

// Display label for the API type ("Pg Diploma" -> "PG Diploma")
export function typeLabel(type) {
  return TYPE_LABELS[type] ?? type ?? ''
}

// Badge colours per course type (light backgrounds). Full class strings so Tailwind finds them.
export function typeBadgeClass(type) {
  switch (type) {
    case 'Fellowship':
      return 'bg-brand/10 text-brand-ink ring-1 ring-brand/30'
    case 'Pg Diploma':
      return 'bg-accent/10 text-deep ring-1 ring-accent/25'
    case 'Certificate':
      return 'bg-glow/25 text-deep ring-1 ring-glow/60'
    default:
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
  }
}

// 12 -> "12 months", 1 -> "1 month"; empty string when unknown
export function durationLabel(months) {
  const n = Number(months)
  if (!Number.isFinite(n) || n <= 0) return ''
  return `${n} ${n === 1 ? 'month' : 'months'}`
}

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// "1 Dec 2026" when the start date is still ahead; otherwise "Contact counsellor"
// (many API start dates are already in the past).
export function startLabel(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate || '')
  if (!match) return 'Contact counsellor'
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today ? dateFormat.format(date) : 'Contact counsellor'
}

function cleanDescription(raw) {
  return (raw || '')
    .replace(/\\r\\n|\r\n|\r|\n/g, ' ')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalize(course) {
  return {
    id: course.id,
    slug: course.slug,
    title: (course.name || '').trim(),
    type: course.type || '',
    image: course.image ? `${IMAGE_BASE}${encodeURIComponent(course.image)}` : '',
    description: cleanDescription(course.description),
    fee: formatFee(course.fee),
    totalFee: formatFee(course.total_fee),
    onlineCpd: formatFee(course.online_cpd),
    hybridCpd: formatFee(course.hybrid_cpd),
    startDate: course.start_date || '',
    durationMonths: Number(course.duration) || 0,
    isTop: Number(course.top_courses) === 1,
    actd: Number(course.actd) === 1,
  }
}

// Dev only: log what the filter found, once per successful load, so a change in the API
// (renamed courses, a broken filter) shows up in the console straight away.
function reportMatches(list, courses) {
  if (!import.meta.env.DEV) return
  if (list.length > 0 && courses.length === 0) {
    console.warn(`[surgery courses] The API returned ${list.length} courses but none matched the surgery filter.`)
    return
  }
  console.info(
    `[surgery courses] ${courses.length} of ${list.length} API courses match:`,
    courses.map((c) => c.slug)
  )
}

// One request per page load, shared by every page. A failed request is dropped from the cache
// and the error rethrown, so the caller can show it and a retry fetches again.
let cached = null

export function loadSurgeryCourses({ force = false } = {}) {
  if (force) cached = null
  if (!cached) {
    cached = fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || []
        // Top courses first; otherwise keep the API order
        const courses = list
          .filter(isSurgery)
          .map(normalize)
          .sort((a, b) => Number(b.isTop) - Number(a.isTop))
        reportMatches(list, courses)
        return courses
      })
      .catch((err) => {
        cached = null
        throw err
      })
  }
  return cached
}

// For pages: { status: 'loading' | 'ready' | 'error', courses, error, retry }
export function useSurgeryCourses() {
  const [state, setState] = useState({ status: 'loading', courses: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadSurgeryCourses({ force: attempt > 0 })
      .then((courses) => {
        if (active) setState({ status: 'ready', courses, error: null })
      })
      .catch((error) => {
        if (!active) return
        console.error('Could not load surgery courses:', error)
        setState({ status: 'error', courses: [], error })
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = () => {
    setState({ status: 'loading', courses: [], error: null })
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}

// ---------------------------------------------------------------------------------------------
// Course details

// TEMPORARY: until the CMS is cleaned up. Checked 30 Oct 2026: in 26 of the 55 surgery courses
// the last module's sessions end with text pasted from the brochure (accreditation blurb, contact
// details, social links). From the first session containing one of these markers, that session
// and every session after it in the module are dropped. Sessions before the marker are kept.
// Delete this (and its call in normalizeDetails) once the CMS data is clean.
const BROCHURE_MARKERS = [
  'International Accreditation',
  'Pan-India Clinical Attachment',
  'Contact Us',
  'MEDICAL GLOBAL',
  'ACCREDITED WITH',
  'playgoogle',
  'ACTD ACCREDITATION',
]

function stripBrochureJunk(lessons) {
  const first = lessons.findIndex((title) => BROCHURE_MARKERS.some((marker) => title.includes(marker)))
  return first === -1 ? lessons : lessons.slice(0, first)
}

// TEMPORARY, same reason: some highlights hold the same text twice, separated by line breaks
// ("A\r\n\r\n\r\nA" -> "A"). Distinct lines are kept and joined with a space.
function dedupeLines(raw) {
  const lines = (raw || '')
    .split(/\\r\\n|\r\n|\r|\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return [...new Set(lines)].join(' ')
}

const asList = (value) => (Array.isArray(value) ? value : [])

function normalizeWorkshop(workshop) {
  if (!workshop || typeof workshop !== 'object') return null
  const parts = asList(workshop.parts)
    .map((part, i) => ({
      id: part?.id ?? i,
      title: cleanDescription(part?.title),
      subtitle: cleanDescription(part?.subtitle),
      keyPoints: asList(part?.key_points)
        .map((point) => cleanDescription(point?.content))
        .filter(Boolean),
    }))
    .filter((part) => part.title || part.subtitle || part.keyPoints.length > 0)
  const title = cleanDescription(workshop.title)
  const subtitle = cleanDescription(workshop.subtitle)
  if (!title && !subtitle && parts.length === 0) return null
  return { title, subtitle, parts }
}

// Empty lists / null when the API has nothing, so each section can simply check for content
function normalizeDetails(data) {
  return {
    highlights: asList(data?.highlight)
      .map((item) => dedupeLines(item?.highlight))
      .filter(Boolean),
    whatYouLearn: asList(data?.what_you_learn)
      .map((item, i) => ({
        id: item?.id ?? i,
        heading: cleanDescription(item?.heading),
        description: cleanDescription(item?.description),
      }))
      .filter((item) => item.heading || item.description),
    workshop: normalizeWorkshop(data?.workshop),
    modules: asList(data?.module)
      .map((mod, i) => ({
        id: mod?.id ?? i,
        title: cleanDescription(mod?.module),
        lessons: stripBrochureJunk(
          asList(mod?.sessions)
            .map((session) => cleanDescription(session?.title))
            .filter(Boolean)
        ),
      }))
      .filter((mod) => mod.title || mod.lessons.length > 0),
  }
}

// One request per course per page load (cached by slug). A failed request is dropped from the
// cache and the error rethrown, so a retry fetches again.
const detailsCache = new Map()

export function loadCourseDetails(slug, { force = false } = {}) {
  if (force) detailsCache.delete(slug)
  if (!detailsCache.has(slug)) {
    const request = fetch(`${DETAILS_URL}${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => normalizeDetails(data?.data ?? data))
      .catch((err) => {
        detailsCache.delete(slug)
        throw err
      })
    detailsCache.set(slug, request)
  }
  return detailsCache.get(slug)
}

// For the course detail page: { status: 'loading' | 'ready' | 'error', details, error, retry }
export function useCourseDetails(slug) {
  const [state, setState] = useState({ slug, status: 'loading', details: null, error: null })
  // Retries are counted per slug, so moving to another course does not force a refetch
  const [attempt, setAttempt] = useState({ slug, count: 0 })
  const force = attempt.slug === slug && attempt.count > 0

  useEffect(() => {
    if (!slug) return
    let active = true
    loadCourseDetails(slug, { force })
      .then((details) => {
        if (active) setState({ slug, status: 'ready', details, error: null })
      })
      .catch((error) => {
        if (!active) return
        console.error(`Could not load course details for ${slug}:`, error)
        setState({ slug, status: 'error', details: null, error })
      })
    return () => {
      active = false
    }
  }, [slug, force, attempt])

  const retry = () => {
    setState({ slug, status: 'loading', details: null, error: null })
    setAttempt((a) => ({ slug, count: a.slug === slug ? a.count + 1 : 1 }))
  }

  // Until the effect has run for a new slug, report loading rather than the previous course
  const current = state.slug === slug ? state : { slug, status: 'loading', details: null, error: null }
  return { ...current, retry }
}
