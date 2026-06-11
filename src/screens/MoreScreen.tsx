import {
  Newspaper,
  CloudSun,
  CalendarRange,
  Bookmark,
  BellRing,
  Plug,
  Settings,
  CalendarClock,
  CalendarDays,
} from 'lucide-react';
import { useNav, type Route } from '../nav';
import { ScreenHeader } from '../components/TopBar';
import { news } from '../data/mockData';
import { cx } from '../components/ui';
import { useFavorites } from '../favorites';
import { useAppointments } from '../appointments';
import { usePlans } from '../plans';
import { useNewsReminders } from '../newsReminders';

export function MoreScreen() {
  const { push } = useNav();
  const { count } = useFavorites();
  const { count: appointmentCount } = useAppointments();
  const { count: planCount } = usePlans();
  const { count: newsReminderCount } = useNewsReminders();
  const tiles: { route: Route['name']; label: string; status: string; Icon: typeof Newspaper; accent?: boolean }[] = [
    { route: 'news', label: 'Новости', status: `${news.length} с пояснением AI`, Icon: Newspaper },
    { route: 'weather', label: 'Погода', status: 'Пятница — ветер 16 м/с', Icon: CloudSun },
    { route: 'week', label: 'Итоги недели', status: '14 важных находок', Icon: CalendarRange },
    {
      route: 'favorites',
      label: 'Избранное',
      status: count === 0 ? 'Пока ничего не сохранено' : `${count} сохранено`,
      Icon: Bookmark,
    },
    {
      route: 'appointments',
      label: 'Встречи и звонки',
      status: appointmentCount === 0 ? 'Пока ничего не назначено' : `${appointmentCount} назначено`,
      Icon: CalendarClock,
      accent: appointmentCount > 0,
    },
    {
      route: 'calendar',
      label: 'Календарь',
      status: planCount === 0 ? 'Продиктуйте планы AI' : `${planCount} планов · push включён`,
      Icon: CalendarDays,
      accent: planCount > 0,
    },
    {
      route: 'reminders',
      label: 'Напоминания',
      status:
        appointmentCount + newsReminderCount > 0
          ? `AI напомнит: ${appointmentCount + newsReminderCount}`
          : '1 на сегодня',
      Icon: BellRing,
    },
    { route: 'integrations', label: 'Интеграции', status: '5 подключений', Icon: Plug },
    { route: 'settings', label: 'Настройки', status: 'Демо-режим', Icon: Settings },
  ];

  return (
    <div className="pb-28">
      <ScreenHeader title="Ещё" subtitle="Радар, новости, погода и настройки" />

      <div className="grid grid-cols-2 gap-2.5 px-5 pt-5">
        {tiles.map((t) => (
          <button
            key={t.route}
            onClick={() => push({ name: t.route } as Route)}
            className={cx(
              'group flex flex-col items-start gap-3 rounded-card border bg-bg-panel p-4 text-left transition-all hover:bg-bg-elevated active:scale-[0.98]',
              t.route === 'settings' && 'col-span-2',
              t.accent ? 'border-gold/30 hover:border-gold/50' : 'border-line hover:border-gold/30',
            )}
          >
            <span
              className={cx(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                t.accent ? 'bg-gold/15 text-gold' : 'bg-bg-elevated text-text-primary',
              )}
            >
              <t.Icon className="h-5 w-5" />
            </span>
            <span className="w-full">
              <span className="block text-body font-semibold text-text-primary">{t.label}</span>
              <span className="mt-0.5 block text-caption text-text-muted">{t.status}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
