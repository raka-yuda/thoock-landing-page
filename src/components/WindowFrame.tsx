import type { ReactNode } from 'react';

export default function WindowFrame({ title, children, className = '', trailing }: { title: string; children: ReactNode; className?: string; trailing?: ReactNode }) {
  return <div className={`window ${className}`}><div className="window-title"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>{title}</span><span className="window-trailing">{trailing}</span></div>{children}</div>;
}
