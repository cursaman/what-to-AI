import { listGuides, categories } from '../../../lib/catalog.js';
import { json } from '../../../lib/server/http.js';
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const q = params.get('q') || '', category = params.get('category') || '전체';
  if (q.length > 200 || !categories.includes(category)) return json({ error: { message: '검색어는 200자 이내로 입력하고 유효한 분류를 선택해 주세요.' } }, 422);
  const items = listGuides(q, category);
  return json({ items, total: items.length });
}
