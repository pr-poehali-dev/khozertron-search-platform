import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/hozertron/Header";
import Icon from "@/components/ui/icon";
import {
  Theme,
  ContentType,
  CONTENT_TYPES,
  MOCK_RESULTS,
  ResultItem,
} from "@/components/hozertron/types";

const TYPE_LABEL: Record<ResultItem["type"], string> = {
  game: "Игра",
  news: "Новость",
  video: "Видео",
  short: "Шортс",
};

const CONTENT_TYPE_TO_RESULT: Record<ContentType, ResultItem["type"][] | null> = {
  all: null,
  games: ["game"],
  video: ["video"],
  news: ["news"],
  shorts: ["short"],
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const activeType = (searchParams.get("type") as ContentType) || "all";

  const [theme, setTheme] = useState<Theme>("dark");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showService, setShowService] = useState(false);
  const [inputValue, setInputValue] = useState(query);

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

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim(), type: activeType });
    }
  };

  const setType = (type: ContentType) => {
    setSearchParams({ q: query, type });
  };

  const allowedTypes = CONTENT_TYPE_TO_RESULT[activeType];
  const filtered = MOCK_RESULTS.filter((r) =>
    allowedTypes === null ? true : allowedTypes.includes(r.type)
  );

  const games = filtered.filter((r) => r.type === "game");
  const news = filtered.filter((r) => r.type === "news");
  const videos = filtered.filter((r) => r.type === "video");
  const shorts = filtered.filter((r) => r.type === "short");

  return (
    <div
      className="min-h-screen bg-background relative overflow-x-hidden"
      onClick={closeAll}
    >
      {/* Фоновый декор */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(28 55% 60%), transparent 70%)" }}
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

        {/* Поисковая строка — компактная */}
        <div className="max-w-3xl mx-auto mb-6">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border warm-shadow search-glow"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => navigate("/")} className="flex-shrink-0 transition-opacity hover:opacity-60">
              <Icon name="ArrowLeft" size={20} fallback="ChevronLeft" />
            </button>
            <Icon name="Search" size={18} fallback="Circle" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent outline-none text-base font-medium"
              style={{ color: "hsl(var(--foreground))" }}
              placeholder="Найти игру, видео, новость..."
            />
            <button
              onClick={handleSearch}
              className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:brightness-110 flex-shrink-0"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              Найти
            </button>
          </div>

          {/* Фильтры по типу */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {CONTENT_TYPES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={(e) => { e.stopPropagation(); setType(key); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: activeType === key ? "hsl(var(--accent))" : "hsl(var(--card))",
                  color: activeType === key ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                  boxShadow: activeType === key ? "0 4px 16px hsl(var(--accent) / 0.25)" : undefined,
                }}
              >
                <Icon name={icon as string} size={13} fallback="Circle" />
                {label}
              </button>
            ))}
          </div>

          {/* Счётчик результатов */}
          <p className="mt-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {query
              ? <>По запросу <span className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>«{query}»</span> найдено {filtered.length} результатов</>
              : `Показаны все результаты: ${filtered.length}`
            }
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-10">

          {/* Игры */}
          {games.length > 0 && (
            <Section title="Игры" icon="Gamepad2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((item) => (
                  <GameCard
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/game/${item.id}`)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Новости */}
          {news.length > 0 && (
            <Section title="Новости" icon="Newspaper">
              <div className="flex flex-col gap-3">
                {news.map((item) => <NewsCard key={item.id} item={item} />)}
              </div>
            </Section>
          )}

          {/* Видео */}
          {videos.length > 0 && (
            <Section title="Видео" icon="Play">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((item) => <VideoCard key={item.id} item={item} />)}
              </div>
            </Section>
          )}

          {/* Шортсы */}
          {shorts.length > 0 && (
            <Section title="Шортсы" icon="Film">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shorts.map((item) => <ShortCard key={item.id} item={item} />)}
              </div>
            </Section>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <Icon name="SearchX" size={48} fallback="Search" />
              <p className="mt-4 text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Ничего не найдено
              </p>
              <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Попробуйте изменить запрос или выбрать другой тип контента
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Вспомогательные компоненты ─── */

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "hsl(var(--accent) / 0.15)" }}
        >
          <Icon name={icon as string} size={15} fallback="Circle" style={{ color: "hsl(var(--accent))" } as React.CSSProperties} />
        </div>
        <h2 className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function GameCard({ item, onClick }: { item: ResultItem; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border overflow-hidden warm-shadow transition-all duration-200 hover:scale-[1.02] hover:warm-shadow-lg cursor-pointer"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      {/* Превью */}
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
    </div>
  );
}

function NewsCard({ item }: { item: ResultItem }) {
  return (
    <div
      className="flex gap-4 p-4 rounded-2xl border warm-shadow transition-all duration-200 hover:scale-[1.01] hover:warm-shadow-lg cursor-pointer"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div
        className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: `hsl(${item.color} / 0.12)` }}
      >
        <Icon
          name={item.icon as string}
          size={24}
          fallback="Circle"
          style={{ color: `hsl(${item.color})` } as React.CSSProperties}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-snug" style={{ color: "hsl(var(--foreground))" }}>
            {item.title}
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            {TYPE_LABEL[item.type]}
          </span>
        </div>
        <p className="text-xs mt-1 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>
          {item.description}
        </p>
        <p className="text-xs mt-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.meta}</p>
      </div>
    </div>
  );
}

function VideoCard({ item }: { item: ResultItem }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden warm-shadow transition-all duration-200 hover:scale-[1.02] hover:warm-shadow-lg cursor-pointer"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div
        className="h-32 flex items-center justify-center relative"
        style={{ background: `hsl(${item.color} / 0.12)` }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center warm-shadow"
          style={{ background: "hsl(var(--accent))" }}
        >
          <Icon name="Play" size={20} fallback="Circle" style={{ color: "hsl(var(--accent-foreground))" } as React.CSSProperties} />
        </div>
        {item.duration && (
          <span
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
            style={{ background: "hsl(25 20% 10% / 0.7)", color: "#fff" }}
          >
            {item.duration}
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
        <p className="text-xs mt-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.meta}</p>
      </div>
    </div>
  );
}

function ShortCard({ item }: { item: ResultItem }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden warm-shadow transition-all duration-200 hover:scale-[1.03] hover:warm-shadow-lg cursor-pointer"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div
        className="h-40 flex flex-col items-center justify-center relative"
        style={{ background: `hsl(${item.color} / 0.12)` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--accent))" }}
        >
          <Icon name="Play" size={16} fallback="Circle" style={{ color: "hsl(var(--accent-foreground))" } as React.CSSProperties} />
        </div>
        {item.duration && (
          <span
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
            style={{ background: "hsl(25 20% 10% / 0.7)", color: "#fff" }}
          >
            {item.duration}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-xs leading-snug line-clamp-2" style={{ color: "hsl(var(--foreground))" }}>
          {item.title}
        </p>
        <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{item.meta}</p>
      </div>
    </div>
  );
}