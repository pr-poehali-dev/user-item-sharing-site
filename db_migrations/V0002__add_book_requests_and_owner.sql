
ALTER TABLE books ADD COLUMN IF NOT EXISTS owner_email TEXT;

CREATE TABLE IF NOT EXISTS book_requests (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL,
  book_title TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_requests_owner ON book_requests(owner_email);
CREATE INDEX IF NOT EXISTS idx_book_requests_book ON book_requests(book_id);
