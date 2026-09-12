import { guides } from './guides.js';
export const categories = ['전체', '시작하기', '개발 워크플로', 'AI와 함께 개발하기'];
export function listGuides(query = '', category = '전체') {
  const q = query.trim().toLowerCase();
  return guides.filter(g => (category === '전체' || g.category === category) && `${g.title} ${g.desc} ${g.sections.flat(2).join(' ')}`.toLowerCase().includes(q)).map(({ sections, template, ...g }) => ({ ...g, topics: sections.length }));
}
export function getGuide(id) { return guides.find(g => g.id === id); }
