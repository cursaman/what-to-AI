import './globals.css';
import Shell from '../components/shell.jsx';
import { DraftProvider } from '../components/drafts.jsx';

export const metadata = {
  title: { default: '개발 지침서 · what-to-AI', template: '%s · what-to-AI' },
  description: '기획부터 배포까지 개발 지침을 읽고, 프로젝트별 지침과 요청 템플릿을 작성하세요.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }) {
  return <html lang="ko"><body><DraftProvider><Shell>{children}</Shell></DraftProvider></body></html>;
}
