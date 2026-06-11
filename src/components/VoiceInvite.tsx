import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNav } from '../nav';
import { voiceScenarios } from '../data/mockData';
import { prefersReducedMotion } from '../lib/format';

/** Wide tappable voice prompt with cycling example commands */
export function VoiceInvite() {
  const { selectTab } = useNav();
  const examples = voiceScenarios.map((s) => s.command);
  const [i, setI] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((p) => (p + 1) % examples.length), 3200);
    return () => clearInterval(t);
  }, [examples.length, reduced]);

  return (
    <button
      onClick={() => selectTab('voice')}
      className="glass glass-edge group flex w-full items-center gap-3.5 rounded-card p-4 text-left transition-all hover:border-gold/40 hover:shadow-gold-glow active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-[#0B1220] shadow-gold-glow">
        <Mic className="h-6 w-6" strokeWidth={2.3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-text-primary">Спросите что угодно</span>
        <span className="block h-[18px] overflow-hidden text-caption text-text-muted">
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={reduced ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="block truncate"
            >
              «{examples[i]}»
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </button>
  );
}
