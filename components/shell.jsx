'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <Link className="brand" href="/" onClick={() => setMenuPath(null)}><span className="brand-icon">‹/›</span> what-to-<b>AI</b><span className="brand-dot" /></Link>
      <div className="workspace"><span className="book-icon">▤</span><div>개발 지침서<small>DEVELOPER HANDBOOK</small></div><span className="version">v2.0</span></div>
      <nav aria-label="문서 탐색">{groups.map(([label, items]) => <div key={label}><p className="nav-label">{label}</p>{items.map(([href, icon, text]) => <Link href={href} key={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined} onClick={() => setMenuPath(null)}><span>{icon}</span>{text}</Link>)}</div>)}</nav>
      <div className="sidebar-note"><span className="note-symbol">✳</span><strong>좋은 개발은, 좋은 기준에서.</strong><p>작은 결정부터 배포까지<br />필요한 순간에 꺼내 보는 지침서.</p></div>
      <footer><span className="status-dot" />Your next line, a little better.</footer>
    </aside>
    <div className="shell"><header className="topbar"><button id="menu" className="icon-button" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuPath(menuOpen ? null : pathname)}>☰</button><div className="breadcrumb">개발 지침서 <span>/</span><b>{title}</b></div><span className="header-note">BUILD WITH INTENTION</span></header>
      <main id="main" tabIndex={-1}>{children}</main><footer className="page-footer"><span>what-to-AI <span className="muted">/ 개발의 기준을 함께 만듭니다.</span></span><span>Developer handbook · 2026</span></footer>
    </div>
  </div>;
}
