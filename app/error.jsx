'use client';
export default function ErrorPage({ reset }) { return <div className="empty" role="alert"><h2>화면을 불러오지 못했습니다.</h2><p>잠시 후 다시 시도해 주세요.</p><button className="secondary-button" onClick={() => reset()}>다시 시도</button></div>; }
