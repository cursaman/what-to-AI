import { buildGuideline } from '../../../lib/server/generate.js';
import { readJson, failure, markdownResult } from '../../../lib/server/http.js';
import { validateProject, filename } from '../../../lib/server/validate.js';
export const runtime = 'nodejs';
export async function POST(request) {
  try {
    const project = validateProject(await readJson(request));
    return markdownResult(request, buildGuideline(project), filename(project.name));
  } catch (error) { return failure(error); }
}
