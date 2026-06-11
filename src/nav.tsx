import { createContext, useContext, useCallback, useMemo, useState, type ReactNode } from 'react';

export type TabKey = 'today' | 'objects' | 'voice' | 'radar' | 'more';
export type VoiceContext = 'videoFilters' | 'newsInterests';

export type Route =
  | { name: 'today' }
  | { name: 'objects' }
  | { name: 'voice'; context?: VoiceContext }
  | { name: 'more' }
  | { name: 'listing'; id: string }
  | { name: 'video'; id: string }
  | { name: 'videoRadar' }
  | { name: 'news' }
  | { name: 'weather' }
  | { name: 'week' }
  | { name: 'favorites' }
  | { name: 'reminders' }
  | { name: 'appointments' }
  | { name: 'calendar' }
  | { name: 'integrations' }
  | { name: 'settings' };

const tabRoots: Record<TabKey, Route> = {
  today: { name: 'today' },
  objects: { name: 'objects' },
  voice: { name: 'voice' },
  radar: { name: 'videoRadar' },
  more: { name: 'more' },
};

/** Which bottom tab should glow for a given route */
export function tabForRoute(route: Route): TabKey {
  switch (route.name) {
    case 'today':
      return 'today';
    case 'objects':
    case 'listing':
      return 'objects';
    case 'voice':
      return 'voice';
    case 'videoRadar':
    case 'video':
      return 'radar';
    default:
      return 'more';
  }
}

interface NavApi {
  route: Route;
  stack: Route[];
  canGoBack: boolean;
  selectTab: (tab: TabKey) => void;
  push: (route: Route) => void;
  back: () => void;
  openListing: (id: string) => void;
  openVideo: (id: string) => void;
}

const NavContext = createContext<NavApi | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'today' }]);

  const push = useCallback((route: Route) => {
    setStack((s) => [...s, route]);
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const selectTab = useCallback((tab: TabKey) => {
    setStack((s) => {
      const current = s[s.length - 1];
      // Re-tapping the active tab pops to its root
      if (tabForRoute(current) === tab) return [tabRoots[tab]];
      return [tabRoots[tab]];
    });
  }, []);

  const openListing = useCallback((id: string) => push({ name: 'listing', id }), [push]);
  const openVideo = useCallback((id: string) => push({ name: 'video', id }), [push]);

  const value = useMemo<NavApi>(
    () => ({
      route: stack[stack.length - 1],
      stack,
      canGoBack: stack.length > 1,
      selectTab,
      push,
      back,
      openListing,
      openVideo,
    }),
    [stack, selectTab, push, back, openListing, openVideo],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavApi {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside NavProvider');
  return ctx;
}
