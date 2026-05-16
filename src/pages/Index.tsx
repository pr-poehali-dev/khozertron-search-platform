import React, { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type Theme = "light" | "dark" | "system";
type SearchMode = "text" | "voice" | "image";
type ContentType = "all" | "games" | "video" | "news" | "shorts";
type DateFilter = "any" | "day" | "week" | "month" | "year";

const CONTENT_TYPES: { key: ContentType; label: string; icon: string }[] = [
  { key: "all", label: "Всё", icon: "LayoutGrid" },
  { key: "games", label: "Игры", icon: "Gamepad2" },
  { key: "video", label: "Видео", icon: "Play" },
  { key: "news", label: "Новости", icon: "Newspaper" },
  { key: "shorts", label: "Шортсы", icon: "Film" },
];

const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: "any", label: "Любое время" },
  { key: "day", label: "За сутки" },
  { key: "week", label: "За неделю" },
  { key: "month", label: "За месяц" },
  { key: "year", label: "За год" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Новая карточка игры добавлена", time: "2 мин", read: false },
  { id: 2, text: "Ваш поиск сохранён", time: "1 час", read: false },
  { id: 3, text: "Обновление новостей по теме", time: "3 часа", read: true },
];

const MOCK_HISTORY = [
  "Лучшие стратегии 2025",
  "Инди-игры с открытым миром",
  "Новости геймдева",
  "Короткие видео аниме",
];

export default function Index() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("text");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [theme, setTheme] = useState<Theme>("light");
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showService, setShowService] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    root.classList.remove("dark", "system");
    if (t === "dark") root.classList.add("dark");
    if (t === "system") root.classList.add("system");
  };

  const toggleVoice = () => {
    setSearchMode("voice");
    setIsListening((v) => !v);
  };

  const handleImageClick = () => {
    setSearchMode("image");
    fileInputRef.current?.click();
  };

  const closeAll = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowService(false);
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div
      className="min-h-screen bg-background relative overflow-x-hidden"
      onClick={closeAll}
    >
      {/* Фоновый декор */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(28 55% 60%), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-48 -right-24 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(25 45% 45%), transparent 70%)" }}
        />
      </div>

      {/* Шапка */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4">
        {/* Логотип */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center warm-shadow"
            style={{ background: "hsl(var(--accent))" }}
          >
            <span className="text-lg font-black" style={{ color: "hsl(var(--accent-foreground))" }}>Х</span>
          </div>
          <span className="text-xl font-bold hidden sm:block" style={{ color: "hsl(var(--foreground))" }}>
            Хозертрон
          </span>
        </div>

        {/* Правая панель */}
        <div className="flex items-center gap-2 animate-fade-in">

          {/* Кнопка сервиса */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); closeAll(); setShowService((v) => !v); }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 warm-shadow"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
              title="Сервисы"
            >
              <Icon name="Grid3X3" size={18} />
            </button>
            {showService && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 w-56 rounded-2xl warm-shadow-lg border animate-slide-down z-50 overflow-hidden"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="p-3 font-semibold text-sm border-b"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                >
                  Сервисы Хозертрона
                </div>
                {[
                  { icon: "Gamepad2", label: "Игровой центр" },
                  { icon: "Tv2", label: "Видеотека" },
                  { icon: "Rss", label: "Новостная лента" },
                  { icon: "Zap", label: "Быстрый поиск" },
                  { icon: "BookOpen", label: "База знаний" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted text-left"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <Icon name={item.icon as string} size={16} fallback="Circle" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Уведомления */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); closeAll(); setShowNotifications((v) => !v); }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 warm-shadow"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
              title="Уведомления"
            >
              <Icon name="Mail" size={18} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 w-72 rounded-2xl warm-shadow-lg border animate-slide-down z-50 overflow-hidden"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="p-3 font-semibold text-sm border-b flex items-center justify-between"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                >
                  <span>Уведомления</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                  >
                    {unreadCount} новых
                  </span>
                </div>
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors hover:bg-muted"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "opacity-0" : ""}`}
                      style={{ background: "hsl(var(--accent))" }}
                    />
                    <div>
                      <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{n.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{n.time} назад</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Профиль */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); closeAll(); setShowProfile((v) => !v); }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 warm-shadow font-semibold text-sm"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              title="Профиль"
            >
              АЛ
            </button>
            {showProfile && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 w-64 rounded-2xl warm-shadow-lg border animate-slide-down z-50 overflow-hidden"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                {/* Шапка профиля */}
                <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                      style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                    >АЛ</div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Алексей Л.</p>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Уровень: Искатель</p>
                    </div>
                  </div>
                </div>

                {[
                  { icon: "User", label: "Перейти в профиль" },
                  { icon: "Bookmark", label: "Сохранённые поиски" },
                  { icon: "Video", label: "Видео и новости" },
                  { icon: "Clock", label: "История запросов" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted text-left border-b"
                    style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                  >
                    <Icon name={item.icon as string} size={16} fallback="Circle" />
                    {item.label}
                  </button>
                ))}

                {/* Тема */}
                <div className="p-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-xs mb-2 font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Тема оформления</p>
                  <div className="flex gap-1">
                    {(
                      [
                        ["light", "Светлая", "Sun"],
                        ["dark", "Тёмная", "Moon"],
                        ["system", "Системная", "Monitor"],
                      ] as [Theme, string, string][]
                    ).map(([t, label, icon]) => (
                      <button
                        key={t}
                        onClick={() => applyTheme(t)}
                        className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: theme === t ? "hsl(var(--accent))" : "hsl(var(--muted))",
                          color: theme === t ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        <Icon name={icon as string} size={14} fallback="Circle" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  <Icon name="Settings" size={16} />
                  Настройки
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Центральный контент */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-24 md:pt-24">

        {/* Приветствие */}
        <div className="text-center mb-10 animate-fade-in">
          <h1
            className="text-4xl md:text-6xl font-black mb-3 leading-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Добро пожаловать<br />
            <span style={{ color: "hsl(var(--accent))" }}>в Хозертрон</span>
          </h1>
          <p className="text-base md:text-lg max-w-md mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Точная и быстрая информация — игры, видео, новости и многое другое
          </p>
        </div>

        {/* Поисковой блок */}
        <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>

          {/* Переключатель режима */}
          <div className="flex justify-center gap-2 mb-4">
            {(
              [
                ["text", "Текст", "Type"],
                ["voice", "Голос", "Mic"],
                ["image", "Картинка", "ImagePlus"],
              ] as [SearchMode, string, string][]
            ).map(([mode, label, icon]) => (
              <button
                key={mode}
                onClick={() => {
                  if (mode === "image") {
                    handleImageClick();
                  } else {
                    setSearchMode(mode);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: searchMode === mode ? "hsl(var(--accent))" : "hsl(var(--card))",
                  color: searchMode === mode ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                  boxShadow: searchMode === mode ? "0 4px 16px hsl(var(--accent) / 0.3)" : undefined,
                }}
              >
                <Icon name={icon as string} size={15} fallback="Circle" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Поисковая строка */}
          <div
            className="search-glow rounded-2xl border warm-shadow-lg overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            {searchMode === "image" ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                onClick={handleImageClick}
                className="flex flex-col items-center justify-center py-10 px-6 cursor-pointer transition-colors"
                style={{ background: dragOver ? "hsl(var(--accent) / 0.08)" : undefined }}
              >
                <Icon name="ImagePlus" size={40} fallback="Image" />
                <p className="mt-3 font-medium" style={{ color: "hsl(var(--foreground))" }}>
                  Перетащите картинку или нажмите для выбора
                </p>
                <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>PNG, JPG, WEBP</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
              </div>
            ) : (
              <div className="flex items-center px-4 py-3 gap-3">
                <Icon name="Search" size={20} fallback="Circle" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    searchMode === "voice" && isListening
                      ? "Слушаю..."
                      : "Найти игру, видео, новость..."
                  }
                  className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
                  style={{
                    color: "hsl(var(--foreground))",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && setShowFilters(true)}
                />

                <div className="flex items-center gap-1">
                  {/* Фильтры */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowFilters((v) => !v); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: showFilters ? "hsl(var(--accent))" : "hsl(var(--muted))",
                      color: showFilters ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                    }}
                    title="Фильтры"
                  >
                    <Icon name="SlidersHorizontal" size={15} fallback="Filter" />
                  </button>

                  {/* Голос */}
                  <button
                    onClick={toggleVoice}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isListening ? "mic-pulse" : ""}`}
                    style={{
                      background: isListening ? "hsl(var(--destructive))" : "hsl(var(--muted))",
                      color: isListening ? "hsl(var(--destructive-foreground))" : "hsl(var(--muted-foreground))",
                    }}
                    title={isListening ? "Остановить" : "Голосовой поиск"}
                  >
                    <Icon name={isListening ? "MicOff" : "Mic"} size={15} fallback="Mic" />
                  </button>

                  {/* Картинка */}
                  <button
                    onClick={handleImageClick}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    title="Поиск по картинке"
                  >
                    <Icon name="ImagePlus" size={15} fallback="Image" />
                  </button>

                  {/* Поиск */}
                  <button
                    className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:brightness-110"
                    style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                  >
                    Найти
                  </button>
                </div>
              </div>
            )}

            {/* Фильтры */}
            {showFilters && searchMode !== "image" && (
              <div
                className="border-t px-4 py-4 animate-slide-down"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  ТИП КОНТЕНТА
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CONTENT_TYPES.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => setContentType(key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: contentType === key ? "hsl(var(--accent))" : "hsl(var(--muted))",
                        color: contentType === key ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      <Icon name={icon as string} size={13} fallback="Circle" />
                      {label}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  ПЕРИОД
                </p>
                <div className="flex flex-wrap gap-2">
                  {DATE_FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setDateFilter(key)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: dateFilter === key ? "hsl(var(--primary))" : "hsl(var(--muted))",
                        color: dateFilter === key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* История поиска */}
          <div className="mt-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs font-semibold mb-2 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
              НЕДАВНИЕ ПОИСКИ
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {MOCK_HISTORY.map((h) => (
                <button
                  key={h}
                  onClick={() => setQuery(h)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all hover:scale-105 warm-shadow"
                  style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                >
                  <Icon name="Clock" size={12} fallback="Circle" />
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Категории быстрого доступа */}
        <div className="w-full max-w-2xl mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs font-semibold mb-4 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            БЫСТРЫЙ ДОСТУП
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "Gamepad2", label: "Игры", sub: "14 200+ объектов", color: "28 60% 45%" },
              { icon: "Play", label: "Видео", sub: "Свежие ролики", color: "25 50% 40%" },
              { icon: "Newspaper", label: "Новости", sub: "Обновлено 5 мин назад", color: "22 45% 38%" },
              { icon: "Film", label: "Шортсы", sub: "Популярное сегодня", color: "30 55% 42%" },
            ].map(({ icon, label, sub, color }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl warm-shadow transition-all duration-200 hover:scale-105"
                style={{ background: "hsl(var(--card))" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${color} / 0.15)` }}
                >
                  <Icon
                    name={icon as string}
                    size={24}
                    fallback="Circle"
                    style={{ color: `hsl(${color})` } as React.CSSProperties}
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}