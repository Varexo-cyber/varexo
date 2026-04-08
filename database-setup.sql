-- Stap 1: Check welke tabellen je hebt
\dt

-- Stap 2: Als je een "users" tabel hebt (meest waarschijnlijk):
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_media_package VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_social_media BOOLEAN DEFAULT false;

-- Stap 3: Als je GEEN users tabel hebt, maak deze dan aan:
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  subscription VARCHAR(20),
  social_media_package VARCHAR(20),
  has_social_media BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
