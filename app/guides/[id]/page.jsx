import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '../../../lib/guides.js';
import { getGuide } from '../../../lib/catalog.js';
import CopyButton from '../../../components/copy-button.jsx';
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }) { const g = getGuide((await params).id); return { title: g?.title || '문서를 찾을 수 없습니다', description: g?.desc }; }
export default async function GuidePage({ params }) {
  const guide = getGuide((await params).id);
  if (!guide) notFound();
  const next = guides[guides.indexOf(guide) + 1];
  const markdown = guide.template || `# ${guide.title}\n\n${guide.sections.map(s => `## ${s[0]}\n${s[1]}\n${s[2].map(t => '- ' + t).join('\n')}`).join('\n\n')}`;
  return <><Link href="/" className="back-link">← 가이드 라이브러리</Link><div className="article-layout"><article><div className="eyebrow">{guide.category}</div><h1 className="article-title">{guide.title}<span className="lime-period">.</span></h1><p className="intro">{guide.desc}</p><div className="article-meta"><span>{guide.sections.length}개 주제 · 약 {guide.time}분 읽기</span><CopyButton text={markdown} /></div>{guide.sections.map(([title, paragraph, bullets], index) => <section className="article-section" id={`section-${index}`} key={title}><span className="section-number">0{index + 1}</span><h2>{title}</h2><p>{paragraph}</p>{bullets.length ? <ul>{bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}{guide.template && index === 2 ? <pre>{guide.template}</pre> : null}</section>)}<div className="article-callout"><strong>프로젝트에 맞게 적용하세요.</strong><p>이 지침은 출발점입니다. 팀의 규칙과 프로젝트의 제약에 맞춰 구체적인 기준을 정하세요.</p></div>{next ? <Link className="next-guide" href={`/guides/${next.id}`}><span>다음 가이드<strong>{next.title}</strong></span><span>→</span></Link> : <Link className="next-guide" href="/">가이드 라이브러리로 돌아가기 <span>→</span></Link>}</article><aside className="toc"><p>이 페이지에서</p>{guide.sections.map(([title], index) => <a href={`#section-${index}`} key={title}>{title}</a>)}<div className="toc-note">작은 기준이 모여<br />좋은 개발이 됩니다.</div></aside></div></>;
}
