import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/hozertron/Header";
import Icon from "@/components/ui/icon";
import {
  Theme,
  MOCK_RESULTS,
  GAME_DETAILS,
  ResultItem,
} from "@/components/hozertron/types";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gameId = Number(id);
  const game = MOCK_RESULTS.find((r) => r.id === gameId && r.type === "game");
  const details = GAME_DETAILS[gameId];

  const [theme, setTheme] = useState<Theme>("light");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showService, setShowService] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [saved, setSaved] = useState(false);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    root.classList.remove("dark", "system");
    if (t === "dark") root.classList.add("dark");
    if (t === "system") root.classList.add("system");
  };

  const closeAll = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowService(false);
  };

  if (!game || !details) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <Icon name="Gamepad2" size={48} fallback="Circle" />
        <p className="mt-4 text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
          Игра не найдена
        </p>
        <button
          onClick={() => navigate("/search")}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
        >
          К результатам
        </button>
      </div>
    );
  }

  const similar = details.similar
    .map((sid) => MOCK_RESULTS.find((r) => r.id === sid))
    .filter(Boolean) as ResultItem[];

  return (
    <div
      className="min-h-screen bg-background relative overflow-x-hidden"
      onClick={closeAll}
    >
      {/* Фоновый декор */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, hsl(${game.color}), transparent 70%)` }}
        />
        <div
          className="absolute -bottom-48 -right-24 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, hsl(${game.color}), transparent 70%)` }}
        />
      </div>

      <Header
        theme={theme}
        applyTheme={applyTheme}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showService={showService}
        setShowService={setShowService}
        closeAll={closeAll}
      />

      <main className="relative z-10 px-4 md:px-8 pb-16">

        {/* Кнопка назад */}
        <div className="max-w-5xl mx-auto mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:scale-105 warm-shadow"
            style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
          >
            <Icon name="ArrowLeft" size={15} fallback="ChevronLeft" />
            Назад
          </button>
        </div>

        <div className="max-w-5xl mx-auto animate-fade-in">

          {/* Главный скриншот */}
          <div
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden warm-shadow-lg mb-3"
            style={{
              background: `linear-gradient(135deg, hsl(${details.screenshotColors[activeScreenshot]}) 0%, hsl(${game.color}) 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                name={game.icon as string}
                size={120}
                fallback="Circle"
                style={{ color: "rgba(255,255,255,0.25)" } as React.CSSProperties}
              />
            </div>
            {game.badge && (
              <span
                className="absolute top-4 right-4 px-3 py-1 rounded-xl text-sm font-bold warm-shadow"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              >
                {game.badge}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
              <p className="text-white/70 text-sm font-medium mb-1">{details.genre}</p>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {game.title}
              </h1>
            </div>
          </div>

          {/* Превью скриншотов */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {details.screenshotColors.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveScreenshot(idx)}
                className="h-16 md:h-20 rounded-xl overflow-hidden transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, hsl(${c}) 0%, hsl(${game.color}) 100%)`,
                  outline: activeScreenshot === idx ? "3px solid hsl(var(--accent))" : "none",
                  outlineOffset: "2px",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    name={game.icon as string}
                    size={20}
                    fallback="Circle"
                    style={{ color: "rgba(255,255,255,0.4)" } as React.CSSProperties}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Кнопки действий + рейтинг */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:brightness-110 warm-shadow"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              <Icon name="Play" size={15} fallback="Circle" />
              Играть сейчас
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 warm-shadow"
              style={{
                background: saved ? "hsl(var(--accent))" : "hsl(var(--card))",
                color: saved ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))",
              }}
            >
              <Icon name={saved ? "BookmarkCheck" : "Bookmark"} size={15} fallback="Bookmark" />
              {saved ? "Сохранено" : "Сохранить"}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 warm-shadow"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
            >
              <Icon name="Share2" size={15} fallback="Share" />
              Поделиться
            </button>

            {game.rating && (
              <div
                className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl warm-shadow"
                style={{ background: "hsl(var(--card))" }}
              >
                <Icon name="Star" size={16} fallback="Circle" style={{ color: "hsl(var(--accent))" } as React.CSSProperties} />
                <span className="text-lg font-black" style={{ color: "hsl(var(--accent))" }}>{game.rating}</span>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>/ 10</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Описание */}
            <div className="md:col-span-2 space-y-6">
              <div
                className="p-5 rounded-2xl warm-shadow border"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <h2 className="text-lg font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                  Об игре
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {details.longDescription}
                </p>
              </div>

              {/* Теги */}
              <div
                className="p-5 rounded-2xl warm-shadow border"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <h2 className="text-lg font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                  Теги
                </h2>
                <div className="flex flex-wrap gap-2">
                  {details.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "Users", label: "Игроки", value: details.stats.players },
                  { icon: "ThumbsUp", label: "Отзывы", value: details.stats.reviews },
                  { icon: "Clock", label: "В среднем", value: details.stats.playtime },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3 rounded-2xl text-center warm-shadow border"
                    style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  >
                    <Icon name={s.icon as string} size={18} fallback="Circle" style={{ color: "hsl(var(--accent))" } as React.CSSProperties} />
                    <p className="text-xs mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Боковая инфо-панель */}
            <div className="space-y-3">
              <div
                className="p-5 rounded-2xl warm-shadow border"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Информация
                </h2>
                <div className="space-y-3 text-sm">
                  <InfoRow icon="Code2" label="Разработчик" value={details.developer} />
                  <InfoRow icon="Building" label="Издатель" value={details.publisher} />
                  <InfoRow icon="Calendar" label="Релиз" value={details.releaseDate} />
                  <InfoRow icon="Tag" label="Жанр" value={details.genre} />
                </div>
              </div>

              <div
                className="p-5 rounded-2xl warm-shadow border"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Платформы
                </h2>
                <div className="flex flex-wrap gap-2">
                  {details.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Похожие игры */}
          {similar.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--accent) / 0.15)" }}
                >
                  <Icon name="Sparkles" size={15} fallback="Circle" style={{ color: "hsl(var(--accent))" } as React.CSSProperties} />
                </div>
                <h2 className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>
                  Похожие игры
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similar.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/game/${item.id}`)}
                    className="text-left rounded-2xl border overflow-hidden warm-shadow transition-all duration-200 hover:scale-[1.02] hover:warm-shadow-lg"
                    style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  >
                    <div
                      className="h-28 flex items-center justify-center relative"
                      style={{ background: `hsl(${item.color} / 0.12)` }}
                    >
                      <Icon
                        name={item.icon as string}
                        size={40}
                        fallback="Circle"
                        style={{ color: `hsl(${item.color})`, opacity: 0.6 } as React.CSSProperties}
                      />
                      {item.badge && (
                        <span
                          className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
                          style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm leading-snug" style={{ color: "hsl(var(--foreground))" }}>
                        {item.title}
                      </p>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.meta}</span>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={11} fallback="Circle" style={{ color: "hsl(var(--accent))" } as React.CSSProperties} />
                            <span className="text-xs font-bold" style={{ color: "hsl(var(--accent))" }}>{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} size={15} fallback="Circle" style={{ color: "hsl(var(--muted-foreground))" } as React.CSSProperties} />
      <div className="flex-1">
        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{value}</p>
      </div>
    </div>
  );
}
