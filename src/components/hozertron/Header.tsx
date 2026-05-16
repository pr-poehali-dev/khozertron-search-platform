import Icon from "@/components/ui/icon";
import { Theme, MOCK_NOTIFICATIONS } from "./types";

interface HeaderProps {
  theme: Theme;
  applyTheme: (t: Theme) => void;
  showProfile: boolean;
  setShowProfile: (v: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  showService: boolean;
  setShowService: (v: boolean) => void;
  closeAll: () => void;
}

export default function Header({
  theme,
  applyTheme,
  showProfile,
  setShowProfile,
  showNotifications,
  setShowNotifications,
  showService,
  setShowService,
  closeAll,
}: HeaderProps) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
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
            onClick={(e) => { e.stopPropagation(); closeAll(); setShowService(!showService); }}
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
            onClick={(e) => { e.stopPropagation(); closeAll(); setShowNotifications(!showNotifications); }}
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
            onClick={(e) => { e.stopPropagation(); closeAll(); setShowProfile(!showProfile); }}
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
  );
}
