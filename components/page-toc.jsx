'use client';
import { useEffect, useState } from 'react';
import Icon from './icon.jsx';

export default function PageToc({ items }) {
  const [active, setActive] = useState(items[0]?.id);
  const ids = items.map(item => item.id).join(',');
  useEffect(() => {
    const sectionIds = ids.split(',');
    const update = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 150) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [ids]);
  return <aside className="toc" aria-label="이 페이지의 목차"><p><Icon name="list" />이 페이지에서</p><nav>{items.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'toc-active' : ''} aria-current={active === item.id ? 'location' : undefined} onClick={() => setActive(item.id)}>{item.title}</a>)}</nav></aside>;
}
