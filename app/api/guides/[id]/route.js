import { getGuide } from '../../../../lib/catalog.js';
import { json } from '../../../../lib/server/http.js';
export async function GET(request, { params }) {
  const guide = getGuide((await params).id);
  return guide ? json(guide) : json({ error: { message: '문서를 찾을 수 없습니다.' } }, 404);
}
