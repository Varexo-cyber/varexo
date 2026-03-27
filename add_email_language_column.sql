-- Add email_language column to users table for bilingual email support
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_language VARCHAR(2) DEFAULT 'nl' CHECK (email_language IN ('nl', 'en'));

-- Update existing users to have Dutch as default language
UPDATE users 
SET email_language = 'nl' 
WHERE email_language IS NULL;
