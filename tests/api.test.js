import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as guideline } from '../app/api/guidelines/route.js';
import { POST as requestPrompt } from '../app/api/requests/route.js';
import { GET as search } from '../app/api/guides/route.js';
import { GET as detail } from '../app/api/guides/[id]/route.js';
import { defaultProject, requests, emptyRequest } from '../lib/options.js';

const post = (path, data, headers = {}) => new Request('http://localhost' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data) });
test('guideline API validates and reflects project input without retaining another request', async () => {
  const response = await guideline(post('/api/guidelines', { ...defaultProject, name: '테스트 프로젝트', rules: '<script>alert(1)</script>', checks: ['dependencies'] }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.match(data.markdown, /테스트 프로젝트 개발 지침/);
  assert.match(data.markdown, /<script>alert\(1\)<\/script>/);
  assert.match(data.markdown, /새 의존성이 필요하면/);
  assert.doesNotMatch(data.markdown, /키보드 조작/);
  assert.match(data.filename, /\.md$/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const second = await (await guideline(post('/api/guidelines', defaultProject))).json();
  assert.doesNotMatch(second.markdown, /테스트 프로젝트|alert/);
});
test('download API returns UTF-8 Markdown and safe attachment filename', async () => {
  const response = await guideline(post('/api/guidelines?format=markdown', { ...defaultProject, name: '한글\r\n"/이름' }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/markdown/);
  assert.match(response.headers.get('content-disposition'), /filename\*=UTF-8''/);
  assert.doesNotMatch(response.headers.get('content-disposition'), /[\r\n]/);
  assert.match(await response.text(), /개발 지침/);
});
test('rejects invalid JSON, content type, and oversized requests', async () => {
  const invalid = new Request('http://localhost/api/guidelines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal((await guideline(invalid)).status, 400);
  assert.equal((await guideline(post('/api/guidelines', {}, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await guideline(post('/api/guidelines', { extra: '가'.repeat(40000) }))).status, 413);
});
test('rejects wrong types, excessive field lengths and prototype names', async () => {
  for (const input of [null, [], 1]) assert.equal((await guideline(post('/api/guidelines', input))).status, 400);
  for (const patch of [{ name: 123 }, { rules: 'x'.repeat(6001) }, { checks: ['constructor'] }, { checks: ['__proto__'] }, { language: 'unlisted' }]) {
    const response = await guideline(post('/api/guidelines', { ...defaultProject, ...patch }));
    assert.equal(response.status, 422);
    assert.ok(Object.keys((await response.json()).error.fields).length);
  }
  assert.equal((await requestPrompt(post('/api/requests', { ...emptyRequest, type: 'constructor' }))).status, 422);
});
test('all five prompt types produce their own instructions and supplied context', async () => {
  for (const type of Object.keys(requests)) {
    const response = await requestPrompt(post('/api/requests', { ...emptyRequest, type, goal: '사용자 목표', context: '관련 파일', done: '확인 결과' }));
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.ok(data.markdown.includes(requests[type].instruction));
    assert.match(data.markdown, /사용자 목표/);
    assert.match(data.markdown, /관련 파일/);
    assert.match(data.markdown, /확인 결과/);
  }
});
test('guide search covers content and category; missing guides return 404', async () => {
  const all = await (await search(new Request('http://localhost/api/guides'))).json();
  assert.equal(all.total, 12);
  const result = await (await search(new Request('http://localhost/api/guides?' + new URLSearchParams({ q: '민감한 데이터', category: 'AI와 함께 개발하기' })))).json();
  assert.ok(result.items.some(g => g.id === 'prompt'));
  assert.equal((await search(new Request('http://localhost/api/guides?category=invalid'))).status, 422);
  assert.equal((await detail(new Request('http://localhost'), { params: Promise.resolve({ id: 'unknown' }) })).status, 404);
  const found = await detail(new Request('http://localhost'), { params: Promise.resolve({ id: 'principles' }) });
  assert.equal((await found.json()).sections.length, 3);
});

test('technical glossary is searchable and copied with the full guide', async () => {
  const { getGuide, listGuides, guideMarkdown } = await import('../lib/catalog.js');
  assert.ok(listGuides('데이터베이스', '개발 8단계').some(g => g.id === 'tech-spec'));
  const guide = getGuide('tech-spec'), markdown = guideMarkdown(guide);
  assert.ok(markdown.includes('| 항목 | 쉬운 뜻'));
  assert.ok(markdown.includes(guide.template));
  assert.ok(markdown.includes(guide.sections[0][1]));
});
