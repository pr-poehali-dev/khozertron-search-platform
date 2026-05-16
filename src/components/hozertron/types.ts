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

export interface GameDetails {
  longDescription: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genre: string;
  platforms: string[];
  tags: string[];
  screenshotColors: string[];
  stats: { players: string; reviews: string; playtime: string };
  similar: number[];
}

export const GAME_DETAILS: Record<number, GameDetails> = {
  1: {
    longDescription:
      "Shadow of the Erdtree — крупнейшее дополнение в истории FromSoftware. Откройте Земли Теней — таинственное измерение, скрытое за древом Эрд. Сражайтесь с легендарными полубогами, исследуйте величественные руины и раскройте судьбу Микеллы Безупречного. Дополнение приносит более 100 часов нового контента, десятки новых видов оружия и заклинаний.",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: "21 июня 2024",
    genre: "Souls-like RPG",
    platforms: ["PC", "PS5", "PS4", "Xbox Series X|S"],
    tags: ["Открытый мир", "Сложная", "Тёмное фэнтези", "Кооператив", "PvP"],
    screenshotColors: ["28 60% 35%", "22 50% 40%", "30 55% 45%", "25 45% 30%"],
    stats: { players: "1.2M онлайн", reviews: "94% положит.", playtime: "~120 часов" },
    similar: [2, 3],
  },
  2: {
    longDescription:
      "Hollow Knight: Silksong — продолжение культовой метроидвании от Team Cherry. Управляйте Хорнет в её путешествии по королевству Фарлум — миру шёлка, песнопений и забытых королей. Более 150 врагов, ремесло, новые способы передвижения и атмосферный саундтрек Кристофера Ларкина.",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    releaseDate: "2025",
    genre: "Метроидвания",
    platforms: ["PC", "Switch", "PS5", "Xbox Series X|S"],
    tags: ["Платформер", "Атмосферная", "Ручная анимация", "2D", "Сложная"],
    screenshotColors: ["210 30% 35%", "260 25% 40%", "200 35% 30%", "180 30% 45%"],
    stats: { players: "850K ожидают", reviews: "Не вышла", playtime: "~50 часов" },
    similar: [1, 3],
  },
  3: {
    longDescription:
      "Hades II — второй раз вырвитесь из подземного мира, но теперь в роли Мелинои, бессмертной принцессы. Сражайтесь со всеми силами Олимпа и Хаоса, освойте мощную магию и встретьте новых богов в стильном изометрическом рогалике от создателей Hades.",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "В раннем доступе с 2024",
    genre: "Roguelike",
    platforms: ["PC"],
    tags: ["Изометрия", "Мифология", "Реиграбельность", "Сюжетная", "Боёвка"],
    screenshotColors: ["320 40% 35%", "280 35% 40%", "340 45% 30%", "300 30% 45%"],
    stats: { players: "320K онлайн", reviews: "97% положит.", playtime: "~80 часов" },
    similar: [1, 2],
  },
};

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