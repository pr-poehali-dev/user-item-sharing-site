import os
import json
import psycopg2

def handler(event: dict, context) -> dict:
    """Возвращает реальную статистику: книг отдано, активных объявлений, читателей, городов."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM books WHERE is_given = TRUE")
    given = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM books WHERE is_given = FALSE")
    active = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM readers")
    readers_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(DISTINCT city) FROM books WHERE city IS NOT NULL AND city != ''")
    cities = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'given': given,
            'active': active,
            'readers': readers_count,
            'cities': cities,
        })
    }
