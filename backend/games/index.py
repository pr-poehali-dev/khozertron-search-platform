"""
Business: Публичный каталог игр — список, фильтры, поиск, статистика.
Args: event — httpMethod, queryStringParameters (q, genre, platform, sort, free, min_rating, limit, offset)
Returns: JSON со списком игр и метаданными
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def _conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Content-Type': 'application/json'
    }


def _esc(s: str) -> str:
    return s.replace("'", "''")


def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    params = event.get('queryStringParameters') or {}
    path = (event.get('path') or '').rstrip('/')

    conn = _conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if path.endswith('/stats'):
                cur.execute("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_free) AS free_count, COUNT(*) FILTER (WHERE is_hot) AS hot_count, COALESCE(AVG(rating),0)::numeric(3,2) AS avg_rating FROM games")
                stats = cur.fetchone()
                cur.execute("SELECT genre, COUNT(*) AS cnt FROM games WHERE genre IS NOT NULL GROUP BY genre ORDER BY cnt DESC LIMIT 10")
                by_genre = cur.fetchall()
                return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'stats': dict(stats), 'by_genre': [dict(r) for r in by_genre]}, default=str)}

            if path.endswith('/genres'):
                cur.execute("SELECT DISTINCT genre FROM games WHERE genre IS NOT NULL ORDER BY genre")
                rows = cur.fetchall()
                return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'genres': [r['genre'] for r in rows]})}

            slug = (params.get('slug') or '').strip()
            if slug:
                cur.execute(f"SELECT * FROM games WHERE slug = '{_esc(slug)}' LIMIT 1")
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Not found'})}
                d = dict(row)
                d['platforms'] = [p.strip() for p in (d.get('platforms') or '').split(',') if p.strip()]
                d['tags'] = [t.strip() for t in (d.get('tags') or '').split(',') if t.strip()]
                d['screenshots'] = [s.strip() for s in (d.get('screenshots') or '').split('|') if s.strip()]
                d['rating'] = float(d['rating']) if d.get('rating') is not None else 0
                d['price'] = float(d['price']) if d.get('price') is not None else 0

                similar_genre = d.get('genre') or ''
                cur.execute(f"SELECT id, title, slug, img, genre, rating, year FROM games WHERE genre = '{_esc(similar_genre)}' AND id != {d['id']} ORDER BY rating DESC LIMIT 6")
                similar = []
                for s in cur.fetchall():
                    sd = dict(s)
                    sd['rating'] = float(sd['rating']) if sd.get('rating') is not None else 0
                    similar.append(sd)
                d['similar'] = similar
                return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'game': d}, default=str)}

            q = (params.get('q') or '').strip()
            genre = (params.get('genre') or '').strip()
            platform = (params.get('platform') or '').strip()
            sort = (params.get('sort') or 'popular').strip()
            free = params.get('free') == '1'
            min_rating = float(params.get('min_rating') or 0)
            limit = min(int(params.get('limit') or 60), 200)
            offset = int(params.get('offset') or 0)

            where = ['1=1']
            if q:
                qe = _esc(q.lower())
                where.append(f"(LOWER(title) LIKE '%{qe}%' OR LOWER(COALESCE(genre,'')) LIKE '%{qe}%' OR LOWER(COALESCE(tags,'')) LIKE '%{qe}%')")
            if genre and genre.lower() != 'все' and genre.lower() != 'all':
                where.append(f"genre = '{_esc(genre)}'")
            if platform and platform.lower() != 'все' and platform.lower() != 'all':
                where.append(f"platforms LIKE '%{_esc(platform)}%'")
            if free:
                where.append("is_free = TRUE")
            if min_rating > 0:
                where.append(f"rating >= {min_rating}")

            order = "players DESC NULLS LAST, rating DESC"
            if sort == 'rating':
                order = "rating DESC NULLS LAST"
            elif sort == 'year':
                order = "year DESC NULLS LAST"
            elif sort == 'price':
                order = "price ASC NULLS LAST"

            where_sql = ' AND '.join(where)
            cur.execute(f"SELECT COUNT(*) AS total FROM games WHERE {where_sql}")
            total = cur.fetchone()['total']

            cur.execute(f"SELECT id, steam_appid, title, slug, genre, platforms, rating, year, players, img, description, developer, publisher, price, is_free, is_hot, tags FROM games WHERE {where_sql} ORDER BY {order} LIMIT {limit} OFFSET {offset}")
            rows = cur.fetchall()
            games = []
            for r in rows:
                d = dict(r)
                d['platforms'] = [p.strip() for p in (d.get('platforms') or '').split(',') if p.strip()]
                d['tags'] = [t.strip() for t in (d.get('tags') or '').split(',') if t.strip()]
                d['rating'] = float(d['rating']) if d.get('rating') is not None else 0
                d['price'] = float(d['price']) if d.get('price') is not None else 0
                games.append(d)

            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'games': games, 'total': total, 'limit': limit, 'offset': offset}, default=str)}
    finally:
        conn.close()