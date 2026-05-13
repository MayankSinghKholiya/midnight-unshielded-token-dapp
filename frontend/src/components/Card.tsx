import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, eyebrow, children, className = '' }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || eyebrow) && (
        <div className="card-header">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h2>{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}
