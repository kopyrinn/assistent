import type { ReactNode } from 'react';
import type { Importance, Source } from '../data/mockData';
import { importanceStyle } from '../lib/format';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** Small uppercase eyebrow label */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('text-micro uppercase tracking-[0.08em] text-text-muted', className)}>
      {children}
    </span>
  );
}

/** Generic surface card */
export function Card({
  children,
  className,
  onClick,
  as,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button';
}) {
  const Comp: any = as ?? (onClick ? 'button' : 'div');
  return (
    <Comp
      onClick={onClick}
      className={cx(
        'block w-full text-left rounded-card border border-line bg-bg-panel/90 shadow-soft',
        onClick && 'transition-all duration-200 hover:border-gold/40 hover:bg-bg-elevated/80 active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function Pill({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode;
  tone?: 'muted' | 'gold' | 'teal' | 'rose' | 'violet';
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: 'bg-bg-elevated text-text-muted border-line',
    gold: 'bg-gold/12 text-gold border-gold/30',
    teal: 'bg-teal/12 text-teal border-teal/30',
    rose: 'bg-rose/12 text-rose border-rose/30',
    violet: 'bg-violet/12 text-violet border-violet/30',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-micro uppercase tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SourceBadge({ source, onMedia }: { source: Source; onMedia?: boolean }) {
  const isKrisha = source === 'krisha';
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        onMedia
          ? isKrisha
            ? 'border-[#6ea8ff]/45 bg-[#081425]/90 text-[#9bc2ff] shadow-md backdrop-blur-md'
            : 'border-[#34d399]/45 bg-[#071d18]/90 text-[#6ee7b7] shadow-md backdrop-blur-md'
          : isKrisha
            ? 'border-transparent bg-[#1f6feb]/20 text-[#6ea8ff]'
            : 'border-transparent bg-[#10b981]/15 text-[#34d399]',
      )}
    >
      {isKrisha ? 'Krisha' : 'OLX'}
    </span>
  );
}

export function AiScoreBadge({
  score,
  compact,
  onMedia,
}: {
  score: number;
  compact?: boolean;
  onMedia?: boolean;
}) {
  const tone = score >= 8 ? 'teal' : score >= 7 ? 'gold' : 'muted';
  const label = score >= 8 ? 'выгодно' : score >= 7 ? 'в рынке' : 'на оценке';
  const colors: Record<string, string> = {
    teal: 'bg-teal/12 text-teal border-teal/30',
    gold: 'bg-gold/12 text-gold border-gold/30',
    muted: 'bg-bg-elevated text-text-muted border-line',
  };
  const mediaColors: Record<string, string> = {
    teal: 'bg-[#071d18]/90 text-[#6ee7b7] border-teal/50',
    gold: 'bg-[#081827]/90 text-gold-soft border-gold/50',
    muted: 'bg-[#101722]/90 text-white border-white/25',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-caption font-semibold tnum',
        onMedia ? `${mediaColors[tone]} shadow-md backdrop-blur-md` : colors[tone],
      )}
    >
      <span aria-hidden>★</span>
      {score.toFixed(1).replace('.', ',')}
      {!compact && <span className="font-medium opacity-80">· {label}</span>}
    </span>
  );
}

export function ImportanceDot({ importance, pulse }: { importance: Importance; pulse?: boolean }) {
  const s = importanceStyle[importance];
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && importance === 'critical' && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-node"
          style={{ background: s.color }}
        />
      )}
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
    </span>
  );
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-title text-text-primary">{title}</h2>
        {hint && <p className="mt-0.5 text-caption text-text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

/** Photo with graceful gradient fallback while/if it fails to load */
export function Photo({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cx('relative overflow-hidden bg-bg-elevated', className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--gold) / 0.14), rgb(var(--violet) / 0.10) 60%, rgb(var(--bg-elevated) / 0.72))',
        }}
      />
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="relative h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
