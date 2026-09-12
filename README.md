# what-to-AI

Next.js App Router 기반 한국어 개발 지침서. React 화면과 Node.js Route Handler를 사용하며, 서버에서 입력을 검증하고 Markdown 지침과 요청문을 생성합니다.

## 실행

Node.js 20.9 이상에서 실행합니다.

```sh
npm ci
npm run dev
```

개발 주소: http://127.0.0.1:3000

```sh
npm test
npm run build
npm start
```

`npm start`는 성공한 프로덕션 빌드가 필요합니다. 인증서 오류가 있는 Windows 환경에서는 검증을 끄지 말고 Node.js의 `--use-system-ca` 옵션 등으로 조직의 신뢰 인증서를 사용하세요.

## 화면

- `/`: 문서 검색과 분류 필터
- `/guides/[id]`: 서버에서 렌더링하는 7개 가이드, 목차와 복사
- `/builder`: 프로젝트별 지침 생성
- `/templates`: 기능 추가·버그 수정·리팩터링·코드 리뷰·배포 점검 요청 작성

기존 `/#builder`, `/#templates`, `/#planning` 링크도 새 주소로 이동합니다. 초안은 클라이언트 Context에서 화면 이동 중 유지되며 새로고침하면 초기화됩니다.

## 서버 API

| 메서드 | 경로 | 기능 |
| --- | --- | --- |
| GET | `/api/guides?q=검색어&category=분류` | 제목·설명·본문 검색과 분류 필터 |
| GET | `/api/guides/[id]` | 본문 조회, 없는 문서 404 |
| GET | `/api/templates` | 요청 템플릿 5종 조회 |
| POST | `/api/guidelines` | 프로젝트 입력 검증 후 지침 생성 |
| POST | `/api/requests` | 작업 유형과 입력 검증 후 요청문 생성 |

POST 요청은 `Content-Type: application/json`을 사용합니다. 정상 응답은 `{ "markdown": "...", "filename": "...md" }`입니다. POST 경로에 `?format=markdown`을 붙이면 파일 첨부 헤더가 있는 UTF-8 Markdown 응답을 반환합니다. UI는 검증된 JSON 응답으로 복사·다운로드를 제공합니다.

프로젝트 요청 예시:

```json
{
  "name": "what-to-AI",
  "stack": "Next.js / React",
  "language": "JavaScript",
  "manager": "npm",
  "checks": ["scope", "security", "accessibility"],
  "rules": "기존 코드 규칙을 유지합니다.",
  "test": "기존 자동화 테스트와 빌드를 실행",
  "extra": ""
}
```

요청문 예시:

```json
{
  "type": "bug",
  "goal": "검색어 삭제 후 전체 목록이 표시되지 않는 문제 수정",
  "context": "components/library.jsx",
  "detail": "검색어 입력 → 삭제 → 빈 목록 유지",
  "constraints": "기존 UI 유지",
  "done": "검색어 삭제 시 전체 가이드 표시"
}
```

선택 항목은 `lib/options.js`에 정의되어 있습니다. 요청 유형은 `feature`, `bug`, `refactor`, `review`, `release`입니다. 빈 문자열에는 기본 안내 문구를 적용합니다. 이름·스택은 200자, 긴 텍스트는 각 6,000자, 요청 본문은 96 KiB까지 허용합니다.

오류 응답은 `{ "error": { "message": "...", "fields": { "필드": "오류 설명" } } }` 형태입니다. 잘못된 JSON은 400, 초과 크기는 413, 지원하지 않는 Content-Type은 415, 필드 검증 실패는 422를 반환합니다. 생성 응답은 `Cache-Control: no-store`를 사용합니다. 생성 실패 또는 갱신 중에는 복사·다운로드가 비활성화되어 이전 결과의 사용을 방지합니다.

## 구조

- `app/`: 레이아웃, 페이지, 오류 화면, API Route Handler
- `components/`: React 검색·탐색·작성 UI, 초안 Context
- `lib/guides.js`: 문서 원문
- `lib/options.js`: 폼 선택 항목과 요청 유형
- `lib/server/`: 검증, 본문 크기 제한, 문서 생성, API 응답
- `tests/api.test.js`: 정상·오류·요청 격리·다운로드 검증
- `public/`: 파비콘

외부 AI API, 계정, 데이터베이스는 사용하지 않습니다. 생성은 서버의 규칙 기반 조합이며 입력은 애플리케이션에서 저장하거나 로그로 남기지 않습니다. 로그인, 영구 보관, 사용자별 CRUD는 포함되지 않습니다.

## Vercel

Root Directory를 이 프로젝트 폴더로 지정하세요. 이 폴더 자체가 저장소 루트라면 `.`입니다. Framework Preset은 **Next.js**, Build Command는 `npm run build`입니다. 이전 정적 사이트의 `dist` Output Directory 재정의는 제거하고 Next.js 기본값을 사용하세요. API를 포함하므로 정적 export로 배포하지 않습니다. 별도 환경 변수는 필요하지 않습니다.

CLI에서는 `vercel`로 미리보기, 확인 후 `vercel --prod`로 배포할 수 있습니다. 코드 변경만으로 GitHub 푸시나 배포가 실행되지는 않습니다.

## 디자인과 탐색

Fumadocs 레퍼런스의 회색 문서 레이아웃과 파란색 강조를 바탕으로 홈·문서·작성 화면을 구성합니다. Fumadocs 패키지를 설치한 것은 아니며 기존 Next.js 컴포넌트를 사용합니다.

- 모든 화면에서 사이드바의 문서 검색 또는 `Ctrl/Cmd + K`로 검색창을 엽니다. `Esc`로 닫고 `Tab`과 `Enter`로 검색 결과를 선택할 수 있습니다.
- 문서 우측 목차는 현재 읽고 있는 섹션을 표시합니다.
- 사이드바 하단에서 밝은·어두운 테마를 전환합니다. 테마 선택만 브라우저에 저장하며, 작성 초안의 저장 방식은 그대로입니다.
- 모바일에서는 상단 메뉴와 검색 버튼을 사용합니다.
