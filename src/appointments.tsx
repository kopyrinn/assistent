import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'consai-appointments';

export type AppointmentKind = 'call' | 'meeting';
export type AppointmentSource = 'listing' | 'video' | 'news';

export interface Appointment {
  id: string;
  kind: AppointmentKind;
  source: AppointmentSource;
  sourceId: string;
  title: string;
  sourceLabel: string;
  date: string;
  time: string;
  createdAt: number;
}

export interface ScheduleInput {
  kind: AppointmentKind;
  source: AppointmentSource;
  sourceId: string;
  title: string;
  sourceLabel: string;
}

interface AppointmentsApi {
  appointments: Appointment[];
  count: number;
  pending: ScheduleInput | null;
  openScheduler: (input: ScheduleInput) => void;
  closeScheduler: () => void;
  confirmSchedule: (date: string, time: string, kind: AppointmentKind) => void;
  remove: (id: string) => void;
  getForSource: (source: AppointmentSource, sourceId: string) => Appointment | undefined;
}

const AppointmentsContext = createContext<AppointmentsApi | null>(null);

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];

    const stored = JSON.parse(value) as Appointment[];
    return stored.map((item) => ({
      ...item,
      date: item.date || localDateString(new Date()),
      time: item.time.match(/\d{2}:\d{2}/)?.[0] || item.time,
    }));
  } catch {
    return [];
  }
}

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(readStoredAppointments);
  const [pending, setPending] = useState<ScheduleInput | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const openScheduler = useCallback((input: ScheduleInput) => {
    setPending(input);
  }, []);

  const closeScheduler = useCallback(() => {
    setPending(null);
  }, []);

  const confirmSchedule = useCallback((date: string, time: string, kind: AppointmentKind) => {
    if (!pending) return;

    setAppointments((current) => {
      const next: Appointment = {
        ...pending,
        kind,
        id: `${pending.source}:${pending.sourceId}`,
        date,
        time,
        createdAt: Date.now(),
      };
      const existing = current.findIndex(
        (item) => item.source === pending.source && item.sourceId === pending.sourceId,
      );

      const updated =
        existing === -1
          ? [...current, next]
          : current.map((item, index) => (index === existing ? next : item));

      return updated.sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
      );
    });
    setPending(null);
  }, [pending]);

  const remove = useCallback((id: string) => {
    setAppointments((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<AppointmentsApi>(
    () => ({
      appointments,
      count: appointments.length,
      pending,
      openScheduler,
      closeScheduler,
      confirmSchedule,
      remove,
      getForSource: (source, sourceId) =>
        appointments.find((item) => item.source === source && item.sourceId === sourceId),
    }),
    [appointments, pending, openScheduler, closeScheduler, confirmSchedule, remove],
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function formatAppointmentDateTime(appointment: Pick<Appointment, 'date' | 'time'>): string {
  const date = new Date(`${appointment.date}T12:00:00`);
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
  return `${formatted}, ${appointment.time}`;
}

export function useAppointments(): AppointmentsApi {
  const context = useContext(AppointmentsContext);
  if (!context) throw new Error('useAppointments must be used inside AppointmentsProvider');
  return context;
}
