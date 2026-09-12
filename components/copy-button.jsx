'use client';
import { useState } from 'react';
import Icon from './icon.jsx';
export default function CopyButton({ text }) {
  const [message, setMessage] = useState('');
  return <div className="copy-control"><button className="copy-button" onClick={async () => { try { await navigator.clipboard.writeText(text); setMessage('복사했습니다.'); } catch { setMessage('본문을 직접 선택해 복사해 주세요.'); } }}><Icon name={message === '복사했습니다.' ? 'check' : 'copy'} />Markdown 복사</button><span className="copy-status" role="status">{message}</span></div>;
}
