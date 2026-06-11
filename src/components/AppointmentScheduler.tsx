import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, Clock, Pencil, PhoneCall, Video, X } from 'lucide-react';
import { useAppointments, type AppointmentKind } from '../appointments';
import { cx } from './ui';

const times = ['09:00', '11:00', '14:00', '16:00', '18:00'];

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AppointmentScheduler() {
  const { pending, closeScheduler, confirmSchedule, getForSource } = useAppointments();
  const existing = pending ? getForSource(pending.source, pending.sourceId) : undefined;
  const [date, setDate] = useState(localDateString(new Date()));
  const [time, setTime] = useState('11:00');
  const [customTime, setCustomTime] = useState(false);
  const [kind, setKind] = useState<AppointmentKind>('meeting');

  const quickDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const value = new Date();
        value.setDate(value.getDate() + index);
        return value;
      }),
    [],
  );

  useEffect(() => {
    if (!pending) return;
    setDate(existing?.date || localDateString(new Date()));
    setTime(existing?.time || '11:00');
    setCustomTime(Boolean(existing?.time && !times.includes(existing.time)));
    setKind(existing?.kind || pending.kind);
  }, [pending, existing]);

  return (
    <AnimatePresence>
      {pending && (
        <div className="absolute inset-0 z-[80] flex items-end">
          <motion.button
            aria-label="Закрыть календарь"
            onClick={closeScheduler}
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="glass-strong relative z-10 w-full rounded-t-[30px] border-t border-line px-5 pb-7 pt-4 shadow-[0_-24px_70px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-title text-text-primary">
                  {existing ? 'Изменить событие' : 'Назначить событие'}
                </p>
                <p className="mt-0.5 line-clamp-1 text-caption text-text-muted">{pending.title}</p>
              </div>
              <button
                onClick={closeScheduler}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-text-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <KindButton
                active={kind === 'call'}
                icon={PhoneCall}
                label="Звонок"
                onClick={() => setKind('call')}
              />
              <KindButton
                active={kind === 'meeting'}
                icon={Video}
                label="Созвон"
                onClick={() => setKind('meeting')}
              />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-caption font-semibold text-text-primary">
                <CalendarDays className="h-4 w-4 text-gold" /> Дата
              </span>
              <input
                type="date"
                value={date}
                min={localDateString(new Date())}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-lg border border-line bg-bg-elevated px-2 py-1 text-caption text-text-primary [color-scheme:dark]"
              />
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {quickDates.map((item) => {
                const value = localDateString(item);
                const active = value === date;
                return (
                  <button
                    key={value}
                    onClick={() => setDate(value)}
                    className={cx(
                      'rounded-xl border py-2 text-center transition-colors',
                      active
                        ? 'border-gold bg-gold text-[#0B1220]'
                        : 'border-line bg-bg-elevated text-text-muted',
                    )}
                  >
                    <span className="block text-[9px] font-semibold uppercase">
                      {new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(item)}
                    </span>
                    <span className="mt-0.5 block text-caption font-semibold">{item.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-2 text-caption font-semibold text-text-primary">
              <Clock className="h-4 w-4 text-gold" /> Время
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {times.map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setTime(value);
                    setCustomTime(false);
                  }}
                  className={cx(
                    'rounded-xl border py-2 text-caption font-semibold transition-colors',
                    value === time && !customTime
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-line bg-bg-elevated text-text-primary',
                  )}
                >
                  {value}
                </button>
              ))}
              <button
                onClick={() => setCustomTime(true)}
                className={cx(
                  'flex items-center justify-center gap-1.5 rounded-xl border py-2 text-caption font-semibold transition-colors',
                  customTime
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-line bg-bg-elevated text-text-primary',
                )}
              >
                <Pencil className="h-3.5 w-3.5" /> Своё
              </button>
            </div>

            {customTime && (
              <label className="mt-3 flex items-center justify-between gap-3 rounded-btn border border-gold/30 bg-gold/[0.05] px-3 py-2.5">
                <span className="text-caption text-text-primary">Введите время</span>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="rounded-lg border border-line bg-bg-elevated px-3 py-1.5 text-caption font-semibold text-text-primary [color-scheme:dark]"
                />
              </label>
            )}

            <button
              onClick={() => confirmSchedule(date, time, kind)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-btn bg-gradient-to-b from-gold-soft to-gold py-3 text-body font-semibold text-[#0B1220] shadow-gold-glow"
            >
              <Check className="h-5 w-5" />
              {existing ? 'Сохранить изменения' : 'Назначить'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function KindButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof PhoneCall;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex items-center justify-center gap-2 rounded-btn border py-2.5 text-caption font-semibold',
        active
          ? 'border-gold/50 bg-gold/12 text-gold'
          : 'border-line bg-bg-elevated text-text-muted',
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
