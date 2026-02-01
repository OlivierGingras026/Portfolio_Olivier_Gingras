-- V22__update_admin_to_profroid.sql
-- Update admin account to use OG@Admin email
-- Password: OG_Portfolio142026$$ (bcrypt hashed)

UPDATE admins
SET email = 'OG@Admin',
    password = '$2a$12$TY69nIVgFLmxcjFhexnwT.zpZg2KTBxBzsX6NIOLtax9RpUM26Xgm'
WHERE email = 'admin@portfolio.com';
