import os
import json
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """CRUD для книг: GET — список, POST — создать."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            """INSERT INTO books (title, category, condition, description, author_name, city, contact, pickup, emoji)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, created_at""",
            (
                body.get('title', ''),
                body.get('category', 'Художественная'),
                body.get('condition', 'Хорошее'),
                body.get('description', ''),
                body.get('author_name', ''),
                body.get('city', ''),
                body.get('contact', ''),
                body.get('pickup', ''),
                body.get('emoji', '📚'),
            )
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 201,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'id': row[0], 'created_at': str(row[1])})
        }

    # GET — список книг
    category = (event.get('queryStringParameters') or {}).get('category')
    if category and category != 'Все':
        cur.execute(
            "SELECT id, title, category, condition, description, author_name, city, contact, pickup, emoji, created_at FROM books WHERE is_given = FALSE AND category = %s ORDER BY created_at DESC",
            (category,)
        )
    else:
        cur.execute(
            "SELECT id, title, category, condition, description, author_name, city, contact, pickup, emoji, created_at FROM books WHERE is_given = FALSE ORDER BY created_at DESC"
        )

    cols = ['id', 'title', 'category', 'condition', 'description', 'author_name', 'city', 'contact', 'pickup', 'emoji', 'created_at']
    books = [dict(zip(cols, row)) for row in cur.fetchall()]
    for b in books:
        b['created_at'] = str(b['created_at'])

    cur.close()
    conn.close()
    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(books)
    }
