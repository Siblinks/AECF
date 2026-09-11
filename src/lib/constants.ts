import {
  Sprout,
  HardHat,
  HeartPulse,
  Briefcase,
  Cpu,
  GraduationCap,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

export interface Pillar {
  key: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

export const PILLARS: Pillar[] = [
  {
    key: 'Agriculture',
    name: 'Agriculture',
    description: 'Modernizing farming practices, supporting cooperatives, and ensuring food security across Agaie LGA.',
    icon: Sprout,
    color: 'primary',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
  },
  {
    key: 'Engineering',
    name: 'Engineering',
    description: 'Building critical infrastructure — roads, water systems, and electrification for our communities.',
    icon: HardHat,
    color: 'secondary',
    bgColor: 'bg-secondary-50',
    textColor: 'text-secondary-700',
  },
  {
    key: 'Health',
    name: 'Health',
    description: 'Improving healthcare access, community outreach, and maternal and child health services.',
    icon: HeartPulse,
    color: 'error',
    bgColor: 'bg-error-50',
    textColor: 'text-error-600',
  },
  {
    key: 'Business',
    name: 'Business',
    description: 'Empowering entrepreneurs, SMEs, and cooperatives with training and microfinance support.',
    icon: Briefcase,
    color: 'accent',
    bgColor: 'bg-accent-50',
    textColor: 'text-accent-700',
  },
  {
    key: 'ICT',
    name: 'ICT',
    description: 'Bridging the digital divide through training centres, connectivity, and digital literacy programs.',
    icon: Cpu,
    color: 'secondary',
    bgColor: 'bg-secondary-50',
    textColor: 'text-secondary-700',
  },
  {
    key: 'Education',
    name: 'Education',
    description: 'Investing in schools, scholarships, and educational infrastructure for the next generation.',
    icon: GraduationCap,
    color: 'primary',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
  },
  {
    key: 'Environment',
    name: 'Environment & Socials',
    description: 'Conserving our natural resources, promoting sustainability, and strengthening community bonds.',
    icon: Leaf,
    color: 'primary',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
  },
];

export const QUALIFICATIONS = [
  'Primary School Certificate',
  'Junior Secondary Certificate',
  'Senior Secondary Certificate (WAEC/NECO)',
  'NCE',
  'OND',
  'HND',
  'BSc',
  'BA',
  'BEng',
  'MBBS',
  'MSc',
  'MA',
  'PhD',
  'Other',
];

export const FIELDS_OF_STUDY = [
  'Agriculture',
  'Engineering',
  'Health',
  'Business',
  'ICT',
  'Education',
  'Environment',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Other',
];

export const EMPLOYMENT_STATUSES = [
  'Employed',
  'Self-employed',
  'Unemployed',
  'Student',
  'Retired',
];

export const SKILL_OPTIONS = [
  'Agriculture',
  'Engineering',
  'Health',
  'Business',
  'ICT',
  'Education',
  'Environment',
  'Construction',
  'Project Management',
  'Finance',
  'Programming',
  'Web Development',
  'Data Analysis',
  'Medicine',
  'Nursing',
  'Teaching',
  'Research',
  'Administration',
  'Legal',
  'Communications',
];

export const VOLUNTEER_AREAS = [
  'Agricultural Training',
  'Health Outreach',
  'ICT Training',
  'Digital Literacy',
  'Educational Support',
  'Mentoring',
  'Youth Empowerment',
  'Community Care',
  'Infrastructure',
  'Environmental Cleanup',
  'Tree Planting',
  'Financial Literacy',
  'SME Support',
  'Technical Training',
];

export const PROJECT_STATUSES = [
  { key: 'proposed', label: 'Proposed', color: 'bg-slate-100 text-slate-700' },
  { key: 'planning', label: 'Planning', color: 'bg-accent-100 text-accent-700' },
  { key: 'ongoing', label: 'Ongoing', color: 'bg-primary-100 text-primary-700' },
  { key: 'completed', label: 'Completed', color: 'bg-success-100 text-success-700' },
];

export const NEWS_CATEGORIES = [
  'Government',
  'Community',
  'Agriculture',
  'Health',
  'ICT',
  'Education',
  'Business',
  'Environment',
];

export function getStatusInfo(status: string) {
  return PROJECT_STATUSES.find((s) => s.key === status) || PROJECT_STATUSES[0];
}

export function getPillar(key: string) {
  return PILLARS.find((p) => p.key === key);
}
