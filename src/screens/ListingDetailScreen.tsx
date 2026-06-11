import { Phone, ExternalLink, CalendarPlus, Bookmark, Sparkles, HelpCircle } from 'lucide-react';
import { listings } from '../data/mockData';
import { useNav } from '../nav';
import { useFavorites } from '../favorites';
import { useAppointments } from '../appointments';
import { ScreenHeader } from '../components/TopBar';
import { GeoMap } from '../components/GeoMap';
import { PriceHistoryChart } from '../components/Charts';
import { ListingMiniCard, Bullet } from '../components/ListingCard';
import { Photo, SourceBadge, AiScoreBadge } from '../components/ui';
import { formatKzt, formatKztExact } from '../lib/format';

export function ListingDetailScreen({ id }: { id: string }) {
  const { openListing } = useNav();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openScheduler, getForSource } = useAppointments();
  const listing = listings.find((l) => l.id === id);
  if (!listing) return <div className="p-6 pt-16 text-text-muted">Объект не найден.</div>;
  const favorite = isFavorite(listing.id);
  const appointment = getForSource('listing', listing.id);

  const similar = listing.similarIds
    .map((sid) => listings.find((l) => l.id === sid))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  const priceDrop =
    listing.priceHistory.length > 1
      ? listing.priceHistory[0].price - listing.priceHistory[listing.priceHistory.length - 1].price
      : 0;

  return (
    <div className="pb-32">
      <ScreenHeader title="Карточка объекта" />

      {/* Gallery */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-5 no-scrollbar snap-x">
        {(listing.photos.length ? listing.photos : ['']).map((p, i) => (
          <Photo
            key={i}
            src={p}
            alt={listing.title}
            className="h-52 w-[88%] shrink-0 snap-center rounded-card"
          />
        ))}
      </div>

      <div className="space-y-6 px-5 pt-5">
        {/* Title + price */}
        <div>
          <div className="flex items-center gap-2">
            <SourceBadge source={listing.source} />
            <AiScoreBadge score={listing.aiScore} />
          </div>
          <h1 className="mt-2 font-display text-display-l leading-tight text-text-primary">{listing.title}</h1>
          <p className="mt-2 font-mono text-display-xl text-gold-soft tnum">{formatKzt(listing.priceKzt)}</p>
          <p className="text-caption text-text-muted tnum">{formatKztExact(listing.priceKzt)}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-caption text-text-muted">
            <span className="text-text-primary">{listing.areaLabel}</span>
            <span>·</span>
            <span>{listing.pricePerUnit}</span>
            <span>·</span>
            <span>{listing.location}</span>
            <span>·</span>
            <span>{listing.distanceCity}</span>
          </div>
          <a
            href={listing.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-btn border border-line bg-bg-elevated px-3.5 py-2 text-caption font-semibold text-text-primary transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть объявление на {listing.source === 'krisha' ? 'Krisha.kz' : 'OLX.kz'}
          </a>
        </div>

        {/* AI verdict */}
        <div className="rounded-card border border-gold/30 bg-gold/[0.05] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-micro uppercase text-gold">Вердикт AI</span>
          </div>
          <p className="text-body leading-relaxed text-text-primary">{listing.aiVerdict}</p>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-card border border-line bg-bg-panel p-4">
            <p className="mb-2.5 text-micro uppercase text-teal">Плюсы</p>
            <div className="space-y-2">
              {listing.pros.map((p) => (
                <Bullet key={p} kind="pro">{p}</Bullet>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-line bg-bg-panel p-4">
            <p className="mb-2.5 text-micro uppercase text-rose">Минусы</p>
            <div className="space-y-2">
              {listing.cons.map((c) => (
                <Bullet key={c} kind="con">{c}</Bullet>
              ))}
            </div>
          </div>
        </div>

        {/* Geo analysis */}
        {listing.nearby.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-title text-text-primary">Геоанализ окружения</h2>
            <GeoMap nearby={listing.nearby} />
          </section>
        )}

        {/* Price history */}
        {listing.priceHistory.length > 1 && (
          <section>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-title text-text-primary">История цены</h2>
              {priceDrop > 0 && (
                <span className="text-caption font-semibold text-teal">−{formatKzt(priceDrop)}</span>
              )}
            </div>
            <p className="mb-3 text-caption text-text-muted">Цена снижалась — продавец готов торговаться.</p>
            <div className="rounded-card border border-line bg-bg-panel p-3">
              <PriceHistoryChart data={listing.priceHistory} />
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-title text-text-primary">Похожие объекты</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {similar.map((s) => (
                <ListingMiniCard
                  key={s.id}
                  listing={s}
                  onOpen={() => openListing(s.id)}
                  note={s.aiScore > listing.aiScore ? 'выше AI-оценка' : 'для сравнения'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Seller questions */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gold" />
            <h2 className="font-display text-title text-text-primary">Вопросы продавцу</h2>
          </div>
          <p className="mb-3 text-caption text-text-muted">AI подготовил, что важно уточнить до сделки.</p>
          <ul className="space-y-2">
            {listing.sellerQuestions.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-card border border-line bg-bg-panel p-3.5"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[11px] font-semibold text-gold tnum">
                  {i + 1}
                </span>
                <span className="text-caption text-text-primary">{q}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky actions */}
      <div className="glass-strong sticky bottom-0 z-30 mt-6 border-t border-line px-4 py-3 pb-4">
        <div className="grid grid-cols-4 gap-2">
          <ActionBtn icon={Phone} label="Позвонить" primary />
          <ActionLink
            href={listing.sourceUrl}
            icon={ExternalLink}
            label={listing.source === 'krisha' ? 'Krisha' : 'OLX'}
          />
          <ActionBtn
            icon={CalendarPlus}
            label={appointment ? 'Назначено' : 'Назначить звонок'}
            active={Boolean(appointment)}
            onClick={() =>
              openScheduler({
                kind: 'call',
                source: 'listing',
                sourceId: listing.id,
                title: listing.title,
                sourceLabel: listing.source === 'krisha' ? 'Krisha.kz' : 'OLX.kz',
              })
            }
          />
          <ActionBtn
            icon={Bookmark}
            label={favorite ? 'Сохранено' : 'В избранное'}
            active={favorite}
            onClick={() => toggleFavorite(listing.id)}
          />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  primary,
  active,
  onClick,
}: {
  icon: typeof Phone;
  label: string;
  primary?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'flex flex-col items-center gap-1 rounded-btn py-2 text-[11px] font-medium transition-all active:scale-95 ' +
        (primary
          ? 'bg-gradient-to-b from-gold-soft to-gold text-[#0B1220] shadow-gold-glow'
          : active
            ? 'border border-gold/50 bg-gold/15 text-gold'
          : 'border border-line bg-bg-elevated text-text-primary hover:border-gold/40')
      }
    >
      <Icon className="h-4 w-4" fill={active ? 'currentColor' : 'none'} />
      {label}
    </button>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof ExternalLink;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center gap-1 rounded-btn border border-line bg-bg-elevated py-2 text-[11px] font-medium text-text-primary transition-all hover:border-gold/40 active:scale-95"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
