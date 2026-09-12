import { buildRequest } from '../../../lib/server/generate.js';
import { readJson, failure, markdownResult } from '../../../lib/server/http.js';
import { validateRequest } from '../../../lib/server/validate.js';
export const runtime = 'nodejs';
export async function POST(request) {
  try {
    const data = validateRequest(await readJson(request));
    return markdownResult(request, buildRequest(data.type, data), `${data.type}-request.md`);
  } catch (error) { return failure(error); }
}
