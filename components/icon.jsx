const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  book: <><path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM14 7a3 3 0 0 1 3-3h3v15h-3a4 4 0 0 0-3 2" /></>,
  file: <><path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h6" /></>,
  grid: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  external: <><path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M15 8V3H3v13h5" /></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10Z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  list: <><path d="M8 6h12M8 12h12M8 18h12M3 6h1M3 12h1M3 18h1" /></>,
  spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
  github: <><path d="M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .2-1.5-.5-2 3-.4 6-1.5 6-6.5 0-1.5-.5-2.5-1.5-3.5.1-1 .1-2-0.5-3-1.5 0-3 1-3.5 1.5a12 12 0 0 0-6 0C8 3 6.5 2 5 2c-.6 1-.6 2-.5 3C3.5 6 3 7 3 8.5c0 5 3 6.1 6 6.5-.7.5-.7 1.5-.7 2V21" /></>,
};
export default function Icon({ name, size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} aria-hidden="true">{paths[name] || paths.file}</svg>;
}
