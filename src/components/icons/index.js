import React from 'react';
import { createIcon } from './createIcon';

const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
  const r = (a * Math.PI) / 180;
  const f = (n) => (12 + n * Math.cos(r)).toFixed(2);
  const g = (n) => (12 + n * Math.sin(r)).toFixed(2);
  return <line key={a} x1={f(7)} y1={g(7)} x2={f(9.5)} y2={g(9.5)} />;
});

// UI icons
export const SunIcon = createIcon('SunIcon', <><circle cx="12" cy="12" r="4" />{rays}</>);
export const MoonIcon = createIcon('MoonIcon', <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" />);
export const CloseIcon = createIcon('CloseIcon', <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>);
export const ArrowUpIcon = createIcon('ArrowUpIcon', <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>);
export const ArrowRightIcon = createIcon('ArrowRightIcon', <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
export const ExternalIcon = createIcon('ExternalIcon', <><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>);
export const DownloadIcon = createIcon('DownloadIcon', <><line x1="12" y1="4" x2="12" y2="15" /><polyline points="7 10 12 15 17 10" /><path d="M4 18v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1" /></>);
export const CheckIcon = createIcon('CheckIcon', <polyline points="5 12.5 10 17.5 19 7.5" />);
export const PinIcon = createIcon('PinIcon', <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const GlobeIcon = createIcon('GlobeIcon', <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><line x1="3" y1="12" x2="21" y2="12" /></>);
export const AndroidIcon = createIcon('AndroidIcon', <><path d="M5 16a7 7 0 0 1 14 0Z" /><line x1="8" y1="5" x2="9.5" y2="8" /><line x1="16" y1="5" x2="14.5" y2="8" /><circle cx="9.5" cy="12.5" r="0.6" /><circle cx="14.5" cy="12.5" r="0.6" /><line x1="5" y1="19" x2="19" y2="19" /></>);
export const AppleIcon = createIcon('AppleIcon', <><path d="M12 7c-2-1.5-6-1-6 4 0 4 2.5 9 4.5 9 .9 0 1-.5 1.5-.5s.6.5 1.5.5c2 0 4.5-5 4.5-9 0-5-4-5.5-6-4Z" /><path d="M12 7c0-2 1-3.5 3-4" /></>);
export const MonitorIcon = createIcon('MonitorIcon', <><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="8" y1="20" x2="16" y2="20" /><line x1="12" y1="16" x2="12" y2="20" /></>);
export const CapIcon = createIcon('CapIcon', <><polygon points="12 4 22 9 12 14 2 9" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /><line x1="22" y1="9" x2="22" y2="15" /></>);
export const LanguageIcon = createIcon('LanguageIcon', <><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><polyline points="8 14 12 8 16 14" /><line x1="9.5" y1="12" x2="14.5" y2="12" /></>);
export const WalletIcon = createIcon('WalletIcon', <><path d="M4 7a2 2 0 0 1 2-2h11v4" /><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="16.5" cy="13.5" r="1.2" /></>);
export const LockIcon = createIcon('LockIcon', <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
export const ShieldIcon = createIcon('ShieldIcon', <><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3Z" /><polyline points="8.5 12 11 14.5 15.5 9.5" /></>);
export const ChartIcon = createIcon('ChartIcon', <><polyline points="3 3 3 21 21 21" /><polyline points="7 15 11 11 14 13 20 6" /></>);

// Social (filled)
export const GitHubIcon = createIcon(
  'GitHubIcon',
  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  { filled: true }
);
export const LinkedInIcon = createIcon(
  'LinkedInIcon',
  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />,
  { filled: true }
);

// Category icons
export const BrowserIcon = createIcon('BrowserIcon', <><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><polyline points="10 12.5 8 14.5 10 16.5" /><polyline points="14 12.5 16 14.5 14 16.5" /></>);
export const DatabaseIcon = createIcon('DatabaseIcon', <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>);
export const PhoneIcon = createIcon('PhoneIcon', <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><line x1="10" y1="5.5" x2="14" y2="5.5" /><line x1="10.5" y1="18.5" x2="13.5" y2="18.5" /></>);
export const CloudIcon = createIcon('CloudIcon', <><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10a4 4 0 0 1-.5 8H7Z" /><path d="M10 14.5a2.2 2.2 0 0 1 3.8-1" /><path d="M14 14.5a2.2 2.2 0 0 1-3.8 1" /></>);
export const VibeCodeIcon = createIcon('VibeCodeIcon', <><rect x="3" y="6" width="15" height="14" rx="2" /><polyline points="7 11 10 13.5 7 16" /><line x1="12" y1="16" x2="15" y2="16" /><path d="M19 2v4M17 4h4" /></>);
export const AgentsIcon = createIcon('AgentsIcon', <><circle cx="12" cy="12" r="3" /><circle cx="12" cy="3.5" r="1.8" /><circle cx="4.6" cy="16.5" r="1.8" /><circle cx="19.4" cy="16.5" r="1.8" /><line x1="12" y1="9" x2="12" y2="5.3" /><line x1="9.4" y1="13.5" x2="6.2" y2="15.6" /><line x1="14.6" y1="13.5" x2="17.8" y2="15.6" /></>);
export const ChipIcon = createIcon('ChipIcon', <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" /></>);
export const WifiIcon = createIcon('WifiIcon', <><path d="M2 9a15 15 0 0 1 20 0" /><path d="M5.5 12.5a10 10 0 0 1 13 0" /><path d="M9 16a5 5 0 0 1 6 0" /><circle cx="12" cy="19.5" r="0.8" /></>);
export const UsersIcon = createIcon('UsersIcon', <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2A5 5 0 0 1 21 19" /></>);

export const categoryIcons = {
  browser: BrowserIcon,
  database: DatabaseIcon,
  phone: PhoneIcon,
  cloud: CloudIcon,
  vibe: VibeCodeIcon,
  agents: AgentsIcon,
  chip: ChipIcon,
  users: UsersIcon,
  wallet: WalletIcon,
  chart: ChartIcon,
  lock: LockIcon,
  shield: ShieldIcon,
};
