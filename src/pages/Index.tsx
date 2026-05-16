import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

const navItems = [
  { icon: "Home", label: "Главная" },
  { icon: "Gamepad2", label: "Игры" },
  { icon: "Trophy", label: "Турниры" },
  { icon: "Users", label: "Команда" },
  { icon: "Newspaper", label: "Новости" },
  { icon: "Store", label: "Магазин" },
];

type Game = {
  title: string;
  genre: string;
  platform: string[];
  rating: number;
  year: number;
  players: string;
  img: string;
  hot?: boolean;
  free?: boolean;
};

const gamesDB: Game[] = [
  { title: "Cyber Strike", genre: "FPS", platform: ["PC", "PS5"], rating: 4.9, year: 2026, players: "1.2M", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80", hot: true },
  { title: "Dark Realm", genre: "RPG", platform: ["PC", "Xbox"], rating: 4.8, year: 2025, players: "850K", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80" },
  { title: "Apex Zone", genre: "Battle Royale", platform: ["PC", "PS5", "Xbox"], rating: 4.7, year: 2026, players: "2.4M", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80", hot: true, free: true },
  { title: "Neon Drift", genre: "Racing", platform: ["PC", "PS5"], rating: 4.6, year: 2024, players: "420K", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80" },
  { title: "Void Hunter", genre: "Sci-Fi", platform: ["PC"], rating: 4.5, year: 2026, players: "180K", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&q=80", free: true },
  { title: "Phantom Ops", genre: "Action", platform: ["PC", "PS5", "Xbox"], rating: 4.8, year: 2025, players: "910K", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80" },
  { title: "Steel Legion", genre: "Strategy", platform: ["PC"], rating: 4.4, year: 2024, players: "120K", img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80" },
  { title: "Ghost Protocol", genre: "Stealth", platform: ["PC", "PS5"], rating: 4.7, year: 2026, players: "320K", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80", hot: true },
  { title: "Iron Wars", genre: "MOBA", platform: ["PC"], rating: 4.6, year: 2025, players: "1.8M", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80", free: true },
  { title: "Neon City", genre: "Open World", platform: ["PC", "PS5"], rating: 4.9, year: 2026, players: "640K", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80", hot: true },
  { title: "Solar Flare", genre: "FPS", platform: ["PC", "Xbox"], rating: 4.3, year: 2024, players: "210K", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&q=80" },
  { title: "Storm Riders", genre: "Racing", platform: ["PC", "PS5"], rating: 4.5, year: 2025, players: "380K", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80" },
];

const genres = ["Все", "FPS", "RPG", "Battle Royale", "Racing", "Sci-Fi", "Action", "Strategy", "Stealth", "MOBA", "Open World"];
const platforms = ["Все", "PC", "PS5", "Xbox"];
const sortOptions = ["По популярности", "По рейтингу", "По дате выхода", "По цене"];

const trendingTags = ["Cyber Strike", "Battle Royale", "Co-op 2026", "Free to Play", "PvP арена", "Хоррор", "Открытый мир", "Киберспорт"];

const Index = () => {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Все");
  const [platform, setPlatform] = useState("Все");
  const [sort, setSort] = useState("По популярности");
  const [onlyFree, setOnlyFree] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    let list = gamesDB.filter((g) => {
      if (query && !g.title.toLowerCase().includes(query.toLowerCase()) && !g.genre.toLowerCase().includes(query.toLowerCase())) return false;
      if (genre !== "Все" && g.genre !== genre) return false;
      if (platform !== "Все" && !g.platform.includes(platform)) return false;
      if (onlyFree && !g.free) return false;
      if (g.rating < minRating) return false;
      return true;
    });
    if (sort === "По рейтингу") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "По дате выхода") list = [...list].sort((a, b) => b.year - a.year);
    if (sort === "По популярности") list = [...list].sort((a, b) => parseFloat(b.players) - parseFloat(a.players));
    return list;
  }, [query, genre, platform, sort, onlyFree, minRating]);

  const suggestions = useMemo(() => {
    if (!query) return [];
    return gamesDB.filter((g) => g.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />
      <div className="fixed top-[5%] -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] -right-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center neon-glow">
              <Icon name="Gamepad2" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black text-lg leading-none tracking-wider">ARENA</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-primary">find your game</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <button
                key={item.label}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === 1
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
            <button className="p-2 rounded-lg hover:bg-secondary relative">
              <Icon name="Bell" size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-sm font-bold neon-glow">
              Ю
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <section className="text-center mb-10 relative">
          <h2 className="text-6xl md:text-8xl font-black tracking-wider text-foreground/[0.04] absolute inset-0 flex items-start justify-center select-none uppercase pointer-events-none">
            Search Games
          </h2>
          <div className="relative pt-8 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              12 487 игр в базе · обновлено сегодня
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">
              Найди свою <span className="neon-text text-primary">игру</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Поисковая система по тысячам игр. Фильтры по жанру, платформе, рейтингу — и ты в матче.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8 relative">
            <div className={`relative bg-card/80 backdrop-blur-xl border-2 rounded-2xl transition-all ${focused ? "border-primary neon-glow" : "border-border"}`}>
              <div className="flex items-center px-5 py-4 gap-3">
                <Icon name="Search" size={22} className={focused ? "text-primary" : "text-muted-foreground"} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Название игры, жанр, разработчик..."
                  className="flex-1 bg-transparent text-base md:text-lg focus:outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="p-1 rounded hover:bg-secondary">
                    <Icon name="X" size={16} className="text-muted-foreground" />
                  </button>
                )}
                <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground">
                  <Icon name="Mic" size={13} />
                  Голос
                </button>
                <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold neon-glow hover:scale-105 transition-transform flex items-center gap-2">
                  <Icon name="Sparkles" size={14} />
                  Найти
                </button>
              </div>

              {focused && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden z-50 animate-fade-in">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-1">Подсказки</div>
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onMouseDown={() => setQuery(s.title)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary text-left"
                    >
                      <img src={s.img} alt="" className="w-10 h-10 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.genre} · {s.year}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Icon name="Star" size={11} className="fill-primary" />
                        {s.rating}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mr-1">В тренде:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs hover:border-primary hover:text-primary transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-5 h-fit lg:sticky lg:top-20 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={13} /> Фильтры
              </div>
              <button
                onClick={() => { setGenre("Все"); setPlatform("Все"); setOnlyFree(false); setMinRating(0); }}
                className="text-[10px] text-muted-foreground hover:text-primary uppercase tracking-widest"
              >
                Сбросить
              </button>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Жанр</div>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      genre === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Платформа</div>
              <div className="flex flex-wrap gap-1.5">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      platform === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Мин. рейтинг: {minRating.toFixed(1)}</div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span><span>5</span>
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Только бесплатные</span>
              <div
                onClick={() => setOnlyFree(!onlyFree)}
                className={`w-10 h-5 rounded-full relative transition-colors ${onlyFree ? "bg-primary" : "bg-secondary"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${onlyFree ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>

            <div className="pt-4 border-t border-border">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Быстро</div>
              <div className="space-y-1.5">
                {[
                  { icon: "Flame", label: "Хиты недели", count: 24 },
                  { icon: "Zap", label: "Новинки 2026", count: 89 },
                  { icon: "Trophy", label: "Киберспорт", count: 42 },
                  { icon: "Gift", label: "Бесплатные", count: 156 },
                ].map((q) => (
                  <button key={q.label} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary text-left">
                    <span className="flex items-center gap-2 text-sm">
                      <Icon name={q.icon} size={14} className="text-primary" />
                      {q.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{q.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="text-sm text-muted-foreground">
                Найдено <span className="text-foreground font-bold">{filtered.length}</span> игр
                {query && <span> по запросу «<span className="text-primary">{query}</span>»</span>}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  {sortOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-card/60 border border-border rounded-2xl p-12 text-center">
                <Icon name="SearchX" size={40} className="mx-auto text-muted-foreground mb-3" />
                <div className="font-bold mb-1">Ничего не нашли</div>
                <div className="text-sm text-muted-foreground">Попробуй изменить фильтры или поисковый запрос.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((game) => (
                  <article key={game.title} className="group bg-card/60 border border-border rounded-xl overflow-hidden hover:border-primary/60 transition-all cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <img src={game.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {game.hot && (
                          <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 neon-glow">
                            <Icon name="Flame" size={10} /> Hot
                          </span>
                        )}
                        {game.free && (
                          <span className="px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">
                            Free
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-[10px] font-bold flex items-center gap-1">
                        <Icon name="Star" size={10} className="text-primary fill-primary" />
                        {game.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">{game.title}</div>
                        <div className="text-[10px] text-muted-foreground">{game.year}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="text-primary font-semibold">{game.genre}</span>
                        <span className="flex items-center gap-1">
                          <Icon name="Users" size={11} /> {game.players}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {game.platform.map((p) => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-secondary text-[9px] uppercase tracking-wider font-semibold">{p}</span>
                          ))}
                        </div>
                        <button className="px-3 py-1.5 bg-primary/15 text-primary border border-primary/30 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Icon name="Play" size={11} />
                          Играть
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-border pt-10 pb-6 mt-20">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-muted-foreground">© 2026 ARENA · Поиск игр нового поколения</div>
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
