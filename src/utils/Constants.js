// Navigation items for the single-page layout: [{ label, id }]
export const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

// Legacy routes -> section ids
export const LEGACY_ROUTES = {
  '/home': 'hero',
  '/languages': 'skills',
  '/workExperience': 'experience',
  '/projects': 'projects',
  '/about': 'about',
  '/contact': 'contact',
};
