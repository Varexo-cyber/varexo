-- Check if mohammed8130@gmail.com exists in the database
SELECT 
    email, 
    display_name, 
    is_admin, 
    provider, 
    deleted_at, 
    email_notifications,
    created_at
FROM users 
WHERE email LIKE '%mohammed8130%'
ORDER BY created_at DESC;
