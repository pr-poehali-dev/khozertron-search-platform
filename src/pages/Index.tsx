import Icon from "@/components/ui/icon";

const navItems = [
  { icon: "Home", label: "Главная" },
  { icon: "Gamepad2", label: "Игры" },
  { icon: "Trophy", label: "Турниры" },
  { icon: "Users", label: "Команда" },
  { icon: "Newspaper", label: "Новости" },
  { icon: "Store", label: "Магазин" },
];

const mainPageCards = [
  {
    title: "CYBER STRIKE",
    tag: "FPS · Online",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  },
  { title: "Neon Drift", tag: "Racing", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80" },
  { title: "Dark Realm", tag: "RPG", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
  { title: "Apex Zone", tag: "Battle Royal", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80" },
  { title: "Void Hunter", tag: "Sci-Fi", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80" },
];

const games = [
  { title: "Phantom Ops", tag: "Action", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80" },
  { title: "Steel Legion", tag: "Strategy", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80" },
  { title: "Ghost Protocol", tag: "Stealth", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80" },
  { title: "Iron Wars", tag: "MOBA", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
  { title: "Neon City", tag: "Open World", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
  { title: "Solar Flare", tag: "Shooter", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80" },
  { title: "Void Reaper", tag: "Horror", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
  { title: "Storm Riders", tag: "Racing", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80" },
];

const opponents = [
  { name: "Shadow", rank: "#1", img: "https://i.pravatar.cc/100?img=11" },
  { name: "Viper", rank: "#2", img: "https://i.pravatar.cc/100?img=12" },
  { name: "Frost", rank: "#3", img: "https://i.pravatar.cc/100?img=13" },
  { name: "Blaze", rank: "#4", img: "https://i.pravatar.cc/100?img=14" },
  { name: "Storm", rank: "#5", img: "https://i.pravatar.cc/100?img=15" },
  { name: "Raven", rank: "#6", img: "https://i.pravatar.cc/100?img=16" },
];

const newsCards = [
  { title: "Новый сезон Cyber Strike", date: "17 МАЯ", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
  { title: "Турнир CS Masters 2026", date: "20 МАЯ", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
  { title: "Обновление Dark Realm 2.0", date: "25 МАЯ", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80" },
];

const SectionTitle = ({ ghost, title }: { ghost: string; title: string }) => (
  <div className="text-center mb-8 relative">
    <h2 className="text-5xl md:text-7xl font-black tracking-wider text-foreground/[0.04] absolute inset-0 flex items-center justify-center select-none uppercase">
      {ghost}
    </h2>
    <h2 className="relative text-2xl font-bold tracking-widest uppercase neon-text text-primary py-6">
      {title}
    </h2>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <div className="fixed top-[10%] -left-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] -right-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[10%] -left-32 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center neon-glow">
              <Icon name="Gamepad2" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black text-lg leading-none tracking-wider">ARENA</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-primary">by next gamers</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <button
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === 0
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Icon name="Search" size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Icon name="Bell" size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-sm font-bold ml-1 neon-glow">
              Ю
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-20">
        <section>
          <SectionTitle ghost="Main Page" title="Главная страница" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 md:row-span-2 group relative h-[420px] rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-all">
              <img src={mainPageCards[0].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs text-primary uppercase tracking-widest mb-2">{mainPageCards[0].tag}</div>
                <div className="text-3xl font-black mb-3 neon-text">{mainPageCards[0].title}</div>
                <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform neon-glow">
                  <Icon name="Play" size={14} />
                  Играть
                </button>
              </div>
            </div>

            {mainPageCards.slice(1).map((card) => (
              <div key={card.title} className="group relative h-[200px] rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-all cursor-pointer">
                <img src={card.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-[10px] text-primary uppercase tracking-widest mb-1">{card.tag}</div>
                  <div className="text-base font-bold">{card.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle ghost="Games" title="Игры" />
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {["Все", "Популярные", "Новые", "Топ"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    i === 0
                      ? "bg-primary text-primary-foreground neon-glow"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="text-xs text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Смотреть все <Icon name="ArrowRight" size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {games.map((game) => (
              <div key={game.title} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-all cursor-pointer">
                <img src={game.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30">
                  {game.tag}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-bold text-sm">{game.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="Star" size={11} className="text-primary fill-primary" />
                    <span className="text-xs text-muted-foreground">4.8 · 12.3k</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                  <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 neon-glow">
                    <Icon name="Play" size={14} />
                    Играть
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle ghost="Opponents" title="Оппоненты" />
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {opponents.map((o) => (
                  <div key={o.name} className="relative group cursor-pointer">
                    <img src={o.img} alt={o.name} className="w-12 h-12 rounded-full border-2 border-border group-hover:border-primary transition-colors" />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-primary text-[9px] font-bold text-primary-foreground">
                      {o.rank}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors">
                  <Icon name="Filter" size={14} />
                </button>
                <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors">
                  <Icon name="Search" size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Найти соперника</div>
                {["Уровень: Профи", "Регион: Европа", "Игра: Cyber Strike", "Режим: 5v5"].map((f) => (
                  <div key={f} className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/60 border border-border">
                    <span className="text-sm">{f}</span>
                    <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                  </div>
                ))}
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm uppercase tracking-widest neon-glow hover:scale-[1.02] transition-transform">
                  Начать поиск
                </button>
              </div>

              <div className="bg-secondary/40 rounded-lg border border-border p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Топ матч</div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center flex-1">
                    <img src={opponents[0].img} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary neon-glow" />
                    <div className="font-bold text-sm">{opponents[0].name}</div>
                    <div className="text-xs text-muted-foreground">Уровень 87</div>
                  </div>
                  <div className="text-2xl font-black text-primary neon-text">VS</div>
                  <div className="text-center flex-1">
                    <img src={opponents[1].img} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary neon-glow" />
                    <div className="font-bold text-sm">{opponents[1].name}</div>
                    <div className="text-xs text-muted-foreground">Уровень 84</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Призовой фонд</span><span className="font-bold text-primary">$5,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Начало</span><span>через 12 мин</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Зрителей</span><span>2,847</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle ghost="News" title="Новости" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsCards.map((n) => (
              <article key={n.title} className="group bg-card/60 border border-border rounded-xl overflow-hidden hover:border-primary/60 transition-all cursor-pointer">
                <div className="relative h-44 overflow-hidden">
                  <img src={n.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest neon-glow">
                    {n.date}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold mb-2">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    Подробности нового события киберспортивной арены, не пропусти ключевые моменты.
                  </div>
                  <button className="mt-3 text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Читать <Icon name="ArrowRight" size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-10 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                  <Icon name="Gamepad2" size={16} className="text-white" />
                </div>
                <div className="font-black tracking-wider">ARENA</div>
              </div>
              <p className="text-xs text-muted-foreground">Киберспортивная платформа нового поколения.</p>
            </div>
            {[
              { title: "Игры", links: ["Каталог", "Турниры", "Топ"] },
              { title: "Сообщество", links: ["Форум", "Стримеры", "Discord"] },
              { title: "Помощь", links: ["FAQ", "Поддержка", "Правила"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs uppercase tracking-widest text-primary mb-3 font-bold">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-border flex-wrap gap-3">
            <div className="text-xs text-muted-foreground">© 2026 ARENA · Все права защищены</div>
            <div className="flex items-center gap-2">
              {["Twitch", "Youtube", "Twitter", "Instagram"].map((s) => (
                <button key={s} className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Icon name={s} size={14} fallback="Globe" />
                </button>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
