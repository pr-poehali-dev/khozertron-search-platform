import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const QUICK_ITEMS = [
  { icon: "Gamepad2", label: "Игры", sub: "14 200+ объектов", color: "28 60% 45%", type: "games" },
  { icon: "Play", label: "Видео", sub: "Свежие ролики", color: "25 50% 40%", type: "video" },
  { icon: "Newspaper", label: "Новости", sub: "Обновлено 5 мин назад", color: "22 45% 38%", type: "news" },
  { icon: "Film", label: "Шортсы", sub: "Популярное сегодня", color: "30 55% 42%", type: "shorts" },
];

export default function QuickAccess() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <p className="text-xs font-semibold mb-4 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
        БЫСТРЫЙ ДОСТУП
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ITEMS.map(({ icon, label, sub, color, type }) => (
          <button
            key={label}
            onClick={() => navigate(`/search?q=&type=${type}`)}
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
  );
}