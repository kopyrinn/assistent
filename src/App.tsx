import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { NavProvider, useNav, type Route } from './nav';
import { PushProvider, usePush } from './push';
import { FavoritesProvider } from './favorites';
import { AppointmentsProvider } from './appointments';
import { NewsRemindersProvider } from './newsReminders';
import { PlansProvider } from './plans';
import { ThemeProvider } from './theme';
import { PhoneFrame, useIsCompact } from './components/PhoneFrame';
import { NavBar } from './components/NavBar';
import { PushOverlay } from './components/PushOverlay';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { NewsReminderScheduler } from './components/NewsReminderScheduler';
import { prefersReducedMotion } from './lib/format';

import { TodayScreen } from './screens/TodayScreen';
import { ObjectsScreen } from './screens/ObjectsScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { MoreScreen } from './screens/MoreScreen';
import { VideoRadarScreen } from './screens/VideoRadarScreen';
import { VideoDetailScreen } from './screens/VideoDetailScreen';
import { NewsScreen } from './screens/NewsScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { VoiceScreen } from './screens/VoiceScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import {
  WeekScreen,
  FavoritesScreen,
  RemindersScreen,
  IntegrationsScreen,
  SettingsScreen,
  AppointmentsScreen,
} from './screens/MiscScreens';

function routeKey(route: Route): string {
  if (route.name === 'listing' || route.name === 'video') return `${route.name}:${route.id}`;
  if (route.name === 'voice') return `voice:${route.context ?? 'default'}`;
  return route.name;
}

function renderScreen(route: Route) {
  switch (route.name) {
    case 'today':
      return <TodayScreen />;
    case 'objects':
      return <ObjectsScreen />;
    case 'listing':
      return <ListingDetailScreen id={route.id} />;
    case 'voice':
      return <VoiceScreen context={route.context} />;
    case 'more':
      return <MoreScreen />;
    case 'videoRadar':
      return <VideoRadarScreen />;
    case 'video':
      return <VideoDetailScreen id={route.id} />;
    case 'news':
      return <NewsScreen />;
    case 'weather':
      return <WeatherScreen />;
    case 'week':
      return <WeekScreen />;
    case 'favorites':
      return <FavoritesScreen />;
    case 'reminders':
      return <RemindersScreen />;
    case 'appointments':
      return <AppointmentsScreen />;
    case 'calendar':
      return <CalendarScreen />;
    case 'integrations':
      return <IntegrationsScreen />;
    case 'settings':
      return <SettingsScreen />;
  }
}

function AppShell() {
  const { route } = useNav();
  const reduced = prefersReducedMotion();
  const key = routeKey(route);
  // iOS pattern: pushed detail screens (with their own bottom toolbar) hide the tab bar
  const showNav = route.name !== 'listing' && route.name !== 'video';

  return (
    <div className="app-surface relative flex h-full flex-col bg-bg-deep">
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="phone-scroll absolute inset-0 overflow-y-auto overscroll-contain"
          >
            {renderScreen(route)}
          </motion.div>
        </AnimatePresence>
      </main>

      <PushOverlay />
      <AppointmentScheduler />
      <NewsReminderScheduler />
      {showNav && <NavBar />}
    </div>
  );
}

function DesktopPushTrigger() {
  const { show } = usePush();
  const compact = useIsCompact();
  if (compact) return null;
  return (
    <button
      onClick={() => show()}
      title="Показать пример уведомления"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-line bg-bg-panel/80 px-4 py-2.5 text-caption text-text-muted backdrop-blur transition-all hover:border-gold/40 hover:text-gold"
    >
      <Bell className="h-4 w-4" />
      Показать push
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlansProvider>
        <NewsRemindersProvider>
          <PushProvider>
            <FavoritesProvider>
              <AppointmentsProvider>
                <NavProvider>
                  <PhoneFrame>
                    <AppShell />
                  </PhoneFrame>
                  <DesktopPushTrigger />
                </NavProvider>
              </AppointmentsProvider>
            </FavoritesProvider>
          </PushProvider>
        </NewsRemindersProvider>
      </PlansProvider>
    </ThemeProvider>
  );
}
