import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, ListChecks, ArrowRight, Volume2, RefreshCw, Radio, Radar, Link2, Newspaper } from 'lucide-react';
import {
  voiceScenarios,
  voiceDigestLines,
  listings,
  videoInterests,
  videoAutoTags,
  type VoiceScenario,
} from '../data/mockData';
import { useNav, type VoiceContext } from '../nav';
import { ScreenHeader } from '../components/TopBar';
import { Photo, cx } from '../components/ui';
import { formatKzt, prefersReducedMotion } from '../lib/format';

type Phase = 'idle' | 'listening' | 'thinking' | 'answer' | 'result';

interface HistoryEntry {
  scenario: VoiceScenario;
  command: string;
  answer: string;
}

const videoFilterScenario: VoiceScenario = {
  id: 'video-filter-review',
  command: 'Посмотри мой фильтр видео-радара. Что в нём лучше поменять?',
  answer:
    'Сейчас фильтр слишком широкий, поэтому в ленту попадают лишние ролики. Я бы сузил географию до Алматы и области, заменил общую тему «стройка» на коммерческие объекты и добавил исключения для аренды, Астаны и жилых участков.',
  resultType: 'checklist',
  resultTitle: 'Рекомендации по фильтру',
  checklist: [
    'Уточнить географию: Алматы и область, радиус до 50 км.',
    'Заменить «стройка» на «промбаза» и «земля под производство».',
    'Добавить минус-темы: аренда, Астана и жилые участки.',
    'Оставить TikTok приоритетным, Instagram — дополнительным источником.',
  ],
};

const newsInterests = [
  'земля и промбазы',
  'птицефабрики',
  'электроэнергия',
  'финансирование МСБ',
  'инфраструктура',
];

const newsInterestsScenario: VoiceScenario = {
  id: 'news-interests-review',
  command: 'Настрой поиск новостей под мои текущие интересы. Что ты будешь отслеживать?',
  answer:
    'Я вижу, что директор сейчас рассматривает землю и производственные объекты в Алматинской области. Поэтому буду искать не общий поток новостей, а события, которые могут повлиять на цену объекта, оформление сделки, расходы и окупаемость.',
  resultType: 'checklist',
  resultTitle: 'Что AI будет отслеживать',
  checklist: [
    'Изменения правил оформления земли и целевого назначения участков.',
    'Новые промзоны, дороги, коммуникации и логистические проекты рядом с объектами.',
    'Субсидии и программы поддержки птицефабрик и агропроизводства.',
    'Тарифы на электроэнергию, воду и рост стоимости строительства.',
    'Льготное кредитование и финансирование покупки производственных объектов.',
  ],
};

export function VoiceScreen({ context }: { context?: VoiceContext }) {
  const reduced = prefersReducedMotion();
  const contextual = Boolean(context);
  const scenarios =
    context === 'videoFilters'
      ? [videoFilterScenario]
      : context === 'newsInterests'
        ? [newsInterestsScenario]
        : voiceScenarios;
  const [phase, setPhase] = useState<Phase>('idle');
  const [command, setCommand] = useState('');
  const [answer, setAnswer] = useState('');
  const [scenario, setScenario] = useState<VoiceScenario | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // digest
  const [digestSpoken, setDigestSpoken] = useState<string[]>([]);
  const [digestActive, setDigestActive] = useState(false);

  const idxRef = useRef(0);
  const runningRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, reduced ? Math.min(ms, 200) : ms));

  const typeInto = useCallback(
    async (text: string, setter: (s: string) => void, speed: number) => {
      if (reduced) {
        setter(text);
        return;
      }
      for (let i = 1; i <= text.length; i++) {
        if (!mounted.current) return;
        setter(text.slice(0, i));
        await new Promise<void>((r) => setTimeout(r, speed));
      }
    },
    [reduced],
  );

  const runScenario = useCallback(
    async (index: number) => {
      if (runningRef.current) return;
      runningRef.current = true;

      // archive previous completed answer
      setScenario((prev) => {
        if (prev) {
          setHistory((h) => [{ scenario: prev, command, answer }, ...h].slice(0, 4));
        }
        return prev;
      });

      const sc = scenarios[index % scenarios.length];
      setScenario(sc);
      setCommand('');
      setAnswer('');
      setPhase('listening');

      await sleep(1100);
      await typeInto(sc.command, setCommand, 30);
      if (!mounted.current) return;

      setPhase('thinking');
      await sleep(900);
      if (!mounted.current) return;

      setPhase('answer');
      await typeInto(sc.answer, setAnswer, 22);
      if (!mounted.current) return;

      setPhase('result');
      runningRef.current = false;
    },
    [typeInto, command, answer, scenarios],
  );

  // Auto-start the main scenario the first time the screen opens
  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === 'idle') {
        idxRef.current = 1;
        runScenario(0);
      }
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    if (runningRef.current) return;
    const i = idxRef.current % scenarios.length;
    idxRef.current += 1;
    runScenario(i);
  };

  const runDigest = useCallback(async () => {
    if (digestActive) return;
    setDigestActive(true);
    setDigestSpoken([]);
    for (const line of voiceDigestLines) {
      if (!mounted.current) break;
      await new Promise<void>((r) => setTimeout(r, reduced ? 120 : 700));
      if (!mounted.current) break;
      setDigestSpoken((s) => [...s, line]);
    }
    setDigestActive(false);
  }, [digestActive, reduced]);

  const listening = phase === 'listening';
  const thinking = phase === 'thinking';
  const speaking = phase === 'answer';

  return (
    <div className="pb-28">
      <ScreenHeader
        title={
          context === 'videoFilters'
            ? 'Обсуждение фильтра'
            : context === 'newsInterests'
              ? 'Интересы директора'
              : 'Голосовой помощник'
        }
        subtitle={
          context === 'videoFilters'
            ? 'AI видит настройки видео-радара'
            : context === 'newsInterests'
              ? 'Настройка персонального поиска новостей'
              : undefined
        }
      />

      {/* Digest button */}
      <div className="px-5 pt-4">
        {context === 'videoFilters' ? (
          <FilterContextCard />
        ) : context === 'newsInterests' ? (
          <NewsInterestsContextCard />
        ) : (
          <button
            onClick={runDigest}
            disabled={digestActive}
            className="flex w-full items-center justify-center gap-2 rounded-btn border border-violet/30 bg-violet/[0.08] py-2.5 text-caption font-semibold text-violet transition-colors hover:bg-violet/[0.14] disabled:opacity-60"
          >
            <Volume2 className="h-4 w-4" /> Прослушать сводку дня
          </button>
        )}

        {!contextual && digestSpoken.length > 0 && (
          <div className="mt-3 space-y-2 rounded-card border border-violet/20 bg-violet/[0.05] p-4">
            {digestSpoken.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 text-caption text-text-primary"
              >
                <Radio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet" />
                <span>{l}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Visualizer */}
      <div className="flex flex-col items-center px-5 pt-6">
        <button
          onClick={next}
          aria-label="Запустить голосовую команду"
          className="relative flex h-36 w-36 items-center justify-center"
        >
          {(listening || thinking) && !reduced && (
            <>
              <span className="absolute h-36 w-36 rounded-full border border-gold/30" style={{ animation: 'ring-expand 1.8s ease-out infinite' }} />
              <span className="absolute h-36 w-36 rounded-full border border-violet/30" style={{ animation: 'ring-expand 1.8s ease-out infinite', animationDelay: '0.6s' }} />
              <span className="absolute h-36 w-36 rounded-full border border-gold/20" style={{ animation: 'ring-expand 1.8s ease-out infinite', animationDelay: '1.2s' }} />
            </>
          )}
          <span
            className={cx(
              'relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500',
              (listening || thinking || speaking) ? 'scale-105' : 'scale-100',
            )}
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgb(var(--violet)), rgb(var(--gold)) 130%)',
              boxShadow: listening || thinking ? '0 0 48px -4px rgba(167,139,250,0.65)' : '0 0 32px -6px rgba(56,189,248,0.5)',
            }}
          >
            <Mic className="h-9 w-9 text-white" strokeWidth={2.2} />
          </span>
        </button>

        <p className="mt-4 text-caption text-text-muted">
          {phase === 'idle' && 'Нажмите на микрофон, чтобы задать команду'}
          {listening && 'Слушаю…'}
          {thinking && 'AI думает…'}
          {(speaking || phase === 'result') && 'AI отвечает'}
        </p>
      </div>

      {/* Live dialog */}
      <div className="space-y-3 px-5 pt-5">
        {scenario && (
          <>
            {/* command bubble */}
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-line bg-bg-elevated px-4 py-2.5">
              <p className="text-caption text-text-primary">
                {command}
                {listening && <span className="caret" />}
              </p>
            </div>

            {/* thinking dots */}
            {thinking && (
              <div className="flex items-center gap-1.5 px-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-violet"
                    style={{ animation: 'pulse-node 1.2s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            )}

            {/* answer bubble */}
            {(speaking || phase === 'result') && (
              <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-gold/25 bg-gold/[0.05] px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5 text-micro uppercase text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> AI
                </div>
                <p className="text-body leading-relaxed text-text-primary">
                  {answer}
                  {speaking && <span className="caret" />}
                </p>
              </div>
            )}

            {/* result */}
            {phase === 'result' && <ResultBlock scenario={scenario} />}
          </>
        )}
      </div>

      {/* Next example */}
      {phase === 'result' && (
        <div className="px-5 pt-5">
          <button
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-btn border border-line bg-bg-panel py-2.5 text-caption font-medium text-text-primary hover:border-gold/40"
          >
            <RefreshCw className="h-4 w-4" /> {contextual ? 'Обсудить ещё раз' : 'Следующий пример'}
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="px-5 pt-7">
          <p className="mb-3 text-micro uppercase text-text-muted">История</p>
          <div className="space-y-2.5">
            {history.map((h, i) => (
              <div key={i} className="rounded-card border border-line bg-bg-panel/60 p-3.5">
                <p className="text-caption text-text-muted">«{h.command}»</p>
                <p className="mt-1 line-clamp-2 text-caption text-text-primary">{h.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NewsInterestsContextCard() {
  const { back } = useNav();

  return (
    <button
      onClick={back}
      className="glass glass-edge w-full rounded-card p-4 text-left transition-all hover:border-gold/40 active:scale-[0.99]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-caption font-semibold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
            <Newspaper className="h-4 w-4" />
          </span>
          Профиль поиска новостей
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gold">
          <Link2 className="h-3.5 w-3.5" /> К новостям
        </span>
      </span>
      <span className="mt-3 block text-[11px] leading-relaxed text-text-muted">
        AI использует просмотры, избранные объекты и ваши указания в чате.
      </span>
      <span className="mt-3 flex flex-wrap gap-1.5">
        {newsInterests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-gold/30 bg-gold/8 px-2.5 py-1 text-[10px] font-semibold text-gold"
          >
            {interest}
          </span>
        ))}
      </span>
    </button>
  );
}

function FilterContextCard() {
  const { back } = useNav();

  return (
    <button
      onClick={back}
      className="glass glass-edge w-full rounded-card p-4 text-left transition-all hover:border-violet/40 active:scale-[0.99]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-caption font-semibold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet/12 text-violet">
            <Radar className="h-4 w-4" />
          </span>
          Фильтр видео-радара
        </span>
        <span className="flex items-center gap-1 text-[11px] text-violet">
          <Link2 className="h-3.5 w-3.5" /> Открыть
        </span>
      </span>
      <span className="mt-3 flex flex-wrap gap-1.5">
        {videoInterests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-gold/30 bg-gold/8 px-2 py-1 text-[10px] uppercase text-gold"
          >
            {interest}
          </span>
        ))}
      </span>
      <span className="mt-2 block font-mono text-[11px] leading-relaxed text-violet">
        {videoAutoTags.join(' ')}
      </span>
    </button>
  );
}

function ResultBlock({ scenario }: { scenario: VoiceScenario }) {
  const { openListing } = useNav();

  if (scenario.resultType === 'listing' && scenario.resultListingId) {
    const l = listings.find((x) => x.id === scenario.resultListingId);
    if (!l) return null;
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button
          onClick={() => openListing(l.id)}
          className="flex w-full items-center gap-3 rounded-card border border-gold/25 bg-bg-panel p-3 text-left transition-colors hover:border-gold/45"
        >
          <Photo src={l.photos[0]} alt={l.title} className="h-16 w-20 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption text-text-primary">{l.title}</p>
            <p className="font-mono text-body font-semibold text-gold-soft tnum">{formatKzt(l.priceKzt)}</p>
            <p className="text-[11px] text-teal">★ {l.aiScore.toFixed(1)} · ниже рынка</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold" />
        </button>
        <div className="mt-2 flex flex-wrap gap-2">
          {['Найти похожие', 'Показать рядом', 'Сохранить', 'Напомнить'].map((b) => (
            <button
              key={b}
              onClick={() => openListing(l.id)}
              className="rounded-full border border-line bg-bg-elevated px-3 py-1.5 text-caption text-text-primary hover:border-gold/40"
            >
              {b}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (scenario.resultType === 'checklist' && scenario.checklist) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-card border border-line bg-bg-panel p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-micro uppercase text-gold">
          <ListChecks className="h-4 w-4" /> {scenario.resultTitle ?? 'Вопросы продавцу'}
        </div>
        <ol className="space-y-2">
          {scenario.checklist.map((q, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2.5 text-caption text-text-primary"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[11px] font-semibold text-gold tnum">
                {i + 1}
              </span>
              {q}
            </motion.li>
          ))}
        </ol>
      </motion.div>
    );
  }

  // digest
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
      {['Объект', 'Видео-радар', 'Погода'].map((t) => (
        <span key={t} className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-caption text-teal">
          {t}
        </span>
      ))}
    </motion.div>
  );
}
