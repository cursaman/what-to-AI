import {ruleOptions,requests} from '../options.js';
  const value = (text, fallback) => text.trim() || fallback;
  export function buildGuideline(data) {
    return `# ${value(data.name, '내 프로젝트')} 개발 지침\n\n## 프로젝트 환경\n- 기술 스택: ${value(data.stack, '기존 프로젝트 설정 확인')}\n- 언어: ${data.language}\n- 패키지 관리자: ${data.manager}\n\n## 작업 방식\n- 구현 전에 관련 코드와 프로젝트 문서를 읽고 변경 범위와 완료 조건을 정리합니다.\n- 기존 구조와 규칙을 우선 적용하고 불확실한 내용은 확인된 사실과 구분합니다.\n${data.checks.filter(key => ruleOptions[key]).map(key => '- ' + ruleOptions[key][1]).join('\n')}\n\n## 코드 규칙\n${value(data.rules, '기존 프로젝트의 이름 짓기, 포맷, 폴더 구조와 오류 처리 규칙을 따릅니다.')}\n\n## 검증 기준\n${data.test}\n- 변경의 영향에 맞는 검증을 수행하고 실제 결과를 기록합니다.\n- 실행하지 못한 검증은 이유와 함께 명시합니다.\n\n## 추가 제약\n${value(data.extra, '추가 제약 없음. 작업 중 새로운 제약을 발견하면 먼저 공유합니다.')}\n\n## 작업 완료 보고\n- 변경 내용과 이유\n- 실제 수행한 검증과 결과\n- 남은 제약 및 확인하지 못한 부분\n`;
  }
  export function buildRequest(type, data) {
    const item = requests[type];
    return `# ${item.title} 요청\n\n## ${item.goal}\n${value(data.goal, '[' + item.goal + ' 입력]')}\n\n## 현재 맥락과 관련 파일\n${value(data.context, '[현재 동작, 관련 파일, 기술 스택 입력]')}\n\n## ${item.detail}\n${value(data.detail, '[' + item.detail + ' 입력]')}\n\n## 제약 조건\n${value(data.constraints, '기존 프로젝트의 규칙을 따르고 관련 없는 파일은 변경하지 마세요.')}\n\n## 완료 조건\n${value(data.done, '[직접 확인할 수 있는 기대 결과 입력]')}\n\n## 진행 방식\n${item.instruction}\n\n실제로 확인한 내용과 추측을 구분하고, 수행한 검증과 확인하지 못한 부분을 함께 알려주세요.\n`;
  }
