import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '../../../lib/guides.js';
import { getGuide, guideMarkdown } from '../../../lib/catalog.js';
import CopyButton from '../../../components/copy-button.jsx';
import PageToc from '../../../components/page-toc.jsx';
import Icon from '../../../components/icon.jsx';
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }) { const g = getGuide((await params).id); return { title: g?.title || '문서를 찾을 수 없습니다', description: g?.desc }; }
export default async function GuidePage({ params }) {
  const guide = getGuide((await params).id);
  if (!guide) notFound();
  const position = guides.indexOf(guide);
  const previous = guides[position - 1], next = guides[position + 1];
  const markdown = guideMarkdown(guide);
  return <div className="docs-layout article-layout"><article className="docs-body">
    <header className="page-heading"><div className="eyebrow">{guide.step ? `${String(guide.step).padStart(2, '0')} / 08 · ` : ''}{guide.category}</div><h1>{guide.title}</h1><p className="intro">{guide.desc}</p><div className="article-meta"><CopyButton text={markdown} /><span>{guide.sections.length}개 주제 <span className="meta-dot">·</span> 약 {guide.time}분 읽기</span></div></header>
    {guide.result ? <div className="step-result"><span>이 단계에서 완성할 것</span><strong>{guide.result}</strong></div> : null}
    {guide.sections.map(([title, paragraph, bullets], index) => <section className="article-section" id={`section-${index}`} key={title}><h2><a className="heading-anchor" href={`#section-${index}`}>{title}<span aria-hidden="true">#</span></a></h2><p>{paragraph}</p>{bullets.length ? <ul className="guideline-list">{bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}{index === 0 && guide.table ? <div className="table-scroll" role="region" aria-label={guide.table.caption} tabIndex={0}><table className="guide-table"><caption>{guide.table.caption}</caption><thead><tr>{guide.table.headers.map(text => <th key={text} scope="col">{text}</th>)}</tr></thead><tbody>{guide.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div> : null}{guide.template && index === guide.sections.length - 1 ? <div className="code-panel"><div className="code-panel-label"><Icon name="code" /><span>AI에게 이렇게 요청해 보세요</span></div><pre>{guide.template}</pre></div> : null}</section>)}
    <div className="article-callout"><Icon name="book" size={18} /><div><strong>프로젝트에 맞게 적용하세요.</strong><p>이 지침은 출발점입니다. 팀의 규칙과 프로젝트의 제약에 맞춰 구체적인 기준을 정하세요.</p></div></div>
    <div className="article-bottom"><span>개발 지침서</span><Link href="/">모든 가이드 보기 <Icon name="arrow" /></Link></div>
    <nav className="article-pagination" aria-label="이전과 다음 가이드"><Link href={previous ? `/guides/${previous.id}` : '/'}><span>‹ 이전</span><strong>{previous?.title || '가이드 둘러보기'}</strong><p>{previous ? previous.desc : '개발의 모든 단계를 한곳에서'}</p></Link><Link href={next ? `/guides/${next.id}` : '/'}><span>다음 ›</span><strong>{next?.title || '가이드 둘러보기'}</strong><p>{next ? next.desc : '필요한 개발 지침을 찾아보세요.'}</p></Link></nav>
  </article><PageToc items={guide.sections.map(([title], index) => ({ id: `section-${index}`, title }))} /></div>;
}
