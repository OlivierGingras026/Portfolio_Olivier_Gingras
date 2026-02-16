-- V22__update_admin_to_profroid.sql
-- Update admin account to use OG@Admin email
-- Password: OG_Portfolio142026$$ (bcrypt hashed)

UPDATE admins
SET email = 'OG@Admin',
    password = '$2b$10$adztoo1CeBxQTXGFmYPzPukTPBtLWu/Th1E6HY1FDhn4n3pj.elUS'
WHERE email = 'OG@Admin';
