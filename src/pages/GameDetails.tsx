import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const GAMES_URL = "https://functions.poehali.dev/04eb41c6-1108-4979-bdbf-81c98344354e";

type Game = {
  id: number;
  steam_appid: number | null;
  title: string;
  slug: string;
  genre: string;
  platforms: string[];
  rating: number;
  year: number;
  players: string;
  img: string;
  description: string;
  developer: string;
  publisher: string;
  price: number;
  is_free: boolean;
  is_hot: boolean;
  tags: string[];
  screenshots: string[];
  background: string;
  website: string;
  metacritic: number | null;
  similar: Array<{ id: number; title: string; slug: string; img: string; genre: string; rating: number; year: number }>;
};

const GameDetails = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeShot, setActiveShot] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${GAMES_URL}?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        setGame(d.game || null);
        setActiveShot(d.game?.screenshots?.[0] || d.game?.background || d.game?.img || null);
      })
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <Icon name="SearchX" size={48} className="text-muted-foreground mb-3" />
        <div className="text-xl font-bold mb-2">Игра не найдена</div>
        <Link to="/" className="text-primary hover:underline">← Вернуться на главную</Link>
      </div>
    );
  }

  const steamUrl = game.steam_appid ? `steam://run/${game.steam_appid}` : null;
  const steamStoreUrl = game.steam_appid
    ? `https://store.steampowered.com/app/${game.steam_appid}/`
    : game.website;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {(game.background || game.img) && (
        <div className="fixed inset-0 pointer-events-none">
          <img src={game.background || game.img} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center neon-glow">
              <Icon name="Gamepad2" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black tracking-wider">ARENA</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-primary">find your game</div>
            </div>
          </Link>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/70 text-sm">
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <Icon name="ChevronRight" size={12} />
          <span>{game.genre}</span>
          <Icon name="ChevronRight" size={12} />
          <span className="text-foreground">{game.title}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 mb-12">
          <div>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-card mb-4 relative">
              {activeShot ? (
                <img src={activeShot} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="ImageOff" size={48} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                {game.is_hot && (
                  <span className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 neon-glow">
                    <Icon name="Flame" size={11} /> Hot
                  </span>
                )}
                {game.is_free && (
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">Free to play</span>
                )}
              </div>
            </div>

            {game.screenshots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {game.screenshots.slice(0, 10).map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveShot(s)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeShot === s ? "border-primary neon-glow" : "border-border hover:border-primary/50"}`}
                  >
                    <img src={s} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-2">
                {game.genre} · {game.year}
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3 neon-text">{game.title}</h1>
              {game.developer && (
                <div className="text-sm text-muted-foreground">
                  Разработчик: <span className="text-foreground font-semibold">{game.developer}</span>
                </div>
              )}
              {game.publisher && (
                <div className="text-sm text-muted-foreground">
                  Издатель: <span className="text-foreground font-semibold">{game.publisher}</span>
                </div>
              )}
            </div>

            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Рейтинг</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="Star" size={16} className="text-primary fill-primary" />
                    <span className="text-xl font-black">{Number(game.rating).toFixed(1)}</span>
                  </div>
                </div>
                {game.metacritic && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Metacritic</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">{game.metacritic}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Игроков</div>
                  <div className="text-xl font-black mt-1">{game.players}</div>
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {game.platforms.map((p) => (
                  <span key={p} className="px-2 py-1 rounded bg-secondary text-[10px] uppercase tracking-wider font-semibold">{p}</span>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Цена</div>
                <div className="text-2xl font-black">
                  {game.is_free ? <span className="text-emerald-400">Бесплатно</span> : `${game.price.toLocaleString("ru")} ₽`}
                </div>
              </div>

              {steamUrl && (
                <a
                  href={steamUrl}
                  className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm uppercase tracking-widest neon-glow hover:scale-[1.02] transition-transform"
                >
                  <Icon name="Play" size={14} className="inline mr-1.5 -mt-0.5" />
                  Запустить в Steam
                </a>
              )}
              {steamStoreUrl && (
                <a
                  href={steamStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-semibold"
                >
                  <Icon name="ExternalLink" size={14} />
                  Открыть в магазине Steam
                </a>
              )}
              <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                <Icon name="Heart" size={14} />
                В избранное
              </button>
            </div>

            {game.tags.length > 0 && (
              <div className="bg-card/60 border border-border rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Теги</div>
                <div className="flex flex-wrap gap-1.5">
                  {game.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-secondary text-xs">#{t}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {game.description && (
          <section className="mb-12 max-w-4xl">
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Об игре</h2>
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-line">{game.description}</p>
          </section>
        )}

        {game.similar.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Похожие игры</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {game.similar.map((s) => (
                <Link
                  key={s.id}
                  to={`/game/${s.slug}`}
                  className="group bg-card/60 border border-border rounded-xl overflow-hidden hover:border-primary/60 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={s.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">{s.title}</div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{s.genre}</span>
                      <span className="flex items-center gap-1">
                        <Icon name="Star" size={10} className="fill-primary text-primary" />
                        {Number(s.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default GameDetails;
