import os
import json
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """Запросы на книги: POST — создать запрос, GET — получить уведомления владельца."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        book_id = body.get('book_id')
        book_title = body.get('book_title', '')
        requester_email = body.get('requester_email', '')
        requester_name = body.get('requester_name', '')
        owner_email = body.get('owner_email', '')

        if not all([book_id, requester_email, owner_email]):
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'missing fields'})}

        # Не создавать дубли — один пользователь, одна книга
        cur.execute(
            "SELECT id FROM book_requests WHERE book_id = %s AND requester_email = %s",
            (book_id, requester_email)
        )
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True, 'duplicate': True})}

        cur.execute(
            """INSERT INTO book_requests (book_id, book_title, requester_email, requester_name, owner_email)
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (book_id, book_title, requester_email, requester_name, owner_email)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 201, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True, 'id': new_id})}

    # GET — уведомления для владельца
    params = event.get('queryStringParameters') or {}
    owner_email = params.get('owner_email', '')
    if not owner_email:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'owner_email required'})}

    cur.execute(
        """SELECT id, book_id, book_title, requester_email, requester_name, is_read, created_at
           FROM book_requests WHERE owner_email = %s ORDER BY created_at DESC""",
        (owner_email,)
    )
    cols = ['id', 'book_id', 'book_title', 'requester_email', 'requester_name', 'is_read', 'created_at']
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    for r in rows:
        r['created_at'] = str(r['created_at'])

    # Отмечаем все как прочитанные
    cur.execute("UPDATE book_requests SET is_read = TRUE WHERE owner_email = %s AND is_read = FALSE", (owner_email,))
    conn.commit()
    cur.close(); conn.close()

    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(rows)}
