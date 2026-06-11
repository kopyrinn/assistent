import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'consai-news-reminders';

export interface NewsReminder {
  id: string;
  newsId: string;
  title: string;
  source: string;
  date: string;
  time: string;
  createdAt: number;
}

export interface NewsReminderInput {
  newsId: string;
  title: string;
  source: string;
}

interface NewsRemindersApi {
  reminders: NewsReminder[];
  count: number;
  pending: NewsReminderInput | null;
  openScheduler: (input: NewsReminderInput) => void;
  closeScheduler: () => void;
  confirm: (date: string, time: string) => void;
  remove: (id: string) => void;
  getForNews: (newsId: string) => NewsReminder | undefined;
}

const NewsRemindersContext = createContext<NewsRemindersApi | null>(null);

function readStored(): NewsReminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function NewsRemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<NewsReminder[]>(readStored);
  const [pending, setPending] = useState<NewsReminderInput | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const confirm = useCallback((date: string, time: string) => {
    if (!pending) return;

    setReminders((current) => {
      const next: NewsReminder = {
        ...pending,
        id: `news-reminder:${pending.newsId}`,
        date,
        time,
        createdAt: Date.now(),
      };
      const updated = current.some((item) => item.newsId === pending.newsId)
        ? current.map((item) => (item.newsId === pending.newsId ? next : item))
        : [...current, next];
      return updated.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
    });
    setPending(null);
  }, [pending]);

  const remove = useCallback((id: string) => {
    setReminders((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<NewsRemindersApi>(
    () => ({
      reminders,
      count: reminders.length,
      pending,
      openScheduler: setPending,
      closeScheduler: () => setPending(null),
      confirm,
      remove,
      getForNews: (newsId) => reminders.find((item) => item.newsId === newsId),
    }),
    [reminders, pending, confirm, remove],
  );

  return <NewsRemindersContext.Provider value={value}>{children}</NewsRemindersContext.Provider>;
}

export function formatNewsReminderDateTime(reminder: Pick<NewsReminder, 'date' | 'time'>): string {
  const date = new Date(`${reminder.date}T12:00:00`);
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
  return `${formatted}, ${reminder.time}`;
}

export function useNewsReminders(): NewsRemindersApi {
  const context = useContext(NewsRemindersContext);
  if (!context) throw new Error('useNewsReminders must be used inside NewsRemindersProvider');
  return context;
}
