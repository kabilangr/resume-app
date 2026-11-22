// Single source of truth for all portfolio content.
// Hero images are WebP files in public/img/hero (four widths each), generated from the 16:9 scene
// JPGs in src/assets/portrait/ without cropping, so the reveal mask stays aligned.
const P = process.env.PUBLIC_URL || '';
const HERO_WIDTHS = [640, 960, 1280, 1600];
const heroUrl = (kind, w) => `${P}/img/hero/portrait-${kind}-${w}.webp`;

export const profile = {
  name: 'Kabilan GR',
  role: 'Lead Full-Stack Developer',
  company: 'Xpulsar',
  location: 'Chennai, Tamil Nadu, India',
  shortLocation: 'Chennai, India',
  resumePath: '/Kabilan_GR_Resume.pdf',
  roles: [
    'Lead Full-Stack Developer',
    'Software Architect',
    'Flutter Developer',
    'React & React Native Engineer',
    'AI Agent Orchestrator',
    'IoT & Embedded Systems Engineer',
    'Product Owner',
    'Product Developer',
  ],
  summary:
    'Lead Full-Stack Developer with 6+ years of experience building web, mobile and desktop products with React, React Native, Node.js and Java. I lead teams, own architecture and product decisions as a software architect and product owner, and ship across Web, Android, iOS and Desktop.',
  summaryMore:
    'Beyond day-to-day product work I build with AI-assisted development, orchestrate multi-agent and multi-model LLM workflows, and design IoT and embedded systems on ESP32, Arduino and Raspberry Pi.',
  portraitAlt: 'Pixar-style illustration of Kabilan GR smiling at a wooden café table under fairy lights',
  // Hero reveal portrait: two aligned full-scene 16:9 images (same wall, masks and
  // plant; only the person and the robot differ). They are
  // shown in a framed card and cropped with object-fit: cover. If either is null the
  // hero falls back to kabilan-portrait.jpg and a CSS/SVG robotic layer.
  portrait: {
    cartoon: heroUrl('cartoon', 1280),
    robot: heroUrl('robot', 1280),
    // Must stay byte-identical to the preload in public/index.html (after %PUBLIC_URL% is replaced).
    cartoonSrcSet: HERO_WIDTHS.map((w) => `${heroUrl('cartoon', w)} ${w}w`).join(', '),
    robotSet: HERO_WIDTHS.map((w) => ({ w, url: heroUrl('robot', w) })),
    sizes: '(min-width: 1024px) 1350px, (min-width: 768px) 1000px, 112vw',
  },
  contactLead:
    'Full-stack web and mobile, AI agent orchestration and IoT. The quickest way to reach me is LinkedIn.',
  heroStat: 'years building for Web, Android, iOS and Desktop',
};

export const stats = {
  years: '6+',
  yearsLabel: 'Years of experience',
  companies: 5,
  companiesLabel: 'Companies',
  platforms: ['Web', 'Android', 'iOS', 'Desktop'],
  platformsLabel: 'Platforms shipped',
};

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/kabilangr' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kabilan-g-r-9749631b5/',
  },
];

// Self-assessed working proficiency, rounded steps (not a measured metric).
export const coreStack = [
  { label: 'React / RN', aria: 'React and React Native', level: 90, hue: 'var(--cat-frontend)', icon: 'react' },
  { label: 'Node.js', aria: 'Node.js', level: 80, hue: 'var(--cat-backend)', icon: 'node' },
  { label: 'TS / JS', aria: 'TypeScript and JavaScript', level: 90, hue: 'var(--cat-cloud)', icon: 'ts' },
  { label: 'Flutter', aria: 'Flutter', level: 70, hue: 'var(--cat-mobile)', icon: 'flutter' },
  { label: 'AI agents', aria: 'AI agents, multi-model', level: 80, hue: 'var(--cat-agents)', icon: 'agents' },
  { label: 'IoT / Embedded', aria: 'IoT and embedded', level: 70, hue: 'var(--cat-iot)', icon: 'chip' },
];

export const skillCategories = [
  {
    id: 'frontend',
    short: 'Frontend',
    title: 'Frontend',
    hue: 'var(--cat-frontend)',
    icon: 'browser',
    items: ['React.js', 'Next.js', 'React Native', 'Angular', 'Angular Material', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'],
  },
  {
    id: 'backend',
    short: 'Backend',
    title: 'Backend & Data',
    hue: 'var(--cat-backend)',
    icon: 'database',
    items: ['Node.js', 'Express.js', 'NestJS', 'Spring Boot', 'Core Java', 'Kotlin', 'MySQL', 'PostgreSQL', 'MongoDB', 'SQS'],
  },
  {
    id: 'mobile',
    short: 'Mobile',
    title: 'Mobile',
    hue: 'var(--cat-mobile)',
    icon: 'phone',
    items: ['Android', 'iOS', 'React Native', 'Flutter / Dart'],
  },
  {
    id: 'cloud',
    short: 'Cloud',
    title: 'Cloud & DevOps',
    hue: 'var(--cat-cloud)',
    icon: 'cloud',
    items: ['Azure', 'AWS', 'Git / GitHub / GitLab / Bitbucket', 'CI/CD'],
  },
  {
    id: 'vibe',
    short: 'Vibe Coding',
    title: 'AI-Assisted Dev / Vibe Coding',
    hue: 'var(--cat-vibe)',
    icon: 'vibe',
    highlight: true,
    items: ['Claude Code', 'Cursor', 'GitHub Copilot', 'v0 / Lovable / Bolt', 'Prompt engineering', 'Spec-driven development'],
  },
  {
    id: 'agents',
    short: 'Agents',
    title: 'AI Agent Orchestration & Multi-Agent',
    hue: 'var(--cat-agents)',
    icon: 'agents',
    highlight: true,
    items: ['Claude Agent SDK', 'MCP servers', 'LangGraph', 'CrewAI', 'AutoGen', 'Tool use / function calling', 'RAG', 'Vector DBs', 'Multi-model routing', 'On-device LLMs (LiteRT-LM)'],
  },
  {
    id: 'iot',
    short: 'IoT',
    title: 'Hardware & IoT',
    hue: 'var(--cat-iot)',
    icon: 'chip',
    highlight: true,
    items: ['ESP32', 'Arduino', 'Raspberry Pi', 'Sensors & actuators', 'MQTT', 'Embedded C/C++', 'MicroPython'],
  },
  {
    id: 'process',
    short: 'Process',
    title: 'Ways of Working',
    hue: 'var(--cat-process)',
    icon: 'users',
    items: ['Agile / Scrum', 'JIRA', 'ClickUp', 'CRM (Freshworks)', 'Team leadership & mentoring'],
  },
];

export const experience = [
  {
    id: 'xpulsar',
    company: 'Xpulsar',
    location: '',
    role: 'Lead Full-Stack Developer',
    start: '12/2025',
    end: null,
    description:
      'Leads full-stack development across web and mobile, owns architecture and technical decisions, reviews code and mentors the team.',
  },
  {
    id: 'fountain-hills',
    company: 'Fountain Hills Technologies',
    location: 'Coimbatore',
    role: 'Lead Full Stack Developer',
    start: '04/2024',
    end: '09/2025',
    description: 'Led full-stack delivery across web and mobile products.',
  },
  {
    id: 'zoho',
    company: 'Zoho Corporation',
    location: 'Chennai',
    role: 'Member Technical Staff (Android & Web)',
    start: '02/2022',
    end: '08/2023',
    description: 'Built Android and web applications, including multi-platform apps and APK tooling.',
  },
  {
    id: 'altradimension',
    company: 'AltraDimension Technologies',
    location: 'Bangalore',
    role: 'Software Developer (Front-End)',
    start: '04/2021',
    end: '02/2022',
    description: 'Developed front-end features for web applications.',
  },
  {
    id: 'softsuave',
    company: 'SoftSuave Technologies',
    location: 'Chennai',
    role: 'Software Engineer',
    start: '01/2020',
    end: '01/2021',
    description: 'Started a software engineering career building and maintaining web applications.',
  },
];

export const featuredProject = {
  id: 'valam',
  title: 'Valam',
  tamil: 'Tamil for "prosperity"',
  categories: ['Mobile', 'AI'],
  url: 'https://valam.io',
  tagline:
    'A private, on-device personal finance app built in Flutter for Android and iOS.',
  features: [
    { icon: 'wallet', text: 'Tracks accounts, transactions, credit cards, loans, money with friends and family, and investments.' },
    { icon: 'chart', text: '31 problem detectors, financial-health scores and forecasting.' },
    { icon: 'lock', text: 'Encrypted SQLite with hardware-backed keys (Android Keystore/StrongBox, iOS Secure Enclave).' },
    { icon: 'shield', text: 'No backend, no account and no analytics.' },
  ],
  privacy: ['No backend', 'No account', 'No analytics'],
  mathi: {
    title: 'Mathi, the on-device AI coach',
    text:
      'Mathi (Tamil "good sense", also "the moon") runs a local LLM through LiteRT-LM. It is an agent that talks only about money and draws on a 187-article knowledge base.',
    components: ['Orchestrator', 'Tools', 'Intent detection', 'Number checker', 'Policy filter', 'Topic guard'],
  },
  tags: ['Flutter', 'Dart', 'On-device AI', 'LiteRT-LM', 'AI agents', 'SQLite encryption'],
  screenshots: [
    { id: 'home', alt: 'Valam home screen showing net worth and accounts' },
    { id: 'coach', alt: 'Mathi AI coach chat inside Valam' },
    { id: 'wealth', alt: 'Valam wealth and investments screen' },
  ],
};

export const projectFilters = ['All', 'Web', 'Mobile', 'AI', 'CRM'];

export const projects = [
  {
    id: 'work-allocation',
    title: 'Work Allocation & Learning Platform',
    description: 'A platform for allocating work to people and tracking their learning.',
    categories: ['Web'],
    tags: ['React', 'Node.js'],
    hue: 'var(--cat-backend)',
  },
  {
    id: 'quote-commerce',
    title: 'Quote Management & Commerce Platform',
    description: 'Quote management and commerce workflows in one platform.',
    categories: ['Web'],
    tags: ['React', 'Node.js'],
    hue: 'var(--cat-vibe)',
  },
  {
    id: 'company-website',
    title: 'Company Website with AI ChatBot',
    description: 'A company website with an integrated AI chatbot.',
    categories: ['Web', 'AI'],
    tags: ['Next.js', 'NestJS', 'Azure'],
    hue: 'var(--cat-agents)',
  },
  {
    id: 'zoho-apps',
    title: 'Zoho Multi-platform Apps & APK tooling',
    description: 'Multi-platform applications and APK tooling built at Zoho.',
    categories: ['Mobile', 'Web'],
    tags: ['Android', 'Kotlin', 'Web'],
    hue: 'var(--cat-mobile)',
  },
  {
    id: 'wasfat',
    title: 'Wasfat App UX',
    description: 'User experience and interface work for the Wasfat app.',
    categories: ['Mobile'],
    tags: ['UX', 'Mobile'],
    hue: 'var(--cat-iot)',
  },
  {
    id: 'sothebys-crm',
    title: "Sotheby's CRM & Freshworks modules",
    description: 'CRM customisation and Freshworks modules.',
    categories: ['CRM'],
    tags: ['Freshworks', 'CRM'],
    hue: 'var(--cat-cloud)',
  },
];

export const education = {
  degree: 'B.E.',
  institution: 'Prince Shri Venkateshwara Padmavathy Engineering College',
  years: '2016 - 2020',
};

export const languages = [
  {
    name: 'English',
    code: 'EN',
    lang: 'en',
    level: 'Native',
    greeting: 'Hello',
    romanized: null,
    note: 'I think, write and present in English.',
  },
  {
    name: 'Tamil',
    code: 'TA',
    lang: 'ta',
    level: 'Native',
    greeting: 'வணக்கம்',
    romanized: 'Vanakkam',
    note: 'My mother tongue, and the language Valam and Mathi are named in.',
  },
];
export const spokenLanguages = languages.map((l) => l.name);
