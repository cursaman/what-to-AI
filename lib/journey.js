export const steps = [
  { id: 'planning', title: '무엇을 만들지 정하기', summary: '누가, 왜 사용할지와 꼭 필요한 기능을 정합니다.', result: '한 장짜리 기획서' },
  { id: 'content', title: '들어갈 내용 준비하기', summary: '메뉴 이름, 안내 문구, 실제로 보여줄 글을 준비합니다.', result: '콘텐츠 초안과 예시 데이터' },
  { id: 'screens', title: '화면과 기능 정하기', summary: '어떤 화면이 있고, 버튼을 누르면 무엇이 일어날지 정합니다.', result: '화면 목록과 이용 순서' },
  { id: 'tech-spec', title: '만들 방법 정하기', summary: '개발 도구와 저장할 정보, 화면과 서버의 약속을 정합니다.', result: '쉬운 기술 명세서' },
  { id: 'schedule', title: '작업 순서 정하기', summary: '작업을 작게 나누고, 끝났다고 판단할 기준을 붙입니다.', result: '개발 계획표' },
  { id: 'code', title: '보이는 화면 먼저 만들기', summary: '예시 내용을 넣고 버튼과 화면 이동을 직접 확인합니다.', result: '눌러볼 수 있는 프런트엔드' },
  { id: 'backend', title: '실제 기능 연결하기', summary: '화면 뒤에서 내용을 처리하고, 필요한 경우 저장합니다.', result: '실제로 동작하는 핵심 기능' },
  { id: 'deploy', title: '확인하고 공개하기', summary: '전체 이용 과정을 확인하고 인터넷에 사이트를 올립니다.', result: '접속 가능한 사이트와 점검 기록' },
].map((step, index) => ({ ...step, number: index + 1 }));

export const guideCategories = ['전체', '처음 시작하기', '개발 8단계', 'AI와 함께 개발하기'];
