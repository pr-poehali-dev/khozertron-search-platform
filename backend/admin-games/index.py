"""
Business: Админка каталога игр — логин, CRUD, импорт из Steam по App ID, массовая синхронизация топ-игр, управление Steam API ключом.
Args: event с httpMethod, path, body (JSON), headers (X-Admin-Token)
Returns: JSON ответ
"""
import json
import os
import re
import secrets
import urllib.request
import urllib.parse
import urllib.error
import psycopg2
from psycopg2.extras import RealDictCursor

_SESSIONS = set()


def _conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Content-Type': 'application/json'
    }


def _resp(status, data):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(data, default=str)}


def _esc(s):
    if s is None:
        return None
    return str(s).replace("'", "''")


def _check_auth(event):
    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
    return token and token in _SESSIONS


def _slugify(s: str) -> str:
    s = (s or '').lower().strip()
    s = re.sub(r'[^a-z0-9а-я ]+', '', s)
    s = re.sub(r'\s+', '-', s)
    return s[:200] or f'game-{secrets.token_hex(4)}'


def _get_setting(cur, key, default=None):
    cur.execute(f"SELECT value FROM app_settings WHERE key = '{_esc(key)}'")
    row = cur.fetchone()
    return row['value'] if row else default


def _set_setting(cur, key, value):
    cur.execute(f"INSERT INTO app_settings (key, value, updated_at) VALUES ('{_esc(key)}', '{_esc(value)}', NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()")


def _steam_key(cur):
    return _get_setting(cur, 'STEAM_API_KEY') or os.environ.get('STEAM_API_KEY', '')


def _fetch_steam_app(appid: int):
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}&l=russian"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
        node = data.get(str(appid)) or {}
        if not node.get('success'):
            return None
        d = node.get('data') or {}
        platforms = []
        if d.get('platforms', {}).get('windows'):
            platforms.append('PC')
        if d.get('platforms', {}).get('mac'):
            platforms.append('Mac')
        if d.get('platforms', {}).get('linux'):
            platforms.append('Linux')
        genres = d.get('genres') or []
        genre = genres[0]['description'] if genres else None
        categories = d.get('categories') or []
        tags = ', '.join([c['description'] for c in categories[:8]])
        price_data = d.get('price_overview') or {}
        is_free = bool(d.get('is_free')) or price_data.get('final', 0) == 0
        price = (price_data.get('final', 0) or 0) / 100
        release = d.get('release_date', {}).get('date', '') or ''
        year_match = re.search(r'(\d{4})', release)
        year = int(year_match.group(1)) if year_match else None
        screenshots_raw = d.get('screenshots') or []
        screenshots = '|'.join([s.get('path_full', '') for s in screenshots_raw if s.get('path_full')][:10])
        metacritic = d.get('metacritic', {}).get('score') if d.get('metacritic') else None
        return {
            'steam_appid': appid,
            'title': d.get('name') or f'Steam App {appid}',
            'genre': genre,
            'platforms': ','.join(platforms) if platforms else 'PC',
            'year': year,
            'img': d.get('header_image') or '',
            'description': (d.get('short_description') or '')[:2000],
            'developer': ', '.join(d.get('developers') or []) or None,
            'publisher': ', '.join(d.get('publishers') or []) or None,
            'price': price,
            'is_free': is_free,
            'tags': tags,
            'screenshots': screenshots,
            'background': d.get('background_raw') or d.get('background') or '',
            'website': d.get('website') or f'https://store.steampowered.com/app/{appid}/',
            'metacritic': metacritic
        }
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError, TimeoutError, KeyError):
        return None


def _upsert_game(cur, g: dict):
    slug = _slugify(g['title']) + (f"-{g['steam_appid']}" if g.get('steam_appid') else '')
    fields = {
        'steam_appid': g.get('steam_appid'),
        'title': g['title'],
        'slug': slug,
        'genre': g.get('genre'),
        'platforms': g.get('platforms') or 'PC',
        'rating': g.get('rating') or 4.5,
        'year': g.get('year'),
        'players': g.get('players') or '—',
        'img': g.get('img') or '',
        'description': g.get('description') or '',
        'developer': g.get('developer'),
        'publisher': g.get('publisher'),
        'price': g.get('price') or 0,
        'is_free': bool(g.get('is_free')),
        'is_hot': bool(g.get('is_hot')),
        'tags': g.get('tags') or '',
        'screenshots': g.get('screenshots') or '',
        'background': g.get('background') or '',
        'website': g.get('website') or '',
        'metacritic': g.get('metacritic')
    }

    def v(val):
        if val is None:
            return 'NULL'
        if isinstance(val, bool):
            return 'TRUE' if val else 'FALSE'
        if isinstance(val, (int, float)):
            return str(val)
        return f"'{_esc(val)}'"

    cur.execute(f"""
        INSERT INTO games (steam_appid, title, slug, genre, platforms, rating, year, players, img, description, developer, publisher, price, is_free, is_hot, tags, screenshots, background, website, metacritic, updated_at)
        VALUES ({v(fields['steam_appid'])}, {v(fields['title'])}, {v(fields['slug'])}, {v(fields['genre'])}, {v(fields['platforms'])}, {v(fields['rating'])}, {v(fields['year'])}, {v(fields['players'])}, {v(fields['img'])}, {v(fields['description'])}, {v(fields['developer'])}, {v(fields['publisher'])}, {v(fields['price'])}, {v(fields['is_free'])}, {v(fields['is_hot'])}, {v(fields['tags'])}, {v(fields['screenshots'])}, {v(fields['background'])}, {v(fields['website'])}, {v(fields['metacritic'])}, NOW())
        ON CONFLICT (steam_appid) DO UPDATE SET
            title = EXCLUDED.title, genre = EXCLUDED.genre, platforms = EXCLUDED.platforms,
            year = EXCLUDED.year, img = EXCLUDED.img, description = EXCLUDED.description,
            developer = EXCLUDED.developer, publisher = EXCLUDED.publisher,
            price = EXCLUDED.price, is_free = EXCLUDED.is_free, tags = EXCLUDED.tags,
            screenshots = EXCLUDED.screenshots, background = EXCLUDED.background,
            website = EXCLUDED.website, metacritic = EXCLUDED.metacritic,
            updated_at = NOW()
        RETURNING id
    """)
    return cur.fetchone()['id']


def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    path = (event.get('path') or '').rstrip('/')
    body = {}
    raw = event.get('body') or '{}'
    try:
        body = json.loads(raw) if raw else {}
    except (ValueError, TypeError):
        body = {}

    action = body.get('action') or ''

    # LOGIN — без авторизации
    if action == 'login':
        password = body.get('password') or ''
        if password and password == os.environ.get('ADMIN_PASSWORD', ''):
            token = secrets.token_urlsafe(32)
            _SESSIONS.add(token)
            return _resp(200, {'token': token, 'ok': True})
        return _resp(401, {'error': 'Неверный пароль'})

    # Все остальные действия требуют токен
    if not _check_auth(event):
        return _resp(401, {'error': 'Требуется авторизация'})

    conn = _conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if action == 'stats':
                cur.execute("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_free) AS free_count, COUNT(*) FILTER (WHERE is_hot) AS hot_count, COUNT(*) FILTER (WHERE steam_appid IS NOT NULL) AS steam_count, COALESCE(AVG(rating),0)::numeric(3,2) AS avg_rating FROM games")
                stats = dict(cur.fetchone())
                cur.execute("SELECT genre, COUNT(*) AS cnt FROM games WHERE genre IS NOT NULL GROUP BY genre ORDER BY cnt DESC LIMIT 10")
                by_genre = [dict(r) for r in cur.fetchall()]
                cur.execute("SELECT id, title, img, genre, rating FROM games ORDER BY updated_at DESC LIMIT 5")
                recent = [dict(r) for r in cur.fetchall()]
                steam_key = _steam_key(cur)
                return _resp(200, {'stats': stats, 'by_genre': by_genre, 'recent': recent, 'has_steam_key': bool(steam_key)})

            if action == 'list':
                q = (body.get('q') or '').strip()
                limit = min(int(body.get('limit') or 100), 500)
                where = '1=1'
                if q:
                    qe = _esc(q.lower())
                    where = f"(LOWER(title) LIKE '%{qe}%' OR LOWER(COALESCE(genre,'')) LIKE '%{qe}%')"
                cur.execute(f"SELECT * FROM games WHERE {where} ORDER BY updated_at DESC LIMIT {limit}")
                rows = [dict(r) for r in cur.fetchall()]
                return _resp(200, {'games': rows})

            if action == 'create':
                game_id = _upsert_game(cur, body.get('game') or {})
                conn.commit()
                return _resp(200, {'ok': True, 'id': game_id})

            if action == 'update':
                gid = int(body.get('id'))
                g = body.get('game') or {}
                allowed = ['title', 'genre', 'platforms', 'rating', 'year', 'players', 'img', 'description', 'developer', 'publisher', 'price', 'is_free', 'is_hot', 'tags']
                sets = []
                for f in allowed:
                    if f in g:
                        val = g[f]
                        if isinstance(val, bool):
                            sets.append(f"{f} = {'TRUE' if val else 'FALSE'}")
                        elif isinstance(val, (int, float)) or val is None:
                            sets.append(f"{f} = {val if val is not None else 'NULL'}")
                        else:
                            sets.append(f"{f} = '{_esc(val)}'")
                if sets:
                    cur.execute(f"UPDATE games SET {', '.join(sets)}, updated_at = NOW() WHERE id = {gid}")
                    conn.commit()
                return _resp(200, {'ok': True})

            if action == 'delete':
                gid = int(body.get('id'))
                cur.execute(f"DELETE FROM games WHERE id = {gid}")
                conn.commit()
                return _resp(200, {'ok': True})

            if action == 'import_steam':
                appid = int(body.get('appid'))
                data = _fetch_steam_app(appid)
                if not data:
                    return _resp(400, {'error': f'Не удалось получить данные Steam для appid {appid}'})
                gid = _upsert_game(cur, data)
                conn.commit()
                return _resp(200, {'ok': True, 'id': gid, 'game': data})

            if action == 'sync_top':
                steam_key = _steam_key(cur)
                if not steam_key:
                    return _resp(400, {'error': 'Не задан Steam API ключ. Добавь его в настройках админки.'})
                top_appids = [730, 570, 1172470, 1086940, 1245620, 1091500, 271590, 440, 578080, 252490, 359550, 1238810, 1599340, 990080, 1517290, 1174180, 292030, 489830, 220, 4000]
                imported = []
                failed = []
                for appid in top_appids:
                    data = _fetch_steam_app(appid)
                    if data:
                        _upsert_game(cur, data)
                        imported.append(data['title'])
                    else:
                        failed.append(appid)
                conn.commit()
                return _resp(200, {'ok': True, 'imported': imported, 'failed': failed, 'count': len(imported)})

            if action == 'get_settings':
                steam_key = _get_setting(cur, 'STEAM_API_KEY', '') or ''
                masked = ('•' * (len(steam_key) - 4) + steam_key[-4:]) if len(steam_key) >= 4 else ''
                return _resp(200, {'has_steam_key': bool(steam_key), 'steam_key_masked': masked})

            if action == 'save_settings':
                steam_key = (body.get('steam_api_key') or '').strip()
                if steam_key:
                    _set_setting(cur, 'STEAM_API_KEY', steam_key)
                conn.commit()
                return _resp(200, {'ok': True})

            return _resp(400, {'error': f'Неизвестное действие: {action}'})
    finally:
        conn.close()