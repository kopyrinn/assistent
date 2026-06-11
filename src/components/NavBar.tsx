import { Home, Map, Mic, Radar, LayoutGrid } from 'lucide-react';
import { useNav, tabForRoute, type TabKey } from '../nav';
import { cx } from './ui';

const items: { key: Exclude<TabKey, 'voice'>; label: string; Icon: typeof Home }[] = [
  { key: 'today', label: 'Сегодня', Icon: Home },
  { key: 'objects', label: 'Объекты', Icon: Map },
  { key: 'radar', label: 'Радар', Icon: Radar },
  { key: 'more', label: 'Ещё', Icon: LayoutGrid },
];

export function NavBar() {
  const { route, selectTab } = useNav();
  const active = tabForRoute(route);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-5">
      <div className="pointer-events-auto relative">
        {/* Center mic FAB, lifted above the floating bar */}
        <button
          onClick={() => selectTab('voice')}
          aria-label="Голосовой помощник"
          className={cx(
            'mic-fab absolute -top-7 left-1/2 z-50 flex h-[62px] w-[62px] -translate-x-1/2 items-center justify-center rounded-full',
            'text-text-primary transition-transform duration-200 active:scale-95',
            active === 'voice' && 'mic-fab-active',
          )}
        >
          <span className="mic-fab-glare pointer-events-none absolute inset-[3px] rounded-full" />
          <span className="mic-fab-core relative flex h-11 w-11 items-center justify-center rounded-full">
            <Mic className="relative h-[22px] w-[22px]" strokeWidth={2.4} />
          </span>
        </button>

        <nav className="glass-strong glass-edge flex items-center justify-between rounded-[26px] px-3 py-2.5">
          <div className="flex flex-1 justify-around pr-7">
            {items.slice(0, 2).map((it) => (
              <TabButton key={it.key} label={it.label} Icon={it.Icon} active={active === it.key} onClick={() => selectTab(it.key)} />
            ))}
          </div>
          <div className="flex flex-1 justify-around pl-7">
            {items.slice(2).map((it) => (
              <TabButton key={it.key} label={it.label} Icon={it.Icon} active={active === it.key} onClick={() => selectTab(it.key)} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function TabButton({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string;
  Icon: typeof Home;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex flex-col items-center gap-1 rounded-xl px-2 py-1 transition-colors',
        active ? 'text-gold' : 'text-text-muted hover:text-text-primary',
      )}
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.9} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
