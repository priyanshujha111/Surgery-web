import { useEffect, useState } from 'react'
import { loadAllCourses } from '../data/surgeryCourseApi.js'

// Shown if the course API can't be reached (live figures as of 19 Nov 2026)
export const FALLBACK_STATS = { total: 508, fellowships: 397, certificates: 47, pgDiplomas: 64 }

const typeKey = (course) => String(course?.type ?? '').trim().toLowerCase()

function computeStats(list) {
  const count = (type) => list.filter((c) => typeKey(c) === type).length
  return {
    total: list.length,
    fellowships: count('fellowship'),
    certificates: count('certificate'),
    pgDiplomas: count('pg diploma'),
  }
}

// Computed once per page load; the request itself is shared with the course pages
let statsCache = null

// { stats: { total, fellowships, certificates, pgDiplomas } | null, loading, error }
export function useCourseStats() {
  const [state, setState] = useState(() =>
    statsCache
      ? { stats: statsCache, loading: false, error: null }
      : { stats: null, loading: true, error: null }
  )

  useEffect(() => {
    if (statsCache) return
    let active = true
    loadAllCourses()
      .then((list) => {
        statsCache = computeStats(list)
        if (active) setState({ stats: statsCache, loading: false, error: null })
      })
      .catch((error) => {
        console.error('Could not load course stats, showing fallback figures:', error)
        if (active) setState({ stats: FALLBACK_STATS, loading: false, error })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
