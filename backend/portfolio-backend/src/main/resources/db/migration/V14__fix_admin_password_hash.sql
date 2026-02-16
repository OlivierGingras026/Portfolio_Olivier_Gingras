-- V14__fix_admin_password_hash.sql
-- Update the admin password hash to a version that works properly
-- This hash is BCrypt encoded "password" - test account

UPDATE admins
SET password = '$2a$10$dXJ3SW6G7P50eS3lUZtVO.cF0FGxGX7w5PoY2J6xYGcV7iUWlDvxu'
WHERE email = 'OG@Admin';

