import { languages, managers, tests, ruleOptions, requests } from '../options.js';
import { ApiError } from './http.js';

function object(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ApiError('JSON 객체를 입력해 주세요.');
}
function text(input, key, max, fields) {
  const value = input[key];
  if (typeof value !== 'string') { fields[key] = '문자열을 입력해 주세요.'; return ''; }
  if (value.length > max) fields[key] = `${max}자 이내로 입력해 주세요.`;
  return value.trim();
}
function choice(input, key, choices, fields) {
  if (!choices.includes(input[key])) { fields[key] = '제공된 항목 중에서 선택해 주세요.'; return ''; }
  return input[key];
}
function check(fields) { if (Object.keys(fields).length) throw new ApiError('입력 내용을 확인해 주세요.', 422, fields); }
export function validateProject(input) {
  object(input);
  const fields = {}, result = {};
  for (const key of ['name', 'stack']) result[key] = text(input, key, 200, fields);
  for (const key of ['rules', 'extra']) result[key] = text(input, key, 6000, fields);
  result.language = choice(input, 'language', languages, fields);
  result.manager = choice(input, 'manager', managers, fields);
  result.test = choice(input, 'test', tests, fields);
  if (!Array.isArray(input.checks) || input.checks.length > 5 || input.checks.some(key => typeof key !== 'string' || !Object.hasOwn(ruleOptions, key))) {
    fields.checks = '유효한 원칙을 선택해 주세요.';
    result.checks = [];
  } else result.checks = [...new Set(input.checks)];
  check(fields);
  return result;
}
export function validateRequest(input) {
  object(input);
  const fields = {}, result = {};
  result.type = choice(input, 'type', Object.keys(requests), fields);
  for (const key of ['goal', 'context', 'detail', 'constraints', 'done']) result[key] = text(input, key, 6000, fields);
  check(fields);
  return result;
}
export function filename(name) {
  const safe = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/[. ]+$/g, '').slice(0, 70);
  return `${safe || 'project'}-guidelines.md`;
}
