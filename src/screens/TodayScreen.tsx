import { motion } from 'framer-motion';
import {
  Home,
  Radar,
  CloudRain,
  Newspaper,
  BellRing,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import type { FeedItem } from '../data/mockData';
import { feed, feedFilteredCount, listings, weekSummary, weekHighlights } from '../data/mockData';
import { useNav } from '../nav';
import { HomeHeader, HomeNewsCard, HomeWeatherCard } from '../components/TopBar';
import { VoiceInvite } from '../components/VoiceInvite';
import { ThreadNode } from '../components/AttentionThread';
import { Photo, Eyebrow, ImportanceDot, cx } from '../components/ui';
import { importanceStyle, prefersReducedMotion } from '../lib/format';

const typeIcon: Record<FeedItem['type'], typeof Home> = {
  urgent_listing: Home,
  similar: Home,
  video: Radar,
  weather: CloudRain,
  news: Newspaper,
  reminder: BellRing,
};

export function TodayScreen() {
  const reduced = prefersReducedMotion();
  return (
    <div className="pb-28">
      <HomeHeader />

      <div className="space-y-3 px-5 pt-5">
        <HomeWeatherCard />
        <HomeNewsCard />
        <VoiceInvite />
      </div>

      <section className="px-5 pt-7">
        <div className="mb-4 flex items-center gap-2.5 rounded-card border border-line bg-bg-panel/60 px-4 py-3">
          <Filter className="h-4 w-4 shrink-0 text-text-muted" />
          <p className="text-caption text-text-muted">
            AI просмотрел <span className="text-text-primary tnum">{feedFilteredCount.scanned}</span> объявлений
            и отфильтровал <span className="text-text-primary tnum">{feedFilteredCount.filtered}</span> как
            неважные.
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-title uppercase text-text-primary">Сегодня важно</h2>
            <span className="text-micro uppercase text-gold">
              {feedFilteredCount.important} новых
            </span>
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-caption leading-relaxed text-text-muted">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            AI подобрал варианты, которые могут вас заинтересовать, на основе ваших просмотров и сохранённых интересов.
          </p>
        </div>

        <div className="flex flex-col">
          {feed.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : idx * 0.07, duration: 0.4, ease: 'easeOut' }}
            >
              <ThreadNode importance={item.importance} isLast={idx === feed.length - 1}>
                <FeedCard item={item} />
              </ThreadNode>
            </motion.div>
          ))}
        </div>
      </section>

      <WeekSummaryBlock />
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const { openListing, push, selectTab } = useNav();
  const Icon = typeIcon[item.type];
  const s = importanceStyle[item.importance];

  const handleOpen = () => {
    switch (item.type) {
      case 'urgent_listing':
      case 'reminder':
        if (item.payloadId) openListing(item.payloadId);
        break;
      case 'video':
        selectTab('radar');
        if (item.payloadId) push({ name: 'video', id: item.payloadId });
        break;
      case 'weather':
        selectTab('more');
        push({ name: 'weather' });
        break;
      case 'news':
        selectTab('more');
        push({ name: 'news' });
        break;
    }
  };

  const listing = item.type === 'urgent_listing' ? listings.find((l) => l.id === item.payloadId) : undefined;

  return (
    <div
      className="rounded-card border border-line bg-bg-panel p-4 transition-all hover:border-gold/30 hover:bg-bg-elevated"
      style={item.importance === 'critical' ? { boxShadow: `inset 3px 0 0 ${s.color}` } : undefined}
    >
      <div className="flex items-center gap-2">
        <ImportanceDot importance={item.importance} pulse />
        <Eyebrow>{item.eyebrow}</Eyebrow>
        <Icon className="ml-auto h-4 w-4 text-text-muted" />
      </div>

      <h3 className="mt-2 text-body font-semibold leading-snug text-text-primary">{item.headline}</h3>
      <p className="mt-1 text-caption text-text-muted">{item.detail}</p>

      {/* Type-specific preview */}
      {listing && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-bg-deep/40 p-2">
          <Photo src={listing.photos[0]} alt={listing.title} className="h-12 w-16 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption text-text-primary">{listing.location}</p>
            <p className="font-mono text-caption text-gold-soft tnum">{listing.areaLabel} · {listing.pricePerUnit}</p>
          </div>
        </div>
      )}

      {/* Action */}
      <button
        onClick={handleOpen}
        className={cx(
          'mt-3 inline-flex items-center gap-1 text-caption font-semibold transition-colors',
          item.importance === 'critical' ? 'text-rose' : 'text-gold hover:text-gold-soft',
        )}
      >
        {actionLabel(item.type)}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function actionLabel(type: FeedItem['type']): string {
  switch (type) {
    case 'urgent_listing':
      return 'Открыть карточку';
    case 'video':
      return 'Открыть находку';
    case 'weather':
      return 'Прогноз на неделю';
    case 'news':
      return 'Читать новость';
    case 'reminder':
      return 'К объекту';
    default:
      return 'Открыть';
  }
}

function WeekSummaryBlock() {
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-title text-text-primary">Итоги недели</h2>
        <span className="text-caption text-text-muted">AI работал 7 дней</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {weekSummary.map((w) => (
          <div key={w.label} className="rounded-card border border-line bg-bg-panel p-3.5">
            <p className="font-display text-display-l text-text-primary tnum">{w.value}</p>
            <p className="mt-0.5 text-caption text-text-primary">{w.label}</p>
            <p className="mt-0.5 text-[11px] text-text-muted">{w.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-card border border-gold/20 bg-gold/[0.05] p-4">
        <p className="mb-2 text-micro uppercase text-gold">Главное за неделю</p>
        <ul className="space-y-2">
          {weekHighlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-caption text-text-muted">
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
