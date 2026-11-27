import { Leaf, SmilePlus, Stethoscope } from 'lucide-react'

// "Who Can Apply" cards on the About page. Edit groups and qualifications here.
export const ELIGIBILITY_GROUPS = [
  {
    title: 'Medical Doctors (NMC)',
    label: 'NMC registered doctors',
    icon: Stethoscope,
    qualifications: ['MBBS', 'MS', 'MD', 'DNB', 'DGO', 'DCH', 'DM', 'MCh'],
  },
  {
    title: 'AYUSH Practitioners',
    label: 'AYUSH professionals',
    icon: Leaf,
    qualifications: ['BHMS', 'BUMS', 'BAMS'],
  },
  {
    title: 'Dental Professionals',
    label: 'Dental practitioners',
    icon: SmilePlus,
    qualifications: ['BDS', 'DDS', 'MDS'],
  },
]

export const ELIGIBILITY_NOTE =
  'Eligibility for each program may vary. Please check the individual course page or contact us to confirm.'
