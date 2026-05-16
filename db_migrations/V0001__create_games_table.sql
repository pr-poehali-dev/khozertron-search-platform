CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    steam_appid INTEGER UNIQUE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    genre VARCHAR(100),
    platforms TEXT,
    rating NUMERIC(3,1) DEFAULT 0,
    year INTEGER,
    players VARCHAR(50),
    img TEXT,
    description TEXT,
    developer VARCHAR(255),
    publisher VARCHAR(255),
    price NUMERIC(10,2) DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    tags TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre);
CREATE INDEX IF NOT EXISTS idx_games_year ON games(year);
CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating);
CREATE INDEX IF NOT EXISTS idx_games_is_free ON games(is_free);
CREATE INDEX IF NOT EXISTS idx_games_is_hot ON games(is_hot);

CREATE TABLE IF NOT EXISTS app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO games (steam_appid, title, slug, genre, platforms, rating, year, players, img, description, developer, publisher, price, is_free, is_hot, tags)
VALUES
    (730, 'Counter-Strike 2', 'counter-strike-2', 'FPS', 'PC', 4.7, 2023, '1.2M', 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg', 'Легендарный командный шутер от Valve.', 'Valve', 'Valve', 0, TRUE, TRUE, 'Шутер,Киберспорт,PvP'),
    (570, 'Dota 2', 'dota-2', 'MOBA', 'PC', 4.5, 2013, '800K', 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', 'Топ-MOBA от Valve.', 'Valve', 'Valve', 0, TRUE, TRUE, 'MOBA,Стратегия,Командная'),
    (1172470, 'Apex Legends', 'apex-legends', 'Battle Royale', 'PC,PS5,Xbox', 4.6, 2020, '2.4M', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg', 'Динамичная королевская битва.', 'Respawn', 'EA', 0, TRUE, TRUE, 'Battle Royale,Шутер'),
    (1086940, 'Baldur''s Gate 3', 'baldurs-gate-3', 'RPG', 'PC,PS5', 4.9, 2023, '500K', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg', 'Эпическая ролевая игра.', 'Larian Studios', 'Larian Studios', 1999, FALSE, TRUE, 'RPG,Сюжетная,Фэнтези'),
    (1245620, 'ELDEN RING', 'elden-ring', 'RPG', 'PC,PS5,Xbox', 4.8, 2022, '420K', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', 'Открытый мир от создателей Dark Souls.', 'FromSoftware', 'Bandai Namco', 2399, FALSE, TRUE, 'RPG,Souls-like,Открытый мир'),
    (1091500, 'Cyberpunk 2077', 'cyberpunk-2077', 'Open World', 'PC,PS5,Xbox', 4.5, 2020, '640K', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', 'Киберпанк-RPG в Найт-Сити.', 'CD Projekt Red', 'CD Projekt', 1499, FALSE, FALSE, 'RPG,Открытый мир,Киберпанк'),
    (271590, 'Grand Theft Auto V', 'gta-v', 'Open World', 'PC,PS5,Xbox', 4.7, 2015, '1.1M', 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg', 'Культовая GTA в Лос-Сантосе.', 'Rockstar North', 'Rockstar Games', 999, FALSE, FALSE, 'Открытый мир,Экшен'),
    (440, 'Team Fortress 2', 'team-fortress-2', 'FPS', 'PC', 4.4, 2007, '180K', 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg', 'Командный шутер от Valve.', 'Valve', 'Valve', 0, TRUE, FALSE, 'Шутер,PvP,Командная')
ON CONFLICT (slug) DO NOTHING;
