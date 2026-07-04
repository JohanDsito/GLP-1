import type { ReactNode } from 'react';

export function StatusCard({
  title,
  copy,
  accent = 'primary',
  action,
}: {
  title: string;
  copy: string;
  accent?: 'primary' | 'accent' | 'soft';
  action?: ReactNode;
}) {
  return (
    <article className="panel pad">
      <div className="panel-header">
        <div>
          <div className={`pill ${accent}`}>{title}</div>
          <p className="panel-copy">{copy}</p>
        </div>
        {action}
      </div>
    </article>
  );
}

