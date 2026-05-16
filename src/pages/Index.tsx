import { useState } from "react";
import Icon from "@/components/ui/icon";

const navItems = [
  { icon: "Sparkles", label: "Новый чат", active: true },
  { icon: "MessageSquare", label: "Мои чаты" },
  { icon: "Brain", label: "Память" },
  { icon: "FolderKanban", label: "Проекты" },
  { icon: "Wrench", label: "Инструменты" },
];

const recentChats = [
  { title: "Идеи для стартапа", time: "2 мин назад", icon: "Rocket" },
  { title: "Python скрипт парсера", time: "1 ч назад", icon: "Code2" },
  { title: "План тренировок", time: "Вчера", icon: "Dumbbell" },
  { title: "Рецепты на неделю", time: "2 дня назад", icon: "ChefHat" },
];

const quickCards = [
  {
    title: "Креатив",
    desc: "Идеи, тексты, посты",
    icon: "Palette",
    gradient: "from-fuchsia-500/20 to-purple-600/20",
    glow: "shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)]",
  },
  {
    title: "Код",
    desc: "Пиши и отлаживай",
    icon: "Terminal",
    gradient: "from-cyan-500/20 to-blue-600/20",
    glow: "shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]",
  },
  {
    title: "Анализ",
    desc: "Данные, графики",
    icon: "LineChart",
    gradient: "from-emerald-500/20 to-teal-600/20",
    glow: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
  },
  {
    title: "Учёба",
    desc: "Объясни и научи",
    icon: "GraduationCap",
    gradient: "from-pink-500/20 to-rose-600/20",
    glow: "shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)]",
  },
];

const modes = [
  { label: "Быстрый", icon: "Zap" },
  { label: "Исследование", icon: "Search" },
  { label: "Рассуждение", icon: "Lightbulb" },
];

const Index = () => {
  const [activeMode, setActiveMode] = useState("Быстрый");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <aside className="w-64 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border flex flex-col relative z-10">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
              <Icon name="Sparkles" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight">Nebula</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ИИ Лаунчер</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                item.active
                  ? "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/30 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.6)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon name={item.icon} size={17} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">Недавнее</div>
          <div className="space-y-1 max-h-[280px] overflow-y-auto">
            {recentChats.map((chat) => (
              <button
                key={chat.title}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sidebar-foreground hover:bg-sidebar-accent transition-colors group"
              >
                <Icon name={chat.icon} size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{chat.title}</div>
                  <div className="text-[10px] text-muted-foreground">{chat.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-sidebar-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-xs font-bold">
            Ю
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Юра Космонавт</div>
            <div className="text-[10px] text-muted-foreground">PRO план</div>
          </div>
          <button className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
            <Icon name="Settings" size={14} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10">
        <header className="flex items-center justify-between px-8 py-4 border-b border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Home" size={14} />
            <span>/</span>
            <span className="text-foreground">Главная</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/50 hover:bg-secondary border border-border flex items-center gap-1.5">
              <Icon name="Command" size={12} />
              <span>K</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Icon name="Bell" size={16} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-5xl mx-auto w-full">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Онлайн · 17 мая 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent neon-text">
              Привет, Юра
            </h1>
            <p className="text-muted-foreground text-lg">Чем помочь сегодня?</p>
          </div>

          <div className="w-full max-w-3xl animate-fade-in">
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-2 search-glow warm-shadow-lg">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Спроси о чём угодно..."
                rows={2}
                className="relative w-full bg-transparent resize-none px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="relative flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-1.5">
                  {modes.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setActiveMode(m.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeMode === m.label
                          ? "bg-primary/20 text-primary border border-primary/40"
                          : "text-muted-foreground hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <Icon name={m.icon} size={13} />
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                    <Icon name="Paperclip" size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                    <Icon name="Mic" size={16} />
                  </button>
                  <button className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-accent text-white neon-glow hover:scale-105 transition-transform">
                    <Icon name="ArrowUp" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 animate-fade-in">
            {quickCards.map((card) => (
              <button
                key={card.title}
                className={`group relative p-4 rounded-xl bg-gradient-to-br ${card.gradient} border border-border hover:border-primary/40 transition-all hover:-translate-y-0.5 ${card.glow} text-left overflow-hidden`}
              >
                <div className="absolute inset-0 bg-card/40 backdrop-blur-sm" />
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-card/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon name={card.icon} size={18} className="text-primary" />
                  </div>
                  <div className="font-semibold text-sm">{card.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-10 text-xs text-muted-foreground animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Icon name="Shield" size={12} className="text-primary" />
              <span>Защищено</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Icon name="Zap" size={12} className="text-accent" />
              <span>GPT-5 Turbo</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Icon name="Globe" size={12} />
              <span>Русский</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
