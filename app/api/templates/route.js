import { requests } from '../../../lib/options.js';
import { json } from '../../../lib/server/http.js';
export async function GET() { return json({ items: Object.entries(requests).map(([id, item]) => ({ id, ...item })) }); }
