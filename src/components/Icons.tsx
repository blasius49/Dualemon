type P = { className?: string };
const base = "shrink-0";

export const IconCart = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.6l2.4 12h11l2-8.5H6.2" />
  </svg>
);
export const IconUser = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c1.4-3.6 4.2-5.2 7.5-5.2s6.1 1.6 7.5 5.2" />
  </svg>
);
export const IconStar = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />
  </svg>
);
export const IconClock = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <circle cx="12" cy="12" r="8.6" /><path d="M12 7.2V12l3.2 2.2" />
  </svg>
);
export const IconPin = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" />
  </svg>
);
export const IconPhone = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M5 3.5h4l1.5 4.5-2.2 1.6a12.5 12.5 0 006.1 6.1l1.6-2.2 4.5 1.5v4a1.5 1.5 0 01-1.6 1.5C10.4 19.9 4.1 13.6 3.5 5.1A1.5 1.5 0 015 3.5z" />
  </svg>
);
export const IconInstagram = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPlus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M5 12h14" />
  </svg>
);
export const IconTrash = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4 6.5h16M9.5 6.5V4.8A1.3 1.3 0 0110.8 3.5h2.4a1.3 1.3 0 011.3 1.3v1.7M6.5 6.5l1 13h9l1-13M10 10.5v5.5M14 10.5v5.5" />
  </svg>
);
export const IconEdit = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4 20h4L19.5 8.5a2.1 2.1 0 00-3-3L5 17v3z" /><path d="M14.5 6.5l3 3" />
  </svg>
);
export const IconCheck = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);
export const IconX = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconChevron = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const IconArrow = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const IconFlame = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M12 21c3.9 0 6.5-2.5 6.5-6.2 0-4.6-4.2-6.6-4.9-11.3-2.6 1.7-3.6 4.4-3.3 7-1.2-.5-2-1.6-2.2-3.2-1.6 1.7-2.6 4-2.6 6.4C5.5 18 8.1 21 12 21z" />
  </svg>
);
export const IconFork = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M7 3v6a3 3 0 006 0V3M10 3v18M17 3c-1.5 2-2 4.5-2 7 0 2 .8 3 2 3v8M17 3c1.5 2 2 4.5 2 7 0 2-.8 3-2 3" />
  </svg>
);
export const IconLogout = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h9" />
  </svg>
);
export const IconBox = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
  </svg>
);
export const IconChart = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
  </svg>
);
export const IconGoogle = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`}>
    <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 01-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
    <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A12 12 0 0012 24z" />
    <path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 010-4.6v-3H1.8a12 12 0 000 10.6l3.8-3z" />
    <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3A12 12 0 001.8 7.1l3.8 3c.9-2.7 3.4-5.3 6.4-5.3z" />
  </svg>
);
