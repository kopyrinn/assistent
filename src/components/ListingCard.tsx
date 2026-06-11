import { MapPin, Plus, Minus, CalendarPlus, Check } from 'lucide-react';
import type { Listing } from '../data/mockData';
import { formatKzt } from '../lib/format';
import { Card, Photo, SourceBadge, AiScoreBadge, cx } from './ui';
import { formatAppointmentDateTime, useAppointments } from '../appointments';

/** Full object card used in the Objects list */
export function ListingCard({ listing, onOpen }: { listing: Listing; onOpen: () => void }) {
  const { openScheduler, getForSource } = useAppointments();
  const appointment = getForSource('listing', listing.id);

  return (
    <Card className="overflow-hidden">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative">
          <Photo src={listing.photos[0]} alt={listing.title} className="h-40 w-full" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <SourceBadge source={listing.source} onMedia />
          </div>
          <div className="absolute right-3 top-3">
            <AiScoreBadge score={listing.aiScore} onMedia />
          </div>
          {/* price ribbon */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/75 to-transparent px-4 pb-3 pt-12">
            <p className="inline-flex rounded-lg border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-display-l text-gold-soft shadow-lg backdrop-blur-sm tnum">
              {formatKzt(listing.priceKzt)}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-title text-text-primary">{listing.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
            <span className="text-text-primary">{listing.areaLabel}</span>
            <span>·</span>
            <span>{listing.pricePerUnit}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-caption text-text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.location}</span>
            <span>·</span>
            <span className="shrink-0">{listing.distanceCity}</span>
          </div>

          {/* AI bullets: one pro, one con */}
          <div className="mt-3 space-y-1.5">
            {listing.pros[0] && <Bullet kind="pro">{listing.pros[0]}</Bullet>}
            {listing.cons[0] && <Bullet kind="con">{listing.cons[0]}</Bullet>}
          </div>
        </div>
      </button>

      <div className="border-t border-line px-3 py-2.5">
        <button
          onClick={() =>
            openScheduler({
              kind: 'call',
              source: 'listing',
              sourceId: listing.id,
              title: listing.title,
              sourceLabel: listing.source === 'krisha' ? 'Krisha.kz' : 'OLX.kz',
            })
          }
          className={cx(
            'flex w-full items-center justify-center gap-2 rounded-btn border py-2 text-caption font-semibold transition-colors',
            appointment
              ? 'border-gold/40 bg-gold/10 text-gold'
              : 'border-line bg-bg-elevated text-text-primary hover:border-gold/40',
          )}
        >
          {appointment ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
          {appointment ? `Звонок · ${formatAppointmentDateTime(appointment)}` : 'Назначить звонок'}
        </button>
      </div>
    </Card>
  );
}

export function Bullet({ kind, children }: { kind: 'pro' | 'con'; children: React.ReactNode }) {
  const Icon = kind === 'pro' ? Plus : Minus;
  return (
    <div className="flex items-start gap-2">
      <span
        className={cx(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
          kind === 'pro' ? 'bg-teal/15 text-teal' : 'bg-rose/15 text-rose',
        )}
      >
        <Icon className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="text-caption text-text-muted">{children}</span>
    </div>
  );
}

/** Compact 2-column card used in the OLX grid */
export function ListingGridCard({ listing, onOpen }: { listing: Listing; onOpen: () => void }) {
  return (
    <Card onClick={onOpen} className="overflow-hidden">
      <div className="relative">
        <Photo src={listing.photos[0]} alt={listing.title} className="h-24 w-full" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/65 to-transparent" />
        <div className="absolute left-2 top-2">
          <SourceBadge source={listing.source} onMedia />
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-caption text-text-primary">{listing.title}</p>
        <p className="mt-1.5 font-mono text-body font-semibold text-gold-soft tnum">
          {formatKzt(listing.priceKzt)}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[11px] text-text-muted">{listing.areaLabel}</span>
          <AiScoreBadge score={listing.aiScore} compact />
        </div>
      </div>
    </Card>
  );
}

/** Horizontal mini card for "similar" carousels */
export function ListingMiniCard({ listing, onOpen, note }: { listing: Listing; onOpen: () => void; note?: string }) {
  return (
    <Card onClick={onOpen} className="w-44 shrink-0 overflow-hidden">
      <Photo src={listing.photos[0]} alt={listing.title} className="h-20 w-full" />
      <div className="p-3">
        <p className="line-clamp-2 min-h-[2.4rem] text-caption text-text-primary">{listing.title}</p>
        <p className="mt-1 font-mono text-caption font-semibold text-gold-soft tnum">
          {formatKzt(listing.priceKzt)}
        </p>
        {note && <p className="mt-1 text-[11px] text-teal">{note}</p>}
      </div>
    </Card>
  );
}
