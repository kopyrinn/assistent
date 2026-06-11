import { Play, Eye, Tag, Ruler, MapPin, Phone, ExternalLink, ArrowRight, CalendarPlus, Check } from 'lucide-react';
import type { VideoFind } from '../data/mockData';
import { formatKzt, formatViews } from '../lib/format';
import { Card, Photo, Pill, cx } from './ui';
import { useAppointments } from '../appointments';

function PlatformBadge({ platform }: { platform: VideoFind['platform'] }) {
  const isTikTok = platform === 'tiktok';
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        isTikTok ? 'bg-black/70 text-white' : 'bg-[#d6249f]/25 text-[#ff7eda]',
      )}
    >
      {isTikTok ? 'TikTok' : 'Instagram'}
    </span>
  );
}

export function VideoCard({ video, onOpen }: { video: VideoFind; onOpen: () => void }) {
  const { extracted } = video;
  const { openScheduler, getForSource } = useAppointments();
  const appointment = getForSource('video', video.id);

  const scheduleMeeting = () => {
    openScheduler({
      kind: 'meeting',
      source: 'video',
      sourceId: video.id,
      title: video.caption,
      sourceLabel: video.platform === 'tiktok' ? 'TikTok' : 'Instagram',
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <button onClick={onOpen} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl">
          <Photo src={video.thumbnail} alt={video.caption} className="h-full w-full" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 backdrop-blur">
              <Play className="h-4 w-4 fill-white text-white" />
            </span>
          </span>
          <span className="absolute left-1 top-1">
            <PlatformBadge platform={video.platform} />
          </span>
        </button>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-caption font-semibold text-text-primary">{video.authorHandle}</span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-text-muted">
              <Eye className="h-3 w-3" /> {formatViews(video.views)}
            </span>
          </div>

          {video.aiRelevant ? (
            <Pill tone="teal" className="mt-1.5">релевантно</Pill>
          ) : (
            <Pill tone="muted" className="mt-1.5">отфильтровано</Pill>
          )}

          <p className="mt-2 line-clamp-2 text-caption text-text-muted">{video.aiVerdict}</p>
        </div>
      </div>

      {/* Extracted data chips */}
      {video.aiRelevant && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-3">
          {extracted.priceKzt && <Chip icon={Tag}>{formatKzt(extracted.priceKzt)}</Chip>}
          {extracted.areaLabel && <Chip icon={Ruler}>{extracted.areaLabel}</Chip>}
          {extracted.location && <Chip icon={MapPin}>{extracted.location}</Chip>}
          {extracted.contact && <Chip icon={Phone}>{extracted.contact}</Chip>}
        </div>
      )}

      {/* Match with Krisha */}
      {video.matchNote && (
        <button
          onClick={onOpen}
          className="flex w-full items-center justify-between gap-2 border-t border-line bg-teal/[0.07] px-3 py-2.5 text-left transition-colors hover:bg-teal/[0.12]"
        >
          <span className="text-caption text-teal">{video.matchNote}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-teal" />
        </button>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2.5">
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-btn bg-bg-elevated px-3 py-1.5 text-caption font-medium text-text-primary transition-colors hover:bg-gold/15 hover:text-gold"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Открыть видео
        </a>
        <button
          onClick={onOpen}
          className="rounded-btn px-3 py-1.5 text-caption font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          Подробнее
        </button>
        <button
          onClick={scheduleMeeting}
          className={cx(
            'ml-auto flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-caption font-medium transition-colors',
            appointment
              ? 'border-gold/40 bg-gold/10 text-gold'
              : 'border-line bg-bg-elevated text-text-primary hover:border-gold/40',
          )}
        >
          {appointment ? <Check className="h-3.5 w-3.5" /> : <CalendarPlus className="h-3.5 w-3.5" />}
          {appointment ? 'Назначено' : 'Назначить созвон'}
        </button>
      </div>
    </Card>
  );
}

function Chip({ icon: Icon, children }: { icon: typeof Tag; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-bg-elevated px-2 py-1 text-[11px] text-text-muted">
      <Icon className="h-3 w-3 text-gold" />
      <span className="text-text-primary">{children}</span>
    </span>
  );
}
