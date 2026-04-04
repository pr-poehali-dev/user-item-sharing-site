import os
import json
import hashlib
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Регистрация, вход и обновление профиля. POST с action=register/login/update."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    # action=update обрабатываем отдельно — там пароль необязателен
    if action == 'update':
        new_name = (body.get('new_name') or '').strip()
        new_password = body.get('new_password') or ''
        current_password = body.get('current_password') or ''

        if not email or not current_password:
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'email и текущий пароль обязательны'})}

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        cur.execute("SELECT id, name FROM users WHERE email = %s AND password_hash = %s",
                    (email, hash_password(current_password)))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Неверный текущий пароль'})}

        updates = []
        params = []
        if new_name:
            updates.append("name = %s")
            params.append(new_name)
        if new_password:
            if len(new_password) < 6:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Новый пароль должен быть не менее 6 символов'})}
            updates.append("password_hash = %s")
            params.append(hash_password(new_password))

        if not updates:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Нечего обновлять'})}

        params.append(email)
        cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE email = %s RETURNING id, name, email", params)
        updated = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': updated[0], 'name': updated[1], 'email': updated[2]})}

    if not email or not password:
        return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'email и пароль обязательны'})}

    if len(password) < 6:
        return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if action == 'register':
        name = (body.get('name') or '').strip()
        if not name:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Введите ваше имя'})}

        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Пользователь с таким email уже существует'})}

        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email",
            (name, email, pw_hash)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 201, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': row[0], 'name': row[1], 'email': row[2]})}

    elif action == 'login':
        pw_hash = hash_password(password)
        cur.execute(
            "SELECT id, name, email FROM users WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'statusCode': 401, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})}
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': row[0], 'name': row[1], 'email': row[2]})}

    cur.close(); conn.close()
    return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Неизвестное действие'})}