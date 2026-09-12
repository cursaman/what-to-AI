'use client';
import { useState } from 'react';
export default function CopyButton({ text }) {
  const [message, setMessage] = useState('');
  return <div><button className="copy-button" onClick={async () => { try { await navigator.clipboard.writeText(text); setMessage('복사했습니다.'); } catch { setMessage('본문을 직접 선택해 복사해 주세요.'); } }}>지침 복사 ↗</button><span className="copy-status" role="status">{message}</span></div>;
}
