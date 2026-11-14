// Home "Trending Courses": picked from the live API by slug, in this order.
// The slugs are real surgery courses from the API (checked 29 Oct 2026). None of them overlaps
// with the cardiology or neurology sites.
// description is only a fallback for when the API has none.
// No surgery course is marked as a top course in the API, so no TOP badge is used.
// "fellowship-in-surgical-oncology" is the most recently added of the three (12 Oct 2026).
// TODO: confirm which courses to feature and the badge labels (TRENDING / TOP / NEW) with the MGA team.
export const trendingSurgeryCourses = [
  {
    slug: 'fellowship-in-general-surgery',
    badge: 'TRENDING',
    badgeClass: 'bg-accent/10 text-deep ring-1 ring-accent/25',
    description: 'A fellowship program in general surgery from Medical Global Academy.',
  },
  {
    slug: 'fellowship-in-laparoscopic-surgery',
    badge: 'TRENDING',
    badgeClass: 'bg-accent/10 text-deep ring-1 ring-accent/25',
    description: 'A fellowship program in laparoscopic surgery from Medical Global Academy.',
  },
  {
    slug: 'fellowship-in-surgical-oncology',
    badge: 'NEW',
    badgeClass: 'bg-glow/25 text-deep ring-1 ring-glow/60',
    description: 'A fellowship program in surgical oncology from Medical Global Academy.',
  },
]
