  export const ruleOptions = {
    scope: ['작은 변경 유지', '한 번의 변경에는 하나의 목적만 담고, 관련 없는 리팩터링은 분리합니다.'],
    security: ['비밀 값 보호', '비밀 키와 개인정보를 코드, 로그, 클라이언트 번들에 포함하지 않습니다.'],
    accessibility: ['접근성 확인', '키보드 조작, 입력 요소의 이름, 모바일 화면과 오류 상태를 확인합니다.'],
    dependencies: ['의존성 추가 최소화', '기존 도구로 해결할 수 있는지 확인하고 새 의존성이 필요하면 이유를 설명합니다.'],
    docs: ['문서 함께 갱신', '사용 방법이나 동작이 바뀌면 관련 문서와 예시를 함께 갱신합니다.']
  };
  export const requests = {
    feature: { title: '기능 추가', summary: '사용자 행동과 완료 조건을 중심으로 새 기능을 요청하세요.', goal: '추가할 기능', placeholder: '예: 문서 제목과 본문을 검색하는 기능', detail: '기대하는 사용 흐름', detailPlaceholder: '예: 검색어 입력 → 일치하는 문서 표시 → 문서 열기', instruction: '기존 구조와 유사한 기능을 확인한 뒤 변경 범위를 정리하세요. 정상 동작, 빈 결과, 오류 상황을 고려해 구현하고 핵심 사용자 흐름을 검증하세요.' },
    bug: { title: '버그 수정', summary: '재현 순서와 기대 결과를 전달해 원인부터 확인하세요.', goal: '발생한 문제', placeholder: '예: 검색어를 지워도 전체 문서가 표시되지 않음', detail: '재현 순서와 실제 결과', detailPlaceholder: '예: 검색어 입력 → 결과 확인 → 검색어 삭제 → 목록이 빈 상태로 유지됨', instruction: '재현 정보와 관련 코드를 확인해 원인을 좁히세요. 원인에 해당하는 최소 범위를 수정하고 같은 재현 조건에서 수정 결과와 주변 기능을 검증하세요. 재현할 수 없으면 부족한 정보를 명시하세요.' },
    refactor: { title: '리팩터링', summary: '유지할 동작을 명시하고 코드 구조를 개선하세요.', goal: '개선할 구조', placeholder: '예: 여러 화면에 중복된 검색 로직 분리', detail: '반드시 유지할 동작', detailPlaceholder: '예: 검색 결과 순서, URL 형식, 기존 키보드 조작', instruction: '현재 동작과 의존 관계를 먼저 확인하세요. 외부 동작과 공개 인터페이스를 유지하면서 구조를 개선하고, 변경 전후의 동작이 같음을 검증하세요. 기능 추가는 별도 제안으로 남기세요.' },
    review: { title: '코드 리뷰', summary: '수정 없이 문제 조건과 영향을 구체적으로 검토하세요.', goal: '리뷰할 변경', placeholder: '예: 검색과 분류 필터를 추가한 변경 사항', detail: '중점 검토 항목', detailPlaceholder: '예: 잘못된 검색 결과, 키보드 사용, 기존 탐색 동작', instruction: '코드를 수정하지 말고 변경 사항과 관련 호출 경로를 검토하세요. 확인된 문제를 영향도 순으로 정리하고 파일 위치, 발생 조건, 영향과 수정 제안을 제시하세요. 확인된 결함과 선택적인 개선 제안을 구분하고 발견한 문제가 없으면 그대로 알려주세요.' },
    release: { title: '배포 점검', summary: '배포 대상과 검증 기준을 정리해 누락을 줄이세요.', goal: '점검할 배포 대상', placeholder: '예: Vercel 미리보기에 올릴 개발 지침서', detail: '환경과 주요 확인 흐름', detailPlaceholder: '예: 정적 빌드, 루트 폴더 what-to-AI, 검색과 문서 직접 링크', instruction: '빌드 설정, 필요한 환경 변수 이름, 배포 경로와 정적 파일을 확인하세요. 빌드를 실행하고 핵심 흐름과 복구 방법을 점검하세요. 실제 배포나 운영 설정 변경은 수행하지 말고 점검 결과를 정리하세요.' }
  };

export const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', '기타 (기술 스택에 기재)'];
export const managers = ['npm', 'pnpm', 'yarn', 'bun', 'pip', 'uv', '없음 / 기존 설정 따름'];
export const tests = ['주요 사용자 흐름을 브라우저에서 검증', '기존 자동화 테스트와 빌드를 실행', '단위 테스트와 핵심 사용자 흐름을 함께 검증', '프로젝트 문서에 정의된 검증 절차를 적용'];
export const defaultProject = { name: '', stack: 'Next.js / React', language: 'JavaScript', manager: 'npm', rules: '', test: tests[0], extra: '', checks: ['scope', 'security', 'accessibility'] };
export const emptyRequest = {goal:'',context:'',detail:'',constraints:'',done:''};
