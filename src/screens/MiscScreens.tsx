import { useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BellRing,
  Clock,
  Bell,
  Sparkles,
  Info,
  CalendarClock,
  PhoneCall,
  Video,
  Newspaper,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import {
  weekSummary,
  weekHighlights,
  listings,
  news,
} from '../data/mockData';
import { useNav } from '../nav';
import { usePush } from '../push';
import type { PushIntervalSeconds } from '../push';
import { useFavorites } from '../favorites';
import {
  formatAppointmentDateTime,
  useAppointments,
  type Appointment,
} from '../appointments';
import { ScreenHeader } from '../components/TopBar';
import { ListingCard } from '../components/ListingCard';
import { cx } from '../components/ui';
import { useTheme } from '../theme';
import { formatNewsReminderDateTime, useNewsReminders } from '../newsReminders';

/* ---------------- Итоги недели ---------------- */
export function WeekScreen() {
  return (
    <div className="pb-28">
      <ScreenHeader title="Итоги недели" subtitle="AI работал 7 дней и подвёл итог" />
      <div className="space-y-4 px-5 pt-5">
        <div className="grid grid-cols-2 gap-2.5">
          {weekSummary.map((w) => (
            <div key={w.label} className="rounded-card border border-line bg-bg-panel p-4">
              <p className="font-display text-display-xl text-text-primary tnum">{w.value}</p>
              <p className="mt-1 text-caption text-text-primary">{w.label}</p>
              <p className="mt-0.5 text-[11px] text-text-muted">{w.hint}</p>
            </div>
          ))}
        </div>
        <div className="rounded-card border border-gold/20 bg-gold/[0.05] p-4">
          <p className="mb-2.5 text-micro uppercase text-gold">Главное за неделю</p>
          <ul className="space-y-2.5">
            {weekHighlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-caption text-text-muted">
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Избранное ---------------- */
export function FavoritesScreen() {
  const { openListing, push } = useNav();
  const { favoriteIds } = useFavorites();
  const saved = listings.filter((l) => favoriteIds.has(l.id));
  const savedNews = news.filter((item) => favoriteIds.has(`news:${item.id}`));
  const total = saved.length + savedNews.length;
  return (
    <div className="pb-28">
      <ScreenHeader
        title="Избранное"
        subtitle={total === 0 ? 'Сохранённые объекты и новости' : `${total} сохранено`}
      />
      <div className="space-y-3.5 px-5 pt-5">
        {total === 0 ? (
          <EmptyState icon={Bookmark} text="Пока пусто. AI следит за рынком и сообщит, как появится важное." />
        ) : (
          <>
            {saved.map((l) => <ListingCard key={l.id} listing={l} onOpen={() => openListing(l.id)} />)}
            {savedNews.map((item) => (
              <button
                key={item.id}
                onClick={() => push({ name: 'news' })}
                className="w-full rounded-card border border-line bg-bg-panel p-4 text-left transition-colors hover:border-gold/35"
              >
                <div className="flex items-center gap-2 text-micro uppercase text-gold">
                  <Newspaper className="h-4 w-4" /> Новость · {item.source}
                </div>
                <p className="mt-2 text-body font-semibold leading-snug text-text-primary">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-caption text-text-muted">{item.whyImportant}</p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Встречи и звонки ---------------- */
export function AppointmentsScreen() {
  const { appointments, remove } = useAppointments();
  const { openListing, push, selectTab } = useNav();

  const openSource = (appointment: Appointment) => {
    switch (appointment.source) {
      case 'listing':
        openListing(appointment.sourceId);
        break;
      case 'video':
        selectTab('radar');
        push({ name: 'video', id: appointment.sourceId });
        break;
      case 'news':
        push({ name: 'news' });
        break;
    }
  };

  return (
    <div className="pb-28">
      <ScreenHeader
        title="Встречи и звонки"
        subtitle={appointments.length === 0 ? 'Назначенные вами события' : `${appointments.length} в расписании`}
      />

      <div className="space-y-3 px-5 pt-5">
        {appointments.length > 0 && (
          <div className="flex items-start gap-2.5 rounded-card border border-gold/25 bg-gold/[0.05] p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <p className="text-caption leading-relaxed text-text-primary">
              <span className="font-semibold text-gold">AI напоминает: </span>
              вы назначили {appointments.length} событий. Ближайшее —{' '}
              {formatAppointmentDateTime(appointments[0]).toLowerCase()}.
            </p>
          </div>
        )}

        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            text="Назначайте звонки и созвоны из объектов и видео-радара. Они появятся здесь."
          />
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-card border border-line bg-bg-panel p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                  {appointment.kind === 'call' ? (
                    <PhoneCall className="h-5 w-5" />
                  ) : appointment.source === 'video' ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <Newspaper className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-micro uppercase text-gold">
                    {appointment.kind === 'call' ? 'Звонок' : 'Созвон'} · {appointment.sourceLabel}
                  </p>
                  <p className="mt-1 line-clamp-2 text-body font-semibold text-text-primary">
                    {appointment.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-caption text-text-muted">
                    <Clock className="h-3.5 w-3.5" /> {formatAppointmentDateTime(appointment)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <button
                  onClick={() => openSource(appointment)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-gold/12 py-2 text-caption font-semibold text-gold"
                >
                  Открыть источник <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(appointment.id)}
                  aria-label="Отменить событие"
                  className="flex h-9 w-9 items-center justify-center rounded-btn border border-line bg-bg-elevated text-text-muted hover:border-rose/40 hover:text-rose"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- Напоминания ---------------- */
const reminders = [
  { id: 'r1', title: 'Позвонить продавцу участка в Талгаре', time: 'Сегодня до 18:00', urgent: true },
  { id: 'r2', title: 'Уточнить мощность электричества по промбазе', time: 'Завтра, 11:00', urgent: false },
  { id: 'r3', title: 'Съездить на осмотр участка в Каскелене', time: 'Четверг, 11:00–16:00', urgent: false },
];

const DISMISSED_REMINDERS_KEY = 'consai-dismissed-reminders';

function readDismissedReminders(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(DISMISSED_REMINDERS_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function RemindersScreen() {
  const { appointments, remove } = useAppointments();
  const {
    reminders: newsReminders,
    remove: removeNewsReminder,
  } = useNewsReminders();
  const [dismissed, setDismissed] = useState<string[]>(readDismissedReminders);
  const visibleReminders = reminders.filter((reminder) => !dismissed.includes(reminder.id));
  const total = visibleReminders.length + appointments.length + newsReminders.length;

  const dismissReminder = (id: string) => {
    setDismissed((current) => {
      const next = [...current, id];
      window.localStorage.setItem(DISMISSED_REMINDERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="pb-28">
      <ScreenHeader title="Напоминания" subtitle={`${total} активных`} />
      <div className="space-y-3 px-5 pt-5">
        {newsReminders.map((reminder) => (
          <div key={reminder.id} className="rounded-card border border-gold/25 bg-bg-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                <Newspaper className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-micro uppercase text-gold">Напоминание о новости · {reminder.source}</p>
                <p className="mt-1 text-body font-semibold leading-snug text-text-primary">{reminder.title}</p>
                <p className="mt-1 flex items-center gap-1 text-caption text-text-muted">
                  <Clock className="h-3.5 w-3.5" /> {formatNewsReminderDateTime(reminder)}
                </p>
              </div>
              <button
                onClick={() => removeNewsReminder(reminder.id)}
                aria-label="Удалить напоминание о новости"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-line bg-bg-elevated text-text-muted hover:border-rose/40 hover:text-rose"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {appointments.length > 0 && (
          <div className="rounded-card border border-gold/25 bg-gold/[0.05] p-4">
            <div className="mb-2 flex items-center gap-2 text-micro uppercase text-gold">
              <Sparkles className="h-4 w-4" /> AI напоминает о назначенном
            </div>
            <div className="space-y-2">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-2 text-caption text-text-primary">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="min-w-0 flex-1">
                    {appointment.kind === 'call' ? 'Звонок' : 'Созвон'}: {appointment.title}
                    <span className="block text-text-muted">{formatAppointmentDateTime(appointment)}</span>
                  </span>
                  <button
                    onClick={() => remove(appointment.id)}
                    aria-label="Удалить назначенное событие"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-elevated text-text-muted hover:border-rose/40 hover:text-rose"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {visibleReminders.map((r) => (
          <div
            key={r.id}
            className={cx(
              'flex items-start gap-3 rounded-card border bg-bg-panel p-4',
              r.urgent ? 'border-rose/30' : 'border-line',
            )}
          >
            <span
              className={cx(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                r.urgent ? 'bg-rose/15 text-rose' : 'bg-bg-elevated text-text-muted',
              )}
            >
              <BellRing className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-text-primary">{r.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-caption text-text-muted">
                <Clock className="h-3.5 w-3.5" /> {r.time}
              </p>
            </div>
            <button
              onClick={() => dismissReminder(r.id)}
              aria-label="Удалить напоминание"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-line bg-bg-elevated text-text-muted hover:border-rose/40 hover:text-rose"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {total === 0 && (
          <EmptyState icon={BellRing} text="Активных напоминаний нет." />
        )}
      </div>
    </div>
  );
}

/* ---------------- Интеграции ---------------- */
const integrations = [
  { id: 'krisha', name: 'Krisha.kz', desc: 'Недвижимость и земля', on: true },
  { id: 'olx', name: 'OLX.kz', desc: 'Оборудование и вещи', on: true },
  { id: 'tiktok', name: 'TikTok', desc: 'Видео-радар: поиск видео', on: true },
  { id: 'instagram', name: 'Instagram', desc: 'Видео-радар, где доступно', on: false },
  { id: 'telegram', name: 'Telegram', desc: 'Уведомления директору', on: false },
];

export function IntegrationsScreen() {
  const [state, setState] = useState(() => Object.fromEntries(integrations.map((i) => [i.id, i.on])));
  return (
    <div className="pb-28">
      <ScreenHeader title="Интеграции" subtitle="Источники данных помощника" />
      <div className="space-y-2.5 px-5 pt-5">
        {integrations.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-card border border-line bg-bg-panel p-4">
            <div>
              <p className="text-body font-semibold text-text-primary">{it.name}</p>
              <p className="text-caption text-text-muted">{it.desc}</p>
            </div>
            <Toggle on={state[it.id]} onToggle={() => setState((s) => ({ ...s, [it.id]: !s[it.id] }))} />
          </div>
        ))}
        <p className="px-1 pt-2 text-[11px] text-text-muted">
          В демо переключатели визуальные — реальное подключение источников на следующем этапе.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Настройки ---------------- */
export function SettingsScreen() {
  const { show, intervalSeconds, setIntervalSeconds } = usePush();
  const { theme } = useTheme();
  return (
    <div className="pb-28">
      <ScreenHeader title="Настройки" subtitle="Демо-режим" />
      <div className="space-y-4 px-5 pt-5">
        <div className="flex items-start gap-2.5 rounded-card border border-line bg-bg-panel p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-caption text-text-muted">
            Это <span className="text-text-primary">демонстрационная версия</span>. Все данные подготовлены заранее.
            Реальное подключение к источникам и распознавание голоса — следующий этап.
          </p>
        </div>

        {/* Automatic push cadence */}
        <div className="rounded-card border border-line bg-bg-panel p-4">
          <div className="mb-1 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-gold" />
            <p className="text-body font-semibold text-text-primary">Частота автоматических push</p>
          </div>
          <p className="mb-3 text-caption text-text-muted">
            Уведомления показываются по одному, с выбранной паузой между ними.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {([10, 20, 30] as PushIntervalSeconds[]).map((seconds) => (
              <button
                key={seconds}
                onClick={() => setIntervalSeconds(seconds)}
                className={cx(
                  'rounded-btn border py-2.5 text-caption font-semibold transition-colors',
                  intervalSeconds === seconds
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-line bg-bg-elevated text-text-primary hover:border-gold/40',
                )}
              >
                {seconds} сек
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-gold/25 bg-gold/[0.05] p-4">
          <div className="mb-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-gold" />
            <p className="text-body font-semibold text-text-primary">Демо-триггеры</p>
          </div>
          <p className="mb-3 text-caption text-text-muted">Для показа: вызвать push-уведомление вручную в нужный момент.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => show(0)}
              className="flex items-center justify-center gap-2 rounded-btn bg-gradient-to-b from-gold-soft to-gold py-2.5 text-caption font-semibold text-[#0B1220] active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4" /> Срочный объект (push)
            </button>
            <button
              onClick={() => show(1)}
              className="flex items-center justify-center gap-2 rounded-btn border border-line bg-bg-elevated py-2.5 text-caption font-medium text-text-primary hover:border-gold/40"
            >
              Находка видео-радара (push)
            </button>
          </div>
        </div>

        {/* Static rows */}
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-bg-panel">
          {[
            ['Тема', theme === 'light' ? 'Светлая' : 'Тёмная'],
            ['Язык', 'Русский'],
            ['Уведомления', `Каждые ${intervalSeconds} сек`],
            ['Версия', 'Демо 0.1'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-caption text-text-muted">{k}</span>
              <span className="text-caption text-text-primary">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Отключить интеграцию' : 'Включить интеграцию'}
      className={cx(
        'flex h-7 w-12 shrink-0 items-center rounded-full border p-[3px] transition-colors duration-200',
        on ? 'justify-end border-gold bg-gold' : 'justify-start border-line bg-bg-elevated',
      )}
    >
      <span
        className="block h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      />
    </button>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Bookmark; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line py-12 text-center">
      <Icon className="h-8 w-8 text-text-muted" />
      <p className="max-w-[16rem] text-caption text-text-muted">{text}</p>
    </div>
  );
}
