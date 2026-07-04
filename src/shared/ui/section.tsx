import type { PropsWithChildren, ReactNode } from 'react';

export function Section({
  title,
  eyebrow,
  action,
  children,
}: PropsWithChildren<{
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}>) {
  return (
    <section className="panel pad">
      <div className="panel-header">
        <div>
          {eyebrow ? <div className="page-kicker">{eyebrow}</div> : null}
          <h2 className="panel-title">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

