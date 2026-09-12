'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from './icon.jsx';
import SearchDialog from './search-dialog.jsx';

const groups = [
  ['시작하기', [['/', '⌂', '가이드 둘러보기'], ['/guides/principles', '◇', '개발 기본 원칙']]],
  ['개발 워크플로', [['/guides/planning', '01', '기획과 설계'], ['/guides/code', '02', '코드 작성'], ['/guides/review', '03', '테스트와 리뷰'], ['/guides/deploy', '04', '배포와 운영']]],
  ['AI와 함께 개발하기', [['/guides/ai', '✳', 'AI 협업 가이드'], ['/guides/prompt', '▧', '프롬프트 작성법']]],
  ['개발 도구', [['/builder', '＋', '프로젝트 지침 생성'], ['/templates', '▧', '상황별 요청 템플릿']]],
];
const entries = groups.flatMap(([, items]) => items);
const legacy = Object.fromEntries(entries.map(([href]) => [href.split('/').pop() || 'home', href]));
export default function Shell({ children }) {
  const pathname = usePathname(), router = useRouter();
  const [menuPath, setMenuPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    try { const stored = localStorage.getItem('handbook-theme'); if (stored === 'dark') { setTheme('dark'); document.documentElement.dataset.theme = 'dark'; } } catch {}
  }, []);
  function changeTheme(value) { setTheme(value); document.documentElement.dataset.theme = value; try { localStorage.setItem('handbook-theme', value); } catch {} }
  const menuOpen = menuPath === pathname;
  const title = entries.find(([href]) => href === pathname)?.[2] || '개발 지침서';
  useEffect(() => {
    const redirectLegacy = () => {
      const hash = window.location.hash.slice(1);
      if (window.location.pathname === '/' && Object.hasOwn(legacy, hash)) router.replace(legacy[hash]);
    };
    redirectLegacy();
    window.addEventListener('hashchange', redirectLegacy);
    return () => window.removeEventListener('hashchange', redirectLegacy);
  }, [router]);
  useEffect(() => {
    const onKey = event => {
      if (event.key === 'Escape') setMenuPath(null);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value); }
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) && !event.target.isContentEditable) {
        const search = document.getElementById('search');
        if (search) { event.preventDefault(); search.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <div className={menuOpen ? 'menu-open' : ''}>
    <a className="skip" href="#main">본문으로 이동</a>
    <aside className="sidebar" id="sidebar">
      <Link className="brand" href="/" onClick={() => setMenuPath(null)}><span className="brand-orb" />what-to-AI<span className="brand-docs">docs</span></Link>
      <button className="sidebar-search" onClick={() => { setSearchOpen(true); setMenuPath(null); }}><Icon name="search" /><span>문서 검색</span><kbd>Ctrl K</kbd></button>
      <Link className="workspace" href="/" onClick={() => setMenuPath(null)}><Icon name="grid" /><span>개발 지침서</span><span className="version">v2.0</span></Link>
      <nav aria-label="문서 탐색">{groups.map(([label, items]) => <div key={label}><p className="nav-label">{label}</p>{items.map(([href, icon, text]) => <Link href={href} key={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined} onClick={() => setMenuPath(null)}><span>{icon}</span>{text}</Link>)}</div>)}</nav>
      <footer className="sidebar-footer"><a href="https://github.com/cursaman/what-to-AI" target="_blank" rel="noreferrer" aria-label="GitHub 저장소 열기"><Icon name="github" size={18} /></a><span className="footer-caption">what-to-AI</span><div className="theme-controls" role="group" aria-label="화면 테마"><button aria-label="밝은 테마" aria-pressed={theme === 'light'} onClick={() => changeTheme('light')}><Icon name="sun" /></button><button aria-label="어두운 테마" aria-pressed={theme === 'dark'} onClick={() => changeTheme('dark')}><Icon name="moon" /></button></div></footer>
    </aside>
    <div className="shell"><header className="topbar"><button id="menu" className="icon-button" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuPath(menuOpen ? null : pathname)}><Icon name={menuOpen ? 'close' : 'menu'} size={19} /></button><div className="breadcrumb">개발 지침서 <span>/</span><b>{title}</b></div><button className="icon-button mobile-search" aria-label="문서 검색 열기" onClick={() => setSearchOpen(true)}><Icon name="search" size={19} /></button></header>
      <main id="main" tabIndex={-1}>{children}</main><footer className="page-footer"><span>what-to-AI <span className="muted">개발 지침서</span></span><span>작은 기준이 모여, 좋은 개발이 됩니다.</span></footer>
    </div>
    {searchOpen ? <SearchDialog onClose={() => setSearchOpen(false)} /> : null}
  </div>;
}
