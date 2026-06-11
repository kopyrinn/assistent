import { useState, type FormEvent } from 'react';
import { Sun, CloudRain, Cloud, CloudSun, Wind, Droplets, Sparkles, MapPin, Database, Plus, X } from 'lucide-react';
import {
  weatherLocations,
  weatherSources,
  type WeatherDay,
  type WeatherLocation,
  type WeatherLocationKey,
} from '../data/mockData';
import { ScreenHeader } from '../components/TopBar';
import { cx } from '../components/ui';

function iconFor(condition: string): typeof Sun {
  const c = condition.toLowerCase();
  if (c.includes('дожд')) return CloudRain;
  if (c.includes('ясно')) return Sun;
  if (c.includes('перем')) return CloudSun;
  return Cloud;
}

function isBad(d: WeatherDay): boolean {
  return d.windMs >= 14 || d.rainPct >= 70;
}

export function WeatherScreen() {
  const [locationKey, setLocationKey] = useState<string>('talgar');
  const [customLocations, setCustomLocations] = useState<Record<string, WeatherLocation>>({});
  const [addingLocation, setAddingLocation] = useState(false);
  const [locationName, setLocationName] = useState('');
  const allLocations: Record<string, WeatherLocation> = { ...weatherLocations, ...customLocations };
  const location = allLocations[locationKey] ?? weatherLocations.talgar;
  const today = location.week[0];
  const TodayIcon = iconFor(today.condition);
  const locationEntries: [string, WeatherLocation][] = [
    ...(Object.entries(weatherLocations) as [WeatherLocationKey, WeatherLocation][]),
    ...Object.entries(customLocations),
  ];

  const addLocation = (event: FormEvent) => {
    event.preventDefault();
    const name = locationName.trim();
    if (!name) return;

    const key = `custom-${Date.now()}`;
    const base = location;
    setCustomLocations((current) => ({
      ...current,
      [key]: {
        label: name,
        shortLabel: name,
        week: base.week.map((day) => ({ ...day })),
        aggregationNote:
          `AI добавил геолокацию «${name}» и сопоставил её с ближайшими доступными погодными данными. ` +
          'Ниже показан средний прогноз трёх источников.',
        aiAdvice:
          `Для геолокации «${name}» AI использует ближайшую региональную модель. ` +
          'Перед выездом к объекту проверьте обновление прогноза за 2–3 часа.',
      },
    }));
    setLocationKey(key);
    setLocationName('');
    setAddingLocation(false);
  };

  return (
    <div className="pb-28">
      <ScreenHeader title="Погода" subtitle="Сводный прогноз из нескольких источников" />

      <div className="space-y-5 px-5 pt-5">
        {/* AI advice */}
        <div className="rounded-card border border-gold/30 bg-gold/[0.05] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-micro uppercase text-gold">Совет AI для {location.shortLabel}</span>
          </div>
          <p className="text-body leading-relaxed text-text-primary">{location.aiAdvice}</p>
        </div>

        {/* Location filter */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-caption font-semibold text-text-primary">
            <MapPin className="h-4 w-4 text-gold" />
            Геолокация прогноза
          </div>
          <p className="mb-3 text-caption leading-relaxed text-text-muted">
            Города подобраны AI по объектам, которые вы выбрали для просмотра. Можно добавить свою геолокацию.
          </p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {locationEntries.map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setLocationKey(key)}
                  className={cx(
                    'shrink-0 rounded-full border px-3.5 py-2 text-caption font-semibold transition-colors',
                    locationKey === key
                      ? 'border-gold bg-gold text-[#0B1220]'
                      : 'border-line bg-bg-panel text-text-muted hover:border-gold/40 hover:text-text-primary',
                  )}
                >
                  {item.shortLabel}
                </button>
              ))}
            <button
              onClick={() => setAddingLocation(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-gold/50 bg-gold/[0.06] px-3.5 py-2 text-caption font-semibold text-gold transition-colors hover:bg-gold/[0.12]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить
            </button>
          </div>

          {addingLocation && (
            <form onSubmit={addLocation} className="glass glass-edge mt-3 flex items-center gap-2 rounded-btn p-2">
              <MapPin className="ml-1 h-4 w-4 shrink-0 text-gold" />
              <input
                autoFocus
                value={locationName}
                onChange={(event) => setLocationName(event.target.value)}
                placeholder="Введите город или район"
                className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-caption text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                type="submit"
                disabled={!locationName.trim()}
                className="rounded-lg bg-gold px-3 py-1.5 text-caption font-semibold text-[#0B1220] disabled:opacity-40"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingLocation(false);
                  setLocationName('');
                }}
                aria-label="Закрыть"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* AI source transparency */}
        <div className="rounded-card border border-gold/30 bg-gold/[0.05] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-micro uppercase text-gold">Сводка от AI</p>
              <p className="mt-1.5 text-caption leading-relaxed text-text-primary">
                {location.aggregationNote}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {weatherSources.map((source) => (
              <span
                key={source.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-deep/55 px-2.5 py-1 text-[11px] text-text-primary"
                title={source.detail}
              >
                <Database className="h-3 w-3 text-gold" />
                {source.name}
              </span>
            ))}
          </div>

          <p className="mt-2.5 text-[11px] text-text-muted">
            Обновлено 11 июня в 09:00 · 3 источника · данные демо
          </p>
        </div>

        {/* Today widget */}
        <div className="weather-today-card flex items-center justify-between rounded-card border border-line p-5">
          <div>
            <p className="mb-2 text-micro uppercase text-text-muted">Средний прогноз на сегодня</p>
            <div className="flex items-center gap-1.5 text-caption text-text-muted">
              <MapPin className="h-3.5 w-3.5" /> {location.label}
            </div>
            <p className="mt-1 font-display text-display-xl text-text-primary tnum">{today.tempC}°</p>
            <p className="text-caption text-text-primary">{today.condition}</p>
            <div className="mt-2 flex gap-3 text-caption text-text-muted">
              <span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5" />{today.windMs} м/с</span>
              <span className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5" />{today.rainPct}%</span>
            </div>
          </div>
          <TodayIcon className="h-16 w-16 text-gold-soft" strokeWidth={1.4} />
        </div>

        {/* 7-day track */}
        <section>
          <h2 className="font-display text-title text-text-primary">Усреднённый прогноз на неделю</h2>
          <p className="mb-3 mt-0.5 text-caption text-text-muted">Сводные значения трёх погодных источников</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {location.week.map((d) => {
              const Icon = iconFor(d.condition);
              const bad = isBad(d);
              return (
                <div
                  key={d.day}
                  className={cx(
                    'flex w-[68px] shrink-0 flex-col items-center gap-2 rounded-card border p-3',
                    bad ? 'border-rose/40 bg-rose/[0.08]' : 'border-line bg-bg-panel',
                  )}
                >
                  <span className={cx('text-caption font-semibold', bad ? 'text-rose' : 'text-text-primary')}>{d.day}</span>
                  <Icon className={cx('h-6 w-6', bad ? 'text-rose' : 'text-gold-soft')} strokeWidth={1.6} />
                  <span className="font-display text-body text-text-primary tnum">{d.tempC}°</span>
                  <span className={cx('flex items-center gap-0.5 text-[10px]', bad ? 'text-rose' : 'text-text-muted')}>
                    <Wind className="h-3 w-3" />{d.windMs}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
