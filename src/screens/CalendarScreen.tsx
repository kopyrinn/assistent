import { useState } from 'react';
import { BellRing, CalendarDays, Check, Clock, Mic, Sparkles, Trash2 } from 'lucide-react';
import {
  formatPlanDateTime,
  reminderLeadLabel,
  usePlans,
  type ReminderLead,
} from '../plans';
import { ScreenHeader } from '../components/TopBar';
import { cx } from '../components/ui';

const voiceExamples = [
  { title: 'Встреча с подрядчиком по складу', dayOffset: 1, time: '10:00' },
  { title: 'Позвонить бухгалтеру по бюджету', dayOffset: 0, time: '16:00' },
  { title: 'Выезд на участок в Талгаре', dayOffset: 2, time: '11:00' },
];

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CalendarScreen() {
  const { plans, addPlan, removePlan } = usePlans();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(localDateString(new Date()));
  const [time, setTime] = useState('10:00');
  const [reminderLead, setReminderLead] = useState<ReminderLead>('1_hour');
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [voiceCursor, setVoiceCursor] = useState(0);
  const [createdBy, setCreatedBy] = useState<'voice' | 'manual'>('manual');

  const runVoice = () => {
    if (listening) return;
    setListening(true);
    setRecognized('Слушаю...');

    window.setTimeout(() => {
      const example = voiceExamples[voiceCursor % voiceExamples.length];
      const planDate = new Date();
      planDate.setDate(planDate.getDate() + example.dayOffset);
      const phrase = `${example.title}, ${example.dayOffset === 0 ? 'сегодня' : example.dayOffset === 1 ? 'завтра' : 'послезавтра'} в ${example.time}`;

      setTitle(example.title);
      setDate(localDateString(planDate));
      setTime(example.time);
      setReminderLead('1_hour');
      setCreatedBy('voice');
      setRecognized(`«${phrase}»`);
      setVoiceCursor((current) => current + 1);
      setListening(false);
    }, 1100);
  };

  const savePlan = () => {
    if (!title.trim()) return;
    addPlan({
      title: title.trim(),
      date,
      time,
      reminderLead,
      createdBy,
    });
    setTitle('');
    setRecognized('');
    setCreatedBy('manual');
  };

  return (
    <div className="pb-28">
      <ScreenHeader title="Календарь" subtitle="Расскажите AI о планах — он запишет и напомнит" />

      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-card border border-gold/30 bg-gold/[0.05] p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={runVoice}
              className={cx(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-[#0B1220] shadow-gold-glow',
                listening && 'animate-pulse',
              )}
              aria-label="Продиктовать план"
            >
              <Mic className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <p className="text-body font-semibold text-text-primary">Продиктуйте план</p>
              <p className="mt-1 text-caption leading-relaxed text-text-muted">
                Например: «Завтра в 10 встреча с подрядчиком по складу».
              </p>
              {recognized && <p className="mt-2 text-caption text-gold">{recognized}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-card border border-line bg-bg-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="text-caption font-semibold text-text-primary">AI подготовил событие</p>
          </div>

          <label className="block text-micro uppercase text-text-muted">Что запланировано</label>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setCreatedBy('manual');
            }}
            placeholder="Например, встреча с подрядчиком"
            className="mt-1.5 w-full rounded-btn border border-line bg-bg-deep px-3 py-2.5 text-body text-text-primary outline-none placeholder:text-text-muted focus:border-gold/50"
          />

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <label className="text-micro uppercase text-text-muted">
              Дата
              <input
                type="date"
                value={date}
                min={localDateString(new Date())}
                onChange={(event) => setDate(event.target.value)}
                className="mt-1.5 w-full rounded-btn border border-line bg-bg-deep px-2.5 py-2 text-caption text-text-primary [color-scheme:dark]"
              />
            </label>
            <label className="text-micro uppercase text-text-muted">
              Время
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="mt-1.5 w-full rounded-btn border border-line bg-bg-deep px-2.5 py-2 text-caption text-text-primary [color-scheme:dark]"
              />
            </label>
          </div>

          <label className="mt-4 block text-micro uppercase text-text-muted">Когда напомнить push-уведомлением</label>
          <select
            value={reminderLead}
            onChange={(event) => setReminderLead(event.target.value as ReminderLead)}
            className="mt-1.5 w-full rounded-btn border border-line bg-bg-deep px-3 py-2.5 text-caption text-text-primary outline-none"
          >
            <option value="15_min">За 15 минут</option>
            <option value="1_hour">За 1 час</option>
            <option value="1_day">За 1 день</option>
            <option value="at_time">В момент события</option>
          </select>

          <button
            onClick={savePlan}
            disabled={!title.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-btn bg-gradient-to-b from-gold-soft to-gold py-3 text-body font-semibold text-[#0B1220] shadow-gold-glow disabled:opacity-40"
          >
            <Check className="h-5 w-5" /> Записать в календарь
          </button>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-title text-text-primary">Мои планы</h2>
            <span className="text-caption text-text-muted">{plans.length}</span>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-card border border-dashed border-line px-5 py-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-text-muted" />
              <p className="mt-3 text-caption text-text-muted">Планов пока нет. Продиктуйте первый.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-card border border-line bg-bg-panel p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-semibold text-text-primary">{plan.title}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-caption text-text-muted">
                        <Clock className="h-3.5 w-3.5" /> {formatPlanDateTime(plan)}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gold">
                        <BellRing className="h-3.5 w-3.5" /> {reminderLeadLabel(plan.reminderLead)}
                      </p>
                    </div>
                    <button
                      onClick={() => removePlan(plan.id)}
                      aria-label="Удалить план"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-line bg-bg-elevated text-text-muted hover:border-rose/40 hover:text-rose"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
