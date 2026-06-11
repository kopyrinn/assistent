import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sliders, Sparkles, Check, ChevronDown, Wand2, MessageCircle, ArrowRight } from 'lucide-react';
import { videoFinds, videoInterests, videoAutoTags, videoPipeline } from '../data/mockData';
import { useNav } from '../nav';
import { ScreenHeader } from '../components/TopBar';
import { Segment } from '../components/Segment';
import { VideoCard } from '../components/VideoCard';
import { Pill, cx } from '../components/ui';
import { prefersReducedMotion } from '../lib/format';

type Plat = 'all' | 'tiktok' | 'instagram';

export function VideoRadarScreen() {
  const { openVideo, push } = useNav();
  const [plat, setPlat] = useState<Plat>('all');

  const visible = videoFinds.filter((v) => plat === 'all' || v.platform === plat);
  const pipelineCardId = videoFinds.find((v) => v.aiRelevant)?.id;

  return (
    <div className="pb-28">
      <ScreenHeader title="Видео-радар" subtitle="Публичные TikTok / Instagram по вашим темам" />

      {/* Interests */}
      <div className="space-y-3 px-5 pt-4">
        <div className="rounded-card border border-line bg-bg-panel p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-micro uppercase text-text-muted">Ваши интересы</span>
            <button className="flex items-center gap-1 text-caption text-gold hover:text-gold-soft">
              <Sliders className="h-3.5 w-3.5" /> Настроить
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {videoInterests.map((t) => (
              <Pill key={t} tone="gold">{t}</Pill>
            ))}
          </div>

          <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-violet/25 bg-violet/[0.06] p-3">
            <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
            <div>
              <p className="text-caption text-text-primary">AI сам подобрал, что искать:</p>
              <p className="mt-1 font-mono text-caption text-violet">{videoAutoTags.join(' ')}</p>
            </div>
          </div>

          <button
            onClick={() => push({ name: 'voice', context: 'videoFilters' })}
            className="glass glass-edge mt-3 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left transition-all hover:border-gold/45 active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
              <MessageCircle className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-caption font-semibold text-text-primary">Обсудить фильтр с AI</span>
              <span className="mt-0.5 block text-[11px] text-text-muted">Что добавить, убрать или уточнить</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-gold" />
          </button>
        </div>

        <Segment<Plat>
          value={plat}
          onChange={setPlat}
          options={[
            { value: 'all', label: 'Всё' },
            { value: 'tiktok', label: 'TikTok' },
            { value: 'instagram', label: 'Instagram', hint: '· где доступно' },
          ]}
        />
      </div>

      {/* Feed */}
      <div className="space-y-3 px-5 pt-4">
        {visible.map((v) => (
          <div key={v.id}>
            <VideoCard video={v} onOpen={() => openVideo(v.id)} />
            {v.id === pipelineCardId && <PipelineExpander />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineExpander() {
  const [open, setOpen] = useState(false);
  const reduced = prefersReducedMotion();

  return (
    <div className="mt-2 overflow-hidden rounded-card border border-violet/25 bg-violet/[0.05]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-caption font-semibold text-violet">
          <Sparkles className="h-4 w-4" /> Как ИИ это понял
        </span>
        <ChevronDown className={cx('h-4 w-4 text-violet transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ol className="space-y-2.5 px-4 pb-4">
              {videoPipeline.map((step, i) => (
                <motion.li
                  key={i}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : i * 0.18, duration: 0.3 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/20 text-violet">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span
                    className={cx(
                      'text-caption',
                      i === videoPipeline.length - 1 ? 'font-semibold text-teal' : 'text-text-primary',
                    )}
                  >
                    {step}
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
