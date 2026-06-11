import { ChevronLeft, ChevronRight, CloudSun, Moon, Newspaper, Sun } from 'lucide-react';
import { useNav } from '../nav';
import { greetingByHour } from '../lib/format';
import { news, weatherWeek } from '../data/mockData';
import { useTheme } from '../theme';

const DEMO_DATE = '11 июня, четверг';

/** Home header with greeting */
export function HomeHeader() {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pt-12">
      <div className="shrink-0">
        <p className="font-display text-display-l text-text-primary">{greetingByHour()}</p>
        <p className="mt-0.5 text-caption text-text-muted">{DEMO_DATE}</p>
      </div>
      <ThemeToggle />
    </header>
  );
}

export function HomeWeatherCard() {
  const { push, selectTab } = useNav();
  const today = weatherWeek[0];

  const openWeather = () => {
    selectTab('more');
    push({ name: 'weather' });
  };

  return (
    <button
      onClick={openWeather}
      className="glass glass-edge flex w-full items-center gap-3.5 rounded-card p-4 text-left transition-all hover:border-gold/40 active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
        <CloudSun className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-text-primary">
          Погода на сегодня по оценке ИИ
        </span>
        <span className="mt-0.5 block text-caption text-text-muted">
          Талгар · средний прогноз из 3 источников
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-display text-display-l text-text-primary tnum">{today.tempC}°</span>
        <span className="block text-caption text-text-muted">{today.condition}</span>
      </span>
    </button>
  );
}

export function HomeNewsCard() {
  const { push, selectTab } = useNav();
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date))[0];

  const openNews = () => {
    selectTab('more');
    push({ name: 'news' });
  };

  return (
    <button
      onClick={openNews}
      className="glass glass-edge flex w-full items-center gap-3.5 rounded-card p-4 text-left transition-all hover:border-gold/40 active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet/12 text-violet">
        <Newspaper className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-text-primary">Новости</span>
        <span className="mt-0.5 block text-caption text-gold">Подобранные под вас от ИИ</span>
        <span className="mt-1 block truncate text-[11px] text-text-muted">{latestNews.title}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
    </button>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      aria-label={light ? 'Включить тёмную тему' : 'Включить светлую тему'}
      title={light ? 'Тёмная тема' : 'Светлая тема'}
      className="glass glass-edge flex h-11 w-11 items-center justify-center rounded-full text-gold transition-transform active:scale-95"
    >
      {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}

/** Inner-screen header with title and optional back button */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { canGoBack, back } = useNav();
  return (
    <header className="flex items-center gap-3 px-4 pt-12">
      {canGoBack && (
        <button
          onClick={back}
          aria-label="Назад"
          className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:border-gold/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="truncate font-display text-display-l text-text-primary">{title}</h1>
        {subtitle && <p className="text-caption text-text-muted">{subtitle}</p>}
      </div>
    </header>
  );
}
