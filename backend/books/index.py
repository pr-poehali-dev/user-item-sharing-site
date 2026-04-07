import os
import json
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """CRUD для книг: GET — список или мои объявления, POST — создать, DELETE — удалить своё."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'DELETE':
        params = event.get('queryStringParameters') or {}
        book_id = params.get('id')
        owner_email = params.get('owner_email')
        moderator_email = params.get('moderator_email')
        if not book_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'id required'})}
        if moderator_email:
            cur.execute("SELECT role FROM users WHERE email = %s", (moderator_email,))
            role_row = cur.fetchone()
            if role_row and role_row[0] == 'moderator':
                cur.execute("DELETE FROM books WHERE id = %s RETURNING id", (book_id,))
            else:
                cur.close(); conn.close()
                return {'statusCode': 403, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'access denied'})}
        else:
            if not owner_email:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'owner_email required'})}
            cur.execute("DELETE FROM books WHERE id = %s AND owner_email = %s RETURNING id", (book_id, owner_email))
        deleted = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()
        if deleted:
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'deleted': deleted[0]})}
        return {'statusCode': 404, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'not found'})}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            """INSERT INTO books (title, category, condition, description, author_name, city, contact, pickup, emoji, owner_email, image)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, created_at""",
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
                body.get('owner_email', ''),
                body.get('image'),
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

    # GET — список книг или мои объявления
    params = event.get('queryStringParameters') or {}
    owner_email = params.get('owner_email')
    category = params.get('category')

    cols = ['id', 'title', 'category', 'condition', 'description', 'author_name', 'city', 'contact', 'pickup', 'emoji', 'created_at', 'owner_email']

    if owner_email:
        cur.execute(
            "SELECT id, title, category, condition, description, author_name, city, contact, pickup, emoji, created_at, owner_email FROM books WHERE owner_email = %s ORDER BY created_at DESC",
            (owner_email,)
        )
    elif category and category != 'Все':
        cur.execute(
            "SELECT id, title, category, condition, description, author_name, city, contact, pickup, emoji, created_at, owner_email FROM books WHERE is_given = FALSE AND category = %s ORDER BY created_at DESC",
            (category,)
        )
    else:
        cur.execute(
            "SELECT id, title, category, condition, description, author_name, city, contact, pickup, emoji, created_at, owner_email FROM books WHERE is_given = FALSE ORDER BY created_at DESC"
        )

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