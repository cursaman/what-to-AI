export class ApiError extends Error {
  constructor(message, status = 400, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

const MAX_BYTES = 96 * 1024;
export async function readJson(request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new ApiError('application/json 형식으로 요청해 주세요.', 415);
  }
  // Limit the stream itself, including requests without a Content-Length header.
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new ApiError('요청이 너무 큽니다.', 413);
  if (!request.body) throw new ApiError('요청 본문이 필요합니다.');
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_BYTES) { await reader.cancel(); throw new ApiError('요청이 너무 큽니다.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new ApiError('올바른 JSON을 입력해 주세요.'); }
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export function failure(error) {
  if (error instanceof ApiError) return json({ error: { message: error.message, fields: error.fields } }, error.status);
  // Do not log submitted project content or expose internal exception details.
  console.error('API request failed:', error?.name || 'Error');
  return json({ error: { message: '처리하지 못했습니다. 잠시 후 다시 시도해 주세요.', fields: {} } }, 500);
}

export function markdownResult(request, markdown, filename) {
  if (new URL(request.url).searchParams.get('format') === 'markdown') {
    return new Response(markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Content-Disposition': `attachment; filename="document.md"; filename*=UTF-8''${encodeURIComponent(filename)}`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
  return json({ markdown, filename });
}
