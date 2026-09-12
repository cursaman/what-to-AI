'use client';
import { useEffect, useState } from 'react';
import { useDrafts } from './drafts.jsx';
import { ruleOptions, requests, languages, managers, tests, emptyRequest } from '../lib/options.js';
import Icon from './icon.jsx';

function useGeneration(endpoint, input) {
  const signature = JSON.stringify(input);
  const [result, setResult] = useState(null), [attempt, setAttempt] = useState(0);
  const key = `${endpoint}:${signature}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 12000);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: signature, signal: controller.signal });
        const data = await response.json();
        if (active) setResult(response.ok ? { key, ...data } : { key, error: data.error || { message: '문서를 생성하지 못했습니다.' } });
      } catch (error) {
        if (active) setResult({ key, error: { message: error.name === 'AbortError' ? '응답 시간이 초과되었습니다. 다시 시도해 주세요.' : '서버에 연결하지 못했습니다. 연결을 확인하고 다시 시도해 주세요.' } });
      } finally { clearTimeout(timeout); }
    }, 350);
    return () => { active = false; clearTimeout(timer); clearTimeout(timeout); controller.abort(); };
  }, [endpoint, signature, key]);
  const current = result?.key === key;
  return { result: current ? result : null, pending: !current, retry: () => setAttempt(x => x + 1) };
}

function Field({ name, label, value, onChange, placeholder = '', multiline = false, error }) {
  const props = { id: name, name, value, onChange: e => onChange(e.target.value), placeholder, maxLength: multiline ? 6000 : 200, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${name}-error` : undefined };
  return <div className="tool-field"><label htmlFor={name}>{label}</label>{multiline ? <textarea {...props} rows={3} /> : <input {...props} />}{error ? <span id={`${name}-error`} className="field-error">{error}</span> : null}</div>;
}
function Select({ name, label, value, options, onChange, error }) {
  return <div className="tool-field"><label htmlFor={name}>{label}</label><select id={name} name={name} value={value} onChange={e => onChange(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined}>{options.map(option => <option key={option}>{option}</option>)}</select>{error ? <span className="field-error" id={`${name}-error`}>{error}</span> : null}</div>;
}
function Preview({ title, generation }) {
  const { pending, result, retry } = generation;
  const [feedback, setFeedback] = useState(null);
  const ready = !pending && !result?.error && Boolean(result?.markdown);
  const notify = message => setFeedback({ markdown: result.markdown, message });
  return <section className="tool-preview" aria-label={title}>
    <div className="preview-head"><h2><Icon name="file" />{title}</h2><span>.md</span></div>
    <p className="preview-hint">입력한 내용으로 지침을 만듭니다. 빈 항목은 기본 문구로 표시됩니다.</p>
    <p className={`generation-status ${pending ? 'is-pending' : ''}`} role="status"><span />{pending ? '입력 내용을 반영하고 있습니다…' : result?.error ? '생성하지 못했습니다.' : '최신 입력이 반영되었습니다.'}</p>
    {result?.error ? <div className="api-error" role="alert"><p>{result.error.message}</p><button type="button" className="secondary-button" onClick={retry}>다시 시도</button></div> : null}
    <pre id="tool-output" tabIndex={0} aria-busy={pending}>{pending ? '지침을 생성하고 있습니다…' : result?.markdown || '입력을 확인한 뒤 다시 시도해 주세요.'}</pre>
    <div className="tool-actions"><button type="button" className="primary-button" disabled={!ready} onClick={async () => { try { await navigator.clipboard.writeText(result.markdown); notify('복사했습니다. 개발 도구나 문서에 붙여넣으세요.'); } catch { notify('자동 복사를 사용할 수 없습니다. 미리보기 내용을 직접 선택해 복사하세요.'); } }}><Icon name="copy" />복사하기</button><button type="button" className="secondary-button" disabled={!ready} onClick={() => {
      const url = URL.createObjectURL(new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = result.filename; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Markdown 파일 다운로드를 요청했습니다.');
    }}><Icon name="download" />.md 다운로드</button></div><p className="tool-feedback" role="status">{ready && feedback?.markdown === result.markdown ? feedback.message : ''}</p>
  </section>;
}

export function ProjectGenerator() {
  const { project, setProject } = useDrafts();
  const generation = useGeneration('/api/guidelines', project);
  const errors = generation.result?.error?.fields || {};
  const update = key => value => setProject(current => ({ ...current, [key]: value }));
  return <><div className="eyebrow">개발 도구</div><h1 className="article-title">프로젝트 지침 생성</h1><p className="intro">환경과 규칙을 정리하고 프로젝트에 바로 사용할 지침서를 만드세요.</p><p className="tool-privacy">입력은 이 사이트의 서버에서 처리하며 저장하지 않습니다. 외부 AI로 보내지 않으며, 새로고침하면 초기화됩니다.</p>
    <div className="tool-layout"><form className="tool-form" onSubmit={e => e.preventDefault()}><h2>프로젝트 설정</h2><Field name="name" label="프로젝트 이름" value={project.name} onChange={update('name')} placeholder="예: what-to-AI" error={errors.name} /><Field name="stack" label="기술 스택" value={project.stack} onChange={update('stack')} placeholder="예: Next.js, React, PostgreSQL" error={errors.stack} /><div className="field-pair"><Select name="language" label="주요 언어" value={project.language} options={languages} onChange={update('language')} error={errors.language} /><Select name="manager" label="패키지 관리자" value={project.manager} options={managers} onChange={update('manager')} error={errors.manager} /></div>
      <fieldset><legend>함께 적용할 원칙</legend>{Object.entries(ruleOptions).map(([key, [label]]) => <label className="check-field" key={key}><input type="checkbox" checked={project.checks.includes(key)} onChange={e => { const checked = e.target.checked; setProject(current => ({ ...current, checks: checked ? [...current.checks, key] : current.checks.filter(item => item !== key) })); }} /><span>{label}</span></label>)}{errors.checks ? <span className="field-error">{errors.checks}</span> : null}</fieldset>
      <Field name="rules" label="코드 규칙" value={project.rules} onChange={update('rules')} placeholder="예: 함수는 camelCase, 들여쓰기 2칸" multiline error={errors.rules} /><Select name="test" label="기본 검증 방식" value={project.test} options={tests} onChange={update('test')} error={errors.test} /><Field name="extra" label="추가 제약" value={project.extra} onChange={update('extra')} placeholder="예: 의존성 추가 전 이유 설명, 테스트 명령 npm test" multiline error={errors.extra} />
    </form><Preview title="지침서 미리보기" generation={generation} /></div></>;
}

export function RequestGenerator() {
  const { drafts, setDrafts, type, setType } = useDrafts();
  const item = requests[type], data = drafts[type] || emptyRequest;
  const generation = useGeneration('/api/requests', { type, ...data });
  const errors = generation.result?.error?.fields || {};
  const update = key => value => setDrafts(current => ({ ...current, [type]: { ...(current[type] || emptyRequest), [key]: value } }));
  return <><div className="eyebrow">개발 도구</div><h1 className="article-title">상황별 요청 템플릿</h1><p className="intro">작업을 선택하고 맥락을 채워 복사하세요. 대괄호 항목은 사용 전에 완성해 주세요.</p><div className="template-tabs" role="group" aria-label="작업 유형">{Object.entries(requests).map(([key, item]) => <button type="button" key={key} aria-pressed={type === key} className={`filter ${type === key ? 'selected' : ''}`} onClick={() => setType(key)}>{item.title}</button>)}</div>
    <div className="tool-layout"><form className="tool-form" onSubmit={e => e.preventDefault()}><h2>{item.title}</h2><p className="form-summary">{item.summary}</p><Field name="goal" label={item.goal} value={data.goal} onChange={update('goal')} placeholder={item.placeholder} multiline error={errors.goal} /><Field name="context" label="현재 맥락과 관련 파일" value={data.context} onChange={update('context')} placeholder="예: app/page.jsx, components/library.jsx / 현재는 제목만 검색함" multiline error={errors.context} /><Field name="detail" label={item.detail} value={data.detail} onChange={update('detail')} placeholder={item.detailPlaceholder} multiline error={errors.detail} /><Field name="constraints" label="제약 조건" value={data.constraints} onChange={update('constraints')} placeholder="예: 기존 의존성만 사용" multiline error={errors.constraints} /><Field name="done" label="완료 조건" value={data.done} onChange={update('done')} placeholder="예: 제목 또는 본문이 일치하는 문서를 표시" multiline error={errors.done} /><p className="tool-privacy">입력은 이 사이트의 서버에서 처리하며 저장하지 않습니다. 작업별 초안은 이 탭에서 유지되고 새로고침하면 초기화됩니다.</p></form><Preview title="요청 미리보기" generation={generation} /></div></>;
}
