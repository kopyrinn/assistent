import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, CalendarDays, CloudRain, Home, Newspaper, Radar, type LucideIcon } from 'lucide-react';
import { usePush } from '../push';
import { useNav } from '../nav';
import type { PushTarget } from '../data/mockData';
import { importanceStyle, prefersReducedMotion } from '../lib/format';

const targetIcons: Record<PushTarget, LucideIcon> = {
  listing: Home,
  video: Radar,
  weather: CloudRain,
  news: Newspaper,
  reminders: BellRing,
  calendar: CalendarDays,
};

export function PushOverlay() {
  const { active, dismiss } = usePush();
  const { push, selectTab } = useNav();
  const reduced = prefersReducedMotion();

  const handleTap = () => {
    if (!active) return;
    switch (active.target) {
      case 'listing':
        if (active.payloadId) push({ name: 'listing', id: active.payloadId });
        break;
      case 'video':
        if (active.payloadId) {
          selectTab('radar');
          push({ name: 'video', id: active.payloadId });
        }
        break;
      case 'weather':
        selectTab('more');
        push({ name: 'weather' });
        break;
      case 'news':
        selectTab('more');
        push({ name: 'news' });
        break;
      case 'reminders':
        selectTab('more');
        push({ name: 'reminders' });
        break;
      case 'calendar':
        selectTab('more');
        push({ name: 'calendar' });
        break;
    }
    dismiss();
  };

  const Icon = active ? targetIcons[active.target] : Home;

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-x-0 top-2 z-[60] flex justify-center px-3">
          <motion.button
            key={active.id}
            onClick={handleTap}
            initial={reduced ? { opacity: 0 } : { y: -120, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: -120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="pointer-events-auto w-full text-left"
          >
            <div className="glass-strong glass-edge overflow-hidden rounded-[22px] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85)]">
              <div className="flex items-start gap-3 p-3.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: 'linear-gradient(135deg, rgb(var(--gold-soft)), rgb(var(--gold)))' }}
                >
                  <Icon className="h-5 w-5 text-[#0B1220]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-caption font-semibold text-text-primary">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: importanceStyle[active.importance].color }}
                      />
                      <span className="truncate">{active.title}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-text-muted">сейчас</span>
                  </div>
                  <p className="mt-1 text-caption leading-snug text-text-muted">{active.body}</p>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
