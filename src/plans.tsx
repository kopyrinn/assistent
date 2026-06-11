import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'consai-director-plans';

export type ReminderLead = 'at_time' | '15_min' | '1_hour' | '1_day';

export interface DirectorPlan {
  id: string;
  title: string;
  date: string;
  time: string;
  reminderLead: ReminderLead;
  createdBy: 'voice' | 'manual';
  createdAt: number;
}

interface AddPlanInput {
  title: string;
  date: string;
  time: string;
  reminderLead: ReminderLead;
  createdBy: DirectorPlan['createdBy'];
}

interface PlansApi {
  plans: DirectorPlan[];
  count: number;
  addPlan: (input: AddPlanInput) => void;
  removePlan: (id: string) => void;
}

const PlansContext = createContext<PlansApi | null>(null);

function readPlans(): DirectorPlan[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<DirectorPlan[]>(readPlans);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const addPlan = useCallback((input: AddPlanInput) => {
    setPlans((current) =>
      [
        ...current,
        {
          ...input,
          id: `plan-${Date.now()}`,
          createdAt: Date.now(),
        },
      ].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
    );
  }, []);

  const removePlan = useCallback((id: string) => {
    setPlans((current) => current.filter((plan) => plan.id !== id));
  }, []);

  const value = useMemo(
    () => ({ plans, count: plans.length, addPlan, removePlan }),
    [plans, addPlan, removePlan],
  );

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>;
}

export function formatPlanDateTime(plan: Pick<DirectorPlan, 'date' | 'time'>): string {
  const date = new Date(`${plan.date}T12:00:00`);
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  }).format(date);
  return `${formatted}, ${plan.time}`;
}

export function reminderLeadLabel(value: ReminderLead): string {
  const labels: Record<ReminderLead, string> = {
    at_time: 'В момент события',
    '15_min': 'За 15 минут',
    '1_hour': 'За 1 час',
    '1_day': 'За 1 день',
  };
  return labels[value];
}

export function usePlans(): PlansApi {
  const context = useContext(PlansContext);
  if (!context) throw new Error('usePlans must be used inside PlansProvider');
  return context;
}
