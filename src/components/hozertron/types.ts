export type Theme = "light" | "dark" | "system";
export type SearchMode = "text" | "voice" | "image";
export type ContentType = "all" | "games" | "video" | "news" | "shorts";
export type DateFilter = "any" | "day" | "week" | "month" | "year";

export const CONTENT_TYPES: { key: ContentType; label: string; icon: string }[] = [
  { key: "all", label: "Всё", icon: "LayoutGrid" },
  { key: "games", label: "Игры", icon: "Gamepad2" },
  { key: "video", label: "Видео", icon: "Play" },
  { key: "news", label: "Новости", icon: "Newspaper" },
  { key: "shorts", label: "Шортсы", icon: "Film" },
];

export const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: "any", label: "Любое время" },
  { key: "day", label: "За сутки" },
  { key: "week", label: "За неделю" },
  { key: "month", label: "За месяц" },
  { key: "year", label: "За год" },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Новая карточка игры добавлена", time: "2 мин", read: false },
  { id: 2, text: "Ваш поиск сохранён", time: "1 час", read: false },
  { id: 3, text: "Обновление новостей по теме", time: "3 часа", read: true },
];

export const MOCK_HISTORY = [
  "Лучшие стратегии 2025",
  "Инди-игры с открытым миром",
  "Новости геймдева",
  "Короткие видео аниме",
];

export interface ResultItem {
  id: number;
  type: "game" | "news" | "video" | "short";
  title: string;
  description: string;
  meta: string;
  rating?: number;
  duration?: string;
  badge?: string;
  color: string;
  icon: string;
}

export const MOCK_RESULTS: ResultItem[] = [
  {
    id: 1,
    type: "game",
    title: "Elden Ring: Shadow of the Erdtree",
    description: "Масштабное дополнение к легендарной ролевой игре. Новые боссы, локации и оружие ждут смельчаков.",
    meta: "FromSoftware · RPG · 2024",
    rating: 9.4,
    badge: "Хит",
    color: "28 60% 45%",
    icon: "Gamepad2",
  },
  {
    id: 2,
    type: "game",
    title: "Hollow Knight: Silksong",
    description: "Долгожданное продолжение культового метроидвания о приключениях Хорнет в новом королевстве.",
    meta: "Team Cherry · Metroidvania · 2025",
    rating: 9.1,
    badge: "Новинка",
    color: "28 60% 45%",
    icon: "Gamepad2",
  },
  {
    id: 3,
    type: "game",
    title: "Hades II",
    description: "Продолжение рогалика от Supergiant Games. Играем за Мелиною — дочь Аида в погоне за Кроносом.",
    meta: "Supergiant · Roguelike · 2024",
    rating: 9.6,
    badge: "Топ",
    color: "28 60% 45%",
    icon: "Gamepad2",
  },
  {
    id: 4,
    type: "news",
    title: "Steam следующий фест: даты и самые ожидаемые демо",
    description: "Valve анонсировала очередной фестиваль демоверсий на Steam. Более 2000 игр будут доступны бесплатно на неделю.",
    meta: "Игромания · 2 часа назад",
    color: "22 45% 38%",
    icon: "Newspaper",
  },
  {
    id: 5,
    type: "news",
    title: "CD Projekt RED раскрыла детали Cyberpunk 2 на Summer Game Fest",
    description: "Новая часть культовой RPG получит обновлённый движок, процедурный город и кооперативный режим.",
    meta: "DTF · 5 часов назад",
    color: "22 45% 38%",
    icon: "Newspaper",
  },
  {
    id: 6,
    type: "video",
    title: "Обзор: почему Balatro — лучшая инди-игра 2024 года",
    description: "Разбираем механики карточного рогалика, который покорил весь мир и собрал миллионы часов в Steam.",
    meta: "StopGame · 18 мин",
    duration: "18:42",
    color: "25 50% 40%",
    icon: "Play",
  },
  {
    id: 7,
    type: "video",
    title: "Топ-10 инди-игр, которые вышли в мае 2025",
    description: "Собрали лучшие независимые релизы месяца — от пиксельных платформеров до атмосферных хорроров.",
    meta: "Gameinator · 24 мин",
    duration: "24:15",
    color: "25 50% 40%",
    icon: "Play",
  },
  {
    id: 8,
    type: "short",
    title: "Пасхалка в Elden Ring, которую нашли спустя 2 года",
    description: "Игроки обнаружили скрытое послание разработчиков в самом неожиданном месте игры.",
    meta: "GameShorts · 58 сек",
    duration: "0:58",
    color: "30 55% 42%",
    icon: "Film",
  },
  {
    id: 9,
    type: "short",
    title: "Как выглядит графика игр через 20 лет эволюции",
    description: "Сравниваем скриншоты одних и тех же серий с разницей в два десятилетия.",
    meta: "PixelHistory · 1 мин",
    duration: "1:12",
    color: "30 55% 42%",
    icon: "Film",
  },
];