import { ExternalLink, Mic, ScanText, Tag, Ruler, MapPin, Phone, Sparkles, ArrowRight, Check, X, CalendarPlus } from 'lucide-react';
import { videoFinds, listings } from '../data/mockData';
import { useNav } from '../nav';
import { ScreenHeader } from '../components/TopBar';
import { Photo, Pill, cx } from '../components/ui';
import { formatKzt, formatViews } from '../lib/format';
import { formatAppointmentDateTime, useAppointments } from '../appointments';

export function VideoDetailScreen({ id }: { id: string }) {
  const { openListing } = useNav();
  const { openScheduler, getForSource } = useAppointments();
  const video = videoFinds.find((v) => v.id === id);
  if (!video) return <div className="p-6 pt-16 text-text-muted">Видео не найдено.</div>;
  const appointment = getForSource('video', video.id);

  const matched = video.matchedListingId
    ? listings.find((l) => l.id === video.matchedListingId)
    : undefined;
  const { extracted } = video;

  return (
    <div className="pb-28">
      <ScreenHeader title="Находка видео-радара" />

      <div className="space-y-5 px-5 pt-4">
        {/* Preview */}
        <div className="relative overflow-hidden rounded-card">
          <Photo src={video.thumbnail} alt={video.caption} className="h-64 w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
            <div className="flex items-center justify-between">
              <span className="text-body font-semibold text-text-primary">{video.authorHandle}</span>
              <span className="text-caption text-text-muted">{formatViews(video.views)} просмотров</span>
            </div>
          </div>
          <span className="absolute right-3 top-3">
            <Pill tone={video.platform === 'tiktok' ? 'muted' : 'violet'}>
              {video.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
            </Pill>
          </span>
        </div>

        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-btn bg-gradient-to-b from-gold-soft to-gold py-3 text-body font-semibold text-[#0B1220] shadow-gold-glow transition-transform active:scale-[0.99]"
        >
          <ExternalLink className="h-5 w-5" /> Открыть оригинал видео
        </a>

        <button
          onClick={() =>
            openScheduler({
              kind: 'meeting',
              source: 'video',
              sourceId: video.id,
              title: video.caption,
              sourceLabel: video.platform === 'tiktok' ? 'TikTok' : 'Instagram',
            })
          }
          className={cx(
            'flex w-full items-center justify-center gap-2 rounded-btn border py-3 text-body font-semibold transition-colors',
            appointment
              ? 'border-gold/40 bg-gold/10 text-gold'
              : 'border-line bg-bg-panel text-text-primary hover:border-gold/40',
          )}
        >
          {appointment ? <Check className="h-5 w-5" /> : <CalendarPlus className="h-5 w-5" />}
          {appointment ? `Созвон · ${formatAppointmentDateTime(appointment)}` : 'Назначить созвон'}
        </button>

        <p className="text-caption text-text-muted">{video.caption}</p>

        {/* AI verdict */}
        <div
          className={cx(
            'rounded-card border p-4',
            video.aiRelevant ? 'border-teal/30 bg-teal/[0.05]' : 'border-line bg-bg-panel',
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            {video.aiRelevant ? (
              <span className="flex items-center gap-1.5 text-micro uppercase text-teal">
                <Check className="h-4 w-4" /> Релевантно
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-micro uppercase text-text-muted">
                <X className="h-4 w-4" /> Отфильтровано
              </span>
            )}
          </div>
          <p className="text-body leading-relaxed text-text-primary">{video.aiVerdict}</p>
        </div>

        {/* Extracted fields */}
        {video.aiRelevant && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <h2 className="font-display text-title text-text-primary">Что AI вытащил из видео</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {extracted.priceKzt && <Field icon={Tag} label="Цена" value={formatKzt(extracted.priceKzt)} />}
              {extracted.areaLabel && <Field icon={Ruler} label="Площадь" value={extracted.areaLabel} />}
              {extracted.location && <Field icon={MapPin} label="Локация" value={extracted.location} />}
              {extracted.contact && <Field icon={Phone} label="Контакт" value={extracted.contact} masked />}
            </div>
          </section>
        )}

        {/* Recognized speech */}
        {video.transcript && (
          <Recognized icon={Mic} title="Распознанная речь" body={`«${video.transcript}»`} />
        )}
        {video.onScreenText && (
          <Recognized icon={ScanText} title="Текст с кадра (OCR)" body={video.onScreenText} mono />
        )}

        {/* Match with Krisha */}
        {matched && (
          <section>
            <h2 className="mb-3 font-display text-title text-text-primary">Сравнение с Krisha / OLX</h2>
            <button
              onClick={() => openListing(matched.id)}
              className="flex w-full items-center gap-3 rounded-card border border-teal/25 bg-teal/[0.05] p-3 text-left transition-colors hover:bg-teal/[0.1]"
            >
              <Photo src={matched.photos[0]} alt={matched.title} className="h-14 w-20 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption text-text-primary">{matched.title}</p>
                <p className="font-mono text-caption text-gold-soft tnum">{formatKzt(matched.priceKzt)}</p>
                {video.matchNote && <p className="mt-0.5 text-[11px] text-teal">{video.matchNote}</p>}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-teal" />
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  masked,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
  masked?: boolean;
}) {
  return (
    <div className="rounded-card border border-line bg-bg-panel p-3.5">
      <div className="flex items-center gap-1.5 text-caption text-text-muted">
        <Icon className="h-3.5 w-3.5 text-gold" /> {label}
      </div>
      <p className={cx('mt-1 text-body font-semibold text-text-primary', masked && 'tracking-widest')}>{value}</p>
    </div>
  );
}

function Recognized({
  icon: Icon,
  title,
  body,
  mono,
}: {
  icon: typeof Mic;
  title: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-card border border-line bg-bg-panel p-4">
      <div className="mb-2 flex items-center gap-2 text-micro uppercase text-text-muted">
        <Icon className="h-3.5 w-3.5 text-violet" /> {title}
      </div>
      <p className={cx('text-caption leading-relaxed text-text-primary', mono && 'font-mono')}>{body}</p>
    </div>
  );
}
