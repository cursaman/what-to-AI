import Link from 'next/link';
export default function NotFound() { return <div className="empty"><h1 className="article-title">문서를 찾을 수 없습니다.</h1><p>주소를 확인하거나 라이브러리에서 필요한 지침을 찾아보세요.</p><Link className="secondary-button" href="/">가이드 라이브러리</Link></div>; }
