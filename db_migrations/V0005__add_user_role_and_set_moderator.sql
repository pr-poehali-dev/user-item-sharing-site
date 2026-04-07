ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
UPDATE users SET role = 'moderator' WHERE email = 'tomilinmita@gmail.com';