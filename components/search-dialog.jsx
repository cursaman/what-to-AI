'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './icon.jsx';

export default function SearchDialog({ onClose }) {
  const dialog = useRef(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState({ items: [], query: null });
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/guides?${new URLSearchParams({ q: query })}`, { signal: controller.signal });
        if (!response.ok) throw new Error('search');
        const data = await response.json();
        if (active) setResult({ items: data.items, query });
      } catch { if (active) setResult({ items: [], query, error: true }); }
      finally { clearTimeout(timeout); }
    }, 180);
    return () => { active = false; clearTimeout(timer); clearTimeout(timeout); controller.abort(); };
  }, [query]);
  const loading = result.query !== query;
  return <dialog ref={dialog} className="search-dialog" aria-labelledby="dialog-search-title" onCancel={onClose} onClick={e => { if (e.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <div className="dialog-search-bar"><Icon name="search" size={20} /><label className="sr-only" htmlFor="dialog-search" id="dialog-search-title">문서 검색</label><input id="dialog-search" autoFocus value={query} maxLength={200} onChange={e => setQuery(e.target.value)} placeholder="문서 제목이나 내용을 검색하세요…" /><button className="icon-button" onClick={onClose} aria-label="검색 닫기"><Icon name="close" /></button></div>
    <div className="dialog-results"><p className="dialog-label" role="status">{loading ? '검색 중…' : result.error ? '검색에 연결하지 못했습니다. 잠시 후 검색어를 다시 입력해 주세요.' : query ? `${result.items.length}개의 검색 결과` : '모든 가이드'}</p>{!loading && !result.error ? result.items.map(g => <Link key={g.id} href={`/guides/${g.id}`} onClick={onClose}><Icon name="file" /><div><strong>{g.title}</strong><p>{g.desc}</p></div><Icon name="chevron" /></Link>) : null}{!loading && !result.error && !result.items.length ? <p className="dialog-empty">일치하는 문서가 없습니다. 다른 검색어로 찾아보세요.</p> : null}</div>
    <div className="dialog-footer"><span><kbd>Tab</kbd> 결과 이동 <kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></div>
  </dialog>;
}
