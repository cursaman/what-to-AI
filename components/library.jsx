'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const categories = ['전체', '시작하기', '개발 워크플로', 'AI와 함께 개발하기'];
export default function Library({ initialGuides }) {
  const [query, setQuery] = useState(''), [category, setCategory] = useState('전체');
  const [state, setState] = useState({ items: initialGuides, query: '', category: '전체', error: '' });
  const [attempt, setAttempt] = useState(0);
  const pending = state.query !== query || state.category !== category;
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 12000);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/guides?${new URLSearchParams({ q: query, category })}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || '검색하지 못했습니다.');
        if (active) setState({ items: data.items, query, category, error: '' });
      } catch (error) { if (active) setState({ items: [], query, category, error: error.name === 'AbortError' ? '검색 시간이 초과되었습니다.' : '검색하지 못했습니다. 다시 시도해 주세요.' }); }
      finally { clearTimeout(timeout); }
    }, 250);
    return () => { active = false; clearTimeout(timer); clearTimeout(timeout); controller.abort(); };
  }, [query, category, attempt]);
  return <>
    <div className="eyebrow"><span />THE DEVELOPER&apos;S FIELD GUIDE</div><h1>더 나은 개발을 위한<br />우리의 기준<span className="lime-period">.</span></h1><p className="intro">무엇부터 시작할지, 어떻게 만들어야 할지.<br />기획부터 배포까지 필요한 개발 지침을 한곳에서 확인하세요.</p>
    <div className="search-wrap"><span aria-hidden="true">⌕</span><input id="search" type="search" value={query} onChange={e => setQuery(e.target.value)} maxLength={200} placeholder="어떤 개발 지침을 찾고 있나요?" aria-label="개발 지침 검색" /><kbd>/</kbd></div>
    <div className="featured"><div className="feature-content"><div className="feature-kicker">START HERE <span>첫 번째 가이드</span></div><h2>코드보다 먼저, 원칙부터.</h2><p>좋은 코드를 만드는 공통의 기준을 확인하고<br />나만의 개발 워크플로를 시작해 보세요.</p><Link href="/guides/principles">개발 기본 원칙 읽기 <span>↗</span></Link></div><div className="feature-art" aria-hidden="true"><div className="art-grid" /><div className="code-sheet"><div className="sheet-head"><i /><i /><i /></div><div className="art-code">&lt; <strong>good code</strong> /&gt;</div><div className="code-line long" /><div className="code-line short" /><div className="code-line medium" /><div className="art-check">✓ <span>Built on principles</span></div></div><span className="art-spark">✳</span></div></div>
    <section className="tool-shortcuts" aria-label="개발 도구"><Link href="/builder"><span>＋</span><div><strong>프로젝트 지침 생성</strong><p>기술 스택과 규칙을 Markdown 지침서로</p></div><b>↗</b></Link><Link href="/templates"><span>▧</span><div><strong>상황별 요청 템플릿</strong><p>기능 추가부터 리뷰까지, 작업별 요청 작성</p></div><b>↗</b></Link></section>
    <section className="library"><div className="section-top"><h2>가이드 라이브러리 <span>{String(initialGuides.length).padStart(2, '0')}</span></h2><span role="status">{pending ? '검색 중…' : `${state.items.length}개의 가이드`}</span></div><div className="filters" role="group" aria-label="가이드 분류">{categories.map(item => <button key={item} className={`filter ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="guide-grid" aria-busy={pending}>{pending ? <div className="empty">지침을 찾고 있습니다…</div> : state.error ? <div className="empty" role="alert"><p>{state.error}</p><button className="secondary-button" onClick={() => setAttempt(x => x + 1)}>다시 시도</button></div> : state.items.length ? state.items.map(g => <Link className="guide-card" key={g.id} href={`/guides/${g.id}`}><div className="card-top"><span className="card-icon">{g.icon}</span><span className="card-category">{g.category}</span><span className="arrow">↗</span></div><h3>{g.title}</h3><p>{g.desc}</p><div className="card-bottom"><span>{g.topics}개 주제</span><span>약 {g.time}분 읽기</span></div></Link>) : <div className="empty"><strong>일치하는 지침이 없습니다.</strong><p>다른 검색어를 입력하거나 분류를 바꿔 보세요.</p></div>}</div>
    </section>
  </>;
}
