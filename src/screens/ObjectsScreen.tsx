import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownWideNarrow } from 'lucide-react';
import { listings } from '../data/mockData';
import { useNav } from '../nav';
import { ScreenHeader } from '../components/TopBar';
import { Segment } from '../components/Segment';
import { ListingCard } from '../components/ListingCard';
import { prefersReducedMotion } from '../lib/format';

type Filter = 'all' | 'krisha' | 'olx';

export function ObjectsScreen() {
  const { openListing } = useNav();
  const [filter, setFilter] = useState<Filter>('all');
  const reduced = prefersReducedMotion();

  const visible = useMemo(() => {
    const arr = filter === 'all' ? listings : listings.filter((l) => l.source === filter);
    return [...arr].sort((a, b) => b.aiScore - a.aiScore);
  }, [filter]);

  return (
    <div className="pb-28">
      <ScreenHeader title="Объекты" subtitle={`${listings.length} объектов · Krisha + OLX`} />

      <div className="objects-filter-bar sticky top-0 z-20 mt-4 space-y-2.5 border-y border-line/60 px-5 pb-3 pt-2 backdrop-blur-xl">
        <Segment<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Все' },
            { value: 'krisha', label: 'Krisha' },
            { value: 'olx', label: 'OLX' },
          ]}
        />
        <div className="flex items-center gap-1.5 text-caption text-text-muted">
          <ArrowDownWideNarrow className="h-4 w-4" />
          Сортировка: <span className="text-text-primary">по AI-оценке</span>
        </div>
      </div>

      <div className="space-y-3.5 px-5 pt-1">
        {visible.map((l, i) => (
          <motion.div
            key={l.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : i * 0.05, duration: 0.35 }}
          >
            <ListingCard listing={l} onOpen={() => openListing(l.id)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
