import type { ReactNode } from 'react';
import type { Importance } from '../data/mockData';
import { importanceStyle } from '../lib/format';
import { cx } from './ui';

export function ThreadNode({
  importance,
  isLast,
  children,
}: {
  importance: Importance;
  isLast?: boolean;
  children: ReactNode;
}) {
  const s = importanceStyle[importance];
  const isCritical = importance === 'critical';
  return (
    <div className="relative flex gap-3.5">
      <div className="relative w-3 shrink-0">
        <span
          aria-hidden
          className={cx(
            'absolute left-1/2 top-2 -translate-x-1/2',
            isLast ? 'h-[calc(100%-0.5rem)]' : 'h-[calc(100%+1.25rem)]',
          )}
          style={{
            width: 2,
            background:
              'linear-gradient(to bottom, rgba(56,189,248,0.55), rgba(56,189,248,0.16))',
            borderRadius: 2,
          }}
        />
        <span className="absolute left-1/2 top-1.5 -translate-x-1/2">
          <span className="relative flex h-3 w-3 items-center justify-center">
            {isCritical && (
              <span
                className="absolute inline-flex h-3 w-3 rounded-full animate-pulse-node"
                style={{ background: s.color, opacity: 0.5 }}
              />
            )}
            <span
              className="relative h-2.5 w-2.5 rounded-full ring-4 ring-bg-deep"
              style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
            />
          </span>
        </span>
      </div>
      <div className="min-w-0 flex-1 pb-5">{children}</div>
    </div>
  );
}
