'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from './icon.jsx';
import PageToc from './page-toc.jsx';
import { steps, guideCategories as categories } from '../lib/journey.js';
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
  return <div className="docs-layout"><div className="docs-body">
    <header className="page-heading"><div className="eyebrow">시작하기</div><h1>처음부터 따라가는 개발 가이드</h1><p className="intro">아이디어를 정리하고, 화면을 만든 뒤 실제 기능을 연결하세요. 처음 만드는 사이트도 8단계로 나누면 시작할 수 있습니다.</p><div className="page-toolbar"><Link className="secondary-button" href="/guides/principles"><Icon name="book" />전체 흐름 먼저 읽기</Link><Link className="text-button" href="/builder">내 프로젝트 지침 만들기 <Icon name="arrow" /></Link></div></header>
    <section className="journey-section" id="journey"><h2>사이트를 만드는 8단계</h2><p className="section-description">위에서부터 하나씩 따라가세요. 각 단계에서 무엇을 완성하면 되는지 알려드립니다.</p><ol className="journey-grid">{steps.map(step => <li key={step.id}><Link href={`/guides/${step.id}`}><span className="step-number">{String(step.number).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.summary}</p><span className="journey-result">완성할 것 · {step.result}</span></div><Icon name="chevron" /></Link></li>)}</ol></section>
    <section className="basics-section" id="basics"><h2>기술 용어, 쉽게 이해하기</h2><p className="section-description">처음부터 모두 외울 필요는 없습니다. 어디에 쓰이는지만 알아두세요.</p><dl className="basics-grid"><div><dt>프런트엔드</dt><dd>눈에 보이고 누를 수 있는 화면입니다. 메뉴, 버튼, 입력창을 만듭니다.</dd></div><div><dt>백엔드</dt><dd>화면 뒤에서 요청을 처리합니다. 입력한 내용으로 지침을 만드는 일이 그 예입니다.</dd></div><div><dt>API</dt><dd>화면과 서버가 주고받을 내용과 형식을 정한 약속입니다.</dd></div><div><dt>기술 스펙</dt><dd>무슨 도구로 만들고, 어떤 정보를 처리할지 적은 설명서입니다.</dd></div></dl><Link className="text-button" href="/guides/tech-spec">Next.js, 데이터베이스, GitHub도 알아보기 <Icon name="arrow" /></Link></section>
    <section className="library" id="overview"><div className="section-top"><h2>가이드 둘러보기</h2><span role="status">{pending ? '검색 중…' : `${state.items.length}개의 가이드`}</span></div><p className="section-description">지금 작업에 필요한 지침부터 읽어보세요.</p>
    <div className="search-wrap"><Icon name="search" /><input id="search" type="search" value={query} onChange={e => setQuery(e.target.value)} maxLength={200} placeholder="가이드 검색…" aria-label="개발 지침 검색" /><kbd>/</kbd></div>
    <div className="filters" role="group" aria-label="가이드 분류">{categories.map(item => <button key={item} className={`filter ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="guide-grid" aria-busy={pending}>{pending ? <div className="empty">지침을 찾고 있습니다…</div> : state.error ? <div className="empty" role="alert"><p>{state.error}</p><button className="secondary-button" onClick={() => setAttempt(x => x + 1)}>다시 시도</button></div> : state.items.length ? state.items.map(g => <Link className="guide-card" key={g.id} href={`/guides/${g.id}`}><div className="card-top"><span className="card-icon">{g.icon}</span><span className="card-category">{g.category}</span><span className="arrow">↗</span></div><h3>{g.title}</h3><p>{g.desc}</p><div className="card-bottom"><span>{g.topics}개 주제</span><span>약 {g.time}분 읽기</span></div></Link>) : <div className="empty"><strong>일치하는 지침이 없습니다.</strong><p>다른 검색어를 입력하거나 분류를 바꿔 보세요.</p></div>}</div>
    </section>
    <section className="tools-section" id="tools"><h2>개발 도구</h2><p className="section-description">프로젝트의 기준을 정리하고, 작업에 맞는 요청문을 작성하세요.</p><div className="tool-shortcuts"><Link href="/builder"><Icon name="grid" size={19} /><div><strong>프로젝트 지침 생성</strong><p>환경과 규칙을 Markdown 지침서로</p></div><Icon name="chevron" /></Link><Link href="/templates"><Icon name="code" size={19} /><div><strong>상황별 요청 템플릿</strong><p>기능 추가부터 리뷰까지, 5가지 템플릿</p></div><Icon name="chevron" /></Link></div></section>
    <div className="article-callout"><Icon name="book" size={18} /><div><strong>프로젝트에 맞는 기준을 만드세요.</strong><p>지침은 출발점입니다. 팀의 규칙과 프로젝트의 제약에 맞게 적용하세요.</p></div></div>
  </div><PageToc items={[{ id: 'journey', title: '사이트를 만드는 8단계' }, { id: 'basics', title: '쉬운 기술 용어' }, { id: 'overview', title: '가이드 둘러보기' }, { id: 'tools', title: '개발 도구' }]} /></div>;
}
