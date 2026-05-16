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
