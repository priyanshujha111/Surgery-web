import { useEffect, useState } from 'react'

export const FACULTY_API_URL = 'https://24x7.medicalglobalacademy.com/api/faculty-list'

// The specialty this site shows. A doctor is kept only if one of their department values
// (split on "," and "|", trimmed) equals this exactly, ignoring case. Change it here only.
export const SITE_DEPARTMENT = 'Surgery'

// Set to true only once the faculty list is confirmed (consented faculty, verified credentials).
// While false, the "All doctors are verified" badge stays hidden on the Home and Doctors pages.
export const FACULTY_CONFIRMED = false

// Test accounts are named after their faculty ID ("FACULTY1101") and must never be shown.
const TEST_ACCOUNT_RE = /^FACULTY\d+$/i

// Hide a record from the public site by its API id (numbers), e.g. a test entry that does not
// follow the FACULTY1234 naming.
// TODO: check whether id 46 ("Dr. Crazy Reddy") is a real faculty member.
const EXCLUDE_IDS = []

// "Orthopaedics,Surgery" / "Neonatology, Pediatrics" / "Orthopaedics | Arthroscopy" -> parts
const splitList = (value, separators) =>
  String(value ?? '')
    .split(separators)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

// Display case only; spelling is left as the API has it. A value written entirely in capitals
// ("GNAECOLOGY") becomes "Gnaecology"; short acronyms ("ENT") and mixed case values are kept.
function displayCase(value) {
  if (value.length > 4 && value === value.toUpperCase() && /[A-Z]/.test(value)) {
    return value.toLowerCase().replace(/(^|[\s&/(-])([a-z])/g, (_, lead, ch) => lead + ch.toUpperCase())
  }
  return value
}

function departments(raw) {
  // Keep the first spelling of each department, compared case-insensitively
  const seen = new Set()
  return splitList(raw, /[,|]/)
    .map(displayCase)
    .filter((dept) => {
      const key = dept.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

const isUsableUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value.trim())

// The one place an API record is turned into what the UI uses. email and phone are deliberately
// NOT copied, so contact details never reach a component (or the console).
export function mapFaculty(item) {
  const focusAreas = departments(item.department)
  const qualification = String(item.qualification ?? '').replace(/\s+/g, ' ').trim()
  const photo = [item.image_url, item.profileImage, item.external_photo_url].find(isUsableUrl)

  return {
    id: String(item.id),
    name: String(item.name ?? '').replace(/\s+/g, ' ').trim(),
    qualification,
    focus: focusAreas[0] || '',
    focusAreas,
    photo: photo ? photo.trim() : null,
    bio: [], // the API has no bio yet
    qualifications: splitList(qualification, /[,/]/)
      .map((q) => q.replace(/[.,]+$/, '').trim())
      .filter(Boolean),
  }
}

function isPublic(item) {
  if (!item || item.id === null || item.id === undefined) return false
  const name = String(item.name ?? '').trim()
  if (!name || TEST_ACCOUNT_RE.test(name)) return false
  return !EXCLUDE_IDS.includes(Number(item.id))
}

// Exact match on each department value, not a substring ("Surgical Oncology" would not count)
const siteDepartment = SITE_DEPARTMENT.trim().toLowerCase()
const inSiteDepartment = (doctor) => doctor.focusAreas.some((area) => area.toLowerCase() === siteDepartment)

// One request per page load, shared by every page (Home, Doctors, doctor profile), so moving
// between routes never refetches. A failed request is dropped from the cache and the error
// rethrown, so the caller can show it and a retry fetches again.
let cached = null
let resolved = null // the finished list, so a page opened later renders it without a skeleton

export function loadFaculty({ force = false } = {}) {
  if (force) {
    cached = null
    resolved = null
  }
  if (!cached) {
    cached = fetch(FACULTY_API_URL, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        const doctors = list.filter(isPublic).map(mapFaculty).filter(inSiteDepartment)
        // Dev only, counts only: never log the records (they hold contact details)
        if (import.meta.env.DEV) {
          console.info(`[faculty] ${doctors.length} of ${list.length} API records are in ${SITE_DEPARTMENT}`)
        }
        resolved = doctors
        return doctors
      })
      .catch((err) => {
        cached = null
        throw err
      })
  }
  return cached
}

const initialState = () =>
  resolved
    ? { status: 'ready', doctors: resolved, error: null }
    : { status: 'loading', doctors: [], error: null }

// For pages: { status: 'loading' | 'ready' | 'error', doctors, error, retry }
// `doctors` holds only SITE_DEPARTMENT doctors, so every page shows the same filtered list.
// The request itself is shared, so unmounting one page does not abort it for the others;
// a page that unmounts simply ignores the result.
export function useFaculty() {
  const [state, setState] = useState(initialState)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadFaculty({ force: attempt > 0 })
      .then((doctors) => {
        if (active) setState({ status: 'ready', doctors, error: null })
      })
      .catch((error) => {
        if (!active) return
        console.error('Could not load the faculty list:', error.message)
        setState({ status: 'error', doctors: [], error })
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = () => {
    setState({ status: 'loading', doctors: [], error: null })
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}
