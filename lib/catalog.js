import { guides } from './guides.js';
import { guideCategories } from './journey.js';
export const categories = guideCategories;
export function listGuides(query = '', category = '전체') {
  const q = query.trim().toLowerCase();
  return guides.filter(g => (category === '전체' || g.category === category) && [g.title, g.desc, g.result, g.sections.flat(2).join(' '), g.table?.rows.flat().join(' '), g.template].join(' ').toLowerCase().includes(q)).map(({ sections, template, table, ...g }) => ({ ...g, topics: sections.length }));
}
export function getGuide(id) { return guides.find(g => g.id === id); }
export function guideMarkdown(guide) {
  const parts = [`# ${guide.title}`, guide.desc];
  if (guide.result) parts.push(`완성할 것: ${guide.result}`);
  guide.sections.forEach(([title, paragraph, bullets], index) => {
    parts.push(`## ${title}`, paragraph, bullets.map(text => '- ' + text).join('\n'));
    if (index === 0 && guide.table) {
      const { caption, headers, rows } = guide.table;
      const row = cells => '| ' + cells.map(cell => cell.replaceAll('|', '\\|')).join(' | ') + ' |';
      parts.push(caption, [row(headers), row(headers.map(() => '---')), ...rows.map(row)].join('\n'));
    }
  });
  if (guide.template) parts.push('## AI에게 이렇게 요청해 보세요', '```text\n' + guide.template + '\n```');
  return parts.filter(Boolean).join('\n\n');
}
