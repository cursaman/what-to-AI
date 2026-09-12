import './globals.css';
import Shell from '../components/shell.jsx';
import { DraftProvider } from '../components/drafts.jsx';

export const metadata = {
  title: { default: '처음부터 따라가는 개발 가이드 · what-to-AI', template: '%s · what-to-AI' },
  description: '기획, 콘텐츠, 기술 스펙부터 화면 개발과 백엔드, 배포까지. 초보자를 위한 개발 8단계와 쉬운 예시를 따라가세요.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }) {
  return <html lang="ko"><body><DraftProvider><Shell>{children}</Shell></DraftProvider></body></html>;
}
