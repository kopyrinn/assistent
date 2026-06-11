import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { pushSamples, type PushSample } from './data/mockData';
import { formatPlanDateTime, usePlans, type ReminderLead } from './plans';
import { formatNewsReminderDateTime, useNewsReminders } from './newsReminders';

export type PushIntervalSeconds = 10 | 20 | 30;

interface PushApi {
  active: PushSample | null;
  intervalSeconds: PushIntervalSeconds;
  setIntervalSeconds: (seconds: PushIntervalSeconds) => void;
  show: (index?: number) => void;
  dismiss: () => void;
}

const PushContext = createContext<PushApi | null>(null);
const INTERVAL_STORAGE_KEY = 'consai-push-interval';

function readPushInterval(): PushIntervalSeconds {
  if (typeof window === 'undefined') return 20;
  const value = Number(window.localStorage.getItem(INTERVAL_STORAGE_KEY));
  return value === 10 || value === 20 || value === 30 ? value : 20;
}

export function PushProvider({ children }: { children: ReactNode }) {
  const { plans } = usePlans();
  const { reminders: newsReminders } = useNewsReminders();
  const [active, setActive] = useState<PushSample | null>(null);
  const [intervalSeconds, setIntervalSecondsState] = useState<PushIntervalSeconds>(readPushInterval);
  const cursor = useRef(0);
  const hideTimer = useRef<number | null>(null);
  const reminderTimers = useRef<number[]>([]);
  const newsReminderTimers = useRef<number[]>([]);

  const planPushes = useMemo<PushSample[]>(
    () =>
      plans.map((plan) => ({
        id: `push-${plan.id}`,
        importance: 'important',
        title: 'AI напоминает о плане',
        body: `${plan.title} · ${formatPlanDateTime(plan)}.`,
        target: 'calendar',
        payloadId: plan.id,
      })),
    [plans],
  );

  const queue = useMemo(() => [...pushSamples, ...planPushes], [planPushes]);

  const setIntervalSeconds = useCallback((seconds: PushIntervalSeconds) => {
    setIntervalSecondsState(seconds);
    window.localStorage.setItem(INTERVAL_STORAGE_KEY, String(seconds));
  }, []);

  const dismiss = useCallback(() => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
    setActive(null);
  }, []);

  const showSample = useCallback((sample: PushSample) => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    setActive(sample);
    hideTimer.current = window.setTimeout(() => {
      setActive(null);
      hideTimer.current = null;
    }, 4500);
  }, []);

  const show = useCallback((index?: number) => {
    if (queue.length === 0) return;

    const i = index ?? cursor.current % queue.length;
    showSample(queue[i]);
    if (index === undefined) cursor.current = (i + 1) % queue.length;
  }, [queue, showSample]);

  // Keep exactly one auto-push timer. The selected interval is a quiet period
  // after the current notification has disappeared, not a global setInterval.
  useEffect(() => {
    if (active) return;

    const timer = window.setTimeout(() => {
      show();
    }, intervalSeconds * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [active, show, intervalSeconds]);

  useEffect(() => {
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Schedule actual in-session reminders from the director's selected date and lead time.
  useEffect(() => {
    reminderTimers.current.forEach((timer) => window.clearTimeout(timer));
    reminderTimers.current = [];

    const leadMs: Record<ReminderLead, number> = {
      at_time: 0,
      '15_min': 15 * 60 * 1000,
      '1_hour': 60 * 60 * 1000,
      '1_day': 24 * 60 * 60 * 1000,
    };
    const now = Date.now();

    plans.forEach((plan) => {
      const eventAt = new Date(`${plan.date}T${plan.time}:00`).getTime();
      const reminderAt = eventAt - leadMs[plan.reminderLead];
      const delay = reminderAt - now;
      if (delay <= 0 || delay > 2_147_000_000) return;

      const timer = window.setTimeout(() => {
        showSample({
          id: `due-${plan.id}`,
          importance: 'critical',
          title: 'Пора по плану',
          body: `${plan.title} · ${formatPlanDateTime(plan)}.`,
          target: 'calendar',
          payloadId: plan.id,
        });
      }, delay);
      reminderTimers.current.push(timer);
    });

    return () => {
      reminderTimers.current.forEach((timer) => window.clearTimeout(timer));
      reminderTimers.current = [];
    };
  }, [plans, showSample]);

  useEffect(() => {
    newsReminderTimers.current.forEach((timer) => window.clearTimeout(timer));
    newsReminderTimers.current = [];
    const now = Date.now();

    newsReminders.forEach((reminder) => {
      const reminderAt = new Date(`${reminder.date}T${reminder.time}:00`).getTime();
      const delay = reminderAt - now;
      if (delay <= 0 || delay > 2_147_000_000) return;

      const timer = window.setTimeout(() => {
        showSample({
          id: `due-${reminder.id}`,
          importance: 'important',
          title: 'Напоминание о новости',
          body: `${reminder.title} · ${formatNewsReminderDateTime(reminder)}.`,
          target: 'news',
          payloadId: reminder.newsId,
        });
      }, delay);
      newsReminderTimers.current.push(timer);
    });

    return () => {
      newsReminderTimers.current.forEach((timer) => window.clearTimeout(timer));
      newsReminderTimers.current = [];
    };
  }, [newsReminders, showSample]);

  return (
    <PushContext.Provider
      value={{ active, intervalSeconds, setIntervalSeconds, show, dismiss }}
    >
      {children}
    </PushContext.Provider>
  );
}

export function usePush(): PushApi {
  const ctx = useContext(PushContext);
  if (!ctx) throw new Error('usePush must be used inside PushProvider');
  return ctx;
}
