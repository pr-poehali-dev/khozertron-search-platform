import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const ADMIN_URL = "https://functions.poehali.dev/6090bc22-37b6-4f79-b100-24c94c93b06f";
const TOKEN_KEY = "arena_admin_token";

type AdminGame = {
  id: number;
  steam_appid: number | null;
  title: string;
  genre: string | null;
  platforms: string;
  rating: number;
  year: number | null;
  players: string;
  img: string;
  description: string;
  developer: string | null;
  publisher: string | null;
  price: number;
  is_free: boolean;
  is_hot: boolean;
  tags: string;
};

const emptyGame: Partial<AdminGame> = {
  title: "",
  genre: "",
  platforms: "PC",
  rating: 4.5,
  year: 2026,
  players: "—",
  img: "",
  description: "",
  developer: "",
  publisher: "",
  price: 0,
  is_free: false,
  is_hot: false,
  tags: "",
};

const api = async (token: string | null, body: object) => {
  const r = await fetch(ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Admin-Token": token } : {}),
    },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status, data: await r.json() };
};

const Admin = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "games" | "import" | "settings">("dashboard");
  const [stats, setStats] = useState<{ stats: Record<string, number>; by_genre: Array<{ genre: string; cnt: number }>; recent: Array<{ id: number; title: string; img: string; genre: string; rating: number }>; has_steam_key: boolean } | null>(null);
  const [games, setGames] = useState<AdminGame[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<AdminGame> | null>(null);
  const [appidInput, setAppidInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [steamKey, setSteamKey] = useState("");
  const [steamKeyMasked, setSteamKeyMasked] = useState("");

  const loadStats = async () => {
    const r = await api(token, { action: "stats" });
    if (r.ok) setStats(r.data);
    else if (r.status === 401) logout();
  };

  const loadGames = async () => {
    const r = await api(token, { action: "list", q: search });
    if (r.ok) setGames(r.data.games || []);
  };

  const loadSettings = async () => {
    const r = await api(token, { action: "get_settings" });
    if (r.ok) setSteamKeyMasked(r.data.steam_key_masked || "");
  };

  useEffect(() => {
    if (!token) return;
    if (tab === "dashboard") loadStats();
    if (tab === "games") loadGames();
    if (tab === "settings") loadSettings();
  }, [token, tab]);

  useEffect(() => {
    if (token && tab === "games") {
      const t = setTimeout(loadGames, 300);
      return () => clearTimeout(t);
    }
  }, [search]);

  const login = async () => {
    setLoginLoading(true);
    const r = await api(null, { action: "login", password });
    setLoginLoading(false);
    if (r.ok && r.data.token) {
      localStorage.setItem(TOKEN_KEY, r.data.token);
      setToken(r.data.token);
      toast.success("Добро пожаловать в админку");
    } else {
      toast.error(r.data.error || "Неверный пароль");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const saveGame = async () => {
    if (!editing) return;
    if (!editing.title) {
      toast.error("Укажи название игры");
      return;
    }
    const action = editing.id ? "update" : "create";
    const r = await api(token, { action, id: editing.id, game: editing });
    if (r.ok) {
      toast.success(editing.id ? "Игра обновлена" : "Игра добавлена");
      setEditing(null);
      loadGames();
    } else {
      toast.error(r.data.error || "Ошибка сохранения");
    }
  };

  const deleteGame = async (id: number) => {
    if (!confirm("Удалить игру?")) return;
    const r = await api(token, { action: "delete", id });
    if (r.ok) {
      toast.success("Удалено");
      loadGames();
    }
  };

  const importSteam = async () => {
    const appid = parseInt(appidInput);
    if (!appid) {
      toast.error("Укажи Steam App ID (например: 730)");
      return;
    }
    setImporting(true);
    const r = await api(token, { action: "import_steam", appid });
    setImporting(false);
    if (r.ok) {
      toast.success(`Импортировано: ${r.data.game?.title}`);
      setAppidInput("");
    } else {
      toast.error(r.data.error || "Не удалось импортировать");
    }
  };

  const syncTop = async () => {
    if (!confirm("Запустить синхронизацию топ-20 Steam игр? Это может занять минуту.")) return;
    setSyncing(true);
    const r = await api(token, { action: "sync_top" });
    setSyncing(false);
    if (r.ok) {
      toast.success(`Загружено ${r.data.count} игр`);
    } else {
      toast.error(r.data.error || "Ошибка синхронизации");
    }
  };

  const saveSettings = async () => {
    const r = await api(token, { action: "save_settings", steam_api_key: steamKey });
    if (r.ok) {
      toast.success("Настройки сохранены");
      setSteamKey("");
      loadSettings();
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
        <div className="fixed inset-0 grid-bg opacity-30" />
        <div className="fixed top-1/4 -left-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[140px]" />
        <div className="fixed bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[140px]" />

        <div className="relative w-full max-w-sm bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center neon-glow">
              <Icon name="Shield" size={22} className="text-white" />
            </div>
            <div>
              <div className="font-black text-xl">Админка</div>
              <div className="text-[10px] uppercase tracking-widest text-primary">ARENA · Управление</div>
            </div>
          </div>

          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Введи пароль"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary mb-4"
          />
          <button
            onClick={login}
            disabled={loginLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm uppercase tracking-widest neon-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loginLoading ? "Вход..." : "Войти"}
          </button>

          <Link to="/" className="block text-center mt-4 text-xs text-muted-foreground hover:text-primary uppercase tracking-widest">
            ← На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-0 -left-32 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center neon-glow">
              <Icon name="Shield" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-black tracking-wider">ARENA · АДМИН</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-primary">Управление каталогом</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/70 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="ExternalLink" size={13} />
              На сайт
            </Link>
            <button onClick={logout} className="px-3 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="LogOut" size={13} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <nav className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "dashboard", icon: "LayoutDashboard", label: "Дашборд" },
            { id: "games", icon: "Gamepad2", label: "Игры" },
            { id: "import", icon: "Download", label: "Импорт Steam" },
            { id: "settings", icon: "Settings", label: "Настройки" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "dashboard" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Всего игр", value: stats.stats.total, icon: "Gamepad2", color: "text-primary" },
                { label: "Бесплатных", value: stats.stats.free_count, icon: "Gift", color: "text-emerald-400" },
                { label: "Хитов", value: stats.stats.hot_count, icon: "Flame", color: "text-primary" },
                { label: "Из Steam", value: stats.stats.steam_count, icon: "Download", color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="bg-card/60 border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
                    <Icon name={s.icon} size={16} className={s.color} />
                  </div>
                  <div className="text-3xl font-black">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card/60 border border-border rounded-xl p-5">
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Топ жанров</div>
                <div className="space-y-2">
                  {stats.by_genre.map((g) => {
                    const max = Math.max(...stats.by_genre.map((x) => x.cnt));
                    return (
                      <div key={g.genre}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{g.genre}</span>
                          <span className="text-muted-foreground">{g.cnt}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-red-700" style={{ width: `${(g.cnt / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card/60 border border-border rounded-xl p-5">
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Недавно изменённые</div>
                <div className="space-y-2">
                  {stats.recent.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
                      <img src={r.img || ""} alt="" className="w-10 h-10 rounded object-cover bg-secondary" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.genre}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Icon name="Star" size={11} className="fill-primary" />
                        {Number(r.rating).toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!stats.has_steam_key && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
                <Icon name="AlertTriangle" size={20} className="text-primary" />
                <div className="flex-1">
                  <div className="font-bold text-sm">Steam API ключ не задан</div>
                  <div className="text-xs text-muted-foreground">Чтобы массово синхронизировать топ-игры, добавь ключ в разделе «Настройки».</div>
                </div>
                <button onClick={() => setTab("settings")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-widest">
                  Открыть
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "games" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или жанру..."
                className="flex-1 max-w-md bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => setEditing({ ...emptyGame })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 neon-glow"
              >
                <Icon name="Plus" size={14} />
                Новая игра
              </button>
            </div>

            <div className="bg-card/60 border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Игра</th>
                    <th className="text-left p-3 hidden md:table-cell">Жанр</th>
                    <th className="text-left p-3 hidden md:table-cell">Год</th>
                    <th className="text-left p-3 hidden sm:table-cell">Рейтинг</th>
                    <th className="text-right p-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((g) => (
                    <tr key={g.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={g.img || ""} alt="" className="w-12 h-12 rounded object-cover bg-secondary flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{g.title}</div>
                            <div className="text-xs text-muted-foreground flex gap-2">
                              {g.steam_appid && <span className="text-blue-400">Steam {g.steam_appid}</span>}
                              {g.is_hot && <span className="text-primary">HOT</span>}
                              {g.is_free && <span className="text-emerald-400">FREE</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{g.genre}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{g.year}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="Star" size={11} className="text-primary fill-primary" />
                          {Number(g.rating).toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => setEditing(g)} className="p-1.5 rounded hover:bg-primary hover:text-primary-foreground">
                          <Icon name="Pencil" size={14} />
                        </button>
                        <button onClick={() => deleteGame(g.id)} className="p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground ml-1">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {games.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">Ничего не найдено</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "import" && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-card/60 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Download" size={20} className="text-primary" />
                <div>
                  <div className="font-bold">Импорт игры по Steam App ID</div>
                  <div className="text-xs text-muted-foreground">Например: 730 (Counter-Strike 2), 570 (Dota 2)</div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={appidInput}
                  onChange={(e) => setAppidInput(e.target.value)}
                  placeholder="App ID"
                  type="number"
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  onClick={importSteam}
                  disabled={importing}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold neon-glow disabled:opacity-50 flex items-center gap-2"
                >
                  {importing ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Download" size={14} />}
                  Импорт
                </button>
              </div>
            </div>

            <div className="bg-card/60 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="RefreshCw" size={20} className="text-primary" />
                <div>
                  <div className="font-bold">Массовая синхронизация топ-20 Steam</div>
                  <div className="text-xs text-muted-foreground">Загрузит данные популярных игр одной кнопкой. Требует Steam API ключ.</div>
                </div>
              </div>
              <button
                onClick={syncTop}
                disabled={syncing}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold neon-glow disabled:opacity-50 flex items-center gap-2"
              >
                {syncing ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Zap" size={14} />}
                {syncing ? "Синхронизация..." : "Запустить синхронизацию"}
              </button>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="max-w-xl bg-card/60 border border-border rounded-xl p-6 space-y-4">
            <div>
              <div className="font-bold mb-1">Steam API ключ</div>
              <div className="text-xs text-muted-foreground mb-3">
                Получить можно тут: <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">steamcommunity.com/dev/apikey</a>
              </div>
              {steamKeyMasked && (
                <div className="text-xs text-muted-foreground mb-2">Текущий: <code className="text-primary">{steamKeyMasked}</code></div>
              )}
              <input
                type="password"
                value={steamKey}
                onChange={(e) => setSteamKey(e.target.value)}
                placeholder="Вставь ключ (32 символа)"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary mb-3"
              />
              <button
                onClick={saveSettings}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold neon-glow flex items-center gap-2"
              >
                <Icon name="Save" size={14} />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
              <div className="font-bold text-lg">{editing.id ? "Редактировать" : "Новая игра"}</div>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-secondary">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Название *</label>
                <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Жанр</label>
                  <input value={editing.genre || ""} onChange={(e) => setEditing({ ...editing, genre: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Платформы (через запятую)</label>
                  <input value={editing.platforms || ""} onChange={(e) => setEditing({ ...editing, platforms: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Рейтинг</label>
                  <input type="number" step="0.1" min="0" max="5" value={editing.rating || 0} onChange={(e) => setEditing({ ...editing, rating: parseFloat(e.target.value) })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Год</label>
                  <input type="number" value={editing.year || 2026} onChange={(e) => setEditing({ ...editing, year: parseInt(e.target.value) })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Игроков</label>
                  <input value={editing.players || ""} onChange={(e) => setEditing({ ...editing, players: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Цена (₽)</label>
                  <input type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">URL обложки</label>
                <input value={editing.img || ""} onChange={(e) => setEditing({ ...editing, img: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                {editing.img && <img src={editing.img} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Описание</label>
                <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Разработчик</label>
                  <input value={editing.developer || ""} onChange={(e) => setEditing({ ...editing, developer: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Издатель</label>
                  <input value={editing.publisher || ""} onChange={(e) => setEditing({ ...editing, publisher: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Теги (через запятую)</label>
                <input value={editing.tags || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editing.is_free} onChange={(e) => setEditing({ ...editing, is_free: e.target.checked })} className="accent-primary" />
                  <span className="text-sm">Бесплатная</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editing.is_hot} onChange={(e) => setEditing({ ...editing, is_hot: e.target.checked })} className="accent-primary" />
                  <span className="text-sm">Хит</span>
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border p-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-secondary text-sm font-semibold">Отмена</button>
              <button onClick={saveGame} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold neon-glow flex items-center gap-2">
                <Icon name="Save" size={14} />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;