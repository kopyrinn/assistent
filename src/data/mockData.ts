// ---------- Типы ----------
export type Importance = 'critical' | 'important' | 'digest' | 'silent';
export type Source = 'krisha' | 'olx';
export type Platform = 'tiktok' | 'instagram';

export interface Listing {
  id: string;
  source: Source;
  sourceUrl: string;
  title: string;
  priceKzt: number;
  areaLabel: string;
  pricePerUnit: string;
  location: string;
  distanceCity: string;
  aiScore: number;        // 0..10
  aiVerdict: string;
  pros: string[];
  cons: string[];
  photos: string[];
  priceHistory: { date: string; price: number }[];
  nearby: { label: string; distance: string }[];
  similarIds: string[];
  sellerQuestions: string[];
}

export interface FeedItem {
  id: string;
  type: 'urgent_listing' | 'similar' | 'weather' | 'news' | 'reminder' | 'video';
  importance: Importance;
  eyebrow: string;
  headline: string;
  detail: string;
  payloadId?: string;
}

export interface NewsItem { id: string; title: string; whyImportant: string; source: string; date: string; }

export interface WeatherDay { day: string; tempC: number; condition: string; windMs: number; rainPct: number; }

export type WeatherLocationKey = 'almaty' | 'talgar' | 'konaev' | 'kaskelen';

export interface WeatherLocation {
  label: string;
  shortLabel: string;
  week: WeatherDay[];
  aggregationNote: string;
  aiAdvice: string;
}

export interface VideoFind {
  id: string;
  platform: Platform;
  thumbnail: string;
  authorHandle: string;
  views: number;
  caption: string;
  hashtags: string[];
  aiRelevant: boolean;
  aiVerdict: string;
  extracted: {
    priceKzt?: number;
    areaLabel?: string;
    location?: string;
    contact?: string;     // в демо маскируем
  };
  transcript?: string;
  onScreenText?: string;
  matchedListingId?: string;
  matchNote?: string;
  videoUrl: string;       // РЕАЛЬНАЯ живая ссылка
}

export interface VoiceScenario {
  id: string;
  command: string;
  answer: string;
  resultListingId?: string;
  resultType?: 'listing' | 'digest' | 'checklist';
  resultTitle?: string;
  checklist?: string[];
}

export type PushTarget = 'listing' | 'video' | 'weather' | 'news' | 'reminders' | 'calendar';

export interface PushSample {
  id: string;
  importance: Importance;
  title: string;
  body: string;
  target: PushTarget;
  payloadId?: string;
}

// ---------- Объекты Krisha / OLX ----------
export const listings: Listing[] = [
  {
    id: 'l1',
    source: 'krisha',
    sourceUrl: 'https://krisha.kz/a/show/1011571958',
    title: 'Участок 3 га под производство, Талгарский р-н',
    priceKzt: 120_000_000,
    areaLabel: '3 га',
    pricePerUnit: '40 млн ₸/га',
    location: 'Талгарский р-н, с. Панфилово',
    distanceCity: '28 км до Алматы',
    aiScore: 8.7,
    aiVerdict:
      'Цена ниже рынка примерно на 15–20%. Рядом трасса и промзона, подходит под производство. ' +
      'Минус — нет точных данных по воде и мощности электричества, нужно уточнить у продавца.',
    pros: ['Первая линия у трассы', 'Рядом промзона и логистика', 'Ровный, госакт'],
    cons: ['Нет данных по воде', 'Электричество — мощность под вопросом'],
    photos: ['https://picsum.photos/seed/l1a/800/500', 'https://picsum.photos/seed/l1b/800/500'],
    priceHistory: [
      { date: '01.03', price: 140_000_000 },
      { date: '20.03', price: 132_000_000 },
      { date: '05.06', price: 120_000_000 },
    ],
    nearby: [
      { label: 'Трасса А-351', distance: '0.2 км' },
      { label: 'АЗС', distance: '2 км' },
      { label: 'Село', distance: '4 км' },
      { label: 'Промзона', distance: '6 км' },
    ],
    similarIds: ['l2', 'l3'],
    sellerQuestions: [
      'Какое целевое назначение земли по госакту?',
      'Есть ли подключение к электричеству и какая мощность?',
      'Как обстоит дело с водой — скважина, центральная?',
      'Есть ли подъезд для грузового транспорта?',
      'Все ли документы готовы к сделке, нет ли обременений?',
    ],
  },
  {
    id: 'l2',
    source: 'krisha',
    sourceUrl: 'https://krisha.kz/a/show/1005025918',
    title: 'Промбаза 0.8 га со складами, Каскелен',
    priceKzt: 185_000_000,
    areaLabel: '0.8 га',
    pricePerUnit: '231 млн ₸/га',
    location: 'г. Каскелен, промзона',
    distanceCity: '22 км до Алматы',
    aiScore: 7.4,
    aiVerdict:
      'Готовая промбаза с холодными складами и подъездом для фур. Цена в рынке. ' +
      'Подойдёт под логистику или производство сразу, без вложений в инфраструктуру.',
    pros: ['Готовые склады', 'Электричество 250 кВт', 'Асфальт, подъезд для фур'],
    cons: ['Дороже за гектар', 'Часть кровли требует ремонта'],
    photos: ['https://picsum.photos/seed/l2a/800/500', 'https://picsum.photos/seed/l2b/800/500'],
    priceHistory: [
      { date: '10.04', price: 190_000_000 },
      { date: '28.05', price: 185_000_000 },
    ],
    nearby: [
      { label: 'Трасса', distance: '0.5 км' },
      { label: 'Город Каскелен', distance: '1 км' },
      { label: 'Логистический хаб', distance: '3 км' },
    ],
    similarIds: ['l1', 'l3'],
    sellerQuestions: [
      'Какая выделенная мощность по электричеству?',
      'В каком состоянии кровля и когда был ремонт?',
      'Есть ли действующие договоры аренды на склады?',
      'Оформлена ли земля в собственность или аренда?',
    ],
  },
  {
    id: 'l3',
    source: 'krisha',
    sourceUrl: 'https://krisha.kz/a/show/1011741712',
    title: 'Участок 5 га под птицефабрику, Капшагай',
    priceKzt: 95_000_000,
    areaLabel: '5 га',
    pricePerUnit: '19 млн ₸/га',
    location: 'Капшагай, окраина',
    distanceCity: '70 км до Алматы',
    aiScore: 6.9,
    aiVerdict:
      'Дёшево за гектар и большая площадь под птицефабрику. Но далеко от города и нет ' +
      'центральных коммуникаций — нужно считать затраты на подведение воды и света.',
    pros: ['Низкая цена за гектар', 'Большая площадь', 'Подходит под с/х назначение'],
    cons: ['Далеко от Алматы', 'Нет центральных коммуникаций', 'Грунтовый подъезд'],
    photos: ['https://picsum.photos/seed/l3a/800/500'],
    priceHistory: [
      { date: '15.05', price: 98_000_000 },
      { date: '07.06', price: 95_000_000 },
    ],
    nearby: [
      { label: 'Трасса на Капшагай', distance: '3 км' },
      { label: 'Водохранилище', distance: '8 км' },
      { label: 'ЛЭП', distance: '1.5 км' },
    ],
    similarIds: ['l1', 'l3'],
    sellerQuestions: [
      'Какое расстояние до ближайшей точки подключения воды?',
      'Можно ли получить мощность от ближайшей ЛЭП?',
      'Каков статус подъездной дороги, кто обслуживает?',
      'Разрешено ли строительство птицефабрики по назначению?',
    ],
  },
  {
    id: 'l4',
    source: 'krisha',
    sourceUrl: 'https://krisha.kz/a/show/1009370354',
    title: 'Склад 1200 м² с участком 0.3 га, Алатауский р-н',
    priceKzt: 240_000_000,
    areaLabel: '1200 м²',
    pricePerUnit: '200 000 ₸/м²',
    location: 'Алматы, Алатауский р-н',
    distanceCity: 'в черте города',
    aiScore: 7.0,
    aiVerdict:
      'Тёплый склад в черте города — редкость. Цена выше средней, но локация компенсирует. ' +
      'Хорошо под распределительный центр для города.',
    pros: ['В черте города', 'Тёплый склад', 'Кран-балка'],
    cons: ['Высокая цена', 'Ограниченная парковка для фур'],
    photos: ['https://picsum.photos/seed/l4a/800/500'],
    priceHistory: [{ date: '01.06', price: 240_000_000 }],
    nearby: [
      { label: 'Рынок', distance: '1 км' },
      { label: 'Развязка', distance: '2 км' },
    ],
    similarIds: ['l2'],
    sellerQuestions: [
      'Какая высота потолков и грузоподъёмность кран-балки?',
      'Сколько фур одновременно помещается под разгрузку?',
      'Какие коммунальные расходы в месяц?',
    ],
  },
  {
    id: 'o1',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/yurta-prodam-vse-v-komplekte-IDqSyny.html',
    title: 'Большая юрта 8-канатная, новая, ручная работа',
    priceKzt: 4_750_000,
    areaLabel: '8 канатов',
    pricePerUnit: '—',
    location: 'Алматы',
    distanceCity: 'самовывоз/доставка',
    aiScore: 8.1,
    aiVerdict:
      'Качественная новая юрта под этно-площадку или мероприятия. Цена в рынке для 8 канатов. ' +
      'Продавец предлагает доставку и монтаж — удобно под бизнес-задачу.',
    pros: ['Новая, ручная работа', 'Доставка и монтаж', 'Натуральные материалы'],
    cons: ['Нужно уточнить сроки изготовления', 'Гарантия не указана'],
    photos: ['https://picsum.photos/seed/o1a/800/500'],
    priceHistory: [{ date: '02.06', price: 4_750_000 }],
    nearby: [],
    similarIds: [],
    sellerQuestions: [
      'Какой срок изготовления и доставки?',
      'Входит ли монтаж в стоимость?',
      'Есть ли гарантия на каркас и покрытие?',
    ],
  },
  {
    id: 'o2',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/generator-100-kvt-elektrostantsiya-dgu-IDpAj1t.html',
    title: 'Дизель-генератор 100 кВт, б/у, в рабочем состоянии',
    priceKzt: 3_200_000,
    areaLabel: '100 кВт',
    pricePerUnit: '—',
    location: 'Алматинская обл.',
    distanceCity: 'самовывоз',
    aiScore: 6.4,
    aiVerdict:
      'Подойдёт как резервное питание для объекта без центрального электричества. ' +
      'Б/у — обязательно проверить моточасы и состояние перед покупкой.',
    pros: ['Мощность под объект', 'Цена ниже нового'],
    cons: ['Б/у, неизвестны моточасы', 'Нужна диагностика'],
    photos: ['https://picsum.photos/seed/o2a/800/500'],
    priceHistory: [{ date: '04.06', price: 3_200_000 }],
    nearby: [],
    similarIds: ['o4'],
    sellerQuestions: [
      'Сколько моточасов наработки?',
      'Когда последнее ТО и какие работы делались?',
      'Можно ли запустить и проверить под нагрузкой?',
    ],
  },
  {
    id: 'o3',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/konteyner-zhiloy-40f-12-0h2-4-IDqrRUV.html',
    title: 'Морской контейнер 40 фт, утеплённый, под склад',
    priceKzt: 2_100_000,
    areaLabel: '40 фт',
    pricePerUnit: '—',
    location: 'Алматы',
    distanceCity: 'доставка манипулятором',
    aiScore: 7.2,
    aiVerdict:
      'Утеплённый 40-футовый контейнер — удобное быстрое решение под склад или бытовку на объекте. ' +
      'Цена в рынке, продавец предлагает доставку манипулятором.',
    pros: ['Утеплён', 'Доставка манипулятором', 'Готов под склад/бытовку'],
    cons: ['Нужно проверить состояние пола', 'Без вентиляции'],
    photos: ['https://picsum.photos/seed/o3a/800/500'],
    priceHistory: [{ date: '03.06', price: 2_100_000 }],
    nearby: [],
    similarIds: [],
    sellerQuestions: [
      'В каком состоянии пол и стены изнутри?',
      'Входит ли доставка в цену?',
      'Есть ли вентиляция или вырезы под окна?',
    ],
  },
  {
    id: 'o4',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/agregat-monoblok-holodilnyy-split-sistema-kamera-oborudovanie-IDpc84g.html',
    title: 'Холодильное оборудование для склада, моноблок',
    priceKzt: 1_450_000,
    areaLabel: '15–25 м³',
    pricePerUnit: '—',
    location: 'Алматинская обл., Каскелен',
    distanceCity: 'самовывоз',
    aiScore: 6.0,
    aiVerdict:
      'Моноблок под небольшую холодильную камеру — подойдёт для хранения продукции. ' +
      'Б/у, уточните год выпуска и состояние компрессора.',
    pros: ['Готовый моноблок', 'Подходит под малый склад'],
    cons: ['Б/у', 'Неизвестен ресурс компрессора'],
    photos: ['https://picsum.photos/seed/o4a/800/500'],
    priceHistory: [{ date: '06.06', price: 1_450_000 }],
    nearby: [],
    similarIds: ['o2'],
    sellerQuestions: [
      'Какой год выпуска и наработка компрессора?',
      'На какой объём камеры рассчитан?',
      'Есть ли гарантия или возможность проверки?',
    ],
  },
  {
    id: 'o5',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/arochnyy-beskarkasnyy-sbornyy-razbornyy-angar-IDpSlq2.html',
    title: 'Металлоконструкции / ангар 12×30 м, разборный',
    priceKzt: 8_900_000,
    areaLabel: '360 м²',
    pricePerUnit: '24 700 ₸/м²',
    location: 'Алматы',
    distanceCity: 'демонтирован, на хранении',
    aiScore: 7.6,
    aiVerdict:
      'Разборный ангар 12×30 — быстрый каркас под производство или склад на участке. ' +
      'Выгоднее строительства с нуля. Уточните комплектность и состояние металла.',
    pros: ['Быстрый монтаж', 'Дешевле капитального строения', 'Разборный'],
    cons: ['Нужна площадка и фундамент', 'Проверить комплектность'],
    photos: ['https://picsum.photos/seed/o5a/800/500'],
    priceHistory: [
      { date: '20.05', price: 9_500_000 },
      { date: '06.06', price: 8_900_000 },
    ],
    nearby: [],
    similarIds: [],
    sellerQuestions: [
      'Полная ли комплектность каркаса и обшивки?',
      'В каком состоянии металл, есть ли коррозия?',
      'Входит ли монтаж и доставка?',
    ],
  },
  {
    id: 'o6',
    source: 'olx',
    sourceUrl: 'https://www.olx.kz/d/obyavlenie/pogruzchik-IDlL2pP.html',
    title: 'Спецтехника: погрузчик фронтальный, 3 т',
    priceKzt: 12_500_000,
    areaLabel: '3 т',
    pricePerUnit: '—',
    location: 'Алматинская обл.',
    distanceCity: 'самовывоз',
    aiScore: 6.7,
    aiVerdict:
      'Фронтальный погрузчик 3 т — рабочая лошадка для промбазы или стройплощадки. ' +
      'Б/у, цена в рынке. Обязательна проверка гидравлики и наработки.',
    pros: ['Грузоподъёмность под задачи', 'Цена в рынке'],
    cons: ['Б/у', 'Проверить гидравлику и двигатель'],
    photos: ['https://picsum.photos/seed/o6a/800/500'],
    priceHistory: [{ date: '05.06', price: 12_500_000 }],
    nearby: [],
    similarIds: ['o2'],
    sellerQuestions: [
      'Сколько моточасов и какой год?',
      'В каком состоянии гидравлика и трансмиссия?',
      'Можно ли проверить в работе?',
    ],
  },
];

// ---------- Лента «Сегодня важно» ----------
export const feed: FeedItem[] = [
  {
    id: 'f1',
    type: 'urgent_listing',
    importance: 'critical',
    eyebrow: 'СРОЧНЫЙ ОБЪЕКТ',
    headline: 'Участок 3 га за 120 млн ₸ — на 15–20% ниже рынка',
    detail: 'Похож на тот, что вы смотрели ранее. Рядом трасса и промзона. Рекомендую посмотреть.',
    payloadId: 'l1',
  },
  {
    id: 'f2',
    type: 'video',
    importance: 'important',
    eyebrow: 'ВИДЕО-РАДАР',
    headline: 'Нашёл TikTok по участку 5 га в Алатау',
    detail: 'Извлёк из видео: ЖД тупик 300 м, логистика, склады и промышленное производство.',
    payloadId: 'v1',
  },
  {
    id: 'f4',
    type: 'weather',
    importance: 'digest',
    eyebrow: 'ПОГОДА',
    headline: 'Пятница — дождь и сильный ветер',
    detail: 'Выезд на объект лучше перенести. Лучшее окно — четверг с 11:00 до 16:00.',
  },
  {
    id: 'f5',
    type: 'news',
    importance: 'digest',
    eyebrow: 'НОВОСТИ',
    headline: 'Новые правила по землям сельхозназначения',
    detail: 'Может повлиять на оформление участков под производство в Алматинской области.',
    payloadId: 'n1',
  },
  {
    id: 'f6',
    type: 'reminder',
    importance: 'silent',
    eyebrow: 'НАПОМИНАНИЕ',
    headline: 'Позвонить продавцу участка в Талгаре',
    detail: 'Сегодня до 18:00 — уточнить воду и электричество.',
    payloadId: 'l1',
  },
];

export const feedFilteredCount = { scanned: 247, important: 6, filtered: 241 };

// ---------- Сводка за неделю (для экрана/виджета «Итоги недели») ----------
export interface WeekStat { label: string; value: string; hint: string; }
export const weekSummary: WeekStat[] = [
  { label: 'Просмотрено объявлений', value: '1 480', hint: 'Krisha + OLX за 7 дней' },
  { label: 'Важных находок', value: '14', hint: 'прошли AI-фильтр' },
  { label: 'Видео обработано', value: '63', hint: 'TikTok + Instagram' },
  { label: 'Дешевле рынка', value: '4 объекта', hint: 'отмечены ИИ как выгодные' },
];
export const weekHighlights = [
  'Лучшая находка недели — участок 3 га в Талгаре, на 15–20% ниже рынка.',
  'Видео-радар нашёл участок 5 га в Алатау с ЖД тупиком и участок 10 га в промзоне Алматы.',
  'Радар обработал 63 видео в TikTok и Instagram, релевантных — 9.',
  'Погода: благоприятное окно для выезда — четверг и вторник.',
];

// ---------- Видео-радар (РЕАЛЬНЫЕ ссылки) ----------
export const videoFinds: VideoFind[] = [
  {
    id: 'v1',
    platform: 'tiktok',
    thumbnail: 'https://picsum.photos/seed/v1/600/900',
    authorHandle: '@nedvizhimostalmaty02',
    views: 12800,
    caption: 'Продаётся земельный участок 5 га в городе Алатау. ЖД тупик 300 м, под логистику, склады и производство.',
    hashtags: ['#capitalestatealmaty', '#промбазаалматинскаяобласть', '#алатау', '#логистическийцентр'],
    aiRelevant: true,
    aiVerdict: 'Реальный TikTok-ролик о продаже участка 5 га в городе Алатау. Подходит под логистику, складской комплекс или производство.',
    extracted: {
      areaLabel: '5 га',
      location: 'город Алатау',
      contact: '+7 7•• ••• •• ••',
    },
    transcript: '…продаётся земельный участок 5 гектаров в городе Алатау, собственный железнодорожный тупик 300 метров, под логистический центр…',
    onScreenText: 'УЧАСТОК 5 ГА • АЛАТАУ • ЖД ТУПИК',
    matchedListingId: 'l2',
    matchNote: 'Сильная логистика: ЖД тупик и формат под складской комплекс',
    videoUrl: 'https://www.tiktok.com/@nedvizhimostalmaty02/video/7633486219149643026',
  },
  {
    id: 'v2',
    platform: 'instagram',
    thumbnail: 'https://picsum.photos/seed/v2/600/900',
    authorHandle: '@yerkebulan_alpysbayev',
    views: 1800,
    caption: 'Алматы | Продаётся земельный участок 10 га в промзоне. Бурундай, первая линия ул. Саина.',
    hashtags: ['#недвижимость', '#продажаучастков', '#продажапромбаз', '#алматы'],
    aiRelevant: true,
    aiVerdict: 'Реальный Instagram Reel о продаже участка 10 га под промбазу и складские объекты в промышленном направлении Алматы.',
    extracted: {
      areaLabel: '10 га',
      location: 'Бурундай / Алматы',
      contact: 'Direct / WhatsApp',
    },
    transcript: '…продаётся земельный участок 10 гектаров в промзоне, Бурундай, первая линия улицы Саина, удобные подъездные пути…',
    onScreenText: 'УЧАСТОК 10 ГА • ПРОМЗОНА • АЛМАТЫ',
    matchedListingId: 'l2',
    matchNote: 'Промзона и логистика: стоит сравнить с промбазами на Krisha',
    videoUrl: 'https://www.instagram.com/reel/DUh982sDVxS/',
  },
  {
    id: 'v3',
    platform: 'tiktok',
    thumbnail: 'https://picsum.photos/seed/v3/600/900',
    authorHandle: '@yurta_master',
    views: 19800,
    caption: 'Юрты на заказ, 6 и 8 канатов. Доставка по всему Казахстану 🏕',
    hashtags: ['#юрта', '#киізүй', '#этно'],
    aiRelevant: true,
    aiVerdict: 'Продажа юрт на заказ. Совпадает с интересом «юрты». Контакт сохранён.',
    extracted: {
      priceKzt: 4_900_000,
      areaLabel: '8 канатов',
      location: 'Казахстан, доставка',
    },
    onScreenText: 'ЮРТЫ НА ЗАКАЗ • ДОСТАВКА',
    matchedListingId: 'o1',
    matchNote: 'Сопоставимо с юртой на OLX за 4.75 млн ₸',
    videoUrl: 'https://www.tiktok.com/discover/юрта-на-заказ',
  },
  {
    id: 'v4',
    platform: 'instagram',
    thumbnail: 'https://picsum.photos/seed/v4/600/900',
    authorHandle: '@zemlyaastana',
    views: 64000,
    caption: 'Земля без посредников. Косшы, Талапкер, Қоянды. Запись на просмотр.',
    hashtags: ['#земля', '#астана', '#участки'],
    aiRelevant: false,
    aiVerdict: 'Продажа земли, но регион — Астана, не профиль директора (Алматы). Отфильтровано.',
    extracted: { location: 'Астана / Косшы' },
    videoUrl: 'https://www.instagram.com/zemlyaastana/',
  },
];

// ---------- Видео-радар: интересы и авто-теги ----------
export const videoInterests = ['земля', 'участки', 'юрты', 'птицефабрика', 'оборудование', 'стройка'];
export const videoAutoTags = ['#жерсату', '#участокалматы', '#птицефабрика', '#юрта', '#промбаза', '#спецтехника'];

// Этапы обработки карточки v1
export const videoPipeline = [
  'Нашёл TikTok по #промбазаалматинскаяобласть',
  'Извлёк описание и аудио из ролика',
  'Распознал речь (казахский + русский)',
  'Считал текст с кадра: «5 ГА»',
  'Вытащил площадь, локацию и ЖД-тупик',
  'Сверил с Krisha — релевантно под логистику',
  'Вывод: релевантно ✓',
];

// ---------- Новости ----------
export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Изменения в правилах оформления земель сельхозназначения',
    whyImportant: 'Может затронуть оформление участков под производство в Алматинской области — учтите при сделке.',
    source: 'gov.kz',
    date: '09.06.2026',
  },
  {
    id: 'n2',
    title: 'Новая промзона под Алматы: подведение коммуникаций до конца года',
    whyImportant: 'Участки рядом с будущей промзоной могут вырасти в цене — есть смысл присмотреться сейчас.',
    source: 'kapital.kz',
    date: '07.06.2026',
  },
  {
    id: 'n3',
    title: 'Субсидии на птицефабрики продлены на 2026 год',
    whyImportant: 'Прямо влияет на ваш интерес к участкам под птицефабрику — снижает порог входа.',
    source: 'inform.kz',
    date: '05.06.2026',
  },
  {
    id: 'n4',
    title: 'Рост цен на стройматериалы во втором квартале',
    whyImportant: 'Удорожание строительства — закладывайте в расчёты по объектам под застройку.',
    source: 'forbes.kz',
    date: '03.06.2026',
  },
  {
    id: 'n5',
    title: 'Капшагай: новый логистический хаб в планах акимата',
    whyImportant: 'Дальние участки у Капшагая (как тот за 95 млн) могут стать ликвиднее.',
    source: 'zakon.kz',
    date: '01.06.2026',
  },
  {
    id: 'n6',
    title: 'Льготное кредитование МСБ под производство расширено',
    whyImportant: 'Можно рассмотреть для финансирования покупки промбазы или строительства ангара.',
    source: 'kapital.kz',
    date: '08.06.2026',
  },
  {
    id: 'n7',
    title: 'Тариф на электроэнергию для бизнеса пересмотрят с июля',
    whyImportant: 'Влияет на расчёт окупаемости объектов с высоким энергопотреблением (птицефабрика, холодильники).',
    source: 'inform.kz',
    date: '10.06.2026',
  },
];

// ---------- Погода ----------
export const weatherLocations: Record<WeatherLocationKey, WeatherLocation> = {
  almaty: {
    label: 'Алматы',
    shortLabel: 'Алматы',
    week: [
      { day: 'Чт', tempC: 25, condition: 'Перем. облачность', windMs: 3, rainPct: 15 },
      { day: 'Пт', tempC: 21, condition: 'Дождь', windMs: 11, rainPct: 70 },
      { day: 'Сб', tempC: 23, condition: 'Облачно', windMs: 6, rainPct: 35 },
      { day: 'Вс', tempC: 26, condition: 'Ясно', windMs: 4, rainPct: 10 },
      { day: 'Пн', tempC: 28, condition: 'Ясно', windMs: 3, rainPct: 5 },
      { day: 'Вт', tempC: 29, condition: 'Ясно', windMs: 3, rainPct: 0 },
      { day: 'Ср', tempC: 27, condition: 'Перем. облачность', windMs: 5, rainPct: 20 },
    ],
    aggregationNote:
      'Я сопоставил прогнозы трёх источников для Алматы. Ниже показан усреднённый прогноз по температуре, ветру и вероятности осадков.',
    aiAdvice:
      'В Алматы пятничный дождь может замедлить движение по городу. Для встреч и выездов лучше выбрать четверг после 11:00 или понедельник.',
  },
  talgar: {
    label: 'Талгарский район',
    shortLabel: 'Талгар',
    week: [
      { day: 'Чт', tempC: 26, condition: 'Ясно', windMs: 4, rainPct: 5 },
      { day: 'Пт', tempC: 19, condition: 'Дождь', windMs: 16, rainPct: 80 },
      { day: 'Сб', tempC: 21, condition: 'Облачно', windMs: 9, rainPct: 30 },
      { day: 'Вс', tempC: 24, condition: 'Перем. облачность', windMs: 6, rainPct: 15 },
      { day: 'Пн', tempC: 27, condition: 'Ясно', windMs: 4, rainPct: 5 },
      { day: 'Вт', tempC: 28, condition: 'Ясно', windMs: 3, rainPct: 0 },
      { day: 'Ср', tempC: 25, condition: 'Облачно', windMs: 7, rainPct: 20 },
    ],
    aggregationNote:
      'Я сопоставил прогнозы трёх источников для Талгарского района. Ниже показан усреднённый прогноз по температуре, ветру и вероятности осадков.',
    aiAdvice:
      'По сводному прогнозу в пятницу ожидаются дождь и сильный ветер, в среднем до 16 м/с. Лучшее окно для осмотра объекта — четверг с 11:00 до 16:00.',
  },
  konaev: {
    label: 'Конаев / Капчагай',
    shortLabel: 'Конаев',
    week: [
      { day: 'Чт', tempC: 29, condition: 'Ясно', windMs: 8, rainPct: 0 },
      { day: 'Пт', tempC: 27, condition: 'Облачно', windMs: 18, rainPct: 20 },
      { day: 'Сб', tempC: 28, condition: 'Ясно', windMs: 12, rainPct: 5 },
      { day: 'Вс', tempC: 30, condition: 'Ясно', windMs: 9, rainPct: 0 },
      { day: 'Пн', tempC: 31, condition: 'Ясно', windMs: 7, rainPct: 0 },
      { day: 'Вт', tempC: 32, condition: 'Ясно', windMs: 6, rainPct: 0 },
      { day: 'Ср', tempC: 30, condition: 'Перем. облачность', windMs: 10, rainPct: 10 },
    ],
    aggregationNote:
      'Я сопоставил прогнозы трёх источников для Конаева и побережья Капчагайского водохранилища. Особое внимание уделено ветру.',
    aiAdvice:
      'В пятницу ожидаются порывы ветра до 18 м/с. Осмотр открытого участка лучше провести в четверг утром или перенести на понедельник.',
  },
  kaskelen: {
    label: 'Каскелен',
    shortLabel: 'Каскелен',
    week: [
      { day: 'Чт', tempC: 24, condition: 'Перем. облачность', windMs: 5, rainPct: 15 },
      { day: 'Пт', tempC: 20, condition: 'Дождь', windMs: 13, rainPct: 75 },
      { day: 'Сб', tempC: 22, condition: 'Облачно', windMs: 8, rainPct: 35 },
      { day: 'Вс', tempC: 25, condition: 'Ясно', windMs: 5, rainPct: 10 },
      { day: 'Пн', tempC: 27, condition: 'Ясно', windMs: 4, rainPct: 5 },
      { day: 'Вт', tempC: 28, condition: 'Ясно', windMs: 4, rainPct: 0 },
      { day: 'Ср', tempC: 26, condition: 'Облачно', windMs: 6, rainPct: 20 },
    ],
    aggregationNote:
      'Я сопоставил прогнозы трёх источников для Каскелена. Значения усреднены с учётом предгорной зоны и локальной вероятности осадков.',
    aiAdvice:
      'В Каскелене пятница неблагоприятна для осмотра промбазы из-за дождя. Лучшее окно — четверг до 16:00 или воскресенье утром.',
  },
};

// Default location used by the compact weather widget on the home screen.
export const weatherWeek = weatherLocations.talgar.week;

export const weatherSources = [
  { name: 'Казгидромет', detail: 'официальный прогноз' },
  { name: 'OpenWeather', detail: 'почасовые данные' },
  { name: 'Meteoblue', detail: 'сравнение моделей' },
];

export const weatherAggregationNote =
  weatherLocations.talgar.aggregationNote;

export const weatherAiAdvice =
  weatherLocations.talgar.aiAdvice;

// ---------- Голосовые сценарии ----------
export const voiceScenarios: VoiceScenario[] = [
  {
    id: 's1',
    command: 'Найди участки под птицефабрику рядом с Алматы',
    answer:
      'Нашёл 3 подходящих участка. Лучший — 3 га в Талгарском районе за 120 млн ₸, ' +
      'это на 15–20% ниже рынка. Рядом трасса и промзона. Показать карточку?',
    resultType: 'listing',
    resultListingId: 'l1',
  },
  {
    id: 's2',
    command: 'Что важного за сегодня?',
    answer:
      'Три важных пункта. Первое — участок 3 га в Талгаре дешевле рынка, рекомендую посмотреть. ' +
      'Второе — видео-радар нашёл TikTok по участку 5 га в Алатау с ЖД тупиком и Reel по участку 10 га в промзоне Алматы. ' +
      'Третье — в пятницу дождь и ветер, выезд лучше в четверг.',
    resultType: 'digest',
  },
  {
    id: 's3',
    command: 'Составь вопросы продавцу по этому участку',
    answer: 'Подготовил 5 вопросов продавцу по участку в Талгаре:',
    resultType: 'checklist',
    checklist: [
      'Какое целевое назначение земли по госакту?',
      'Есть ли электричество и какая выделенная мощность?',
      'Как с водой — скважина или центральная?',
      'Есть ли подъезд для грузового транспорта?',
      'Готовы ли документы, нет ли обременений?',
    ],
  },
];

// Голосовой дайджест (для кнопки «Прослушать сводку дня»)
export const voiceDigestLines = [
  'Доброе утро. Вот что важно сегодня.',
  'Участок 3 га в Талгаре — на 15–20% дешевле рынка. Рекомендую посмотреть.',
  'Видео-радар нашёл TikTok по участку 5 га в Алатау и Reel по участку 10 га в промзоне Алматы.',
  'В пятницу дождь и ветер — выезд на объект лучше перенести на четверг.',
];

// ---------- Push-уведомления (для оверлея 5.0) ----------
export const pushSamples: PushSample[] = [
  {
    id: 'p1',
    importance: 'critical',
    title: 'AI Executive Assistant',
    body: 'Появился участок 3 га, похож на сохранённый. Цена ниже рынка на 15–20%. Нажмите, чтобы открыть.',
    target: 'listing',
    payloadId: 'l1',
  },
  {
    id: 'p2',
    importance: 'important',
    title: 'Видео-радар',
    body: 'Нашёл TikTok по участку 5 га в Алатау с ЖД тупиком под логистику.',
    target: 'video',
    payloadId: 'v1',
  },
  {
    id: 'p3',
    importance: 'important',
    title: 'Средний прогноз погоды',
    body: 'AI сопоставил 3 источника: в пятницу дождь и ветер в среднем до 16 м/с. Выезд лучше перенести.',
    target: 'weather',
  },
  {
    id: 'p4',
    importance: 'digest',
    title: 'Важная новость',
    body: 'Изменились правила оформления земель сельхозназначения. AI подготовил краткое пояснение.',
    target: 'news',
  },
  {
    id: 'p5',
    importance: 'silent',
    title: 'Напоминание',
    body: 'До 18:00 нужно позвонить продавцу участка в Талгаре и уточнить воду и электричество.',
    target: 'reminders',
  },
];
