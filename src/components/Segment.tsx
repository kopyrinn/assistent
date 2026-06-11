import { cx } from './ui';

/** Segmented control used for filters (Все / Krisha / OLX, Meta / TikTok, …) */
export function Segment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="segment-control glass flex gap-1 rounded-[14px] p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cx(
              'flex-1 rounded-[11px] px-3 py-1.5 text-caption font-medium transition-all',
              active
                ? 'segment-control-active bg-bg-elevated text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            {opt.label}
            {opt.hint && <span className="ml-1 text-[10px] text-text-muted">{opt.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
