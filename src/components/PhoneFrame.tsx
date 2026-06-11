import { useEffect, useState, type ReactNode } from 'react';

/** True on real phones (< 480px) — then we drop the device frame and go full-screen. */
export function useIsCompact(): boolean {
  const [compact, setCompact] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 480 : false,
  );
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 480);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return compact;
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const compact = useIsCompact();

  if (compact) {
    // Real mobile: app takes the whole screen, no decorative frame.
    return <div className="relative h-[100dvh] w-full overflow-hidden bg-bg-deep">{children}</div>;
  }

  return (
    <div className="stage-bg fixed inset-0 flex items-center justify-center p-6">
      {/* Device body */}
      <div
        className="phone-shell relative rounded-[46px] border border-[#2b323d] bg-[#05070b] p-[10px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
        style={{ width: 392, height: 'min(844px, calc(100dvh - 48px))' }}
      >
        {/* outer subtle gold rim glow */}
        <div
          className="phone-rim pointer-events-none absolute -inset-[1px] rounded-[46px]"
        />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-bg-deep">
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2">
            <div className="mt-2 h-[26px] w-[120px] rounded-full bg-black/90" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
