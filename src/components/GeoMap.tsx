import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { cx } from './ui';

const RADII = ['1 км', '3 км', '5 км', '15 км', '30 км'];

/** Compact location overview for an object card. */
export function GeoMap({ nearby }: { nearby: { label: string; distance: string }[] }) {
  const [radius, setRadius] = useState('5 км');

  // Spread nearby markers around the center deterministically
  const positions = [
    { top: '24%', left: '30%' },
    { top: '34%', left: '70%' },
    { top: '66%', left: '38%' },
    { top: '58%', left: '74%' },
    { top: '46%', left: '18%' },
  ];

  return (
    <div>
      <div className="relative h-44 w-full overflow-hidden rounded-card border border-line">
        {/* faux map base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 0%, rgb(var(--map-start)), rgb(var(--map-end)) 70%)',
          }}
        />
        {/* grid roads */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="roads" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M0 22 H44 M22 0 V44" stroke="rgb(var(--map-grid))" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roads)" />
          <path d="M0 130 Q160 90 360 150" stroke="rgb(var(--map-road))" strokeWidth="3" fill="none" />
          <path d="M70 0 Q120 120 60 176" stroke="rgb(var(--map-road-secondary))" strokeWidth="2" fill="none" />
        </svg>

        {/* radius ring around the object */}
        <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/30 bg-gold/[0.04]" />
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40" />

        {/* central object marker */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[#0B1220] shadow-gold-glow">
            <MapPin className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </span>

        {/* nearby markers */}
        {nearby.slice(0, 5).map((n, i) => (
          <span
            key={n.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={positions[i % positions.length]}
          >
            <span className="flex flex-col items-center gap-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal ring-4 ring-bg-deep/60" />
              <span className="whitespace-nowrap rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] text-white backdrop-blur">
                {n.label}
              </span>
            </span>
          </span>
        ))}
      </div>

      {/* radius chips */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {RADII.map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={cx(
              'shrink-0 rounded-full border px-3 py-1 text-caption transition-colors',
              r === radius
                ? 'border-gold/40 bg-gold/12 text-gold'
                : 'border-line bg-bg-panel text-text-muted hover:text-text-primary',
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* nearby list */}
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line">
        {nearby.map((n) => (
          <li key={n.label} className="flex items-center justify-between px-4 py-2.5">
            <span className="flex items-center gap-2 text-caption text-text-primary">
              <Navigation className="h-3.5 w-3.5 text-teal" />
              {n.label}
            </span>
            <span className="font-mono text-caption text-text-muted tnum">{n.distance}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
