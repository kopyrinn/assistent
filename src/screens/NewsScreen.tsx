import { Sparkles, ExternalLink, BellRing, Bookmark, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { news } from '../data/mockData';
import { ScreenHeader } from '../components/TopBar';
import { Eyebrow } from '../components/ui';
import { useFavorites } from '../favorites';
import { formatNewsReminderDateTime, useNewsReminders } from '../newsReminders';
import { useNav } from '../nav';

export function NewsScreen() {
  const { push } = useNav();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openScheduler, getForNews } = useNewsReminders();
  const sorted = [...news].sort((a, b) => parseRu(b.date) - parseRu(a.date));
  return (
    <div className="pb-28">
      <ScreenHeader title="Новости" subtitle="AI объясняет, почему важно для вас" />
      <div className="space-y-3 px-5 pt-5">
        <button
          onClick={() => push({ name: 'voice', context: 'newsInterests' })}
          className="glass glass-edge flex w-full items-center gap-3 rounded-card p-4 text-left transition-all hover:border-gold/45 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-body font-semibold text-text-primary">Обсудить новости с AI</span>
            <span className="mt-0.5 block text-caption leading-snug text-text-muted">
              Расскажите, что сейчас важно директору — AI настроит поиск новостей
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold" />
        </button>

        {sorted.map((n) => {
          const favoriteKey = `news:${n.id}`;
          const favorite = isFavorite(favoriteKey);
          const reminder = getForNews(n.id);
          return (
          <article key={n.id} className="rounded-card border border-line bg-bg-panel p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Eyebrow>{n.date}</Eyebrow>
              <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] text-text-muted">{n.source}</span>
            </div>
            <h3 className="text-body font-semibold leading-snug text-text-primary">{n.title}</h3>
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/[0.05] p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p className="text-caption leading-relaxed text-text-primary">
                <span className="font-semibold text-gold">Почему важно: </span>
                {n.whyImportant}
              </p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button className="inline-flex items-center gap-1 text-caption text-text-muted hover:text-text-primary">
                Читать источник <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <button
                onClick={() => toggleFavorite(favoriteKey)}
                className={
                  'inline-flex items-center justify-center gap-1.5 rounded-btn border px-2 py-2 text-caption font-medium ' +
                  (favorite
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-line bg-bg-elevated text-text-primary hover:border-gold/40')
                }
              >
                {favorite ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                {favorite ? 'В избранном' : 'В избранное'}
              </button>
              <button
                onClick={() => openScheduler({ newsId: n.id, title: n.title, source: n.source })}
                className={
                  'inline-flex items-center justify-center gap-1.5 rounded-btn border px-2 py-2 text-caption font-medium ' +
                  (reminder
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-line bg-bg-elevated text-text-primary hover:border-gold/40')
                }
              >
                {reminder ? <Check className="h-3.5 w-3.5" /> : <BellRing className="h-3.5 w-3.5" />}
                <span>
                  <span className="block">{reminder ? 'Напоминание' : 'Напомнить мне'}</span>
                  {reminder && (
                    <span className="block text-[10px] font-normal text-text-muted">
                      {formatNewsReminderDateTime(reminder)}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function parseRu(d: string): number {
  // "09.06.2026" -> timestamp
  const [day, month, year] = d.split('.').map(Number);
  return new Date(year, month - 1, day).getTime();
}
